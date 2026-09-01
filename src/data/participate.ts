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

const countryOptionsEn = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo (Democratic Republic)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'North Korea',
  'South Korea',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'North Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Eswatini',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const countryOptionsTr = [
  'Afganistan',
  'Arnavutluk',
  'Cezayir',
  'Andorra',
  'Angola',
  'Antigua ve Barbuda',
  'Arjantin',
  'Ermenistan',
  'Avustralya',
  'Avusturya',
  'Azerbaycan',
  'Bahamalar',
  'Bahreyn',
  'Bangladeş',
  'Barbados',
  'Belarus',
  'Belçika',
  'Belize',
  'Benin',
  'Butan',
  'Bolivya',
  'Bosna-Hersek',
  'Botsvana',
  'Brezilya',
  'Brunei',
  'Bulgaristan',
  'Burkina Faso',
  'Burundi',
  'Kamboçya',
  'Kamerun',
  'Kanada',
  'Yeşil Burun Adaları',
  'Orta Afrika Cumhuriyeti',
  'Çad',
  'Şili',
  'Çin',
  'Kolombiya',
  'Komorlar',
  'Kongo',
  'Demokratik Kongo Cumhuriyeti',
  'Kosta Rika',
  'Hırvatistan',
  'Küba',
  'Kıbrıs',
  'Çekya',
  'Danimarka',
  'Cibuti',
  'Dominika',
  'Dominik Cumhuriyeti',
  'Doğu Timor',
  'Ekvador',
  'Mısır',
  'El Salvador',
  'Ekvator Ginesi',
  'Eritre',
  'Estonya',
  'Etiyopya',
  'Fiji',
  'Finlandiya',
  'Fransa',
  'Gabon',
  'Gambiya',
  'Gürcistan',
  'Almanya',
  'Gana',
  'Yunanistan',
  'Grenada',
  'Guatemala',
  'Gine',
  'Gine-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Macaristan',
  'İzlanda',
  'Hindistan',
  'Endonezya',
  'İran',
  'Irak',
  'İrlanda',
  'İtalya',
  'Fildişi Sahili',
  'Jamaika',
  'Japonya',
  'Ürdün',
  'Kazakistan',
  'Kenya',
  'Kiribati',
  'Kuzey Kore',
  'Güney Kore',
  'Kosova',
  'Kuveyt',
  'Kırgızistan',
  'Laos',
  'Letonya',
  'Lübnan',
  'Lesoto',
  'Liberya',
  'Libya',
  'Lihtenştayn',
  'Litvanya',
  'Lüksemburg',
  'Kuzey Makedonya',
  'Madagaskar',
  'Malavi',
  'Malezya',
  'Maldivler',
  'Mali',
  'Malta',
  'Marshall Adaları',
  'Moritanya',
  'Mauritius',
  'Meksika',
  'Mikronezya',
  'Moldova',
  'Monako',
  'Moğolistan',
  'Karadağ',
  'Fas',
  'Mozambik',
  'Myanmar (Burma)',
  'Namibya',
  'Nauru',
  'Nepal',
  'Hollanda',
  'Yeni Zelanda',
  'Nikaragua',
  'Nijer',
  'Nijerya',
  'Norveç',
  'Umman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua Yeni Gine',
  'Paraguay',
  'Peru',
  'Filipinler',
  'Polonya',
  'Portekiz',
  'Katar',
  'Romanya',
  'Rusya Federasyonu',
  'Ruanda',
  'Saint Kitts ve Nevis',
  'Saint Lucia',
  'Saint Vincent ve Grenadinler',
  'Samoa',
  'San Marino',
  'São Tomé ve Príncipe',
  'Suudi Arabistan',
  'Senegal',
  'Sırbistan',
  'Seyşeller',
  'Sierra Leone',
  'Singapur',
  'Slovakya',
  'Slovenya',
  'Solomon Adaları',
  'Somali',
  'Güney Afrika',
  'Güney Sudan',
  'İspanya',
  'Sri Lanka',
  'Sudan',
  'Surinam',
  'Esvatini',
  'İsveç',
  'İsviçre',
  'Suriye',
  'Tayvan',
  'Tacikistan',
  'Tanzanya',
  'Tayland',
  'Togo',
  'Tonga',
  'Trinidad ve Tobago',
  'Tunus',
  'Türkiye',
  'Türkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukrayna',
  'Birleşik Arap Emirlikleri',
  'Birleşik Krallık',
  'Amerika Birleşik Devletleri',
  'Uruguay',
  'Özbekistan',
  'Vanuatu',
  'Vatikan',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambiya',
  'Zimbabve',
];

const countryOptionsByLocale: Record<Locale, string[]> = {
  ar: countryOptions,
  en: countryOptionsEn,
  tr: countryOptionsTr,
};

// The share-ideas form renders these labels straight from here for all three
// locales; the volunteer and complaints forms below are still Arabic-only.
const shareIdeaFieldText: Record<
  Locale,
  {
    fullName: string;
    age: string;
    nationality: string;
    nationalityPlaceholder: string;
    residence: string;
    residencePlaceholder: string;
    education: string;
    gender: string;
    genderPlaceholder: string;
    male: string;
    female: string;
    phone: string;
    email: string;
    idea: string;
    ideaPlaceholder: string;
  }
> = {
  ar: {
    fullName: 'الاسم ثلاثي',
    age: 'العمر',
    nationality: 'الجنسية',
    nationalityPlaceholder: '--الجنسية--',
    residence: 'مكان الإقامة',
    residencePlaceholder: '--مكان الإقامة --',
    education: 'المؤهل العلمي (التخصص)',
    gender: 'الجنس',
    genderPlaceholder: '--الجنس--',
    male: 'ذكر',
    female: 'انثى',
    phone: 'رقم التواصل',
    email: 'البريد الإلكتروني',
    idea: 'وصف الفكرة',
    ideaPlaceholder: 'وصف الفكرة',
  },
  en: {
    fullName: 'Full Name',
    age: 'Age',
    nationality: 'Nationality',
    nationalityPlaceholder: '--Nationality--',
    residence: 'Place of Residence',
    residencePlaceholder: '--Place of Residence--',
    education: 'Educational Qualification (Specialization)',
    gender: 'Gender',
    genderPlaceholder: '--Gender--',
    male: 'Male',
    female: 'Female',
    phone: 'Contact Number',
    email: 'Email',
    idea: 'Idea Description',
    ideaPlaceholder: 'Describe your idea',
  },
  tr: {
    fullName: 'Ad Soyad',
    age: 'Yaş',
    nationality: 'Uyruk',
    nationalityPlaceholder: '--Uyruk--',
    residence: 'İkamet Yeri',
    residencePlaceholder: '--İkamet Yeri--',
    education: 'Eğitim Durumu (Uzmanlık Alanı)',
    gender: 'Cinsiyet',
    genderPlaceholder: '--Cinsiyet--',
    male: 'Erkek',
    female: 'Kadın',
    phone: 'İletişim Numarası',
    email: 'E-posta',
    idea: 'Fikir Açıklaması',
    ideaPlaceholder: 'Fikrinizi açıklayın',
  },
};

function shareIdeaFieldsFor(locale: Locale): ParticipateFormField[] {
  const t = shareIdeaFieldText[locale];
  const countries = countryOptionsByLocale[locale];

  return [
    {
      id: 'fullName',
      sourceName: 'full-name',
      label: t.fullName,
      placeholder: t.fullName,
      type: 'text',
      required: true,
    },
    {
      id: 'age',
      sourceName: 'age',
      label: t.age,
      placeholder: t.age,
      type: 'text',
      required: true,
      inputMode: 'numeric',
    },
    {
      id: 'nationality',
      sourceName: 'menu-874',
      label: t.nationality,
      type: 'select',
      required: false,
      options: [t.nationalityPlaceholder, ...countries],
    },
    {
      id: 'residenceCountry',
      sourceName: 'menu-252',
      label: t.residence,
      type: 'select',
      required: false,
      options: [t.residencePlaceholder, ...countries],
    },
    {
      id: 'education',
      sourceName: 'text-482',
      label: t.education,
      placeholder: t.education,
      type: 'text',
      required: false,
    },
    {
      id: 'gender',
      sourceName: 'menu-766',
      label: t.gender,
      type: 'select',
      required: false,
      options: [t.genderPlaceholder, t.male, t.female],
    },
    {
      id: 'phone',
      sourceName: 'tel-907',
      label: t.phone,
      placeholder: t.phone,
      type: 'tel',
      required: false,
      inputMode: 'tel',
    },
    {
      id: 'email',
      sourceName: 'email-370',
      label: t.email,
      placeholder: t.email,
      type: 'email',
      required: true,
      inputMode: 'email',
    },
    {
      id: 'ideaDescription',
      sourceName: 'your-message',
      label: t.idea,
      placeholder: t.ideaPlaceholder,
      type: 'textarea',
      required: false,
      rows: 6,
    },
  ];
}

const complaintsFieldText: Record<
  Locale,
  { fullName: string; phone: string; subject: string; message: string; attachment: string }
> = {
  ar: {
    fullName: 'الاسم الثلاثي مع اللقب (إختياري)',
    phone: 'رقم التواصل (إختياري)',
    subject: 'الموضوع',
    message: 'نص الشكوى او المقترح',
    attachment: 'ملف مرفق (إختياري)',
  },
  en: {
    fullName: 'Full Name with Surname (optional)',
    phone: 'Contact Number (optional)',
    subject: 'Subject',
    message: 'Complaint or Suggestion Text',
    attachment: 'Attachment (optional)',
  },
  tr: {
    fullName: 'Ad Soyad (isteğe bağlı)',
    phone: 'İletişim Numarası (isteğe bağlı)',
    subject: 'Konu',
    message: 'Şikayet veya Öneri Metni',
    attachment: 'Ek Dosya (isteğe bağlı)',
  },
};

function complaintsFieldsFor(locale: Locale): ParticipateFormField[] {
  const t = complaintsFieldText[locale];

  return [
    {
      id: 'fullName',
      sourceName: 'full-name',
      label: t.fullName,
      placeholder: t.fullName,
      type: 'text',
      required: false,
    },
    {
      id: 'phone',
      sourceName: 'tel-586',
      label: t.phone,
      placeholder: t.phone,
      type: 'tel',
      required: false,
      inputMode: 'tel',
    },
    {
      id: 'subject',
      sourceName: 'text-702',
      label: t.subject,
      placeholder: t.subject,
      type: 'text',
      required: true,
    },
    {
      id: 'message',
      sourceName: 'text-700',
      label: t.message,
      placeholder: t.message,
      type: 'textarea',
      required: true,
      rows: 6,
    },
    {
      id: 'attachment',
      sourceName: 'file-226',
      label: t.attachment,
      type: 'file',
      required: false,
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    },
  ];
}

const volunteerFieldText: Record<
  Locale,
  {
    fullName: string;
    fullNamePlaceholder: string;
    age: string;
    education: string;
    educationPlaceholder: string;
    job: string;
    jobPlaceholder: string;
    nationality: string;
    nationalityPlaceholder: string;
    gender: string;
    genderPlaceholder: string;
    male: string;
    female: string;
    residence: string;
    residencePlaceholder: string;
    city: string;
    experience: string;
    volunteerField: string;
    desiredActivities: string;
    mobile: string;
    whatsapp: string;
    email: string;
  }
> = {
  ar: {
    fullName: 'الإسم بالكامل*',
    fullNamePlaceholder: 'ابراهيم محمد احمد',
    age: 'العمر*',
    education: 'المستوى الدراسي (التخصص)*',
    educationPlaceholder: 'المستوى الدراسي (التخصص)',
    job: 'الوظيفة*',
    jobPlaceholder: 'مهندس',
    nationality: 'الجنسية*',
    nationalityPlaceholder: '--الجنسية--',
    gender: 'الجنس*',
    genderPlaceholder: '--الجنس--',
    male: 'ذكر',
    female: 'انثى',
    residence: 'بلد الاقامة*',
    residencePlaceholder: '--بلد الإقامة--',
    city: 'المدينة*',
    experience: 'الخبرات*',
    volunteerField: 'مجال التطوع*',
    desiredActivities: 'الأنشطة التطوعية التي ترغب بالتطوع فيها*',
    mobile: 'رقم الجوال*',
    whatsapp: 'رقم الواتس اب*',
    email: 'البريد الإلكتروني*',
  },
  en: {
    fullName: 'Full Name*',
    fullNamePlaceholder: 'Ibrahim Mohammed Ahmed',
    age: 'Age*',
    education: 'Education Level (Specialization)*',
    educationPlaceholder: 'Education Level (Specialization)',
    job: 'Occupation*',
    jobPlaceholder: 'Engineer',
    nationality: 'Nationality*',
    nationalityPlaceholder: '--Nationality--',
    gender: 'Gender*',
    genderPlaceholder: '--Gender--',
    male: 'Male',
    female: 'Female',
    residence: 'Country of Residence*',
    residencePlaceholder: '--Country of Residence--',
    city: 'City*',
    experience: 'Experience*',
    volunteerField: 'Volunteering Field*',
    desiredActivities: 'Volunteer activities you would like to take part in*',
    mobile: 'Mobile Number*',
    whatsapp: 'WhatsApp Number*',
    email: 'Email*',
  },
  tr: {
    fullName: 'Ad Soyad*',
    fullNamePlaceholder: 'Ahmet Yılmaz',
    age: 'Yaş*',
    education: 'Eğitim Düzeyi (Uzmanlık Alanı)*',
    educationPlaceholder: 'Eğitim Düzeyi (Uzmanlık Alanı)',
    job: 'Meslek*',
    jobPlaceholder: 'Mühendis',
    nationality: 'Uyruk*',
    nationalityPlaceholder: '--Uyruk--',
    gender: 'Cinsiyet*',
    genderPlaceholder: '--Cinsiyet--',
    male: 'Erkek',
    female: 'Kadın',
    residence: 'İkamet Ülkesi*',
    residencePlaceholder: '--İkamet Ülkesi--',
    city: 'Şehir*',
    experience: 'Deneyimler*',
    volunteerField: 'Gönüllülük Alanı*',
    desiredActivities: 'Katılmak istediğiniz gönüllü faaliyetler*',
    mobile: 'Cep Telefonu Numarası*',
    whatsapp: 'WhatsApp Numarası*',
    email: 'E-posta*',
  },
};

function volunteerFieldsFor(locale: Locale): ParticipateFormField[] {
  const t = volunteerFieldText[locale];
  const countries = countryOptionsByLocale[locale];

  return [
    {
      id: 'fullName',
      sourceName: 'full-name',
      label: t.fullName,
      placeholder: t.fullNamePlaceholder,
      type: 'text',
      required: true,
    },
    {
      id: 'age',
      sourceName: 'age',
      label: t.age,
      placeholder: '35',
      type: 'text',
      required: true,
      inputMode: 'numeric',
    },
    {
      id: 'education',
      sourceName: 'text-458',
      label: t.education,
      placeholder: t.educationPlaceholder,
      type: 'text',
      required: true,
    },
    {
      id: 'job',
      sourceName: 'job',
      label: t.job,
      placeholder: t.jobPlaceholder,
      type: 'text',
      required: true,
    },
    {
      id: 'nationality',
      sourceName: 'menu-874',
      label: t.nationality,
      type: 'select',
      required: true,
      options: [t.nationalityPlaceholder, ...countries],
    },
    {
      id: 'gender',
      sourceName: 'menu-766',
      label: t.gender,
      type: 'select',
      required: true,
      options: [t.genderPlaceholder, t.male, t.female],
    },
    {
      id: 'residenceCountry',
      sourceName: 'menu-252',
      label: t.residence,
      type: 'select',
      required: true,
      options: [t.residencePlaceholder, ...countries],
    },
    {
      id: 'city',
      sourceName: 'text-7882',
      label: t.city,
      placeholder: t.city.replace(/\*$/, ''),
      type: 'text',
      required: true,
    },
    {
      id: 'experience',
      sourceName: 'experience',
      label: t.experience,
      placeholder: t.experience.replace(/\*$/, ''),
      type: 'text',
      required: true,
    },
    {
      id: 'volunteerField',
      sourceName: 'volunteer-field',
      label: t.volunteerField,
      placeholder: t.volunteerField.replace(/\*$/, ''),
      type: 'text',
      required: true,
    },
    {
      id: 'desiredActivities',
      sourceName: 'desired-activities',
      label: t.desiredActivities,
      placeholder: t.desiredActivities.replace(/\*$/, ''),
      type: 'textarea',
      required: true,
      rows: 4,
    },
    {
      id: 'mobile',
      sourceName: 'phonetext-440',
      label: t.mobile,
      placeholder: t.mobile.replace(/\*$/, ''),
      type: 'tel',
      required: true,
      inputMode: 'tel',
    },
    {
      id: 'whatsapp',
      sourceName: 'phonetext-586',
      label: t.whatsapp,
      placeholder: t.whatsapp.replace(/\*$/, ''),
      type: 'tel',
      required: true,
      inputMode: 'tel',
    },
    {
      id: 'email',
      sourceName: 'your-email',
      label: t.email,
      placeholder: t.email.replace(/\*$/, ''),
      type: 'email',
      required: true,
      inputMode: 'email',
    },
  ];
}

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
    submitError: 'تعذر إرسال النموذج حاليًا. يرجى المحاولة لاحقًا أو التواصل معنا مباشرة.',
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
    submitError: 'The form could not be sent now. Please try later or use the direct contact links.',
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
    submitError: 'Form şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin veya doğrudan iletişim bağlantılarını kullanın.',
    selectedFiles: 'Seçilen dosyalar',
    openLink: 'Bağlantıyı aç',
  },
};

const localizedText = {
  ar: {
    heroAlt: 'صورة قسم تطوع معنا في وقف أويس القرني',
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
        formDescription: 'الحقول أدناه من نموذج صفحة شاركنا بأفكارك.',
      },
      complaintsSuggestions: {
        title: 'الشكاوى والمقترحات',
        eyebrow: 'تحسين جودة العمل',
        introTitle: 'بوابة لطرح المقترحات والشكاوى',
        description:
          'من خلال هذه البوابة يمكنكم طرح مقترحاتكم وشكواكم من أجل تحسين جودة العمل يمكنك التواصل معنا عبر العناوين التالية : 00905386869333 او على الايميل التالي info@veysvakfi.org',
        formTitle: 'نموذج الشكاوى والمقترحات',
        formDescription: 'نموذج مخصص لطرح الموضوع ونص الشكوى أو المقترح مع مرفق اختياري.',
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
        formDescription: 'نموذج التطوع مقسم إلى خطوات خفيفة دون حذف أي حقل.',
      },
      contact: {
        title: 'بيانات التواصل',
        eyebrow: 'الاتصال والتواصل',
        introTitle: 'تواصل معنا (روابط مباشرة)',
        description:
          'روابط التواصل مع مدير مكتب رئيس مجلس الإدارة، إدارة الإعلام، العلاقات والتسويق، وإدارة البرامج، إضافة إلى صفحات وقف أويس القرني على المنصات الاجتماعية.',
        directTitle: 'تواصل معنا (روابط مباشرة)',
        directDescription: 'روابط واتساب كما وردت في صفحة بيانات التواصل.',
        socialTitle: 'صفحات وقف أويس القرني',
        socialDescription: 'روابط منصات الوقف على الشبكات الاجتماعية.',
      },
    },
  },
  en: {
    heroAlt: 'Volunteer section image from Veysel Karani Waqf',
    volunteerSteps: {
      basic: 'Basic Details',
      residence: 'Nationality and Residence',
      volunteering: 'Experience and Volunteering',
      contact: 'Contact Details',
    },
    pages: {
      shareIdeas: {
        title: 'Share Your Ideas',
        eyebrow: 'A space for ideas and suggestions',
        introTitle: 'Sometimes a single developed idea can change many balances',
        description:
          'Sometimes an idea or an opinion, once developed and put into practice, can change many balances. Most nations that rose did so through strategic plans built on ideas gathered from here and there, shaped into programs with clear goals and timelines — so that countries develop, communities grow, and the homeland is built. So do not withhold your ideas and suggestions from us.',
        formTitle: 'Idea Submission Form',
        formDescription: 'Fill in the fields below to send us your idea.',
      },
      complaintsSuggestions: {
        title: 'Complaints and Suggestions',
        eyebrow: 'Improving work quality',
        introTitle: 'A gateway for complaints and suggestions',
        description:
          'Through this gateway you can submit your suggestions and complaints to help us improve the quality of our work. You can also reach us at 00905386869333 or by email at info@veysvakfi.org.',
        formTitle: 'Complaints and Suggestions Form',
        formDescription: 'Use the fields below to describe the subject and the text of your complaint or suggestion, with an optional attachment.',
      },
      volunteer: {
        title: 'Volunteer With Us',
        eyebrow: 'Volunteer Unit',
        introTitle: 'Building a new Yemen begins with joint work',
        paragraphs: [
          'We believe that building a new Yemen begins with joint work and solidarity among the sons of the homeland. For a new Yemen filled with love and harmony, and for Yemen’s development and revival, hands join together and ideas meet to unite efforts and work as one body. Your contributions and initiatives are the cornerstone, as every individual helps shape a bright future for the coming generations.',
          'Your volunteering means a lot, and your ideas add value to every step we take toward Yemen’s revival. Let us work together to create a better reality and a bright future for Yemenis at home and abroad. Share your visions and ideas with us so we can strengthen volunteer work and bring about the positive change we aspire to.',
          'Volunteer with us via: Phone: +90 536 745 6199, Email: volunteering@veysvakfi.org, or the contact form below so we can always stay in touch.',
          'Every effort, however simple, helps shape a better Yemen. Let us unite and work hand in hand to build the future we dream of, and write a new success story to add to Yemen’s great history.',
          '#YourVolunteeringIsWaqf #VolunteerForYemen',
        ],
        formTitle: 'Volunteer Form',
        formDescription: 'The volunteer form is presented in light steps without removing any field.',
      },
      contact: {
        title: 'Contact Details',
        eyebrow: 'Communication',
        introTitle: 'Direct contact links',
        description:
          'Contact links for the office of the board chair, media, relations and marketing, programs, and the waqf social media pages.',
        directTitle: 'Direct Contact Links',
        directDescription: 'WhatsApp links as published on the contact details page.',
        socialTitle: 'Veysel Karani Waqf Pages',
        socialDescription: 'The waqf’s social platform links.',
      },
    },
  },
  tr: {
    heroAlt: 'Veysel Karani Vakfı gönüllülük bölümü görseli',
    volunteerSteps: {
      basic: 'Temel Bilgiler',
      residence: 'Uyruk ve İkamet',
      volunteering: 'Deneyim ve Gönüllülük',
      contact: 'İletişim Bilgileri',
    },
    pages: {
      shareIdeas: {
        title: 'Fikirlerinizi Paylaşın',
        eyebrow: 'Fikir ve öneriler için bir alan',
        introTitle: 'Bazen geliştirilen tek bir fikir pek çok dengeyi değiştirebilir',
        description:
          'Bazen geliştirilip hayata geçirilen bir fikir ya da görüş pek çok dengeyi değiştirebilir. Kalkınan ülkelerin çoğu, şuradan buradan toplanan fikirlerin belirli hedefleri ve takvimi olan plan ve programlara dönüştürüldüğü stratejik planlarla yükselmiştir; ülkeler böyle gelişir, toplumlar böyle büyür ve vatan böyle inşa edilir. Fikirlerinizi ve önerilerinizi bizden esirgemeyin.',
        formTitle: 'Fikir Gönderme Formu',
        formDescription: 'Fikrinizi bize iletmek için aşağıdaki alanları doldurun.',
      },
      complaintsSuggestions: {
        title: 'Şikayet ve Öneriler',
        eyebrow: 'Çalışma kalitesini geliştirme',
        introTitle: 'Şikayet ve öneriler için bir kapı',
        description:
          'Bu kapı üzerinden, çalışma kalitemizi geliştirmek için öneri ve şikayetlerinizi iletebilirsiniz. Ayrıca bize 00905386869333 numarasından veya info@veysvakfi.org e-posta adresinden ulaşabilirsiniz.',
        formTitle: 'Şikayet ve Öneri Formu',
        formDescription: 'Konuyu ve şikayet ya da öneri metninizi aşağıdaki alanlara yazın; dilerseniz dosya ekleyebilirsiniz.',
      },
      volunteer: {
        title: 'Gönüllü Olun',
        eyebrow: 'Gönüllülük Birimi',
        introTitle: 'Yeni bir Yemen inşa etmek ortak çalışma ile başlar',
        paragraphs: [
          'Yeni bir Yemen inşasının, vatan evlatları arasındaki ortak çalışma ve dayanışmayla başladığına inanıyoruz. Sevgi ve uyumun hâkim olduğu yeni bir Yemen için, Yemen’in kalkınması ve yükselişi için eller birleşir, fikirler buluşur; çabalar birleştirilir ve tek vücut hâlinde çalışılır. Katkılarınız ve girişimleriniz temel taşıdır; her birey, gelecek nesiller için aydınlık bir geleceğin inşasına katkıda bulunur.',
          'Gönüllülüğünüz çok şey ifade ediyor; fikirleriniz, Yemen’in yükselişine doğru attığımız her adıma değer katıyor. Yurt içindeki ve dışındaki Yemenliler için daha iyi bir gerçeklik ve aydınlık bir gelecek oluşturmak üzere birlikte çalışalım. Gönüllü çalışmayı güçlendirmemiz ve arzuladığımız olumlu değişimi gerçekleştirmemiz için görüşlerinizi ve fikirlerinizi bizimle paylaşın.',
          'Bize şu kanallardan ulaşarak gönüllü olabilirsiniz: Telefon: +90 536 745 6199, E-posta: volunteering@veysvakfi.org veya her zaman iletişimde kalabilmemiz için aşağıdaki iletişim formu.',
          'Ne kadar küçük olursa olsun her emek, daha iyi bir Yemen’in şekillenmesine katkı sağlar. Hayalini kurduğumuz geleceği inşa etmek için birleşelim, el ele çalışalım ve Yemen’in büyük tarihine eklenecek yeni bir başarı hikâyesi yazalım.',
          '#GönüllülüğünVakıf #YemenİçinGönüllüOl',
        ],
        formTitle: 'Gönüllülük Formu',
        formDescription: 'Gönüllülük formu hiçbir alan silinmeden hafif adımlara bölünmüştür.',
      },
      contact: {
        title: 'İletişim Bilgileri',
        eyebrow: 'İletişim',
        introTitle: 'Doğrudan iletişim bağlantıları',
        description:
          'Yönetim kurulu başkanı ofisi, medya, ilişkiler ve pazarlama, programlar ve vakfın sosyal medya sayfaları için iletişim bağlantıları.',
        directTitle: 'Doğrudan İletişim Bağlantıları',
        directDescription: 'İletişim bilgileri sayfasında yayımlanan WhatsApp bağlantıları.',
        socialTitle: 'Veysel Karani Vakfı Sayfaları',
        socialDescription: 'Vakfın sosyal platform bağlantıları.',
      },
    },
  },
} as const;

const contactLinkText: Record<
  Locale,
  {
    boardOffice: string;
    media: string;
    relationsMarketing: string;
    programs: string;
    facebook: string;
    x: string;
    instagram: string;
    youtube: string;
  }
> = {
  ar: {
    boardOffice: 'مدير مكتب رئيس مجلس الإدارة',
    media: 'إدارة الإعلام',
    relationsMarketing: 'العلاقات والتسويق',
    programs: 'إدارة البرامج',
    facebook: 'وقف أويس القرني - فيسبوك',
    x: 'وقف أويس القرني - منصة X',
    instagram: 'وقف أويس القرني - انستغرام',
    youtube: 'وقف أويس القرني - يوتيوب',
  },
  en: {
    boardOffice: 'Office Manager of the Board Chairman',
    media: 'Media Department',
    relationsMarketing: 'Relations and Marketing',
    programs: 'Programs Department',
    facebook: 'Veysel Karani Waqf - Facebook',
    x: 'Veysel Karani Waqf - X',
    instagram: 'Veysel Karani Waqf - Instagram',
    youtube: 'Veysel Karani Waqf - YouTube',
  },
  tr: {
    boardOffice: 'Yönetim Kurulu Başkanı Ofis Müdürü',
    media: 'Medya Departmanı',
    relationsMarketing: 'İlişkiler ve Pazarlama',
    programs: 'Programlar Departmanı',
    facebook: 'Veysel Karani Vakfı - Facebook',
    x: 'Veysel Karani Vakfı - X',
    instagram: 'Veysel Karani Vakfı - Instagram',
    youtube: 'Veysel Karani Vakfı - YouTube',
  },
};

function directContactLinksFor(locale: Locale): ParticipateContactLink[] {
  const t = contactLinkText[locale];

  return [
    {
      id: 'board-office',
      label: t.boardOffice,
      href: 'https://wa.me/9005300523946?text=',
      kind: 'whatsapp',
    },
    {
      id: 'media',
      label: t.media,
      href: 'https://wa.me/9005386869333?text=',
      kind: 'whatsapp',
    },
    {
      id: 'relations-marketing',
      label: t.relationsMarketing,
      href: 'https://wa.me/9005384314195?text=',
      kind: 'whatsapp',
    },
    {
      id: 'programs',
      label: t.programs,
      href: 'https://wa.me/9005300523945?text=',
      kind: 'whatsapp',
    },
  ];
}

function socialLinksFor(locale: Locale): ParticipateContactLink[] {
  const t = contactLinkText[locale];

  return [
    {
      id: 'facebook',
      label: t.facebook,
      href: 'https://www.facebook.com/veysvakfi/?locale=ar_AR',
      kind: 'social',
    },
    {
      id: 'x',
      label: t.x,
      href: 'https://x.com/veysvakfi?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
      kind: 'social',
    },
    {
      id: 'instagram',
      label: t.instagram,
      href: 'https://www.instagram.com/veysvakfi/',
      kind: 'social',
    },
    {
      id: 'youtube',
      label: t.youtube,
      href: 'https://www.youtube.com/channel/UCCZ8-gIhjPkqy1KaBkr1Q8A',
      kind: 'social',
    },
  ];
}

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

const seoBrand: Record<Locale, string> = {
  ar: 'وقف أويس القرني',
  en: 'Veysel Karani Waqf',
  tr: 'Veysel Karani Vakfı',
};

function buildPages(locale: Locale): Record<ParticipatePageKey, ParticipatePageContent> {
  const text = localizedText[locale];
  const crumbs = labels[locale];
  const brand = seoBrand[locale];
  const shareIdeaFields = shareIdeaFieldsFor(locale);
  const complaintsFields = complaintsFieldsFor(locale);
  const volunteerFields = volunteerFieldsFor(locale);
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
        title: `${share.title} | ${brand}`,
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
        title: `${complaints.title} | ${brand}`,
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
        title: `${volunteer.title} | ${brand}`,
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
        title: `${contact.title} | ${brand}`,
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
        directLinks: directContactLinksFor(locale),
        socialLinks: socialLinksFor(locale),
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
