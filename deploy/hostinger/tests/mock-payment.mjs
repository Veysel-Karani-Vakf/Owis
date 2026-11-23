// End-to-end test of the donation flow against the built-in mock bank:
// create -> card form -> 3-D challenge -> callback -> status, plus the ways a
// donor can back out (cancel on the card form, decline on the 3-D page).
//
//   BASE_URL=http://localhost node deploy/hostinger/tests/mock-payment.mjs
//
// It only ever runs against a local stack and refuses any other host, so it can
// never post a card number, even a test one, to a public environment. The card
// numbers are the mock bank's own test cards (api/_lib/mock.ts).

const base = (process.env.BASE_URL ?? 'http://localhost').replace(/\/+$/, '');
const { hostname } = new URL(base);
if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname)) {
  console.error(`Refusing to run against ${hostname}: this test is for local stacks only.`);
  process.exit(2);
}

const APPROVE_CARD = '4508034508034509';
const DECLINE_CARD = '4242424242080069';
const CALLBACK_URL = `${base}/api/payments/callback`;
const expiry = `12/${String((new Date().getFullYear() + 3) % 100).padStart(2, '0')}`;

let failures = 0;
function check(label, condition, detail = '') {
  if (condition) {
    console.log(`ok    ${label}`);
  } else {
    failures += 1;
    console.log(`::error::${label}${detail ? `: ${detail}` : ''}`);
  }
}

const unescapeHtml = (value) =>
  value
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const attribute = (tag, name) => unescapeHtml((tag.match(new RegExp(`${name}="([^"]*)"`, 'i')) ?? [])[1] ?? '');

/** Every <form> in a page with its action, its hidden fields and its inner HTML. */
function parseForms(html) {
  return [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)].map(([, attrs, inner]) => ({
    action: attribute(attrs, 'action'),
    inner,
    fields: Object.fromEntries(
      [...inner.matchAll(/<input\b[^>]*type="hidden"[^>]*>/gi)].map(([tag]) => [
        attribute(tag, 'name'),
        attribute(tag, 'value'),
      ]),
    ),
  }));
}

function postForm(url, fields) {
  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
    redirect: 'manual',
  });
}

async function paymentStatus(oid) {
  const response = await fetch(`${base}/api/payments/status?oid=${oid}`);
  const body = await response.json();
  return body.payment ?? {};
}

/** Creates a pending donation and opens the mock bank's card form for it. */
async function startPayment(label) {
  // create() reads the live USD/TRY rate from the bank's public rates page and
  // answers 500 when that page does not reply. From a CI runner that happens
  // now and then, so a 500 is retried a few times before it counts as a failure.
  let created;
  let body = {};
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    created = await fetch(`${base}/api/payments/create`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        amount: 25,
        locale: 'en',
        titleSnapshot: 'CI test donation',
        donor: { name: 'CI Tester', email: 'ci-tester@example.test' },
      }),
    });
    body = await created.json().catch(() => ({}));
    if (created.status !== 500 || attempt === 5) break;
    console.log(`note  ${label}: create answered 500 (attempt ${attempt} of 5), trying again`);
    await new Promise((resolve) => setTimeout(resolve, 8000));
  }
  if (!created.ok || !body.ok) {
    throw new Error(`${label}: create returned ${created.status} ${JSON.stringify(body)}`);
  }
  check(`${label}: donation created`, /^[0-9a-f]{32}$/.test(body.oid) && body.gateUrl === `${base}/api/payments/mock-gate`, body.gateUrl);

  const cardForm = await postForm(body.gateUrl, body.fields);
  const cardFormHtml = await cardForm.text();
  check(`${label}: mock bank shows its card form`, cardForm.status === 200 && cardFormHtml.includes('name="pan"'));
  check(`${label}: record is pending`, (await paymentStatus(body.oid)).status === 'pending');
  return { ...body, cardFormHtml };
}

/** The form behind the bank's red "cancel / decline" button on a page. */
const backOutForm = (html) => parseForms(html).find((form) => form.inner.includes('class="decline"'));

function submitCard(payment, pan) {
  return postForm(payment.gateUrl, { ...payment.fields, pan, cardHolderName: 'CI TESTER', expiry, cv2: '123' });
}

async function approvedPayment() {
  const payment = await startPayment('approve');
  const challenge = await submitCard(payment, APPROVE_CARD);
  const approveForm = parseForms(await challenge.text()).find((form) => form.inner.includes('class="approve"'));
  check('approve: 3-D challenge page offers approval', Boolean(approveForm) && approveForm.action === CALLBACK_URL, approveForm?.action);
  if (!approveForm) return;

  const callback = await postForm(approveForm.action, approveForm.fields);
  const location = callback.headers.get('location') ?? '';
  check('approve: callback redirects to the result page', callback.status === 303 && location.includes(`/donate/result?oid=${payment.oid}`) && !location.includes('error='), location);

  const paid = await paymentStatus(payment.oid);
  check('approve: record is paid in mock mode', paid.status === 'paid' && paid.mode === 'mock' && Boolean(paid.authCode), JSON.stringify(paid));

  // The bank may deliver the same callback twice; the donation must be counted once.
  const replay = await postForm(approveForm.action, approveForm.fields);
  const afterReplay = await paymentStatus(payment.oid);
  check('approve: a repeated callback changes nothing', replay.status === 303 && afterReplay.status === 'paid' && afterReplay.authCode === paid.authCode);

  // Nor may a late "cancelled" callback for the same order undo a paid donation.
  const lateCancel = backOutForm(payment.cardFormHtml);
  if (lateCancel) {
    await postForm(lateCancel.action, lateCancel.fields);
    const afterCancel = await paymentStatus(payment.oid);
    check('approve: a late cancel does not undo a paid donation', afterCancel.status === 'paid' && afterCancel.authCode === paid.authCode, JSON.stringify(afterCancel));
  }
}

async function tamperedCallback() {
  const payment = await startPayment('tamper');
  const challenge = await submitCard(payment, APPROVE_CARD);
  const approveForm = parseForms(await challenge.text()).find((form) => form.inner.includes('class="approve"'));
  if (!approveForm) {
    check('tamper: challenge page', false);
    return;
  }
  const forged = await postForm(approveForm.action, { ...approveForm.fields, amount: '1.00' });
  const location = forged.headers.get('location') ?? '';
  check('tamper: a callback with a changed amount is rejected', forged.status === 303 && location.includes('error=verify'), location);
  check('tamper: record stays pending', (await paymentStatus(payment.oid)).status === 'pending');
}

async function declinedPayment() {
  const payment = await startPayment('decline');
  const page = await submitCard(payment, DECLINE_CARD);
  const [declineForm] = parseForms(await page.text());
  check('decline: bank returns to the site', Boolean(declineForm) && declineForm.action === CALLBACK_URL, declineForm?.action);
  if (!declineForm) return;
  const callback = await postForm(declineForm.action, declineForm.fields);
  const failed = await paymentStatus(payment.oid);
  check('decline: record is failed, not paid', callback.status === 303 && failed.status === 'failed', JSON.stringify(failed));
}

async function cancelledOnCardForm() {
  const payment = await startPayment('cancel');
  const cancelForm = backOutForm(payment.cardFormHtml);
  check('cancel: card form offers a way back to the site', Boolean(cancelForm) && cancelForm.action === CALLBACK_URL, cancelForm?.action);
  if (!cancelForm) return;
  const callback = await postForm(cancelForm.action, cancelForm.fields);
  const location = callback.headers.get('location') ?? '';
  check('cancel: donor lands on the result page', callback.status === 303 && location.includes(`/donate/result?oid=${payment.oid}`), location);
  const cancelled = await paymentStatus(payment.oid);
  check('cancel: record is failed, not paid', cancelled.status === 'failed' && !cancelled.authCode, JSON.stringify(cancelled));
}

async function declinedOnChallenge() {
  const payment = await startPayment('3-D decline');
  const challenge = await submitCard(payment, APPROVE_CARD);
  const declineForm = backOutForm(await challenge.text());
  check('3-D decline: challenge page offers a decline button', Boolean(declineForm) && declineForm.action === CALLBACK_URL, declineForm?.action);
  if (!declineForm) return;
  const callback = await postForm(declineForm.action, declineForm.fields);
  const declined = await paymentStatus(payment.oid);
  check('3-D decline: record is failed, not paid', callback.status === 303 && declined.status === 'failed' && !declined.authCode, JSON.stringify(declined));
}

try {
  await approvedPayment();
  await tamperedCallback();
  await declinedPayment();
  await cancelledOnCardForm();
  await declinedOnChallenge();
} catch (error) {
  failures += 1;
  console.log(`::error::${error instanceof Error ? error.message : String(error)}`);
}

if (failures > 0) {
  console.log(`${failures} payment check(s) failed`);
  process.exit(1);
}
console.log('Mock payment flow passed.');
