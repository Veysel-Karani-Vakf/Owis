import blessedTreeImage from '@/assets/projects/blessed-tree.jpg';
import goldPortfolioImage from '@/assets/projects/gold-portfolio.jpeg';
import waqfShareImage from '@/assets/projects/waqf-share.jpeg';

export type Locale = 'ar' | 'tr' | 'en';
export type Direction = 'rtl' | 'ltr';

export type Project = {
  id: string;
  name: string;
  description: string;
  contribution: string;
  image: string;
  detailsUrl: string;
  contributionUrl?: string;
};

export type Program = {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
};

export type NewsItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  url: string;
  featured?: boolean;
};

export type Partner = {
  name: string;
  logo: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };
  siteConfig: {
    name: string;
    logo: string;
    licenseNumber: string;
    courtDecision: string;
    taxNumber: string;
    taxExempt: boolean;
    socialLinks: {
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    };
  };
  navLinks: { label: string; href: string }[];
  hero: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    videoId: string;
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
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
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
    image: string;
    indicators: { label: string; value: number | null }[];
  };
  statistics: {
    eyebrow: string;
    title: string;
    description: string;
    indicators: { label: string; value: number | null; suffix: string }[];
  };
  news: {
    eyebrow: string;
    title: string;
    items: NewsItem[];
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
    secondaryButton: string;
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
    };
  };
};

export const languages: { code: Locale; label: string; nativeName: string; short: string; dir: Direction }[] = [
  { code: 'ar', label: 'العربية', nativeName: 'العربية', short: 'AR', dir: 'rtl' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe', short: 'TR', dir: 'ltr' },
  { code: 'en', label: 'English', nativeName: 'English', short: 'EN', dir: 'ltr' },
];

const shared = {
  logo: 'https://veysvakfi.org/wp-content/uploads/2023/06/cropped-cropped-شعار-الوقف-170x57-1.png',
  videoId: 'LMK-Sv__71w',
  mainImage: 'https://veysvakfi.org/wp-content/uploads/2024/05/135A7765-scaled-1-1024x683.jpg',
  socialLinks: {
    facebook: 'https://www.facebook.com/veysvakfi',
    twitter: 'https://twitter.com/veysvakfi',
    instagram: 'https://www.instagram.com/veysvakfi',
    youtube: 'https://www.youtube.com/@veysvakfi',
  },
  projectImages: {
    waqfShare: waqfShareImage,
    blessedTree: blessedTreeImage,
    goldPortfolio: goldPortfolioImage,
  },
  programImages: {
    futureLeaders: 'https://veysvakfi.org/wp-content/uploads/2025/10/برنامج-رواد-اليمن-وقف-أويس-القرني.jpg',
    capacityBuilding: 'https://veysvakfi.org/wp-content/uploads/2020/07/IMG_8018-1024x683.jpg',
    institutionalDevelopment:
      'https://veysvakfi.org/wp-content/gallery/d8a7d984d981d8b9d8a7d984d98ad8a7d8aa/413871824_776644024501184_8029070847178980447_n.jpg',
    communityAwareness: 'https://veysvakfi.org/wp-content/uploads/2019/10/DSC_7222.jpg',
  },
  newsImages: {
    condolencesSheikhHamad: 'https://veysvakfi.org/wp-content/uploads/2026/07/تعزية-امير-قطر.JPG-scaled.jpeg',
    democracyUnityDay:
      'https://veysvakfi.org/wp-content/uploads/2026/07/وقف-أويس-القرني-يحيي-الذكرى-العاشرة-ليوم-الديمقراطية-والوحدة-الوطنية-في-تركيا.jpeg',
    condolencesQatar: 'https://veysvakfi.org/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-13-at-15.55.06.jpeg',
  },
  partnerLogos: [
    'https://veysvakfi.org/wp-content/uploads/2018/11/ytb-logo-yatay-yaldiz-150x150.png',
    'https://veysvakfi.org/wp-content/uploads/2018/05/logo3-1.png',
    'https://veysvakfi.org/wp-content/uploads/2018/05/logo2-150x118.png',
    'https://veysvakfi.org/wp-content/uploads/2018/11/DkGHXZrXsAAkQA3-150x150.jpg',
    'https://veysvakfi.org/wp-content/uploads/2024/01/منصة-بيفول-اويس-القرني-وقف-السهم-الوقفي-سهم-وقفي-150x150.jpg',
    'https://veysvakfi.org/wp-content/uploads/2024/05/download_image_1714989756380-150x150.png',
    'https://veysvakfi.org/wp-content/uploads/2024/05/22ff63b6bb2d8355ef224aada68ed218-1-150x150.png',
    'https://veysvakfi.org/wp-content/uploads/2024/05/download_image_1717068331986-1-150x150.png',
    'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.13-150x150.jpeg',
    'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.12-150x150.jpeg',
    'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.11-150x150.jpeg',
    'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.12-1-150x150.png',
    'https://veysvakfi.org/wp-content/uploads/2025/02/صورة-واتساب-بتاريخ-2025-02-25-في-15.05.46_84749624-150x150.jpg',
    'https://veysvakfi.org/wp-content/uploads/2025/11/سيف-ذا-شلدرن-1.png',
  ],
};

const siteBase = {
  logo: shared.logo,
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
    },
    siteConfig: {
      ...siteBase,
      name: 'وقف أويس القرني',
    },
    navLinks: [
      { label: 'الرئيسية', href: '#hero' },
      { label: 'من نحن', href: '#about' },
      { label: 'المشاريع', href: '/projects' },
      { label: 'المتجر', href: '/donate' },
      { label: 'البرامج', href: '#programs' },
      { label: 'المكتبة', href: '/library' },
      { label: 'الأخبار', href: '/news' },
      { label: 'شاركنا', href: '/participate' },
    ],
    hero: {
      title: 'وقفٌ يبني الإنسان ويصنع المستقبل',
      description:
        'نصنع أوعية وقفية استثمارية مستدامة، ونوجّه عوائدها نحو التعليم وبناء القدرات والمشروعات التي تسهم في نهوض اليمن.',
      primaryButton: 'تعرّف على الوقف',
      secondaryButton: 'ساهم الآن',
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
    },
    projects: {
      eyebrow: 'استثمر في الخير',
      title: 'المشاريع الوقفية',
      description:
        'مشاريع وقفية استثمارية مستدامة، توجّه عوائدها نحو التعليم وبناء القدرات وبرامج نهوض اليمن.',
      items: [
        {
          id: 'waqf-share',
          name: 'السهم الوقفي',
          description:
            'سهم وقفي استثماري يتيح لكل يمني ومحبي اليمن المشاركة في بناء أكبر وقف في تاريخ اليمن، بقيمة مساهمة متاحة تسهم في صناعة موارد وقفية مستدامة.',
          contribution: '100 دولار',
          image: shared.projectImages.waqfShare,
          detailsUrl: '/projects/waqf-share',
          contributionUrl: 'https://veysvakfi.org/product/waqf-share/',
        },
        {
          id: 'blessed-tree',
          name: 'مشروع الشجرة المباركة',
          description:
            'مشروع وقفي استثماري دائم في تركيا من خلال شراء واستثمار أشجار الزيتون المنتجة لا يقل عمرها عن عشر سنوات، على مساحة 33 متر مربع من الأرض للشجرة الواحدة.',
          contribution: '100 دولار',
          image: shared.projectImages.blessedTree,
          detailsUrl: '/projects/blessed-tree',
          contributionUrl: 'https://blessedtree.veysvakfi.org/',
        },
        {
          id: 'gold-portfolio',
          name: 'محفظة الذهب الوقفية',
          description:
            'محفظة وقفية استثمارية مبنية على الذهب، تؤمّن موارد مستدامة لبرامج الوقف وتحافظ على قيمة الأصول الوقفية عبر الزمن.',
          contribution: '100 دولار',
          image: shared.projectImages.goldPortfolio,
          detailsUrl: '/projects/gold-wallet',
          contributionUrl: 'https://veysvakfi.org/product/gold-wallet/',
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
            'المساهمة في تأهيل قيادات المؤسسات الحكومية والأهلية وتطوير أدائهم ورفع كفاءتهم.',
          image: shared.programImages.capacityBuilding,
          url: '/programs/capacity-building',
        },
        {
          id: 'institutional-development',
          title: 'التطوير المؤسسي',
          description:
            'تطوير أداء المؤسسات الحكومية والأهلية وتحديث برامجها وآلياتها وخططها واستراتيجياتها.',
          image: shared.programImages.institutionalDevelopment,
          url: '/programs/institutional-development',
        },
        {
          id: 'community-awareness',
          title: 'التوعية المجتمعية',
          description:
            'إعادة صياغة الرأي العام والهوية الوطنية الجامعة والتوعية بثقافة النهضة والتعايش.',
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
      image: shared.mainImage,
      indicators: [
        { label: 'عدد الطلاب والطالبات', value: null },
        { label: 'عدد المحافظات', value: null },
        { label: 'عدد الجامعات', value: null },
        { label: 'عدد التخصصات', value: null },
      ],
    },
    statistics: {
      eyebrow: 'أثر الوقف',
      title: 'أويس في أرقام',
      description: 'ستظهر الأرقام الرسمية هنا فور اعتمادها من قبل إدارة الوقف.',
      indicators: [
        { label: 'عدد الأسهم الوقفية', value: null, suffix: '' },
        { label: 'عدد المساهمين', value: null, suffix: '' },
        { label: 'المستفيدون من البرامج', value: null, suffix: '' },
        { label: 'عدد البرامج والمشروعات', value: null, suffix: '' },
      ],
    },
    news: {
      eyebrow: 'آخر المستجدات',
      title: 'آخر الأخبار',
      items: [
        {
          id: 'condolences-sheikh-hamad',
          title:
            'عضو مجلس الشورى ورئيس وقف أويس القرني يقدّم واجب العزاء في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني',
          category: 'أخبار',
          date: 'يوليو 2026',
          excerpt:
            'قدّم رئيس وقف أويس القرني عضو مجلس الشورى الأستاذ صلاح باتيس واجب العزاء في وفاة الأمير الوالد سمو الشيخ حمد بن خليفة آل ثاني، وذلك في القنصلية العامة لدولة قطر.',
          image: shared.newsImages.condolencesSheikhHamad,
          url: 'https://veysvakfi.org/shura-member-condolences-sheikh-hamad-bin-khalifa/',
          featured: true,
        },
        {
          id: 'democracy-unity-day',
          title: 'وقف أويس القرني يحيي الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية في تركيا',
          category: 'أخبار',
          date: 'يوليو 2026',
          excerpt:
            'في الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية، يستذكر وقف أويس القرني بكل تقدير تضحيات الشعب التركي في حماية وطنه وإرادته ووحدته.',
          image: shared.newsImages.democracyUnityDay,
          url: 'https://veysvakfi.org/owais-waqf-democracy-and-national-unity-day/',
        },
        {
          id: 'condolences-qatar',
          title: 'وقف أويس القرني يعزّي دولة قطر في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني',
          category: 'أخبار',
          date: 'يوليو 2026',
          excerpt:
            'بقلوب مؤمنة بقضاء الله وقدره تلقينا نبأ وفاة سمو الأمير الوالد الشيخ حمد بن خليفة آل ثاني رحمه الله، وتتقدم كافة هيئات الوقف بأحر التعازي.',
          image: shared.newsImages.condolencesQatar,
          url: 'https://veysvakfi.org/owais-waqf-condolences-sheikh-hamad-bin-khalifa/',
        },
      ],
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
      secondaryButton: 'تطوع معنا',
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
        { label: 'تواصل معنا', href: '#contact' },
      ],
      contactInfo: {
        address: 'إسطنبول، تركيا',
        email: 'info@veysvakfi.org',
        phone: '',
      },
      bankAccountsLink: 'الحسابات البنكية وطرق المساهمة',
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
        twitter: 'تويتر',
        instagram: 'إنستغرام',
        youtube: 'يوتيوب',
      },
    },
  },
  tr: {
    meta: {
      title: 'Veysel Karani Vakfı',
      description:
        'Yemenin kalkınmasına hizmet eden eğitim, kapasite geliştirme ve destek programları için yenilikçi ve sürdürülebilir vakıf yatırım araçları geliştiren bir vakıf kurumu.',
    },
    siteConfig: {
      ...siteBase,
      name: 'Veysel Karani Vakfı',
    },
    navLinks: [
      { label: 'Ana Sayfa', href: '#hero' },
      { label: 'Vakıf Hakkında', href: '#about' },
      { label: 'Projeler', href: '/projects' },
      { label: 'Mağaza', href: '/donate' },
      { label: 'Programlar', href: '#programs' },
      { label: 'Kütüphane', href: '/library' },
      { label: 'Haberler', href: '/news' },
      { label: 'Katıl', href: '/participate' },
    ],
    hero: {
      title: 'İnsanı inşa eden, geleceği kuran vakıf',
      description:
        'Sürdürülebilir vakıf yatırım araçları geliştiriyor, getirilerini eğitim, kapasite geliştirme ve Yemenin kalkınmasına katkı sunan projelere yönlendiriyoruz.',
      primaryButton: 'Vakfı Tanıyın',
      secondaryButton: 'Şimdi Katkı Sun',
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
    },
    projects: {
      eyebrow: 'İyiliğe Yatırım',
      title: 'Vakıf Projeleri',
      description:
        'Getirileri eğitim, kapasite geliştirme ve Yemenin kalkınma programlarına yönlendirilen sürdürülebilir vakıf yatırım projeleri.',
      items: [
        {
          id: 'waqf-share',
          name: 'Vakıf Hissesi',
          description:
            'Her Yemenli ve Yemen dostunun, sürdürülebilir vakıf kaynakları oluşturarak Yemen tarihinin en büyük vakfına katkı sunmasını sağlayan yatırım amaçlı vakıf hissesi.',
          contribution: '100 USD',
          image: shared.projectImages.waqfShare,
          detailsUrl: '/projects/waqf-share',
          contributionUrl: 'https://veysvakfi.org/product/waqf-share/',
        },
        {
          id: 'blessed-tree',
          name: 'Bereketli Ağaç Projesi',
          description:
            'Türkiyede, her biri en az on yaşında olan verimli zeytin ağaçlarının satın alınması ve işletilmesine dayanan kalıcı bir vakıf yatırım projesi.',
          contribution: '100 USD',
          image: shared.projectImages.blessedTree,
          detailsUrl: '/projects/blessed-tree',
          contributionUrl: 'https://blessedtree.veysvakfi.org/',
        },
        {
          id: 'gold-portfolio',
          name: 'Vakıf Altın Portföyü',
          description:
            'Altına dayalı, vakıf programları için sürdürülebilir kaynak sağlayan ve vakıf varlıklarının değerini zaman içinde koruyan yatırım portföyü.',
          contribution: '100 USD',
          image: shared.projectImages.goldPortfolio,
          detailsUrl: '/projects/gold-wallet',
          contributionUrl: 'https://veysvakfi.org/product/gold-wallet/',
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
            'Kamu ve sivil kurumların lider kadrolarını güçlendirmek, performanslarını geliştirmek ve yetkinliklerini artırmak.',
          image: shared.programImages.capacityBuilding,
          url: '/programs/capacity-building',
        },
        {
          id: 'institutional-development',
          title: 'Kurumsal Gelişim',
          description:
            'Kamu ve sivil kurumların performansını geliştirmek; programlarını, mekanizmalarını, planlarını ve stratejilerini yenilemek.',
          image: shared.programImages.institutionalDevelopment,
          url: '/programs/institutional-development',
        },
        {
          id: 'community-awareness',
          title: 'Toplumsal Farkındalık',
          description:
            'Kamuoyunu ve kapsayıcı ulusal kimliği yeniden inşa etmek; kalkınma ve birlikte yaşama kültürünü güçlendirmek.',
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
      image: shared.mainImage,
      indicators: [
        { label: 'Öğrenci Sayısı', value: null },
        { label: 'İl Sayısı', value: null },
        { label: 'Üniversite Sayısı', value: null },
        { label: 'Bölüm Sayısı', value: null },
      ],
    },
    statistics: {
      eyebrow: 'Vakfın Etkisi',
      title: 'Rakamlarla Oveys',
      description: 'Resmi rakamlar vakıf yönetimi tarafından onaylandığında burada yayımlanacaktır.',
      indicators: [
        { label: 'Vakıf Hissesi Sayısı', value: null, suffix: '' },
        { label: 'Katkı Sunanlar', value: null, suffix: '' },
        { label: 'Program Yararlanıcıları', value: null, suffix: '' },
        { label: 'Program ve Proje Sayısı', value: null, suffix: '' },
      ],
    },
    news: {
      eyebrow: 'Son Gelişmeler',
      title: 'Son Haberler',
      items: [
        {
          id: 'condolences-sheikh-hamad',
          title:
            'Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Şeyh Hamad bin Halife Al Sani için taziyelerini sundu',
          category: 'Haberler',
          date: 'Temmuz 2026',
          excerpt:
            'Veysel Karani Vakfı Başkanı ve Şura Meclisi üyesi Salah Batiss, Katar Devletinin kurucu emiri Şeyh Hamad bin Halife Al Sani için taziyelerini Katar Başkonsolosluğunda sundu.',
          image: shared.newsImages.condolencesSheikhHamad,
          url: 'https://veysvakfi.org/shura-member-condolences-sheikh-hamad-bin-khalifa/',
          featured: true,
        },
        {
          id: 'democracy-unity-day',
          title: 'Veysel Karani Vakfı, Türkiyede 15 Temmuz Demokrasi ve Milli Birlik Gününün onuncu yılını andı',
          category: 'Haberler',
          date: 'Temmuz 2026',
          excerpt:
            'Demokrasi ve Milli Birlik Gününün onuncu yılında vakıf, Türk halkının vatanını, iradesini ve birliğini koruma uğruna gösterdiği fedakarlıkları saygıyla anıyor.',
          image: shared.newsImages.democracyUnityDay,
          url: 'https://veysvakfi.org/owais-waqf-democracy-and-national-unity-day/',
        },
        {
          id: 'condolences-qatar',
          title: 'Veysel Karani Vakfı, Şeyh Hamad bin Halife Al Sani için Katar Devletine taziyelerini iletti',
          category: 'Haberler',
          date: 'Temmuz 2026',
          excerpt:
            'Şeyh Hamad bin Halife Al Sani’nin vefat haberini iman ve teslimiyetle aldık; vakfın tüm heyetleri en içten taziyelerini sunar.',
          image: shared.newsImages.condolencesQatar,
          url: 'https://veysvakfi.org/owais-waqf-condolences-sheikh-hamad-bin-khalifa/',
        },
      ],
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
      secondaryButton: 'Gönüllü Ol',
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
        { label: 'Bize Ulaşın', href: '#contact' },
      ],
      contactInfo: {
        address: 'İstanbul, Türkiye',
        email: 'info@veysvakfi.org',
        phone: '',
      },
      bankAccountsLink: 'Banka Hesapları ve Katkı Yolları',
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
        twitter: 'Twitter',
        instagram: 'Instagram',
        youtube: 'YouTube',
      },
    },
  },
  en: {
    meta: {
      title: 'Veysel Karani Waqf',
      description:
        'A waqf institution developing innovative and sustainable investment vehicles to support education, capacity building, and programs that serve Yemen’s advancement.',
    },
    siteConfig: {
      ...siteBase,
      name: 'Veysel Karani Waqf',
    },
    navLinks: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Store', href: '/donate' },
      { label: 'Programs', href: '#programs' },
      { label: 'Library', href: '/library' },
      { label: 'News', href: '/news' },
      { label: 'Participate', href: '/participate' },
    ],
    hero: {
      title: 'A waqf that builds people and shapes the future',
      description:
        'We create sustainable waqf investment vehicles and direct their returns toward education, capacity building, and projects that contribute to Yemen’s advancement.',
      primaryButton: 'Discover the Waqf',
      secondaryButton: 'Contribute Now',
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
    },
    projects: {
      eyebrow: 'Invest in Good',
      title: 'Waqf Projects',
      description:
        'Sustainable waqf investment projects whose returns are directed toward education, capacity building, and Yemen advancement programs.',
      items: [
        {
          id: 'waqf-share',
          name: 'Waqf Share',
          description:
            'An investment waqf share that enables every Yemeni and friend of Yemen to participate in building the largest waqf in Yemen’s history through an accessible contribution that creates sustainable waqf resources.',
          contribution: '100 USD',
          image: shared.projectImages.waqfShare,
          detailsUrl: '/projects/waqf-share',
          contributionUrl: 'https://veysvakfi.org/product/waqf-share/',
        },
        {
          id: 'blessed-tree',
          name: 'Blessed Tree Project',
          description:
            'A permanent waqf investment project in Türkiye based on purchasing and investing in productive olive trees at least ten years old, with 33 square meters allocated per tree.',
          contribution: '100 USD',
          image: shared.projectImages.blessedTree,
          detailsUrl: '/projects/blessed-tree',
          contributionUrl: 'https://blessedtree.veysvakfi.org/',
        },
        {
          id: 'gold-portfolio',
          name: 'Waqf Gold Portfolio',
          description:
            'A gold-based waqf investment portfolio that provides sustainable resources for waqf programs and preserves the value of waqf assets over time.',
          contribution: '100 USD',
          image: shared.projectImages.goldPortfolio,
          detailsUrl: '/projects/gold-wallet',
          contributionUrl: 'https://veysvakfi.org/product/gold-wallet/',
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
            'Contributing to the development of leaders in public and civil institutions, improving performance, and raising institutional competence.',
          image: shared.programImages.capacityBuilding,
          url: '/programs/capacity-building',
        },
        {
          id: 'institutional-development',
          title: 'Institutional Development',
          description:
            'Developing the performance of public and civil institutions and updating their programs, mechanisms, plans, and strategies.',
          image: shared.programImages.institutionalDevelopment,
          url: '/programs/institutional-development',
        },
        {
          id: 'community-awareness',
          title: 'Community Awareness',
          description:
            'Reshaping public opinion and the inclusive national identity while promoting a culture of advancement and coexistence.',
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
      image: shared.mainImage,
      indicators: [
        { label: 'Students', value: null },
        { label: 'Governorates', value: null },
        { label: 'Universities', value: null },
        { label: 'Specializations', value: null },
      ],
    },
    statistics: {
      eyebrow: 'Waqf Impact',
      title: 'Owais in Numbers',
      description: 'Official numbers will appear here once approved by the waqf administration.',
      indicators: [
        { label: 'Waqf Shares', value: null, suffix: '' },
        { label: 'Contributors', value: null, suffix: '' },
        { label: 'Program Beneficiaries', value: null, suffix: '' },
        { label: 'Programs and Projects', value: null, suffix: '' },
      ],
    },
    news: {
      eyebrow: 'Latest Updates',
      title: 'Latest News',
      items: [
        {
          id: 'condolences-sheikh-hamad',
          title:
            'Shura Council member and Veysel Karani Waqf president offers condolences on the passing of Sheikh Hamad bin Khalifa Al Thani',
          category: 'News',
          date: 'July 2026',
          excerpt:
            'Veysel Karani Waqf president and Shura Council member Salah Batiss offered condolences on the passing of Sheikh Hamad bin Khalifa Al Thani at the Consulate General of Qatar.',
          image: shared.newsImages.condolencesSheikhHamad,
          url: 'https://veysvakfi.org/shura-member-condolences-sheikh-hamad-bin-khalifa/',
          featured: true,
        },
        {
          id: 'democracy-unity-day',
          title: 'Veysel Karani Waqf marks the tenth anniversary of Türkiye’s Democracy and National Unity Day',
          category: 'News',
          date: 'July 2026',
          excerpt:
            'On the tenth anniversary of Democracy and National Unity Day, the waqf honors the sacrifices of the Turkish people in protecting their homeland, will, and unity.',
          image: shared.newsImages.democracyUnityDay,
          url: 'https://veysvakfi.org/owais-waqf-democracy-and-national-unity-day/',
        },
        {
          id: 'condolences-qatar',
          title: 'Veysel Karani Waqf extends condolences to Qatar on the passing of Sheikh Hamad bin Khalifa Al Thani',
          category: 'News',
          date: 'July 2026',
          excerpt:
            'With faithful hearts, we received the news of the passing of Sheikh Hamad bin Khalifa Al Thani; all waqf bodies extend their deepest condolences.',
          image: shared.newsImages.condolencesQatar,
          url: 'https://veysvakfi.org/owais-waqf-condolences-sheikh-hamad-bin-khalifa/',
        },
      ],
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
      secondaryButton: 'Volunteer With Us',
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
        { label: 'Contact', href: '#contact' },
      ],
      contactInfo: {
        address: 'Istanbul, Türkiye',
        email: 'info@veysvakfi.org',
        phone: '',
      },
      bankAccountsLink: 'Bank Accounts and Contribution Methods',
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
        twitter: 'Twitter',
        instagram: 'Instagram',
        youtube: 'YouTube',
      },
    },
  },
};

export function getDirection(locale: Locale): Direction {
  return languages.find((language) => language.code === locale)?.dir ?? 'rtl';
}

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value === 'ar' || value === 'tr' || value === 'en';
}
