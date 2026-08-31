// The simulated bank: page templates and test-card behaviors for the mock
// 3-D Secure gateway. Looks bank-ish on purpose, but is loudly labeled as a
// test environment in every language.
import { escapeHtml } from './http';

export type MockLang = 'tr' | 'en';

/** How the mock bank treats a card number (digits only, already Luhn-valid). */
export type MockCardBehavior = 'challenge' | 'fail-3ds' | 'decline-51';

export function mockCardBehavior(pan: string): MockCardBehavior {
  if (pan.endsWith('0002')) return 'fail-3ds';
  if (pan.endsWith('0069')) return 'decline-51';
  return 'challenge';
}

const STRINGS: Record<
  MockLang,
  {
    title: string;
    banner: string;
    verifying: string;
    amountLabel: string;
    orderLabel: string;
    cardLabel: string;
    prompt: string;
    approve: string;
    decline: string;
    redirecting: string;
    continueButton: string;
    errorTitle: string;
  }
> = {
  tr: {
    title: '3-D Secure Doğrulama — TEST',
    banner: 'TEST ORTAMI — Gerçek bir ödeme alınmaz',
    verifying: 'Kart doğrulama simülasyonu',
    amountLabel: 'Tutar',
    orderLabel: 'Sipariş No',
    cardLabel: 'Kart',
    prompt: 'Gerçek bankada burada SMS şifresi sorulur. Test ortamında sonucu siz seçin:',
    approve: 'Ödemeyi Onayla',
    decline: 'Ödemeyi Reddet',
    redirecting: 'Bankadan siteye geri yönlendiriliyorsunuz…',
    continueButton: 'Devam Et',
    errorTitle: 'İşlem gerçekleştirilemedi',
  },
  en: {
    title: '3-D Secure Verification — TEST',
    banner: 'TEST ENVIRONMENT — No real charge is made',
    verifying: 'Card verification simulation',
    amountLabel: 'Amount',
    orderLabel: 'Order ID',
    cardLabel: 'Card',
    prompt: 'A real bank would ask for an SMS code here. In the test environment, you choose the outcome:',
    approve: 'Approve Payment',
    decline: 'Decline Payment',
    redirecting: 'Redirecting you back from the bank to the site…',
    continueButton: 'Continue',
    errorTitle: 'The transaction could not be processed',
  },
};

export function mockLang(value: string | undefined): MockLang {
  return value === 'tr' ? 'tr' : 'en';
}

function hiddenInputs(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([name, value]) => `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`)
    .join('\n        ');
}

function pageShell(lang: MockLang, body: string): string {
  const t = STRINGS[lang];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(t.title)}</title>
<style>
  body { margin: 0; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; background: #f1f3f7; color: #1b2430; }
  .banner { background: #b45309; color: #fff; text-align: center; font-weight: 700; padding: 10px 16px; letter-spacing: .02em; }
  .wrap { max-width: 430px; margin: 40px auto; padding: 0 16px; }
  .card { background: #fff; border-radius: 14px; box-shadow: 0 14px 40px rgba(15, 30, 60, .12); overflow: hidden; }
  .head { background: #10316b; color: #fff; padding: 18px 22px; font-weight: 700; }
  .body { padding: 22px; }
  .row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eef1f6; font-size: 14px; }
  .row b { font-variant-numeric: tabular-nums; }
  .prompt { margin: 18px 0 14px; font-size: 14px; line-height: 1.5; color: #45536b; }
  .actions { display: grid; gap: 10px; }
  button { cursor: pointer; border: 0; border-radius: 10px; padding: 13px 16px; font-size: 15px; font-weight: 700; }
  .approve { background: #15803d; color: #fff; }
  .decline { background: #b91c1c; color: #fff; }
  .plain { background: #10316b; color: #fff; }
  .note { margin-top: 16px; font-size: 12px; color: #8a94a6; text-align: center; }
</style>
</head>
<body>
<div class="banner">${escapeHtml(t.banner)}</div>
<div class="wrap">
  <div class="card">
    <div class="head">${escapeHtml(t.verifying)}</div>
    <div class="body">
${body}
    </div>
  </div>
  <p class="note">Veysel Karani Vakfı — mock virtual POS</p>
</div>
</body>
</html>`;
}

export function challengePage(input: {
  lang: MockLang;
  amountLabelValue: string;
  oid: string;
  maskedPan: string;
  okUrl: string;
  failUrl: string;
  approveFields: Record<string, string>;
  declineFields: Record<string, string>;
}): string {
  const t = STRINGS[input.lang];
  const body = `
      <div class="row"><span>${escapeHtml(t.amountLabel)}</span><b>${escapeHtml(input.amountLabelValue)}</b></div>
      <div class="row"><span>${escapeHtml(t.orderLabel)}</span><b>${escapeHtml(input.oid)}</b></div>
      <div class="row"><span>${escapeHtml(t.cardLabel)}</span><b>${escapeHtml(input.maskedPan)}</b></div>
      <p class="prompt">${escapeHtml(t.prompt)}</p>
      <div class="actions">
        <form method="post" action="${escapeHtml(input.okUrl)}">
        ${hiddenInputs(input.approveFields)}
          <button type="submit" class="approve" style="width:100%">${escapeHtml(t.approve)}</button>
        </form>
        <form method="post" action="${escapeHtml(input.failUrl)}">
        ${hiddenInputs(input.declineFields)}
          <button type="submit" class="decline" style="width:100%">${escapeHtml(t.decline)}</button>
        </form>
      </div>`;
  return pageShell(input.lang, body);
}

/** Used by the auto-outcome test cards: posts the signed result immediately. */
export function autoSubmitPage(input: {
  lang: MockLang;
  targetUrl: string;
  fields: Record<string, string>;
}): string {
  const t = STRINGS[input.lang];
  const body = `
      <p class="prompt">${escapeHtml(t.redirecting)}</p>
      <form method="post" action="${escapeHtml(input.targetUrl)}" id="mock-redirect">
      ${hiddenInputs(input.fields)}
        <noscript><button type="submit" class="plain" style="width:100%">${escapeHtml(t.continueButton)}</button></noscript>
      </form>
      <script>document.getElementById('mock-redirect').submit();</script>`;
  return pageShell(input.lang, body);
}

export function gateErrorPage(lang: MockLang, message: string): string {
  const t = STRINGS[lang];
  const body = `
      <p class="prompt"><strong>${escapeHtml(t.errorTitle)}</strong></p>
      <p class="prompt">${escapeHtml(message)}</p>`;
  return pageShell(lang, body);
}
