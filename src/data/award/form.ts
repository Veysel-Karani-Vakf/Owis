import { cmsPageContent } from '@/cms/adapters';
import type { Locale } from '@/i18n/content';
import { AWARD_PAGE_KEY } from './content';

/*
 * Owais Volunteer Award 2026 — nomination form.
 *
 * The four Arabic impact questions, their word limits and the Yemeni-team /
 * 12-month conditions come from the award's official requirements; the en/tr
 * strings are translations of them. The photo attachments are optional: they
 * are not a requirement of the official document. The same limits are enforced
 * again by the server (api/_lib/awardRules.ts); `npm run test:award` fails
 * when the two copies drift apart.
 */

export type ApplyStepId = 'basic' | 'details' | 'impact' | 'review';
export const applySteps: ApplyStepId[] = ['basic', 'details', 'impact', 'review'];

export type ImpactId = 'idea' | 'results' | 'team' | 'sustainability';
export const impactIds: ImpactId[] = ['idea', 'results', 'team', 'sustainability'];

export type CategoryValue = 'education' | 'health' | 'environment' | 'empowerment' | 'other';
export const categoryValues: CategoryValue[] = ['education', 'health', 'environment', 'empowerment', 'other'];

export type PlatformId =
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'youtube'
  | 'linkedin'
  | 'telegram'
  | 'whatsapp'
  | 'snapchat'
  | 'other';
export const platformIds: PlatformId[] = [
  'facebook',
  'instagram',
  'x',
  'tiktok',
  'youtube',
  'linkedin',
  'telegram',
  'whatsapp',
  'snapchat',
  'other',
];

/** Hosts each platform's links live on (subdomains such as m. or www. are accepted). */
export const platformDomains: Record<Exclude<PlatformId, 'other'>, string[]> = {
  facebook: ['facebook.com', 'fb.com', 'fb.me'],
  instagram: ['instagram.com', 'instagr.am'],
  x: ['x.com', 'twitter.com'],
  tiktok: ['tiktok.com'],
  youtube: ['youtube.com', 'youtu.be'],
  linkedin: ['linkedin.com'],
  telegram: ['t.me', 'telegram.me', 'telegram.org'],
  whatsapp: ['whatsapp.com', 'wa.me'],
  snapchat: ['snapchat.com'],
};

export const awardFormRules = {
  /** Official word limits of the four impact answers. */
  wordLimits: { idea: 50, results: 50, team: 75, sustainability: 50 } as Record<ImpactId, number>,
  /** Official condition: implemented inside Yemen within the previous 12 months. */
  windowMonths: 12,
  /** How many years back the period selects reach. */
  yearsBack: 15,
  minSocialPlatforms: 2,
  maxSocialRows: 8,
  maxTeamSize: 10000,
  maxTextLength: 120,
  /** Optional supporting photos (not a requirement of the official document). */
  images: {
    max: 5,
    maxBytes: 3 * 1024 * 1024,
    types: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['jpg', 'jpeg', 'png', 'webp'],
    accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
  },
};

/** The 22 first-level divisions of Yemen, as listed in ISO 3166-2:YE. */
export const yemenGovernorates: { code: string; name: Record<Locale, string> }[] = [
  {
    code: 'YE-SA',
    name: { ar: 'أمانة العاصمة', en: "Amanat Al Asimah (Sana'a City)", tr: 'Emanet el-Asime (Sana şehri)' },
  },
  { code: 'YE-AB', name: { ar: 'أبين', en: 'Abyan', tr: 'Ebyen' } },
  { code: 'YE-AD', name: { ar: 'عدن', en: 'Aden', tr: 'Aden' } },
  { code: 'YE-BA', name: { ar: 'البيضاء', en: 'Al Bayda', tr: 'Beyda' } },
  { code: 'YE-DA', name: { ar: 'الضالع', en: "Ad Dali'", tr: 'Dali' } },
  { code: 'YE-HU', name: { ar: 'الحديدة', en: 'Al Hudaydah', tr: 'Hudeyde' } },
  { code: 'YE-JA', name: { ar: 'الجوف', en: 'Al Jawf', tr: 'Cevf' } },
  { code: 'YE-MR', name: { ar: 'المهرة', en: 'Al Mahrah', tr: 'Mehre' } },
  { code: 'YE-MW', name: { ar: 'المحويت', en: 'Al Mahwit', tr: 'Mahvit' } },
  { code: 'YE-AM', name: { ar: 'عمران', en: 'Amran', tr: 'Amran' } },
  { code: 'YE-DH', name: { ar: 'ذمار', en: 'Dhamar', tr: 'Zemar' } },
  { code: 'YE-HD', name: { ar: 'حضرموت', en: 'Hadramawt', tr: 'Hadramut' } },
  { code: 'YE-HJ', name: { ar: 'حجة', en: 'Hajjah', tr: 'Hacce' } },
  { code: 'YE-IB', name: { ar: 'إب', en: 'Ibb', tr: 'İbb' } },
  { code: 'YE-LA', name: { ar: 'لحج', en: 'Lahij', tr: 'Lahic' } },
  { code: 'YE-MA', name: { ar: 'مأرب', en: "Ma'rib", tr: 'Marib' } },
  { code: 'YE-RA', name: { ar: 'ريمة', en: 'Raymah', tr: 'Reyme' } },
  { code: 'YE-SD', name: { ar: 'صعدة', en: "Sa'dah", tr: 'Sada' } },
  { code: 'YE-SN', name: { ar: 'صنعاء', en: "Sana'a", tr: 'Sana' } },
  { code: 'YE-SH', name: { ar: 'شبوة', en: 'Shabwah', tr: 'Şebve' } },
  { code: 'YE-SU', name: { ar: 'أرخبيل سقطرى', en: 'Socotra Archipelago', tr: 'Sokotra Takımadaları' } },
  { code: 'YE-TA', name: { ar: 'تعز', en: "Ta'izz", tr: 'Taiz' } },
];

/**
 * Calling codes offered in the phone field (country names come from
 * Intl.DisplayNames in the visitor's language). Yemen is listed first; any
 * other country can be entered through the "other code" option.
 */
export const phoneCountries: { iso: string; dial: string }[] = [
  ['YE', '967'],
  ['SA', '966'],
  ['AE', '971'],
  ['OM', '968'],
  ['QA', '974'],
  ['KW', '965'],
  ['BH', '973'],
  ['EG', '20'],
  ['JO', '962'],
  ['IQ', '964'],
  ['SY', '963'],
  ['LB', '961'],
  ['PS', '970'],
  ['SD', '249'],
  ['SO', '252'],
  ['DJ', '253'],
  ['LY', '218'],
  ['TN', '216'],
  ['DZ', '213'],
  ['MA', '212'],
  ['MR', '222'],
  ['KM', '269'],
  ['TR', '90'],
  ['MY', '60'],
  ['ID', '62'],
  ['IN', '91'],
  ['PK', '92'],
  ['BD', '880'],
  ['CN', '86'],
  ['JP', '81'],
  ['KR', '82'],
  ['SG', '65'],
  ['TH', '66'],
  ['PH', '63'],
  ['IR', '98'],
  ['ET', '251'],
  ['ER', '291'],
  ['KE', '254'],
  ['TZ', '255'],
  ['UG', '256'],
  ['NG', '234'],
  ['GH', '233'],
  ['ZA', '27'],
  ['GB', '44'],
  ['DE', '49'],
  ['FR', '33'],
  ['NL', '31'],
  ['BE', '32'],
  ['IT', '39'],
  ['ES', '34'],
  ['PT', '351'],
  ['SE', '46'],
  ['NO', '47'],
  ['DK', '45'],
  ['FI', '358'],
  ['AT', '43'],
  ['CH', '41'],
  ['IE', '353'],
  ['PL', '48'],
  ['GR', '30'],
  ['CY', '357'],
  ['RU', '7'],
  ['UA', '380'],
  ['AZ', '994'],
  ['UZ', '998'],
  ['US', '1'],
  ['CA', '1'],
  ['BR', '55'],
  ['AU', '61'],
  ['NZ', '64'],
].map(([iso, dial]) => ({ iso, dial }));

export const PHONE_OTHER = 'OTHER';
export const YEMEN_ISO = 'YE';

/** BCP-47 tags used for month and country names (Latin digits for Arabic, as across the site). */
export const formLocaleTag: Record<Locale, string> = { ar: 'ar-EG-u-nu-latn', en: 'en-GB', tr: 'tr-TR' };

export type AwardFormContent = {
  seo: { title: string; description: string };
  banner: {
    title: string;
    subtitle: string;
    /** Shown above the form while a deadline is set; {date} is its last day. */
    deadline: string;
    crumbHome: string;
    crumbAward: string;
    crumbForm: string;
  };
  steps: Record<ApplyStepId, { label: string; heading: string; description: string }>;
  progress: { stepOf: string; navLabel: string; done: string };
  common: {
    requiredMark: string;
    optional: string;
    next: string;
    previous: string;
    backToAward: string;
    submit: string;
    submitting: string;
    /** While the photos are being sent: {current} of {total}. */
    uploading: string;
    edit: string;
    errorSummary: string;
    leaveConfirm: string;
    selectPlaceholder: string;
    /** The request never reached the server, or the server failed. */
    submitFailed: string;
    /** The award team closed the form (or the deadline passed) meanwhile. */
    submitClosed: string;
    submitRateLimited: string;
    /** The server refused the data (should not happen through this form). */
    submitRejected: string;
  };
  fields: {
    initiativeName: { label: string; placeholder: string };
    representative: { label: string; placeholder: string };
    phone: {
      label: string;
      hint: string;
      countryLabel: string;
      numberLabel: string;
      numberPlaceholder: string;
      otherCode: string;
      customCodeLabel: string;
      customCodePlaceholder: string;
    };
    email: { label: string; placeholder: string };
    nationality: { label: string; yes: string; no: string; note: string };
    teamSize: { label: string; placeholder: string; hint: string };
    location: { label: string };
    governorate: { label: string; placeholder: string };
    district: { label: string; placeholder: string };
    period: { label: string; hint: string; start: string; end: string; month: string; year: string; ongoing: string };
    category: { label: string; options: Record<CategoryValue, string>; otherLabel: string; otherPlaceholder: string };
    social: {
      label: string;
      hint: string;
      platform: string;
      otherName: string;
      otherNamePlaceholder: string;
      url: string;
      urlPlaceholder: string;
      add: string;
      remove: string;
      counter: string;
      platforms: Record<PlatformId, string>;
    };
    impact: Record<ImpactId, { title: string; question: string; note?: string }>;
    answerPlaceholder: string;
    wordCounter: string;
  };
  attachments: {
    heading: string;
    optionalBadge: string;
    note: string;
    dropTitle: string;
    dropOr: string;
    choose: string;
    constraints: string;
    count: string;
    remove: string;
    replace: string;
    previewAlt: string;
    errors: { type: string; size: string; count: string };
  };
  review: {
    heading: string;
    description: string;
    sections: { basic: string; details: string; impact: string; attachments: string };
    empty: string;
    noImages: string;
    ongoing: string;
    words: string;
  };
  declaration: {
    heading: string;
    checkbox: string;
    noticeTitle: string;
    noticeDraft: string;
    noticeText: string;
    noticePending: string;
    /**
     * False while the notice is still our draft wording: the form then shows
     * the "draft" badge and the pending line. The award team switches it on
     * from the dashboard once the official text is in place.
     */
    noticeApproved: boolean;
  };
  /** Shown instead of the form while applications are closed. */
  closed: { title: string; paused: string; deadline: string; back: string };
  messages: {
    required: string;
    tooShort: string;
    tooLong: string;
    email: string;
    phone: string;
    phoneYemen: string;
    customCode: string;
    nationality: string;
    teamSize: string;
    periodStart: string;
    periodEnd: string;
    periodOrder: string;
    periodFuture: string;
    periodWindow: string;
    categoryOther: string;
    socialMin: string;
    socialPlatform: string;
    socialOtherName: string;
    socialUrl: string;
    socialDomain: string;
    socialDuplicate: string;
    wordsOver: string;
    declaration: string;
  };
  success: {
    seoTitle: string;
    badge: string;
    heading: string;
    withName: string;
    withoutName: string;
    referenceLabel: string;
    referenceHint: string;
    copy: string;
    copied: string;
    back: string;
    again: string;
  };
};

const ar: AwardFormContent = {
  seo: {
    title: 'استمارة الترشيح | جائزة أويس للأعمال التطوعية 2026',
    description: 'استمارة الترشيح لجائزة أويس للأعمال التطوعية 2026: أكمل بيانات مبادرتك عبر أربع خطوات بسيطة.',
  },
  banner: {
    title: 'استمارة الترشيح لجائزة أويس',
    subtitle: 'أكمل بيانات مبادرتك عبر أربع خطوات بسيطة',
    deadline: 'آخر موعد لاستقبال طلبات الترشيح: {date}',
    crumbHome: 'الرئيسية',
    crumbAward: 'جائزة أويس',
    crumbForm: 'استمارة الترشيح',
  },
  steps: {
    basic: {
      label: 'البيانات الأساسية',
      heading: 'البيانات الأساسية',
      description: 'معلومات عن المبادرة وممثّلها ووسيلة التواصل معه.',
    },
    details: {
      label: 'تفاصيل المبادرة',
      heading: 'تفاصيل المبادرة',
      description: 'مكان تنفيذ النشاط المشارك به وفترته ومجاله، وحسابات المبادرة.',
    },
    impact: {
      label: 'الأثر والتميز',
      heading: 'التعريف بالمبادرة ونتائجها',
      description: 'أجب بإيجاز ووضوح، ضمن الحد الأقصى لعدد الكلمات في كل سؤال.',
    },
    review: {
      label: 'المرفقات والمراجعة',
      heading: 'المرفقات ومراجعة الطلب',
      description: 'أضف صورًا داعمة إن رغبت، ثم راجع بياناتك قبل الإرسال.',
    },
  },
  progress: { stepOf: 'الخطوة {current} من {total}', navLabel: 'خطوات الاستمارة', done: 'مكتملة' },
  common: {
    requiredMark: 'حقل إلزامي',
    optional: 'اختياري',
    next: 'التالي',
    previous: 'السابق',
    backToAward: 'العودة إلى صفحة الجائزة',
    submit: 'إرسال الطلب',
    submitting: 'جارٍ إرسال الطلب…',
    uploading: 'جارٍ رفع الصور ({current} من {total})…',
    edit: 'تعديل',
    errorSummary: 'يرجى تصحيح الحقول المشار إليها ({count}) قبل المتابعة.',
    leaveConfirm: 'لم يُرسَل طلبك، وستفقد البيانات التي أدخلتها إذا غادرت الصفحة. هل تريد المغادرة؟',
    selectPlaceholder: 'اختر…',
    submitFailed:
      'تعذّر إرسال الطلب. تحقّق من اتصالك بالإنترنت ثم حاول مرة أخرى؛ بياناتك ما زالت في هذه الصفحة.',
    submitClosed: 'عذرًا، أُغلق باب استقبال طلبات الترشيح، ولم يُرسَل هذا الطلب.',
    submitRateLimited: 'وصلتنا عدة طلبات من هذا الجهاز أو البريد خلال وقت قصير. يرجى المحاولة مرة أخرى لاحقًا.',
    submitRejected:
      'تعذّر قبول الطلب لأن بعض بياناته لا تستوفي شروط الاستمارة. يرجى مراجعة الخطوات ثم إعادة الإرسال.',
  },
  fields: {
    initiativeName: { label: 'اسم المبادرة', placeholder: 'أدخل اسم المبادرة' },
    representative: { label: 'اسم ممثل المبادرة', placeholder: 'الاسم الكامل لممثل المبادرة' },
    phone: {
      label: 'رقم التواصل (واتساب)',
      hint: 'اختر رمز الدولة، ثم اكتب الرقم دون الصفر في أوله.',
      countryLabel: 'رمز الدولة',
      numberLabel: 'رقم الهاتف',
      numberPlaceholder: '7XX XXX XXX',
      otherCode: 'رمز دولة آخر',
      customCodeLabel: 'رمز الدولة',
      customCodePlaceholder: '44',
    },
    email: { label: 'البريد الإلكتروني', placeholder: 'name@example.com' },
    nationality: {
      label: 'هل جميع أعضاء المبادرة يمنيون؟',
      yes: 'نعم',
      no: 'لا',
      note: 'تشترط الجائزة أن يكون جميع أعضاء فريق المبادرة من حمَلة الجنسية اليمنية.',
    },
    teamSize: { label: 'عدد أعضاء فريق المبادرة', placeholder: 'مثال: 12', hint: 'عدد صحيح موجب.' },
    location: { label: 'مكان التنفيذ' },
    governorate: { label: 'المحافظة', placeholder: 'اختر المحافظة' },
    district: { label: 'المديرية', placeholder: 'اكتب اسم المديرية' },
    period: {
      label: 'فترة تنفيذ النشاط المشارك به',
      hint: 'تشترط الجائزة أن تكون المبادرة قد نُفّذت داخل اليمن خلال آخر 12 شهرًا.',
      start: 'بداية التنفيذ',
      end: 'نهاية التنفيذ',
      month: 'الشهر',
      year: 'السنة',
      ongoing: 'النشاط مستمر حتى الآن',
    },
    category: {
      label: 'مجال المبادرة',
      options: {
        education: 'التعليم',
        health: 'الصحة',
        environment: 'البيئة',
        empowerment: 'التمكين',
        other: 'غير ذلك',
      },
      otherLabel: 'حدّد مجال المبادرة',
      otherPlaceholder: 'اكتب مجال المبادرة',
    },
    social: {
      label: 'بيانات المبادرة في مواقع التواصل الاجتماعي',
      hint: 'أضف روابط المبادرة على منصتين مختلفتين على الأقل.',
      platform: 'المنصة',
      otherName: 'اسم المنصة',
      otherNamePlaceholder: 'مثال: موقع ويب',
      url: 'الرابط',
      urlPlaceholder: 'https://',
      add: 'إضافة منصة أخرى',
      remove: 'حذف هذه المنصة',
      counter: '{count} من {min} منصات مطلوبة على الأقل',
      platforms: {
        facebook: 'فيسبوك',
        instagram: 'إنستغرام',
        x: 'إكس (تويتر)',
        tiktok: 'تيك توك',
        youtube: 'يوتيوب',
        linkedin: 'لينكدإن',
        telegram: 'تيليغرام',
        whatsapp: 'قناة واتساب',
        snapchat: 'سناب شات',
        other: 'منصة أخرى',
      },
    },
    impact: {
      idea: {
        title: 'الفكرة والتميز',
        question: 'ما المشكلة التي عالجتموها؟ وماذا نفذتم؟ وما المختلف في حلكم مقارنة بما كان متاحًا في منطقتكم؟',
      },
      results: {
        title: 'النتيجة والأثر',
        question: 'فئة المستفيدين؟ وكم عدد المستفيدين تقريبًا؟ اذكروا أهم تغيير تحقق، مع رقم أو مثال واقعي يوضحه.',
      },
      team: {
        title: 'الفريق والتنظيم والنزاهة',
        question:
          'اذكروا موقفًا يوضح التزام الفريق وتعاونه أثناء التنفيذ، وكيف اخترتم المستفيدين. وإذا تلقيتم مالًا أو مواد، فكيف تابعتم استخدامها؟',
        note: 'ولا يُشترط وجود سجلات أو تقارير رسمية.',
      },
      sustainability: {
        title: 'استمرار الأثر',
        question:
          'ما الخطوة العملية المقبلة لاستمرار المبادرة أو أثرها، وما المتاح لتنفيذها؟ وهل شجعت المبادرة آخرين على التطوع أو تكرار الفكرة؟ اذكروا مثالًا إن وجد.',
      },
    },
    answerPlaceholder: 'اكتب إجابتك هنا…',
    wordCounter: '{count} / {limit} كلمة',
  },
  attachments: {
    heading: 'صور داعمة',
    optionalBadge: 'اختياري',
    note: 'إرفاق الصور اختياري، وتُرسَل الصور مع طلبك عند الضغط على «إرسال الطلب».',
    dropTitle: 'اسحب الصور وأفلتها هنا',
    dropOr: 'أو',
    choose: 'اختر صورًا من جهازك',
    constraints: 'JPG أو PNG أو WebP — حتى {max} صور، وبحد أقصى {size} ميغابايت للصورة الواحدة.',
    count: '{count} من {max} صور',
    remove: 'حذف الصورة',
    replace: 'استبدال',
    previewAlt: 'معاينة الصورة: {name}',
    errors: {
      type: '«{name}»: صيغة غير مدعومة. الصيغ المسموحة: JPG وPNG وWebP.',
      size: '«{name}»: حجمها {size} ميغابايت، والحد الأقصى {max} ميغابايت.',
      count: 'لم تُضَف «{name}»: يمكن إرفاق {max} صور كحد أقصى.',
    },
  },
  review: {
    heading: 'مراجعة الطلب',
    description: 'راجع بياناتك قبل الإرسال، ويمكنك العودة إلى أي قسم لتعديله.',
    sections: {
      basic: 'البيانات الأساسية',
      details: 'تفاصيل المبادرة',
      impact: 'الأثر والتميز',
      attachments: 'الصور الداعمة',
    },
    empty: 'لم يُدخَل',
    noImages: 'لا توجد صور مرفقة.',
    ongoing: 'مستمر حتى الآن',
    words: '{count} كلمة',
  },
  declaration: {
    heading: 'الإقرار',
    checkbox: 'أؤكد أنني راجعت بيانات الطلب، وأن المعلومات المقدّمة صحيحة.',
    noticeTitle: 'إشعار الجهة المنظِّمة',
    noticeDraft: 'مسودة — بانتظار النص الرسمي',
    noticeText:
      'يحق للجهة المنظِّمة استخدام المعلومات والصور والفيديوهات المقدّمة لأغراض التوثيق والنشر والمواد الترويجية والتقارير المؤسسية، مع حفظ الحقوق الأدبية للمشاركين.',
    noticePending: 'سيُستبدل هذا النص بالصيغة الواردة في وثيقة الجائزة الرسمية حرفيًا.',
    noticeApproved: false,
  },
  closed: {
    title: 'باب الترشيح مغلق',
    paused: 'استقبال طلبات الترشيح لجائزة أويس للأعمال التطوعية متوقف حاليًا.',
    deadline: 'انتهى موعد استقبال طلبات الترشيح في {date}.',
    back: 'العودة إلى صفحة الجائزة',
  },
  messages: {
    required: 'هذا الحقل مطلوب.',
    tooShort: 'يرجى إدخال حرفين على الأقل.',
    tooLong: 'النص أطول من المسموح ({max} حرفًا).',
    email: 'صيغة البريد الإلكتروني غير صحيحة، مثال: name@example.com',
    phone: 'رقم الهاتف غير صحيح: يجب أن يتكون من 6 إلى 12 رقمًا بعد رمز الدولة.',
    phoneYemen: 'رقم الجوال اليمني يتكون من 9 أرقام ويبدأ بالرقم 7.',
    customCode: 'أدخل رمز دولة صحيحًا (من رقم واحد إلى 4 أرقام).',
    nationality: 'وفق شروط الجائزة يجب أن يكون جميع أعضاء المبادرة يمنيين، لذا لا يمكن متابعة الترشيح.',
    teamSize: 'أدخل عددًا صحيحًا موجبًا (1 فأكثر).',
    periodStart: 'اختر شهر وسنة بداية التنفيذ.',
    periodEnd: 'اختر شهر وسنة نهاية التنفيذ، أو حدّد أن النشاط مستمر.',
    periodOrder: 'يجب أن تكون نهاية التنفيذ بعد بدايته أو في الشهر نفسه.',
    periodFuture: 'لا يمكن أن يكون التاريخ في المستقبل.',
    periodWindow: 'وفق شروط الجائزة يجب أن يكون النشاط قد نُفّذ خلال آخر 12 شهرًا.',
    categoryOther: 'حدّد مجال المبادرة.',
    socialMin: 'أضف رابطين صحيحين على الأقل لمنصتين مختلفتين.',
    socialPlatform: 'اختر المنصة.',
    socialOtherName: 'اكتب اسم المنصة.',
    socialUrl: 'أدخل رابطًا صحيحًا، مثال: https://facebook.com/initiative',
    socialDomain: 'الرابط لا يبدو تابعًا لمنصة {platform}.',
    socialDuplicate: 'هذه المنصة مضافة مسبقًا.',
    wordsOver: 'تجاوزت الحد الأقصى ({limit} كلمة) بـ {over} كلمة، يرجى الاختصار.',
    declaration: 'يرجى تأكيد مراجعة بيانات الطلب.',
  },
  success: {
    seoTitle: 'تم استلام الطلب | جائزة أويس للأعمال التطوعية 2026',
    badge: 'تم الاستلام',
    heading: 'تم استلام طلب الترشيح',
    withName: 'استلمنا طلب ترشيح «{name}» لجائزة أويس للأعمال التطوعية.',
    withoutName: 'استلمنا طلب ترشيحك لجائزة أويس للأعمال التطوعية.',
    referenceLabel: 'رقم الطلب',
    referenceHint: 'احتفظ بهذا الرقم للرجوع إليه عند أي استفسار عن طلبك.',
    copy: 'نسخ الرقم',
    copied: 'تم النسخ',
    back: 'العودة إلى صفحة الجائزة',
    again: 'تقديم مبادرة أخرى',
  },
};

const en: AwardFormContent = {
  seo: {
    title: 'Nomination form | Owais Volunteer Award 2026',
    description:
      'The Owais Volunteer Award 2026 nomination form: complete your initiative’s details in four simple steps.',
  },
  banner: {
    title: 'Owais Award nomination form',
    subtitle: 'Complete your initiative’s details in four simple steps',
    deadline: 'Applications close on {date}',
    crumbHome: 'Home',
    crumbAward: 'Owais Award',
    crumbForm: 'Nomination form',
  },
  steps: {
    basic: {
      label: 'Basic information',
      heading: 'Basic information',
      description: 'About the initiative, its representative and how to reach them.',
    },
    details: {
      label: 'Initiative details',
      heading: 'Initiative details',
      description: 'Where and when the submitted activity took place, its field and the initiative’s accounts.',
    },
    impact: {
      label: 'Impact & distinction',
      heading: 'About the initiative and its results',
      description: 'Answer briefly and clearly, within each question’s word limit.',
    },
    review: {
      label: 'Attachments & review',
      heading: 'Attachments and application review',
      description: 'Add supporting photos if you wish, then review your answers before sending.',
    },
  },
  progress: { stepOf: 'Step {current} of {total}', navLabel: 'Form steps', done: 'completed' },
  common: {
    requiredMark: 'required',
    optional: 'Optional',
    next: 'Next',
    previous: 'Previous',
    backToAward: 'Back to the award page',
    submit: 'Send application',
    submitting: 'Sending your application…',
    uploading: 'Uploading photos ({current} of {total})…',
    edit: 'Edit',
    errorSummary: 'Please correct the highlighted fields ({count}) before continuing.',
    leaveConfirm:
      'Your application has not been sent and the information you entered will be lost if you leave. Leave this page?',
    selectPlaceholder: 'Select…',
    submitFailed:
      'Your application could not be sent. Check your internet connection and try again; your answers are still on this page.',
    submitClosed: 'Sorry, applications have closed and this application was not sent.',
    submitRateLimited:
      'We received several applications from this device or email in a short time. Please try again later.',
    submitRejected:
      'The application could not be accepted because some of its details do not meet the form’s conditions. Please review the steps and send it again.',
  },
  fields: {
    initiativeName: { label: 'Initiative name', placeholder: 'Enter the initiative’s name' },
    representative: { label: 'Initiative representative', placeholder: 'Full name of the initiative’s representative' },
    phone: {
      label: 'Contact number (WhatsApp)',
      hint: 'Choose the country code, then type the number without its leading zero.',
      countryLabel: 'Country code',
      numberLabel: 'Phone number',
      numberPlaceholder: '7XX XXX XXX',
      otherCode: 'Another country code',
      customCodeLabel: 'Country code',
      customCodePlaceholder: '44',
    },
    email: { label: 'Email address', placeholder: 'name@example.com' },
    nationality: {
      label: 'Are all members of the initiative Yemeni?',
      yes: 'Yes',
      no: 'No',
      note: 'The award requires every member of the initiative team to hold Yemeni nationality.',
    },
    teamSize: { label: 'Number of team members', placeholder: 'e.g. 12', hint: 'A positive whole number.' },
    location: { label: 'Place of implementation' },
    governorate: { label: 'Governorate', placeholder: 'Select the governorate' },
    district: { label: 'District', placeholder: 'Type the district’s name' },
    period: {
      label: 'Implementation period of the submitted activity',
      hint: 'The award requires the initiative to have been implemented inside Yemen within the last 12 months.',
      start: 'Start',
      end: 'End',
      month: 'Month',
      year: 'Year',
      ongoing: 'The activity is still ongoing',
    },
    category: {
      label: 'Field of the initiative',
      options: {
        education: 'Education',
        health: 'Health',
        environment: 'Environment',
        empowerment: 'Empowerment',
        other: 'Other',
      },
      otherLabel: 'Specify the field',
      otherPlaceholder: 'Type the initiative’s field',
    },
    social: {
      label: 'The initiative on social media',
      hint: 'Add the initiative’s links on at least two different platforms.',
      platform: 'Platform',
      otherName: 'Platform name',
      otherNamePlaceholder: 'e.g. Website',
      url: 'Link',
      urlPlaceholder: 'https://',
      add: 'Add another platform',
      remove: 'Remove this platform',
      counter: '{count} of the {min} required platforms',
      platforms: {
        facebook: 'Facebook',
        instagram: 'Instagram',
        x: 'X (Twitter)',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        telegram: 'Telegram',
        whatsapp: 'WhatsApp channel',
        snapchat: 'Snapchat',
        other: 'Other platform',
      },
    },
    impact: {
      idea: {
        title: 'Idea and distinction',
        question:
          'What problem did you address? What did you implement? And what was different about your solution compared with what was available in your area?',
      },
      results: {
        title: 'Results and impact',
        question:
          'Who were the beneficiaries, and roughly how many? State the most important change achieved, with a number or a real example that shows it.',
      },
      team: {
        title: 'Team, organisation and integrity',
        question:
          'Describe a situation that shows the team’s commitment and cooperation during implementation, and how you selected the beneficiaries. If you received money or materials, how did you follow up on their use?',
        note: 'Official records or reports are not required.',
      },
      sustainability: {
        title: 'Sustaining the impact',
        question:
          'What is the next practical step to continue the initiative or its impact, and what is available to carry it out? Did the initiative encourage others to volunteer or repeat the idea? Give an example if there is one.',
      },
    },
    answerPlaceholder: 'Write your answer here…',
    wordCounter: '{count} / {limit} words',
  },
  attachments: {
    heading: 'Supporting photos',
    optionalBadge: 'Optional',
    note: 'Photos are optional; they are sent with your application when you press “Send application”.',
    dropTitle: 'Drag and drop photos here',
    dropOr: 'or',
    choose: 'Choose photos from your device',
    constraints: 'JPG, PNG or WebP — up to {max} photos, {size} MB per photo at most.',
    count: '{count} of {max} photos',
    remove: 'Remove photo',
    replace: 'Replace',
    previewAlt: 'Photo preview: {name}',
    errors: {
      type: '“{name}”: unsupported format. Allowed formats: JPG, PNG and WebP.',
      size: '“{name}” is {size} MB; the maximum is {max} MB.',
      count: '“{name}” was not added: you can attach up to {max} photos.',
    },
  },
  review: {
    heading: 'Review your application',
    description: 'Check your answers before sending; you can go back to any section to change it.',
    sections: {
      basic: 'Basic information',
      details: 'Initiative details',
      impact: 'Impact & distinction',
      attachments: 'Supporting photos',
    },
    empty: 'Not provided',
    noImages: 'No photos attached.',
    ongoing: 'ongoing',
    words: '{count} words',
  },
  declaration: {
    heading: 'Declaration',
    checkbox: 'I confirm that I have reviewed the application and that the information provided is correct.',
    noticeTitle: 'Organiser’s notice',
    noticeDraft: 'Draft — awaiting the official wording',
    noticeText:
      'The organiser may use the information, photos and videos submitted for documentation, publication, promotional materials and institutional reports, while preserving the participants’ moral rights.',
    noticePending: 'This text will be replaced word for word by the wording of the official award document.',
    noticeApproved: false,
  },
  closed: {
    title: 'Applications are closed',
    paused: 'The Owais Volunteer Award is not accepting applications at the moment.',
    deadline: 'The application period ended on {date}.',
    back: 'Back to the award page',
  },
  messages: {
    required: 'This field is required.',
    tooShort: 'Please enter at least two characters.',
    tooLong: 'The text is longer than allowed ({max} characters).',
    email: 'The email address is not valid, e.g. name@example.com',
    phone: 'The phone number is not valid: it should have 6 to 12 digits after the country code.',
    phoneYemen: 'A Yemeni mobile number has 9 digits and starts with 7.',
    customCode: 'Enter a valid country code (1 to 4 digits).',
    nationality:
      'Under the award’s conditions all members of the initiative must be Yemeni, so the nomination cannot continue.',
    teamSize: 'Enter a positive whole number (1 or more).',
    periodStart: 'Choose the month and year the implementation started.',
    periodEnd: 'Choose the month and year it ended, or mark the activity as ongoing.',
    periodOrder: 'The end must be in or after the month of the start.',
    periodFuture: 'The date cannot be in the future.',
    periodWindow: 'Under the award’s conditions the activity must have been implemented within the last 12 months.',
    categoryOther: 'Specify the initiative’s field.',
    socialMin: 'Add at least two valid links on two different platforms.',
    socialPlatform: 'Choose the platform.',
    socialOtherName: 'Type the platform’s name.',
    socialUrl: 'Enter a valid link, e.g. https://facebook.com/initiative',
    socialDomain: 'This link does not look like a {platform} link.',
    socialDuplicate: 'This platform has already been added.',
    wordsOver: 'You are {over} words over the {limit}-word limit; please shorten your answer.',
    declaration: 'Please confirm that you have reviewed the application.',
  },
  success: {
    seoTitle: 'Application received | Owais Volunteer Award 2026',
    badge: 'Received',
    heading: 'Your nomination has been received',
    withName: 'We have received the nomination of “{name}” for the Owais Volunteer Award.',
    withoutName: 'We have received your nomination for the Owais Volunteer Award.',
    referenceLabel: 'Application number',
    referenceHint: 'Keep this number to refer to if you have any question about your application.',
    copy: 'Copy number',
    copied: 'Copied',
    back: 'Back to the award page',
    again: 'Nominate another initiative',
  },
};

const tr: AwardFormContent = {
  seo: {
    title: 'Aday gösterme formu | Owais Gönüllülük Ödülü 2026',
    description:
      'Owais Gönüllülük Ödülü 2026 aday gösterme formu: girişiminizin bilgilerini dört basit adımda tamamlayın.',
  },
  banner: {
    title: 'Owais Ödülü aday gösterme formu',
    subtitle: 'Girişiminizin bilgilerini dört basit adımda tamamlayın',
    deadline: 'Son başvuru tarihi: {date}',
    crumbHome: 'Ana Sayfa',
    crumbAward: 'Owais Ödülü',
    crumbForm: 'Aday gösterme formu',
  },
  steps: {
    basic: {
      label: 'Temel bilgiler',
      heading: 'Temel bilgiler',
      description: 'Girişim, temsilcisi ve temsilciye ulaşma yolu hakkında.',
    },
    details: {
      label: 'Girişim ayrıntıları',
      heading: 'Girişim ayrıntıları',
      description: 'Başvurulan faaliyetin yeri, dönemi ve alanı ile girişimin hesapları.',
    },
    impact: {
      label: 'Etki ve özgünlük',
      heading: 'Girişimin tanıtımı ve sonuçları',
      description: 'Her sorunun kelime sınırı içinde kısa ve açık yanıt verin.',
    },
    review: {
      label: 'Ekler ve kontrol',
      heading: 'Ekler ve başvurunun kontrolü',
      description:
        'Dilerseniz destekleyici fotoğraflar ekleyin, ardından göndermeden önce bilgilerinizi gözden geçirin.',
    },
  },
  progress: { stepOf: 'Adım {current} / {total}', navLabel: 'Form adımları', done: 'tamamlandı' },
  common: {
    requiredMark: 'zorunlu',
    optional: 'İsteğe bağlı',
    next: 'İleri',
    previous: 'Geri',
    backToAward: 'Ödül sayfasına dön',
    submit: 'Başvuruyu gönder',
    submitting: 'Başvurunuz gönderiliyor…',
    uploading: 'Fotoğraflar yükleniyor ({current} / {total})…',
    edit: 'Düzenle',
    errorSummary: 'Devam etmeden önce lütfen işaretli alanları ({count}) düzeltin.',
    leaveConfirm:
      'Başvurunuz gönderilmedi; sayfadan ayrılırsanız girdiğiniz bilgiler kaybolacak. Ayrılmak istiyor musunuz?',
    selectPlaceholder: 'Seçin…',
    submitFailed:
      'Başvurunuz gönderilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin; bilgileriniz bu sayfada duruyor.',
    submitClosed: 'Üzgünüz, başvurular kapandı ve bu başvuru gönderilmedi.',
    submitRateLimited:
      'Bu cihazdan veya e-posta adresinden kısa sürede birden fazla başvuru aldık. Lütfen daha sonra tekrar deneyin.',
    submitRejected:
      'Bazı bilgiler formun koşullarını karşılamadığı için başvuru kabul edilemedi. Lütfen adımları gözden geçirip yeniden gönderin.',
  },
  fields: {
    initiativeName: { label: 'Girişimin adı', placeholder: 'Girişimin adını yazın' },
    representative: { label: 'Girişim temsilcisinin adı', placeholder: 'Girişim temsilcisinin tam adı' },
    phone: {
      label: 'İletişim numarası (WhatsApp)',
      hint: 'Ülke kodunu seçin, ardından numarayı başındaki sıfır olmadan yazın.',
      countryLabel: 'Ülke kodu',
      numberLabel: 'Telefon numarası',
      numberPlaceholder: '7XX XXX XXX',
      otherCode: 'Başka bir ülke kodu',
      customCodeLabel: 'Ülke kodu',
      customCodePlaceholder: '44',
    },
    email: { label: 'E-posta adresi', placeholder: 'ad@ornek.com' },
    nationality: {
      label: 'Girişimin tüm üyeleri Yemenli mi?',
      yes: 'Evet',
      no: 'Hayır',
      note: 'Ödül, girişim ekibinin tüm üyelerinin Yemen vatandaşı olmasını şart koşar.',
    },
    teamSize: { label: 'Ekip üyesi sayısı', placeholder: 'örn. 12', hint: 'Pozitif bir tam sayı.' },
    location: { label: 'Uygulama yeri' },
    governorate: { label: 'İl (muhafaza)', placeholder: 'İli seçin' },
    district: { label: 'İlçe (müdüriyet)', placeholder: 'İlçenin adını yazın' },
    period: {
      label: 'Başvurulan faaliyetin uygulama dönemi',
      hint: 'Ödül, girişimin son 12 ay içinde Yemen’de uygulanmış olmasını şart koşar.',
      start: 'Başlangıç',
      end: 'Bitiş',
      month: 'Ay',
      year: 'Yıl',
      ongoing: 'Faaliyet hâlâ sürüyor',
    },
    category: {
      label: 'Girişimin alanı',
      options: {
        education: 'Eğitim',
        health: 'Sağlık',
        environment: 'Çevre',
        empowerment: 'Güçlendirme',
        other: 'Diğer',
      },
      otherLabel: 'Alanı belirtin',
      otherPlaceholder: 'Girişimin alanını yazın',
    },
    social: {
      label: 'Girişimin sosyal medya hesapları',
      hint: 'Girişimin en az iki farklı platformdaki bağlantılarını ekleyin.',
      platform: 'Platform',
      otherName: 'Platform adı',
      otherNamePlaceholder: 'örn. Web sitesi',
      url: 'Bağlantı',
      urlPlaceholder: 'https://',
      add: 'Başka bir platform ekle',
      remove: 'Bu platformu kaldır',
      counter: 'Gerekli {min} platformdan {count} tanesi',
      platforms: {
        facebook: 'Facebook',
        instagram: 'Instagram',
        x: 'X (Twitter)',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        telegram: 'Telegram',
        whatsapp: 'WhatsApp kanalı',
        snapchat: 'Snapchat',
        other: 'Diğer platform',
      },
    },
    impact: {
      idea: {
        title: 'Fikir ve özgünlük',
        question:
          'Hangi sorunu ele aldınız? Ne uyguladınız? Çözümünüzü bölgenizde mevcut olanlardan farklı kılan neydi?',
      },
      results: {
        title: 'Sonuç ve etki',
        question:
          'Faydalanıcılar kimlerdi ve yaklaşık kaç kişiydi? Elde edilen en önemli değişikliği, onu gösteren bir sayı ya da gerçek bir örnekle belirtin.',
      },
      team: {
        title: 'Ekip, organizasyon ve dürüstlük',
        question:
          'Uygulama sırasında ekibin bağlılığını ve iş birliğini gösteren bir durumu ve faydalanıcıları nasıl seçtiğinizi anlatın. Para veya malzeme aldıysanız, bunların kullanımını nasıl takip ettiniz?',
        note: 'Resmî kayıt veya rapor bulunması şart değildir.',
      },
      sustainability: {
        title: 'Etkinin sürekliliği',
        question:
          'Girişimin veya etkisinin sürmesi için atılacak bir sonraki somut adım nedir ve bunu gerçekleştirmek için neler mevcut? Girişim başkalarını gönüllülüğe veya fikri tekrarlamaya teşvik etti mi? Varsa bir örnek verin.',
      },
    },
    answerPlaceholder: 'Yanıtınızı buraya yazın…',
    wordCounter: '{count} / {limit} kelime',
  },
  attachments: {
    heading: 'Destekleyici fotoğraflar',
    optionalBadge: 'İsteğe bağlı',
    note: 'Fotoğraf eklemek isteğe bağlıdır; fotoğraflar “Başvuruyu gönder”e bastığınızda başvurunuzla birlikte gönderilir.',
    dropTitle: 'Fotoğrafları buraya sürükleyip bırakın',
    dropOr: 'veya',
    choose: 'Cihazınızdan fotoğraf seçin',
    constraints: 'JPG, PNG veya WebP — en fazla {max} fotoğraf, fotoğraf başına en fazla {size} MB.',
    count: '{count} / {max} fotoğraf',
    remove: 'Fotoğrafı kaldır',
    replace: 'Değiştir',
    previewAlt: 'Fotoğraf önizlemesi: {name}',
    errors: {
      type: '“{name}”: desteklenmeyen biçim. İzin verilen biçimler: JPG, PNG ve WebP.',
      size: '“{name}” {size} MB; en fazla {max} MB olabilir.',
      count: '“{name}” eklenmedi: en fazla {max} fotoğraf ekleyebilirsiniz.',
    },
  },
  review: {
    heading: 'Başvurunuzu gözden geçirin',
    description: 'Göndermeden önce yanıtlarınızı kontrol edin; değiştirmek için herhangi bir bölüme dönebilirsiniz.',
    sections: {
      basic: 'Temel bilgiler',
      details: 'Girişim ayrıntıları',
      impact: 'Etki ve özgünlük',
      attachments: 'Destekleyici fotoğraflar',
    },
    empty: 'Girilmedi',
    noImages: 'Ekli fotoğraf yok.',
    ongoing: 'devam ediyor',
    words: '{count} kelime',
  },
  declaration: {
    heading: 'Beyan',
    checkbox: 'Başvuruyu gözden geçirdiğimi ve verdiğim bilgilerin doğru olduğunu onaylıyorum.',
    noticeTitle: 'Düzenleyicinin bildirimi',
    noticeDraft: 'Taslak — resmî metin bekleniyor',
    noticeText:
      'Düzenleyici, sunulan bilgileri, fotoğrafları ve videoları; katılımcıların manevi haklarını koruyarak belgeleme, yayın, tanıtım materyalleri ve kurumsal raporlar için kullanabilir.',
    noticePending: 'Bu metin, resmî ödül belgesindeki ifadeyle kelimesi kelimesine değiştirilecektir.',
    noticeApproved: false,
  },
  closed: {
    title: 'Başvurular kapalı',
    paused: 'Owais Gönüllülük Ödülü şu anda başvuru kabul etmiyor.',
    deadline: 'Başvuru süresi {date} tarihinde sona erdi.',
    back: 'Ödül sayfasına dön',
  },
  messages: {
    required: 'Bu alan zorunludur.',
    tooShort: 'Lütfen en az iki karakter girin.',
    tooLong: 'Metin izin verilenden uzun ({max} karakter).',
    email: 'E-posta adresi geçerli değil, örn. ad@ornek.com',
    phone: 'Telefon numarası geçerli değil: ülke kodundan sonra 6 ile 12 rakam olmalı.',
    phoneYemen: 'Yemen cep telefonu numarası 9 haneli olur ve 7 ile başlar.',
    customCode: 'Geçerli bir ülke kodu girin (1 ile 4 rakam).',
    nationality:
      'Ödül koşullarına göre girişimin tüm üyeleri Yemenli olmalıdır; bu nedenle aday gösterme devam edemez.',
    teamSize: 'Pozitif bir tam sayı girin (1 veya daha fazla).',
    periodStart: 'Uygulamanın başladığı ayı ve yılı seçin.',
    periodEnd: 'Bittiği ayı ve yılı seçin veya faaliyetin sürdüğünü işaretleyin.',
    periodOrder: 'Bitiş, başlangıçla aynı ay veya sonrasında olmalıdır.',
    periodFuture: 'Tarih gelecekte olamaz.',
    periodWindow: 'Ödül koşullarına göre faaliyet son 12 ay içinde uygulanmış olmalıdır.',
    categoryOther: 'Girişimin alanını belirtin.',
    socialMin: 'İki farklı platformda en az iki geçerli bağlantı ekleyin.',
    socialPlatform: 'Platformu seçin.',
    socialOtherName: 'Platformun adını yazın.',
    socialUrl: 'Geçerli bir bağlantı girin, örn. https://facebook.com/girisim',
    socialDomain: 'Bu bağlantı bir {platform} bağlantısına benzemiyor.',
    socialDuplicate: 'Bu platform zaten eklendi.',
    wordsOver: '{limit} kelimelik sınırı {over} kelime aştınız; lütfen yanıtınızı kısaltın.',
    declaration: 'Lütfen başvuruyu gözden geçirdiğinizi onaylayın.',
  },
  success: {
    seoTitle: 'Başvuru alındı | Owais Gönüllülük Ödülü 2026',
    badge: 'Alındı',
    heading: 'Aday gösterme başvurunuz alındı',
    withName: '“{name}” için Owais Gönüllülük Ödülü başvurusunu aldık.',
    withoutName: 'Owais Gönüllülük Ödülü başvurunuzu aldık.',
    referenceLabel: 'Başvuru numarası',
    referenceHint: 'Başvurunuzla ilgili sorularınızda başvurmak için bu numarayı saklayın.',
    copy: 'Numarayı kopyala',
    copied: 'Kopyalandı',
    back: 'Ödül sayfasına dön',
    again: 'Başka bir girişim için başvur',
  },
};

const formContent: Record<Locale, AwardFormContent> = { ar, en, tr };

/** The form copy as it ships in this repo. */
export function staticAwardFormContent(locale: Locale): AwardFormContent {
  return formContent[locale] ?? formContent.ar;
}

/**
 * What applicants see. Only the organiser's notice is editable from the
 * dashboard (the `award-page` row): its wording, and whether it is still a draft.
 */
export function getAwardFormContent(locale: Locale): AwardFormContent {
  const base = staticAwardFormContent(locale);
  const stored = cmsPageContent(AWARD_PAGE_KEY, locale, { declaration: base.declaration }).declaration;
  const noticeText = typeof stored?.noticeText === 'string' && stored.noticeText.trim() ? stored.noticeText : null;
  if (!noticeText) return base;
  return {
    ...base,
    declaration: { ...base.declaration, noticeText, noticeApproved: stored.noticeApproved === true },
  };
}

/** Replaces {tokens} in a message. */
export function fillTemplate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
