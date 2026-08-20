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
  partner?: string;
};

export type ProgramPhase = {
  label: string;
  period: string;
  description: string;
};

export type ProgramAudience = {
  id: string;
  title: string;
  description: string;
};

export type ProgramJourneyStep = {
  id: string;
  title: string;
  description: string;
};

export type ProgramPillar = {
  id: string;
  title: string;
  body: string;
  points: string[];
};

export type ProgramTheme = {
  id: string;
  title: string;
  description: string;
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
  journey?: ProgramJourneyStep[];
  pillars?: ProgramPillar[];
  highlights?: string[];
  phase?: ProgramPhase;
  audiences?: ProgramAudience[];
  themes?: ProgramTheme[];
  overviewImage?: string;
  overviewImageAlt?: string;
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
    journey: string;
    journeyEyebrow: string;
    journeyDescription: string;
    stepLabel: string;
    pillars: string;
    pillarsEyebrow: string;
    pillarsDescription: string;
    videoGallery: string;
    videoGalleryDescription: string;
    previous: string;
    next: string;
    highlights: string;
    phaseEyebrow: string;
    partner: string;
    cityExplorerDescription: string;
    recommendationsEyebrow: string;
    recommendationsDescription: string;
    forumEyebrow: string;
    forumObjectives: string;
    statsEyebrow: string;
    manifestoEyebrow: string;
    focusAreas: string;
    focusAreasDescription: string;
    areaLabel: string;
    audiences: string;
    audiencesDescription: string;
    awarenessEyebrow: string;
    awarenessHeroNote: string;
    exploreInitiatives: string;
    awarenessThemes: string;
    awarenessThemesDescription: string;
    themeLabel: string;
    awarenessInitiativesEyebrow: string;
    awarenessInitiatives: string;
    awarenessInitiativesDescription: string;
    initiativeLabel: string;
    visitInitiative: string;
    volunteerCta: string;
    volunteerCtaDescription: string;
  };
  programs: Program[];
};

// This site is the official source now: program references stay in-site.
const officialSources = {
  yemenPioneers: programRoutes.yemenPioneers,
  capacityBuilding: programRoutes.capacityBuilding,
  institutionalDevelopment: programRoutes.institutionalDevelopment,
  communityAwareness: programRoutes.communityAwareness,
  owaisPlatform: programRoutes.yemenPioneers,
  volunteerUnit: programRoutes.yemenPioneers,
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
    overviewImage: '/news/09-yemen-pioneers-second-scientific-conference-6.png',
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
    overviewImage?: string;
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
      posterImage: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
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
      journey: 'رحلة الرائد',
      journeyEyebrow: 'المسار',
      journeyDescription:
        'من الترشّح إلى القيادة: خمس محطات يمرّ بها كل رائد داخل البرنامج، تجمع بين الدراسة الأكاديمية والتأهيل القيادي.',
      stepLabel: 'المحطة',
      pillars: 'ماذا يحصل عليه الرائد؟',
      pillarsEyebrow: 'ركائز البرنامج',
      pillarsDescription:
        'ثلاث ركائز متكاملة تُبنى عليها تجربة الرائد: المنحة، والبرنامج القيادي، والمتابعة والإرشاد.',
      videoGallery: 'من قلب البرنامج',
      videoGalleryDescription: 'فيديوهات رسمية منشورة من فعاليات ولقاءات برنامج رواد اليمن.',
      previous: 'السابق',
      next: 'التالي',
      highlights: 'أبرز ملامح البرنامج',
      phaseEyebrow: 'المرحلة الأولى',
      partner: 'بالشراكة مع',
      cityExplorerDescription:
        'أربع مدن يمنية احتضنت المرحلة الأولى من البرنامج. اختر مدينة لاستعراض توثيقها وشركاء التنفيذ فيها.',
      recommendationsEyebrow: 'مخرجات المرحلة',
      recommendationsDescription:
        'خرجت المرحلة الأولى بمجموعة من التوصيات العملية التي ترسم ملامح المراحل القادمة من البرنامج.',
      forumEyebrow: 'مبادرة مصاحبة',
      forumObjectives: 'أهداف الملتقى',
      statsEyebrow: 'أرقام المرحلة الأولى',
      manifestoEyebrow: 'رؤية المسار',
      focusAreas: 'مجالات العمل',
      focusAreasDescription: 'ثلاثة مجالات متكاملة يعمل عليها المسار داخل كل مؤسسة، مرّر فوق أي مجال لاستعراضه.',
      areaLabel: 'المجال',
      audiences: 'من يخدم المسار؟',
      audiencesDescription: 'يتوجه المسار إلى نوعين من المؤسسات، ويعمل معهما على المجالات الثلاثة نفسها.',
      awarenessEyebrow: 'المسار الرابع',
      awarenessHeroNote: 'مبادرتان تعملان معاً على صناعة الوعي: منصة معرفية ووحدة للتطوع.',
      exploreInitiatives: 'استكشف المبادرات',
      awarenessThemes: 'ثلاث دوائر يشتغل عليها المسار',
      awarenessThemesDescription:
        'ينطلق المسار من الفرد إلى المجتمع: وعي يُصاغ، وهوية تُجمع، وثقافة تُرسَّخ. مرّر للأسفل لتنتقل بين الدوائر، أو حرّك المؤشر فوق أيٍّ منها.',
      themeLabel: 'الدائرة',
      awarenessInitiativesEyebrow: 'مبادرات المسار',
      awarenessInitiatives: 'قناتان لصناعة الوعي',
      awarenessInitiativesDescription:
        'تترجم المبادرتان أهداف المسار إلى محتوى معرفي وفرص عمل ميداني، كلٌّ بطريقتها.',
      initiativeLabel: 'المبادرة',
      visitInitiative: 'زيارة المبادرة',
      volunteerCta: 'انضم كمتطوع',
      volunteerCtaDescription: 'سجّل اهتمامك عبر نموذج التطوع داخل الموقع، وسيتواصل معك فريق الوحدة.',
    },
    programs: [
      {
        ...programShared['yemen-pioneers'],
        title: 'برنامج رواد اليمن',
        summary:
          'برنامج متكامل للعناية بالتعليم والتأهيل النوعي للطلاب اليمنيين الموهوبين والمتفوقين، وإعدادهم قادةً للمستقبل عبر المنح الدراسية في أفضل الجامعات وبرنامج قيادي ومهاري موازٍ.',
        heroImageAlt: 'برنامج رواد اليمن من وقف أويس القرني',
        overviewImageAlt: 'تكريم أحد رواد اليمن خلال الملتقى السادس لرواد اليمن',
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
        journey: [
          {
            id: 'select',
            title: 'الاستهداف والترشّح',
            description:
              'يستهدف البرنامج الطلاب اليمنيين الموهوبين والمتفوقين الراغبين في إكمال دراستهم الجامعية والعليا.',
          },
          {
            id: 'scholarship',
            title: 'المنحة الدراسية',
            description:
              'منح للدراسة في أفضل الجامعات، بالتنسيق مع الجامعات والمؤسسات الدولية الشريكة في التأهيل.',
          },
          {
            id: 'leadership',
            title: 'البرنامج القيادي الموازي',
            description:
              'برنامج تأهيلي قيادي ومهاري يسير جنباً إلى جنب مع الدراسة الأكاديمية عبر التدريب المباشر.',
          },
          {
            id: 'practice',
            title: 'الممارسة والمبادرات',
            description:
              'تهيئة الرواد للعمل القيادي من خلال المشاريع والبرامج والمبادرات والأنشطة مع متابعة وإرشاد مستمرين.',
          },
          {
            id: 'impact',
            title: 'قادة لخدمة اليمن',
            description:
              'كادر من القادة المهرة يمتلكون المعرفة والمهارات والقيم اللازمة للمشاركة في نهضة اليمن.',
          },
        ],
        pillars: [
          {
            id: 'scholarship',
            title: 'المنحة الدراسية',
            body: 'دعم الدراسة الجامعية والدراسات العليا في المجالات المستهدفة لبناء القدرات والكوادر.',
            points: [
              'فرص التعليم الجامعي والدراسات العليا للشباب اليمني.',
              'الدراسة في أفضل الجامعات.',
              'شراكات مع الجامعات والمؤسسات الدولية.',
            ],
          },
          {
            id: 'leadership',
            title: 'البرنامج القيادي',
            body: 'برنامج تأهيلي قيادي ومهاري مصاحب للدراسة الأكاديمية يُكسب الرواد مهارات القيادة.',
            points: [
              'تدريب قيادي مباشر.',
              'استشراف مستقبل اليمن وتحدياته.',
              'مهارات عملية موازية للتحصيل الأكاديمي.',
            ],
          },
          {
            id: 'mentoring',
            title: 'المتابعة والإرشاد',
            body: 'متابعة وإرشاد مستمران يهيّئان الرواد للعمل القيادي عبر المشاريع والمبادرات.',
            points: [
              'متابعة وإرشاد خلال مسار البرنامج.',
              'مشاريع وبرامج ومبادرات وأنشطة تطبيقية.',
              'تهيئة للعمل القيادي بعد التخرج.',
            ],
          },
        ],
        highlights: [
          'منح دراسية',
          'أفضل الجامعات',
          'برنامج قيادي موازٍ',
          'تدريب مباشر',
          'متابعة وإرشاد',
          'مشاريع ومبادرات',
          'قادة المستقبل',
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
            partner: 'مؤسسة صلة للتنمية',
          },
          {
            id: 'hadramout-valley',
            name: 'حضرموت الوادي',
            image: capacityHadramoutValleyImage,
            imageAlt: 'توثيق برنامج بناء القدرات في حضرموت الوادي',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج بناء القدرات في حضرموت الوادي',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'مؤسسة البادية للتنمية والأعمال الإنسانية',
          },
          {
            id: 'marib',
            name: 'مأرب',
            image: capacityMaribImage,
            imageAlt: 'توثيق برنامج بناء القدرات في مأرب',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج بناء القدرات في مأرب',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'مكتب أوتشا مأرب والهيئة العالمية للإغاثة والتنمية - أنصر',
          },
          {
            id: 'taiz',
            name: 'تعز',
            image: capacityTaizImage,
            imageAlt: 'توثيق برنامج بناء القدرات في تعز',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج بناء القدرات في تعز',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'مؤسسة رسالتي لتنمية المرأة',
          },
        ],
        phase: {
          label: 'المرحلة الأولى',
          period: '8 – 25 يوليو 2024',
          description: 'ثمانية عشر يوماً من التدريب المكثف لمنظمات المجتمع المدني في أربع مدن يمنية.',
        },
        highlights: [
          '160 مشاركاً من 140 منظمة',
          '13 محافظة يمنية',
          '4 مدن: حضرموت الساحل، حضرموت الوادي، مأرب، تعز',
          'شراكات محلية ودولية',
          'الملتقى الوطني لتوطين العمل الإنساني والتنموي',
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
        audiences: [
          {
            id: 'government',
            title: 'المؤسسات الحكومية',
            description: 'تطوير أداء الجهات الحكومية وتحديث برامجها وآلياتها وخططها واستراتيجيتها.',
          },
          {
            id: 'civil',
            title: 'المؤسسات الأهلية',
            description: 'تطوير أداء المؤسسات الأهلية وتحديث برامجها وآلياتها وخططها واستراتيجيتها.',
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
        themes: [
          {
            id: 'public-opinion',
            title: 'إعادة صياغة الرأي العام',
            description: 'خطاب عام يُبنى على قراءة التاريخ ودراسة الحاضر واستشراف المستقبل.',
          },
          {
            id: 'national-identity',
            title: 'الهوية الوطنية الجامعة',
            description: 'هوية تتسع للجميع وتجمع اليمنيين حول مشترك واحد.',
          },
          {
            id: 'renaissance-culture',
            title: 'ثقافة النهضة والتعايش',
            description: 'وعي جمعي يرسّخ قيم النهوض الحضاري والعيش المشترك.',
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
      journey: 'Oncunun Yolculugu',
      journeyEyebrow: 'Yol Haritasi',
      journeyDescription:
        'Adayliktan liderlige: her oncunun programda gectigi, akademik egitim ile liderlik gelisimini birlestiren bes durak.',
      stepLabel: 'Durak',
      pillars: 'Oncu Neler Kazanir?',
      pillarsEyebrow: 'Programin Temelleri',
      pillarsDescription:
        'Oncu deneyimini olusturan uc tamamlayici temel: burs, liderlik programi ve takip-rehberlik.',
      videoGallery: 'Programin Icinden',
      videoGalleryDescription: 'Yemen Onculeri Programi etkinlik ve bulusmalarindan yayinlanan resmi videolar.',
      previous: 'Onceki',
      next: 'Sonraki',
      highlights: 'Programin One Cikanlari',
      phaseEyebrow: 'Birinci Asama',
      partner: 'Ortaklik',
      cityExplorerDescription:
        'Programin birinci asamasina dort Yemen sehri ev sahipligi yapti. Belgeleri ve uygulama ortaklarini gormek icin bir sehir secin.',
      recommendationsEyebrow: 'Asama Ciktilari',
      recommendationsDescription:
        'Birinci asama, programin sonraki asamalarina yon veren bir dizi uygulanabilir oneriyle tamamlandi.',
      forumEyebrow: 'Eslik Eden Girisim',
      forumObjectives: 'Forumun Hedefleri',
      statsEyebrow: 'Birinci Asama Rakamlari',
      manifestoEyebrow: 'Programin Vizyonu',
      focusAreas: 'Calisma Alanlari',
      focusAreasDescription: 'Program her kurumda birbirini tamamlayan uc alanda calisir; incelemek icin bir alanin uzerine gelin.',
      areaLabel: 'Alan',
      audiences: 'Program Kimlere Hizmet Eder?',
      audiencesDescription: 'Program iki tur kuruma yonelir ve her ikisiyle ayni uc alanda calisir.',
      awarenessEyebrow: 'Dorduncu Eksen',
      awarenessHeroNote: 'Farkindalik uretmek icin birlikte calisan iki girisim: bir bilgi platformu ve bir gonulluluk birimi.',
      exploreInitiatives: 'Girisimleri Kesfet',
      awarenessThemes: 'Programin calistigi uc halka',
      awarenessThemesDescription:
        'Program bireyden topluma uzanir: sekillenen bir bilinc, birlestiren bir kimlik ve kok salan bir kultur. Halkalar arasinda gecmek icin asagi kaydirin veya bir halkanin uzerine gelin.',
      themeLabel: 'Halka',
      awarenessInitiativesEyebrow: 'Program Girisimleri',
      awarenessInitiatives: 'Farkindalik icin iki kanal',
      awarenessInitiativesDescription:
        'Iki girisim, programin hedeflerini bilgi icerigine ve sahada calisma firsatlarina donusturur; her biri kendi yontemiyle.',
      initiativeLabel: 'Girisim',
      visitInitiative: 'Girisimi Ziyaret Et',
      volunteerCta: 'Gonullu Ol',
      volunteerCtaDescription: 'Sitedeki gonulluluk formu uzerinden ilginizi kaydedin; birim ekibi sizinle iletisime gececek.',
    },
    programs: [
      {
        ...programShared['yemen-pioneers'],
        title: 'Yemen Onculeri Programi',
        summary:
          'Ustun yetenekli ve basarili Yemenli ogrencilerin nitelikli egitim ve gelisimini destekleyen; onlari burslar, secili universiteler ve paralel liderlik-beceri programi ile gelecegin liderleri olarak hazirlayan butunlesik bir program.',
        heroImageAlt: 'Veysel Karani Vakfi Yemen Onculeri Programi',
        overviewImageAlt: 'Altinci Yemenli Onculer Bulusmasinda bir oncunun odullendirilmesi',
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
        journey: [
          {
            id: 'select',
            title: 'Hedefleme ve Adaylik',
            description:
              'Program, lisans ve lisansustu egitimini surdurmek isteyen ustun yetenekli ve basarili Yemenli ogrencileri hedefler.',
          },
          {
            id: 'scholarship',
            title: 'Egitim Bursu',
            description:
              'En iyi universitelerde egitim icin burslar; yetistirme surecinde universiteler ve uluslararasi kurumlarla is birligi.',
          },
          {
            id: 'leadership',
            title: 'Paralel Liderlik Programi',
            description:
              'Akademik egitimle birlikte yuruyen, dogrudan egitime dayali liderlik ve beceri gelisim programi.',
          },
          {
            id: 'practice',
            title: 'Uygulama ve Girisimler',
            description:
              'Surekli takip ve rehberlik esliginde projeler, programlar, girisimler ve faaliyetlerle liderlik calismasina hazirlik.',
          },
          {
            id: 'impact',
            title: 'Yemene Hizmet Eden Liderler',
            description:
              'Yemenin kalkinmasina katki sunacak bilgi, beceri ve degerlere sahip nitelikli lider kadrolar.',
          },
        ],
        pillars: [
          {
            id: 'scholarship',
            title: 'Egitim Bursu',
            body: 'Kapasite ve kadro gelistirme icin hedeflenen alanlarda lisans ve lisansustu egitim destegi.',
            points: [
              'Yemenli gencler icin lisans ve lisansustu egitim firsatlari.',
              'En iyi universitelerde egitim.',
              'Universiteler ve uluslararasi kurumlarla ortakliklar.',
            ],
          },
          {
            id: 'leadership',
            title: 'Liderlik Programi',
            body: 'Akademik egitime eslik eden ve onculere liderlik becerileri kazandiran liderlik ve beceri programi.',
            points: [
              'Dogrudan liderlik egitimi.',
              'Yemenin gelecegini ve zorluklarini ongorme.',
              'Akademik basariya paralel uygulamali beceriler.',
            ],
          },
          {
            id: 'mentoring',
            title: 'Takip ve Rehberlik',
            body: 'Onculeri projeler ve girisimler yoluyla liderlik calismasina hazirlayan surekli takip ve rehberlik.',
            points: [
              'Program boyunca takip ve rehberlik.',
              'Uygulamali projeler, programlar, girisimler ve faaliyetler.',
              'Mezuniyet sonrasi liderlik calismasina hazirlik.',
            ],
          },
        ],
        highlights: [
          'Egitim burslari',
          'En iyi universiteler',
          'Paralel liderlik programi',
          'Dogrudan egitim',
          'Takip ve rehberlik',
          'Projeler ve girisimler',
          'Gelecegin liderleri',
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
            partner: 'Selah Kalkinma Vakfi',
          },
          {
            id: 'hadramout-valley',
            name: 'Hadramut Vadisi',
            image: capacityHadramoutValleyImage,
            imageAlt: 'Hadramut Vadisi kapasite gelistirme belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Hadramut Vadisi Kapasite Gelistirme Programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Al-Badia Insani Kalkinma Vakfi',
          },
          {
            id: 'marib',
            name: 'Marib',
            image: capacityMaribImage,
            imageAlt: 'Marib kapasite gelistirme belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Marib Kapasite Gelistirme Programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'OCHA Marib ofisi ve International Relief and Development Authority - Ansar',
          },
          {
            id: 'taiz',
            name: 'Taiz',
            image: capacityTaizImage,
            imageAlt: 'Taiz kapasite gelistirme belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Taiz Kapasite Gelistirme Programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Resalaty Kadin Kalkinma Vakfi',
          },
        ],
        phase: {
          label: 'Birinci Asama',
          period: '8 – 25 Temmuz 2024',
          description: 'Dort Yemen sehrinde sivil toplum kuruluslari icin on sekiz gunluk yogun egitim.',
        },
        highlights: [
          '140 kurulustan 160 katilimci',
          '13 Yemen ili',
          '4 sehir: Hadramut Sahili, Hadramut Vadisi, Marib, Taiz',
          'Yerel ve uluslararasi ortakliklar',
          'Insani ve Kalkinma Calismalarinin Yerellestirilmesi Ulusal Forumu',
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
        audiences: [
          {
            id: 'government',
            title: 'Kamu Kurumlari',
            description: 'Kamu kurumlarinin performansini gelistirmek; program, mekanizma, plan ve stratejilerini yenilemek.',
          },
          {
            id: 'civil',
            title: 'Sivil Kurumlar',
            description: 'Sivil kurumlarin performansini gelistirmek; program, mekanizma, plan ve stratejilerini yenilemek.',
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
        themes: [
          {
            id: 'public-opinion',
            title: 'Kamuoyunu yeniden sekillendirmek',
            description: 'Tarih okumasi, bugunun incelenmesi ve gelecegin ongorulmesi uzerine kurulu bir kamusal soylem.',
          },
          {
            id: 'national-identity',
            title: 'Kapsayici ulusal kimlik',
            description: 'Herkesi kucaklayan ve Yemenlileri ortak bir paydada bulusturan bir kimlik.',
          },
          {
            id: 'renaissance-culture',
            title: 'Kalkinis ve birlikte yasama kulturu',
            description: 'Medeni kalkinis ve ortak yasam degerlerini koklestiren kolektif bir bilinc.',
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
      journey: 'The Pioneer Journey',
      journeyEyebrow: 'The Path',
      journeyDescription:
        'From nomination to leadership: five stages every pioneer passes through, combining academic study with leadership preparation.',
      stepLabel: 'Stage',
      pillars: 'What Does a Pioneer Receive?',
      pillarsEyebrow: 'Program Pillars',
      pillarsDescription:
        'Three complementary pillars shape the pioneer experience: the scholarship, the leadership program, and follow-up and mentoring.',
      videoGallery: 'Inside the Program',
      videoGalleryDescription: 'Official videos published from Yemen Pioneers Program events and gatherings.',
      previous: 'Previous',
      next: 'Next',
      highlights: 'Program Highlights',
      phaseEyebrow: 'First Phase',
      partner: 'In partnership with',
      cityExplorerDescription:
        'Four Yemeni cities hosted the first phase of the program. Pick a city to explore its documentation and implementing partners.',
      recommendationsEyebrow: 'Phase Outcomes',
      recommendationsDescription:
        'The first phase concluded with a set of practical recommendations that shape the next phases of the program.',
      forumEyebrow: 'Companion Initiative',
      forumObjectives: 'Forum Objectives',
      statsEyebrow: 'First Phase in Numbers',
      manifestoEyebrow: 'Track Vision',
      focusAreas: 'Areas of Work',
      focusAreasDescription: 'Three complementary areas the track works on inside every institution — hover an area to explore it.',
      areaLabel: 'Area',
      audiences: 'Who Does the Track Serve?',
      audiencesDescription: 'The track addresses two types of institutions and works with both on the same three areas.',
      awarenessEyebrow: 'Fourth Track',
      awarenessHeroNote: 'Two initiatives working together to shape awareness: a knowledge platform and a volunteer unit.',
      exploreInitiatives: 'Explore the Initiatives',
      awarenessThemes: 'Three circles the track works on',
      awarenessThemesDescription:
        'The track moves from the individual to society: an awareness that is shaped, an identity that unites, and a culture that takes root. Scroll down to move between the circles, or hover over any of them.',
      themeLabel: 'Circle',
      awarenessInitiativesEyebrow: 'Track Initiatives',
      awarenessInitiatives: 'Two channels for shaping awareness',
      awarenessInitiativesDescription:
        'The two initiatives translate the track’s goals into knowledge content and hands-on opportunities, each in its own way.',
      initiativeLabel: 'Initiative',
      visitInitiative: 'Visit the Initiative',
      volunteerCta: 'Join as a Volunteer',
      volunteerCtaDescription: 'Register your interest through the volunteer form on this site and the unit’s team will get in touch.',
    },
    programs: [
      {
        ...programShared['yemen-pioneers'],
        title: 'Yemen Pioneers Program',
        summary:
          'An integrated program for quality education and training of gifted, outstanding Yemeni students, preparing them as future leaders through scholarships at leading universities and a parallel leadership and skills program.',
        heroImageAlt: 'Veysel Karani Waqf Yemen Pioneers Program',
        overviewImageAlt: 'Honoring a Yemen Pioneer at the Sixth Yemen Pioneers Gathering',
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
        journey: [
          {
            id: 'select',
            title: 'Targeting & Nomination',
            description:
              'The program targets gifted, outstanding Yemeni students who wish to pursue university and graduate studies.',
          },
          {
            id: 'scholarship',
            title: 'The Scholarship',
            description:
              'Scholarships at leading universities, coordinated with partner universities and international institutions.',
          },
          {
            id: 'leadership',
            title: 'Parallel Leadership Program',
            description:
              'A leadership and skills qualification program that runs alongside academic study through direct training.',
          },
          {
            id: 'practice',
            title: 'Practice & Initiatives',
            description:
              'Preparing pioneers for leadership work through projects, programs, initiatives and activities with continuous follow-up and guidance.',
          },
          {
            id: 'impact',
            title: 'Leaders Serving Yemen',
            description:
              'A skilled cadre of leaders with the knowledge, skills and values needed to contribute to the advancement of Yemen.',
          },
        ],
        pillars: [
          {
            id: 'scholarship',
            title: 'The Scholarship',
            body: 'Support for university and graduate studies in fields targeted for capacity and cadre building.',
            points: [
              'University and graduate education opportunities for Yemeni youth.',
              'Study at leading universities.',
              'Partnerships with universities and international institutions.',
            ],
          },
          {
            id: 'leadership',
            title: 'Leadership Program',
            body: 'A leadership and skills program that accompanies academic study and equips pioneers with leadership abilities.',
            points: [
              'Direct leadership training.',
              'Foreseeing the future of Yemen and its challenges.',
              'Practical skills parallel to academic achievement.',
            ],
          },
          {
            id: 'mentoring',
            title: 'Follow-up & Mentoring',
            body: 'Continuous follow-up and guidance that prepare pioneers for leadership work through projects and initiatives.',
            points: [
              'Follow-up and mentoring throughout the program.',
              'Applied projects, programs, initiatives and activities.',
              'Preparation for leadership work after graduation.',
            ],
          },
        ],
        highlights: [
          'Scholarships',
          'Leading universities',
          'Parallel leadership program',
          'Direct training',
          'Follow-up & mentoring',
          'Projects & initiatives',
          'Future leaders',
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
            partner: 'Selah Foundation for Development',
          },
          {
            id: 'hadramout-valley',
            name: 'Hadramout Valley',
            image: capacityHadramoutValleyImage,
            imageAlt: 'Capacity Building documentation in Hadramout Valley',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity Building Program video in Hadramout Valley',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Al-Badia Foundation for Humanitarian Development',
          },
          {
            id: 'marib',
            name: 'Marib',
            image: capacityMaribImage,
            imageAlt: 'Capacity Building documentation in Marib',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity Building Program video in Marib',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'OCHA Marib office and the International Relief and Development Authority - Ansar',
          },
          {
            id: 'taiz',
            name: 'Taiz',
            image: capacityTaizImage,
            imageAlt: 'Capacity Building documentation in Taiz',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity Building Program video in Taiz',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Resalaty Foundation for Women Development',
          },
        ],
        phase: {
          label: 'First Phase',
          period: '8 – 25 July 2024',
          description: 'Eighteen days of intensive training for civil society organizations across four Yemeni cities.',
        },
        highlights: [
          '160 participants from 140 organizations',
          '13 Yemeni governorates',
          '4 cities: Hadramout Coast, Hadramout Valley, Marib, Taiz',
          'Local and international partnerships',
          'National Forum for Localization of Humanitarian and Development Work',
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
        audiences: [
          {
            id: 'government',
            title: 'Governmental Institutions',
            description: 'Developing the performance of governmental bodies and updating their programs, mechanisms, plans and strategies.',
          },
          {
            id: 'civil',
            title: 'Civil Institutions',
            description: 'Developing the performance of civil institutions and updating their programs, mechanisms, plans and strategies.',
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
        themes: [
          {
            id: 'public-opinion',
            title: 'Reshaping public opinion',
            description: 'A public discourse built on reading history, studying the present and anticipating the future.',
          },
          {
            id: 'national-identity',
            title: 'An inclusive national identity',
            description: 'An identity wide enough for everyone, gathering Yemenis around a shared common ground.',
          },
          {
            id: 'renaissance-culture',
            title: 'A culture of advancement and coexistence',
            description: 'A collective awareness that roots the values of civilizational advancement and living together.',
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
