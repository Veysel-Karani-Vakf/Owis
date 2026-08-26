import { cmsPageContent } from '@/cms/adapters';
import type { BreadcrumbItem } from '@/data/about';
import type { Locale } from '@/i18n/content';
import participateHeroImage from '@/assets/participate/participate-hero.jpg';

export const participateRoutes = {
  index: '/participate',
  shareIdeas: '/participate/share-ideas',
  complaintsSuggestions: '/participate/complaints-suggestions',
  volunteer: '/participate/volunteer',
  contact: '/participate/contact',
} as const;

export type ParticipatePageKey = 'shareIdeas' | 'complaintsSuggestions' | 'volunteer' | 'contact';

export type ParticipateNavItem = {
  // The admin offers a select, but a stored value may still be anything, so
  // consumers must treat this as a loose string and fall back gracefully.
  key: ParticipatePageKey | string;
  label: string;
  // May be empty when edited in the admin; derive it from `key` then.
  href: string;
};

export type ParticipateFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file';

const FIELD_TYPES: readonly string[] = ['text', 'email', 'tel', 'textarea', 'select', 'file'];

/** Coerces whatever the admin stored ("Text", "dropdown", "") to a supported widget. */
export function normalizeFieldType(type: string | undefined | null): ParticipateFieldType {
  const value = (type ?? '').trim().toLowerCase();
  return (FIELD_TYPES.includes(value) ? value : 'text') as ParticipateFieldType;
}

export type ParticipateFormField = {
  id: string;
  /** Key used in the submission payload; derived from `id` when missing. */
  sourceName?: string;
  label: string;
  placeholder?: string;
  /** Any string from the admin; normalised with `normalizeFieldType` before use. */
  type: ParticipateFieldType | string;
  required: boolean;
  options?: string[];
  rows?: number;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | string;
  accept?: string;
};

export type ParticipateFormGroup = {
  id: string;
  title: string;
  description?: string;
  fieldIds: string[];
};

export type ParticipateFormContent = {
  id: string;
  title: string;
  description: string;
  fields: ParticipateFormField[];
  groups: ParticipateFormGroup[];
};

export type ParticipateContactLink = {
  /** Static defaults carry an id; admin-added cards do not. */
  id?: string;
  label: string;
  description?: string;
  href: string;
  /** 'whatsapp' | 'social' from the admin select; anything else gets a generic icon. */
  kind?: 'whatsapp' | 'social' | string;
};

export type ParticipatePageContent = {
  key: ParticipatePageKey;
  slug: string;
  route: string;
  sourceUrl: string;
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
  form?: ParticipateFormContent;
  contact?: {
    directTitle: string;
    directDescription: string;
    socialTitle: string;
    socialDescription: string;
    directLinks: ParticipateContactLink[];
    socialLinks: ParticipateContactLink[];
  };
};

export type ParticipateLabels = {
  /** Breadcrumb labels shared by every participate page. */
  home: string;
  participate: string;
  sectionTitle: string;
  formNotice: string;
  submit: string;
  submitting: string;
  next: string;
  previous: string;
  step: string;
  requiredMessage: string;
  emailMessage: string;
  submitSuccess: string;
  submitError: string;
  selectedFiles: string;
  openLink: string;
};

export type ParticipateContent = {
  nav: ParticipateNavItem[];
  labels: ParticipateLabels;
  pages: Record<ParticipatePageKey, ParticipatePageContent>;
};

export const participateSources = {
  shareIdeas: '/participate/share-ideas',
  complaintsSuggestions: '/participate/complaints-suggestions',
  volunteer: '/participate/volunteer',
  contact: '/participate/contact',
} as const;

export const routeByKey: Record<ParticipatePageKey, string> = {
  shareIdeas: participateRoutes.shareIdeas,
  complaintsSuggestions: participateRoutes.complaintsSuggestions,
  volunteer: participateRoutes.volunteer,
  contact: participateRoutes.contact,
};

const slugByKey: Record<ParticipatePageKey, string> = {
  shareIdeas: 'share-ideas',
  complaintsSuggestions: 'complaints-suggestions',
  volunteer: 'volunteer',
  contact: 'contact',
};

const countryOptions = [
  'أفغانستان',
  'ألبانيا',
  'الجزائر',
  'أندورا',
  'أنغولا',
  'أنتيغوا أند ديبس',
  'الأرجنتين',
  'أرمينيا',
  'أستراليا',
  'النمسا',
  'أذربيجان',
  'البهاما',
  'البحرين',
  'بنغلادش',
  'بربادوس',
  'بيلاروسيا',
  'بلجيكا',
  'بليز',
  'بنين',
  'بوتان',
  'بوليفيا',
  'البوسنة الهرسك',
  'بوتسوانا',
  'البرازيل',
  'بروناي',
  'بلغاريا',
  'بوركينا',
  'بوروندي',
  'كمبوديا',
  'الكاميرون',
  'كندا',
  'الرأس الأخضر',
  'جمهورية إفريقيا الوسطى',
  'تشاد',
  'تشيلي',
  'الصين',
  'كولومبيا',
  'جزر القمر',
  'الكونغو',
  'الكونغو {ديمقراطي}}',
  'كوستاريكا',
  'كرواتيا',
  'كوبا',
  'قبرص',
  'جمهورية التشيك',
  'الدنمارك',
  'جيبوتي',
  'دومينيكا',
  'جمهورية الدومينيكان',
  'تيمور الشرقية',
  'إكوادور',
  'مصر',
  'السلفادور',
  'غينيا الاستوائية',
  'إريتريا',
  'استونيا',
  'إثيوبيا',
  'فيجي',
  'فنلندا',
  'فرنسا',
  'الجابون',
  'غامبيا',
  'جورجيا',
  'ألمانيا',
  'غانا',
  'اليونان',
  'غرينادا',
  'غواتيمالا',
  'غينيا',
  'غينيا - بيساو',
  'غيانا',
  'هايتي',
  'هندوراس',
  'المجر',
  'أيسلندا',
  'الهند',
  'إندونيسيا',
  'إيران',
  'العراق',
  'أيرلندا {جمهورية}',
  'إيطاليا',
  'ساحل العاج',
  'جامايكا',
  'اليابان',
  'الأردن',
  'كازاخستان',
  'كينيا',
  'كيريباتي',
  'كوريا الشمالية',
  'كوريا الجنوبية ال"كوسوفو',
  'الكويت',
  'قرغيزستان',
  'لاوس',
  'لاتفيا',
  'لبنان',
  'ليسوتو',
  'ليبيريا',
  'ليبيا',
  'ليختنشتاين',
  'ليتوانيا',
  'لوكسمبورغ',
  'مقدونيا',
  'مدغشقر',
  'ملاوي',
  'ماليزيا',
  'جزر المالديف',
  'مالي',
  'مالطا',
  'جزر مارشال',
  'موريتانيا',
  'موريشيوس',
  'المكسيك',
  'ميكرونيزيا',
  'مولدوفا',
  'موناكو',
  'منغوليا',
  'مونتينيغرو',
  'المغرب',
  'موزمبيق',
  'ميانمار ، {بورما}',
  'ناميبيا',
  'ناورو',
  'نيبال',
  'هولندا',
  'نيوزيلندا',
  'نيكاراغوا',
  'النيجر',
  'نيجيريا',
  'النرويج',
  'عُمان',
  'باكستان',
  'بالاو',
  'بنما',
  'بابوا غينيا الجديدة',
  'باراجواي',
  'بيرو',
  'الفلبين',
  'بولندا',
  'البرتغال',
  'قطر',
  'رومانيا',
  'الاتحاد الروسي',
  'رواندا',
  'سانت كيتس ونيفيس',
  'سانت لوسيا',
  'سانت فنسنت وجزر غرينادين',
  'ساموا',
  'سان مارينو',
  'ساو توم',
  'برينسيبي',
  'السعودية',
  'السنغال',
  'صربيا',
  'سيشيل',
  'سيراليون',
  'سنغافورة',
  'سلوفاكيا',
  'سلوفينيا',
  'جزر سليمان',
  'الصومال',
  'جنوب إفريقيا',
  'جنوب السودان',
  'إسبانيا',
  'سريلانكا',
  'السودان',
  'سورينام',
  'سوازيلاند',
  'السويد',
  'سويسرا',
  'سوريا',
  'تايوان',
  'طاجيكستان',
  'تنزانيا',
  'تايلاند',
  'توجو',
  'تونغا',
  'ترينيداد وتوباجو',
  'تونس',
  'تركيا',
  'تركمانستان',
  'توفالو',
  'أوغندا',
  'أوكرانيا',
  'الإمارات العربية المتحدة',
  'المملكة المتحدة',
  'الولايات المتحدة',
  'أوروغواي',
  'أوزبكستان',
  'فانواتو',
  'مدينة الفاتيكان',
  'فنزويلا',
  'فيتنام',
  'اليمن',
  'زامبيا',
  'زيمبابوي',
];

const nationalityOptions = ['--الجنسية--', ...countryOptions];
const residenceOptions = ['--بلد الإقامة--', ...countryOptions];
const shareResidenceOptions = ['--مكان الإقامة --', ...countryOptions];
const genderOptions = ['--الجنس--', 'ذكر', 'انثى'];

const shareIdeaFields: ParticipateFormField[] = [
  {
    id: 'fullName',
    sourceName: 'full-name',
    label: 'الاسم ثلاثي',
    placeholder: 'الاسم ثلاثي',
    type: 'text',
    required: true,
  },
  {
    id: 'age',
    sourceName: 'age',
    label: 'العمر',
    placeholder: 'العمر',
    type: 'text',
    required: true,
    inputMode: 'numeric',
  },
  {
    id: 'nationality',
    sourceName: 'menu-874',
    label: 'الجنسية',
    type: 'select',
    required: false,
    options: nationalityOptions,
  },
  {
    id: 'residenceCountry',
    sourceName: 'menu-252',
    label: 'مكان الإقامة',
    type: 'select',
    required: false,
    options: shareResidenceOptions,
  },
  {
    id: 'education',
    sourceName: 'text-482',
    label: 'المؤهل العلمي (التخصص)',
    placeholder: 'المؤهل العلمي (التخصص)',
    type: 'text',
    required: false,
  },
  {
    id: 'gender',
    sourceName: 'menu-766',
    label: 'الجنس',
    type: 'select',
    required: false,
    options: genderOptions,
  },
  {
    id: 'phone',
    sourceName: 'tel-907',
    label: 'رقم التواصل',
    placeholder: 'رقم التواصل',
    type: 'tel',
    required: false,
    inputMode: 'tel',
  },
  {
    id: 'email',
    sourceName: 'email-370',
    label: 'البريدالاكلتروني',
    placeholder: 'البريدالاكلتروني',
    type: 'email',
    required: true,
    inputMode: 'email',
  },
  {
    id: 'ideaDescription',
    sourceName: 'your-message',
    label: 'وصف الفكرة',
    placeholder: 'وصف الفكرة',
    type: 'textarea',
    required: false,
    rows: 6,
  },
];

const complaintsFields: ParticipateFormField[] = [
  {
    id: 'fullName',
    sourceName: 'full-name',
    label: 'الاسم الثلاثي مع اللقب (إختياري)',
    placeholder: 'الاسم الثلاثي مع اللقب (إختياري)',
    type: 'text',
    required: false,
  },
  {
    id: 'phone',
    sourceName: 'tel-586',
    label: 'رقم التواصل (إختياري)',
    placeholder: 'رقم التواصل (إختياري)',
    type: 'tel',
    required: false,
    inputMode: 'tel',
  },
  {
    id: 'subject',
    sourceName: 'text-702',
    label: 'الموضوع',
    placeholder: 'الموضوع',
    type: 'text',
    required: true,
  },
  {
    id: 'message',
    sourceName: 'text-700',
    label: 'نص الشكوى او المقترح',
    placeholder: 'نص الشكوى او المقترح',
    type: 'textarea',
    required: true,
    rows: 6,
  },
  {
    id: 'attachment',
    sourceName: 'file-226',
    label: 'ملف مرفق (إختياري)',
    type: 'file',
    required: false,
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  },
];

const volunteerFields: ParticipateFormField[] = [
  {
    id: 'fullName',
    sourceName: 'full-name',
    label: 'الإسم بالكامل*',
    placeholder: 'ابراهيم محمد احمد',
    type: 'text',
    required: true,
  },
  {
    id: 'age',
    sourceName: 'age',
    label: 'العمر*',
    placeholder: '35',
    type: 'text',
    required: true,
    inputMode: 'numeric',
  },
  {
    id: 'education',
    sourceName: 'text-458',
    label: 'المستوى الدراسي (التخصص)*',
    placeholder: 'المستوى الدراسي (التخصص)',
    type: 'text',
    required: true,
  },
  {
    id: 'job',
    sourceName: 'job',
    label: 'الوظيفة*',
    placeholder: 'مهندس',
    type: 'text',
    required: true,
  },
  {
    id: 'nationality',
    sourceName: 'menu-874',
    label: 'الجنسية*',
    type: 'select',
    required: true,
    options: nationalityOptions,
  },
  {
    id: 'gender',
    sourceName: 'menu-766',
    label: 'الجنس*',
    type: 'select',
    required: true,
    options: genderOptions,
  },
  {
    id: 'residenceCountry',
    sourceName: 'menu-252',
    label: 'بلد الاقامة*',
    type: 'select',
    required: true,
    options: residenceOptions,
  },
  {
    id: 'city',
    sourceName: 'text-7882',
    label: 'المدينة*',
    placeholder: 'المدينة',
    type: 'text',
    required: true,
  },
  {
    id: 'experience',
    sourceName: 'experience',
    label: 'الخبرات*',
    placeholder: 'الخبرات',
    type: 'text',
    required: true,
  },
  {
    id: 'volunteerField',
    sourceName: 'volunteer-field',
    label: 'مجال التطوع*',
    placeholder: 'مجال التطوع',
    type: 'text',
    required: true,
  },
  {
    id: 'desiredActivities',
    sourceName: 'desired-activities',
    label: 'الأنشطة التطوعية التي ترغب بالتطوع فيها*',
    placeholder: 'الأنشطة التطوعية التي ترغب بالتطوع فيها',
    type: 'textarea',
    required: true,
    rows: 4,
  },
  {
    id: 'mobile',
    sourceName: 'phonetext-440',
    label: 'رقم الجوال*',
    placeholder: 'رقم الجوال',
    type: 'tel',
    required: true,
    inputMode: 'tel',
  },
  {
    id: 'whatsapp',
    sourceName: 'phonetext-586',
    label: 'رقم الواتس اب*',
    placeholder: 'رقم الواتس اب',
    type: 'tel',
    required: true,
    inputMode: 'tel',
  },
  {
    id: 'email',
    sourceName: 'your-email',
    label: 'البريد الإلكتروني*',
    placeholder: 'البريد الإلكتروني',
    type: 'email',
    required: true,
    inputMode: 'email',
  },
];

const navLabels: Record<Locale, ParticipateNavItem[]> = {
  ar: [
    { key: 'shareIdeas', label: 'شاركنا بأفكارك', href: participateRoutes.shareIdeas },
    { key: 'complaintsSuggestions', label: 'الشكاوى والمقترحات', href: participateRoutes.complaintsSuggestions },
    { key: 'volunteer', label: 'تطوع معنا', href: participateRoutes.volunteer },
    { key: 'contact', label: 'بيانات التواصل', href: participateRoutes.contact },
  ],
  en: [
    { key: 'shareIdeas', label: 'Share Your Ideas', href: participateRoutes.shareIdeas },
    { key: 'complaintsSuggestions', label: 'Complaints and Suggestions', href: participateRoutes.complaintsSuggestions },
    { key: 'volunteer', label: 'Volunteer With Us', href: participateRoutes.volunteer },
    { key: 'contact', label: 'Contact Details', href: participateRoutes.contact },
  ],
  tr: [
    { key: 'shareIdeas', label: 'Fikirlerinizi Paylaşın', href: participateRoutes.shareIdeas },
    { key: 'complaintsSuggestions', label: 'Şikayet ve Öneriler', href: participateRoutes.complaintsSuggestions },
    { key: 'volunteer', label: 'Gönüllü Olun', href: participateRoutes.volunteer },
    { key: 'contact', label: 'İletişim Bilgileri', href: participateRoutes.contact },
  ],
};

const labels: Record<Locale, ParticipateLabels> = {
  ar: {
    home: 'الرئيسية',
    participate: 'شاركنا',
    sectionTitle: 'أقسام شاركنا',
    formNotice:
      'تُرسل بياناتك مباشرة إلى فريق الوقف عبر هذا الموقع، وتُستخدم فقط للرد عليك ومتابعة طلبك، ولا تُنشر أو تُشارك مع أي جهة أخرى.',
    submit: 'إرسال',
    submitting: 'جار الإرسال',
    next: 'التالي',
    previous: 'السابق',
    step: 'خطوة',
    requiredMessage: 'هذا الحقل مطلوب.',
    emailMessage: 'يرجى إدخال بريد إلكتروني صحيح.',
    submitSuccess: 'تم إرسال النموذج عبر خدمة الاستقبال المفعلة.',
    submitError: 'تعذر إرسال النموذج حاليًا. يرجى المحاولة لاحقًا أو التواصل عبر الروابط الرسمية.',
    selectedFiles: 'الملفات المختارة',
    openLink: 'فتح الرابط',
  },
  en: {
    home: 'Home',
    participate: 'Participate',
    sectionTitle: 'Participate Sections',
    formNotice:
      'Your details are sent directly to the waqf team through this website. They are used only to reply to you and follow up on your request, and are never published or shared with third parties.',
    submit: 'Submit',
    submitting: 'Submitting',
    next: 'Next',
    previous: 'Previous',
    step: 'Step',
    requiredMessage: 'This field is required.',
    emailMessage: 'Please enter a valid email address.',
    submitSuccess: 'The form was sent through the configured receiving service.',
    submitError: 'The form could not be sent now. Please try later or use the official contact links.',
    selectedFiles: 'Selected files',
    openLink: 'Open link',
  },
  tr: {
    home: 'Ana Sayfa',
    participate: 'Katıl',
    sectionTitle: 'Katılım Bölümleri',
    formNotice:
      'Bilgileriniz bu site üzerinden doğrudan vakıf ekibine iletilir; yalnızca size yanıt vermek ve talebinizi takip etmek için kullanılır, yayımlanmaz ve üçüncü taraflarla paylaşılmaz.',
    submit: 'Gönder',
    submitting: 'Gönderiliyor',
    next: 'Sonraki',
    previous: 'Önceki',
    step: 'Adım',
    requiredMessage: 'Bu alan zorunludur.',
    emailMessage: 'Lütfen geçerli bir e-posta adresi girin.',
    submitSuccess: 'Form, tanımlı alma servisi üzerinden gönderildi.',
    submitError: 'Form şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin veya resmi iletişim bağlantılarını kullanın.',
    selectedFiles: 'Seçilen dosyalar',
    openLink: 'Bağlantıyı aç',
  },
};

const localizedText = {
  ar: {
    heroAlt: 'صورة رسمية لقسم تطوع معنا في وقف أويس القرني',
    volunteerSteps: {
      basic: 'البيانات الأساسية',
      residence: 'الجنسية والإقامة',
      volunteering: 'الخبرات والتطوع',
      contact: 'بيانات التواصل',
    },
    pages: {
      shareIdeas: {
        title: 'شاركنا بأفكارك',
        eyebrow: 'مساحة للأفكار والمقترحات',
        introTitle: 'أحياناً فكرة أو رأي يتم تطويرها والعمل بها تتغير موازين كثيرة',
        description:
          'أحياناً فكرة أو رأي يتم تطويرها والعمل بها تتغير موازين كثيرة فمعظم الدول التي نهضت كانت نهضتها بخطط استراتيجية مبنية على أفكار جمعت من هنا وهناك وصيغت على شكل خطط وبرامج لها أهداف مزمنة ليتم العمل بها لتتطور البلدان وتنمو المجتمعات ويبنى الوطن فلا تبخلوا علينا بأفكاركم ومقترحاتكم',
        formTitle: 'نموذج إرسال الأفكار',
        formDescription: 'الحقول أدناه من نموذج صفحة شاركنا بأفكارك الرسمية.',
      },
      complaintsSuggestions: {
        title: 'الشكاوى والمقترحات',
        eyebrow: 'تحسين جودة العمل',
        introTitle: 'بوابة لطرح المقترحات والشكاوى',
        description:
          'من خلال هذه البوابة يمكنكم طرح مقترحاتكم وشكواكم من أجل تحسين جودة العمل يمكنك التواصل معنا عبر العناوين التالية : 00905386869333 او على الايميل التالي info@veysvakfi.org',
        formTitle: 'نموذج الشكاوى والمقترحات',
        formDescription: 'نموذج رسمي مخصص لطرح الموضوع ونص الشكوى أو المقترح مع مرفق اختياري.',
      },
      volunteer: {
        title: 'تطوع معنا',
        eyebrow: 'وحدة التطوع',
        introTitle: 'نؤمن أن بناء يمن جديد يبدأ من العمل المشترك',
        paragraphs: [
          'نؤمن أن بناء يمن جديد يبدأ من العمل المشترك والتكاثف بين أبناء الوطن، من أجل بناء يمن جديد تسوده المحبة والوئام، ومن أجل تنمية اليمن ونهضته، تتكاثف الأيدي وتتلاقح الأفكار لتوحيد الجهود والعمل معًا كالجسد الواحد، إسهاماتكم ومبادراتكم تشكل حجر الأساس حيث يساهم كل فرد في صنع مستقبل مشرق للأجيال القادمة.',
          'تطوعكم يعني الكثير وأفكاركم تضيف قيمة لكل خطوة نخطوها نحو تحقيق نهضة اليمن، لنعمل معا لخلق واقع أفضل ومستقبل مشرق لأبناء اليمن في الداخل والخارج. شاركونا رؤاكم وأفكاركم لنُعزز العمل التطوعي ونُحدث التغيير الإيجابي الذي نتطلع إليه.',
          'تطوع معنا عبر: الهاتف: +90 536 745 6199، البريد الإلكتروني: volunteering@veysvakfi.org، نموذج التواصل: يمكنكم تعبئته أدناه لنكون دائمًا على تواصل.',
          'كل جهد مهما كان بسيطًا يساهم في رسم ملامح يمنٍ أفضل. فلنتحد معًا ونعمل يدًا بيد لبناء المستقبل الذي نحلم به ولنكتب قصة نجاح جديدة تضاف إلى تاريخ اليمن العظيم.',
          '#تطوعك_وقف #تطوع_لأجل_اليمن',
        ],
        formTitle: 'نموذج التطوع',
        formDescription: 'نموذج التطوع الرسمي مقسم إلى خطوات خفيفة دون حذف أي حقل.',
      },
      contact: {
        title: 'بيانات التواصل',
        eyebrow: 'الاتصال والتواصل',
        introTitle: 'تواصل معنا (روابط مباشرة)',
        description:
          'روابط التواصل الرسمية مع مدير مكتب رئيس مجلس الإدارة، إدارة الإعلام، العلاقات والتسويق، وإدارة البرامج، إضافة إلى صفحات وقف أويس القرني على المنصات الاجتماعية.',
        directTitle: 'تواصل معنا (روابط مباشرة)',
        directDescription: 'روابط واتساب كما وردت في صفحة بيانات التواصل الرسمية.',
        socialTitle: 'صفحات وقف أويس القرني',
        socialDescription: 'روابط المنصات الاجتماعية المنشورة في المصدر الرسمي.',
      },
    },
  },
  en: {
    heroAlt: 'Official volunteer section image from Veysel Karani Waqf',
    volunteerSteps: {
      basic: 'Basic Details',
      residence: 'Nationality and Residence',
      volunteering: 'Experience and Volunteering',
      contact: 'Contact Details',
    },
    pages: {
      shareIdeas: {
        title: 'Share Your Ideas',
        eyebrow: 'Ideas and suggestions',
        introTitle: 'A developed idea can change many balances',
        description:
          'The official page invites visitors to share ideas and proposals that can be developed into plans, programs, and goals that help communities grow and build the homeland.',
        formTitle: 'Ideas Form',
        formDescription: 'These fields are transferred from the official Share Your Ideas form.',
      },
      complaintsSuggestions: {
        title: 'Complaints and Suggestions',
        eyebrow: 'Improving work quality',
        introTitle: 'A gateway for complaints and suggestions',
        description:
          'Through this gateway, visitors can submit complaints and suggestions to improve work quality, with the official contact number 00905386869333 and email info@veysvakfi.org.',
        formTitle: 'Complaints and Suggestions Form',
        formDescription: 'Official fields for the topic, complaint or suggestion text, and an optional attachment.',
      },
      volunteer: {
        title: 'Volunteer With Us',
        eyebrow: 'Volunteer Unit',
        introTitle: 'Building a new Yemen begins with joint work',
        paragraphs: [
          'The official volunteer page stresses that building a new Yemen begins with joint work, solidarity, and shared efforts among Yemenis.',
          'Volunteering and ideas add value to every step toward a better reality and a brighter future for Yemenis at home and abroad.',
          'Official volunteer contact: phone +90 536 745 6199, email volunteering@veysvakfi.org, and the form below.',
          'Every effort, however simple, contributes to shaping a better Yemen and writing a new success story.',
          '#تطوعك_وقف #تطوع_لأجل_اليمن',
        ],
        formTitle: 'Volunteer Form',
        formDescription: 'The official volunteer form is presented in light steps without removing any field.',
      },
      contact: {
        title: 'Contact Details',
        eyebrow: 'Communication',
        introTitle: 'Direct contact links',
        description:
          'Official contact links for the office of the board chair, media, relations and marketing, programs, and the waqf social media pages.',
        directTitle: 'Direct Contact Links',
        directDescription: 'WhatsApp links as published on the official contact details page.',
        socialTitle: 'Veysel Karani Waqf Pages',
        socialDescription: 'Social platform links published by the official source.',
      },
    },
  },
  tr: {
    heroAlt: 'Veysel Karani Vakfı gönüllülük bölümü resmi görseli',
    volunteerSteps: {
      basic: 'Temel Bilgiler',
      residence: 'Uyruk ve İkamet',
      volunteering: 'Deneyim ve Gönüllülük',
      contact: 'İletişim Bilgileri',
    },
    pages: {
      shareIdeas: {
        title: 'Fikirlerinizi Paylaşın',
        eyebrow: 'Fikirler ve öneriler',
        introTitle: 'Geliştirilen bir fikir pek çok dengeyi değiştirebilir',
        description:
          'Resmi sayfa, ziyaretçileri toplumların gelişmesine ve vatanın inşasına katkı sağlayabilecek fikir ve önerilerini paylaşmaya davet eder.',
        formTitle: 'Fikir Gönderme Formu',
        formDescription: 'Bu alanlar resmi Fikirlerinizi Paylaşın formundan aktarılmıştır.',
      },
      complaintsSuggestions: {
        title: 'Şikayet ve Öneriler',
        eyebrow: 'Çalışma kalitesini geliştirme',
        introTitle: 'Şikayet ve öneriler için bir kapı',
        description:
          'Bu kapı üzerinden çalışma kalitesini geliştirmek için şikayet ve öneriler iletilebilir. Resmi iletişim numarası 00905386869333 ve e-posta info@veysvakfi.org.',
        formTitle: 'Şikayet ve Öneri Formu',
        formDescription: 'Konu, şikayet veya öneri metni ve isteğe bağlı ek için resmi alanlar.',
      },
      volunteer: {
        title: 'Gönüllü Olun',
        eyebrow: 'Gönüllülük Birimi',
        introTitle: 'Yeni bir Yemen inşa etmek ortak çalışma ile başlar',
        paragraphs: [
          'Resmi gönüllülük sayfası, yeni bir Yemen inşasının ortak çalışma, dayanışma ve Yemenliler arasındaki güç birliğiyle başladığını vurgular.',
          'Gönüllülüğünüz ve fikirleriniz, Yemenliler için daha iyi bir gerçeklik ve parlak bir geleceğe atılan her adıma değer katar.',
          'Resmi gönüllülük iletişimi: telefon +90 536 745 6199, e-posta volunteering@veysvakfi.org ve aşağıdaki form.',
          'Ne kadar küçük olursa olsun her emek daha iyi bir Yemenin çizgilerini belirlemeye katkı sağlar.',
          '#تطوعك_وقف #تطوع_لأجل_اليمن',
        ],
        formTitle: 'Gönüllülük Formu',
        formDescription: 'Resmi gönüllülük formu hiçbir alan silinmeden hafif adımlara bölünmüştür.',
      },
      contact: {
        title: 'İletişim Bilgileri',
        eyebrow: 'İletişim',
        introTitle: 'Doğrudan iletişim bağlantıları',
        description:
          'Yönetim kurulu başkanı ofisi, medya, ilişkiler ve pazarlama, programlar ve vakfın sosyal medya sayfaları için resmi iletişim bağlantıları.',
        directTitle: 'Doğrudan İletişim Bağlantıları',
        directDescription: 'Resmi iletişim bilgileri sayfasında yayımlanan WhatsApp bağlantıları.',
        socialTitle: 'Veysel Karani Vakfı Sayfaları',
        socialDescription: 'Resmi kaynakta yayımlanan sosyal platform bağlantıları.',
      },
    },
  },
} as const;

const directContactLinks: ParticipateContactLink[] = [
  {
    id: 'board-office',
    label: 'مدير مكتب رئيس مجلس الإدارة',
    href: 'https://wa.me/9005300523946?text=',
    kind: 'whatsapp',
  },
  {
    id: 'media',
    label: 'إدارة الإعلام',
    href: 'https://wa.me/9005386869333?text=',
    kind: 'whatsapp',
  },
  {
    id: 'relations-marketing',
    label: 'العلاقات والتسويق',
    href: 'https://wa.me/9005384314195?text=',
    kind: 'whatsapp',
  },
  {
    id: 'programs',
    label: 'إدارة البرامج',
    href: 'https://wa.me/9005300523945?text=',
    kind: 'whatsapp',
  },
];

const socialLinks: ParticipateContactLink[] = [
  {
    id: 'facebook',
    label: 'وقف أويس القرني - فيسبوك',
    href: 'https://www.facebook.com/veysvakfi/?locale=ar_AR',
    kind: 'social',
  },
  {
    id: 'x',
    label: 'وقف أويس القرني - منصة X',
    href: 'https://x.com/veysvakfi?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
    kind: 'social',
  },
  {
    id: 'instagram',
    label: 'وقف أويس القرني - انتسغرام',
    href: 'https://www.instagram.com/veysvakfi/',
    kind: 'social',
  },
  {
    id: 'youtube',
    label: 'وقف أويس القرني - يوتيوب',
    href: 'https://www.youtube.com/channel/UCCZ8-gIhjPkqy1KaBkr1Q8A',
    kind: 'social',
  },
];

function pageBreadcrumbs(
  crumbs: Pick<ParticipateLabels, 'home' | 'participate'>,
  pageTitle: string,
): BreadcrumbItem[] {
  return [
    { label: crumbs.home, href: '/' },
    { label: crumbs.participate, href: participateRoutes.shareIdeas },
    { label: pageTitle },
  ];
}

function buildPages(locale: Locale): Record<ParticipatePageKey, ParticipatePageContent> {
  const text = localizedText[locale];
  const crumbs = labels[locale];
  const share = text.pages.shareIdeas;
  const complaints = text.pages.complaintsSuggestions;
  const volunteer = text.pages.volunteer;
  const contact = text.pages.contact;

  return {
    shareIdeas: {
      key: 'shareIdeas',
      slug: slugByKey.shareIdeas,
      route: routeByKey.shareIdeas,
      sourceUrl: participateSources.shareIdeas,
      seo: {
        title: `${share.title} | وقف أويس القرني`,
        description: share.description,
      },
      hero: {
        title: share.title,
        description: share.description,
        image: participateHeroImage,
        imageAlt: text.heroAlt,
      },
      breadcrumbs: pageBreadcrumbs(crumbs,share.title),
      intro: {
        eyebrow: share.eyebrow,
        title: share.introTitle,
        paragraphs: [share.description],
      },
      form: {
        id: 'share-ideas',
        title: share.formTitle,
        description: share.formDescription,
        fields: shareIdeaFields,
        groups: [
          {
            id: 'idea',
            title: share.formTitle,
            description: share.formDescription,
            fieldIds: shareIdeaFields.map((field) => field.id),
          },
        ],
      },
    },
    complaintsSuggestions: {
      key: 'complaintsSuggestions',
      slug: slugByKey.complaintsSuggestions,
      route: routeByKey.complaintsSuggestions,
      sourceUrl: participateSources.complaintsSuggestions,
      seo: {
        title: `${complaints.title} | وقف أويس القرني`,
        description: complaints.description,
      },
      hero: {
        title: complaints.title,
        description: complaints.description,
        image: participateHeroImage,
        imageAlt: text.heroAlt,
      },
      breadcrumbs: pageBreadcrumbs(crumbs,complaints.title),
      intro: {
        eyebrow: complaints.eyebrow,
        title: complaints.introTitle,
        paragraphs: [complaints.description],
      },
      form: {
        id: 'complaints-suggestions',
        title: complaints.formTitle,
        description: complaints.formDescription,
        fields: complaintsFields,
        groups: [
          {
            id: 'complaint',
            title: complaints.formTitle,
            description: complaints.formDescription,
            fieldIds: complaintsFields.map((field) => field.id),
          },
        ],
      },
    },
    volunteer: {
      key: 'volunteer',
      slug: slugByKey.volunteer,
      route: routeByKey.volunteer,
      sourceUrl: participateSources.volunteer,
      seo: {
        title: `${volunteer.title} | وقف أويس القرني`,
        description: volunteer.paragraphs[0],
      },
      hero: {
        title: volunteer.title,
        description: volunteer.paragraphs[0],
        image: participateHeroImage,
        imageAlt: text.heroAlt,
      },
      breadcrumbs: pageBreadcrumbs(crumbs,volunteer.title),
      intro: {
        eyebrow: volunteer.eyebrow,
        title: volunteer.introTitle,
        paragraphs: [...volunteer.paragraphs],
      },
      form: {
        id: 'volunteer',
        title: volunteer.formTitle,
        description: volunteer.formDescription,
        fields: volunteerFields,
        groups: [
          {
            id: 'basic',
            title: text.volunteerSteps.basic,
            fieldIds: ['fullName', 'age', 'education', 'job'],
          },
          {
            id: 'residence',
            title: text.volunteerSteps.residence,
            fieldIds: ['nationality', 'gender', 'residenceCountry', 'city'],
          },
          {
            id: 'volunteering',
            title: text.volunteerSteps.volunteering,
            fieldIds: ['experience', 'volunteerField', 'desiredActivities'],
          },
          {
            id: 'contact',
            title: text.volunteerSteps.contact,
            fieldIds: ['mobile', 'whatsapp', 'email'],
          },
        ],
      },
    },
    contact: {
      key: 'contact',
      slug: slugByKey.contact,
      route: routeByKey.contact,
      sourceUrl: participateSources.contact,
      seo: {
        title: `${contact.title} | وقف أويس القرني`,
        description: contact.description,
      },
      hero: {
        title: contact.title,
        description: contact.description,
        image: participateHeroImage,
        imageAlt: text.heroAlt,
      },
      breadcrumbs: pageBreadcrumbs(crumbs,contact.title),
      intro: {
        eyebrow: contact.eyebrow,
        title: contact.introTitle,
        paragraphs: [contact.description],
      },
      contact: {
        directTitle: contact.directTitle,
        directDescription: contact.directDescription,
        socialTitle: contact.socialTitle,
        socialDescription: contact.socialDescription,
        directLinks: directContactLinks,
        socialLinks,
      },
    },
  };
}

export function getParticipateContent(locale: Locale): ParticipateContent {
  const merged = cmsPageContent('participate', locale, {
    nav: navLabels[locale],
    labels: labels[locale],
    pages: buildPages(locale),
  });

  // Breadcrumbs are not edited directly; they follow the (editable) crumb
  // labels and each page's hero title, so rebuild them after the CMS merge.
  const crumbs = { home: merged.labels.home, participate: merged.labels.participate };
  const pages = Object.fromEntries(
    Object.entries(merged.pages).map(([key, page]) => [
      key,
      { ...page, breadcrumbs: pageBreadcrumbs(crumbs, page.hero?.title ?? '') },
    ]),
  ) as Record<ParticipatePageKey, ParticipatePageContent>;

  return { ...merged, nav: merged.nav ?? [], pages };
}

export function getParticipatePage(locale: Locale, key: ParticipatePageKey): ParticipatePageContent {
  return getParticipateContent(locale).pages[key];
}

export function getParticipatePageBySlug(locale: Locale, slug: string | undefined): ParticipatePageContent | undefined {
  if (!slug) return undefined;
  const pages = getParticipateContent(locale).pages;

  return Object.values(pages).find((page) => page.slug === slug);
}

/** The participate pages as they ship in this repo, ignoring the CMS. */
export function staticParticipateContent(locale: Locale): ParticipateContent {
  return { nav: navLabels[locale], labels: labels[locale], pages: buildPages(locale) };
}
