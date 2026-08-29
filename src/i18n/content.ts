import blessedTreeImage from '@/assets/projects/blessed-tree.jpg';
import goldPortfolioImage from '@/assets/projects/gold-portfolio.jpeg';
import waqfShareImage from '@/assets/projects/waqf-share.jpeg';

export type Locale = 'ar' | 'tr' | 'en';
export type Direction = 'rtl' | 'ltr';

// Cards added from the dashboard repeater carry no `id`; components key on
// `id ?? detailsUrl/url ?? index` so two new cards never collide.
export type Project = {
  id?: string;
  name: string;
  description: string;
  contribution: string;
  image: string;
  imageAlt?: string;
  /** CSS object-position for the card image, e.g. "50% 30%". */
  imagePosition?: string;
  detailsUrl: string;
  contributionUrl?: string;
};

export type Program = {
  id?: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  url: string;
};

export type Partner = {
  name: string;
  logo: string;
  url?: string;
};

/** A figure card; `icon` is a name from src/lib/icons.ts ICON_REGISTRY. */
export type Indicator = {
  label: string;
  value: number | null;
  suffix?: string;
  detail?: string;
  icon?: string;
};

export type NavMenu = '' | 'about' | 'programs';

export type SocialLinks = {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin?: string;
  tiktok?: string;
  whatsapp?: string;
  telegram?: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    /** Share image (og:image); a site path or an absolute URL. */
    ogImage: string;
  };
  siteConfig: {
    name: string;
    logo: string;
    /** Destination of the "donate now" buttons in the header, mobile menu and footer. */
    donateUrl: string;
    licenseNumber: string;
    courtDecision: string;
    taxNumber: string;
    taxExempt: boolean;
    socialLinks: SocialLinks;
  };
  /** `menu` picks the dropdown shown under the link; undefined falls back to the href check. */
  navLinks: { label: string; href: string; menu?: NavMenu }[];
  hero: {
    title: string;
    secondaryButton: string;
    /** "#anchor" scrolls on the page, "/path" navigates. */
    secondaryUrl: string;
    videoId: string;
    /** Public URL of a video uploaded in the dashboard; takes priority over videoId. */
    videoFile?: string;
    posterImage: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    tabs: {
      vision: string;
      mission: string;
      methodology: string;
      values: string;
      sectors: string;
    };
    vision: string;
    mission: string[];
    methodology: string[];
    values: string[];
    sectors: string[];
    goals: string[];
    image: string;
    imageAlt: string;
    learnMoreUrl: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    /** Used by a card's "donate with us" button when it has no contributionUrl. */
    defaultContributionUrl: string;
    items: Project[];
  };
  programs: {
    eyebrow: string;
    title: string;
    description: string;
    items: Program[];
  };
  yemenPioneers: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
    url: string;
    image: string;
    indicators: Indicator[];
  };
  statistics: {
    eyebrow: string;
    title: string;
    description: string;
    indicators: Indicator[];
  };
  news: {
    eyebrow: string;
    title: string;
    /** How many articles the home section shows (one large + the rest small). */
    count: number;
  };
  partners: {
    eyebrow: string;
    title: string;
    items: Partner[];
  };
  participation: {
    title: string;
    description: string;
    primaryButton: string;
    primaryUrl: string;
    secondaryButton: string;
    secondaryUrl: string;
    image: string;
  };
  footer: {
    description: string;
    quickLinks: { label: string; href: string }[];
    contactInfo: {
      address: string;
      email: string;
      phone: string;
    };
    bankAccountsLink: string;
    bankAccountsUrl: string;
    newsletterTitle: string;
    newsletterDescription: string;
  };
  ui: {
    common: {
      learnMore: string;
      readMore: string;
      viewDetails: string;
      donateWithUs: string;
      donateNow: string;
      quickLinks: string;
      subscribe: string;
      subscribed: string;
      emailPlaceholder: string;
      taxExempt: string;
      discoverMore: string;
      unavailable: string;
    };
    accessibility: {
      openMenu: string;
      closeMenu: string;
      playVideo: string;
      closeVideo: string;
      scrollDown: string;
      videoTitle: string;
      loadingVideo: string;
      videoBackgroundTitle: string;
      languageSwitcher: string;
      languageMenu: string;
      aboutTabs: string;
      projectGallery: string;
      previousProject: string;
      nextProject: string;
      projectDots: string;
      showProject: string;
      breadcrumb: string;
    };
    footer: {
      licensePrefix: string;
      courtDecisionPrefix: string;
      taxNumberPrefix: string;
      rightsReserved: string;
      yearSuffix: string;
    };
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
      linkedin: string;
      tiktok: string;
      whatsapp: string;
      telegram: string;
    };
  };
};

export const languages: { code: Locale; label: string; nativeName: string; short: string; dir: Direction }[] = [
  { code: 'ar', label: 'العربية', nativeName: 'العربية', short: 'AR', dir: 'rtl' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe', short: 'TR', dir: 'ltr' },
  { code: 'en', label: 'English', nativeName: 'English', short: 'EN', dir: 'ltr' },
];

const shared = {
  logo: '/media/cropped-cropped-170x57-1-18a12f60.png',
  videoId: 'LMK-Sv__71w',
  mainImage: '/media/135a7765-scaled-1-1024x683-97228b97.jpg',
  socialLinks: {
    facebook: 'https://www.facebook.com/veysvakfi',
    twitter: 'https://x.com/veysvakfi',
    instagram: 'https://www.instagram.com/veysvakfi',
    youtube: 'https://www.youtube.com/@veysvakfi',
    linkedin: '',
    tiktok: '',
    whatsapp: '',
    telegram: '',
  },
  // Destinations shared by every language; the dashboard can override them per page.
  routes: {
    donate: '/donate',
    bankAccounts: '/bank-accounts',
    volunteer: '/participate/volunteer',
    aboutWaqf: '/about/waqf',
    yemenPioneers: '/programs/yemen-pioneers',
    heroButton: '#participate',
  },
  // Default icons per position; editors can override each figure's icon by name.
  pioneerIcons: ['graduation-cap', 'book-open', 'users', 'globe'],
  statisticIcons: ['trending-up', 'users', 'heart-handshake', 'briefcase'],
  projectImages: {
    waqfShare: waqfShareImage,
    blessedTree: blessedTreeImage,
    goldPortfolio: goldPortfolioImage,
  },
  programImages: {
    futureLeaders: '/media/file-6c159173.jpg',
    capacityBuilding: '/media/5-41deee62.png',
    institutionalDevelopment: '/media/6-8aafe52f.png',
    communityAwareness: '/media/4-17cc70a3.png',
  },
  yemenPioneersStatistics: {
    educationalScholarships: 86,
    peerReviewedResearch: 33,
    trainingForums: 6,
    internationalParticipations: 7,
  },
  // Official figures from the “Owais in Numbers” report (7th edition, through December 2025)
  waqfStatistics: {
    waqfShares: 17488,
    contributors: 9403,
    contributorCountries: 22,
    programBeneficiaries: 1556,
    developmentPrograms: 40,
    capitalGrowthPercent: 51.67,
    volunteers: 2693,
  },
  partnerLogos: [
    '/media/ytb-logo-yatay-yaldiz-150x150-9e4ed0b3.png',
    '/media/logo3-1-50865719.png',
    '/media/logo2-150x118-ed42d6c2.png',
    '/media/dkghxzrxsaakqa3-150x150-b0778c69.jpg',
    '/media/150x150-dc4fef1e.jpg',
    '/media/download_image_1714989756380-150x150-e6c9705e.png',
    '/media/22ff63b6bb2d8355ef224aada68ed218-1-150x150-b12720b9.png',
    '/media/download_image_1717068331986-1-150x150-cdbfa110.png',
    '/media/whatsapp-image-2024-08-14-at-14.10.13-150x150-340b1281.jpeg',
    '/media/whatsapp-image-2024-08-14-at-14.10.12-150x150-7ed6083a.jpeg',
    '/media/whatsapp-image-2024-08-14-at-14.10.11-150x150-7a288ba7.jpeg',
    '/media/whatsapp-image-2024-08-14-at-14.10.12-1-150x150-061d7473.png',
    '/media/2025-02-25-15.05.46_84749624-150x150-78272285.jpg',
    '/media/1-87baca56.png',
  ],
};

const siteBase = {
  logo: shared.logo,
  donateUrl: shared.routes.donate,
  licenseNumber: '6222',
  courtDecision: '2016/223-2016/501',
  taxNumber: '9250524198',
  taxExempt: true,
  socialLinks: shared.socialLinks,
};

export const localizedContent: Record<Locale, SiteContent> = {
  ar: {
    meta: {
      title: 'وقف أويس القرني',
      description:
        'مؤسسة وقفية تسعى إلى إيجاد أوعية استثمارية مبتكرة ومستدامة، والتكامل مع الشركاء في بناء القدرات وتنفيذ البرامج المساندة التي تخدم نهوض اليمن.',
      ogImage: shared.logo,
    },
    siteConfig: {
      ...siteBase,
      name: 'وقف أويس القرني',
    },
    navLinks: [
      { label: 'الرئيسية', href: '#hero' },
      { label: 'من نحن', href: '#about', menu: 'about' },
      { label: 'المشاريع', href: '/projects' },
      { label: 'المتجر', href: '/donate' },
      { label: 'البرامج', href: '#programs', menu: 'programs' },
      { label: 'المكتبة', href: '/library' },
      { label: 'الأخبار', href: '/news' },
      { label: 'شاركنا', href: '/participate' },
    ],
    hero: {
      title: 'وقفٌ يبني الإنسان ويصنع المستقبل',
      secondaryButton: 'ساهم الآن',
      secondaryUrl: shared.routes.heroButton,
      videoId: shared.videoId,
      posterImage: shared.mainImage,
    },
    about: {
      eyebrow: 'عن المؤسسة',
      title: 'وقف أويس القرني',
      description:
        'مؤسسة تنموية ذات طبيعة وقفية لإيجاد أكبر وقف نوعي تشاركي في تاريخ اليمن، يعود ريعه على برامج النهوض الحضاري ومساراته، ويسهم في إيجاده وتنميته كافة اليمنيين ومحبي اليمن في العالم، بوصفه مؤسسة مالية استثمارية وقفية.',
      tabs: {
        vision: 'رؤيتنا',
        mission: 'رسالتنا',
        methodology: 'منهجيتنا',
        values: 'قيمنا',
        sectors: 'قطاعات الوقف',
      },
      vision: 'رواد الوقف التشاركي التخصصي في نهوض اليمن الحضاري.',
      mission: [
        'نصنع أوعية وقفية استثمارية مبتكرة تؤمّن موارد النهوض الحضاري لليمن.',
        'نتكامل مع شركائنا في بناء القدرات، والبرامج المساندة، والتشبيك التخصصي.',
      ],
      methodology: [
        'الانفتاح والشمول',
        'حقوق المساهمين والشفافية',
        'الاستثمار المدروس',
        'الاستدامة وتنمية الموارد',
        'الشراكات الفاعلة',
      ],
      values: ['المؤسسية', 'الشراكة', 'الطموح', 'الشفافية', 'المبادرة', 'الاستدامة'],
      sectors: ['قطاع البرامج والشراكات', 'قطاع الوقف'],
      goals: [
        'إيجاد الوقف بمساهمة كل اليمنيين ومحبي اليمن حول العالم، وتنمية موارده كمؤسسة مالية استثمارية وقفية.',
        'تعزيز الروح الوطنية لدى اليمنيين كشركاء في إيجاد أكبر وقف في تاريخ اليمن بمساهمتهم جميعًا.',
        'ترسيخ الهُوية الوطنية الجامعة وتحقيق التنمية المستدامة لليمن.',
      ],
      image: shared.mainImage,
      imageAlt: 'وقف أويس القرني',
      learnMoreUrl: shared.routes.aboutWaqf,
    },
    projects: {
      eyebrow: 'استثمر في الخير',
      title: 'المشاريع الوقفية',
      description:
        'مشاريع وقفية استثمارية مستدامة، توجّه عوائدها نحو التعليم وبناء القدرات وبرامج نهوض اليمن.',
      defaultContributionUrl: shared.routes.donate,
      items: [
        {
          id: 'waqf-share',
          name: 'السهم الوقفي',
          description:
            'سهم وقفي استثماري يتيح لكل يمني ومحبي اليمن المشاركة في بناء أكبر وقف في تاريخ اليمن، بقيمة مساهمة متاحة تسهم في صناعة موارد وقفية مستدامة.',
          contribution: '100 دولار',
          image: shared.projectImages.waqfShare,
          detailsUrl: '/projects/waqf-share',
          contributionUrl: '/donate',
        },
        {
          id: 'blessed-tree',
          name: 'مشروع الشجرة المباركة',
          description:
            'مشروع وقفي استثماري دائم في تركيا من خلال شراء واستثمار أشجار الزيتون المنتجة لا يقل عمرها عن عشر سنوات، على مساحة 33 متر مربع من الأرض للشجرة الواحدة.',
          contribution: '100 دولار',
          image: shared.projectImages.blessedTree,
          detailsUrl: '/projects/blessed-tree',
          contributionUrl: '/donate',
        },
        {
          id: 'gold-portfolio',
          name: 'محفظة الذهب الوقفية',
          description:
            'محفظة وقفية استثمارية مبنية على الذهب، تؤمّن موارد مستدامة لبرامج الوقف وتحافظ على قيمة الأصول الوقفية عبر الزمن.',
          contribution: '100 دولار',
          image: shared.projectImages.goldPortfolio,
          detailsUrl: '/projects/gold-wallet',
          contributionUrl: '/donate',
        },
      ],
    },
    programs: {
      eyebrow: 'وقف أويس القرني',
      title: 'البرامج التنموية',
      description:
        'برامج متكاملة تخدم نهوض اليمن عبر بناء القدرات والتطوير المؤسسي والتوعية المجتمعية وإعداد قادة المستقبل.',
      items: [
        {
          id: 'future-leaders',
          title: 'إعداد قادة المستقبل',
          description:
            'الاهتمام بأوائل الطلاب والموهوبين والمبدعين المتميزين وإعدادهم قادة للمستقبل عبر برنامج رواد اليمن.',
          image: shared.programImages.futureLeaders,
          url: '/programs/yemen-pioneers',
        },
        {
          id: 'capacity-building',
          title: 'بناء القدرات',
          description:
            'ترسيخ ثقافة العمل التطوعي وإتاحة الفرص التطوعية عبر الوحدة التطوعية في الوقف.',
          image: shared.programImages.capacityBuilding,
          url: '/programs/capacity-building',
        },
        {
          id: 'institutional-development',
          title: 'التطوير المؤسسي',
          description:
            'تطوير أداء المؤسسات الحكومية والأهلية وتحديث برامجها وخططها، ورفع قدرات منظمات المجتمع المدني.',
          image: shared.programImages.institutionalDevelopment,
          url: '/programs/institutional-development',
        },
        {
          id: 'community-awareness',
          title: 'التوعية المجتمعية',
          description:
            'منصة أويس: منصة معرفية تُعنى بقضايا الفكر والنهوض الحضاري وتعزيز الوعي الجمعي.',
          image: shared.programImages.communityAwareness,
          url: '/programs/community-awareness',
        },
      ],
    },
    yemenPioneers: {
      eyebrow: 'المسار الأول للوقف',
      title: 'رواد اليمن',
      description:
        'برنامج متكامل يهتم بالتعليم والتأهيل النوعي للطلاب الموهوبين والمتفوقين من أبناء اليمن، وإعدادهم قادة للمستقبل عبر منح دراسية وبرامج قيادية ومهارية.',
      button: 'اكتشف البرنامج',
      url: shared.routes.yemenPioneers,
      image: shared.mainImage,
      indicators: [
        { label: 'منح تعليمية', value: shared.yemenPioneersStatistics.educationalScholarships, icon: shared.pioneerIcons[0] },
        { label: 'أبحاث علمية محكّمة', value: shared.yemenPioneersStatistics.peerReviewedResearch, icon: shared.pioneerIcons[1] },
        { label: 'ملتقيات تدريبية', value: shared.yemenPioneersStatistics.trainingForums, icon: shared.pioneerIcons[2] },
        { label: 'مشاركات دولية', value: shared.yemenPioneersStatistics.internationalParticipations, icon: shared.pioneerIcons[3] },
      ],
    },
    statistics: {
      eyebrow: 'أثر الوقف',
      title: 'أويس في أرقام',
      description:
        'أرقام رسمية من تقرير «أويس في أرقام» — الإصدار السابع، حتى ديسمبر 2025م.',
      indicators: [
        { label: 'سهماً وقفياً', value: shared.waqfStatistics.waqfShares, suffix: '', detail: 'إجمالي الأسهم الوقفية التي جُمعت لتنمية أصول الوقف واستدامة مساراته التنموية.', icon: shared.statisticIcons[0] },
        { label: 'مساهماً ومساهمة من 22 دولة', value: shared.waqfStatistics.contributors, suffix: '', detail: 'واقفون وواقفات من 22 دولة حول العالم شاركوا في بناء الوقف وتنميته.', icon: shared.statisticIcons[1] },
        { label: 'مستفيداً من المسارات الوقفية', value: shared.waqfStatistics.programBeneficiaries, suffix: '', detail: 'مستفيدون مباشرون من برامج المسارات الوقفية التعليمية والتنموية والمجتمعية.', icon: shared.statisticIcons[2] },
        { label: 'برنامجاً تنموياً ضمن المسارات الوقفية', value: shared.waqfStatistics.developmentPrograms, suffix: '', detail: 'برامج تنموية نُفّذت ضمن المسارات الوقفية في التطوير المؤسسي وبناء القدرات والتوعية.', icon: shared.statisticIcons[3] },
      ],
    },
    news: {
      eyebrow: 'آخر المستجدات',
      title: 'آخر الأخبار',
      count: 3,
    },
    partners: {
      eyebrow: 'شركاء النجاح',
      title: 'شركاء وقف أويس القرني',
      items: [
        { name: 'هيئة المنح التركية YTB', logo: shared.partnerLogos[0] },
        { name: 'البادية للتنمية والأعمال الإنسانية', logo: shared.partnerLogos[1] },
        ...shared.partnerLogos.slice(2).map((logo) => ({ name: 'شريك وقفي', logo })),
      ],
    },
    participation: {
      title: 'كن شريكًا في أثرٍ مستدام',
      description:
        'بمساهمتك، تتحول الموارد الوقفية إلى فرص تعليم وتأهيل ومشروعات يستمر أثرها.',
      primaryButton: 'ساهم الآن',
      primaryUrl: shared.routes.donate,
      secondaryButton: 'تطوع معنا',
      secondaryUrl: shared.routes.volunteer,
      image: shared.mainImage,
    },
    footer: {
      description:
        'مؤسسة وقفية تسعى إلى إيجاد أوعية استثمارية مبتكرة ومستدامة، وتوجيه عوائدها نحو التعليم وبناء القدرات وبرامج نهوض اليمن.',
      quickLinks: [
        { label: 'عن الوقف', href: '#about' },
        { label: 'المشاريع الوقفية', href: '/projects' },
        { label: 'البرامج', href: '#programs' },
        { label: 'المكتبة', href: '/library' },
        { label: 'الأخبار', href: '/news' },
        { label: 'تواصل معنا', href: '/participate/contact' },
      ],
      contactInfo: {
        address: 'إسطنبول، تركيا',
        email: 'info@veysvakfi.org',
        phone: '',
      },
      bankAccountsLink: 'الحسابات البنكية وطرق المساهمة',
      bankAccountsUrl: shared.routes.bankAccounts,
      newsletterTitle: 'النشرة الإخبارية',
      newsletterDescription: 'اشترك معنا في النشرة الإخبارية ليصلك كل جديد',
    },
    ui: {
      common: {
        learnMore: 'اعرف المزيد',
        readMore: 'قراءة المزيد',
        viewDetails: 'عرض التفاصيل',
        donateWithUs: 'ساهم معنا',
        donateNow: 'ساهم الآن',
        quickLinks: 'روابط سريعة',
        subscribe: 'اشترك',
        subscribed: 'تم الاشتراك',
        emailPlaceholder: 'بريدك الإلكتروني',
        taxExempt: 'معفى من الضرائب',
        discoverMore: 'اكتشف المزيد',
        unavailable: '—',
      },
      accessibility: {
        openMenu: 'فتح القائمة',
        closeMenu: 'إغلاق القائمة',
        playVideo: 'تشغيل الفيديو',
        closeVideo: 'إغلاق الفيديو',
        scrollDown: 'تمرير للأسفل',
        videoTitle: 'فيديو وقف أويس القرني',
        loadingVideo: 'جارٍ تحميل الفيديو',
        videoBackgroundTitle: 'خلفية فيديو وقف أويس القرني',
        languageSwitcher: 'تغيير اللغة',
        languageMenu: 'قائمة اللغات',
        aboutTabs: 'معلومات وقف أويس القرني',
        projectGallery: 'معرض المشاريع الوقفية',
        previousProject: 'المشروع السابق',
        nextProject: 'المشروع التالي',
        projectDots: 'نقاط تنقل المشاريع',
        showProject: 'عرض',
        breadcrumb: 'مسار التنقل',
      },
      footer: {
        licensePrefix: 'رقم الترخيص',
        courtDecisionPrefix: 'رقم قرار المحكمة',
        taxNumberPrefix: 'الرقم الضريبي',
        rightsReserved: 'جميع الحقوق محفوظة',
        yearSuffix: 'م',
      },
      social: {
        facebook: 'فيسبوك',
        twitter: 'X',
        instagram: 'إنستغرام',
        youtube: 'يوتيوب',
        linkedin: 'لينكدإن',
        tiktok: 'تيك توك',
        whatsapp: 'واتساب',
        telegram: 'تيليغرام',
      },
    },
  },
  tr: {
    meta: {
      title: 'Veysel Karani Vakfı',
      description:
        'Yemenin kalkınmasına hizmet eden eğitim, kapasite geliştirme ve destek programları için yenilikçi ve sürdürülebilir vakıf yatırım araçları geliştiren bir vakıf kurumu.',
      ogImage: shared.logo,
    },
    siteConfig: {
      ...siteBase,
      name: 'Veysel Karani Vakfı',
    },
    navLinks: [
      { label: 'Ana Sayfa', href: '#hero' },
      { label: 'Vakıf Hakkında', href: '#about', menu: 'about' },
      { label: 'Projeler', href: '/projects' },
      { label: 'Mağaza', href: '/donate' },
      { label: 'Programlar', href: '#programs', menu: 'programs' },
      { label: 'Kütüphane', href: '/library' },
      { label: 'Haberler', href: '/news' },
      { label: 'Katıl', href: '/participate' },
    ],
    hero: {
      title: 'İnsanı inşa eden, geleceği kuran vakıf',
      secondaryButton: 'Şimdi Katkı Sun',
      secondaryUrl: shared.routes.heroButton,
      videoId: shared.videoId,
      posterImage: shared.mainImage,
    },
    about: {
      eyebrow: 'Kurum Hakkında',
      title: 'Veysel Karani Vakfı',
      description:
        "Yemen tarihindeki en büyük nitelikli ve katılımcı vakfı oluşturmayı amaçlayan; gelirlerini Yemen'in medeniyet kalkınması programlarına yönlendiren, dünyanın dört bir yanındaki Yemenliler ile Yemen dostlarının kuruluşuna ve gelişimine katkıda bulunduğu finansal ve yatırım odaklı bir kalkınma vakfıdır.",
      tabs: {
        vision: 'Vizyonumuz',
        mission: 'Misyonumuz',
        methodology: 'Metodolojimiz',
        values: 'Değerlerimiz',
        sectors: 'Sektörlerimiz',
      },
      vision: 'Yemenin medeniyet kalkınmasında katılımcı ve uzmanlaşmış vakıf modelinin öncüleri olmak.',
      mission: [
        "Yemen'in medeniyet kalkınmasına kaynak sağlayan yenilikçi vakıf yatırım araçları oluşturuyoruz.",
        'Kapasite geliştirme, destek programları ve uzmanlık temelli ağ kurma alanlarında ortaklarımızla bütünleşiyoruz.',
      ],
      methodology: [
        'Açıklık ve kapsayıcılık',
        'Haklar ve şeffaflık',
        'Planlı yatırım',
        'Sürdürülebilir büyüme',
        'Etkin ortaklıklar',
      ],
      values: ['Kurumsallık', 'Ortaklık', 'Azim', 'Şeffaflık', 'Girişimcilik', 'Sürdürülebilirlik'],
      sectors: ['Programlar ve Ortaklıklar Birimi', 'Vakıf Birimi'],
      goals: [
        'Dünyanın dört bir yanındaki Yemenliler ve Yemen dostlarının katkısıyla vakfı büyütmek ve kaynaklarını vakıf yatırım kurumu olarak geliştirmek.',
        'Yemenlileri, Yemen tarihinin en büyük vakfının inşasında ortak kılan ulusal ruhu güçlendirmek.',
        'Kapsayıcı ulusal kimliği pekiştirmek ve Yemen için sürdürülebilir kalkınmayı desteklemek.',
      ],
      image: shared.mainImage,
      imageAlt: 'Veysel Karani Vakfı',
      learnMoreUrl: shared.routes.aboutWaqf,
    },
    projects: {
      eyebrow: 'İyiliğe Yatırım',
      title: 'Vakıf Projeleri',
      description:
        'Getirileri eğitim, kapasite geliştirme ve Yemenin kalkınma programlarına yönlendirilen sürdürülebilir vakıf yatırım projeleri.',
      defaultContributionUrl: shared.routes.donate,
      items: [
        {
          id: 'waqf-share',
          name: 'Vakıf Hissesi',
          description:
            'Her Yemenli ve Yemen dostunun, sürdürülebilir vakıf kaynakları oluşturarak Yemen tarihinin en büyük vakfına katkı sunmasını sağlayan yatırım amaçlı vakıf hissesi.',
          contribution: '100 USD',
          image: shared.projectImages.waqfShare,
          detailsUrl: '/projects/waqf-share',
          contributionUrl: '/donate',
        },
        {
          id: 'blessed-tree',
          name: 'Bereketli Ağaç Projesi',
          description:
            'Türkiyede, her biri en az on yaşında olan verimli zeytin ağaçlarının satın alınması ve işletilmesine dayanan kalıcı bir vakıf yatırım projesi.',
          contribution: '100 USD',
          image: shared.projectImages.blessedTree,
          detailsUrl: '/projects/blessed-tree',
          contributionUrl: '/donate',
        },
        {
          id: 'gold-portfolio',
          name: 'Vakıf Altın Portföyü',
          description:
            'Altına dayalı, vakıf programları için sürdürülebilir kaynak sağlayan ve vakıf varlıklarının değerini zaman içinde koruyan yatırım portföyü.',
          contribution: '100 USD',
          image: shared.projectImages.goldPortfolio,
          detailsUrl: '/projects/gold-wallet',
          contributionUrl: '/donate',
        },
      ],
    },
    programs: {
      eyebrow: 'Veysel Karani Vakfı',
      title: 'Kalkınma Programları',
      description:
        'Kapasite geliştirme, kurumsal gelişim, toplumsal farkındalık ve geleceğin liderlerini yetiştirme yoluyla Yemenin kalkınmasına hizmet eden bütüncül programlar.',
      items: [
        {
          id: 'future-leaders',
          title: 'Geleceğin Liderlerini Yetiştirme',
          description:
            'Yemen Öncüleri programı aracılığıyla başarılı, yetenekli ve yaratıcı öğrencileri destekleyerek geleceğin liderleri olarak hazırlamak.',
          image: shared.programImages.futureLeaders,
          url: '/programs/yemen-pioneers',
        },
        {
          id: 'capacity-building',
          title: 'Kapasite Geliştirme',
          description:
            'Gönüllü çalışma kültürünü yerleştirmek ve vakfın Gönüllülük Birimi üzerinden gönüllülük fırsatları sunmak.',
          image: shared.programImages.capacityBuilding,
          url: '/programs/capacity-building',
        },
        {
          id: 'institutional-development',
          title: 'Kurumsal Gelişim',
          description:
            'Kamu ve sivil kurumların performansını, programlarını ve planlarını yenilemek; sivil toplum kuruluşlarının kapasitelerini artırmak.',
          image: shared.programImages.institutionalDevelopment,
          url: '/programs/institutional-development',
        },
        {
          id: 'community-awareness',
          title: 'Toplumsal Farkındalık',
          description:
            'Owais Platformu: düşünce ve medeniyet kalkınışına odaklanan, kolektif bilinci güçlendiren bilgi platformu.',
          image: shared.programImages.communityAwareness,
          url: '/programs/community-awareness',
        },
      ],
    },
    yemenPioneers: {
      eyebrow: 'Vakfın İlk Alanı',
      title: 'Yemen Öncüleri',
      description:
        'Yemenli yetenekli ve başarılı öğrenciler için nitelikli eğitim ve liderlik hazırlığına odaklanan; burslar, liderlik ve beceri programları içeren bütüncül bir program.',
      button: 'Programı Keşfet',
      url: shared.routes.yemenPioneers,
      image: shared.mainImage,
      indicators: [
        { label: 'Eğitim Bursu', value: shared.yemenPioneersStatistics.educationalScholarships, icon: shared.pioneerIcons[0] },
        { label: 'Hakemli Bilimsel Araştırma', value: shared.yemenPioneersStatistics.peerReviewedResearch, icon: shared.pioneerIcons[1] },
        { label: 'Eğitim Buluşması', value: shared.yemenPioneersStatistics.trainingForums, icon: shared.pioneerIcons[2] },
        { label: 'Uluslararası Katılım', value: shared.yemenPioneersStatistics.internationalParticipations, icon: shared.pioneerIcons[3] },
      ],
    },
    statistics: {
      eyebrow: 'Vakfın Etkisi',
      title: 'Rakamlarla Oveys',
      description:
        '“Rakamlarla Oveys” raporundan resmi rakamlar — 7. sayı, Aralık 2025’e kadar.',
      indicators: [
        { label: 'Vakıf Hissesi', value: shared.waqfStatistics.waqfShares, suffix: '', detail: 'Vakıf varlıklarını büyütmek ve programlarını sürdürülebilir kılmak için toplanan toplam vakıf hissesi.', icon: shared.statisticIcons[0] },
        { label: '22 Ülkeden Katkı Sunan', value: shared.waqfStatistics.contributors, suffix: '', detail: 'Dünya genelinde 22 ülkeden vakfın kuruluşuna ve büyümesine katkı sunan bağışçılar.', icon: shared.statisticIcons[1] },
        { label: 'Vakıf Programlarından Yararlanan', value: shared.waqfStatistics.programBeneficiaries, suffix: '', detail: 'Vakıf programlarının eğitim, kalkınma ve toplumsal alanlardaki doğrudan yararlanıcıları.', icon: shared.statisticIcons[2] },
        { label: 'Kalkınma Programı', value: shared.waqfStatistics.developmentPrograms, suffix: '', detail: 'Kurumsal gelişim, kapasite geliştirme ve farkındalık alanlarında yürütülen kalkınma programları.', icon: shared.statisticIcons[3] },
      ],
    },
    news: {
      eyebrow: 'Son Gelişmeler',
      title: 'Son Haberler',
      count: 3,
    },
    partners: {
      eyebrow: 'Başarı Ortakları',
      title: 'Veysel Karani Vakfı Ortakları',
      items: [
        { name: 'Türkiye Bursları YTB', logo: shared.partnerLogos[0] },
        { name: 'Al-Badia Kalkınma ve İnsani Yardım', logo: shared.partnerLogos[1] },
        ...shared.partnerLogos.slice(2).map((logo) => ({ name: 'Vakıf Ortağı', logo })),
      ],
    },
    participation: {
      title: 'Sürdürülebilir Etkinin Ortağı Olun',
      description:
        'Katkınızla vakıf kaynakları, etkisi devam eden eğitim, yetiştirme ve proje fırsatlarına dönüşür.',
      primaryButton: 'Şimdi Katkı Sun',
      primaryUrl: shared.routes.donate,
      secondaryButton: 'Gönüllü Ol',
      secondaryUrl: shared.routes.volunteer,
      image: shared.mainImage,
    },
    footer: {
      description:
        'Yenilikçi ve sürdürülebilir vakıf yatırım araçları geliştiren; getirilerini eğitim, kapasite geliştirme ve Yemenin kalkınma programlarına yönlendiren bir vakıf kurumudur.',
      quickLinks: [
        { label: 'Vakıf Hakkında', href: '#about' },
        { label: 'Vakıf Projeleri', href: '/projects' },
        { label: 'Programlar', href: '#programs' },
        { label: 'Kütüphane', href: '/library' },
        { label: 'Haberler', href: '/news' },
        { label: 'Bize Ulaşın', href: '/participate/contact' },
      ],
      contactInfo: {
        address: 'İstanbul, Türkiye',
        email: 'info@veysvakfi.org',
        phone: '',
      },
      bankAccountsLink: 'Banka Hesapları ve Katkı Yolları',
      bankAccountsUrl: shared.routes.bankAccounts,
      newsletterTitle: 'E-Bülten',
      newsletterDescription: 'Yeni gelişmelerden haberdar olmak için e-bültenimize abone olun',
    },
    ui: {
      common: {
        learnMore: 'Daha Fazla Bilgi',
        readMore: 'Devamını Oku',
        viewDetails: 'Detayları Gör',
        donateWithUs: 'Katkı Sun',
        donateNow: 'Şimdi Katkı Sun',
        quickLinks: 'Hızlı Bağlantılar',
        subscribe: 'Abone Ol',
        subscribed: 'Abone Olundu',
        emailPlaceholder: 'E-posta adresiniz',
        taxExempt: 'Vergiden muaftır',
        discoverMore: 'Daha Fazlasını Keşfet',
        unavailable: '—',
      },
      accessibility: {
        openMenu: 'Menüyü aç',
        closeMenu: 'Menüyü kapat',
        playVideo: 'Videoyu oynat',
        closeVideo: 'Videoyu kapat',
        scrollDown: 'Aşağı kaydır',
        videoTitle: 'Veysel Karani Vakfı videosu',
        loadingVideo: 'Video yükleniyor',
        videoBackgroundTitle: 'Veysel Karani Vakfı video arka planı',
        languageSwitcher: 'Dili değiştir',
        languageMenu: 'Dil menüsü',
        aboutTabs: 'Veysel Karani Vakfı bilgileri',
        projectGallery: 'Vakıf projeleri galerisi',
        previousProject: 'Önceki proje',
        nextProject: 'Sonraki proje',
        projectDots: 'Proje gezinme noktaları',
        showProject: 'Göster',
        breadcrumb: 'Gezinti yolu',
      },
      footer: {
        licensePrefix: 'Lisans No',
        courtDecisionPrefix: 'Mahkeme Kararı No',
        taxNumberPrefix: 'Vergi No',
        rightsReserved: 'Tüm hakları saklıdır',
        yearSuffix: '',
      },
      social: {
        facebook: 'Facebook',
        twitter: 'X',
        instagram: 'Instagram',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        tiktok: 'TikTok',
        whatsapp: 'WhatsApp',
        telegram: 'Telegram',
      },
    },
  },
  en: {
    meta: {
      title: 'Veysel Karani Waqf',
      description:
        'A waqf institution developing innovative and sustainable investment vehicles to support education, capacity building, and programs that serve Yemen’s advancement.',
      ogImage: shared.logo,
    },
    siteConfig: {
      ...siteBase,
      name: 'Veysel Karani Waqf',
    },
    navLinks: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#about', menu: 'about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Store', href: '/donate' },
      { label: 'Programs', href: '#programs', menu: 'programs' },
      { label: 'Library', href: '/library' },
      { label: 'News', href: '/news' },
      { label: 'Participate', href: '/participate' },
    ],
    hero: {
      title: 'A waqf that builds people and shapes the future',
      secondaryButton: 'Contribute Now',
      secondaryUrl: shared.routes.heroButton,
      videoId: shared.videoId,
      posterImage: shared.mainImage,
    },
    about: {
      eyebrow: 'About the Institution',
      title: 'Veysel Karani Waqf',
      description:
        'A development institution of a waqf nature established to create the largest specialized participatory waqf in Yemen’s history. Its returns support the programs and pathways of Yemen’s civilizational advancement, and Yemenis and friends of Yemen worldwide contribute to building and growing it as a financial investment waqf institution.',
      tabs: {
        vision: 'Our Vision',
        mission: 'Our Mission',
        methodology: 'Our Approach',
        values: 'Our Values',
        sectors: 'Our Divisions',
      },
      vision: 'To pioneer a participatory and specialized waqf model for Yemen’s civilizational advancement.',
      mission: [
        'We create innovative waqf investment vehicles that secure resources for Yemen’s civilizational advancement.',
        'We work with our partners in capacity building, supporting programs, and specialized networking.',
      ],
      methodology: [
        'Openness and inclusion',
        'Rights and transparency',
        'Informed investment',
        'Sustainable growth',
        'Effective partnerships',
      ],
      values: ['Institutionalism', 'Partnership', 'Ambition', 'Transparency', 'Initiative', 'Sustainability'],
      sectors: ['Programs and Partnerships Sector', 'Endowment Sector'],
      goals: [
        'Establish and grow the waqf through contributions from Yemenis and friends of Yemen around the world as a financial and investment waqf institution.',
        'Strengthen the national spirit among Yemenis as partners in creating the largest waqf in Yemen’s history.',
        'Consolidate the inclusive national identity and support sustainable development for Yemen.',
      ],
      image: shared.mainImage,
      imageAlt: 'Veysel Karani Waqf',
      learnMoreUrl: shared.routes.aboutWaqf,
    },
    projects: {
      eyebrow: 'Invest in Good',
      title: 'Waqf Projects',
      description:
        'Sustainable waqf investment projects whose returns are directed toward education, capacity building, and Yemen advancement programs.',
      defaultContributionUrl: shared.routes.donate,
      items: [
        {
          id: 'waqf-share',
          name: 'Waqf Share',
          description:
            'An investment waqf share that enables every Yemeni and friend of Yemen to participate in building the largest waqf in Yemen’s history through an accessible contribution that creates sustainable waqf resources.',
          contribution: '100 USD',
          image: shared.projectImages.waqfShare,
          detailsUrl: '/projects/waqf-share',
          contributionUrl: '/donate',
        },
        {
          id: 'blessed-tree',
          name: 'Blessed Tree Project',
          description:
            'A permanent waqf investment project in Türkiye based on purchasing and investing in productive olive trees at least ten years old, with 33 square meters allocated per tree.',
          contribution: '100 USD',
          image: shared.projectImages.blessedTree,
          detailsUrl: '/projects/blessed-tree',
          contributionUrl: '/donate',
        },
        {
          id: 'gold-portfolio',
          name: 'Waqf Gold Portfolio',
          description:
            'A gold-based waqf investment portfolio that provides sustainable resources for waqf programs and preserves the value of waqf assets over time.',
          contribution: '100 USD',
          image: shared.projectImages.goldPortfolio,
          detailsUrl: '/projects/gold-wallet',
          contributionUrl: '/donate',
        },
      ],
    },
    programs: {
      eyebrow: 'Veysel Karani Waqf',
      title: 'Development Programs',
      description:
        'Integrated programs serving Yemen’s advancement through capacity building, institutional development, community awareness, and preparation of future leaders.',
      items: [
        {
          id: 'future-leaders',
          title: 'Preparing Future Leaders',
          description:
            'Supporting top, talented, and creative students and preparing them as future leaders through the Yemen Pioneers program.',
          image: shared.programImages.futureLeaders,
          url: '/programs/yemen-pioneers',
        },
        {
          id: 'capacity-building',
          title: 'Capacity Building',
          description:
            'Rooting the culture of volunteer work and opening volunteer opportunities through the waqf Volunteer Unit.',
          image: shared.programImages.capacityBuilding,
          url: '/programs/capacity-building',
        },
        {
          id: 'institutional-development',
          title: 'Institutional Development',
          description:
            'Developing the performance of public and civil institutions, updating their programs and plans, and raising the capacities of civil society organizations.',
          image: shared.programImages.institutionalDevelopment,
          url: '/programs/institutional-development',
        },
        {
          id: 'community-awareness',
          title: 'Community Awareness',
          description:
            'Owais Platform: a knowledge platform devoted to thought and civilizational advancement and collective awareness.',
          image: shared.programImages.communityAwareness,
          url: '/programs/community-awareness',
        },
      ],
    },
    yemenPioneers: {
      eyebrow: 'The Waqf’s First Track',
      title: 'Yemen Pioneers',
      description:
        'An integrated program focused on quality education and preparation for talented and high-achieving Yemeni students, developing them as future leaders through scholarships, leadership, and skills programs.',
      button: 'Discover the Program',
      url: shared.routes.yemenPioneers,
      image: shared.mainImage,
      indicators: [
        { label: 'Educational Scholarships', value: shared.yemenPioneersStatistics.educationalScholarships, icon: shared.pioneerIcons[0] },
        { label: 'Peer-Reviewed Studies', value: shared.yemenPioneersStatistics.peerReviewedResearch, icon: shared.pioneerIcons[1] },
        { label: 'Training Forums', value: shared.yemenPioneersStatistics.trainingForums, icon: shared.pioneerIcons[2] },
        { label: 'International Participations', value: shared.yemenPioneersStatistics.internationalParticipations, icon: shared.pioneerIcons[3] },
      ],
    },
    statistics: {
      eyebrow: 'Waqf Impact',
      title: 'Owais in Numbers',
      description:
        'Official figures from the “Owais in Numbers” report — 7th edition, through December 2025.',
      indicators: [
        { label: 'Waqf Shares', value: shared.waqfStatistics.waqfShares, suffix: '', detail: 'Total waqf shares contributed to grow the endowment’s assets and sustain its development tracks.', icon: shared.statisticIcons[0] },
        { label: 'Contributors from 22 Countries', value: shared.waqfStatistics.contributors, suffix: '', detail: 'Donors from 22 countries around the world who have taken part in building and growing the waqf.', icon: shared.statisticIcons[1] },
        { label: 'Program Beneficiaries', value: shared.waqfStatistics.programBeneficiaries, suffix: '', detail: 'Direct beneficiaries of the waqf tracks’ educational, developmental, and community programs.', icon: shared.statisticIcons[2] },
        { label: 'Development Programs', value: shared.waqfStatistics.developmentPrograms, suffix: '', detail: 'Development programs delivered across institutional development, capacity building, and awareness tracks.', icon: shared.statisticIcons[3] },
      ],
    },
    news: {
      eyebrow: 'Latest Updates',
      title: 'Latest News',
      count: 3,
    },
    partners: {
      eyebrow: 'Success Partners',
      title: 'Veysel Karani Waqf Partners',
      items: [
        { name: 'Türkiye Scholarships YTB', logo: shared.partnerLogos[0] },
        { name: 'Al-Badia for Development and Humanitarian Work', logo: shared.partnerLogos[1] },
        ...shared.partnerLogos.slice(2).map((logo) => ({ name: 'Waqf Partner', logo })),
      ],
    },
    participation: {
      title: 'Become a Partner in Sustainable Impact',
      description:
        'Your contribution turns waqf resources into education, training, and project opportunities whose impact continues.',
      primaryButton: 'Contribute Now',
      primaryUrl: shared.routes.donate,
      secondaryButton: 'Volunteer With Us',
      secondaryUrl: shared.routes.volunteer,
      image: shared.mainImage,
    },
    footer: {
      description:
        'A waqf institution creating innovative and sustainable investment vehicles and directing their returns toward education, capacity building, and Yemen advancement programs.',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Waqf Projects', href: '/projects' },
        { label: 'Programs', href: '#programs' },
        { label: 'Library', href: '/library' },
        { label: 'News', href: '/news' },
        { label: 'Contact', href: '/participate/contact' },
      ],
      contactInfo: {
        address: 'Istanbul, Türkiye',
        email: 'info@veysvakfi.org',
        phone: '',
      },
      bankAccountsLink: 'Bank Accounts and Contribution Methods',
      bankAccountsUrl: shared.routes.bankAccounts,
      newsletterTitle: 'Newsletter',
      newsletterDescription: 'Subscribe to receive the latest updates from us',
    },
    ui: {
      common: {
        learnMore: 'Learn More',
        readMore: 'Read More',
        viewDetails: 'View Details',
        donateWithUs: 'Contribute With Us',
        donateNow: 'Contribute Now',
        quickLinks: 'Quick Links',
        subscribe: 'Subscribe',
        subscribed: 'Subscribed',
        emailPlaceholder: 'Your email address',
        taxExempt: 'Tax exempt',
        discoverMore: 'Discover More',
        unavailable: '—',
      },
      accessibility: {
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        playVideo: 'Play video',
        closeVideo: 'Close video',
        scrollDown: 'Scroll down',
        videoTitle: 'Veysel Karani Waqf video',
        loadingVideo: 'Loading video',
        videoBackgroundTitle: 'Veysel Karani Waqf video background',
        languageSwitcher: 'Change language',
        languageMenu: 'Language menu',
        aboutTabs: 'Veysel Karani Waqf information',
        projectGallery: 'Waqf projects gallery',
        previousProject: 'Previous project',
        nextProject: 'Next project',
        projectDots: 'Project navigation dots',
        showProject: 'Show',
        breadcrumb: 'Breadcrumb',
      },
      footer: {
        licensePrefix: 'License No.',
        courtDecisionPrefix: 'Court Decision No.',
        taxNumberPrefix: 'Tax No.',
        rightsReserved: 'All rights reserved',
        yearSuffix: '',
      },
      social: {
        facebook: 'Facebook',
        twitter: 'X',
        instagram: 'Instagram',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        tiktok: 'TikTok',
        whatsapp: 'WhatsApp',
        telegram: 'Telegram',
      },
    },
  },
};

/**
 * Which header submenu a top-level nav link opens. The editor's explicit
 * `menu` wins; links saved before that field existed keep working through the
 * old href check.
 */
export function navMenuFor(link: { href: string; menu?: string }): NavMenu {
  if (link.menu === 'about' || link.menu === 'programs') return link.menu;
  if (link.menu === '') return '';
  if (link.href === '#about') return 'about';
  if (link.href === '#programs') return 'programs';
  return '';
}

export function getDirection(locale: Locale): Direction {
  return languages.find((language) => language.code === locale)?.dir ?? 'rtl';
}

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value === 'ar' || value === 'tr' || value === 'en';
}
