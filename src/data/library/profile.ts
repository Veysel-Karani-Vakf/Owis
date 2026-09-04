import { cmsPageContent } from '@/cms/adapters';
import type { Locale } from '@/i18n/content';

/**
 * "العرض التعريفي" — the cinematic institutional presentation page inside the library.
 * Content distilled from the official 29-slide deck + the "Owais in Numbers" (Dec 2025) infographics.
 * The copy below is the built-in default; the dashboard's `library-profile` site_pages row is
 * layered over it per language (`getLibraryProfileContent`).
 */

export const libraryProfileRoute = '/library/profile';

type Stat = {
  value: number;
  /** Rendered after the animated number (e.g. "%", "M+"). */
  suffix?: string;
  /** Decimal places preserved while counting (51.67 → 2). */
  decimals?: number;
  label: string;
  sublabel?: string;
};

type Step = { title: string; text: string };

/** A photograph the dashboard can swap; `alt` is read by screen readers (empty = decorative). */
export type LibraryProfilePhoto = { src: string; alt?: string };

type TrackItem = Step & {
  /** Photograph on the track's station card; the built-in one is used when empty. */
  image?: string;
};

export type LibraryProfileContent = {
  meta: {
    title: string;
    shortTitle: string;
    seoDescription: string;
  };
  labels: {
    chapter: string;
    scrollHint: string;
    untilDate: string;
    openInfographics: string;
    infographicsNote: string;
    watchNumbers: string;
    flipHint: string;
    flipResponse: string;
    track: string;
    previousTrack: string;
    nextTrack: string;
    pauseReel: string;
    playReel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    slogan: string;
    intro: string;
    /** Full-viewport photograph behind the opening scene. */
    image: string;
  };
  pillars: {
    heading: string;
    subheading: string;
    items: Step[];
    outro: string;
  };
  problem: {
    heading: string;
    subheading: string;
    cards: Step[];
    note: string;
  };
  story: {
    heading: string;
    subheading: string;
    milestones: { year: string; title: string; text: string }[];
    experiencesHeading: string;
    experiencesSubheading: string;
    experiences: Step[];
    conclusion: string;
    /** Photo band under the timeline. */
    photos: LibraryProfilePhoto[];
  };
  identity: {
    heading: string;
    subheading: string;
    /** Portrait plate beside the definition (Owais by default). */
    image: string;
    why: Step;
    what: Step;
    vision: Step;
    mission: Step;
    values: { title: string; items: string[] };
    note: string;
  };
  cycle: {
    heading: string;
    subheading: string;
    stages: Step[];
    note: string;
    duality: {
      heading: string;
      direct: Step;
      waqf: Step;
      note: string;
    };
  };
  creation: {
    heading: string;
    subheading: string;
    share: {
      heading: string;
      what: Step;
      note: string;
    };
    /** The asset in pictures: the revenue apartments. */
    photos: LibraryProfilePhoto[];
    formsHeading: string;
    formsSubheading: string;
    forms: Step[];
    tree: {
      heading: string;
      subheading: string;
      /** The olive-tree artwork the card grows; a square image works best. */
      image: string;
      steps: Step[];
      note: string;
    };
  };
  investment: {
    heading: string;
    subheading: string;
    principles: Step[];
    stagesHeading: string;
    stages: Step[];
    governance: {
      heading: string;
      subheading: string;
      bodies: Step[];
      note: string;
    };
    yield: {
      heading: string;
      subheading: string;
      steps: Step[];
      note: string;
    };
  };
  tracks: {
    heading: string;
    subheading: string;
    items: TrackItem[];
  };
  pioneers: {
    heading: string;
    subheading: string;
    idea: Step;
    goal: Step;
    pillarsHeading: string;
    pillars: Step[];
    pathsHeading: string;
    paths: Step[];
    philosophyHeading: string;
    philosophy: Step[];
    note: string;
    /** Photo band under the chain. */
    photos: LibraryProfilePhoto[];
  };
  numbers: {
    eyebrow: string;
    heading: string;
    subheading: string;
    capital: { heading: string; stats: Stat[] };
    investment: {
      heading: string;
      lead: string;
      profit: Stat;
      activities: string[];
    };
    programsStat: Stat;
    beneficiariesStat: Stat;
    groups: { heading: string; caption?: string; stats: Stat[] }[];
    platformsNote: string;
    closing: string;
    /** The original infographic boards, opened in the lightbox. */
    boards: LibraryProfilePhoto[];
  };
  participate: {
    heading: string;
    subheading: string;
    ways: Step[];
    partners: {
      heading: string;
      subheading: string;
      items: Step[];
      note: string;
    };
  };
  cta: {
    title: string;
    text: string;
    slogan: string;
    donate: string;
    participate: string;
    backToLibrary: string;
    /** Dimmed photograph behind the closing plate. */
    image: string;
  };
};

/** Photographs shared by every language — the same event is the same picture. */
const photos = {
  hero: '/library/profile/photos/sphere-4.jpg',
  cta: '/library/profile/photos/inst-4.jpg',
  identity: '/library/yemeni-figures/owais-al-qarni.jpeg',
  tree: '/library/profile/blessed-tree-olive.jpg',
  story: ['/library/profile/photos/inst-1.jpg', '/library/profile/photos/sphere-1.jpg', '/library/profile/photos/inst-3.jpg'],
  creation: [
    '/library/profile/photos/apartments-1.jpg',
    '/library/profile/photos/apartments-3.jpg',
    '/library/profile/photos/apartments-4.jpg',
    '/library/profile/photos/apartments-2.jpg',
  ],
  pioneers: ['/library/profile/photos/sphere-2.jpg', '/library/profile/photos/sphere-3.jpg'],
  tracks: [
    '/library/profile/photos/pioneers-hero.jpeg',
    '/library/profile/photos/inst-4.jpg',
    '/library/profile/photos/inst-2.jpg',
    '/library/profile/photos/owaisya-platform.jpg',
  ],
  /** The five original "Owais in Numbers" infographic boards (Dec 2025 edition). */
  boards: [
    '/library/profile/numbers-waqf-creation.jpg',
    '/library/profile/numbers-track1.jpg',
    '/library/profile/numbers-tracks23.jpg',
    '/library/profile/numbers-track4.jpg',
    '/library/profile/numbers-beneficiaries.jpg',
  ],
} as const;

const withAlts = (sources: readonly string[], alts: string[]): LibraryProfilePhoto[] =>
  sources.map((src, index) => ({ src, alt: alts[index] ?? '' }));

const ar: LibraryProfileContent = {
  meta: {
    title: 'العرض التعريفي',
    shortTitle: 'العرض التعريفي',
    seoDescription:
      'رحلة تفاعلية في قصة وقف أويس القرني: من الفكرة إلى الأثر — التأسيس، الدورة الوقفية، التثمير، المصارف، وأويس في أرقام حتى ديسمبر 2025.',
  },
  labels: {
    chapter: 'الفصل',
    scrollHint: 'اسحب لتبدأ الرحلة',
    untilDate: 'حتى ديسمبر 2025',
    openInfographics: 'استعرض الإنفوجرافيك الأصلي',
    infographicsNote: 'خمس لوحات من إصدار «أويس في أرقام»',
    watchNumbers: 'أويس في أرقام',
    flipHint: 'اضغط لترى استجابة الوقف',
    flipResponse: 'استجابة الوقف',
    track: 'المصرف',
    previousTrack: 'المصرف السابق',
    nextTrack: 'المصرف التالي',
    pauseReel: 'إيقاف التنقل التلقائي',
    playReel: 'تشغيل التنقل التلقائي',
  },
  hero: {
    eyebrow: 'وقف أويس القرني',
    title: 'وقفٌ تشاركي لنهضة اليمن',
    subtitle: 'المشروع لم يعد فكرة؛ بل أصول وبرامج وشراكات تتنامى.',
    slogan: 'وقفنا معًا لنهضة اليمن',
    intro: 'هذه ليست صفحة تعريفية عادية، بل رحلة في قصة وقفٍ يبني الإنسان والمؤسسة والوعي.',
    image: photos.hero,
  },
  pillars: {
    heading: 'من الفكرة إلى الأثر',
    subheading: 'أربع ركائز تروي حجم ما تحقق واتجاه المرحلة القادمة',
    items: [
      { title: 'إيجاد الوقف', text: 'أصول وقفية موثقة تتكوّن من مساهمات اليمنيين ومحبي اليمن حول العالم.' },
      { title: 'التثمير', text: 'استثمارات متنوعة تُدار بمهنية لتنمية الأصل وحماية قيمته.' },
      { title: 'بناء الإنسان', text: 'رواد اليمن: قادة المستقبل يُختارون ويُؤهلون علميًا وقياديًا.' },
      { title: 'تمكين المؤسسات', text: 'برامج وشراكات ترفع كفاءة الجهات الحكومية والأهلية.' },
    ],
    outro: 'وتكشف الأرقام المحدثة حجم ما تحقق واتجاه المرحلة القادمة.',
  },
  problem: {
    heading: 'المشكلة التي نعالجها',
    subheading: 'اليمن يحتاج موردًا يبني الإنسان والمؤسسة والوعي',
    cards: [
      { title: 'الإنسان', text: 'إعداد الكفاءات والقيادات التي يحتاج إليها اليمن.' },
      { title: 'المؤسسات', text: 'رفع كفاءة الجهات الحكومية والأهلية وتعزيز قدرتها على الاستمرار.' },
      { title: 'الوعي', text: 'تعزيز الثقة والمشاركة والهوية الوطنية الجامعة.' },
    ],
    note: 'النهضة لا تُبنى بالمشروعات الموسمية وحدها؛ بل بتمويلٍ يملك ذاكرة واستمرارية.',
  },
  story: {
    heading: 'قصة التأسيس',
    subheading: 'بدأ السؤال في صنعاء، ونضج في إسطنبول',
    milestones: [
      { year: '2012', title: 'الجذور الفكرية', text: 'انطلاق مؤسسة اليمن السعيد لاستشراف المستقبل في صنعاء.' },
      { year: '2014', title: 'درس الاستدامة', text: 'توقفت التجربة مع الأحداث، وبقي السؤال: كيف نحمي الفكرة من تقلب التمويل؟' },
      { year: '27 مارس 2017', title: 'تأسيس الوقف', text: 'الترخيص في إسطنبول ضمن إطار قانوني ورقابي منظم.' },
      { year: '2018 – 2019', title: 'البناء والإشهار', text: 'إعداد اللوائح والأنظمة، ثم إطلاق البرامج والنماذج الأولى.' },
    ],
    experiencesHeading: 'خبرات صاغت النموذج',
    experiencesSubheading: 'أربع تجارب قادتنا إلى الوقف التنموي',
    experiences: [
      { title: 'استشراف المستقبل', text: 'الرؤية قبل البرامج' },
      { title: 'أزمات اليمن', text: 'الاستدامة تحمي الفكرة' },
      { title: 'العمل الأهلي', text: 'المنح وحدها لا تكفي' },
      { title: 'التجربة التركية', text: 'قانون وحوكمة واستثمار' },
    ],
    conclusion: 'الخلاصة: نحتاج وعاءً يحفظ المال، وينميه، ويوجه أثره إلى المستقبل.',
    photos: withAlts(photos.story, ['فعالية بناء قدرات في اليمن', 'قاعة تدريب إسفير في إسطنبول', 'ورشة تطوير مؤسسي']),
  },
  identity: {
    heading: 'الهوية والمعنى',
    subheading: 'اسم أويس القرني يجمع البرّ باليمن والأثر المستدام',
    image: photos.identity,
    why: {
      title: 'لماذا أويس؟',
      text: 'لما تحمله سيرته من البر والوفاء والإخلاص؛ فيتحول البر بالأم إلى برٍّ بأمنا اليمن، ولما يمتلكه التابعي الجليل أويس القرني من قيم ومكانة لدى المجتمع التركي.',
    },
    what: {
      title: 'ما هو الوقف؟',
      text: 'مؤسسة تنموية ذات طبيعة وقفية لإيجاد أكبر وقف نوعي تشاركي في تاريخ اليمن، يعود ريعه على برامج النهوض الحضاري ومساراته، ويسهم في إيجاده وتنميته كافة اليمنيين ومحبي اليمن في العالم.',
    },
    vision: { title: 'الرؤية', text: 'رواد الوقف التشاركي التخصصي في نهوض اليمن الحضاري.' },
    mission: { title: 'الرسالة', text: 'نصنع أوعية وقفية استثمارية مبتكرة، ونتكامل مع شركائنا في بناء القدرات.' },
    values: { title: 'القيم', items: ['المبادرة', 'الشراكة', 'المؤسسية', 'الشفافية', 'الاستدامة'] },
    note: 'الاستدامة هنا مالية ومؤسسية وتنموية ووطنية.',
  },
  cycle: {
    heading: 'الدورة الوقفية',
    subheading: 'ثلاث مراحل تربط المساهمة بالأثر',
    stages: [
      { title: 'إيجاد الوقف', text: 'مساهمات وأصول وحصص موثقة عبر المنتجات والقنوات المعتمدة للوقف.' },
      { title: 'التثمير', text: 'إدارة مهنية توازن بين العائد والمخاطر والسيولة وحماية الأصل.' },
      { title: 'المصارف', text: 'توجيه العائد القابل للتخصيص إلى المسارات التنموية المعتمدة لدى الوقف.' },
    ],
    note: 'وتحكم الدورة كلها وثيقة الوقف والحوكمة الرشيدة.',
    duality: {
      heading: 'وظيفتان متكاملتان',
      direct: {
        title: 'العطاء المباشر',
        text: 'يموّل احتياجًا أو نشاطًا محددًا، ويحقق أثره الآن بحسب الغرض والتمويل المتاح.',
      },
      waqf: {
        title: 'المساهمة الوقفية',
        text: 'تكوّن أصلًا أو تعززه، ثم يُدار ويُنمى، وتُوجَّه عوائده إلى المصارف المعتمدة.',
      },
      note: 'النموذجان متكاملان: أحدهما يستجيب للحاضر، والآخر يبني قدرة المستقبل.',
    },
  },
  creation: {
    heading: 'أولًا: إيجاد الوقف',
    subheading: 'إيجاد الوقف يحوّل المساهمة إلى أصل موثق',
    share: {
      heading: 'السهم الوقفي',
      what: {
        title: 'ما هو؟',
        text: 'وحدة مساهمة تُجمع مع غيرها لتكوين أصل وقفي مشترك يُحفظ ويُستثمر.',
      },
      note: 'يمكن أن تساهم عن نفسك أو والديك أو من تحب، عبر القنوات الرسمية للوقف.',
    },
    photos: withAlts(photos.creation, ['الشقق الوقفية في إسطنبول 1', 'الشقق الوقفية في إسطنبول 2', 'الشقق الوقفية في إسطنبول 3', 'الشقق الوقفية في إسطنبول 4']),
    formsHeading: 'صور إيجاد الوقف',
    formsSubheading: 'تتعدد المساهمة ويجمعها مقصد واحد: أصلٌ يبقى',
    forms: [
      { title: 'السهم الوقفي', text: 'وحدات مساهمة لتكوين أصل مشترك.' },
      { title: 'الشجرة المباركة', text: 'مشاركة مرتبطة بأصل زراعي وقفي.' },
      { title: 'وقف أصل أو حصة', text: 'عقار أو سهم أو حصة من مشروع.' },
      { title: 'محفظة الذهب', text: 'تنويع للأصول وفق سياسة الاستثمار.' },
      { title: 'الهدايا الوقفية', text: 'مساهمة عن النفس أو من تحب.' },
      { title: 'وقف حصص الشركات', text: 'حصة ملكية أو أصل منتج بشروط موثقة.' },
    ],
    tree: {
      heading: 'نموذج تطبيقي: الشجرة المباركة',
      subheading: 'من مساهمات صغيرة إلى أصل زراعي منتج',
      image: photos.tree,
      steps: [
        { title: 'الدراسة والمساهمة', text: 'اختيار الفرصة الزراعية وتجميع المساهمات المرتبطة بها.' },
        { title: 'الشراء والإدارة', text: 'تكوين الأصل وإدارته فنيًا وتشغيليًا بصورة مهنية.' },
        { title: 'العائد والمصرف', text: 'تمييز قيمة الأصل عن عائده، ثم توجيه العائد بعد تحققه وفق سياسة الوقف.' },
      ],
      note: 'القيمة ليست في الشجرة منفردة؛ بل في تحويل المساهمة إلى أصلٍ يُدار ويستمر.',
    },
  },
  investment: {
    heading: 'ثانيًا: التثمير',
    subheading: 'الاستثمار الوقفي أكثر انضباطًا لأن الأصل أمانة',
    principles: [
      { title: 'دراسة الجدوى', text: 'فهم السوق والتدفقات وفرص النمو قبل الالتزام.' },
      { title: 'إدارة المخاطر', text: 'تحديد المخاطر والحدود والسيولة وخطط المعالجة.' },
      { title: 'التنويع', text: 'توزيع الأصول لتقليل التركّز وتقلب العائد.' },
      { title: 'حماية الأصل', text: 'الموازنة بين النمو والاستقرار والقيمة الحقيقية للأصل.' },
    ],
    stagesHeading: 'القرار الاستثماري يمر بمراحل واضحة',
    stages: [
      { title: 'رصد الفرصة', text: 'فرز أولي يتسق مع سياسة الوقف.' },
      { title: 'دراسة الجدوى', text: 'تحليل السوق والتدفقات والبدائل.' },
      { title: 'تقييم المخاطر', text: 'قياس التركّز والسيولة والسيناريوهات.' },
      { title: 'الاعتماد', text: 'قرار موثق من الجهة صاحبة الصلاحية.' },
      { title: 'التنفيذ', text: 'تعاقد وتشغيل وفق الضوابط المعتمدة.' },
      { title: 'المتابعة والتقييم', text: 'تقارير أداء ومراجعة وتصحيح مستمر.' },
    ],
    governance: {
      heading: 'الفصل المؤسسي',
      subheading: 'الإدارة التنفيذية لا تنفرد بقرار الاستثمار',
      bodies: [
        { title: 'مجلس الأمناء', text: 'يعتمد السياسات والاتجاهات والحدود الكبرى.' },
        { title: 'لجنة الاستثمار', text: 'تدرس الفرص وتوصي وتتابع أداء المحافظ.' },
        { title: 'الذراع الاستثمارية', text: 'شركة أركان الدولية تنفذ الاستثمار مهنيًا وفق التفويض والحوكمة.' },
        { title: 'الإدارة التنفيذية', text: 'تنسق وتوثق ولا تحل محل قرار الاستثمار المتخصص.' },
        { title: 'الخبراء والمستشارون', text: 'يقدمون الرأي الفني والقانوني والشرعي.' },
        { title: 'المراجعة والرقابة', text: 'تتحقق من الالتزام والأداء والإفصاح.' },
      ],
      note: 'وضوح الصلاحيات يحمي القرار، ويمنع تضارب الأدوار، ويعزز الثقة.',
    },
    yield: {
      heading: 'العائد القابل للتخصيص',
      subheading: 'ليس كل إيراد قابلًا للصرف',
      steps: [
        { title: 'الإيراد الإجمالي', text: 'ما تولده الأصول من إيرادات أو مكاسب محققة.' },
        { title: 'التكاليف والمخصصات', text: 'مصروفات التشغيل والالتزامات والسيولة والاحتياطيات.' },
        { title: 'العائد القابل للتخصيص', text: 'المبلغ الذي يُعتمد لتغذية المصارف وتنمية الأصل.' },
      ],
      note: 'التوازن يحمي المصارف اليوم، ونمو الأصل غدًا، وقيمته الحقيقية على المدى الطويل.',
    },
  },
  tracks: {
    heading: 'ثالثًا: مصارف الوقف',
    subheading: 'أربعة مسارات تبني شروط النهوض',
    items: [
      { image: photos.tracks[0], title: 'قيادات المستقبل', text: 'تأهيل الموهوبين والمتميزين من أبناء اليمن وإعدادهم قادةً للمستقبل.' },
      { image: photos.tracks[1], title: 'القيادات الحالية', text: 'بناء قدرات القيادات والكوادر الإدارية والمجتمعية.' },
      { image: photos.tracks[2], title: 'تطوير المؤسسات', text: 'رفع كفاءة الجهات الحكومية والأهلية واستدامتها.' },
      { image: photos.tracks[3], title: 'الوعي والهوية', text: 'تعزيز المشاركة والتعايش والهوية الوطنية الجامعة.' },
    ],
  },
  pioneers: {
    heading: 'برنامج رواد اليمن',
    subheading: 'رواد اليمن يربط القدرات والمواهب باحتياجات اليمن المستقبلية',
    idea: {
      title: 'الفكرة',
      text: 'برنامج تطبيقي للمصرف الأول، بدأ عام 2019 لتأهيل الأوائل والموهوبين ضمن مسار قيادي ممتد.',
    },
    goal: {
      title: 'الغاية',
      text: 'تكوين رائد متفوق في تخصصه، نامٍ في شخصيته وقيادته، واعٍ بمسؤوليته تجاه اليمن.',
    },
    pillarsHeading: 'أربعة مرتكزات تحكم اختيار الرائد وتأهيله',
    pillars: [
      { title: 'احتياجات المستقبل', text: 'توجيه التخصصات نحو المجالات التي يحتاج إليها اليمن.' },
      { title: 'الجدارة والفرص', text: 'معايير معلنة وتكافؤ في الوصول والاختيار.' },
      { title: 'التأهيل الأكاديمي', text: 'دراسة نوعية ومسار متابعة يدعم التفوق العلمي.' },
      { title: 'المرافقة القيادية', text: 'مهارات وقيم وتجارب تطبيقية تصنع رائدًا مسؤولًا.' },
    ],
    pathsHeading: 'الرائد يُبنى عبر خمسة مسارات متوازية',
    paths: [
      { title: 'الشخصي والقيمي', text: 'وعي الذات والانضباط والقيم والسلوك المسؤول.' },
      { title: 'الأكاديمي', text: 'تفوق تخصصي وتعلم مستمر وإنتاج معرفي.' },
      { title: 'القيادي', text: 'مبادرة وقرار وتواصل وعمل ضمن فريق.' },
      { title: 'المهاري', text: 'القدرة على اكتساب المهارات اللازمة والنوعية.' },
      { title: 'المسؤولية والهوية', text: 'انتماء جامع يحتضن التنوع ويحوّل المعرفة إلى التزام.' },
    ],
    philosophyHeading: 'من التخرج إلى الارتقاء: تبدأ المسؤولية بعد الشهادة',
    philosophy: [
      { title: 'العلم', text: 'إتقان التخصص' },
      { title: 'القيادة', text: 'تحويل المعرفة إلى مبادرة' },
      { title: 'المجتمع', text: 'خدمة الناس وبناء الحلول' },
      { title: 'الوطن', text: 'مسؤولية تتجاوز النجاح الفردي' },
    ],
    note: 'لا تنتهي العلاقة بالتخرج؛ بل تنتقل إلى شبكة عطاء وتأثير ومسؤولية أكبر.',
    photos: withAlts(photos.pioneers, ['رواد اليمن في قاعة تدريب إسفير 1', 'رواد اليمن في قاعة تدريب إسفير 2']),
  },
  numbers: {
    eyebrow: 'ثمرة المسيرة · حتى ديسمبر 2025',
    heading: 'أويس في أرقام',
    subheading: 'أصول أُنشئت، واستثمارات نُمّيت، وروادٌ أُهّلوا، ومؤسسات دُعمت.',
    capital: {
      heading: 'إيجاد الوقف',
      stats: [
        { value: 17488, label: 'سهمًا وقفيًا', sublabel: 'إجمالي الأسهم الوقفية' },
        { value: 9403, label: 'مساهمًا ومساهمة', sublabel: 'أسهموا في إيجاد الوقف' },
        { value: 22, label: 'دولة حول العالم', sublabel: 'يمتد منها المساهمون' },
      ],
    },
    investment: {
      heading: 'تثمير الوقف',
      lead: 'تم تثمير الأموال الوقفية في 6 أنشطة تجارية',
      profit: { value: 51.67, suffix: '%', decimals: 2, label: 'أرباح رأس المال', sublabel: 'ارتفاع قيمة أصول الوقف' },
      activities: ['الشجرة المباركة', 'الشقق الوقفية', 'الذهب', 'الأراضي الزراعية', 'إدارة أملاك وخدمات عقارية', 'الصفقات قصيرة المدى'],
    },
    programsStat: { value: 40, suffix: '', decimals: 0, label: 'برنامجًا تنمويًا', sublabel: 'ضمن المسارات الوقفية' },
    beneficiariesStat: { value: 1556, suffix: '', decimals: 0, label: 'إجمالي المستفيدين', sublabel: 'من المسارات الوقفية' },
    groups: [
      {
        heading: 'المسار الأول · رواد اليمن',
        caption: 'الاهتمام بالموهوبين والمتميزين وإعدادهم قادة للمستقبل',
        stats: [
          { value: 86, label: 'منحة تعليمية' },
          { value: 33, label: 'بحثًا علميًا محكمًا' },
          { value: 7, label: 'مشاركات دولية', sublabel: 'باكستان، اليابان، الهند، قطر، مصر، كازاخستان، الصين' },
          { value: 6, label: 'ملتقيات تدريبية' },
          { value: 5, label: 'مشاركات تكنوفست' },
          { value: 2, label: 'مؤتمران علميان' },
          { value: 1, label: 'براءة اختراع' },
        ],
      },
      {
        heading: 'المسار الثاني · القيادات',
        caption: 'تطوير القيادات الإدارية والمجتمعية ورفع قدراتهم المهنية والمهارية',
        stats: [
          { value: 30, label: 'برنامجًا في تطوير القيادات المجتمعية الشابة' },
          { value: 3, label: 'محافظات يمنية' },
          { value: 6, label: 'دول حول العالم' },
        ],
      },
      {
        heading: 'المسار الثالث · المؤسسات',
        caption: 'تطوير أداء المؤسسات الحكومية والأهلية',
        stats: [
          { value: 140, label: 'منظمة مجتمع مدني', sublabel: 'برنامج رفع الكفاءات' },
          { value: 13, label: 'محافظة يمنية' },
          { value: 9, label: 'منظمات في ملتقى أدلة ومعايير إسفير' },
        ],
      },
      {
        heading: 'المسار الرابع · الوعي المجتمعي',
        caption: 'أويسيا · أويس بودكاست · ديوانية أويس',
        stats: [
          { value: 5, suffix: 'M+', label: 'وصول لحسابات المنصة' },
          { value: 1, suffix: 'M+', label: 'مشاهدة للمواد على الشبكات' },
          { value: 2693, label: 'متطوعًا ومتطوعة', sublabel: 'وحدة التطوع' },
          { value: 148, label: 'مبادرة مشاركة', sublabel: 'من الأقاليم اليمنية الستة' },
          { value: 5, label: 'مبادرات فائزة', sublabel: 'جائزة أويس للأعمال التطوعية' },
        ],
      },
    ],
    platformsNote: 'تجاوزت مشاهدات مواد المنصة المليون، وتخطى الوصول لحساباتها خمسة ملايين.',
    closing:
      'إن ما قُدِّم ويُقدَّم حتى اليوم من برامج ومبادرات، ليس سوى نماذج لما يمكن أن تصنعه مساهماتكم الوقفية من أثرٍ ممتد وعوائد مستدامة.',
    boards: withAlts(photos.boards, ['لوحة إيجاد الوقف', 'لوحة المسار الأول: رواد اليمن', 'لوحة المسارين الثاني والثالث', 'لوحة المسار الرابع: الوعي المجتمعي', 'لوحة المستفيدين']),
  },
  participate: {
    heading: 'آليات المشاركة',
    subheading: 'المشاركة أوسع من تحويل مالي',
    ways: [
      { title: 'ساهم في منتج وقفي', text: 'اختر سهمًا أو شجرة أو أصلًا عبر القنوات الرسمية.' },
      { title: 'أهدِ وقفًا', text: 'عن نفسك أو والديك أو من تحب.' },
      { title: 'أوقف أصلًا أو حصة', text: 'عقارًا أو سهمًا أو حصة ملكية موثقة.' },
      { title: 'نظّم مساهمة جماعية', text: 'أسرة أو أصدقاء أو مجتمع مهني يبنون أصلًا مشتركًا.' },
      { title: 'انشر الفكرة', text: 'عرّف الناس بالنموذج وساعد في الوصول إلى شركاء.' },
      { title: 'قدّم خبرتك', text: 'استشارة أو شبكة علاقات أو وقت تطوعي منضبط.' },
    ],
    partners: {
      heading: 'شراكات الاستدامة',
      subheading: 'قطاع الأعمال والشركاء يضاعفون القدرة على الاستدامة',
      items: [
        { title: 'أصول وخبرة', text: 'وقف حصص أو أصول، وتقديم خبرة فنية واستثمارية.' },
        { title: 'تمويل البرامج', text: 'رعاية مسارات محددة مع فصل التمويل عن أصل الوقف.' },
        { title: 'معرفة وشبكات', text: 'جامعات ومؤسسات وخبراء يوسعون الجودة والوصول.' },
      ],
      note: 'الشراكة الموثوقة توضّح المال، والدور، والاستخدام، والنتيجة المتوقعة.',
    },
  },
  cta: {
    title: 'كن شريكًا في أصلٍ يبقى وأثرٍ يتجدد',
    text: 'ساهم عن نفسك أو والديك أو من تحب، وشارك في بناء مورد مستدام للإنسان والمؤسسات ومستقبل اليمن.',
    slogan: 'وقفنا معًا لنهضة اليمن',
    donate: 'ساهم الآن في الوقف',
    participate: 'اكتشف طرق المشاركة',
    backToLibrary: 'العودة إلى المكتبة',
    image: photos.cta,
  },
};

const en: LibraryProfileContent = {
  meta: {
    title: 'The Waqf Story',
    shortTitle: 'Waqf Story',
    seoDescription:
      'An interactive journey through the story of the Veysel Karani Waqf: from idea to impact — the founding, the waqf cycle, investment, the four tracks, and Owais in Numbers up to December 2025.',
  },
  labels: {
    chapter: 'Chapter',
    scrollHint: 'Scroll to begin the journey',
    untilDate: 'Up to December 2025',
    openInfographics: 'View the original infographics',
    infographicsNote: 'Five boards from the "Owais in Numbers" edition',
    watchNumbers: 'Owais in Numbers',
    flipHint: "Tap to see the waqf's response",
    flipResponse: "The waqf's response",
    track: 'Track',
    previousTrack: 'Previous track',
    nextTrack: 'Next track',
    pauseReel: 'Pause auto-advance',
    playReel: 'Resume auto-advance',
  },
  hero: {
    eyebrow: 'Veysel Karani Waqf',
    title: 'A Participatory Endowment for Yemen’s Renaissance',
    subtitle: 'No longer an idea — growing assets, programs, and partnerships.',
    slogan: 'Together, an endowment for Yemen’s renaissance',
    intro: 'This is not an ordinary about page — it is a journey through a waqf that builds people, institutions, and awareness.',
    image: photos.hero,
  },
  pillars: {
    heading: 'From Idea to Impact',
    subheading: 'Four pillars tell the scale of what has been achieved and where the next phase is heading',
    items: [
      { title: 'Creating the Waqf', text: 'Documented endowment assets formed by contributions of Yemenis and friends of Yemen worldwide.' },
      { title: 'Investment', text: 'Diversified investments managed professionally to grow the asset and protect its value.' },
      { title: 'Building People', text: 'Yemen Pioneers: future leaders selected and prepared academically and in leadership.' },
      { title: 'Empowering Institutions', text: 'Programs and partnerships raising the capacity of public and civil institutions.' },
    ],
    outro: 'The updated numbers reveal the scale of what has been achieved and the direction of the next phase.',
  },
  problem: {
    heading: 'The Problem We Address',
    subheading: 'Yemen needs a resource that builds people, institutions, and awareness',
    cards: [
      { title: 'People', text: 'Preparing the competencies and leaderships Yemen needs.' },
      { title: 'Institutions', text: 'Raising the capacity of public and civil bodies and their ability to endure.' },
      { title: 'Awareness', text: 'Strengthening trust, participation, and an inclusive national identity.' },
    ],
    note: 'A renaissance is not built on seasonal projects alone, but on funding with memory and continuity.',
  },
  story: {
    heading: 'The Founding Story',
    subheading: 'The question began in Sana’a and matured in Istanbul',
    milestones: [
      { year: '2012', title: 'Intellectual Roots', text: 'Launch of the Happy Yemen Foundation for foresight studies in Sana’a.' },
      { year: '2014', title: 'The Sustainability Lesson', text: 'The experience halted with the events, and one question remained: how do we protect the idea from funding volatility?' },
      { year: 'March 27, 2017', title: 'Founding the Waqf', text: 'Licensed in Istanbul within an organized legal and regulatory framework.' },
      { year: '2018 – 2019', title: 'Building & Launch', text: 'Preparing bylaws and systems, then launching the first programs and models.' },
    ],
    experiencesHeading: 'Experiences That Shaped the Model',
    experiencesSubheading: 'Four experiences led us to the development waqf',
    experiences: [
      { title: 'Foresight', text: 'Vision before programs' },
      { title: 'Yemen’s Crises', text: 'Sustainability protects the idea' },
      { title: 'Civil Work', text: 'Grants alone are not enough' },
      { title: 'The Turkish Experience', text: 'Law, governance, and investment' },
    ],
    conclusion: 'The conclusion: we need a vessel that preserves wealth, grows it, and directs its impact toward the future.',
    photos: withAlts(photos.story, ['A capacity-building event in Yemen', 'A Sphere training room in Istanbul', 'An institutional development workshop']),
  },
  identity: {
    heading: 'Identity & Meaning',
    subheading: 'The name Owais al-Qarani unites devotion to Yemen with lasting impact',
    image: photos.identity,
    why: {
      title: 'Why Owais?',
      text: 'For the devotion, loyalty, and sincerity of his life — devotion to one’s mother becomes devotion to our mother Yemen — and for the values and standing the revered Owais al-Qarani holds in Turkish society.',
    },
    what: {
      title: 'What is the Waqf?',
      text: 'A development institution of endowment nature, creating the largest participatory waqf in Yemen’s history. Its returns fund the programs of civilizational renaissance, built and grown by Yemenis and friends of Yemen worldwide.',
    },
    vision: { title: 'Vision', text: 'Pioneers of the specialized participatory waqf in Yemen’s civilizational rise.' },
    mission: { title: 'Mission', text: 'We craft innovative endowment investment vehicles and integrate with our partners in building capacities.' },
    values: { title: 'Values', items: ['Initiative', 'Partnership', 'Institutionalism', 'Transparency', 'Sustainability'] },
    note: 'Sustainability here is financial, institutional, developmental, and national.',
  },
  cycle: {
    heading: 'The Waqf Cycle',
    subheading: 'Three stages connect contribution to impact',
    stages: [
      { title: 'Creating the Waqf', text: 'Contributions, assets, and documented shares through the waqf’s approved products and channels.' },
      { title: 'Investment', text: 'Professional management balancing return, risk, liquidity, and asset protection.' },
      { title: 'Disbursement Tracks', text: 'Directing the allocatable return to the waqf’s approved development tracks.' },
    ],
    note: 'The whole cycle is governed by the waqf charter and sound governance.',
    duality: {
      heading: 'Two Complementary Functions',
      direct: {
        title: 'Direct Giving',
        text: 'Funds a specific need or activity, delivering its impact now according to purpose and available funding.',
      },
      waqf: {
        title: 'Waqf Contribution',
        text: 'Forms or strengthens an asset that is then managed and grown, with returns directed to approved tracks.',
      },
      note: 'The two models complete each other: one answers the present, the other builds the capacity of the future.',
    },
  },
  creation: {
    heading: 'First: Creating the Waqf',
    subheading: 'Creation turns a contribution into a documented asset',
    share: {
      heading: 'The Waqf Share',
      what: {
        title: 'What is it?',
        text: 'A contribution unit pooled with others to form a shared endowment asset that is preserved and invested.',
      },
      note: 'You can contribute for yourself, your parents, or someone you love — through the waqf’s official channels.',
    },
    photos: withAlts(photos.creation, ['The waqf apartments in Istanbul 1', 'The waqf apartments in Istanbul 2', 'The waqf apartments in Istanbul 3', 'The waqf apartments in Istanbul 4']),
    formsHeading: 'Forms of Creating the Waqf',
    formsSubheading: 'Contributions vary, united by one purpose: an asset that endures',
    forms: [
      { title: 'Waqf Share', text: 'Contribution units forming a shared asset.' },
      { title: 'The Blessed Tree', text: 'Participation tied to an agricultural waqf asset.' },
      { title: 'Endow an Asset or Stake', text: 'Real estate, a share, or a stake in a venture.' },
      { title: 'Gold Portfolio', text: 'Asset diversification per the investment policy.' },
      { title: 'Waqf Gifts', text: 'A contribution for yourself or someone you love.' },
      { title: 'Company Stakes', text: 'An ownership stake or productive asset under documented terms.' },
    ],
    tree: {
      heading: 'A Working Model: The Blessed Tree',
      subheading: 'From small contributions to a productive agricultural asset',
      image: photos.tree,
      steps: [
        { title: 'Study & Contribution', text: 'Selecting the agricultural opportunity and pooling its contributions.' },
        { title: 'Purchase & Management', text: 'Forming the asset and managing it technically and operationally.' },
        { title: 'Return & Track', text: 'Separating asset value from its return, then directing realized returns per waqf policy.' },
      ],
      note: 'The value is not in a single tree, but in turning a contribution into a managed, enduring asset.',
    },
  },
  investment: {
    heading: 'Second: Investment',
    subheading: 'Waqf investing is more disciplined, because the asset is a trust',
    principles: [
      { title: 'Feasibility', text: 'Understanding markets, flows, and growth opportunities before committing.' },
      { title: 'Risk Management', text: 'Defining risks, limits, liquidity, and remediation plans.' },
      { title: 'Diversification', text: 'Distributing assets to reduce concentration and return volatility.' },
      { title: 'Asset Protection', text: 'Balancing growth, stability, and the asset’s real value.' },
    ],
    stagesHeading: 'The investment decision passes through clear stages',
    stages: [
      { title: 'Spotting the Opportunity', text: 'Initial screening aligned with waqf policy.' },
      { title: 'Feasibility Study', text: 'Analyzing the market, flows, and alternatives.' },
      { title: 'Risk Assessment', text: 'Measuring concentration, liquidity, and scenarios.' },
      { title: 'Approval', text: 'A documented decision by the mandated authority.' },
      { title: 'Execution', text: 'Contracting and operating under approved controls.' },
      { title: 'Monitoring & Evaluation', text: 'Performance reports, review, and continuous correction.' },
    ],
    governance: {
      heading: 'Institutional Separation',
      subheading: 'The executive management never decides investments alone',
      bodies: [
        { title: 'Board of Trustees', text: 'Approves policies, directions, and major limits.' },
        { title: 'Investment Committee', text: 'Studies opportunities, recommends, and monitors portfolio performance.' },
        { title: 'Investment Arm', text: 'Arkan International executes investments professionally under mandate and governance.' },
        { title: 'Executive Management', text: 'Coordinates and documents; never replaces the specialized investment decision.' },
        { title: 'Experts & Advisors', text: 'Provide technical, legal, and Sharia opinion.' },
        { title: 'Audit & Oversight', text: 'Verifies compliance, performance, and disclosure.' },
      ],
      note: 'Clear mandates protect the decision, prevent role conflicts, and build trust.',
    },
    yield: {
      heading: 'The Allocatable Return',
      subheading: 'Not every revenue can be spent',
      steps: [
        { title: 'Gross Revenue', text: 'What the assets generate in realized income or gains.' },
        { title: 'Costs & Provisions', text: 'Operating expenses, obligations, liquidity, and reserves.' },
        { title: 'Allocatable Return', text: 'The amount approved to feed the tracks and grow the asset.' },
      ],
      note: 'Balance protects today’s tracks, tomorrow’s asset growth, and its real long-term value.',
    },
  },
  tracks: {
    heading: 'Third: The Waqf Tracks',
    subheading: 'Four tracks build the conditions of renaissance',
    items: [
      { image: photos.tracks[0], title: 'Future Leaders', text: 'Preparing gifted and outstanding Yemenis as leaders for the future.' },
      { image: photos.tracks[1], title: 'Current Leaders', text: 'Building the capacity of existing administrative and community leaderships.' },
      { image: photos.tracks[2], title: 'Institutional Development', text: 'Raising the capacity and sustainability of public and civil bodies.' },
      { image: photos.tracks[3], title: 'Awareness & Identity', text: 'Strengthening participation, coexistence, and an inclusive national identity.' },
    ],
  },
  pioneers: {
    heading: 'The Yemen Pioneers Program',
    subheading: 'Yemen Pioneers connects talents and capabilities to Yemen’s future needs',
    idea: {
      title: 'The Idea',
      text: 'The first track’s flagship program, launched in 2019 to prepare top achievers and the gifted within an extended leadership path.',
    },
    goal: {
      title: 'The Goal',
      text: 'Forming a pioneer excelling in their field, growing in character and leadership, aware of their responsibility toward Yemen.',
    },
    pillarsHeading: 'Four pillars govern selecting and preparing the pioneer',
    pillars: [
      { title: 'Future Needs', text: 'Directing specializations toward the fields Yemen needs.' },
      { title: 'Merit & Opportunity', text: 'Published criteria and equal access in selection.' },
      { title: 'Academic Preparation', text: 'Quality study and a follow-up path supporting excellence.' },
      { title: 'Leadership Companionship', text: 'Skills, values, and applied experiences shaping a responsible pioneer.' },
    ],
    pathsHeading: 'The pioneer is built along five parallel paths',
    paths: [
      { title: 'Personal & Values', text: 'Self-awareness, discipline, values, and responsible conduct.' },
      { title: 'Academic', text: 'Specialized excellence, continuous learning, and knowledge production.' },
      { title: 'Leadership', text: 'Initiative, decision-making, communication, and teamwork.' },
      { title: 'Skills', text: 'The capacity to acquire essential, high-quality skills.' },
      { title: 'Responsibility & Identity', text: 'An inclusive belonging that embraces diversity and turns knowledge into commitment.' },
    ],
    philosophyHeading: 'From graduation to ascent: responsibility begins after the degree',
    philosophy: [
      { title: 'Knowledge', text: 'Mastering the specialization' },
      { title: 'Leadership', text: 'Turning knowledge into initiative' },
      { title: 'Community', text: 'Serving people and building solutions' },
      { title: 'Nation', text: 'A responsibility beyond individual success' },
    ],
    note: 'The relationship does not end at graduation; it becomes a network of giving, influence, and greater responsibility.',
    photos: withAlts(photos.pioneers, ['Yemen Pioneers in a Sphere training room 1', 'Yemen Pioneers in a Sphere training room 2']),
  },
  numbers: {
    eyebrow: 'The Journey’s Fruit · Up to December 2025',
    heading: 'Owais in Numbers',
    subheading: 'Assets created, investments grown, pioneers prepared, institutions supported.',
    capital: {
      heading: 'Creating the Waqf',
      stats: [
        { value: 17488, label: 'waqf shares', sublabel: 'Total endowment shares' },
        { value: 9403, label: 'contributors', sublabel: 'Helped create the waqf' },
        { value: 22, label: 'countries', sublabel: 'Home to the contributors' },
      ],
    },
    investment: {
      heading: 'Investing the Waqf',
      lead: 'Endowment funds are invested across 6 commercial activities',
      profit: { value: 51.67, suffix: '%', decimals: 2, label: 'capital gains', sublabel: 'Growth in waqf asset value' },
      activities: ['The Blessed Tree', 'Waqf Apartments', 'Gold', 'Agricultural Land', 'Property Management & Real Estate', 'Short-Term Deals'],
    },
    programsStat: { value: 40, suffix: '', decimals: 0, label: 'development programs', sublabel: 'Across the waqf tracks' },
    beneficiariesStat: { value: 1556, suffix: '', decimals: 0, label: 'total beneficiaries', sublabel: 'Across the waqf tracks' },
    groups: [
      {
        heading: 'Track One · Yemen Pioneers',
        caption: 'Caring for the gifted and outstanding, preparing them as future leaders',
        stats: [
          { value: 86, label: 'scholarships' },
          { value: 33, label: 'peer-reviewed papers' },
          { value: 7, label: 'international participations', sublabel: 'Pakistan, Japan, India, Qatar, Egypt, Kazakhstan, China' },
          { value: 6, label: 'training forums' },
          { value: 5, label: 'Teknofest entries' },
          { value: 2, label: 'scientific conferences' },
          { value: 1, label: 'patent' },
        ],
      },
      {
        heading: 'Track Two · Leaderships',
        caption: 'Developing administrative and community leaderships',
        stats: [
          { value: 30, label: 'young community leadership programs' },
          { value: 3, label: 'Yemeni governorates' },
          { value: 6, label: 'countries worldwide' },
        ],
      },
      {
        heading: 'Track Three · Institutions',
        caption: 'Developing the performance of public and civil institutions',
        stats: [
          { value: 140, label: 'civil society organizations', sublabel: 'Capacity-building program' },
          { value: 13, label: 'Yemeni governorates' },
          { value: 9, label: 'organizations in the Sphere standards forum' },
        ],
      },
      {
        heading: 'Track Four · Community Awareness',
        caption: 'Owaisya · Owais Podcast · Owais Diwaniya',
        stats: [
          { value: 5, suffix: 'M+', label: 'reach across platform accounts' },
          { value: 1, suffix: 'M+', label: 'views of platform content' },
          { value: 2693, label: 'volunteers', sublabel: 'Volunteering Unit' },
          { value: 148, label: 'participating initiatives', sublabel: 'From Yemen’s six regions' },
          { value: 5, label: 'winning initiatives', sublabel: 'Owais Award for Voluntary Work' },
        ],
      },
    ],
    platformsNote: 'Platform content passed one million views, and account reach exceeded five million.',
    closing:
      'What has been delivered so far — programs and initiatives — is only a sample of the extended impact and sustainable returns your waqf contributions can create.',
    boards: withAlts(photos.boards, ['Creating the waqf board', 'Track one board: Yemen Pioneers', 'Tracks two and three board', 'Track four board: community awareness', 'Beneficiaries board']),
  },
  participate: {
    heading: 'Ways to Participate',
    subheading: 'Participation is broader than a money transfer',
    ways: [
      { title: 'Contribute to a Waqf Product', text: 'Choose a share, a tree, or an asset through the official channels.' },
      { title: 'Gift a Waqf', text: 'For yourself, your parents, or someone you love.' },
      { title: 'Endow an Asset or Stake', text: 'Real estate, a share, or a documented ownership stake.' },
      { title: 'Organize a Group Contribution', text: 'A family, friends, or a professional community building a shared asset.' },
      { title: 'Spread the Idea', text: 'Introduce the model and help reach new partners.' },
      { title: 'Offer Your Expertise', text: 'Advice, a network, or disciplined volunteer time.' },
    ],
    partners: {
      heading: 'Sustainability Partnerships',
      subheading: 'Business and partners multiply the capacity to endure',
      items: [
        { title: 'Assets & Expertise', text: 'Endowing stakes or assets, and offering technical and investment expertise.' },
        { title: 'Program Funding', text: 'Sponsoring specific tracks while separating funding from the waqf asset.' },
        { title: 'Knowledge & Networks', text: 'Universities, institutions, and experts expanding quality and reach.' },
      ],
      note: 'A trusted partnership clarifies the money, the role, the use, and the expected result.',
    },
  },
  cta: {
    title: 'Be a Partner in an Asset That Endures',
    text: 'Contribute for yourself, your parents, or someone you love — and help build a sustainable resource for Yemen’s people, institutions, and future.',
    slogan: 'Together, an endowment for Yemen’s renaissance',
    donate: 'Contribute to the waqf',
    participate: 'Discover ways to participate',
    backToLibrary: 'Back to Library',
    image: photos.cta,
  },
};

const tr: LibraryProfileContent = {
  meta: {
    title: 'Vakfın Hikayesi',
    shortTitle: 'Vakfın Hikayesi',
    seoDescription:
      'Veysel Karani Vakfı’nın hikayesinde interaktif bir yolculuk: fikirden etkiye — kuruluş, vakıf döngüsü, yatırım, dört mecra ve Aralık 2025’e kadar Owais in Numbers.',
  },
  labels: {
    chapter: 'Bölüm',
    scrollHint: 'Yolculuğa başlamak için kaydırın',
    untilDate: 'Aralık 2025’e kadar',
    openInfographics: 'Orijinal infografikleri görüntüle',
    infographicsNote: '"Owais in Numbers" sayısından beş pano',
    watchNumbers: 'Owais in Numbers',
    flipHint: 'Vakfın cevabını görmek için dokunun',
    flipResponse: 'Vakfın cevabı',
    track: 'Mecra',
    previousTrack: 'Önceki mecra',
    nextTrack: 'Sonraki mecra',
    pauseReel: 'Otomatik geçişi durdur',
    playReel: 'Otomatik geçişi sürdür',
  },
  hero: {
    eyebrow: 'Veysel Karani Vakfı',
    title: 'Yemen’in Yükselişi İçin Katılımcı Bir Vakıf',
    subtitle: 'Artık bir fikir değil; büyüyen varlıklar, programlar ve ortaklıklar.',
    slogan: 'Yemen’in yükselişi için birlikte vakfettik',
    intro: 'Bu sıradan bir tanıtım sayfası değil; insanı, kurumu ve bilinci inşa eden bir vakfın hikayesinde bir yolculuk.',
    image: photos.hero,
  },
  pillars: {
    heading: 'Fikirden Etkiye',
    subheading: 'Dört sütun, başarılanların ölçeğini ve gelecek aşamanın yönünü anlatıyor',
    items: [
      { title: 'Vakfın Oluşturulması', text: 'Dünyadaki Yemenlilerin ve Yemen dostlarının katkılarıyla oluşan belgelenmiş vakıf varlıkları.' },
      { title: 'Yatırım', text: 'Varlığı büyütmek ve değerini korumak için profesyonelce yönetilen çeşitlendirilmiş yatırımlar.' },
      { title: 'İnsanı İnşa Etmek', text: 'Yemenli Öncüler: geleceğin liderleri seçilir, akademik ve liderlik yönünden hazırlanır.' },
      { title: 'Kurumları Güçlendirmek', text: 'Kamu ve sivil kurumların kapasitesini yükselten programlar ve ortaklıklar.' },
    ],
    outro: 'Güncellenen rakamlar, başarılanların ölçeğini ve gelecek aşamanın yönünü gösteriyor.',
  },
  problem: {
    heading: 'Çözdüğümüz Sorun',
    subheading: 'Yemen; insanı, kurumu ve bilinci inşa eden bir kaynağa ihtiyaç duyuyor',
    cards: [
      { title: 'İnsan', text: 'Yemen’in ihtiyaç duyduğu yetkinlikleri ve liderleri yetiştirmek.' },
      { title: 'Kurumlar', text: 'Kamu ve sivil kurumların kapasitesini ve sürekliliğini güçlendirmek.' },
      { title: 'Bilinç', text: 'Güveni, katılımı ve kapsayıcı milli kimliği pekiştirmek.' },
    ],
    note: 'Yükseliş yalnızca mevsimlik projelerle değil; hafızası ve sürekliliği olan bir finansmanla inşa edilir.',
  },
  story: {
    heading: 'Kuruluş Hikayesi',
    subheading: 'Soru Sana’a’da doğdu, İstanbul’da olgunlaştı',
    milestones: [
      { year: '2012', title: 'Fikri Kökler', text: 'Sana’a’da gelecek öngörüsü için Mutlu Yemen Vakfı’nın yola çıkışı.' },
      { year: '2014', title: 'Sürdürülebilirlik Dersi', text: 'Deneyim olaylarla durdu; geriye tek soru kaldı: fikri finansman dalgalanmasından nasıl koruruz?' },
      { year: '27 Mart 2017', title: 'Vakfın Kuruluşu', text: 'İstanbul’da düzenli bir hukuki ve denetim çerçevesinde ruhsat.' },
      { year: '2018 – 2019', title: 'İnşa ve İlan', text: 'Yönetmeliklerin hazırlanması, ardından ilk program ve modellerin başlatılması.' },
    ],
    experiencesHeading: 'Modeli Şekillendiren Deneyimler',
    experiencesSubheading: 'Dört deneyim bizi kalkınma vakfına götürdü',
    experiences: [
      { title: 'Gelecek Öngörüsü', text: 'Programlardan önce vizyon' },
      { title: 'Yemen Krizleri', text: 'Sürdürülebilirlik fikri korur' },
      { title: 'Sivil Çalışma', text: 'Hibeler tek başına yetmez' },
      { title: 'Türkiye Deneyimi', text: 'Hukuk, yönetişim ve yatırım' },
    ],
    conclusion: 'Sonuç: Malı koruyan, büyüten ve etkisini geleceğe yönlendiren bir kaba ihtiyacımız var.',
    photos: withAlts(photos.story, ['Yemen’de bir kapasite geliştirme etkinliği', 'İstanbul’da bir Sphere eğitim salonu', 'Bir kurumsal gelişim atölyesi']),
  },
  identity: {
    heading: 'Kimlik ve Anlam',
    subheading: 'Veysel Karani ismi, Yemen’e vefayı kalıcı etkiyle buluşturur',
    image: photos.identity,
    why: {
      title: 'Neden Veysel Karani?',
      text: 'Hayatındaki iyilik, vefa ve ihlas için — anneye iyilik, anamız Yemen’e iyiliğe dönüşür — ve yüce tabiin Veysel Karani’nin Türk toplumundaki değeri ve konumu için.',
    },
    what: {
      title: 'Vakıf Nedir?',
      text: 'Yemen tarihinin en büyük katılımcı vakfını oluşturmayı amaçlayan, geliri medeniyet kalkınma programlarına akan; dünyadaki tüm Yemenlilerin ve Yemen dostlarının kurup büyüttüğü vakıf nitelikli bir kalkınma kurumu.',
    },
    vision: { title: 'Vizyon', text: 'Yemen’in medeni yükselişinde uzmanlaşmış katılımcı vakfın öncüleri.' },
    mission: { title: 'Misyon', text: 'Yenilikçi vakıf yatırım araçları üretir, kapasite inşasında ortaklarımızla bütünleşiriz.' },
    values: { title: 'Değerler', items: ['İnisiyatif', 'Ortaklık', 'Kurumsallık', 'Şeffaflık', 'Sürdürülebilirlik'] },
    note: 'Buradaki sürdürülebilirlik; mali, kurumsal, kalkınmasal ve millidir.',
  },
  cycle: {
    heading: 'Vakıf Döngüsü',
    subheading: 'Üç aşama, katkıyı etkiye bağlar',
    stages: [
      { title: 'Vakfın Oluşturulması', text: 'Onaylı ürün ve kanallar üzerinden belgelenmiş katkılar, varlıklar ve paylar.' },
      { title: 'Yatırım', text: 'Getiri, risk, likidite ve varlık korumasını dengeleyen profesyonel yönetim.' },
      { title: 'Mecralar', text: 'Tahsis edilebilir getirinin onaylı kalkınma mecralarına yönlendirilmesi.' },
    ],
    note: 'Döngünün tamamını vakıf senedi ve iyi yönetişim yönetir.',
    duality: {
      heading: 'Birbirini Tamamlayan İki İşlev',
      direct: {
        title: 'Doğrudan Bağış',
        text: 'Belirli bir ihtiyacı veya faaliyeti finanse eder; etkisini amaca ve mevcut fona göre hemen gösterir.',
      },
      waqf: {
        title: 'Vakıf Katkısı',
        text: 'Bir varlık oluşturur veya güçlendirir; yönetilir, büyütülür ve getirileri onaylı mecralara yönlendirilir.',
      },
      note: 'İki model birbirini tamamlar: biri bugüne cevap verir, diğeri geleceğin kapasitesini inşa eder.',
    },
  },
  creation: {
    heading: 'Birincisi: Vakfın Oluşturulması',
    subheading: 'Oluşturma, katkıyı belgelenmiş bir varlığa dönüştürür',
    share: {
      heading: 'Vakıf Payı',
      what: {
        title: 'Nedir?',
        text: 'Korunan ve yatırılan ortak bir vakıf varlığı oluşturmak için diğerleriyle birleştirilen katkı birimi.',
      },
      note: 'Kendiniz, anne-babanız veya sevdiğiniz biri adına, vakfın resmi kanallarından katkıda bulunabilirsiniz.',
    },
    photos: withAlts(photos.creation, ['İstanbul’daki vakıf daireleri 1', 'İstanbul’daki vakıf daireleri 2', 'İstanbul’daki vakıf daireleri 3', 'İstanbul’daki vakıf daireleri 4']),
    formsHeading: 'Vakıf Oluşturma Biçimleri',
    formsSubheading: 'Katkılar çeşitlenir; hepsini tek amaç birleştirir: kalıcı bir varlık',
    forms: [
      { title: 'Vakıf Payı', text: 'Ortak varlık oluşturan katkı birimleri.' },
      { title: 'Mübarek Ağaç', text: 'Tarımsal vakıf varlığına bağlı katılım.' },
      { title: 'Varlık veya Pay Vakfı', text: 'Gayrimenkul, hisse veya bir projeden pay.' },
      { title: 'Altın Portföyü', text: 'Yatırım politikasına göre varlık çeşitlendirmesi.' },
      { title: 'Vakıf Hediyeleri', text: 'Kendiniz veya sevdiğiniz biri adına katkı.' },
      { title: 'Şirket Payları Vakfı', text: 'Belgeli koşullarla mülkiyet payı veya üretken varlık.' },
    ],
    tree: {
      heading: 'Uygulamalı Model: Mübarek Ağaç',
      subheading: 'Küçük katkılardan üretken bir tarım varlığına',
      image: photos.tree,
      steps: [
        { title: 'İnceleme ve Katkı', text: 'Tarımsal fırsatın seçilmesi ve katkıların toplanması.' },
        { title: 'Satın Alma ve Yönetim', text: 'Varlığın oluşturulması, teknik ve operasyonel yönetimi.' },
        { title: 'Getiri ve Mecra', text: 'Varlık değeri ile getirisinin ayrılması; gerçekleşen getirinin vakıf politikasına göre yönlendirilmesi.' },
      ],
      note: 'Değer tek bir ağaçta değil; katkıyı yönetilen ve süren bir varlığa dönüştürmektedir.',
    },
  },
  investment: {
    heading: 'İkincisi: Yatırım',
    subheading: 'Vakıf yatırımı daha disiplinlidir; çünkü varlık bir emanettir',
    principles: [
      { title: 'Fizibilite', text: 'Taahhütten önce pazarı, akışları ve büyüme fırsatlarını anlamak.' },
      { title: 'Risk Yönetimi', text: 'Riskleri, limitleri, likiditeyi ve çözüm planlarını tanımlamak.' },
      { title: 'Çeşitlendirme', text: 'Yoğunlaşmayı ve getiri dalgalanmasını azaltmak için varlık dağılımı.' },
      { title: 'Varlık Koruması', text: 'Büyüme, istikrar ve gerçek değer arasında denge.' },
    ],
    stagesHeading: 'Yatırım kararı net aşamalardan geçer',
    stages: [
      { title: 'Fırsatın Tespiti', text: 'Vakıf politikasıyla uyumlu ön eleme.' },
      { title: 'Fizibilite Çalışması', text: 'Pazar, akış ve alternatiflerin analizi.' },
      { title: 'Risk Değerlendirmesi', text: 'Yoğunlaşma, likidite ve senaryoların ölçümü.' },
      { title: 'Onay', text: 'Yetkili merciin belgelenmiş kararı.' },
      { title: 'Uygulama', text: 'Onaylı kontroller altında sözleşme ve işletme.' },
      { title: 'İzleme ve Değerlendirme', text: 'Performans raporları, gözden geçirme ve sürekli düzeltme.' },
    ],
    governance: {
      heading: 'Kurumsal Ayrım',
      subheading: 'İcra yönetimi yatırım kararını asla tek başına vermez',
      bodies: [
        { title: 'Mütevelli Heyeti', text: 'Politikaları, yönelimleri ve büyük limitleri onaylar.' },
        { title: 'Yatırım Komitesi', text: 'Fırsatları inceler, önerir ve portföy performansını izler.' },
        { title: 'Yatırım Kolu', text: 'Arkan International, yetki ve yönetişim çerçevesinde yatırımı profesyonelce yürütür.' },
        { title: 'İcra Yönetimi', text: 'Koordine eder ve belgeler; uzman yatırım kararının yerine geçmez.' },
        { title: 'Uzmanlar ve Danışmanlar', text: 'Teknik, hukuki ve şer’i görüş sunar.' },
        { title: 'Denetim ve Gözetim', text: 'Uyumu, performansı ve şeffaflığı doğrular.' },
      ],
      note: 'Yetki netliği kararı korur, rol çatışmasını önler ve güveni güçlendirir.',
    },
    yield: {
      heading: 'Tahsis Edilebilir Getiri',
      subheading: 'Her gelir harcanabilir değildir',
      steps: [
        { title: 'Brüt Gelir', text: 'Varlıkların ürettiği gerçekleşmiş gelir veya kazançlar.' },
        { title: 'Maliyetler ve Karşılıklar', text: 'İşletme giderleri, yükümlülükler, likidite ve rezervler.' },
        { title: 'Tahsis Edilebilir Getiri', text: 'Mecraları beslemek ve varlığı büyütmek için onaylanan tutar.' },
      ],
      note: 'Denge; bugünün mecralarını, yarının varlık büyümesini ve uzun vadeli gerçek değeri korur.',
    },
  },
  tracks: {
    heading: 'Üçüncüsü: Vakıf Mecraları',
    subheading: 'Dört mecra, yükselişin koşullarını inşa eder',
    items: [
      { image: photos.tracks[0], title: 'Geleceğin Liderleri', text: 'Yetenekli ve seçkin Yemenlileri geleceğin liderleri olarak hazırlamak.' },
      { image: photos.tracks[1], title: 'Mevcut Liderler', text: 'İdari ve toplumsal kadroların kapasitesini geliştirmek.' },
      { image: photos.tracks[2], title: 'Kurumsal Gelişim', text: 'Kamu ve sivil kurumların verimliliğini ve sürekliliğini yükseltmek.' },
      { image: photos.tracks[3], title: 'Bilinç ve Kimlik', text: 'Katılımı, birlikte yaşamayı ve kapsayıcı milli kimliği güçlendirmek.' },
    ],
  },
  pioneers: {
    heading: 'Yemenli Öncüler Programı',
    subheading: 'Yemenli Öncüler, yetenekleri Yemen’in gelecek ihtiyaçlarına bağlar',
    idea: {
      title: 'Fikir',
      text: 'Birinci mecranın amiral programı; derece yapan ve yetenekli öğrencileri uzun soluklu bir liderlik yolunda hazırlamak için 2019’da başladı.',
    },
    goal: {
      title: 'Amaç',
      text: 'Alanında üstün, kişiliği ve liderliği gelişen, Yemen’e karşı sorumluluğunun bilincinde bir öncü yetiştirmek.',
    },
    pillarsHeading: 'Öncünün seçimini ve hazırlanmasını dört temel yönetir',
    pillars: [
      { title: 'Gelecek İhtiyaçları', text: 'Uzmanlıkları Yemen’in ihtiyaç duyduğu alanlara yönlendirmek.' },
      { title: 'Liyakat ve Fırsat', text: 'İlan edilmiş ölçütler, erişim ve seçimde eşitlik.' },
      { title: 'Akademik Hazırlık', text: 'Nitelikli eğitim ve başarıyı destekleyen takip yolu.' },
      { title: 'Liderlik Refakati', text: 'Sorumlu bir öncü yetiştiren beceriler, değerler ve uygulamalı deneyimler.' },
    ],
    pathsHeading: 'Öncü, beş paralel yolda inşa edilir',
    paths: [
      { title: 'Kişisel ve Değerler', text: 'Öz farkındalık, disiplin, değerler ve sorumlu davranış.' },
      { title: 'Akademik', text: 'Uzmanlıkta üstünlük, sürekli öğrenme ve bilgi üretimi.' },
      { title: 'Liderlik', text: 'İnisiyatif, karar, iletişim ve ekip çalışması.' },
      { title: 'Beceri', text: 'Gerekli ve nitelikli becerileri edinme kapasitesi.' },
      { title: 'Sorumluluk ve Kimlik', text: 'Çeşitliliği kucaklayan, bilgiyi taahhüde dönüştüren kapsayıcı aidiyet.' },
    ],
    philosophyHeading: 'Mezuniyetten yükselişe: sorumluluk diplomadan sonra başlar',
    philosophy: [
      { title: 'İlim', text: 'Uzmanlıkta ustalaşmak' },
      { title: 'Liderlik', text: 'Bilgiyi inisiyatife dönüştürmek' },
      { title: 'Toplum', text: 'İnsana hizmet, çözüm inşası' },
      { title: 'Vatan', text: 'Bireysel başarıyı aşan sorumluluk' },
    ],
    note: 'İlişki mezuniyetle bitmez; daha büyük bir verme, etki ve sorumluluk ağına dönüşür.',
    photos: withAlts(photos.pioneers, ['Sphere eğitim salonunda Yemenli Öncüler 1', 'Sphere eğitim salonunda Yemenli Öncüler 2']),
  },
  numbers: {
    eyebrow: 'Yolculuğun Meyvesi · Aralık 2025’e kadar',
    heading: 'Owais in Numbers',
    subheading: 'Oluşturulan varlıklar, büyüyen yatırımlar, yetişen öncüler, desteklenen kurumlar.',
    capital: {
      heading: 'Vakfın Oluşturulması',
      stats: [
        { value: 17488, label: 'vakıf payı', sublabel: 'Toplam vakıf payları' },
        { value: 9403, label: 'katkı sahibi', sublabel: 'Vakfın oluşumuna katıldı' },
        { value: 22, label: 'ülke', sublabel: 'Katkı sahiplerinin bulunduğu' },
      ],
    },
    investment: {
      heading: 'Vakfın Yatırımı',
      lead: 'Vakıf fonları 6 ticari faaliyette değerlendiriliyor',
      profit: { value: 51.67, suffix: '%', decimals: 2, label: 'sermaye kazancı', sublabel: 'Vakıf varlık değerindeki artış' },
      activities: ['Mübarek Ağaç', 'Vakıf Daireleri', 'Altın', 'Tarım Arazileri', 'Emlak Yönetimi ve Gayrimenkul', 'Kısa Vadeli İşlemler'],
    },
    programsStat: { value: 40, suffix: '', decimals: 0, label: 'kalkınma programı', sublabel: 'Vakıf mecraları kapsamında' },
    beneficiariesStat: { value: 1556, suffix: '', decimals: 0, label: 'toplam faydalanıcı', sublabel: 'Vakıf mecralarından' },
    groups: [
      {
        heading: 'Birinci Mecra · Yemenli Öncüler',
        caption: 'Yetenekli ve seçkinleri geleceğin liderleri olarak hazırlamak',
        stats: [
          { value: 86, label: 'eğitim bursu' },
          { value: 33, label: 'hakemli bilimsel makale' },
          { value: 7, label: 'uluslararası katılım', sublabel: 'Pakistan, Japonya, Hindistan, Katar, Mısır, Kazakistan, Çin' },
          { value: 6, label: 'eğitim buluşması' },
          { value: 5, label: 'Teknofest katılımı' },
          { value: 2, label: 'bilimsel konferans' },
          { value: 1, label: 'patent' },
        ],
      },
      {
        heading: 'İkinci Mecra · Liderlikler',
        caption: 'İdari ve toplumsal liderliklerin geliştirilmesi',
        stats: [
          { value: 30, label: 'genç toplum liderliği programı' },
          { value: 3, label: 'Yemen vilayeti' },
          { value: 6, label: 'dünya ülkesi' },
        ],
      },
      {
        heading: 'Üçüncü Mecra · Kurumlar',
        caption: 'Kamu ve sivil kurumların performansının geliştirilmesi',
        stats: [
          { value: 140, label: 'sivil toplum kuruluşu', sublabel: 'Kapasite geliştirme programı' },
          { value: 13, label: 'Yemen vilayeti' },
          { value: 9, label: 'Sphere standartları forumunda kuruluş' },
        ],
      },
      {
        heading: 'Dördüncü Mecra · Toplumsal Bilinç',
        caption: 'Owaisya · Owais Podcast · Owais Divaniyesi',
        stats: [
          { value: 5, suffix: 'M+', label: 'platform hesaplarına erişim' },
          { value: 1, suffix: 'M+', label: 'içerik görüntülenmesi' },
          { value: 2693, label: 'gönüllü', sublabel: 'Gönüllülük Birimi' },
          { value: 148, label: 'katılımcı girişim', sublabel: 'Yemen’in altı bölgesinden' },
          { value: 5, label: 'ödüllü girişim', sublabel: 'Owais Gönüllülük Ödülü' },
        ],
      },
    ],
    platformsNote: 'Platform içerikleri bir milyon görüntülemeyi, hesap erişimi beş milyonu aştı.',
    closing:
      'Bugüne dek sunulan program ve girişimler; vakıf katkılarınızın oluşturabileceği kalıcı etki ve sürdürülebilir getirilerin yalnızca birer örneğidir.',
    boards: withAlts(photos.boards, ['Vakfın oluşturulması panosu', 'Birinci mecra panosu: Yemenli Öncüler', 'İkinci ve üçüncü mecra panosu', 'Dördüncü mecra panosu: toplumsal bilinç', 'Faydalanıcılar panosu']),
  },
  participate: {
    heading: 'Katılım Yolları',
    subheading: 'Katılım bir para transferinden daha geniştir',
    ways: [
      { title: 'Bir Vakıf Ürününe Katkıda Bulun', text: 'Resmi kanallardan bir pay, ağaç veya varlık seçin.' },
      { title: 'Vakıf Hediye Et', text: 'Kendiniz, anne-babanız veya sevdiğiniz biri adına.' },
      { title: 'Varlık veya Pay Vakfet', text: 'Gayrimenkul, hisse veya belgeli mülkiyet payı.' },
      { title: 'Toplu Katkı Düzenle', text: 'Aile, arkadaşlar veya meslek topluluğu ortak varlık inşa eder.' },
      { title: 'Fikri Yay', text: 'Modeli tanıtın, yeni ortaklara ulaşmaya yardım edin.' },
      { title: 'Uzmanlığını Sun', text: 'Danışmanlık, ilişki ağı veya düzenli gönüllü zaman.' },
    ],
    partners: {
      heading: 'Sürdürülebilirlik Ortaklıkları',
      subheading: 'İş dünyası ve ortaklar sürdürme kapasitesini katlar',
      items: [
        { title: 'Varlık ve Uzmanlık', text: 'Pay veya varlık vakfetmek; teknik ve yatırım uzmanlığı sunmak.' },
        { title: 'Program Finansmanı', text: 'Finansmanı vakıf varlığından ayırarak belirli mecralara sponsorluk.' },
        { title: 'Bilgi ve Ağlar', text: 'Kaliteyi ve erişimi büyüten üniversiteler, kurumlar ve uzmanlar.' },
      ],
      note: 'Güvenilir ortaklık; parayı, rolü, kullanımı ve beklenen sonucu netleştirir.',
    },
  },
  cta: {
    title: 'Kalıcı Bir Varlıkta Ortak Olun',
    text: 'Kendiniz, anne-babanız veya sevdiğiniz biri adına katkıda bulunun; Yemen’in insanı, kurumları ve geleceği için sürdürülebilir bir kaynağın inşasına katılın.',
    slogan: 'Yemen’in yükselişi için birlikte vakfettik',
    donate: 'Vakfa katkıda bulun',
    participate: 'Katılım yollarını keşfet',
    backToLibrary: 'Kütüphaneye Dön',
    image: photos.cta,
  },
};

const content: Record<Locale, LibraryProfileContent> = { ar, en, tr };

/** The copy as it ships in this repo — what the dashboard's restore tool falls back to. */
export function staticLibraryProfileContent(locale: Locale): LibraryProfileContent {
  return content[locale] ?? content.ar;
}

/**
 * What visitors see: the `library-profile` site_pages row for this language layered
 * over the built-in copy, then tidied — numbers typed in the dashboard may come back as
 * strings or blanks, and a photo row without a picture must not render a broken frame.
 */
export function getLibraryProfileContent(locale: Locale): LibraryProfileContent {
  const base = staticLibraryProfileContent(locale);
  const merged = cmsPageContent('library-profile', locale, base);
  return merged === base ? base : sanitize(merged, base);
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function pictureOr(value: unknown, fallback: string): string {
  return optionalText(value) ?? fallback;
}

function stat(value: unknown, fallback: Stat): Stat {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const decimals = Math.round(toNumber(raw.decimals, fallback.decimals ?? 0));
  return {
    value: toNumber(raw.value, fallback.value),
    suffix: optionalText(raw.suffix),
    decimals: decimals > 0 ? decimals : undefined,
    label: typeof raw.label === 'string' ? raw.label : fallback.label,
    sublabel: optionalText(raw.sublabel),
  };
}

const emptyStat: Stat = { value: 0, label: '' };

function statList(value: unknown, fallback: Stat[]): Stat[] {
  return Array.isArray(value) ? value.map((item) => stat(item, emptyStat)) : fallback;
}

function photoList(value: unknown, fallback: LibraryProfilePhoto[]): LibraryProfilePhoto[] {
  if (!Array.isArray(value)) return fallback;
  return value.flatMap((item) => {
    const raw = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const src = optionalText(raw.src);
    return src ? [{ src, alt: optionalText(raw.alt) ?? '' }] : [];
  });
}

function stringList(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
}

function sanitize(merged: LibraryProfileContent, base: LibraryProfileContent): LibraryProfileContent {
  const numbers = merged.numbers;
  const groups = Array.isArray(numbers.groups) ? numbers.groups : base.numbers.groups;
  return {
    ...merged,
    hero: { ...merged.hero, image: pictureOr(merged.hero.image, base.hero.image) },
    story: { ...merged.story, photos: photoList(merged.story.photos, base.story.photos) },
    identity: {
      ...merged.identity,
      image: pictureOr(merged.identity.image, base.identity.image),
      values: {
        ...merged.identity.values,
        items: stringList(merged.identity.values?.items, base.identity.values.items),
      },
    },
    creation: {
      ...merged.creation,
      photos: photoList(merged.creation.photos, base.creation.photos),
      tree: { ...merged.creation.tree, image: pictureOr(merged.creation.tree?.image, base.creation.tree.image) },
    },
    tracks: {
      ...merged.tracks,
      items: (Array.isArray(merged.tracks.items) ? merged.tracks.items : base.tracks.items).map((item) => ({
        ...item,
        image: optionalText(item.image),
      })),
    },
    pioneers: { ...merged.pioneers, photos: photoList(merged.pioneers.photos, base.pioneers.photos) },
    numbers: {
      ...numbers,
      capital: { ...numbers.capital, stats: statList(numbers.capital?.stats, base.numbers.capital.stats) },
      investment: {
        ...numbers.investment,
        profit: stat(numbers.investment?.profit, base.numbers.investment.profit),
        activities: stringList(numbers.investment?.activities, base.numbers.investment.activities),
      },
      programsStat: stat(numbers.programsStat, base.numbers.programsStat),
      beneficiariesStat: stat(numbers.beneficiariesStat, base.numbers.beneficiariesStat),
      groups: groups.map((group) => ({
        ...group,
        caption: optionalText(group.caption),
        stats: statList(group.stats, []),
      })),
      boards: photoList(numbers.boards, base.numbers.boards),
    },
    cta: { ...merged.cta, image: pictureOr(merged.cta.image, base.cta.image) },
  };
}
