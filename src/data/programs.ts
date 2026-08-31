import type { BreadcrumbItem } from '@/data/about';
import { participateRoutes } from '@/data/participate';
import type { Locale } from '@/i18n/content';
import type { ProgramLayout } from '@/lib/types';
import { cmsPageContent, cmsPrograms } from '@/cms/adapters';
import yemenPioneersHero from '@/assets/programs/yemen-pioneers-hero.jpeg';
import capacityHadramoutCoastImage from '@/assets/programs/capacity-hadramout-coast.jpeg';
import capacityHadramoutValleyImage from '@/assets/programs/capacity-hadramout-valley.jpeg';
import capacityMaribImage from '@/assets/programs/capacity-marib.jpeg';
import capacityTaizImage from '@/assets/programs/capacity-taiz.jpeg';
import institutionalDevelopmentImage from '@/assets/programs/institutional-development.jpg';
import volunteerHeroImage from '@/assets/participate/participate-hero.jpg';
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
  /** Public URL of a video uploaded in the dashboard; wins over videoId. */
  videoFile?: string;
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
  /** Omitted when the initiative has no destination of its own — the page is it. */
  url?: string;
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
  /** Public URL of a video uploaded in the dashboard; wins over videoId. */
  videoFile?: string;
  partner?: string;
  /** Training days of this stop, e.g. "15 – 17 يوليو 2024". */
  period?: string;
  /** Documented participation, e.g. "22 منظمة مجتمع مدني". */
  organizations?: string;
  /** Official sponsorship or supervision line for this stop. */
  patron?: string;
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
  /** Icon name from the shared registry; the component falls back to its own default when unset. */
  icon?: string;
};

export type ProgramJourneyStep = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type ProgramPillar = {
  id: string;
  title: string;
  body: string;
  points: string[];
  icon?: string;
};

export type ProgramTheme = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

/** One knowledge/media format the Owais platform publishes (podcast, visuals, ...). */
export type ProgramMediaProduct = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon?: string;
};

/** A featured on-ground moment of the platform, illustrated with real event photos. */
export type ProgramSpotlight = {
  eyebrow: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
  linkLabel: string;
  route: string;
};

export type ProgramSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Copy for the volunteer unit page, which ships its own bespoke layout. */
export type VolunteerCopy = {
  eyebrow: string;
  joinCta: string;
  /** Destination of the join buttons; the volunteer form route is used when unset. */
  joinUrl?: string;
  exploreCta: string;
  slogan: string;
  hashtags: string[];
  contactTitle: string;
  quoteLabel: string;
  statement: ProgramSectionCopy;
  fields: ProgramSectionCopy;
  goals: ProgramSectionCopy;
  steps: ProgramSectionCopy;
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
  contactPhone?: string;
  /** Present only on the volunteer unit program, which renders its own layout. */
  volunteer?: VolunteerCopy;
  initiatives?: ProgramInitiative[];
  /** Present only on community awareness: the Owais platform's media formats. */
  mediaProducts?: ProgramMediaProduct[];
  /** Present only on community awareness: a featured platform event with photos. */
  spotlight?: ProgramSpotlight;
  cities?: ProgramCity[];
  journey?: ProgramJourneyStep[];
  pillars?: ProgramPillar[];
  highlights?: string[];
  phase?: ProgramPhase;
  audiences?: ProgramAudience[];
  themes?: ProgramTheme[];
  overviewImage?: string;
  overviewImageAlt?: string;
  /** Which page design renders this program; derived from the slug when unset (see resolveProgramLayout). */
  layout?: ProgramLayout;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
    /** Destination of the CTA button; the donate route is used when unset. */
    url?: string;
  };
  mediaNote?: string;
};

export type ProgramsPageContent = {
  nav: { label: string; href: string }[];
  labels: {
    home: string;
    programs: string;
    /** Where the "Programs" breadcrumb points. */
    programsHref: string;
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
    /** Secondary hero button on the institutional layout: scrolls to the first section. */
    exploreTrack: string;
    awarenessEyebrow: string;
    awarenessHeroNote: string;
    exploreInitiatives: string;
    awarenessThemes: string;
    awarenessThemesDescription: string;
    themeLabel: string;
    awarenessInitiativesEyebrow: string;
    awarenessInitiatives: string;
    awarenessInitiativesDescription: string;
    onAirLabel: string;
    pioneerStatsEyebrow: string;
    pioneerStatsTitle: string;
    pioneerStatsDescription: string;
    pioneerStatsCenter: string;
    /** Line above the title on the Yemen pioneers hero. */
    pioneersEyebrow: string;
    /** Secondary hero button on the pioneers/generic layouts: scrolls to the overview. */
    exploreProgram: string;
  };
  programs: Program[];
};

// This site is the official source now: program references stay in-site.
const officialSources = {
  yemenPioneers: programRoutes.yemenPioneers,
  capacityBuilding: programRoutes.capacityBuilding,
  institutionalDevelopment: programRoutes.institutionalDevelopment,
  communityAwareness: programRoutes.communityAwareness,
  // The volunteer unit now lives under capacity building; its call to action is the volunteer form.
  volunteerUnit: participateRoutes.volunteer,
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
    contactEmail: 'yemenpioneers@veysvakfi.org',
    overviewImage: '/news/09-yemen-pioneers-second-scientific-conference-6.png',
  },
  'capacity-building': {
    id: 'capacity-building',
    slug: 'capacity-building',
    route: programRoutes.capacityBuilding,
    heroImage: volunteerHeroImage,
    images: [volunteerHeroImage, awarenessVolunteerUnitImage],
    contactEmail: 'volunteering@veysvakfi.org',
    contactPhone: '+90 536 745 6199',
    overviewImage: awarenessVolunteerUnitImage,
  },
  'institutional-development': {
    id: 'institutional-development',
    slug: 'institutional-development',
    route: programRoutes.institutionalDevelopment,
    heroImage: institutionalDevelopmentImage,
    images: [
      capacityHadramoutCoastImage,
      capacityHadramoutValleyImage,
      capacityMaribImage,
      capacityTaizImage,
    ],
  },
  'community-awareness': {
    id: 'community-awareness',
    slug: 'community-awareness',
    route: programRoutes.communityAwareness,
    heroImage: awarenessOwaisPlatformImage,
    images: [awarenessOwaisPlatformImage],
  },
} satisfies Record<
  ProgramSlug,
  {
    id: ProgramSlug;
    slug: ProgramSlug;
    route: string;
    heroImage: string;
    images: string[];
    contactEmail?: string;
    contactPhone?: string;
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
      programsHref: '/#programs',
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
      contact: 'للتواصل',
      otherPrograms: 'برامج أخرى',
      details: 'عرض التفاصيل',
      donate: 'ساهم الآن',
      noVerifiedStats: 'لا تُعرض أرقام غير موثقة.',
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
      audiencesDescription:
        'يتوجه المسار إلى نوعين من المؤسسات، ويعمل معهما على تطوير الأداء وتحديث البرامج والآليات والخطط والاستراتيجيات.',
      exploreTrack: 'استكشف المسار',
      awarenessEyebrow: 'منصة أويس',
      awarenessHeroNote: 'منصة معرفية وإعلامية تُعنى بقضايا الفكر والنهوض الحضاري وصناعة الوعي الجمعي.',
      exploreInitiatives: 'تعرّف على المنصة',
      awarenessThemes: 'ثلاث دوائر تشتغل عليها المنصة',
      awarenessThemesDescription:
        'من التاريخ إلى الحاضر إلى ما هو آتٍ: قراءة تُستخلص، وواقع يُدرس، ومستقبل يُستشرف. مرّر للأسفل لتنتقل بين الدوائر، أو حرّك المؤشر فوق أيٍّ منها.',
      themeLabel: 'الدائرة',
      awarenessInitiativesEyebrow: 'ما تقدّمه المنصة',
      awarenessInitiatives: 'مواد وبرامج معرفية',
      awarenessInitiativesDescription:
        'قنوات متنوعة تصل بها المنصة إلى جمهورها، من البودكاست والديوانية إلى المواد المرئية والمدونة.',
      onAirLabel: 'بث معرفي مستمر',
      pioneerStatsEyebrow: 'خلاصات البرنامج',
      pioneerStatsTitle: 'رواد اليمن في أرقام',
      pioneerStatsDescription:
        'أرقام موثقة من التقرير الرسمي «أويس في أرقام» تلخّص ما قدّمه البرنامج للرواد حتى ديسمبر 2025.',
      pioneerStatsCenter: 'خلاصات',
      pioneersEyebrow: 'برنامج المنح والتأهيل القيادي',
      exploreProgram: 'استكشف البرنامج',
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
        summary:
          'الوحدة التطوعية: ترسيخ ثقافة العمل التطوعي وإتاحة الفرص التطوعية المختلفة لبناء قدرات المتطوعين وتحقيق أهداف الوقف.',
        heroImageAlt: 'الوحدة التطوعية في وقف أويس القرني',
        imageGallery: [
          {
            src: volunteerHeroImage,
            alt: 'صورة قسم التطوع الرسمية في وقف أويس القرني',
            caption: 'وقفنا معاً لنهضة اليمن',
            width: 1024,
            height: 400,
          },
          {
            src: awarenessVolunteerUnitImage,
            alt: 'شعار الوحدة التطوعية',
            caption: 'الوحدة التطوعية',
            width: 1080,
            height: 1080,
          },
        ],
        volunteer: {
          eyebrow: 'الوحدة التطوعية',
          joinCta: 'انضم كمتطوع',
          exploreCta: 'تعرّف على الوحدة',
          slogan: 'كل جهد مهما كان بسيطًا يرسم ملامح يمنٍ أفضل.',
          hashtags: ['#تطوعك_وقف', '#تطوع_لأجل_اليمن'],
          contactTitle: 'تواصل مع الوحدة',
          quoteLabel: 'ما نؤمن به',
          statement: {
            eyebrow: 'لماذا نتطوع',
            title: 'يدٌ واحدة لا تصفّق',
            description: 'الوحدة التطوعية هي المساحة التي تلتقي فيها الطاقات الفردية لتصير جهداً واحداً.',
          },
          fields: {
            eyebrow: 'مجالات الوحدة',
            title: 'ثلاثة مجالات نعمل عليها',
            description: 'مرّر فوق أي مجال لتستعرضه: من ترسيخ القيمة، إلى إتاحة الفرصة، إلى توحيد الجهد.',
          },
          goals: {
            eyebrow: 'ما نسعى إليه',
            title: 'أربعة أهداف تقود عمل الوحدة',
            description: 'أهداف تترجم العمل التطوعي إلى أثر ملموس في برامج الوقف ومساراته.',
          },
          steps: {
            eyebrow: 'كيف تنضم',
            title: 'ثلاث خطوات ويبدأ تطوعك',
            description: 'من تسجيل اهتمامك إلى أول مشاركة فعلية داخل فرق العمل.',
          },
        },
        goals: [
          'المساهمة في تحقيق أهداف وقف أويس القرني عبر جهود المتطوعين.',
          'بناء قدرات المتطوعين بالممارسة داخل برامج الوقف ومساراته.',
          'توسيع قاعدة المشاركة المجتمعية في العمل التنموي والإنساني.',
          'توحيد الجهود وتلاقح الأفكار خدمةً لنهضة اليمن.',
        ],
        journey: [
          {
            id: 'register',
            title: 'سجّل اهتمامك',
            description: 'عبّئ نموذج التطوع في الموقع ببياناتك ومجالات اهتمامك والمهارات التي تودّ تقديمها.',
          },
          {
            id: 'match',
            title: 'يتواصل معك الفريق',
            description:
              'يتواصل معك فريق الوحدة لمطابقة اهتمامك بالفرص المتاحة، ويمكنك التواصل المباشر عبر الهاتف أو البريد.',
          },
          {
            id: 'contribute',
            title: 'شارك وابنِ قدراتك',
            description: 'انضم إلى فرق العمل في برامج الوقف ومساراته، وتنمو قدراتك بالممارسة والعمل المشترك.',
          },
        ],
        pillars: [
          {
            id: 'volunteer-culture',
            title: 'ترسيخ ثقافة التطوع',
            body: 'نشر قيم العمل التطوعي وتعزيزها بين أبناء اليمن في الداخل والخارج.',
            points: [
              'خطاب يُعلي قيمة العطاء والمشاركة.',
              'حضور دائم بين الشباب والمجتمعات المحلية.',
            ],
          },
          {
            id: 'volunteer-opportunities',
            title: 'إتاحة الفرص التطوعية',
            body: 'تقديم فرص تطوعية متنوعة تخدم برامج الوقف ومساراته التنموية.',
            points: [
              'فرص تناسب مهارات المتطوعين واهتماماتهم.',
              'مشاركة فعلية داخل البرامج القائمة.',
            ],
          },
          {
            id: 'joint-effort',
            title: 'توحيد الجهود',
            body: 'استقبال المبادرات والأفكار وتوجيهها نحو أهداف الوقف والعمل معاً كالجسد الواحد.',
            points: [
              'تلاقح الأفكار بين المتطوعين وفرق العمل.',
              'تكامل الجهود الفردية في مسار واحد.',
            ],
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'الوحدة التطوعية',
            paragraphs: [
              'تُعنى الوحدة التطوعية بترسيخ ثقافة العمل التطوعي وتقديم الفرص التطوعية المختلفة لتحقيق أهداف وقف أويس القرني.',
              'نؤمن أن بناء يمن جديد يبدأ من العمل المشترك والتكاتف بين أبناء الوطن، فتتلاقح الأفكار وتتوحد الجهود، وتُبنى قدرات المتطوعين من خلال المشاركة الفعلية في برامج الوقف ومساراته.',
            ],
          },
        ],
        cta: {
          title: 'ادعم بناء القدرات والعمل التطوعي',
          description:
            'تجمع صفحة المساهمة الرسمية الفرص المتاحة لدعم مشاريع الوقف وبرامجه التنموية.',
          button: 'اذهب إلى صفحة المساهمة',
        },
        seo: {
          title: 'بناء القدرات | وقف أويس القرني',
          description:
            'مسار بناء القدرات في وقف أويس القرني والوحدة التطوعية التي ترسّخ ثقافة العمل التطوعي وتتيح الفرص التطوعية.',
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
          {
            src: capacityHadramoutCoastImage,
            alt: 'المنظمات المشاركة في برنامج رفع كفاءة منظمات المجتمع المدني في حضرموت الساحل، يوليو 2024',
            caption: 'المنظمات المشاركة – حضرموت الساحل',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityHadramoutValleyImage,
            alt: 'المنظمات المشاركة في برنامج رفع كفاءة منظمات المجتمع المدني في حضرموت الوادي، يوليو 2024',
            caption: 'المنظمات المشاركة – حضرموت الوادي',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityMaribImage,
            alt: 'المنظمات المشاركة في برنامج رفع كفاءة منظمات المجتمع المدني في مأرب، يوليو 2024',
            caption: 'المنظمات المشاركة – مأرب',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityTaizImage,
            alt: 'المنظمات المشاركة في برنامج رفع كفاءة منظمات المجتمع المدني في تعز، يوليو 2024',
            caption: 'المنظمات المشاركة – تعز',
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
            imageAlt: 'توثيق برنامج رفع القدرات في حضرموت الساحل',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج رفع القدرات في حضرموت الساحل',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'مؤسسة صلة للتنمية',
            period: '15 – 17 يوليو 2024',
            organizations: '22 منظمة مجتمع مدني',
            patron: 'بإشراف مكتب الشؤون الاجتماعية والعمل بساحل حضرموت',
          },
          {
            id: 'hadramout-valley',
            name: 'حضرموت الوادي',
            image: capacityHadramoutValleyImage,
            imageAlt: 'توثيق برنامج رفع القدرات في حضرموت الوادي',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج رفع القدرات في حضرموت الوادي',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'مؤسسة البادية للتنمية والأعمال الإنسانية',
            period: '20 – 22 يوليو 2024',
            organizations: '28 منظمة مجتمع مدني',
            patron: 'برعاية وكيل محافظة حضرموت لشؤون الوادي والصحراء الأستاذ عامر العامري',
          },
          {
            id: 'marib',
            name: 'مأرب',
            image: capacityMaribImage,
            imageAlt: 'توثيق برنامج رفع القدرات في مأرب',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج رفع القدرات في مأرب',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'مكتب أوتشا مأرب والهيئة العالمية للإغاثة والتنمية - أنصر',
            period: '23 – 25 يوليو 2024',
            organizations: '40 منظمة من 13 محافظة يمنية',
            patron: 'برعاية اللواء سلطان العرادة محافظ مأرب',
          },
          {
            id: 'taiz',
            name: 'تعز',
            image: capacityTaizImage,
            imageAlt: 'توثيق برنامج رفع القدرات في تعز',
            videoId: capacityVideo.videoId,
            videoTitle: 'فيديو برنامج رفع القدرات في تعز',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'مؤسسة رسالتي لتنمية المرأة',
            period: '8 – 10 يوليو 2024',
            organizations: '40 منظمة مجتمع مدني',
            patron: 'برعاية محافظ تعز الأستاذ نبيل شمسان',
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
          {
            id: 'capacity-intro',
            title: 'برنامج رفع قدرات منظمات المجتمع المدني',
            paragraphs: [
              'يترجم المسار أهدافه ميدانياً عبر برنامج رفع القدرات الذي يعمل على تأهيل قيادات المؤسسات الحكومية والأهلية وتطوير أدائهم، وقد نُفذت مرحلته الأولى مع منظمات المجتمع المدني في أربع مدن يمنية.',
              'ويأتي البرنامج في إطار المسار الثالث لوقف أويس القرني المعني بتطوير المؤسسات الحكومية والأهلية، لتعزيز قدرات هذه المنظمات ورفع مستوى كفاءتها بما يحقق التنمية المستدامة ويعزز العمل الإنساني والتنموي في كافة أنحاء اليمن، وصولاً إلى تحقيق النهوض الحضاري باليمن.',
            ],
          },
          {
            id: 'training-axes',
            title: 'محاور التدريب',
            paragraphs: [
              'قدّم البرنامج المهندس فؤاد سعيد، عضو فريق الخبراء بوقف أويس القرني، على مدى شهر يوليو 2024 في المدن الأربع، بواقع ثلاثة أيام تدريبية مكثفة في كل محطة.',
            ],
            bullets: [
              'التخطيط والتنفيذ لبرامج المنظمات ومشاريعها.',
              'الإدارة المالية لمنظمات المجتمع المدني.',
              'الحوكمة وفق قرارات ومعايير المنظمات الدولية.',
              'تطوير مهارات العاملين في المنظمات وتبادل الخبرات فيما بينها.',
            ],
          },
          {
            id: 'closing-statement',
            title: 'بيان المرحلة الأولى',
            paragraphs: [
              'أقيمت المرحلة الأولى من برنامج رفع قدرات منظمات المجتمع المدني من الاثنين 8 يوليو حتى الخميس 25 يوليو 2024 في حضرموت الساحل وحضرموت الوادي ومأرب وتعز.',
              'نُفذت المرحلة في تعز بالشراكة مع مؤسسة رسالتي لتنمية المرأة، وفي حضرموت المكلا بالشراكة مع مؤسسة صلة للتنمية، وفي حضرموت الوادي بالشراكة مع مؤسسة البادية للتنمية والأعمال الإنسانية، وفي مأرب برعاية مكتب أوتشا مأرب وبالشراكة مع الهيئة العالمية للإغاثة والتنمية - أنصر، مكتب اليمن.',
              'شارك في المرحلة 160 مشاركاً يمثلون 140 منظمة مجتمع مدني من 13 محافظة يمنية، وحضر جلسات الافتتاح مسؤولون أكدوا أهمية البرنامج في تطوير أداء منظمات المجتمع المدني وخدمة التنمية في اليمن.',
              'وفي الختام توجّه وقف أويس القرني بالشكر للجهات الرسمية في المحافظات ولجميع الشركاء المحليين والمشاركين وفرق العمل المنظمة للبرنامج على جهودهم في إنجاح هذه المرحلة، متطلعاً إلى مزيد من النجاحات في المراحل القادمة.',
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
              'يقود الملتقى هيئة تأسيسية تضم المؤسسات الثلاث المطلقة له، ويضم في عضويته العشرات من جمعيات ومؤسسات المجتمع المدني المحلية، والدعوة مفتوحة لبقية المنظمات اليمنية بمختلف مجالاتها للانضمام إليه.',
              'وواصلت الهيئة التأسيسية عملها بعد الإطلاق؛ ففي نوفمبر 2024 عقدت اجتماعاً في مقر الوقف لمناقشة مسارات التوطين وحزمة التدخلات والفعاليات المقررة بالشراكة مع الجهات الحكومية والأممية.',
            ],
            ordered: true,
            bullets: [
              'حشد جهود منظمات المجتمع المدني باتجاه التوطين.',
              'خلق بيئة ملائمة لمنظمات المجتمع المدني لبناء قدراتها بما يسهم في تحسين مستوى التوطين.',
              'التشبيك مع أصحاب المصلحة لإيجاد نقاط مشتركة تسرع عملية التوطين.',
              'المشاركة في تحريك عجلة التنمية من خلال تنويع التدخلات وتجويدها بناءً على الخطط القائمة على الاحتياج.',
              'مد الجسور بين المنظمات المحلية والجهات الأممية والدولية المانحة.',
            ],
          },
        ],
        cta: {
          title: 'ساهم في دعم التطوير المؤسسي',
          description:
            'يمكن الوصول إلى فرص المساهمة الرسمية المنشورة لدى وقف أويس القرني من صفحة المساهمة الداخلية.',
          button: 'اذهب إلى صفحة المساهمة',
        },
        seo: {
          title: 'التطوير المؤسسي | وقف أويس القرني',
          description:
            'مسار التطوير المؤسسي لتطوير أداء المؤسسات الحكومية والأهلية، وبرنامج رفع قدرات منظمات المجتمع المدني في أربع مدن يمنية.',
          canonical: officialSources.institutionalDevelopment,
        },
      },
      {
        ...programShared['community-awareness'],
        title: 'التوعية المجتمعية',
        summary:
          'منصة أويس: منصة معرفية وإعلامية تُعنى بقضايا الفكر والنهوض الحضاري، وتصنع الوعي الجمعي عبر البودكاست والمواد المرئية والديوانية والمدونة.',
        heroImageAlt: 'شعار منصة أويس',
        imageGallery: [
          {
            src: awarenessOwaisPlatformImage,
            alt: 'منصة أويس',
            caption: 'منصة أويس',
            width: 1080,
            height: 1080,
          },
        ],
        highlights: [
          'قراءة التاريخ',
          'دراسة الحاضر',
          'استشراف المستقبل',
          'بودكاست أويس',
          'ديوانية أويس',
          'مواد مرئية',
          'مدونة أويس',
          'صناعة الوعي الجمعي',
        ],
        sections: [
          {
            id: 'intro',
            title: 'منصة أويس',
            paragraphs: [
              'منصة أويس إحدى مبادرات وقف أويس القرني، تُعنى بقضايا الفكر والنهوض الحضاري من خلال قراءة التاريخ ودراسة الحاضر واستشراف المستقبل.',
              'تسعى المنصة لتعزيز الوعي الجمعي عبر مواد وبرامج معرفية مختلفة، تسهم في إعادة صياغة الرأي العام وترسيخ ثقافة النهضة والتعايش.',
            ],
          },
        ],
        themes: [
          {
            id: 'read-history',
            title: 'قراءة التاريخ',
            description: 'العودة إلى التجربة التاريخية لفهم جذور الحاضر واستخلاص دروسها.',
          },
          {
            id: 'study-present',
            title: 'دراسة الحاضر',
            description: 'قراءة الواقع اليمني وقضاياه الفكرية بعين تحليلية.',
          },
          {
            id: 'anticipate-future',
            title: 'استشراف المستقبل',
            description: 'وعي جمعي يرسّخ قيم النهوض الحضاري والعيش المشترك ويستشرف ما هو آتٍ.',
          },
        ],
        mediaProducts: [
          {
            id: 'podcast',
            title: 'بودكاست أويس',
            tagline: 'حوارات مسموعة',
            description:
              'حلقات حوارية معمّقة مع مفكرين وباحثين حول قضايا الوعي والنهضة، تصل إلى المستمع أينما كان.',
          },
          {
            id: 'visuals',
            title: 'المواد المرئية',
            tagline: 'محتوى مرئي',
            description:
              'مقاطع وفيديوهات معرفية مكثّفة تقرّب الأفكار الكبيرة إلى الجمهور بلغة بصرية معاصرة.',
          },
          {
            id: 'diwaniya',
            title: 'ديوانية أويس',
            tagline: 'مجلس فكري',
            description:
              'مجلس دوري يجمع النخب والمهتمين لمدارسة قضايا الفكر والنهوض الحضاري في لقاءات مباشرة.',
          },
          {
            id: 'blog',
            title: 'المدونة',
            tagline: 'مقالات ورؤى',
            description:
              'مساحة مكتوبة تنشر المقالات والقراءات والرؤى التي تعمّق النقاش وتوثّق نتاج المنصة.',
          },
        ],
        spotlight: {
          eyebrow: 'من فعاليات المنصة',
          title: 'تدشين كتاب «من الصحوة إلى الشهود» في إسطنبول',
          description:
            'أقامت منصة أويس حفل تدشين كتاب الأديب والمفكر اليمني الراحل فؤاد الحميري في الذكرى الأولى لرحيله، بحضور نخبة من المفكرين والأدباء والأكاديميين والإعلاميين.',
          images: [
            { src: '/news/05-fuad-al-himyari-book-launch-1.jpeg', alt: 'حفل تدشين كتاب من الصحوة إلى الشهود' },
            { src: '/news/05-fuad-al-himyari-book-launch-3.jpeg', alt: 'جانب من حضور فعالية منصة أويس' },
            { src: '/news/05-fuad-al-himyari-book-launch-5.jpeg', alt: 'من فقرات ندوة منصة أويس' },
          ],
          linkLabel: 'اقرأ الخبر كاملًا',
          route: '/news/fuad-al-himyari-book-launch',
        },
        cta: {
          title: 'ادعم منصة أويس',
          description:
            'تعرض صفحة المساهمة الرسمية فرص الدعم المتاحة لدى وقف أويس القرني دون بناء نظام دفع داخلي.',
          button: 'اذهب إلى صفحة المساهمة',
        },
        seo: {
          title: 'التوعية المجتمعية | وقف أويس القرني',
          description:
            'منصة أويس: منصة معرفية وإعلامية تُعنى بقضايا الفكر والنهوض الحضاري وتعزيز الوعي الجمعي في وقف أويس القرني.',
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
      programsHref: '/#programs',
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
      contact: 'Iletisim',
      otherPrograms: 'Diger Programlar',
      details: 'Detaylari Gor',
      donate: 'Katki Sun',
      noVerifiedStats: 'Dogrulanmamis sayilar gosterilmez.',
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
      audiencesDescription:
        'Program iki tur kuruma yonelir; her ikisiyle performansi gelistirmek ve programlari, mekanizmalari, planlari ve stratejileri yenilemek icin calisir.',
      exploreTrack: 'Programi Kesfedin',
      awarenessEyebrow: 'Owais Platformu',
      awarenessHeroNote: 'Dusunce ve medeniyet kalkinisi konularina odaklanan, kolektif bilinci guclendiren bir bilgi ve medya platformu.',
      exploreInitiatives: 'Platformu Kesfet',
      awarenessThemes: 'Platformun calistigi uc halka',
      awarenessThemesDescription:
        'Tarihten bugune, oradan gelecege: okunan bir tarih, incelenen bir gercek ve ongorulen bir gelecek. Halkalar arasinda gecmek icin asagi kaydirin veya bir halkanin uzerine gelin.',
      themeLabel: 'Halka',
      awarenessInitiativesEyebrow: 'Platformun sundugu',
      awarenessInitiatives: 'Bilgi materyalleri ve programlar',
      awarenessInitiativesDescription:
        'Platformun izleyicisine ulastigi cesitli kanallar: podcast ve divandan gorsel materyallere ve bloga.',
      onAirLabel: 'Kesintisiz bilgi yayini',
      pioneerStatsEyebrow: 'Programin Ozeti',
      pioneerStatsTitle: 'Rakamlarla Yemen Onculeri',
      pioneerStatsDescription:
        'Resmi "Rakamlarla Uveys" raporundan alinan ve programin Aralik 2025 itibariyla onculere sundugunu ozetleyen dogrulanmis rakamlar.',
      pioneerStatsCenter: 'Ozet',
      pioneersEyebrow: 'Burs ve Liderlik Programi',
      exploreProgram: 'Programi Kesfedin',
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
        summary:
          'Gonulluluk Birimi: gonullu calisma kulturunu yerlestirmek ve vakfin hedeflerini gerceklestirecek cesitli gonulluluk firsatlari sunmak.',
        heroImageAlt: 'Veysel Karani Vakfi Gonulluluk Birimi',
        imageGallery: [
          {
            src: volunteerHeroImage,
            alt: 'Veysel Karani Vakfi resmi gonulluluk bolumu gorseli',
            caption: 'Yemenin kalkinisi icin birlikte',
            width: 1024,
            height: 400,
          },
          {
            src: awarenessVolunteerUnitImage,
            alt: 'Gonulluluk Birimi logosu',
            caption: 'Gonulluluk Birimi',
            width: 1080,
            height: 1080,
          },
        ],
        volunteer: {
          eyebrow: 'Gonulluluk Birimi',
          joinCta: 'Gonullu Ol',
          exploreCta: 'Birimi Kesfet',
          slogan: 'En kucuk caba bile daha iyi bir Yemenin hatlarini cizer.',
          hashtags: ['#تطوعك_وقف', '#تطوع_لأجل_اليمن'],
          contactTitle: 'Birimle iletisime gecin',
          quoteLabel: 'Inandigimiz sey',
          statement: {
            eyebrow: 'Neden gonulluluk',
            title: 'Tek el alkis tutmaz',
            description: 'Gonulluluk Birimi, bireysel enerjilerin bulusup tek bir cabaya donustugu alandir.',
          },
          fields: {
            eyebrow: 'Birimin alanlari',
            title: 'Calistigimiz uc alan',
            description: 'Incelemek icin bir alanin uzerine gelin: degeri yerlestirmekten firsati acmaya, oradan cabayi birlestirmeye.',
          },
          goals: {
            eyebrow: 'Hedefimiz',
            title: 'Birimin calismasini yonlendiren dort hedef',
            description: 'Gonullu calismayi vakfin program ve eksenlerinde somut bir etkiye ceviren hedefler.',
          },
          steps: {
            eyebrow: 'Nasil katilirsiniz',
            title: 'Uc adimda gonullulugunuz baslasin',
            description: 'Ilginizi kaydetmekten calisma ekiplerindeki ilk fiili katiliminiza kadar.',
          },
        },
        goals: [
          'Gonullulerin cabalariyla Veysel Karani Vakfinin hedeflerine katki sunmak.',
          'Vakfin program ve eksenlerinde fiili katilimla gonullulerin kapasitesini gelistirmek.',
          'Kalkinma ve insani calismalarda toplumsal katilim tabanini genisletmek.',
          'Yemenin kalkinisi icin cabalari ve fikirleri birlestirmek.',
        ],
        journey: [
          {
            id: 'register',
            title: 'Ilginizi kaydedin',
            description: 'Sitedeki gonulluluk formunu bilgileriniz, ilgi alanlariniz ve sunmak istediginiz becerilerle doldurun.',
          },
          {
            id: 'match',
            title: 'Ekip sizinle iletisime gecer',
            description:
              'Birim ekibi ilgi alaninizi mevcut firsatlarla eslestirir; dogrudan iletisim icin telefon veya e-posta kullanabilirsiniz.',
          },
          {
            id: 'contribute',
            title: 'Katilin ve kapasitenizi gelistirin',
            description: 'Vakfin program ve eksenlerindeki calisma ekiplerine katilin; kapasiteniz uygulama ve ortak calismayla buyusun.',
          },
        ],
        pillars: [
          {
            id: 'volunteer-culture',
            title: 'Gonulluluk kulturunu yerlestirmek',
            body: 'Gonullu calisma degerlerini yurt icinde ve disinda Yemenliler arasinda yaymak.',
            points: [
              'Vermeyi ve katilimi yucelten bir soylem.',
              'Gencler ve yerel topluluklar arasinda surekli varlik.',
            ],
          },
          {
            id: 'volunteer-opportunities',
            title: 'Gonulluluk firsatlari sunmak',
            body: 'Vakfin programlarina ve kalkinma eksenlerine hizmet eden cesitli gonulluluk firsatlari sunmak.',
            points: [
              'Gonullulerin beceri ve ilgi alanlarina uygun firsatlar.',
              'Mevcut programlarda fiili katilim.',
            ],
          },
          {
            id: 'joint-effort',
            title: 'Cabalari birlestirmek',
            body: 'Girisim ve fikirleri toplayip vakfin hedefleri dogrultusunda yonlendirmek ve tek vucut calismak.',
            points: [
              'Gonulluler ve ekipler arasinda fikir alisverisi.',
              'Bireysel cabalarin tek bir yolda butunlesmesi.',
            ],
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'Gonulluluk Birimi',
            paragraphs: [
              'Gonulluluk Birimi, gonullu calisma kulturunu yerlestirmeyi ve Veysel Karani Vakfinin hedeflerini gerceklestirmek icin cesitli gonulluluk firsatlari sunmayi amaclar.',
              'Yeni bir Yemenin insasinin ortak calisma ve dayanisma ile basladigina inaniyoruz; fikirler bulusur, cabalar birlesir ve gonulluler vakfin programlarina fiilen katilarak kapasitelerini gelistirir.',
            ],
          },
        ],
        cta: {
          title: 'Kapasite Gelistirmeyi ve Gonullulugu Destekleyin',
          description: 'Resmi katkı sayfasi, vakfin mevcut proje ve program destek firsatlarini bir araya getirir.',
          button: 'Katki Sayfasina Git',
        },
        seo: {
          title: 'Kapasite Gelistirme | Veysel Karani Vakfi',
          description:
            'Veysel Karani Vakfinin kapasite gelistirme ekseni ve gonullu calisma kulturunu yerlestiren Gonulluluk Birimi.',
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
          {
            src: capacityHadramoutCoastImage,
            alt: 'Sivil toplum kapasite artirma programina katilan kuruluslar – Hadramut Sahili, Temmuz 2024',
            caption: 'Katilimci kuruluslar – Hadramut Sahili',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityHadramoutValleyImage,
            alt: 'Sivil toplum kapasite artirma programina katilan kuruluslar – Hadramut Vadisi, Temmuz 2024',
            caption: 'Katilimci kuruluslar – Hadramut Vadisi',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityMaribImage,
            alt: 'Sivil toplum kapasite artirma programina katilan kuruluslar – Marib, Temmuz 2024',
            caption: 'Katilimci kuruluslar – Marib',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityTaizImage,
            alt: 'Sivil toplum kapasite artirma programina katilan kuruluslar – Taiz, Temmuz 2024',
            caption: 'Katilimci kuruluslar – Taiz',
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
            imageAlt: 'Hadramut Sahili kapasite artirma belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Hadramut Sahili kapasite artirma programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Selah Kalkinma Vakfi',
            period: '15 – 17 Temmuz 2024',
            organizations: '22 sivil toplum kurulusu',
            patron: 'Hadramut Sahili Sosyal Isler ve Calisma Ofisi gozetiminde',
          },
          {
            id: 'hadramout-valley',
            name: 'Hadramut Vadisi',
            image: capacityHadramoutValleyImage,
            imageAlt: 'Hadramut Vadisi kapasite artirma belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Hadramut Vadisi kapasite artirma programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Al-Badia Insani Kalkinma Vakfi',
            period: '20 – 22 Temmuz 2024',
            organizations: '28 sivil toplum kurulusu',
            patron: 'Hadramut Vadi ve Col Isleri Vali Yardimcisi Amir el-Amiri himayesinde',
          },
          {
            id: 'marib',
            name: 'Marib',
            image: capacityMaribImage,
            imageAlt: 'Marib kapasite artirma belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Marib kapasite artirma programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'OCHA Marib ofisi ve International Relief and Development Authority - Ansar',
            period: '23 – 25 Temmuz 2024',
            organizations: '13 ilden 40 kurulus',
            patron: 'Marib Valisi Korgeneral Sultan el-Arada himayesinde',
          },
          {
            id: 'taiz',
            name: 'Taiz',
            image: capacityTaizImage,
            imageAlt: 'Taiz kapasite artirma belgesi',
            videoId: capacityVideo.videoId,
            videoTitle: 'Taiz kapasite artirma programi videosu',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Resalaty Kadin Kalkinma Vakfi',
            period: '8 – 10 Temmuz 2024',
            organizations: '40 sivil toplum kurulusu',
            patron: 'Taiz Valisi Nebil Semsan himayesinde',
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
          {
            id: 'capacity-intro',
            title: 'Sivil Toplum Kuruluslari Kapasite Artirma Programi',
            paragraphs: [
              'Program hedeflerini sahada kapasite artirma calismasiyla hayata gecirir: kamu ve sivil kurum liderlerini yetistirir ve performanslarini gelistirir. Birinci asamasi dort Yemen sehrinde sivil toplum kuruluslariyla uygulandi.',
              'Program, Veysel Karani Vakfinin kamu ve sivil kurumlarin gelisimine odaklanan ucuncu ekseni kapsaminda yurutulur; bu kuruluslarin kapasitelerini ve yetkinliklerini gelistirerek surdurulebilir kalkinmaya, Yemen genelinde insani ve kalkinma calismalarinin guclenmesine ve Yemenin medeniyet yukselisine katki saglamayi amaclar.',
            ],
          },
          {
            id: 'training-axes',
            title: 'Egitim Basliklari',
            paragraphs: [
              'Program, Veysel Karani Vakfi uzman ekibi uyesi Muhendis Fuad Said tarafindan Temmuz 2024 boyunca dort sehirde, her durakta uc gunluk yogun egitimler halinde sunuldu.',
            ],
            bullets: [
              'Kurulus program ve projelerinde planlama ve uygulama.',
              'Sivil toplum kuruluslarinda mali yonetim.',
              'Uluslararasi kurum karar ve standartlarina uygun yonetisim.',
              'Kurulus calisanlarinin becerilerini gelistirme ve kurumlar arasi deneyim paylasimi.',
            ],
          },
          {
            id: 'closing-statement',
            title: 'Birinci Asama Aciklamasi',
            paragraphs: [
              'Sivil Toplum Kuruluslari Kapasite Artirma Programinin birinci asamasi 8 Temmuz Pazartesi ile 25 Temmuz 2024 Persembe arasinda Hadramut Sahili, Hadramut Vadisi, Marib ve Taiz sehirlerinde duzenlendi.',
              'Taizde Resalaty Kadin Kalkinma Vakfi, Hadramut Mukallada Selah Kalkinma Vakfi, Hadramut Vadisinde Al-Badia Insani Kalkinma Vakfi ile ortaklik yapildi. Marib uygulamasi OCHA Marib ofisi himayesinde ve International Relief and Development Authority - Ansar Yemen ofisi ortakliginda gerceklesti.',
              'Asamaya 13 Yemen ilinden 140 sivil toplum kurulusunu temsil eden 160 katilimci katildi. Acilis oturumlarina katilan yetkililer, programin sivil toplum performansini ve Yemen kalkinmasini gelistirmedeki onemini vurguladi.',
              'Veysel Karani Vakfi, bu asamanin basarisindaki katkilari icin ilgili illerdeki resmi makamlara, tum yerel ortaklara, katilimcilara ve programi duzenleyen ekiplere tesekkur eder; gelecek asamalarda daha fazla basariyi hedefler.',
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
              'Forum, kurucu uc kurumdan olusan bir kurucu heyet tarafindan yurutulur; uyeleri arasinda onlarca yerel dernek ve sivil toplum kurulusu bulunur ve tum Yemenli kuruluslara katilim cagrisi aciktir.',
              'Kurucu heyet lansman sonrasinda calismalarini surdurdu; Kasim 2024te vakif merkezinde toplanarak yerellestirme yollarini ve kamu ve BM kuruluslariyla ortak planlanan mudahale ve etkinlik paketini gorustu.',
            ],
            ordered: true,
            bullets: [
              'Sivil toplum kuruluslarinin cabalarini yerellestirme yonunde harekete gecirmek.',
              'Yerellestirme duzeyini iyilestirmek icin sivil toplum kuruluslarinin kapasitelerini gelistirebilecegi uygun bir ortam olusturmak.',
              'Paydaslarla ag kurarak yerellestirmeyi hizlandiracak ortak noktalar gelistirmek.',
              'Ihtiyaca dayali planlar uzerine kurulu, cesitlendirilmis ve nitelikli mudahalelerle kalkinmanin hizlanmasina katki sunmak.',
              'Yerel kuruluslar ile BM kuruluslari ve uluslararasi donorler arasinda kopruler kurmak.',
            ],
          },
        ],
        cta: {
          title: 'Kurumsal Gelisimi Destekleyin',
          description:
            'Veysel Karani Vakfinin resmi destek firsatlarina dahili katkı sayfasi uzerinden ulasilabilir.',
          button: 'Katki Sayfasina Git',
        },
        seo: {
          title: 'Kurumsal Gelisim | Veysel Karani Vakfi',
          description:
            'Kamu ve sivil kurum performansini gelistiren kurumsal gelisim ekseni ve dort Yemen sehrinde uygulanan sivil toplum kapasite artirma programi.',
          canonical: officialSources.institutionalDevelopment,
        },
      },
      {
        ...programShared['community-awareness'],
        title: 'Toplumsal Farkindalik',
        summary:
          'Owais Platformu: dusunce ve medeniyet kalkinisi konularina odaklanan; podcast, gorsel icerikler, divan ve blog araciligiyla kolektif bilinci guclendiren bir bilgi ve medya platformu.',
        heroImageAlt: 'Owais Platformu logosu',
        imageGallery: [
          {
            src: awarenessOwaisPlatformImage,
            alt: 'Owais Platformu',
            caption: 'Owais Platformu',
            width: 1080,
            height: 1080,
          },
        ],
        highlights: [
          'Tarihi okumak',
          'Bugunu incelemek',
          'Gelecegi ongormek',
          'Owais Podcast',
          'Owais Divani',
          'Gorsel icerikler',
          'Owais Blog',
          'Kolektif bilinc insasi',
        ],
        sections: [
          {
            id: 'intro',
            title: 'Owais Platformu',
            paragraphs: [
              'Owais Platformu, Veysel Karani Vakfinin girisimlerinden biridir; tarih okumasi, bugunun incelenmesi ve gelecegin ongorulmesi yoluyla dusunce ve medeniyet kalkinisi konularina odaklanir.',
              'Platform, farkli bilgi materyalleri ve programlarla kolektif bilinci guclendirmeyi; kamuoyunu yeniden sekillendirmeye, kalkinis ve birlikte yasama kulturunu koklestirmeye katki sunmayi hedefler.',
            ],
          },
        ],
        themes: [
          {
            id: 'read-history',
            title: 'Tarihi okumak',
            description: 'Bugunun koklerini anlamak ve dersler cikarmak icin tarihsel tecrubeye donmek.',
          },
          {
            id: 'study-present',
            title: 'Bugunu incelemek',
            description: 'Yemen gercekligini ve dusunsel meselelerini analitik bir gozle okumak.',
          },
          {
            id: 'anticipate-future',
            title: 'Gelecegi ongormek',
            description: 'Medeni kalkinis ve ortak yasam degerlerini koklestiren, geleceni ongoren kolektif bir bilinc.',
          },
        ],
        mediaProducts: [
          {
            id: 'podcast',
            title: 'Owais Podcast',
            tagline: 'Sesli sohbetler',
            description:
              'Bilinc ve kalkinis meseleleri uzerine dusunur ve arastirmacilarla derinlemesine sohbet bolumleri; dinleyiciye her yerde ulasir.',
          },
          {
            id: 'visuals',
            title: 'Gorsel Icerikler',
            tagline: 'Video icerik',
            description:
              'Buyuk fikirleri cagdas bir gorsel dille izleyiciye yaklastiran yogun bilgi videolari ve kisa icerikler.',
          },
          {
            id: 'diwaniya',
            title: 'Owais Divani',
            tagline: 'Fikir meclisi',
            description:
              'Dusunce ve medeniyet kalkinisi meselelerini yuz yuze muzakere etmek icin seckinleri ve ilgilileri bulusturan periyodik meclis.',
          },
          {
            id: 'blog',
            title: 'Blog',
            tagline: 'Makale ve gorusler',
            description:
              'Tartismayi derinlestiren ve platformun uretimini kayit altina alan makale, okuma ve goruslerin yayimlandigi yazili alan.',
          },
        ],
        spotlight: {
          eyebrow: 'Platform etkinliklerinden',
          title: '"Uyanistan Sahitlige" kitabinin Istanbul lansmani',
          description:
            'Owais Platformu, merhum Yemenli edebiyatci ve dusunur Fuad el-Himyari’nin kitabinin lansmanini, vefatinin birinci yildonumunde dusunurler, edebiyatcilar, akademisyenler ve medya mensuplarinin katilimiyla gerceklestirdi.',
          images: [
            { src: '/news/05-fuad-al-himyari-book-launch-1.jpeg', alt: 'Kitap lansman toreni' },
            { src: '/news/05-fuad-al-himyari-book-launch-3.jpeg', alt: 'Owais Platformu etkinliginden katilimcilar' },
            { src: '/news/05-fuad-al-himyari-book-launch-5.jpeg', alt: 'Owais Platformu panelinden bir kare' },
          ],
          linkLabel: 'Haberin tamamini oku',
          route: '/news/fuad-al-himyari-book-launch',
        },
        cta: {
          title: 'Owais Platformunu Destekleyin',
          description:
            'Resmi katkı sayfasi, dahili bir odeme sistemi kurmadan vakfin mevcut destek firsatlarini gosterir.',
          button: 'Katki Sayfasina Git',
        },
        seo: {
          title: 'Toplumsal Farkindalik | Veysel Karani Vakfi',
          description:
            'Owais Platformu: dusunce ve medeniyet kalkinisi konularina odaklanan, kolektif bilinci guclendiren bilgi platformu.',
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
      programsHref: '/#programs',
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
      contact: 'Contact',
      otherPrograms: 'Other Programs',
      details: 'View Details',
      donate: 'Contribute Now',
      noVerifiedStats: 'Unverified figures are not displayed.',
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
      audiencesDescription:
        'The track addresses two types of institutions, working with both to develop performance and update programs, mechanisms, plans and strategies.',
      exploreTrack: 'Explore the Track',
      awarenessEyebrow: 'Owais Platform',
      awarenessHeroNote: 'A knowledge and media platform devoted to thought and civilizational advancement, shaping collective awareness.',
      exploreInitiatives: 'Explore the Platform',
      awarenessThemes: 'Three circles the platform works on',
      awarenessThemesDescription:
        'From history, to the present, to what lies ahead: a history read, a reality studied, and a future anticipated. Scroll down to move between the circles, or hover over any of them.',
      themeLabel: 'Circle',
      awarenessInitiativesEyebrow: 'What the platform offers',
      awarenessInitiatives: 'Knowledge materials and programs',
      awarenessInitiativesDescription:
        'The varied channels through which the platform reaches its audience, from the podcast and diwaniya to visual materials and the blog.',
      onAirLabel: 'Always-on knowledge broadcast',
      pioneerStatsEyebrow: 'Program Summary',
      pioneerStatsTitle: 'Yemen Pioneers in Numbers',
      pioneerStatsDescription:
        'Verified figures from the official "Owais in Numbers" report, summarising what the program has delivered for its pioneers through December 2025.',
      pioneerStatsCenter: 'At a Glance',
      pioneersEyebrow: 'Scholarship & Leadership Program',
      exploreProgram: 'Explore the Program',
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
        summary:
          'The Volunteer Unit: rooting the culture of volunteer work and offering varied volunteer opportunities that build capacity and serve the waqf goals.',
        heroImageAlt: 'The Volunteer Unit of Veysel Karani Waqf',
        imageGallery: [
          {
            src: volunteerHeroImage,
            alt: 'Official volunteer section image from Veysel Karani Waqf',
            caption: 'Standing together for Yemen’s advancement',
            width: 1024,
            height: 400,
          },
          {
            src: awarenessVolunteerUnitImage,
            alt: 'Volunteer Unit logo',
            caption: 'Volunteer Unit',
            width: 1080,
            height: 1080,
          },
        ],
        volunteer: {
          eyebrow: 'Volunteer Unit',
          joinCta: 'Join as a Volunteer',
          exploreCta: 'Explore the Unit',
          slogan: 'Every effort, however simple, shapes a better Yemen.',
          hashtags: ['#تطوعك_وقف', '#تطوع_لأجل_اليمن'],
          contactTitle: 'Reach the unit',
          quoteLabel: 'What we believe',
          statement: {
            eyebrow: 'Why we volunteer',
            title: 'One hand does not clap',
            description: 'The Volunteer Unit is where individual energies meet and become a single shared effort.',
          },
          fields: {
            eyebrow: 'Areas of the unit',
            title: 'Three areas we work on',
            description: 'Hover any area to open it: from rooting the value, to opening the opportunity, to uniting the effort.',
          },
          goals: {
            eyebrow: 'What we aim for',
            title: 'Four goals that steer the unit',
            description: 'Goals that turn volunteer work into visible impact across the waqf programs and tracks.',
          },
          steps: {
            eyebrow: 'How to join',
            title: 'Three steps and your volunteering begins',
            description: 'From registering your interest to your first real participation inside the working teams.',
          },
        },
        goals: [
          'Contribute to the goals of Veysel Karani Waqf through the efforts of volunteers.',
          'Build volunteers’ capacities through real participation in the waqf programs and tracks.',
          'Widen community participation in development and humanitarian work.',
          'Unite efforts and ideas in service of Yemen’s advancement.',
        ],
        journey: [
          {
            id: 'register',
            title: 'Register your interest',
            description: 'Fill in the volunteer form on this site with your details, areas of interest and the skills you want to offer.',
          },
          {
            id: 'match',
            title: 'The team gets in touch',
            description:
              'The unit’s team matches your interest with the available opportunities. You can also reach us directly by phone or email.',
          },
          {
            id: 'contribute',
            title: 'Take part and grow',
            description: 'Join the working teams across the waqf programs and tracks, and build your capacities through practice and shared work.',
          },
        ],
        pillars: [
          {
            id: 'volunteer-culture',
            title: 'Rooting the culture of volunteering',
            body: 'Spreading the values of volunteer work among Yemenis at home and abroad.',
            points: [
              'A discourse that raises the value of giving and participation.',
              'A steady presence among young people and local communities.',
            ],
          },
          {
            id: 'volunteer-opportunities',
            title: 'Opening volunteer opportunities',
            body: 'Offering varied volunteer opportunities that serve the waqf programs and development tracks.',
            points: [
              'Opportunities matched to volunteers’ skills and interests.',
              'Real participation inside the running programs.',
            ],
          },
          {
            id: 'joint-effort',
            title: 'Uniting efforts',
            body: 'Receiving initiatives and ideas, directing them toward the waqf goals, and working as one body.',
            points: [
              'Ideas exchanged between volunteers and working teams.',
              'Individual efforts brought together into one track.',
            ],
          },
        ],
        sections: [
          {
            id: 'intro',
            title: 'The Volunteer Unit',
            paragraphs: [
              'The Volunteer Unit seeks to root the culture of volunteer work and provide varied volunteer opportunities that serve the goals of Veysel Karani Waqf.',
              'We believe building a new Yemen starts with joint work and solidarity: ideas meet, efforts unite, and volunteers build their own capacities by taking part in the waqf programs and tracks.',
            ],
          },
        ],
        cta: {
          title: 'Support Capacity Building and Volunteering',
          description:
            'The official contribution page gathers available opportunities to support the waqf projects and development programs.',
          button: 'Go to Contribution Page',
        },
        seo: {
          title: 'Capacity Building | Veysel Karani Waqf',
          description:
            'The Capacity Building track of Veysel Karani Waqf and the Volunteer Unit that roots the culture of volunteer work.',
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
          {
            src: capacityHadramoutCoastImage,
            alt: 'Organizations participating in the civil society capacity raising program – Hadramout Coast, July 2024',
            caption: 'Participating organizations – Hadramout Coast',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityHadramoutValleyImage,
            alt: 'Organizations participating in the civil society capacity raising program – Hadramout Valley, July 2024',
            caption: 'Participating organizations – Hadramout Valley',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityMaribImage,
            alt: 'Organizations participating in the civil society capacity raising program – Marib, July 2024',
            caption: 'Participating organizations – Marib',
            width: 1080,
            height: 1350,
          },
          {
            src: capacityTaizImage,
            alt: 'Organizations participating in the civil society capacity raising program – Taiz, July 2024',
            caption: 'Participating organizations – Taiz',
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
            imageAlt: 'Capacity raising documentation in Hadramout Coast',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity raising program video in Hadramout Coast',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Selah Foundation for Development',
            period: '15 – 17 July 2024',
            organizations: '22 civil society organizations',
            patron: 'Supervised by the Social Affairs and Labor Office of Hadramout Coast',
          },
          {
            id: 'hadramout-valley',
            name: 'Hadramout Valley',
            image: capacityHadramoutValleyImage,
            imageAlt: 'Capacity raising documentation in Hadramout Valley',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity raising program video in Hadramout Valley',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Al-Badia Foundation for Humanitarian Development',
            period: '20 – 22 July 2024',
            organizations: '28 civil society organizations',
            patron: 'Sponsored by Amer Al-Ameri, Deputy Governor of Hadramout for Valley and Desert Affairs',
          },
          {
            id: 'marib',
            name: 'Marib',
            image: capacityMaribImage,
            imageAlt: 'Capacity raising documentation in Marib',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity raising program video in Marib',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'OCHA Marib office and the International Relief and Development Authority - Ansar',
            period: '23 – 25 July 2024',
            organizations: '40 organizations from 13 governorates',
            patron: 'Sponsored by Maj. Gen. Sultan Al-Arada, Governor of Marib',
          },
          {
            id: 'taiz',
            name: 'Taiz',
            image: capacityTaizImage,
            imageAlt: 'Capacity raising documentation in Taiz',
            videoId: capacityVideo.videoId,
            videoTitle: 'Capacity raising program video in Taiz',
            videoSourceUrl: capacityVideo.sourceUrl,
            partner: 'Resalaty Foundation for Women Development',
            period: '8 – 10 July 2024',
            organizations: '40 civil society organizations',
            patron: 'Sponsored by Nabil Shamsan, Governor of Taiz',
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
          {
            id: 'capacity-intro',
            title: 'Civil Society Organizations Capacity Raising Program',
            paragraphs: [
              'The track turns its goals into field work through the capacity raising program, which qualifies leaders of governmental and civil institutions and improves their performance. Its first phase was implemented with civil society organizations across four Yemeni cities.',
              'The program falls under the third track of Veysel Karani Waqf, dedicated to developing governmental and civil institutions: strengthening the capacities of these organizations and raising their efficiency to achieve sustainable development, reinforce humanitarian and development work across Yemen, and contribute to the civilizational rise of Yemen.',
            ],
          },
          {
            id: 'training-axes',
            title: 'Training Areas',
            paragraphs: [
              'The program was delivered by Engineer Fouad Saeed, a member of the Veysel Karani Waqf expert team, throughout July 2024 across the four cities, with three intensive training days at each stop.',
            ],
            bullets: [
              'Planning and implementation of organization programs and projects.',
              'Financial management for civil society organizations.',
              'Governance in line with international organization decisions and standards.',
              'Developing staff skills and exchanging expertise between organizations.',
            ],
          },
          {
            id: 'closing-statement',
            title: 'First Phase Statement',
            paragraphs: [
              'The first phase of the Civil Society Organizations Capacity Raising Program was held from Monday, July 8 to Thursday, July 25, 2024 in Hadramout Coast, Hadramout Valley, Marib and Taiz.',
              'The phase was implemented in Taiz with Resalaty Foundation for Women Development, in Hadramout Mukalla with Selah Foundation for Development, in Hadramout Valley with Al-Badia Foundation for Humanitarian Development, and in Marib under the sponsorship of OCHA Marib with the International Relief and Development Authority - Ansar, Yemen office.',
              'The phase included 160 participants representing 140 civil society organizations from 13 Yemeni governorates. Officials attended the opening sessions and emphasized the importance of the program for improving civil society performance and supporting development in Yemen.',
              'Veysel Karani Waqf concludes by thanking the official authorities in these governorates, all local partners, the participants and the organizing teams for making this phase a success, and looks forward to further achievements in the coming phases.',
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
              'The forum is led by a founding body made up of the three launching institutions; its membership already includes dozens of local associations and civil society organizations, and Yemeni organizations of all fields are invited to join.',
              'The founding body continued its work after the launch: in November 2024 it met at the waqf headquarters to discuss localization tracks and the package of interventions and events planned with governmental and UN partners.',
            ],
            ordered: true,
            bullets: [
              'Mobilize civil society organization efforts toward localization.',
              'Create an enabling environment for civil society organizations to build capacities that improve localization.',
              'Network with stakeholders to create common points that accelerate localization.',
              'Contribute to accelerating development through diverse, high-quality interventions built on needs-based plans.',
              'Build bridges between local organizations and UN agencies and international donors.',
            ],
          },
        ],
        cta: {
          title: 'Support Institutional Development',
          description:
            'The official support opportunities published by Veysel Karani Waqf can be reached through the internal contribution page.',
          button: 'Go to Contribution Page',
        },
        seo: {
          title: 'Institutional Development | Veysel Karani Waqf',
          description:
            'Institutional Development track for improving governmental and civil institution performance, and the civil society capacity raising program across four Yemeni cities.',
          canonical: officialSources.institutionalDevelopment,
        },
      },
      {
        ...programShared['community-awareness'],
        title: 'Community Awareness',
        summary:
          'Owais Platform: a knowledge and media platform devoted to thought and civilizational advancement, strengthening collective awareness through the podcast, visual materials, the diwaniya and the blog.',
        heroImageAlt: 'Owais Platform logo',
        imageGallery: [
          {
            src: awarenessOwaisPlatformImage,
            alt: 'Owais Platform',
            caption: 'Owais Platform',
            width: 1080,
            height: 1080,
          },
        ],
        highlights: [
          'Reading history',
          'Studying the present',
          'Anticipating the future',
          'Owais Podcast',
          'Owais Diwaniya',
          'Visual materials',
          'Owais Blog',
          'Shaping collective awareness',
        ],
        sections: [
          {
            id: 'intro',
            title: 'Owais Platform',
            paragraphs: [
              'Owais Platform is one of the initiatives of Veysel Karani Waqf. It focuses on issues of thought and civilizational advancement through reading history, studying the present and anticipating the future.',
              'The platform strengthens collective awareness through varied knowledge materials and programs, contributing to reshaping public opinion and rooting a culture of advancement and coexistence.',
            ],
          },
        ],
        themes: [
          {
            id: 'read-history',
            title: 'Reading history',
            description: 'Returning to the historical experience to understand the roots of the present and draw its lessons.',
          },
          {
            id: 'study-present',
            title: 'Studying the present',
            description: 'Reading the Yemeni reality and its questions of thought with an analytical eye.',
          },
          {
            id: 'anticipate-future',
            title: 'Anticipating the future',
            description: 'A collective awareness that roots the values of advancement and living together, and looks ahead.',
          },
        ],
        mediaProducts: [
          {
            id: 'podcast',
            title: 'Owais Podcast',
            tagline: 'Conversations in audio',
            description:
              'In-depth episodes with thinkers and researchers on questions of awareness and advancement, reaching listeners wherever they are.',
          },
          {
            id: 'visuals',
            title: 'Visual Materials',
            tagline: 'Video content',
            description:
              'Condensed knowledge videos and clips that bring big ideas closer to the audience in a contemporary visual language.',
          },
          {
            id: 'diwaniya',
            title: 'Owais Diwaniya',
            tagline: 'A gathering of ideas',
            description:
              'A recurring majlis that brings together thinkers and interested audiences to discuss thought and civilizational advancement face to face.',
          },
          {
            id: 'blog',
            title: 'The Blog',
            tagline: 'Articles and views',
            description:
              'A written space publishing articles, readings and perspectives that deepen the discussion and document the platform’s output.',
          },
        ],
        spotlight: {
          eyebrow: 'From the platform’s events',
          title: 'Launching “From Awakening to Witness” in Istanbul',
          description:
            'Owais Platform launched the book of the late Yemeni writer and thinker Fuad Al-Himyari on the first anniversary of his passing, attended by thinkers, writers, academics and media figures.',
          images: [
            { src: '/news/05-fuad-al-himyari-book-launch-1.jpeg', alt: 'Book launch ceremony' },
            { src: '/news/05-fuad-al-himyari-book-launch-3.jpeg', alt: 'Audience at the Owais Platform event' },
            { src: '/news/05-fuad-al-himyari-book-launch-5.jpeg', alt: 'A moment from the Owais Platform seminar' },
          ],
          linkLabel: 'Read the full story',
          route: '/news/fuad-al-himyari-book-launch',
        },
        cta: {
          title: 'Support Owais Platform',
          description:
            'The official contribution page presents available support opportunities without creating an internal payment system.',
          button: 'Go to Contribution Page',
        },
        seo: {
          title: 'Community Awareness | Veysel Karani Waqf',
          description:
            'Owais Platform: a knowledge and media platform devoted to thought and civilizational advancement and to strengthening collective awareness.',
          canonical: officialSources.communityAwareness,
        },
      },
    ],
  },
};

export function getProgramsContent(locale: Locale): ProgramsPageContent {
  const base = localizedPrograms[locale];
  return {
    ...cmsPageContent('programs-page', locale, base),
    programs: cmsPrograms(locale, base.programs),
  };
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
  if (!slug) return undefined;
  return getProgramsContent(locale).programs.find((program) => program.slug === slug);
}

export function getOtherPrograms(locale: Locale, slug: ProgramSlug) {
  return getProgramsContent(locale).programs.filter((program) => program.slug !== slug);
}

export function getProgramBreadcrumbs(locale: Locale, program: Program): BreadcrumbItem[] {
  const content = getProgramsContent(locale);

  return [
    { label: content.labels.home, href: '/' },
    { label: content.labels.programs, href: content.labels.programsHref || '/#programs' },
    { label: program.title },
  ];
}

/**
 * The page design a program renders with. An explicit admin choice wins; otherwise the
 * historical slug conventions apply, and any program carrying volunteer copy gets the
 * volunteer unit layout.
 */
export function resolveProgramLayout(program: Program): ProgramLayout {
  if (program.layout) return program.layout;
  if (program.slug === 'yemen-pioneers') return 'pioneers';
  if (program.slug === 'community-awareness') return 'awareness';
  if (program.slug === 'institutional-development') return 'institutional';
  if (program.volunteer) return 'volunteer';
  return 'generic';
}

/**
 * Volunteer copy for a program switched to the volunteer layout without its own copy block:
 * the static capacity-building copy of the same locale keeps the page rendering until the
 * editor fills the volunteer fields.
 */
export function getDefaultVolunteerCopy(locale: Locale): VolunteerCopy {
  const fallback = localizedPrograms[locale].programs.find((program) => program.volunteer)?.volunteer;
  return (
    fallback ?? {
      eyebrow: '',
      joinCta: '',
      exploreCta: '',
      slogan: '',
      hashtags: [],
      contactTitle: '',
      quoteLabel: '',
      statement: { eyebrow: '', title: '', description: '' },
      fields: { eyebrow: '', title: '', description: '' },
      goals: { eyebrow: '', title: '', description: '' },
      steps: { eyebrow: '', title: '', description: '' },
    }
  );
}
