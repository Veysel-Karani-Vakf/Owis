import { cmsPageContent } from '@/cms/adapters';
import type { Locale } from '@/i18n/content';

export type DonateCheckoutContent = {
  seo: { title: string; description: string };
  hero: { title: string; description: string };
  breadcrumbs: { home: string; donate: string };
  testBanner: { title: string; description: string };
  summary: { heading: string; publishedValue: string };
  amount: {
    heading: string;
    customLabel: string;
    customPlaceholder: string;
    currencyNote: string;
  };
  donor: {
    heading: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    optionalSuffix: string;
  };
  card: {
    heading: string;
    numberLabel: string;
    expiryLabel: string;
    cvvLabel: string;
    secureNote: string;
  };
  consentLabel: string;
  submitIdle: string;
  submitProcessing: string;
  redirectNote: string;
  testCards: {
    heading: string;
    description: string;
    approveLabel: string;
    fail3dsLabel: string;
    declineLabel: string;
  };
  errors: {
    amount: string;
    name: string;
    email: string;
    card: string;
    expiry: string;
    cvv: string;
    consent: string;
    unavailable: string;
    network: string;
    server: string;
  };
};

export type DonateResultContent = {
  seo: { title: string; description: string };
  loading: string;
  success: {
    title: string;
    description: string;
    testNote: string;
    amountLabel: string;
    referenceLabel: string;
    opportunityLabel: string;
    donorLabel: string;
  };
  failure: {
    title: string;
    description: string;
    reasonLabel: string;
    retry: string;
    contact: string;
  };
  notFound: {
    title: string;
    description: string;
  };
  backToDonate: string;
  home: string;
};

export const localizedDonateCheckout: Record<Locale, DonateCheckoutContent> = {
  ar: {
    seo: {
      title: 'إتمام المساهمة | وقف أويس القرني',
      description: 'صفحة الدفع الآمنة لإتمام المساهمة بالبطاقة عبر موقع وقف أويس القرني.',
    },
    hero: {
      title: 'إتمام المساهمة',
      description: 'أدخل مبلغ مساهمتك وبيانات البطاقة لإتمام الدفع عبر البوابة الآمنة.',
    },
    breadcrumbs: { home: 'الرئيسية', donate: 'ساهم الآن' },
    testBanner: {
      title: 'وضع تجريبي',
      description: 'البوابة تعمل حالياً في وضع الاختبار — لن يتم خصم أي مبلغ حقيقي من أي بطاقة.',
    },
    summary: { heading: 'ملخص المساهمة', publishedValue: 'القيمة المنشورة' },
    amount: {
      heading: 'مبلغ المساهمة',
      customLabel: 'أو أدخل مبلغاً آخر',
      customPlaceholder: 'مثال: 750',
      currencyNote: 'تتم معالجة المساهمات بالدولار الأمريكي (USD).',
    },
    donor: {
      heading: 'بيانات المساهم',
      nameLabel: 'الاسم الكامل',
      emailLabel: 'البريد الإلكتروني',
      phoneLabel: 'رقم الهاتف',
      optionalSuffix: '(اختياري)',
    },
    card: {
      heading: 'بيانات البطاقة',
      numberLabel: 'رقم البطاقة',
      expiryLabel: 'تاريخ الانتهاء (شهر/سنة)',
      cvvLabel: 'رمز الأمان CVV',
      secureNote: 'تُرسل بيانات البطاقة مباشرة إلى بوابة الدفع ولا تُخزَّن لدى الموقع.',
    },
    consentLabel: 'أوافق على معالجة بياناتي لغرض إتمام هذه المساهمة.',
    submitIdle: 'ادفع الآن',
    submitProcessing: 'جارٍ المعالجة…',
    redirectNote: 'بعد الضغط على «ادفع الآن» ستنتقل إلى صفحة التحقق (3-D Secure) لإكمال العملية.',
    testCards: {
      heading: 'بطاقات الاختبار',
      description: 'في الوضع التجريبي يمكنك استخدام أي رقم بطاقة صحيح، أو هذه الأرقام لتجربة الحالات:',
      approveLabel: 'نجاح (تختار النتيجة بنفسك)',
      fail3dsLabel: 'فشل التحقق 3-D Secure تلقائياً',
      declineLabel: 'رفض من البنك (رصيد غير كافٍ)',
    },
    errors: {
      amount: 'أدخل مبلغاً صحيحاً ضمن الحد المسموح.',
      name: 'أدخل الاسم الكامل (حرفان على الأقل).',
      email: 'أدخل بريداً إلكترونياً صحيحاً أو اترك الحقل فارغاً.',
      card: 'رقم البطاقة غير صحيح.',
      expiry: 'تاريخ الانتهاء غير صحيح أو منتهٍ.',
      cvv: 'رمز الأمان غير صحيح.',
      consent: 'الموافقة مطلوبة لإتمام الدفع.',
      unavailable: 'هذه الفرصة غير متاحة للمساهمة حالياً.',
      network: 'تعذّر الاتصال بخدمة الدفع؛ حاول مرة أخرى.',
      server: 'حدث خطأ غير متوقع أثناء تجهيز العملية؛ حاول مرة أخرى.',
    },
  },
  tr: {
    seo: {
      title: 'Katkiyi Tamamla | Veysel Karani Vakfi',
      description: 'Veysel Karani Vakfi sitesinde kartla katkiyi tamamlamak icin guvenli odeme sayfasi.',
    },
    hero: {
      title: 'Katkiyi Tamamla',
      description: 'Katki tutarinizi ve kart bilgilerinizi girerek guvenli odeme adimina gecin.',
    },
    breadcrumbs: { home: 'Ana Sayfa', donate: 'Simdi Katki Sun' },
    testBanner: {
      title: 'Test Modu',
      description: 'Odeme altyapisi su an test modundadir — hicbir karttan gercek tahsilat yapilmaz.',
    },
    summary: { heading: 'Katki Ozeti', publishedValue: 'Yayinlanan deger' },
    amount: {
      heading: 'Katki Tutari',
      customLabel: 'Veya baska bir tutar girin',
      customPlaceholder: 'Ornek: 750',
      currencyNote: 'Katkilar ABD Dolari (USD) olarak islenir.',
    },
    donor: {
      heading: 'Katki Sahibi Bilgileri',
      nameLabel: 'Ad Soyad',
      emailLabel: 'E-posta',
      phoneLabel: 'Telefon',
      optionalSuffix: '(istege bagli)',
    },
    card: {
      heading: 'Kart Bilgileri',
      numberLabel: 'Kart Numarasi',
      expiryLabel: 'Son Kullanma (AA/YY)',
      cvvLabel: 'Guvenlik Kodu CVV',
      secureNote: 'Kart bilgileri dogrudan odeme gecidine iletilir; sitede saklanmaz.',
    },
    consentLabel: 'Bu katkiyi tamamlamak icin bilgilerimin islenmesini onayliyorum.',
    submitIdle: 'Simdi Ode',
    submitProcessing: 'Isleniyor…',
    redirectNote: '"Simdi Ode" dedikten sonra islemi tamamlamak icin 3-D Secure dogrulama sayfasina yonlendirilirsiniz.',
    testCards: {
      heading: 'Test Kartlari',
      description: 'Test modunda gecerli herhangi bir kart numarasi kullanabilir veya su senaryolari deneyebilirsiniz:',
      approveLabel: 'Basari (sonucu siz secersiniz)',
      fail3dsLabel: '3-D Secure dogrulamasi otomatik basarisiz',
      declineLabel: 'Banka reddi (yetersiz bakiye)',
    },
    errors: {
      amount: 'Izin verilen aralikta gecerli bir tutar girin.',
      name: 'Ad soyad girin (en az 2 karakter).',
      email: 'Gecerli bir e-posta girin veya alani bos birakin.',
      card: 'Kart numarasi gecersiz.',
      expiry: 'Son kullanma tarihi gecersiz veya gecmis.',
      cvv: 'Guvenlik kodu gecersiz.',
      consent: 'Odeme icin onay gereklidir.',
      unavailable: 'Bu firsat su anda katkiya acik degil.',
      network: 'Odeme servisine ulasilamadi; lutfen tekrar deneyin.',
      server: 'Islem hazirlanirken beklenmeyen bir hata olustu; lutfen tekrar deneyin.',
    },
  },
  en: {
    seo: {
      title: 'Complete Your Contribution | Veysel Karani Waqf',
      description: 'Secure payment page for completing a card contribution on the Veysel Karani Waqf website.',
    },
    hero: {
      title: 'Complete Your Contribution',
      description: 'Enter your contribution amount and card details to continue to the secure payment step.',
    },
    breadcrumbs: { home: 'Home', donate: 'Contribute Now' },
    testBanner: {
      title: 'Test Mode',
      description: 'The payment gateway currently runs in test mode — no real charge is made to any card.',
    },
    summary: { heading: 'Contribution Summary', publishedValue: 'Published value' },
    amount: {
      heading: 'Contribution Amount',
      customLabel: 'Or enter another amount',
      customPlaceholder: 'e.g. 750',
      currencyNote: 'Contributions are processed in US Dollars (USD).',
    },
    donor: {
      heading: 'Contributor Details',
      nameLabel: 'Full name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      optionalSuffix: '(optional)',
    },
    card: {
      heading: 'Card Details',
      numberLabel: 'Card number',
      expiryLabel: 'Expiry (MM/YY)',
      cvvLabel: 'Security code CVV',
      secureNote: 'Card details are sent directly to the payment gateway and are never stored by the site.',
    },
    consentLabel: 'I agree to the processing of my details to complete this contribution.',
    submitIdle: 'Pay Now',
    submitProcessing: 'Processing…',
    redirectNote: 'After pressing "Pay Now" you will continue to the 3-D Secure verification page to complete the payment.',
    testCards: {
      heading: 'Test Cards',
      description: 'In test mode you can use any valid card number, or try these scenarios:',
      approveLabel: 'Success (you choose the outcome)',
      fail3dsLabel: '3-D Secure verification fails automatically',
      declineLabel: 'Bank decline (insufficient funds)',
    },
    errors: {
      amount: 'Enter a valid amount within the allowed range.',
      name: 'Enter the full name (at least 2 characters).',
      email: 'Enter a valid email or leave the field empty.',
      card: 'The card number is invalid.',
      expiry: 'The expiry date is invalid or in the past.',
      cvv: 'The security code is invalid.',
      consent: 'Consent is required to complete the payment.',
      unavailable: 'This opportunity is not open for contribution right now.',
      network: 'Could not reach the payment service; please try again.',
      server: 'An unexpected error occurred while preparing the payment; please try again.',
    },
  },
};

export const localizedDonateResult: Record<Locale, DonateResultContent> = {
  ar: {
    seo: {
      title: 'نتيجة عملية الدفع | وقف أويس القرني',
      description: 'نتيجة عملية الدفع عبر بوابة موقع وقف أويس القرني.',
    },
    loading: 'جارٍ التحقق من نتيجة العملية…',
    success: {
      title: 'تمت المساهمة بنجاح',
      description: 'شكراً لمساهمتك في وقف أويس القرني؛ وصلت عمليتك بنجاح.',
      testNote: 'هذه عملية تجريبية — لم يتم خصم أي مبلغ حقيقي.',
      amountLabel: 'المبلغ',
      referenceLabel: 'رقم التفويض',
      opportunityLabel: 'فرصة المساهمة',
      donorLabel: 'اسم المساهم',
    },
    failure: {
      title: 'لم تكتمل عملية الدفع',
      description: 'لم يتم خصم أي مبلغ. يمكنك المحاولة مرة أخرى أو التواصل معنا مباشرة.',
      reasonLabel: 'السبب',
      retry: 'إعادة المحاولة',
      contact: 'تواصل معنا',
    },
    notFound: {
      title: 'تعذّر العثور على العملية',
      description: 'لم نتمكن من التحقق من هذه العملية؛ إذا كنت قد أتممت الدفع فتواصل معنا للتأكد.',
    },
    backToDonate: 'العودة إلى فرص المساهمة',
    home: 'الرئيسية',
  },
  tr: {
    seo: {
      title: 'Odeme Sonucu | Veysel Karani Vakfi',
      description: 'Veysel Karani Vakfi sitesindeki odeme isleminin sonucu.',
    },
    loading: 'Islem sonucu dogrulaniyor…',
    success: {
      title: 'Katkiniz basariyla alindi',
      description: 'Veysel Karani Vakfina katkiniz icin tesekkur ederiz; isleminiz basariyla tamamlandi.',
      testNote: 'Bu bir test islemidir — gercek bir tahsilat yapilmadi.',
      amountLabel: 'Tutar',
      referenceLabel: 'Onay Kodu',
      opportunityLabel: 'Katki firsati',
      donorLabel: 'Katki Sahibi',
    },
    failure: {
      title: 'Odeme tamamlanamadi',
      description: 'Herhangi bir tahsilat yapilmadi. Tekrar deneyebilir veya bizimle iletisime gecebilirsiniz.',
      reasonLabel: 'Neden',
      retry: 'Tekrar Dene',
      contact: 'Iletisime Gec',
    },
    notFound: {
      title: 'Islem bulunamadi',
      description: 'Bu islemi dogrulayamadik; odemeyi tamamladiysaniz emin olmak icin bizimle iletisime gecin.',
    },
    backToDonate: 'Katki firsatlarina don',
    home: 'Ana Sayfa',
  },
  en: {
    seo: {
      title: 'Payment Result | Veysel Karani Waqf',
      description: 'The result of a payment made through the Veysel Karani Waqf website.',
    },
    loading: 'Verifying the payment result…',
    success: {
      title: 'Contribution received',
      description: 'Thank you for contributing to Veysel Karani Waqf; your payment was completed successfully.',
      testNote: 'This is a test transaction — no real charge was made.',
      amountLabel: 'Amount',
      referenceLabel: 'Auth code',
      opportunityLabel: 'Opportunity',
      donorLabel: 'Contributor',
    },
    failure: {
      title: 'The payment was not completed',
      description: 'Nothing was charged. You can try again or contact us directly.',
      reasonLabel: 'Reason',
      retry: 'Try Again',
      contact: 'Contact Us',
    },
    notFound: {
      title: 'Payment not found',
      description: 'We could not verify this payment; if you completed it, contact us to confirm.',
    },
    backToDonate: 'Back to contribution opportunities',
    home: 'Home',
  },
};

/** Both payment screens as one editable page (`donate-checkout` in the dashboard). */
export type DonateCheckoutPageContent = {
  checkout: DonateCheckoutContent;
  result: DonateResultContent;
};

export function staticDonateCheckoutPage(locale: Locale): DonateCheckoutPageContent {
  return { checkout: localizedDonateCheckout[locale], result: localizedDonateResult[locale] };
}

export function getDonateCheckoutContent(locale: Locale): DonateCheckoutContent {
  return cmsPageContent('donate-checkout', locale, staticDonateCheckoutPage(locale)).checkout;
}

export function getDonateResultContent(locale: Locale): DonateResultContent {
  return cmsPageContent('donate-checkout', locale, staticDonateCheckoutPage(locale)).result;
}
