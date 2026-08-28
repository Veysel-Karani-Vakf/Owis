import type { BreadcrumbItem } from '@/data/about';
import blessedTreeImage from '@/assets/projects/blessed-tree.jpg';
import goldPortfolioImage from '@/assets/projects/gold-portfolio.jpeg';
import waqfShareImage from '@/assets/projects/waqf-share.jpeg';
import type { Locale, Project } from '@/i18n/content';
import { cmsPageContent, cmsProjects } from '@/cms/adapters';

export const projectRoutes = {
  index: '/projects',
  blessedTree: '/projects/blessed-tree',
  waqfShare: '/projects/waqf-share',
  goldWallet: '/projects/gold-wallet',
} as const;

export type ProjectSlug = 'blessed-tree' | 'waqf-share' | 'gold-wallet';

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectAllocation = {
  percent: string;
  title: string;
  description: string;
};

export type ProjectVideo = {
  title: string;
  buttonLabel: string;
  videoId: string;
  sourceUrl: string;
  /** Public URL of a video uploaded in the dashboard; wins over videoId. */
  videoFile?: string;
  /** Cover image chosen in the dashboard; falls back to the project image. */
  posterImage?: string;
};

/** Per-project SEO overrides; every field is optional and falls back to the composed values. */
export type ProjectSeo = {
  title?: string;
  description?: string;
  canonical?: string;
};

export type LocalizedWaqfProject = {
  id: ProjectSlug;
  slug: ProjectSlug;
  route: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string[];
  image: string;
  imageAlt: string;
  /** Visual scale applied to the product image so subjects look equal in size (1 = natural). */
  imageScale?: number;
  contributionValue: string;
  unitAmount: number;
  facts: ProjectFact[];
  officialContributionUrl: string;
  officialSourceUrl: string;
  returnsTitle: string;
  returnsIntro?: string;
  returnUses: string[];
  allocations?: ProjectAllocation[];
  video?: ProjectVideo;
  ctaTitle: string;
  ctaDescription: string;
  seo?: ProjectSeo;
};

export type ProjectsPageContent = {
  seo: {
    title: string;
    description: string;
    canonical: string;
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
  grid: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    projectBadge: string;
    contribution: string;
    details: string;
    contribute: string;
    externalNotice: string;
    source: string;
    facts: string;
    overview: string;
    allocation: string;
    returns: string;
    video: string;
    otherProjects: string;
    backToProjects: string;
    quantity: string;
    total: string;
    currency: string;
    share: string;
    linkCopied: string;
    selectProject: string;
    unitHint: string;
  };
  projects: LocalizedWaqfProject[];
};

// This site is the official source now: project pages reference in-site routes,
// and contributions temporarily go through the internal donate page.
const officialSources = {
  projectsIndex: '/projects',
  blessedTree: projectRoutes.blessedTree,
  blessedTreeContribution: '/donate',
  waqfShare: projectRoutes.waqfShare,
  goldWallet: projectRoutes.goldWallet,
  waqfGiftVideo: 'https://www.youtube.com/watch?v=2_r2fKz-hXs',
} as const;

const sharedProjects: Record<
  ProjectSlug,
  Pick<
    LocalizedWaqfProject,
    | 'id'
    | 'slug'
    | 'route'
    | 'image'
    | 'imageScale'
    | 'unitAmount'
    | 'officialContributionUrl'
    | 'officialSourceUrl'
  >
> = {
  'blessed-tree': {
    id: 'blessed-tree',
    slug: 'blessed-tree',
    route: projectRoutes.blessedTree,
    image: blessedTreeImage,
    // The tree artwork fills more of its 1080x1080 canvas than the other
    // products, so it is scaled down to match the gold portfolio visually.
    imageScale: 0.94,
    unitAmount: 100,
    officialContributionUrl: officialSources.blessedTreeContribution,
    officialSourceUrl: officialSources.blessedTree,
  },
  'waqf-share': {
    id: 'waqf-share',
    slug: 'waqf-share',
    route: projectRoutes.waqfShare,
    image: waqfShareImage,
    unitAmount: 100,
    officialContributionUrl: '/donate',
    officialSourceUrl: officialSources.waqfShare,
  },
  'gold-wallet': {
    id: 'gold-wallet',
    slug: 'gold-wallet',
    route: projectRoutes.goldWallet,
    image: goldPortfolioImage,
    unitAmount: 100,
    officialContributionUrl: '/donate',
    officialSourceUrl: officialSources.goldWallet,
  },
};

const arProjects: LocalizedWaqfProject[] = [
  {
    ...sharedProjects['blessed-tree'],
    title: 'مشروع الشجرة المباركة',
    category: 'مشروع وقفي',
    shortDescription:
      'مشروع وقفي استثماري دائم في تركيا يقوم على شراء واستثمار أشجار زيتون منتجة، ويرتبط ريعه ببرنامج رواد اليمن.',
    fullDescription: [
      'مشروع الشجرة المباركة مشروع وقفي استثماري في مزارع أشجار الزيتون المثمرة داخل تركيا، يهدف إلى بناء أصل وقفي منتج يظل ريعه مستمرًا.',
      'توضح الصفحة الرسمية أن لكل مساهمة مجموعة من عشرين شجرة زيتون منتجة، لا يقل عمرها عن عشر سنوات، وعلى مساحة 33 مترًا مربعًا للشجرة الواحدة.',
      'يرتبط عائد المشروع ببرنامج رواد اليمن، وهو برنامج تعليمي وتأهيلي نوعي للطلاب الموهوبين والمتفوقين من أبناء اليمن.',
    ],
    imageAlt: 'صورة رسمية لمشروع الشجرة المباركة',
    contributionValue: '100 دولار',
    facts: [
      { label: 'قيمة المساهمة', value: '100 دولار' },
      { label: 'الأصل الوقفي', value: '20 شجرة زيتون' },
      { label: 'عمر الأشجار', value: 'لا يقل عن 10 سنوات' },
      { label: 'مصرف الريع', value: 'برنامج رواد اليمن' },
    ],
    returnsTitle: 'أين يصرف عائد المشروع؟',
    returnsIntro: 'يصرف ريع الشجرة المباركة في دعم برنامج رواد اليمن بحسب النص الرسمي للمشروع.',
    returnUses: [
      'التعليم والتأهيل النوعي للطلاب الموهوبين والمتفوقين من أبناء اليمن.',
      'إعداد قادة المستقبل من خلال منح دراسية وبرامج قيادية ومهارية.',
      'رعاية مسار تعليمي يربط المعرفة بالمسؤولية والعمل لخدمة اليمن.',
    ],
    ctaTitle: 'ساهم في مشروع الشجرة المباركة',
    ctaDescription:
      'تتم المساهمة في هذا المشروع حالياً عبر صفحة المساهمة داخل الموقع.',
  },
  {
    ...sharedProjects['waqf-share'],
    title: 'السهم الوقفي',
    category: 'مشروع وقفي',
    shortDescription:
      'سهم وقفي مالي يتيح لليمنيين ومحبي اليمن المشاركة في إيجاد الوقف وتنمية موارده عبر محفظة استثمارية مفتوحة.',
    fullDescription: [
      'السهم الوقفي أسهم وقفية مالية تهدف إلى إشراك كل يمني ومحبي اليمن في العالم في إيجاد الوقف وتنمية أصوله.',
      'تستثمر أموال الأسهم في فرص ومشاريع استثمارية مدروسة، وفق منهجية تحافظ على أصول الوقف وتنمي موارده على المدى الطويل.',
      'تدار الاستثمارات بإشراف لجنة الاستثمار في الوقف، وبمشاركة خبرات يمنية موثوقة في مجالات الاستثمار المختلفة.',
    ],
    imageAlt: 'صورة رسمية لمشروع السهم الوقفي',
    contributionValue: '100 دولار',
    facts: [
      { label: 'قيمة السهم', value: '100 دولار' },
      { label: 'نوع المشروع', value: 'محفظة وقفية مفتوحة' },
      { label: 'الإشراف', value: 'لجنة الاستثمار' },
      { label: 'توزيع الريع', value: '70% برامج / 30% تنمية' },
    ],
    returnsTitle: 'أين تصرف عوائد المحفظة الوقفية؟',
    returnsIntro: 'توجه عوائد المحفظة الوقفية إلى برامج ومسارات الوقف وفق النسب المعلنة رسميًا.',
    returnUses: [
      'تعليم وتأهيل الطلاب الموهوبين والمتفوقين من أبناء اليمن.',
      'إعداد قادة المستقبل عبر منح دراسية وبرامج قيادية ومهارية.',
      'بناء القدرات وتطوير أداء المؤسسات الحكومية والأهلية.',
      'الشراكات والبرامج المساندة والتشبيك التخصصي.',
      'التوعية المجتمعية وإعادة صياغة الرأي العام والهوية الوطنية الجامعة.',
    ],
    allocations: [
      {
        percent: '70%',
        title: 'لبرامج الوقف ومساراته',
        description:
          'توجه النسبة الأكبر من الريع إلى التعليم والتأهيل وبناء القدرات والشراكات والتوعية المجتمعية.',
      },
      {
        percent: '30%',
        title: 'لتنمية المحفظة وتشغيلها',
        description:
          'تعود هذه النسبة إلى تشغيل المحفظة الاستثمارية وتنميتها والمحافظة على استدامة أصولها.',
      },
    ],
    video: {
      title: 'فيديو الهدية الوقفية',
      buttonLabel: 'مشاهدة فيديو الهدية الوقفية',
      videoId: '2_r2fKz-hXs',
      sourceUrl: officialSources.waqfGiftVideo,
    },
    ctaTitle: 'ساهم في السهم الوقفي',
    ctaDescription:
      'تتم المساهمة في السهم الوقفي حالياً عبر صفحة المساهمة داخل الموقع.',
  },
  {
    ...sharedProjects['gold-wallet'],
    title: 'محفظة الذهب الوقفية',
    category: 'مشروع وقفي',
    shortDescription:
      'محفظة وقفية تقوم على شراء الذهب والتداول فيه وفق أحكام الشريعة الإسلامية لتنمية موارد الوقف.',
    fullDescription: [
      'محفظة الذهب الوقفية مشروع استثماري يقوم على شراء الذهب والتداول فيه وفق أحكام الشريعة الإسلامية.',
      'توضح الصفحة الرسمية أن المشروع يدار عبر محل متخصص بتجارة الذهب في إسطنبول، بما يخدم تنمية أصول الوقف والمحافظة على قيمتها.',
      'يرتبط عائد المحفظة بأهداف الوقف وبرامجه ومساراته، دون إضافة أي وعود بأرباح مضمونة أو نسب عائد غير موثقة.',
    ],
    imageAlt: 'صورة رسمية لمحفظة الذهب الوقفية',
    contributionValue: '100 دولار',
    facts: [
      { label: 'قيمة المساهمة', value: '100 دولار' },
      { label: 'الأصل الاستثماري', value: 'الذهب' },
      { label: 'الموقع', value: 'إسطنبول' },
      { label: 'توزيع الريع', value: '70% برامج / 30% تنمية' },
    ],
    returnsTitle: 'أين تصرف عوائد المحفظة الوقفية؟',
    returnsIntro: 'توجه عوائد محفظة الذهب إلى أهداف الوقف وبرامجه ومساراته وفق النسب الرسمية.',
    returnUses: [
      'تعليم وتأهيل الطلاب الموهوبين والمتفوقين من أبناء اليمن.',
      'إعداد قادة المستقبل عبر منح دراسية وبرامج قيادية ومهارية.',
      'بناء القدرات وتطوير أداء المؤسسات الحكومية والأهلية.',
      'الشراكات والبرامج المساندة والتشبيك التخصصي.',
      'التوعية المجتمعية وثقافة النهضة والتعايش والسلام.',
    ],
    allocations: [
      {
        percent: '70%',
        title: 'لبرامج الوقف ومساراته',
        description:
          'توجه هذه النسبة إلى البرامج التعليمية والتأهيلية وبناء القدرات والشراكات والتوعية المجتمعية.',
      },
      {
        percent: '30%',
        title: 'لتنمية المحفظة وتشغيلها',
        description:
          'تعود هذه النسبة إلى تشغيل المحفظة الاستثمارية وتنميتها والحفاظ على استدامة مواردها.',
      },
    ],
    ctaTitle: 'ساهم في محفظة الذهب الوقفية',
    ctaDescription:
      'تتم المساهمة في محفظة الذهب حالياً عبر صفحة المساهمة داخل الموقع.',
  },
];

const enProjects: LocalizedWaqfProject[] = [
  {
    ...sharedProjects['blessed-tree'],
    title: 'Blessed Tree Project',
    category: 'Waqf Project',
    shortDescription:
      'A permanent waqf investment in productive olive trees in Türkiye, with returns directed to the Yemen Pioneers program.',
    fullDescription: [
      'The Blessed Tree Project is a waqf investment in productive olive farms in Türkiye, designed to create an enduring income-generating waqf asset.',
      'The official project page states that each contribution includes a group of twenty productive olive trees, each at least ten years old, with 33 square meters allocated per tree.',
      'The project returns support Yemen Pioneers, a qualitative education and training program for talented and outstanding Yemeni students.',
    ],
    imageAlt: 'Official image for the Blessed Tree Project',
    contributionValue: '100 USD',
    facts: [
      { label: 'Contribution value', value: '100 USD' },
      { label: 'Waqf asset', value: '20 olive trees' },
      { label: 'Tree age', value: 'At least 10 years' },
      { label: 'Return use', value: 'Yemen Pioneers' },
    ],
    returnsTitle: 'Where Are Project Returns Used?',
    returnsIntro: 'The Blessed Tree return is directed to the Yemen Pioneers program according to the official project text.',
    returnUses: [
      'Education and qualitative training for talented and outstanding Yemeni students.',
      'Preparing future leaders through scholarships and leadership and skills programs.',
      'Supporting an educational track that connects learning with responsibility and service to Yemen.',
    ],
    ctaTitle: 'Contribute to the Blessed Tree Project',
    ctaDescription:
      'Contribution to this project is currently arranged through the in-site contribute page.',
  },
  {
    ...sharedProjects['waqf-share'],
    title: 'Waqf Share',
    category: 'Waqf Project',
    shortDescription:
      'A financial waqf share that enables Yemenis and friends of Yemen to help establish and grow the waqf through an open investment portfolio.',
    fullDescription: [
      'The Waqf Share is a financial waqf share intended to involve every Yemeni and friend of Yemen worldwide in establishing the waqf and growing its assets.',
      'Share funds are invested in studied opportunities and projects through an approach that preserves waqf assets and develops resources over the long term.',
      'The investments are supervised by the waqf investment committee with trusted Yemeni expertise in different investment fields.',
    ],
    imageAlt: 'Official image for the Waqf Share project',
    contributionValue: '100 USD',
    facts: [
      { label: 'Share value', value: '100 USD' },
      { label: 'Project type', value: 'Open waqf portfolio' },
      { label: 'Supervision', value: 'Investment committee' },
      { label: 'Return allocation', value: '70% programs / 30% growth' },
    ],
    returnsTitle: 'Where Are Portfolio Returns Used?',
    returnsIntro: 'Portfolio returns are directed to the waqf programs and pathways according to the officially stated allocations.',
    returnUses: [
      'Educating and training talented and outstanding Yemeni students.',
      'Preparing future leaders through scholarships and leadership and skills programs.',
      'Building capacities and improving the performance of governmental and civil institutions.',
      'Partnerships, support programs, and specialized networking.',
      'Community awareness, reshaping public opinion, and strengthening the inclusive national identity.',
    ],
    allocations: [
      {
        percent: '70%',
        title: 'For waqf programs and pathways',
        description:
          'The larger share supports education, training, capacity building, partnerships, and community awareness.',
      },
      {
        percent: '30%',
        title: 'For portfolio operation and growth',
        description:
          'This share returns to operating and growing the investment portfolio and preserving the sustainability of its assets.',
      },
    ],
    video: {
      title: 'Waqf Gift Video',
      buttonLabel: 'Watch the Waqf Gift Video',
      videoId: '2_r2fKz-hXs',
      sourceUrl: officialSources.waqfGiftVideo,
    },
    ctaTitle: 'Contribute to the Waqf Share',
    ctaDescription:
      'Contribution to the Waqf Share is currently arranged through the in-site contribute page.',
  },
  {
    ...sharedProjects['gold-wallet'],
    title: 'Waqf Gold Portfolio',
    category: 'Waqf Project',
    shortDescription:
      'A waqf portfolio based on buying and trading gold in accordance with Islamic law to grow waqf resources.',
    fullDescription: [
      'The Waqf Gold Portfolio is an investment project based on buying and trading gold in accordance with Islamic law.',
      'The official page states that the project is managed through a specialized gold trading shop in Istanbul to serve waqf asset growth and value preservation.',
      'The portfolio returns are connected to the waqf goals, programs, and pathways, without adding any unsupported promises of profit or return rates.',
    ],
    imageAlt: 'Official image for the Waqf Gold Portfolio',
    contributionValue: '100 USD',
    facts: [
      { label: 'Contribution value', value: '100 USD' },
      { label: 'Investment asset', value: 'Gold' },
      { label: 'Location', value: 'Istanbul' },
      { label: 'Return allocation', value: '70% programs / 30% growth' },
    ],
    returnsTitle: 'Where Are Portfolio Returns Used?',
    returnsIntro: 'The Gold Portfolio returns are directed to the waqf goals, programs, and pathways according to the official allocations.',
    returnUses: [
      'Educating and training talented and outstanding Yemeni students.',
      'Preparing future leaders through scholarships and leadership and skills programs.',
      'Building capacities and improving the performance of governmental and civil institutions.',
      'Partnerships, support programs, and specialized networking.',
      'Community awareness and a culture of advancement, coexistence, and peace.',
    ],
    allocations: [
      {
        percent: '70%',
        title: 'For waqf programs and pathways',
        description:
          'This share supports education, training, capacity building, partnerships, and community awareness.',
      },
      {
        percent: '30%',
        title: 'For portfolio operation and growth',
        description:
          'This share returns to operating and growing the investment portfolio and preserving the sustainability of its resources.',
      },
    ],
    ctaTitle: 'Contribute to the Waqf Gold Portfolio',
    ctaDescription:
      'Contribution to the Gold Portfolio is currently arranged through the in-site contribute page.',
  },
];

const trProjects: LocalizedWaqfProject[] = [
  {
    ...sharedProjects['blessed-tree'],
    title: 'Bereketli Ağaç Projesi',
    category: 'Vakıf Projesi',
    shortDescription:
      'Türkiye’de verimli zeytin ağaçlarına dayanan kalıcı bir vakıf yatırımı; geliri Yemen Öncüleri programına yönlendirilir.',
    fullDescription: [
      'Bereketli Ağaç Projesi, Türkiye’de verimli zeytin bahçelerine yapılan bir vakıf yatırımıdır ve sürekli gelir üreten kalıcı bir vakıf varlığı oluşturmayı amaçlar.',
      'Resmi proje sayfasında her katkının, her biri en az on yaşında olan yirmi verimli zeytin ağacından oluştuğu ve her ağaç için 33 metrekare alan ayrıldığı belirtilir.',
      'Projenin geliri, Yemenli yetenekli ve başarılı öğrenciler için nitelikli eğitim ve yetiştirme programı olan Yemen Öncüleri programına bağlıdır.',
    ],
    imageAlt: 'Bereketli Ağaç Projesi resmi görseli',
    contributionValue: '100 USD',
    facts: [
      { label: 'Katkı değeri', value: '100 USD' },
      { label: 'Vakıf varlığı', value: '20 zeytin ağacı' },
      { label: 'Ağaç yaşı', value: 'En az 10 yıl' },
      { label: 'Gelir kullanımı', value: 'Yemen Öncüleri' },
    ],
    returnsTitle: 'Proje Geliri Nerede Kullanılır?',
    returnsIntro: 'Bereketli Ağaç geliri, resmi metne göre Yemen Öncüleri programını desteklemek için kullanılır.',
    returnUses: [
      'Yemenli yetenekli ve başarılı öğrencilerin eğitimi ve nitelikli yetiştirilmesi.',
      'Burslar, liderlik ve beceri programlarıyla geleceğin liderlerinin hazırlanması.',
      'Bilgiyi sorumluluk ve Yemen’e hizmet bilinciyle birleştiren eğitim yolunun desteklenmesi.',
    ],
    ctaTitle: 'Bereketli Ağaç Projesine Katkı Sun',
    ctaDescription:
      'Bu projeye katkı şu an site içindeki katkı sayfası üzerinden yapılır.',
  },
  {
    ...sharedProjects['waqf-share'],
    title: 'Vakıf Hissesi',
    category: 'Vakıf Projesi',
    shortDescription:
      'Yemenlilerin ve Yemen dostlarının açık bir yatırım portföyü üzerinden vakfın kurulmasına ve büyümesine katılmasını sağlayan mali vakıf hissesi.',
    fullDescription: [
      'Vakıf Hissesi, dünyadaki her Yemenli ve Yemen dostunun vakfın kurulmasına ve varlıklarının büyütülmesine katılmasını amaçlayan mali bir vakıf hissesidir.',
      'Hisse kaynakları, vakıf varlıklarını koruyan ve kaynakları uzun vadede geliştiren bir yaklaşımla çalışılmış yatırım fırsatları ve projelerde değerlendirilir.',
      'Yatırımlar, farklı yatırım alanlarında güvenilir Yemenli uzmanlıkların katkısıyla vakfın yatırım komitesi tarafından denetlenir.',
    ],
    imageAlt: 'Vakıf Hissesi projesi resmi görseli',
    contributionValue: '100 USD',
    facts: [
      { label: 'Hisse değeri', value: '100 USD' },
      { label: 'Proje türü', value: 'Açık vakıf portföyü' },
      { label: 'Denetim', value: 'Yatırım komitesi' },
      { label: 'Gelir dağılımı', value: '%70 program / %30 büyüme' },
    ],
    returnsTitle: 'Portföy Gelirleri Nerede Kullanılır?',
    returnsIntro: 'Portföy gelirleri, resmi olarak belirtilen oranlara göre vakıf programlarına ve yollarına yönlendirilir.',
    returnUses: [
      'Yemenli yetenekli ve başarılı öğrencilerin eğitimi ve yetiştirilmesi.',
      'Burslar, liderlik ve beceri programlarıyla geleceğin liderlerinin hazırlanması.',
      'Kamu ve sivil kurumların kapasitesinin ve performansının geliştirilmesi.',
      'Ortaklıklar, destek programları ve uzmanlık temelli ağ kurma.',
      'Toplumsal farkındalık, kamuoyunun yeniden inşası ve kapsayıcı ulusal kimliğin güçlendirilmesi.',
    ],
    allocations: [
      {
        percent: '70%',
        title: 'Vakıf programları ve yolları için',
        description:
          'Daha büyük pay eğitim, yetiştirme, kapasite geliştirme, ortaklıklar ve toplumsal farkındalığı destekler.',
      },
      {
        percent: '30%',
        title: 'Portföy işletimi ve büyümesi için',
        description:
          'Bu pay, yatırım portföyünün işletilmesine, büyütülmesine ve varlıklarının sürdürülebilirliğinin korunmasına ayrılır.',
      },
    ],
    video: {
      title: 'Vakıf Hediyesi Videosu',
      buttonLabel: 'Vakıf Hediyesi Videosunu İzle',
      videoId: '2_r2fKz-hXs',
      sourceUrl: officialSources.waqfGiftVideo,
    },
    ctaTitle: 'Vakıf Hissesine Katkı Sun',
    ctaDescription:
      'Vakıf Hissesine katkı şu an site içindeki katkı sayfası üzerinden yapılır.',
  },
  {
    ...sharedProjects['gold-wallet'],
    title: 'Vakıf Altın Portföyü',
    category: 'Vakıf Projesi',
    shortDescription:
      'Vakıf kaynaklarını büyütmek için İslami hükümlere uygun altın alım-satımına dayanan vakıf portföyü.',
    fullDescription: [
      'Vakıf Altın Portföyü, İslami hükümlere uygun şekilde altın satın alma ve altın ticaretine dayanan bir yatırım projesidir.',
      'Resmi sayfa, projenin vakıf varlıklarının büyümesine ve değerinin korunmasına hizmet etmek üzere İstanbul’da altın ticaretinde uzmanlaşmış bir mağaza üzerinden yönetildiğini belirtir.',
      'Portföy geliri vakfın hedefleri, programları ve yollarıyla ilişkilidir; belgelenmeyen kâr garantisi veya getiri oranı eklenmez.',
    ],
    imageAlt: 'Vakıf Altın Portföyü resmi görseli',
    contributionValue: '100 USD',
    facts: [
      { label: 'Katkı değeri', value: '100 USD' },
      { label: 'Yatırım varlığı', value: 'Altın' },
      { label: 'Konum', value: 'İstanbul' },
      { label: 'Gelir dağılımı', value: '%70 program / %30 büyüme' },
    ],
    returnsTitle: 'Portföy Gelirleri Nerede Kullanılır?',
    returnsIntro: 'Altın Portföyü gelirleri, resmi oranlara göre vakfın hedeflerine, programlarına ve yollarına yönlendirilir.',
    returnUses: [
      'Yemenli yetenekli ve başarılı öğrencilerin eğitimi ve yetiştirilmesi.',
      'Burslar, liderlik ve beceri programlarıyla geleceğin liderlerinin hazırlanması.',
      'Kamu ve sivil kurumların kapasitesinin ve performansının geliştirilmesi.',
      'Ortaklıklar, destek programları ve uzmanlık temelli ağ kurma.',
      'Toplumsal farkındalık; kalkınma, birlikte yaşama ve barış kültürü.',
    ],
    allocations: [
      {
        percent: '70%',
        title: 'Vakıf programları ve yolları için',
        description:
          'Bu pay eğitim, yetiştirme, kapasite geliştirme, ortaklıklar ve toplumsal farkındalığı destekler.',
      },
      {
        percent: '30%',
        title: 'Portföy işletimi ve büyümesi için',
        description:
          'Bu pay, yatırım portföyünün işletilmesine, büyütülmesine ve kaynaklarının sürdürülebilirliğinin korunmasına ayrılır.',
      },
    ],
    ctaTitle: 'Vakıf Altın Portföyüne Katkı Sun',
    ctaDescription:
      'Vakıf Altın Portföyüne katkı şu an site içindeki katkı sayfası üzerinden yapılır.',
  },
];

const pageContent: Record<Locale, Omit<ProjectsPageContent, 'projects'>> = {
  ar: {
    seo: {
      title: 'المشاريع الوقفية | وقف أويس القرني',
      description:
        'المشاريع الوقفية في وقف أويس القرني: الشجرة المباركة، السهم الوقفي، ومحفظة الذهب الوقفية، بعوائد موجهة لبرامج تنموية تخدم اليمن.',
      canonical: officialSources.projectsIndex,
    },
    hero: {
      title: 'المشاريع الوقفية',
      description:
        'استثمارات وقفية مستدامة لتنمية أصول الوقف وتحويل عوائدها إلى برامج تنموية تخدم اليمن.',
      image: waqfShareImage,
      imageAlt: 'المشاريع الوقفية',
    },
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'المشاريع الوقفية' },
    ],
    intro: {
      eyebrow: 'استثمارات مستدامة',
      title: 'أوعية وقفية تصنع أثرًا مستمرًا',
      paragraphs: [
        'تجمع مشاريع الوقف بين بناء الأصول الاستثمارية والمحافظة عليها، وتوجيه عوائدها إلى مسارات التعليم وبناء القدرات والشراكات والتوعية المجتمعية.',
        'تعرض هذه الصفحة المشاريع الوقفية الأساسية كما وردت في المصادر الرسمية، مع إبراز طبيعة كل مشروع ومصارف عوائده المعلنة.',
      ],
    },
    grid: {
      eyebrow: 'المشاريع الأساسية',
      title: 'اختر المشروع الذي تريد التعرف عليه',
      description:
        'تعرف على طبيعة كل مشروع وقيمة مساهمته ومجالات العائد المرتبطة به.',
    },
    labels: {
      projectBadge: 'مشروع وقفي',
      contribution: 'قيمة المساهمة',
      details: 'عرض التفاصيل',
      contribute: 'ساهم الآن',
      externalNotice: 'ينقلك إلى صفحة المساهمة داخل الموقع.',
      source: 'المصدر الرسمي',
      facts: 'معلومات المشروع',
      overview: 'تفاصيل المشروع',
      allocation: 'توزيع الريع',
      returns: 'مصارف العوائد',
      video: 'الفيديو الرسمي',
      otherProjects: 'مشاريع أخرى',
      backToProjects: 'العودة إلى المشاريع',
      quantity: 'الكمية',
      total: 'الإجمالي',
      currency: 'دولار',
      share: 'مشاركة المشروع',
      linkCopied: 'تم نسخ الرابط',
      selectProject: 'اختر المشروع',
      unitHint: 'لكل مساهمة',
    },
  },
  tr: {
    seo: {
      title: 'Vakıf Projeleri | Veysel Karani Vakfı',
      description:
        'Veysel Karani Vakfı projeleri: Bereketli Ağaç, Vakıf Hissesi ve Vakıf Altın Portföyü. Getirileri Yemen için kalkınma programlarına yönlendirilir.',
      canonical: officialSources.projectsIndex,
    },
    hero: {
      title: 'Vakıf Projeleri',
      description:
        'Vakıf varlıklarını büyüten ve gelirlerini Yemen’e hizmet eden kalkınma programlarına dönüştüren sürdürülebilir yatırımlar.',
      image: waqfShareImage,
      imageAlt: 'Vakıf Projeleri',
    },
    breadcrumbs: [
      { label: 'Ana Sayfa', href: '/' },
      { label: 'Vakıf Projeleri' },
    ],
    intro: {
      eyebrow: 'Sürdürülebilir yatırımlar',
      title: 'Sürekli etki üreten vakıf araçları',
      paragraphs: [
        'Vakıf projeleri, yatırım varlıklarını oluşturmayı ve korumayı; gelirlerini eğitim, kapasite geliştirme, ortaklıklar ve toplumsal farkındalık alanlarına yönlendirmeyi birleştirir.',
        'Bu sayfa, resmi kaynaklarda yer alan temel vakıf projelerini; proje yapısı, katkı değeri ve gelir kullanım alanlarıyla gösterir.',
      ],
    },
    grid: {
      eyebrow: 'Temel projeler',
      title: 'İncelemek istediğiniz projeyi seçin',
      description:
        'Her projenin niteliğini, belgelenmiş katkı değerini ve gelirinin bağlı olduğu kalkınma yollarını inceleyin.',
    },
    labels: {
      projectBadge: 'Vakıf Projesi',
      contribution: 'Katkı değeri',
      details: 'Detayları Gör',
      contribute: 'Katkı Sun',
      externalNotice: 'Sizi site içindeki katkı sayfasına yönlendirir.',
      source: 'Resmi kaynak',
      facts: 'Proje bilgileri',
      overview: 'Proje detayları',
      allocation: 'Gelir dağılımı',
      returns: 'Gelir kullanım alanları',
      video: 'Resmi video',
      otherProjects: 'Diğer projeler',
      backToProjects: 'Projelere dön',
      quantity: 'Adet',
      total: 'Toplam',
      currency: 'USD',
      share: 'Projeyi paylaş',
      linkCopied: 'Bağlantı kopyalandı',
      selectProject: 'Proje seçin',
      unitHint: 'katkı başına',
    },
  },
  en: {
    seo: {
      title: 'Waqf Projects | Veysel Karani Waqf',
      description:
        'Veysel Karani Waqf projects: Blessed Tree, Waqf Share, and Waqf Gold Portfolio, with returns directed to development programs serving Yemen.',
      canonical: officialSources.projectsIndex,
    },
    hero: {
      title: 'Waqf Projects',
      description:
        'Sustainable waqf investments that grow waqf assets and turn their returns into development programs serving Yemen.',
      image: waqfShareImage,
      imageAlt: 'Waqf Projects',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Waqf Projects' },
    ],
    intro: {
      eyebrow: 'Sustainable investments',
      title: 'Waqf vehicles that create lasting impact',
      paragraphs: [
        'The waqf projects combine building and preserving investment assets with directing returns to education, capacity building, partnerships, and community awareness.',
        'This page presents the core waqf projects from the official sources, highlighting each project, its contribution value, and its stated return uses.',
      ],
    },
    grid: {
      eyebrow: 'Core projects',
      title: 'Choose a project to explore',
      description:
        'Explore the nature of each project, its documented contribution value, and the development tracks connected to its returns.',
    },
    labels: {
      projectBadge: 'Waqf Project',
      contribution: 'Contribution value',
      details: 'View Details',
      contribute: 'Contribute Now',
      externalNotice: 'Takes you to the in-site contribute page.',
      source: 'Official source',
      facts: 'Project facts',
      overview: 'Project details',
      allocation: 'Return allocation',
      returns: 'Return uses',
      video: 'Official video',
      otherProjects: 'Other Projects',
      backToProjects: 'Back to Projects',
      quantity: 'Qty',
      total: 'Total',
      currency: 'USD',
      share: 'Share project',
      linkCopied: 'Link copied',
      selectProject: 'Select a project',
      unitHint: 'per contribution',
    },
  },
};

const projectsByLocale: Record<Locale, LocalizedWaqfProject[]> = {
  ar: arProjects,
  tr: trProjects,
  en: enProjects,
};

/** Projects from the CMS when present, otherwise the static list. */
function resolveProjects(locale: Locale): LocalizedWaqfProject[] {
  return cmsProjects(locale, projectsByLocale[locale]);
}

export function getProjectsContent(locale: Locale): ProjectsPageContent {
  return {
    ...cmsPageContent('projects-page', locale, pageContent[locale]),
    projects: resolveProjects(locale),
  };
}

function lastPathSegment(value: string | undefined) {
  const path = value?.trim().split(/[?#]/)[0].replace(/\/+$/, '') ?? '';
  if (!path) return '';
  const parts = path.split('/');
  return parts[parts.length - 1] ?? '';
}

function isSameProject(project: LocalizedWaqfProject, homeProject: Project) {
  const projectRouteSlug = lastPathSegment(project.route);
  const homeRouteSlug = lastPathSegment(homeProject.detailsUrl);

  return (
    homeProject.id === project.id ||
    homeProject.id === project.slug ||
    homeProject.id === projectRouteSlug ||
    homeRouteSlug === project.slug ||
    homeRouteSlug === projectRouteSlug
  );
}

export function applyHomeProjectImages(
  projects: LocalizedWaqfProject[],
  homeProjects: Project[],
): LocalizedWaqfProject[] {
  let changed = false;

  const merged = projects.map((project) => {
    const homeProject = homeProjects.find((item) => isSameProject(project, item));
    const image = homeProject?.image?.trim();
    if (!image || image === project.image) return project;

    changed = true;
    return { ...project, image };
  });

  return changed ? merged : projects;
}

export function getProject(locale: Locale, slug: string | undefined): LocalizedWaqfProject | undefined {
  if (!slug) return undefined;
  return resolveProjects(locale).find((project) => project.slug === slug);
}

export function getOtherProjects(locale: Locale, slug: ProjectSlug): LocalizedWaqfProject[] {
  return resolveProjects(locale).filter((project) => project.slug !== slug);
}

/**
 * The projects page exactly as it ships in this repo, ignoring the CMS.
 * Used by the dashboard's import tool to restore the original content.
 */
export function staticProjectsContent(locale: Locale): ProjectsPageContent {
  return { ...pageContent[locale], projects: projectsByLocale[locale] };
}
