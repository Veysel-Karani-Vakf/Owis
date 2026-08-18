import type { BreadcrumbItem } from '@/data/about';
import type { Locale } from '@/i18n/content';
import yemenPioneersHero from '@/assets/programs/yemen-pioneers-hero.jpeg';
import capacityHadramoutCoastImage from '@/assets/programs/capacity-hadramout-coast.jpeg';
import capacityHadramoutValleyImage from '@/assets/programs/capacity-hadramout-valley.jpeg';
import capacityMaribImage from '@/assets/programs/capacity-marib.jpeg';
import capacityTaizImage from '@/assets/programs/capacity-taiz.jpeg';
import institutionalDevelopmentImage from '@/assets/programs/institutional-development.jpg';
import awarenessOwaisPlatformImage from '@/assets/programs/awareness-owais-platform.jpg';
import awarenessVolunteerUnitImage from '@/assets/programs/awareness-volunteer-unit.jpg';

export const programRoutes = {
  yemenPioneers: '/programs/yemen-pioneers',
  capacityBuilding: '/programs/capacity-building',
  institutionalDevelopment: '/programs/institutional-development',
  communityAwareness: '/programs/community-awareness',
} as const;

export type ProgramSlug =
  | 'yemen-pioneers'
  | 'capacity-building'
  | 'institutional-development'
  | 'community-awareness';

export type ProgramSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: boolean;
};

export type ProgramStatistic = {
  label: string;
  value: string;
  description?: string;
};

export type ProgramVideo = {
  id: string;
  title: string;
  description: string;
  videoId: string;
  sourceUrl: string;
  posterImage: string;
};

export type ProgramImage = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type ProgramInitiative = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  url: string;
  products?: string[];
};

export type ProgramCity = {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  videoId: string;
  videoTitle: string;
  videoSourceUrl: string;
};

export type Program = {
  id: string;
  slug: ProgramSlug;
  route: string;
  title: string;
  summary: string;
  heroImage: string;
  heroImageAlt: string;
  images: string[];
  imageGallery: ProgramImage[];
  sections: ProgramSection[];
  goals?: string[];
  components?: string[];
  statistics?: ProgramStatistic[];
  videos?: ProgramVideo[];
  contactEmail?: string;
  initiatives?: ProgramInitiative[];
  cities?: ProgramCity[];
  officialSourceUrl: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
  mediaNote?: string;
};

export type ProgramsPageContent = {
  nav: { label: string; href: string }[];
  labels: {
    home: string;
    programs: string;
    overview: string;
    goals: string;
    components: string;
    officialMedia: string;
    information: string;
    statistics: string;
    cityMedia: string;
    initiatives: string;
    products: string;
    watchVideo: string;
    officialSource: string;
    openExternal: string;
    contact: string;
    otherPrograms: string;
    details: string;
    donate: string;
    noVerifiedStats: string;
  };
  programs: Program[];
};

const officialSources = {
  yemenPioneers: 'https://veysvakfi.org/pioneers-of-yemen-program/',
  capacityBuilding:
    'https://veysvakfi.org/copy-%d8%a8%d9%86%d8%a7%d8%a1-%d8%a7%d9%84%d9%82%d8%af%d8%b1%d8%a7%d8%aa/',
  institutionalDevelopment:
    'https://veysvakfi.org/%d8%a7%d9%84%d8%aa%d8%b7%d9%88%d9%8a%d8%b1-%d8%a7%d9%84%d9%85%d8%a4%d8%b3%d8%b3%d9%8a/',
  communityAwareness:
    'https://veysvakfi.org/%d8%a7%d9%84%d8%aa%d9%88%d8%b9%d9%8a%d8%a9-%d8%a7%d9%84%d9%85%d8%ac%d8%aa%d9%85%d8%b9%d9%8a%d8%a9-2/',
  owaisPlatform: 'https://veysvakfi.org/program/owais-platform/',
  volunteerUnit: 'https://veysvakfi.org/program/volunteer-unit/',
} as const;

const yemenPioneersVideos = [
  'dXNu9fzzPhE',
  'n2NVGTuC1QY',
  'fKQ1IfU0L08',
  '_h8m0_xcDhc',
  'NGQa-jeqn9k',
  'LiP3MDPxzdM',
] as const;

const capacityVideo = {
  videoId: '-WLqHrYnvJo',
  sourceUrl: 'https://youtu.be/-WLqHrYnvJo?si=9BrNIN10GtvMSV0s',
} as const;

const programShared = {
  'yemen-pioneers': {
    id: 'yemen-pioneers',
    slug: 'yemen-pioneers',
    route: programRoutes.yemenPioneers,
    heroImage: yemenPioneersHero,
    images: [yemenPioneersHero],
    officialSourceUrl: officialSources.yemenPioneers,
    contactEmail: 'yemenpioneers@veysvakfi.org',
  },
  'capacity-building': {
    id: 'capacity-building',
    slug: 'capacity-building',
    route: programRoutes.capacityBuilding,
    heroImage: capacityMaribImage,
    images: [
      capacityHadramoutCoastImage,
      capacityHadramoutValleyImage,
      capacityMaribImage,
      capacityTaizImage,
    ],
    officialSourceUrl: officialSources.capacityBuilding,
  },
  'institutional-development': {
    id: 'institutional-development',
    slug: 'institutional-development',
    route: programRoutes.institutionalDevelopment,
    heroImage: institutionalDevelopmentImage,
    images: [institutionalDevelopmentImage],
    officialSourceUrl: officialSources.institutionalDevelopment,
  },
  'community-awareness': {
    id: 'community-awareness',
    slug: 'community-awareness',
    route: programRoutes.communityAwareness,
    heroImage: awarenessOwaisPlatformImage,
    images: [awarenessOwaisPlatformImage, awarenessVolunteerUnitImage],
    officialSourceUrl: officialSources.communityAwareness,
  },
} satisfies Record<
  ProgramSlug,
  {
    id: ProgramSlug;
    slug: ProgramSlug;
    route: string;
    heroImage: string;
    images: string[];
    officialSourceUrl: string;
    contactEmail?: string;
  }
>;

const makeYemenVideos = (locale: Locale): ProgramVideo[] =>
  yemenPioneersVideos.map((videoId, index) => {
    const number = index + 1;
    const titleByLocale: Record<Locale, string> = {
      ar: `فيديو رسمي من برنامج رواد اليمن ${number}`,
      tr: `Yemen Onculeri Programi resmi videosu ${number}`,
      en: `Official Yemen Pioneers Program video ${number}`,
    };
    const descriptionByLocale: Record<Locale, string> = {
      ar: 'فيديو رسمي منشور ضمن صفحة برنامج رواد اليمن.',
      tr: 'Yemen Onculeri Programi sayfasinda yayinlanan resmi video.',
      en: 'An official video published on the Yemen Pioneers Program page.',
    };

    return {
      id: `yemen-pioneers-video-${number}`,
      title: titleByLocale[locale],
      description: descriptionByLocale[locale],
      videoId,
      sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
      posterImage: yemenPioneersHero,
    };
  });

export const localizedPrograms: Record<Locale, ProgramsPageContent> = {
  ar: {
    nav: [
      { label: 'برنامج رواد اليمن', href: programRoutes.yemenPioneers },
      { label: 'بناء القدرات', href: programRoutes.capacityBuilding },
      { label: 'التطوير المؤسسي', href: programRoutes.institutionalDevelopment },
      { label: 'التوعية المجتمعية', href: programRoutes.communityAwareness },
    ],
    labels: {
      home: 'الرئيسية',
      programs: 'البرامج',
      overview: 'التعريف بالبرنامج',
      goals: 'الأهداف',
      components: 'مكونات البرنامج',
      officialMedia: 'الصور والفيديوهات الرسمية',
      information: 'المعلومات والنتائج',
      statistics: 'إحصائيات موثقة',
      cityMedia: 'توثيق المدن',
      initiatives: 'المبادرات',
      products: 'منتجات المبادرة',
      watchVideo: 'مشاهدة الفيديو',
      officialSource: 'المصدر الرسمي',
      openExternal: 'يفتح رابطاً خارجياً للمصدر الرسمي',
      contact: 'للتواصل',
      otherPrograms: 'برامج أخرى',
      details: 'عرض التفاصيل',
      donate: 'ساهم الآن',
      noVerifiedStats: 'لم تُعرض أرقام غير موثقة في المصدر الرسمي.',
    },
    programs: [
      {
        ...programShared['yemen-pioneers'],
        title: 'برنامج رواد اليمن',
        summary:
          'برنامج متكامل للعناية بالتعليم والتأهيل النوعي للطلاب اليمنيين الموهوبين والمتفوقين، وإعدادهم قادةً للمستقبل عبر المنح الدراسية في أفضل الجامعات وبرنامج قيادي ومهاري موازٍ.',
        heroImageAlt: 'برنامج رواد اليمن من وقف أويس القرني',
        imageGallery: [
          {
            src: yemenPioneersHero,
            alt: 'صورة رسمية من صفحة برنامج رواد اليمن',
            caption: 'صورة رسمية منشورة ضمن صفحة برنامج رواد اليمن.',
            width: 1536,
            height: 649,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'فكرة البرنامج',
            paragraphs: [
              'برنامج رواد اليمن برنامج متكامل يهتم بالتعليم والتأهيل النوعي للطلاب اليمنيين الموهوبين والمتفوقين، وإعدادهم كقادة للمستقبل من خلال المنح الدراسية للدراسة في أفضل الجامعات وإلحاقهم ببرنامج قيادي ومهاري موازٍ.',
              'يسعى البرنامج إلى بناء كادر من القادة اليمنيين المهرة الذين يمتلكون المعرفة والمهارات والقيم اللازمة لخدمة اليمن والمشاركة في نهضته.',
            ],
          },
        ],
        goals: [
          'توفير فرص التعليم الجامعي والدراسات العليا للشباب اليمني.',
          'تمكين المشاركين من استشراف مستقبل اليمن وتحدياته.',
          'إكساب المشاركين المهارات القيادية من خلال التدريب المباشر والمتابعة والإرشاد.',
          'تهيئة المشاركين للعمل القيادي عبر المشاريع والبرامج والمبادرات والأنشطة.',
        ],
        components: [
          'دعم الشباب في الدراسات العليا في المجالات المستهدفة لبناء القدرات والكوادر.',
          'التنسيق مع الجامعات والمؤسسات الدولية للشراكة في تأهيل الطلاب المشاركين.',
          'برنامج تأهيلي قيادي مصاحب للدراسة الأكاديمية.',
        ],
        videos: makeYemenVideos('ar'),
        cta: {
          title: 'ادعم مسار إعداد القادة',
          description:
            'تفتح صفحة المساهمة فرص الدعم الرسمية المنشورة لدى وقف أويس القرني دون إنشاء نظام دفع داخلي.',
          button: 'اذهب إلى صفحة المساهمة',
        },
        mediaNote: 'إحصائيات الطلاب والمحافظات والجامعات والتخصصات لم تُعرض لأنها ظهرت صفراً في المصدر ولم تُتحقق كأرقام فعلية.',
        seo: {
          title: 'برنامج رواد اليمن | وقف أويس القرني',
          description:
            'تعرف على برنامج رواد اليمن للعناية بالتعليم والتأهيل النوعي للطلاب اليمنيين وإعدادهم قادةً للمستقبل.',
          canonical: officialSources.yemenPioneers,
        },
      },
      {
        ...programShared['capacity-building'],
        title: 'بناء القدرات',
        summary: 'المساهمة في تأهيل قيادات المؤسسات الحكومية والأهلية وتطوير أدائهم.',
        heroImageAlt: 'برنامج بناء القدرات في مأرب',
        imageGallery: [
          {
            src: capacityHadramoutCoastImage,
            alt: 'برنامج بناء القدرات في حضرموت الساحل',
            caption: 'حضرموت الساحل',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityHadramoutValleyImage,
            alt: 'برنامج بناء القدرات في حضرموت الوادي',
            caption: 'حضرموت الوادي',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityMaribImage,
            alt: 'برنامج بناء القدرات في مأرب',
            caption: 'مأرب',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityTaizImage,
            alt: 'برنامج بناء القدرات في تعز',
            caption: 'تعز',
            width: 1080,
            height: 1350,
          },
        ],
        statistics: [
          { value: '160', label: 'مشاركاً' },
          { value: '140', label: 'منظمة مجتمع مدني' },
          { value: '13', label: 'محافظة يمنية' },
          { value: '4', label: 'مدن' },
        ],
        cities: [
          {
            id: 'hadramout-coast',
            name: 'حضرموت الساحل',
            image: capacityHadramoutCoastImage,
            imageAlt: 'توثيق برنامج بناء القدرات في حضرموت الساحل',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج بناء القدرات في حضرموت الساحل',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'hadramout-valley',
            name: 'حضرموت الوادي',
            image: capacityHadramoutValleyImage,
            imageAlt: 'توثيق برنامج بناء القدرات في حضرموت الوادي',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج بناء القدرات في حضرموت الوادي',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'marib',
            name: 'مأرب',
            image: capacityMaribImage,
            imageAlt: 'توثيق برنامج بناء القدرات في مأرب',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج بناء القدرات في مأرب',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'taiz',
            name: 'تعز',
            image: capacityTaizImage,
            imageAlt: 'توثيق برنامج بناء القدرات في تعز',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج بناء القدرات في تعز',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'تعريف البرنامج',
            paragraphs: ['يركز البرنامج على تأهيل قيادات المؤسسات الحكومية والأهلية وتطوير أدائهم.'],
          },
          {
            id: 'closing-statement',
            title: 'بيان المرحلة الأولى',
            paragraphs: [
              'أقيمت المرحلة الأولى من برنامج رفع قدرات منظمات المجتمع المدني من الاثنين 8 يوليو حتى الخميس 25 يوليو 2024 في حضرموت الساحل وحضرموت الوادي ومأرب وتعز.',
              'نُفذت المرحلة في تعز بالشراكة مع مؤسسة رسالتي لتنمية المرأة، وفي حضرموت المكلا بالشراكة مع مؤسسة صلة للتنمية، وفي حضرموت الوادي بالشراكة مع مؤسسة البادية للتنمية والأعمال الإنسانية، وفي مأرب برعاية مكتب أوتشا مأرب وبالشراكة مع الهيئة العالمية للإغاثة والتنمية - أنصر، مكتب اليمن.',
              'شارك في المرحلة 160 مشاركاً يمثلون 140 منظمة مجتمع مدني من 13 محافظة يمنية، وحضر جلسات الافتتاح مسؤولون أكدوا أهمية البرنامج في تطوير أداء منظمات المجتمع المدني وخدمة التنمية في اليمن.',
            ],
          },
          {
            id: 'recommendations',
            title: 'التوصيات',
            ordered: true,
            bullets: [
              'إعداد دليل بالاحتياجات الإنسانية والتنموية لكل محافظة بالشراكة مع منظمات المجتمع المدني والجهات الرسمية.',
              'تنفيذ ورش حول القانون رقم 1 لسنة 2021 الخاص بالجمعيات والاتحادات ولائحته التنفيذية.',
              'تعزيز التواصل بين المنظمات المحلية والجهات الدولية والمحلية لتحقيق أهداف التنمية.',
              'استمرار المراحل التالية من البرنامج.',
            ],
          },
          {
            id: 'forum',
            title: 'الملتقى الوطني لتوطين العمل الإنساني والتنموي',
            paragraphs: [
              'أُطلق في مأرب الملتقى الوطني لتوطين العمل الإنساني والتنموي في اليمن بالشراكة بين وقف أويس القرني والهيئة العالمية للإغاثة والتنمية - أنصر والمركز اليمني للدراسات الإنسانية والاستراتيجية.',
            ],
            ordered: true,
            bullets: [
              'حشد جهود منظمات المجتمع المدني باتجاه التوطين.',
              'خلق بيئة ملائمة لمنظمات المجتمع المدني لبناء قدراتها بما يسهم في تحسين مستوى التوطين.',
              'التشبيك مع أصحاب المصلحة لإيجاد نقاط مشتركة تسرع عملية التوطين.',
            ],
          },
        ],
        cta: {
          title: 'ادعم بناء القدرات المؤسسية',
          description:
            'تجمع صفحة المساهمة الرسمية الفرص المتاحة لدعم مشاريع الوقف وبرامجه التنموية.',
          button: 'اذهب إلى صفحة المساهمة',
        },
        seo: {
          title: 'بناء القدرات | وقف أويس القرني',
          description:
            'برنامج بناء القدرات لتأهيل قيادات المؤسسات الحكومية والأهلية وتطوير أداء منظمات المجتمع المدني.',
          canonical: officialSources.capacityBuilding,
        },
      },
      {
        ...programShared['institutional-development'],
        title: 'التطوير المؤسسي',
        summary: 'تطوير أداء المؤسسات الحكومية والأهلية وتحديث برامجها وآلياتها وخططها واستراتيجيتها.',
        heroImageAlt: 'مسار التطوير المؤسسي في وقف أويس القرني',
        imageGallery: [
          {
            src: institutionalDevelopmentImage,
            alt: 'صورة رسمية مستخدمة في الموقع لمسار التطوير المؤسسي',
            width: 1080,
            height: 1080,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'تعريف البرنامج',
            paragraphs: [
              'يركز مسار التطوير المؤسسي على تطوير أداء المؤسسات الحكومية والأهلية وتحديث برامجها وآلياتها وخططها واستراتيجيتها.',
            ],
            bullets: [
              'تطوير أداء المؤسسات الحكومية والأهلية.',
              'تحديث البرامج والآليات.',
              'تطوير الخطط والاستراتيجيات.',
            ],
          },
        ],
        cta: {
          title: 'ساهم في دعم التطوير المؤسسي',
          description:
            'يمكن الوصول إلى فرص المساهمة الرسمية المنشورة لدى وقف أويس القرني من صفحة المساهمة الداخلية.',
          button: 'اذهب إلى صفحة المساهمة',
        },
        mediaNote: 'لم يتضمن المصدر الرسمي أرقاماً أو فيديوهات تفصيلية خاصة بهذه الصفحة، لذلك لم تُضاف بيانات غير موثقة.',
        seo: {
          title: 'التطوير المؤسسي | وقف أويس القرني',
          description:
            'تعرف على مسار التطوير المؤسسي لتطوير أداء المؤسسات الحكومية والأهلية وتحديث برامجها وخططها.',
          canonical: officialSources.institutionalDevelopment,
        },
      },
      {
        ...programShared['community-awareness'],
        title: 'التوعية المجتمعية',
        summary: 'إعادة صياغة الرأي العام والهوية الوطنية الجامعة والتوعية بثقافة النهضة والتعايش.',
        heroImageAlt: 'منصة أويس ضمن مسار التوعية المجتمعية',
        imageGallery: [
          {
            src: awarenessOwaisPlatformImage,
            alt: 'منصة أويس',
            caption: 'منصة أويس',
            width: 1080,
            height: 1080,
          },
          {
            src: awarenessVolunteerUnitImage,
            alt: 'وحدة التطوع',
            caption: 'وحدة التطوع',
            width: 1080,
            height: 1080,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'تعريف البرنامج',
            paragraphs: [
              'يركز مسار التوعية المجتمعية على إعادة صياغة الرأي العام والهوية الوطنية الجامعة والتوعية بثقافة النهضة والتعايش.',
            ],
          },
        ],
        initiatives: [
          {
            title: 'منصة أويس',
            description:
              'إحدى مبادرات المسار الرابع لوقف أويس القرني، تُعنى بقضايا الفكر والنهوض الحضاري من خلال قراءة التاريخ ودراسة الحاضر واستشراف المستقبل، وتسعى لتعزيز الوعي الجمعي عبر مواد وبرامج معرفية مختلفة.',
            image: awarenessOwaisPlatformImage,
            imageAlt: 'شعار منصة أويس',
            url: officialSources.owaisPlatform,
            products: ['بودكاست أويس', 'مواد مرئية متفرقة', 'ديوانية أويس', 'المدونة'],
          },
          {
            title: 'وحدة التطوع',
            description:
              'إحدى مبادرات المسار الرابع لوقف أويس القرني، وتسعى لترسيخ ثقافة العمل التطوعي وتقديم الفرص التطوعية المختلفة لتحقيق أهداف الوقف.',
            image: awarenessVolunteerUnitImage,
            imageAlt: 'شعار وحدة التطوع',
            url: officialSources.volunteerUnit,
          },
        ],
        cta: {
          title: 'ادعم مبادرات الوعي والعمل التطوعي',
          description:
            'تعرض صفحة المساهمة الرسمية فرص الدعم المتاحة لدى وقف أويس القرني دون بناء نظام دفع داخلي.',
          button: 'اذهب إلى صفحة المساهمة',
        },
        seo: {
          title: 'التوعية المجتمعية | وقف أويس القرني',
          description:
            'تعرف على مسار التوعية المجتمعية ومبادرات منصة أويس ووحدة التطوع في وقف أويس القرني.',
          canonical: officialSources.communityAwareness,
        },
      },
    ],
  },
  tr: {
    nav: [
      { label: 'Yemen Onculeri Programi', href: programRoutes.yemenPioneers },
      { label: 'Kapasite Gelistirme', href: programRoutes.capacityBuilding },
      { label: 'Kurumsal Gelisim', href: programRoutes.institutionalDevelopment },
      { label: 'Toplumsal Farkindalik', href: programRoutes.communityAwareness },
    ],
    labels: {
      home: 'Ana Sayfa',
      programs: 'Programlar',
      overview: 'Program Ozeti',
      goals: 'Hedefler',
      components: 'Program Bilesenleri',
      officialMedia: 'Resmi Gorseller ve Videolar',
      information: 'Bilgiler ve Sonuclar',
      statistics: 'Dogrulanmis Veriler',
      cityMedia: 'Sehir Belgeleri',
      initiatives: 'Girisimler',
      products: 'Girisim Urunleri',
      watchVideo: 'Videoyu Izle',
      officialSource: 'Resmi Kaynak',
      openExternal: 'Resmi kaynak yeni sekmede acilir',
      contact: 'Iletisim',
      otherPrograms: 'Diger Programlar',
      details: 'Detaylari Gor',
      donate: 'Katki Sun',
      noVerifiedStats: 'Resmi kaynakta dogrulanmayan sayilar gosterilmedi.',
    },
    programs: [
      {
        ...programShared['yemen-pioneers'],
        title: 'Yemen Onculeri Programi',
        summary:
          'Ustun yetenekli ve basarili Yemenli ogrencilerin nitelikli egitim ve gelisimini destekleyen; onlari burslar, secili universiteler ve paralel liderlik-beceri programi ile gelecegin liderleri olarak hazirlayan butunlesik bir program.',
        heroImageAlt: 'Veysel Karani Vakfi Yemen Onculeri Programi',
        imageGallery: [
          {
            src: yemenPioneersHero,
            alt: 'Yemen Onculeri Programi resmi gorseli',
            caption: 'Yemen Onculeri Programi sayfasindan resmi gorsel.',
            width: 1536,
            height: 649,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Fikri',
            paragraphs: [
              'Yemen Onculeri Programi, ustun yetenekli ve basarili Yemenli ogrencilerin nitelikli egitim ve gelisimine odaklanan butunlesik bir programdir. Ogrencileri en iyi universitelerde egitim burslariyla destekler ve akademik surece paralel liderlik ve beceri programina dahil eder.',
              'Program, Yemenin kalkinmasina hizmet edecek bilgi, beceri ve degerlere sahip nitelikli Yemenli lider kadrolar yetistirmeyi hedefler.',
            ],
          },
        ],
        goals: [
          'Yemenli genclere lisans ve lisansustu egitim firsatlari saglamak.',
          'Katilimcilarin Yemenin gelecegini ve karsilasacagi zorluklari ongormesini saglamak.',
          'Dogrudan egitim, takip ve rehberlik yoluyla liderlik becerileri kazandirmak.',
          'Katilimcilari projeler, programlar, girisimler ve faaliyetler yoluyla liderlik calismalarina hazirlamak.',
        ],
        components: [
          'Hedeflenen kapasite ve kadro alanlarinda lisansustu egitim alan gencleri desteklemek.',
          'Katilimci ogrencilerin yetistirilmesi icin universiteler ve uluslararasi kurumlarla ortaklik kurmak.',
          'Akademik egitime eslik eden liderlik gelisim programi.',
        ],
        videos: makeYemenVideos('tr'),
        cta: {
          title: 'Lider Yetistirme Calismalarini Destekleyin',
          description:
            'Katki sayfasi, vakfin resmi destek firsatlarini dahili bir odeme sistemi kurmadan gosterir.',
          button: 'Katki Sayfasina Git',
        },
        mediaNote:
          'Ogrenci, il, universite ve uzmanlik sayilari kaynakta sifir olarak gorundugu ve dogrulanmadigi icin gosterilmedi.',
        seo: {
          title: 'Yemen Onculeri Programi | Veysel Karani Vakfi',
          description:
            'Yemenli ogrencilerin nitelikli egitimini destekleyen ve onlari gelecegin liderleri olarak hazirlayan Yemen Onculeri Programi.',
          canonical: officialSources.yemenPioneers,
        },
      },
      {
        ...programShared['capacity-building'],
        title: 'Kapasite Gelistirme',
        summary: 'Kamu ve sivil kurum liderlerinin yetistirilmesine ve performanslarinin gelistirilmesine katkida bulunmak.',
        heroImageAlt: 'Marib Kapasite Gelistirme Programi',
        imageGallery: [
          {
            src: capacityHadramoutCoastImage,
            alt: 'Hadramut Sahili Kapasite Gelistirme Programi',
            caption: 'Hadramut Sahili',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityHadramoutValleyImage,
            alt: 'Hadramut Vadisi Kapasite Gelistirme Programi',
            caption: 'Hadramut Vadisi',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityMaribImage,
            alt: 'Marib Kapasite Gelistirme Programi',
            caption: 'Marib',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityTaizImage,
            alt: 'Taiz Kapasite Gelistirme Programi',
            caption: 'Taiz',
            width: 1080,
            height: 1350,
          },
        ],
        statistics: [
          { value: '160', label: 'Katilimci' },
          { value: '140', label: 'Sivil toplum kurumu' },
          { value: '13', label: 'Yemen ili' },
          { value: '4', label: 'Sehir' },
        ],
        cities: [
          {
            id: 'hadramout-coast',
            name: 'Hadramut Sahili',
            image: capacityHadramoutCoastImage,
            imageAlt: 'Hadramut Sahili kapasite gelistirme belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Hadramut Sahili Kapasite Gelistirme Programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'hadramout-valley',
            name: 'Hadramut Vadisi',
            image: capacityHadramoutValleyImage,
            imageAlt: 'Hadramut Vadisi kapasite gelistirme belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Hadramut Vadisi Kapasite Gelistirme Programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'marib',
            name: 'Marib',
            image: capacityMaribImage,
            imageAlt: 'Marib kapasite gelistirme belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Marib Kapasite Gelistirme Programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'taiz',
            name: 'Taiz',
            image: capacityTaizImage,
            imageAlt: 'Taiz kapasite gelistirme belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Taiz Kapasite Gelistirme Programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Tanimi',
            paragraphs: ['Program, kamu ve sivil kurum liderlerinin yetistirilmesine ve performanslarinin gelistirilmesine odaklanir.'],
          },
          {
            id: 'closing-statement',
            title: 'Birinci Asama Aciklamasi',
            paragraphs: [
              'Sivil Toplum Kuruluslari Kapasite Artirma Programinin birinci asamasi 8 Temmuz Pazartesi ile 25 Temmuz 2024 Persembe arasinda Hadramut Sahili, Hadramut Vadisi, Marib ve Taiz sehirlerinde duzenlendi.',
              'Taizde Resalaty Kadin Kalkinma Vakfi, Hadramut Mukallada Selah Kalkinma Vakfi, Hadramut Vadisinde Al-Badia Insani Kalkinma Vakfi ile ortaklik yapildi. Marib uygulamasi OCHA Marib ofisi himayesinde ve International Relief and Development Authority - Ansar Yemen ofisi ortakliginda gerceklesti.',
              'Asamaya 13 Yemen ilinden 140 sivil toplum kurulusunu temsil eden 160 katilimci katildi. Acilis oturumlarina katilan yetkililer, programin sivil toplum performansini ve Yemen kalkinmasini gelistirmedeki onemini vurguladi.',
            ],
          },
          {
            id: 'recommendations',
            title: 'Oneriler',
            ordered: true,
            bullets: [
              'Her il icin sivil toplum kuruluslari ve resmi makamlarla insani ve kalkinma ihtiyaclari rehberi hazirlamak.',
              'Dernekler ve birlikler hakkindaki 2021 tarihli 1 sayili kanun ve uygulama yonetmeligi uzerine atolye calismalari yapmak.',
              'Yerel kuruluslar ile uluslararasi ve yerel aktorler arasinda iletisimi guclendirmek.',
              'Programin sonraki asamalarini surdurmek.',
            ],
          },
          {
            id: 'forum',
            title: 'Yemende Insani ve Kalkinma Calismalarinin Yerellestirilmesi Ulusal Forumu',
            paragraphs: [
              'Maribde, Veysel Karani Vakfi, International Relief and Development Authority - Ansar ve Yemen Insani ve Stratejik Calismalar Merkezi ortakliginda ulusal forum baslatildi.',
            ],
            ordered: true,
            bullets: [
              'Sivil toplum kuruluslarinin cabalarini yerellestirme yonunde harekete gecirmek.',
              'Yerellestirme duzeyini iyilestirmek icin sivil toplum kuruluslarinin kapasitelerini gelistirebilecegi uygun bir ortam olusturmak.',
              'Paydaslarla ag kurarak yerellestirmeyi hizlandiracak ortak noktalar gelistirmek.',
            ],
          },
        ],
        cta: {
          title: 'Kurumsal Kapasiteyi Destekleyin',
          description: 'Resmi katkı sayfasi, vakfin mevcut proje ve program destek firsatlarini bir araya getirir.',
          button: 'Katki Sayfasina Git',
        },
        seo: {
          title: 'Kapasite Gelistirme | Veysel Karani Vakfi',
          description:
            'Kamu ve sivil kurum liderlerinin yetistirilmesi, sivil toplum performansinin gelistirilmesi ve yerellestirme calismalari.',
          canonical: officialSources.capacityBuilding,
        },
      },
      {
        ...programShared['institutional-development'],
        title: 'Kurumsal Gelisim',
        summary: 'Kamu ve sivil kurumlarin performansini gelistirmek; programlarini, mekanizmalarini, planlarini ve stratejilerini yenilemek.',
        heroImageAlt: 'Veysel Karani Vakfi Kurumsal Gelisim Programi',
        imageGallery: [
          {
            src: institutionalDevelopmentImage,
            alt: 'Kurumsal Gelisim programi icin resmi site gorseli',
            width: 1080,
            height: 1080,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Tanimi',
            paragraphs: [
              'Kurumsal Gelisim programi, kamu ve sivil kurumlarin performansini gelistirmeye; programlarini, mekanizmalarini, planlarini ve stratejilerini yenilemeye odaklanir.',
            ],
            bullets: [
              'Kamu ve sivil kurum performansini gelistirmek.',
              'Programlari ve mekanizmalari yenilemek.',
              'Planlari ve stratejileri gelistirmek.',
            ],
          },
        ],
        cta: {
          title: 'Kurumsal Gelisimi Destekleyin',
          description:
            'Veysel Karani Vakfinin resmi destek firsatlarina dahili katkı sayfasi uzerinden ulasilabilir.',
          button: 'Katki Sayfasina Git',
        },
        mediaNote:
          'Resmi kaynakta bu sayfaya ozel ayrintili istatistik veya video bulunmadigi icin dogrulanmayan veri eklenmedi.',
        seo: {
          title: 'Kurumsal Gelisim | Veysel Karani Vakfi',
          description:
            'Kamu ve sivil kurum performansini gelistiren, programlari, planlari ve stratejileri yenileyen kurumsal gelisim programi.',
          canonical: officialSources.institutionalDevelopment,
        },
      },
      {
        ...programShared['community-awareness'],
        title: 'Toplumsal Farkindalik',
        summary: 'Kamuoyu algisini, kapsayici ulusal kimligi, kalkinis ve birlikte yasama kulturunu yeniden guclendirmek.',
        heroImageAlt: 'Toplumsal Farkindalik kapsami icindeki Owais Platformu',
        imageGallery: [
          {
            src: awarenessOwaisPlatformImage,
            alt: 'Owais Platformu',
            caption: 'Owais Platformu',
            width: 1080,
            height: 1080,
          },
          {
            src: awarenessVolunteerUnitImage,
            alt: 'Gonulluluk Birimi',
            caption: 'Gonulluluk Birimi',
            width: 1080,
            height: 1080,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Tanimi',
            paragraphs: [
              'Toplumsal Farkindalik programi; kamuoyunu, kapsayici ulusal kimligi ve kalkinis ile birlikte yasama kulturunu guclendirmeye odaklanir.',
            ],
          },
        ],
        initiatives: [
          {
            title: 'Owais Platformu',
            description:
              'Vakfin dorduncu eksenindeki girisimlerden biridir. Dusunce ve medeniyet kalkinisi konularina tarih okumasi, bugunun incelenmesi ve gelecegin ongorulmesi yoluyla odaklanir; farkli bilgi materyalleri ve programlarla kolektif bilinci guclendirmeyi hedefler.',
            image: awarenessOwaisPlatformImage,
            imageAlt: 'Owais Platformu logosu',
            url: officialSources.owaisPlatform,
            products: ['Owais Podcast', 'Cesitli gorsel icerikler', 'Owais Divani', 'Blog'],
          },
          {
            title: 'Gonulluluk Birimi',
            description:
              'Vakfin dorduncu eksenindeki girisimlerden biridir. Gonullu calisma kulturunu yerlestirmeyi ve vakfin hedeflerini gerceklestirmek icin cesitli gonulluluk firsatlari sunmayi amaclar.',
            image: awarenessVolunteerUnitImage,
            imageAlt: 'Gonulluluk Birimi logosu',
            url: officialSources.volunteerUnit,
          },
        ],
        cta: {
          title: 'Farkindalik ve Gonulluluk Girisimlerini Destekleyin',
          description:
            'Resmi katkı sayfasi, dahili bir odeme sistemi kurmadan vakfin mevcut destek firsatlarini gosterir.',
          button: 'Katki Sayfasina Git',
        },
        seo: {
          title: 'Toplumsal Farkindalik | Veysel Karani Vakfi',
          description:
            'Owais Platformu ve Gonulluluk Birimi girisimleriyle toplumsal farkindalik programini inceleyin.',
          canonical: officialSources.communityAwareness,
        },
      },
    ],
  },
  en: {
    nav: [
      { label: 'Yemen Pioneers Program', href: programRoutes.yemenPioneers },
      { label: 'Capacity Building', href: programRoutes.capacityBuilding },
      { label: 'Institutional Development', href: programRoutes.institutionalDevelopment },
      { label: 'Community Awareness', href: programRoutes.communityAwareness },
    ],
    labels: {
      home: 'Home',
      programs: 'Programs',
      overview: 'Program Overview',
      goals: 'Goals',
      components: 'Program Components',
      officialMedia: 'Official Images and Videos',
      information: 'Information and Results',
      statistics: 'Verified Statistics',
      cityMedia: 'City Documentation',
      initiatives: 'Initiatives',
      products: 'Initiative Products',
      watchVideo: 'Watch Video',
      officialSource: 'Official Source',
      openExternal: 'Opens the official source in a new tab',
      contact: 'Contact',
      otherPrograms: 'Other Programs',
      details: 'View Details',
      donate: 'Contribute Now',
      noVerifiedStats: 'Numbers that were not verified in the official source are not displayed.',
    },
    programs: [
      {
        ...programShared['yemen-pioneers'],
        title: 'Yemen Pioneers Program',
        summary:
          'An integrated program for quality education and training of gifted, outstanding Yemeni students, preparing them as future leaders through scholarships at leading universities and a parallel leadership and skills program.',
        heroImageAlt: 'Veysel Karani Waqf Yemen Pioneers Program',
        imageGallery: [
          {
            src: yemenPioneersHero,
            alt: 'Official Yemen Pioneers Program image',
            caption: 'Official image published on the Yemen Pioneers Program page.',
            width: 1536,
            height: 649,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Idea',
            paragraphs: [
              'The Yemen Pioneers Program is an integrated program focused on quality education and training for gifted, outstanding Yemeni students. It prepares them as future leaders through scholarships at leading universities and a parallel leadership and skills program.',
              'The program seeks to build a skilled cadre of Yemeni leaders with the knowledge, skills and values needed to serve Yemen and contribute to its advancement.',
            ],
          },
        ],
        goals: [
          'Provide bachelor and graduate education opportunities for Yemeni youth.',
          'Enable participants to foresee the future of Yemen and its challenges.',
          'Develop leadership skills through direct training, follow-up and guidance.',
          'Prepare participants for leadership work through projects, programs, initiatives and activities.',
        ],
        components: [
          'Support youth in graduate studies in targeted capacity and cadre-building fields.',
          'Coordinate with universities and international institutions to partner in qualifying participating students.',
          'A leadership qualification program that runs alongside academic study.',
        ],
        videos: makeYemenVideos('en'),
        cta: {
          title: 'Support Leadership Preparation',
          description:
            'The contribution page presents the official support opportunities published by Veysel Karani Waqf without creating an internal payment system.',
          button: 'Go to Contribution Page',
        },
        mediaNote:
          'Student, governorate, university and specialization counts were not displayed because the source showed zeros and the values could not be verified.',
        seo: {
          title: 'Yemen Pioneers Program | Veysel Karani Waqf',
          description:
            'Explore the Yemen Pioneers Program for quality education and leadership preparation of outstanding Yemeni students.',
          canonical: officialSources.yemenPioneers,
        },
      },
      {
        ...programShared['capacity-building'],
        title: 'Capacity Building',
        summary: 'Contributing to the qualification of leaders in governmental and civil institutions and improving their performance.',
        heroImageAlt: 'Capacity Building Program in Marib',
        imageGallery: [
          {
            src: capacityHadramoutCoastImage,
            alt: 'Capacity Building Program in Hadramout Coast',
            caption: 'Hadramout Coast',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityHadramoutValleyImage,
            alt: 'Capacity Building Program in Hadramout Valley',
            caption: 'Hadramout Valley',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityMaribImage,
            alt: 'Capacity Building Program in Marib',
            caption: 'Marib',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityTaizImage,
            alt: 'Capacity Building Program in Taiz',
            caption: 'Taiz',
            width: 1080,
            height: 1350,
          },
        ],
        statistics: [
          { value: '160', label: 'Participants' },
          { value: '140', label: 'Civil society organizations' },
          { value: '13', label: 'Yemeni governorates' },
          { value: '4', label: 'Cities' },
        ],
        cities: [
          {
            id: 'hadramout-coast',
            name: 'Hadramout Coast',
            image: capacityHadramoutCoastImage,
            imageAlt: 'Capacity Building documentation in Hadramout Coast',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity Building Program video in Hadramout Coast',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'hadramout-valley',
            name: 'Hadramout Valley',
            image: capacityHadramoutValleyImage,
            imageAlt: 'Capacity Building documentation in Hadramout Valley',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity Building Program video in Hadramout Valley',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'marib',
            name: 'Marib',
            image: capacityMaribImage,
            imageAlt: 'Capacity Building documentation in Marib',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity Building Program video in Marib',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
          {
            id: 'taiz',
            name: 'Taiz',
            image: capacityTaizImage,
            imageAlt: 'Capacity Building documentation in Taiz',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity Building Program video in Taiz',
            videoSourceUrl: capacityVideo.sourceUrl,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Definition',
            paragraphs: [
              'The program focuses on qualifying leaders of governmental and civil institutions and improving their performance.',
            ],
          },
          {
            id: 'closing-statement',
            title: 'First Phase Statement',
            paragraphs: [
              'The first phase of the Civil Society Organizations Capacity Raising Program was held from Monday, July 8 to Thursday, July 25, 2024 in Hadramout Coast, Hadramout Valley, Marib and Taiz.',
              'The phase was implemented in Taiz with Resalaty Foundation for Women Development, in Hadramout Mukalla with Selah Foundation for Development, in Hadramout Valley with Al-Badia Foundation for Humanitarian Development, and in Marib under the sponsorship of OCHA Marib with the International Relief and Development Authority - Ansar, Yemen office.',
              'The phase included 160 participants representing 140 civil society organizations from 13 Yemeni governorates. Officials attended the opening sessions and emphasized the importance of the program for improving civil society performance and supporting development in Yemen.',
            ],
          },
          {
            id: 'recommendations',
            title: 'Recommendations',
            ordered: true,
            bullets: [
              'Prepare a humanitarian and development needs guide for each governorate with civil society organizations and official authorities.',
              'Hold workshops on Law No. 1 of 2021 for associations and unions and its executive regulation.',
              'Strengthen communication between local organizations and international and local actors to achieve development goals.',
              'Continue the next phases of the program.',
            ],
          },
          {
            id: 'forum',
            title: 'National Forum for Localization of Humanitarian and Development Work in Yemen',
            paragraphs: [
              'The forum was launched in Marib by Veysel Karani Waqf, the International Relief and Development Authority - Ansar and the Yemeni Center for Humanitarian and Strategic Studies.',
            ],
            ordered: true,
            bullets: [
              'Mobilize civil society organization efforts toward localization.',
              'Create an enabling environment for civil society organizations to build capacities that improve localization.',
              'Network with stakeholders to create common points that accelerate localization.',
            ],
          },
        ],
        cta: {
          title: 'Support Institutional Capacity',
          description:
            'The official contribution page gathers available opportunities to support the waqf projects and development programs.',
          button: 'Go to Contribution Page',
        },
        seo: {
          title: 'Capacity Building | Veysel Karani Waqf',
          description:
            'Capacity Building Program for qualifying governmental and civil institution leaders and improving civil society performance.',
          canonical: officialSources.capacityBuilding,
        },
      },
      {
        ...programShared['institutional-development'],
        title: 'Institutional Development',
        summary: 'Developing the performance of governmental and civil institutions and updating their programs, mechanisms, plans and strategies.',
        heroImageAlt: 'Veysel Karani Waqf Institutional Development track',
        imageGallery: [
          {
            src: institutionalDevelopmentImage,
            alt: 'Official site image for Institutional Development',
            width: 1080,
            height: 1080,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Definition',
            paragraphs: [
              'The Institutional Development track focuses on developing the performance of governmental and civil institutions and updating their programs, mechanisms, plans and strategies.',
            ],
            bullets: [
              'Develop the performance of governmental and civil institutions.',
              'Update programs and mechanisms.',
              'Develop plans and strategies.',
            ],
          },
        ],
        cta: {
          title: 'Support Institutional Development',
          description:
            'The official support opportunities published by Veysel Karani Waqf can be reached through the internal contribution page.',
          button: 'Go to Contribution Page',
        },
        mediaNote:
          'The official source did not include detailed statistics or videos for this page, so no unverified data was added.',
        seo: {
          title: 'Institutional Development | Veysel Karani Waqf',
          description:
            'Institutional Development track for improving governmental and civil institution performance and updating programs and strategies.',
          canonical: officialSources.institutionalDevelopment,
        },
      },
      {
        ...programShared['community-awareness'],
        title: 'Community Awareness',
        summary: 'Reshaping public opinion, the inclusive national identity, and awareness of the culture of advancement and coexistence.',
        heroImageAlt: 'Owais Platform within the Community Awareness track',
        imageGallery: [
          {
            src: awarenessOwaisPlatformImage,
            alt: 'Owais Platform',
            caption: 'Owais Platform',
            width: 1080,
            height: 1080,
          },
          {
            src: awarenessVolunteerUnitImage,
            alt: 'Volunteer Unit',
            caption: 'Volunteer Unit',
            width: 1080,
            height: 1080,
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Program Definition',
            paragraphs: [
              'The Community Awareness track focuses on reshaping public opinion, the inclusive national identity, and awareness of the culture of advancement and coexistence.',
            ],
          },
        ],
        initiatives: [
          {
            title: 'Owais Platform',
            description:
              'One of the fourth-track initiatives of Veysel Karani Waqf. It focuses on issues of thought and civilizational advancement through reading history, studying the present and anticipating the future, while strengthening collective awareness through varied knowledge materials and programs.',
            image: awarenessOwaisPlatformImage,
            imageAlt: 'Owais Platform logo',
            url: officialSources.owaisPlatform,
            products: ['Owais Podcast', 'Various visual materials', 'Owais Diwaniya', 'Blog'],
          },
          {
            title: 'Volunteer Unit',
            description:
              'One of the fourth-track initiatives of Veysel Karani Waqf. It seeks to root the culture of volunteer work and provide varied volunteer opportunities to achieve the goals of the waqf.',
            image: awarenessVolunteerUnitImage,
            imageAlt: 'Volunteer Unit logo',
            url: officialSources.volunteerUnit,
          },
        ],
        cta: {
          title: 'Support Awareness and Volunteer Initiatives',
          description:
            'The official contribution page presents available support opportunities without creating an internal payment system.',
          button: 'Go to Contribution Page',
        },
        seo: {
          title: 'Community Awareness | Veysel Karani Waqf',
          description:
            'Explore the Community Awareness track and its Owais Platform and Volunteer Unit initiatives.',
          canonical: officialSources.communityAwareness,
        },
      },
    ],
  },
};

export function getProgramsContent(locale: Locale) {
  return localizedPrograms[locale];
}

export function isProgramSlug(slug: string | undefined): slug is ProgramSlug {
  return (
    slug === 'yemen-pioneers' ||
    slug === 'capacity-building' ||
    slug === 'institutional-development' ||
    slug === 'community-awareness'
  );
}

export function getProgram(locale: Locale, slug: string | undefined) {
  if (!isProgramSlug(slug)) return undefined;
  return localizedPrograms[locale].programs.find((program) => program.slug === slug);
}

export function getOtherPrograms(locale: Locale, slug: ProgramSlug) {
  return localizedPrograms[locale].programs.filter((program) => program.slug !== slug);
}

export function getProgramBreadcrumbs(locale: Locale, program: Program): BreadcrumbItem[] {
  const content = localizedPrograms[locale];

  return [
    { label: content.labels.home, href: '/' },
    { label: content.labels.programs, href: '/#programs' },
    { label: program.title },
  ];
}
