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
    payTitle: string;
    amountLabel: string;
    orderLabel: string;
    cardLabel: string;
    prompt: string;
    approve: string;
    decline: string;
    redirecting: string;
    continueButton: string;
    errorTitle: string;
    cardNumberLabel: string;
    cardHolderLabel: string;
    expiryLabel: string;
    cvvLabel: string;
    payButton: string;
    cancelButton: string;
    secureNote: string;
    cardInvalid: string;
    expiryInvalid: string;
    cvvInvalid: string;
    testCardsHint: string;
  }
> = {
  tr: {
    title: '3-D Secure Doğrulama — TEST',
    banner: 'TEST ORTAMI — Gerçek bir ödeme alınmaz',
    verifying: 'Kart doğrulama simülasyonu',
    payTitle: 'Güvenli Ödeme — Sanal POS',
    amountLabel: 'Tutar',
    orderLabel: 'Sipariş No',
    cardLabel: 'Kart',
    prompt: 'Gerçek bankada burada SMS şifresi sorulur. Test ortamında sonucu siz seçin:',
    approve: 'Ödemeyi Onayla',
    decline: 'Ödemeyi Reddet',
    redirecting: 'Bankadan siteye geri yönlendiriliyorsunuz…',
    continueButton: 'Devam Et',
    errorTitle: 'İşlem gerçekleştirilemedi',
    cardNumberLabel: 'Kart Numarası',
    cardHolderLabel: 'Kart Üzerindeki İsim',
    expiryLabel: 'Son Kullanma (AA/YY)',
    cvvLabel: 'CVV',
    payButton: 'Ödemeyi Tamamla',
    cancelButton: 'Vazgeç',
    secureNote: 'Kart bilgileriniz banka sayfasında girilir, üye işyerine iletilmez.',
    cardInvalid: 'Kart numarası geçersiz.',
    expiryInvalid: 'Son kullanma tarihi geçersiz.',
    cvvInvalid: 'CVV geçersiz.',
    testCardsHint: 'Test kartları: 4508 0345 0803 4509 (onay) · 4000 0000 0000 0002 (3-D hatası) · 4242 4242 4208 0069 (red)',
  },
  en: {
    title: '3-D Secure Verification — TEST',
    banner: 'TEST ENVIRONMENT — No real charge is made',
    verifying: 'Card verification simulation',
    payTitle: 'Secure Payment — Virtual POS',
    amountLabel: 'Amount',
    orderLabel: 'Order ID',
    cardLabel: 'Card',
    prompt: 'A real bank would ask for an SMS code here. In the test environment, you choose the outcome:',
    approve: 'Approve Payment',
    decline: 'Decline Payment',
    redirecting: 'Redirecting you back from the bank to the site…',
    continueButton: 'Continue',
    errorTitle: 'The transaction could not be processed',
    cardNumberLabel: 'Card Number',
    cardHolderLabel: 'Name on Card',
    expiryLabel: 'Expiry (MM/YY)',
    cvvLabel: 'CVV',
    payButton: 'Complete Payment',
    cancelButton: 'Cancel',
    secureNote: 'Your card details are entered on the bank page and are never sent to the merchant.',
    cardInvalid: 'The card number is invalid.',
    expiryInvalid: 'The expiry date is invalid.',
    cvvInvalid: 'The CVV is invalid.',
    testCardsHint: 'Test cards: 4508 0345 0803 4509 (approve) · 4000 0000 0000 0002 (3-D failure) · 4242 4242 4208 0069 (decline)',
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

function pageShell(lang: MockLang, body: string, heading?: string): string {
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
  .wrap { max-width: 460px; margin: 40px auto; padding: 0 16px; }
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
  label { display: block; margin: 14px 0 6px; font-size: 13px; font-weight: 700; color: #33415c; }
  input[type=text] { width: 100%; box-sizing: border-box; border: 1px solid #cfd7e6; border-radius: 10px; padding: 12px 14px; font-size: 15px; font-family: inherit; color: #1b2430; }
  input[type=text]:focus { outline: 0; border-color: #10316b; box-shadow: 0 0 0 3px rgba(16, 49, 107, .12); }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .err { margin: 10px 0 0; padding: 10px 12px; border-radius: 10px; background: #fee2e2; color: #991b1b; font-size: 13px; font-weight: 600; }
  .hint { margin-top: 14px; font-size: 12px; line-height: 1.6; color: #64748b; }
  .secure { margin-top: 14px; font-size: 12px; line-height: 1.6; color: #15803d; font-weight: 600; }
</style>
</head>
<body>
<div class="banner">${escapeHtml(t.banner)}</div>
<div class="wrap">
  <div class="card">
    <div class="head">${escapeHtml(heading ?? t.verifying)}</div>
    <div class="body">
${body}
    </div>
  </div>
  <p class="note">Veysel Karani Vakfı — mock virtual POS</p>
</div>
</body>
</html>`;
}

/** Which validation message the hosted card form shows above the fields. */
export type CardEntryError = 'cardInvalid' | 'expiryInvalid' | 'cvvInvalid';

/**
 * The bank's own card-entry page (3d_pay_hosting): the donor lands here from
 * our checkout with only the signed order fields, and types the PAN on this
 * page — i.e. on the bank's domain, never on ours. The signed order fields
 * ride along as hidden inputs so the posted card can be re-validated against
 * the same order.
 */
export function cardEntryPage(input: {
  lang: MockLang;
  amountLabelValue: string;
  oid: string;
  actionUrl: string;
  cancelUrl: string;
  orderFields: Record<string, string>;
  cancelFields: Record<string, string>;
  values?: { pan?: string; holder?: string; expiry?: string; cvv?: string };
  error?: CardEntryError;
}): string {
  const t = STRINGS[input.lang];
  const values = input.values ?? {};
  const errorMessage = input.error ? t[input.error] : '';
  const body = `
      <div class="row"><span>${escapeHtml(t.amountLabel)}</span><b>${escapeHtml(input.amountLabelValue)}</b></div>
      <div class="row"><span>${escapeHtml(t.orderLabel)}</span><b>${escapeHtml(input.oid)}</b></div>
      ${errorMessage ? `<p class="err">${escapeHtml(errorMessage)}</p>` : ''}
      <form method="post" action="${escapeHtml(input.actionUrl)}">
      ${hiddenInputs(input.orderFields)}
        <label for="pan">${escapeHtml(t.cardNumberLabel)}</label>
        <input id="pan" name="pan" type="text" inputmode="numeric" autocomplete="cc-number"
               maxlength="23" placeholder="0000 0000 0000 0000" required value="${escapeHtml(values.pan ?? '')}">
        <label for="holder">${escapeHtml(t.cardHolderLabel)}</label>
        <input id="holder" name="cardHolderName" type="text" autocomplete="cc-name" maxlength="60" value="${escapeHtml(values.holder ?? '')}">
        <div class="pair">
          <div>
            <label for="expiry">${escapeHtml(t.expiryLabel)}</label>
            <input id="expiry" name="expiry" type="text" inputmode="numeric" autocomplete="cc-exp"
                   maxlength="5" placeholder="MM/YY" required value="${escapeHtml(values.expiry ?? '')}">
          </div>
          <div>
            <label for="cv2">${escapeHtml(t.cvvLabel)}</label>
            <input id="cv2" name="cv2" type="text" inputmode="numeric" autocomplete="cc-csc"
                   maxlength="4" placeholder="123" required value="${escapeHtml(values.cvv ?? '')}">
          </div>
        </div>
        <div class="actions" style="margin-top:18px">
          <button type="submit" class="approve" style="width:100%">${escapeHtml(t.payButton)}</button>
        </div>
      </form>
      <form method="post" action="${escapeHtml(input.cancelUrl)}">
      ${hiddenInputs(input.cancelFields)}
        <div class="actions" style="margin-top:10px">
          <button type="submit" class="decline" style="width:100%">${escapeHtml(t.cancelButton)}</button>
        </div>
      </form>
      <p class="secure">${escapeHtml(t.secureNote)}</p>
      <p class="hint">${escapeHtml(t.testCardsHint)}</p>
      <script>
        (function () {
          var pan = document.getElementById('pan');
          var exp = document.getElementById('expiry');
          var cvv = document.getElementById('cv2');
          pan.addEventListener('input', function () {
            var d = pan.value.replace(/\\D/g, '').slice(0, 19);
            pan.value = d.replace(/(\\d{4})(?=\\d)/g, '$1 ');
          });
          exp.addEventListener('input', function () {
            var d = exp.value.replace(/\\D/g, '').slice(0, 4);
            exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
          });
          cvv.addEventListener('input', function () {
            cvv.value = cvv.value.replace(/\\D/g, '').slice(0, 4);
          });
        })();
      </script>`;
  return pageShell(input.lang, body, t.payTitle);
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
