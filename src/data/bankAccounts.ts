import { cmsBankAccounts, cmsPageContent } from '@/cms/adapters';
import type { BreadcrumbItem } from '@/data/about';
import type { Locale } from '@/i18n/content';
import bankAccountsHeroImage from '@/assets/donate/waqf-share-hero.jpg';

export const bankAccountsRoute = '/bank-accounts';

export type BankCurrency = 'TRY' | 'USD' | 'EUR' | 'SAR';

export type BankAccount = {
  currency: BankCurrency;
  /** IBAN without spaces; the page formats it in groups of four. */
  iban: string;
  /** Plain account number when the bank publishes one separately from the IBAN. */
  accountNumber?: string;
};

export type Bank = {
  id: string;
  name: string;
  /** Short monogram shown in the bank badge when the logo fails to load. */
  monogram: string;
  /** Wordmark logo (SVG under public/media/banks). */
  logo: string;
  /** Brand colour used for the badge and card accent. */
  brandColor: string;
  branch: string;
  swift?: string;
  /** Bank-wide customer/account number, when it is shared across currencies. */
  accountNumber?: string;
  accounts: BankAccount[];
};

export type BankAccountsPageContent = {
  seo: {
    title: string;
    description: string;
    canonical?: string;
  };
  hero: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  breadcrumbs: BreadcrumbItem[];
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  labels: {
    accountHolder: string;
    accountNumber: string;
    branch: string;
    swift: string;
    iban: string;
    copy: string;
    copied: string;
    copyAll: string;
    currencies: Record<BankCurrency, string>;
    notice: string;
    contactPrompt: string;
    contactCta: string;
  };
  /** Exact name the accounts are registered under; identical in every language. */
  accountHolder: string;
  banks: Bank[];
};

export const accountHolder = 'VEYSEL KARANİ TÜRK YEMENİ SAİD VAKFI';

/** @deprecated Bank records live in Supabase. Kept empty for legacy seed-module compatibility. */
export const banks: Bank[] = [];

const breadcrumbHome: Record<Locale, string> = { ar: 'الرئيسية', tr: 'Ana Sayfa', en: 'Home' };

export const localizedBankAccountsContent: Record<Locale, BankAccountsPageContent> = {
  ar: {
    seo: {
      title: 'الحسابات البنكية | وقف أويس القرني',
      description:
        'الحسابات البنكية الرسمية لوقف أويس القرني في تركيا بالليرة التركية والدولار واليورو والريال السعودي، مع أرقام الآيبان ورموز SWIFT.',
    },
    hero: {
      title: 'الحسابات البنكية',
      description:
        'جميع الحسابات المصرفية الرسمية للوقف مسجّلة باسم الوقف نفسه. اختر البنك والعملة المناسبين، وانسخ رقم الآيبان مباشرة.',
      image: bankAccountsHeroImage,
      imageAlt: 'الحسابات البنكية لوقف أويس القرني',
    },
    breadcrumbs: [{ label: breadcrumbHome.ar, href: '/' }, { label: 'الحسابات البنكية' }],
    intro: {
      eyebrow: 'طرق المساهمة',
      title: 'ساهم عبر التحويل البنكي',
      paragraphs: [
        'يستقبل الوقف المساهمات عبر ستة بنوك تركية بأربع عملات. تأكد من مطابقة اسم صاحب الحساب قبل إتمام التحويل.',
        'للتحويلات الدولية استخدم رقم الآيبان (IBAN) مع رمز SWIFT الخاص بالبنك، واذكر في وصف التحويل الغرض من مساهمتك إن رغبت.',
      ],
    },
    labels: {
      accountHolder: 'اسم الحساب',
      accountNumber: 'رقم الحساب',
      branch: 'فرع البنك',
      swift: 'رمز SWIFT',
      iban: 'رقم الآيبان',
      copy: 'نسخ',
      copied: 'تم النسخ',
      copyAll: 'نسخ بيانات البنك',
      currencies: { TRY: 'الليرة التركية', USD: 'الدولار الأمريكي', EUR: 'اليورو', SAR: 'الريال السعودي' },
      notice: 'هذه هي الحسابات الرسمية الوحيدة للوقف؛ لا نعتمد أي حساب آخر أو وسيط.',
      contactPrompt: 'هل تحتاج إلى إيصال أو تأكيد لمساهمتك؟',
      contactCta: 'تواصل معنا',
    },
    accountHolder,
    banks: [],
  },
  tr: {
    seo: {
      title: 'Banka Hesapları | Veysel Karani Vakfı',
      description:
        'Veysel Karani Vakfı’nın Türkiye’deki resmi banka hesapları: TL, USD, EUR ve SAR IBAN numaraları ile SWIFT kodları.',
    },
    hero: {
      title: 'Banka Hesapları',
      description:
        'Vakfın tüm resmi banka hesapları vakfın kendi adına kayıtlıdır. Uygun bankayı ve para birimini seçin, IBAN’ı doğrudan kopyalayın.',
      image: bankAccountsHeroImage,
      imageAlt: 'Veysel Karani Vakfı banka hesapları',
    },
    breadcrumbs: [{ label: breadcrumbHome.tr, href: '/' }, { label: 'Banka Hesapları' }],
    intro: {
      eyebrow: 'Katkı Yolları',
      title: 'Banka havalesiyle katkı sunun',
      paragraphs: [
        'Vakıf, altı Türk bankasında dört para biriminde katkı kabul eder. Havaleyi tamamlamadan önce hesap sahibi adının eşleştiğinden emin olun.',
        'Uluslararası transferlerde IBAN numarasını bankanın SWIFT koduyla birlikte kullanın; dilerseniz açıklama alanına katkınızın amacını yazın.',
      ],
    },
    labels: {
      accountHolder: 'Hesap Adı',
      accountNumber: 'Hesap Numarası',
      branch: 'Şube',
      swift: 'SWIFT Kodu',
      iban: 'IBAN',
      copy: 'Kopyala',
      copied: 'Kopyalandı',
      copyAll: 'Banka bilgilerini kopyala',
      currencies: { TRY: 'Türk Lirası', USD: 'ABD Doları', EUR: 'Euro', SAR: 'Suudi Riyali' },
      notice: 'Bunlar vakfın tek resmi hesaplarıdır; başka hesap veya aracı kabul edilmez.',
      contactPrompt: 'Katkınız için makbuz veya teyit mi gerekiyor?',
      contactCta: 'Bize ulaşın',
    },
    accountHolder,
    banks: [],
  },
  en: {
    seo: {
      title: 'Bank Accounts | Veysel Karani Waqf',
      description:
        'Official bank accounts of Veysel Karani Waqf in Türkiye: TRY, USD, EUR and SAR IBANs with SWIFT codes.',
    },
    hero: {
      title: 'Bank Accounts',
      description:
        'Every official account is registered in the name of the waqf itself. Pick the bank and currency that suit you, and copy the IBAN directly.',
      image: bankAccountsHeroImage,
      imageAlt: 'Veysel Karani Waqf bank accounts',
    },
    breadcrumbs: [{ label: breadcrumbHome.en, href: '/' }, { label: 'Bank Accounts' }],
    intro: {
      eyebrow: 'Ways to Contribute',
      title: 'Contribute by bank transfer',
      paragraphs: [
        'The waqf receives contributions through six Turkish banks in four currencies. Make sure the account holder name matches before completing the transfer.',
        'For international transfers use the IBAN together with the bank’s SWIFT code, and mention the purpose of your contribution in the reference if you wish.',
      ],
    },
    labels: {
      accountHolder: 'Account Name',
      accountNumber: 'Account Number',
      branch: 'Branch',
      swift: 'SWIFT Code',
      iban: 'IBAN',
      copy: 'Copy',
      copied: 'Copied',
      copyAll: 'Copy bank details',
      currencies: { TRY: 'Turkish Lira', USD: 'US Dollar', EUR: 'Euro', SAR: 'Saudi Riyal' },
      notice: 'These are the only official accounts of the waqf; no other account or intermediary is authorised.',
      contactPrompt: 'Need a receipt or confirmation for your contribution?',
      contactCta: 'Contact us',
    },
    accountHolder,
    banks: [],
  },
};

export function formatIban(iban: string): string {
  return iban.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
}

export function getBankAccountsContent(locale: Locale): BankAccountsPageContent {
  // Texts come from the `bank-accounts-page` site page; the banks themselves
  // from the `bank_accounts` table (one shared list — IBANs have no language).
  const content = cmsPageContent('bank-accounts-page', locale, localizedBankAccountsContent[locale]);
  return { ...content, banks: cmsBankAccounts<Bank>() };
}
