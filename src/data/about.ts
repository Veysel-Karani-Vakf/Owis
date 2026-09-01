import { cmsPageContent } from '@/cms/adapters';
import type { Locale } from '@/i18n/content';

export const aboutRoutes = {
  waqf: '/about/waqf',
  governance: '/about/governance',
} as const;

export type AboutNavItem = {
  label: string;
  href: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type TextBlock = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Policy = {
  id: string;
  title: string;
  summary: string;
  blocks: TextBlock[];
};

export type WaqfPageContent = {
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  hero: {
    title: string;
    description: string;
    image: string;
    /** Alt text for the hero image and the video poster; empty = decorative. */
    imageAlt?: string;
  };
  breadcrumbs: BreadcrumbItem[];
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    /** `icon` is an ICON_REGISTRY name; unset falls back to the page's default per position. */
    facts: { label: string; value: string; icon?: string }[];
    downloadLabel: string;
    downloadUrl: string;
  };
  video: {
    title: string;
    description: string;
    videoId: string;
    sourceUrl: string;
    /** Public URL of a video uploaded in the dashboard; wins over videoId. */
    videoFile?: string;
    /** Cover shown before play, set in the dashboard; hero image when unset. */
    posterImage?: string;
  };
  goals: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };
  identity: {
    valuesTitle: string;
    values: string[];
    missionTitle: string;
    mission: string;
    visionTitle: string;
    vision: string;
  };
  methodology: {
    eyebrow: string;
    title: string;
    description: string;
    stepLabel: string;
    itemTitles: string[];
    items: string[];
  };
  president: {
    title: string;
    name: string;
    role: string;
    image: string;
    paragraphs: string[];
  };
  cycle: {
    title: string;
    description: string;
    phases: {
      title: string;
      /** Short name shown in the ScrollStack indicator; derived from the title after ':' when unset. */
      shortLabel?: string;
      description: string;
      bullets?: string[];
      /** ICON_REGISTRY name; unset falls back to the page's default per position. */
      icon?: string;
    }[];
  };
};

export type GovernancePageContent = {
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  hero: {
    title: string;
    description: string;
    image: string;
    /** Alt text for the hero image; empty = decorative. */
    imageAlt?: string;
  };
  breadcrumbs: BreadcrumbItem[];
  intro: {
    eyebrow: string;
    title: string;
    description: string;
    navTitle: string;
  };
  policies: Policy[];
};

export type AboutPagesContent = {
  nav: AboutNavItem[];
  waqf: WaqfPageContent;
  governance: GovernancePageContent;
};

const assets = {
  waqfHero:
    '/media/1024x576-3bbcc5a7.jpeg',
  governanceHero: '/media/135a7765-scaled-1-1024x683-97228b97.jpg',
  president:
    '/media/1024x576-3bbcc5a7.jpeg',
  profileFileAr: 'https://drive.google.com/file/d/191M9qTsUhtp9Shstf4xJbEYC-iSzXpmD/view?usp=sharing',
  profileFileEn: 'https://drive.google.com/file/d/19VislWASMpd284pQYi4yffnn4AZeMepS/view?usp=sharing',
  profileFileTr: 'https://drive.google.com/file/d/1nRlkSmZHcVKgCucV9UHoCEPYdgJYd-Z6/view?usp=sharing',
  waqfSource: '/about/waqf',
  governanceSource: '/about/governance',
  videoSource: 'https://www.youtube.com/watch?v=dvDQGL8IWX8',
  videoSourceEn: 'https://www.youtube.com/watch?v=STmMVySqqtg',
  videoSourceTr: 'https://www.youtube.com/watch?v=DPY--Zs7Ero',
};

const arPolicies: Policy[] = [
  {
    id: 'whistleblowing',
    title: 'سياسة الإبلاغ عن المخالفات',
    summary: 'تحدد الأطراف المشمولة وآلية الإبلاغ الآمن عن المخالفات وحماية أصحاب الشأن.',
    blocks: [
      {
        heading: 'نطاق السياسة',
        paragraphs: [
          'يشمل نطاق هذه السياسة كافة الأطراف ذات العلاقة وذلك على النحو التالي: المستفيدين من برامج ومشاريع الوقف.',
        ],
        bullets: [
          'العاملين في الوقف.',
          'الشركاء التنفيذيين.',
          'أعضاء هيئة المتولين.',
          'أعضاء مجلس الإدارة والمؤسسين.',
          'أعضاء اللجان المنبثقة من مجلس المتولين ومجلس الإدارة.',
          'الإدارة التنفيذية.',
        ],
      },
      {
        heading: 'الغرض من السياسة',
        bullets: [
          'مساعدة جميع الأطراف ذات العلاقة بما فيهم العاملين والمستفيدين من برامج ومشاريع الوقف على إبلاغ مجلس الإدارة أو اللجنة المختصة عن أي أفعال أو ممارسات مرتكبة من قبل الإدارة التنفيذية، والتي تنتهك القوانين والقواعد واللوائح المعتمدة أو تخالف قيم الوقف.',
          'توفير مناخ يضمن الحفاظ على سرية إجراءات الإبلاغ بطريقة سهلة وآمنة.',
          'تقديم الحماية اللازمة لأصحاب الشأن أو الأطراف المعنية بما في ذلك الضوابط الواردة في سياسة تعارض المصالح.',
          'تمكين العاملين من الإبلاغ عن المخالفات بعد التأكد منها إلى أعلى المستويات في حال لم يتم معالجة هذه المخالفات عبر الجهة المختصة.',
        ],
      },
    ],
  },
  {
    id: 'conflict-of-interest',
    title: 'سياسة تعارض المصالح',
    summary: 'تنظم علاقة الوقف بالأشخاص والجهات العاملة معه وتحمي منظومة الحقوق والسمعة.',
    blocks: [
      {
        heading: 'نطاق السياسة',
        paragraphs: [
          'مع عدم الإخلال بما جاء في التشريعات والقوانين المعمول بها في دولة المقر والمعايير المعتمدة لعمل الأوقاف ومنظمات المجتمع المدني والتي تحكم تعارض المصالح، تطبق هذه السياسة على الهيئات القيادية في الوقف وجميع العاملين واللجان والمتطوعين وشركاء الوقف وكذلك الشركاء التنفيذيين في المناطق التي يقدم الوقف فيها برامجه للمستفيدين.',
        ],
        bullets: [
          'كافة الهيئات القيادية في الوقف وفروعه وممثلياته واللجان العليا.',
          'جميع العاملين بدوام كامل.',
          'جميع العاملين بدوام جزئي.',
          'جميع المتطوعين في أعمال الوقف.',
        ],
      },
      {
        paragraphs: ['تغطي هذه السياسة كافة عمليات وبرامج الوقف في مختلف الأوقات والظروف.'],
      },
      {
        heading: 'الغرض من السياسة',
        paragraphs: [
          'تهدف سياسة تعارض المصالح إلى إدارة مصالح مختلف الأطراف ذات العلاقة من خلال منع الممارسات التي تعتبر تعارضاً للمصالح وتلك التي قد تفسر على أنها تعارض للمصالح، ويشمل تعارض المصالح ما يتعلق بالأشخاص والأطراف ذات العلاقة وأصحاب القرار أو المؤثرين على أصحاب القرار ومصالح أي شخص آخر تكون لهم علاقة شخصية بهم، ويشمل هؤلاء الزوجات، الأبناء، الوالدين، الأشقاء، أو غيرهم من أفراد العائلة إلى الدرجة الثالثة.',
          'وثيقة سياسة تعارض المصالح من الوثائق الحاكمة لوقف أُويس القرني كونها من الوثائق التي تمثل حماية لمنظومة الحقوق وتمنع الوقوع في مخاطر السمعة أو مخاطر الاستثمار أو التعاقدات التي قد تصنف أو تفسر كتعارض مصالح، وبالتالي فهي وثيقة منظمة لعلاقة الوقف بالجهات والأشخاص العاملين معه أو لصالحه والقرارات ذات العلاقة سواء كانت تلك القرارات قرارات تعيين أو عقود عمل دائمة أو مؤقتة أو اتفاقيات شراكة أو غيرها من القرارات.',
        ],
      },
    ],
  },
  {
    id: 'transparency-disclosure',
    title: 'سياسة الشفافية والإفصاح',
    summary: 'تعزز سلامة الإجراءات والمساءلة والثقة المتبادلة مع الأطراف ذات العلاقة.',
    blocks: [
      {
        heading: 'نطاق السياسة',
        paragraphs: [
          'جميع هيئات ومجالس ولجان الوقف القيادية وكذلك الإدارات والوحدات ولجان الوقف التنفيذية تقع في نطاق هذه السياسة وتلتزم جميعها بالشفافية والإفصاح للجهات ذات العلاقة داخلياً وخارجياً عبر المخولين بالإفصاح وعدم تجاوزهم.',
        ],
      },
      {
        heading: 'بيان سياسة الشفافية والإفصاح',
        paragraphs: [
          'سياسة الشفافية والإفصاح تضمن سلامة الإجراءات وتعزيز المهنية في كافة جوانب عمل الوقف كما أنها تعزز المساءلة والثقة المتبادل بين الوقف وكافة الأطراف ذات العلاقة.',
          'ويتوقع من العاملين في الوقف أو لصالحه ما يلي:',
        ],
        bullets: [
          'الإفصاح عن وظائفهم الحالية وعلاقاتهم بالأوقاف والمنظمات والجمعيات والجهات التي تعمل في مجالات عمل الوقف.',
          'إعلان المعايير الخاصة بالمفاضلات والمناقصات والاختيارات وأي عملية تنافسية على خدمات الوقف بما يمنح الجميع فرص متساوية.',
          'الإلمام بأنظمة الوقف ولوائحه وكل ما له علاقة بالوظيفة في الوقف.',
          'تطبيق المعايير بمهنية في كافة العمليات دون ميل أو محاباة.',
          'إعلان بنود التقييم للبرامج والأنشطة والفعاليات قبل التنفيذ بما يساعد على الالتزام بها.',
          'الإبلاغ عن المخالفات عند حدوثها.',
          'توفير الوثائق للجهات ذات العلاقة عند الطلب.',
        ],
      },
    ],
  },
  {
    id: 'compliance',
    title: 'سياسة الامتثال',
    summary: 'تربط عمل الوقف بالسياسات والتشريعات والمعايير المعتمدة لدى الجهات ذات العلاقة.',
    blocks: [
      {
        heading: 'الغرض من السياسة',
        paragraphs: [
          'تهدف هذه السياسة إلى تحقيق أعلى قدر من المؤسسية والعمل بأفضل الممارسات في مختلف المستويات في وقف أُويس القرني من خلال الامتثال والالتزام بكافة السياسات الواردة في هذا الدليل وكذلك الالتزام بالتشريعات والقوانين والمعايير المعتمدة لدى الهيئات المحلية والإقليمية ذات العلاقة لضمان حماية مصالح كافة الأطراف ذات العلاقة داخل الوقف وخارجه.',
        ],
      },
      {
        heading: 'مرجعيات هذه السياسة',
        bullets: [
          'قانون دولة المقر.',
          'وثيقة الوقف (صك الوقف).',
          'قانون رقم (23) لسنة 1992م وتعديلاته بالقرار الجمهوري رقم (32) لسنة 2008م بشأن الوقف الشرعي.',
          'قرارات المجامع الفقهية ذات العلاقة.',
          'معايير الهيئات المنظمة لأعمال الأوقاف والعمل الإنساني العربية والإسلامية ذات العلاقة.',
          'معايير مجموعة العمل المالي FATF.',
        ],
      },
      {
        heading: 'نطاق السياسة',
        paragraphs: [
          'هذه السياسة حاكمة وشاملة، وبالتالي فإن كل مستويات الهيكل الإداري واللجان والكيانات المستحدثة للوقف تقع في نطاق هذه السياسة، فهي تحكم سلوك الهيئات المختلفة في وقف أُويس القرني من أعلى الهرم التنظيمي للوقف والمتمثل بالهيئة العليا للوقف ومؤسس الوقف، وهيئة المتولين، وكل ما ينشأ عن هيئة المتولين والهيئات والمجالس واللجان التابعة للوقف، سواء كانت داخلية تنفيذية أو رقابية أو مساندة كمجلس الإدارة والتدقيق ولجنة الاستثمار ولجنة الخبراء ولجنة الرقابة وفروع وممثليات الوقف أو أي مكونات أخرى ساندة أو شريكة للوقف في دولة المقر أو خارجها.',
        ],
      },
    ],
  },
  {
    id: 'risk-management',
    title: 'سياسة إدارة المخاطر',
    summary: 'تضبط القرارات والعمليات بمعايير واضحة وتراعي المخاطر في الإيجاد والتثمير والصرف.',
    blocks: [
      {
        heading: 'الغرض من السياسة',
        paragraphs: [
          'تهدف سياسة إدارة المخاطر إلى تعميق العمل المؤسسي في الوقف بما يجعل قراراته منضبطة بمعايير واضحة ومحددة وغير متحيزة وبعيدة عن التأثير الشخصي للأفراد، بل تكون إرادات الأفراد خاضعة لهذه المعايير والمبادئ والسياسات الحاكمة.',
          'ولتحقيق ذلك يتم الالتزام بما يلي:',
        ],
        bullets: [
          'مراعاة غايات الوقف في كل القرارات والعمليات التي ينفذها الوقف بشكل مباشر أو عبر شركائه.',
          'الالتزام بمسارات الوقف المعتمدة والمعلنة.',
          'العمل وفق الضوابط الشرعية المنظمة لأعمال الأوقاف.',
          'التأكد المستمر من الالتزام بالقوانين المنظمة لعمل الأوقاف.',
          'كافة لجان الوقف تراعي في قراراتها سياسة إدارة المخاطر سواء في الإيجاد أو التثمير أو الصرف.',
          'تحدد المخاطر المتوقعة قبل تنفيذ أي مشروع من المشاريع والبدائل المقترحة لها لغرض الإقرار أو المنع.',
          'الإفصاح عن المخاطر حال حدوثها.',
          'اختيار الشركاء (داعمين، منفذين) يخضع لسياسة العناية الواجبة.',
          'تنظيم عملية اتخاذ القرار والتصويت وفقاً للمواثيق المعتمدة للهيئات القيادية للوقف وسياسات اللجان المنبثقة عنها والإجراءات المتعلقة بذلك في سياسة تعارض المصالح المعتمدة في هذا الدليل.',
          'تنظيم عمليات التوظيف واختيار المستفيدين والشركاء التنفيذيين وفقاً لسياسة العناية الواجبة المعتمدة في هذا الدليل.',
          'تعد سياسات تعارض المصالح ومكافحة الفساد والاحتيال ومحاربة تمويل الإرهاب من السياسات الضامنة لتجنب المخاطر المحتملة.',
        ],
      },
      {
        heading: 'نطاق السياسة',
        paragraphs: [
          'مع عدم الإخلال بما جاء في سند الوقف (صك الوقف) والتشريعات والقوانين المعمول بها في دولة المقر والمعايير المعتمدة لعمل الأوقاف تنطبق هذه السياسة على:',
        ],
        bullets: [
          'كافة الهيئات القيادية للوقف.',
          'جميع العاملين بدوام كامل.',
          'جميع العاملين بدوام جزئي.',
          'جميع المتطوعين في أعمال الوقف.',
          'المؤسسات واللجان التابعة للوقف أو العاملة لصالح الوقف في دولة المقر وفي أي مكان تتواجد فيه هذه المؤسسات واللجان.',
          'تشمل هذه السياسة كافة عمليات الوقف من الإيجاد والتثمير والمصارف وفي مختلف الأوقات والظروف.',
        ],
      },
    ],
  },
  {
    id: 'aml-ctf',
    title: 'سياسة الوقاية من عمليات غسيل الأموال وتمويل الإرهاب',
    summary: 'تحدد الإجراءات الوقائية والعناية الواجبة والتوثيق والشفافية في عمليات الوقف.',
    blocks: [
      {
        heading: 'النطاق',
        paragraphs: [
          'نظراً لتنوع مراحل الوقف وخصوصيتها تشمل هذه السياسة كافة الهيئات القيادية واللجان والعاملين ومن لهم علاقات تعاقدية أو تطوعية أو مزودي الخدمات اللوجستية أو الداعمين وشركاء وقف أُويس القرني.',
        ],
      },
      {
        heading: 'بيان السياسة',
        paragraphs: ['تحدد هذه السياسة طرق الوقاية التي اتخذها الوقف في سبيل مكافحة عمليات غسيل الأموال وجرائم تمويل الإرهاب على النحو التالي:'],
        bullets: [
          'تحديد مخاطر غسيل الأموال وتمويل الإرهاب المتوقعة التي قد يتعرض لها الوقف ودراستها وفهمها.',
          'تطبيق العناية الواجبة التي من شأنها الحد من مخاطر غسيل الأموال وتمويل الإرهاب الخاصة بمجالات عمل الوقف وبرامجه ومشاريعه.',
          'رفع كفاءة العاملين وتدريبهم على هذه السياسة أو أي نشاط فيه شبهة غسيل الأموال وتمويل الإرهاب.',
          'تطوير الإجراءات المعتمدة في تحسين جودة التعرف على العملاء وإجراءات العناية الواجبة.',
          'تعزيز العمل بالسياسة المالية المتوافقة مع سياسة مكافحة غسيل الأموال ومحاربة دعم وتمويل الإرهاب.',
          'توثيق ونشر الإجراءات وآليات الرقابة الداخلية وفق المعايير المعتمدة والقوانين وسياسة الوقف.',
          'التعرف على المستفيد الحقيقي ذو الصفة الطبيعية أو الاعتبارية المستفيد من برامج ومشاريع الوقف.',
          'الاستفادة من القوائم المعممة عبر المؤسسات المالية ذات العلاقة.',
          'اتباع سياسة التوثيق واتخاذ جميع الخطوات المناسبة للتأكد من جميع المعلومات الخاصة بتطبيق مبدأ «اعرف عميلك» المحدد في سياسة العناية الواجبة الواردة في هذا الدليل وتحديثها باستمرار.',
          'جميع قرارات إيجاد الوقف وعمليات التثمير وعمليات التسبيل تلتزم بما ورد في هذه السياسة.',
          'جميع العمليات تتم عبر عقود واتفاقات ومذكرات تفاهم أو مذكرات الإطار العام المتضمنة للشروط والحقوق والواجبات المكتوبة والموقعة مع الشركاء (داعمين ومنفذين).',
          'الاحتفاظ بالعقود والاتفاقيات والسجلات المالية وفقاً للمدد المحددة قانوناً وبما لا يقل عن خمس سنوات.',
          'الالتزام بالإفصاح والشفافية لتلبية جميع طلبات الحصول على أية معلومات قانونية تأتي من الهيئات الحكومية والجهات ذات العلاقة.',
        ],
      },
    ],
  },
  {
    id: 'volunteering',
    title: 'سياسة التطوع',
    summary: 'تحدد مسؤوليات التطوع وبيئة العمل والتحفيز والتأهيل والتواصل مع المتطوعين.',
    blocks: [
      {
        heading: 'النطاق',
        paragraphs: [
          'تحدد هذه السياسة المسؤوليات العامة لعملية التطوع والمسؤوليات المحددة للأطراف في ذلك.',
          'وتطبق هذه السياسة على جميع الأفراد المنخرطين في فرق التطوع التابعة لوقف أُويس القرني في مختلف المناطق.',
        ],
      },
      {
        heading: 'بيان السياسة',
        bullets: [
          'قيم الوقف ومحددات عمله والضوابط الأخلاقية ملزمة لوحدة التطوع في جميع البرامج والأنشطة.',
          'تفعيل طاقات المتطوعين بما يحقق غايات الوقف.',
          'توفير بيئة عمل محفزة وآمنة ومشجعة للمتطوعين.',
          'فرز القدرات والطاقات والمهارات بما يمكن من تحقيق أعلى قدر من الاستفادة من المتطوعين في مختلف المناطق وبما يتناسب مع كل مشروع على حدة.',
          'الالتزام بمعايير وضوابط الوقف عند اختيار المتطوعين.',
          'تأهيل المتطوعين في مجالات مشاركاتهم بحسب المشاريع.',
          'تثقيف المتطوعين وتوعيتهم برؤية ورسالة الوقف وسياسة التطوع.',
          'نلتزم بتكريم المتطوعين وتقدير جهودهم وإبراز المتميزين منهم.',
          'تشجيع ثقافة التطوع في المناسبات المختلفة وعبر منصات الوقف الإلكترونية.',
          'فتح قنوات تواصل فاعلة مع المتطوعين والسماع لمقترحاتهم وآرائهم التطويرية.',
        ],
      },
    ],
  },
  {
    id: 'anti-fraud-corruption',
    title: 'سياسة مكافحة الاحتيال والفساد',
    summary: 'تؤكد الحوكمة الرشيدة والاستقلالية والعناية الواجبة والإجراءات النظامية ضد المخالفات.',
    blocks: [
      {
        heading: 'نطاق السياسة',
        paragraphs: ['يشمل نطاق هذه السياسة الهيئات القيادية وفريق عمل الوقف، ومنها:'],
        bullets: [
          'هيئة المتولين.',
          'مجلس إدارة الوقف.',
          'لجنة الرقابة والتدقيق.',
          'لجنة الاستثمار.',
          'لجنة الخبراء.',
          'مدراء الإدارات.',
          'مسؤولو الأقسام ووحدات العمل.',
          'الموظفون.',
          'المشرفون الخارجيون بعقود دائمة أو مؤقتة.',
          'فرق العمل الطوعية.',
        ],
      },
      {
        heading: 'بيان السياسة',
        paragraphs: [
          'علاقة الوقف بكافة الأطراف ذات العلاقة قائمة على الاستقلالية بما يحقق غايات ومقاصد الوقف وفق السياسات المعتمدة الضامنة لمكافحة الاحتيال والفساد بما يحقق ما يلي:',
        ],
        bullets: [
          'الشفافية والإفصاح بما يتناسب مع احتياجات الأطراف ذات العلاقة داخل وخارج الوقف.',
          'التعامل المهني وفقاً للمعايير والأدلة المعتمدة بما يحقق العدالة والمساواة في الفرص لجميع الأطراف للحصول على الخدمات أو المساهمة في الوقف.',
          'نشر ثقافة الحوكمة.',
          'إجراء العناية الواجبة للطرف الثالث (داعمين، مستفيدين، شركاء، ومقدمي خدمات الدعم اللوجستي).',
          'نشر الوعي المؤسسي لدى فريق العمل بالسياسات المعتمدة.',
          'إعداد برامج التدريب والتوعية لفرق العمل لمكافحة الاحتيال.',
          'الحصول على الإقرارات الكافية أثناء عمليات التوظيف بما يثبت خلو سيرة الموظف من التورط في أي عمليات مشبوهة أو أي نشاط جنائي.',
          'توقيع العاملين على مدونة السلوك والسياسات ذات العلاقة.',
          'المتابعة المستمرة وتقييم مدى الالتزام بالسياسات.',
          'بما لا يتعارض مع الإجراءات القانونية يتخذ الوقف كافة الإجراءات النظامية اللازمة ضد المتورطين والمشتبه بهم أو الذين يثبت عليهم جريمة الاحتيال وفقاً للإجراءات الداخلية للوقف.',
          'يتحمل رئيس مجلس الإدارة إبلاغ هيئة المتولين بأي واقعة احتيال أو اشتباه قد يكون لها تأثير سلبي على أداء الوقف أو اللجان والمشاريع التابعة له أو تؤثر بشكل ما على سمعة الوقف.',
        ],
      },
    ],
  },
  {
    id: 'document-retention',
    title: 'سياسة الاحتفاظ بالوثائق',
    summary: 'تنظم حفظ الوثائق الورقية والإلكترونية وفهرستها والاحتفاظ بها وفق مددها القانونية.',
    blocks: [
      {
        heading: 'نطاق السياسة',
        paragraphs: [
          'جميع الإدارات والوحدات في الوقف واللجان التابعة له تقع في نطاق هذه السياسة بحيث تتحمل كل جهة مسؤولية الاحتفاظ بوثائقها وفقاً لهذه السياسة بما لا يخل بالالتزامات القانونية المحددة لنوع الوثائق ومدد الاحتفاظ بها.',
        ],
      },
      {
        heading: 'بيان سياسة الاحتفاظ بالوثائق',
        bullets: [
          'يجب الاحتفاظ بالوثائق بمختلف أنواعها وفقاً للمدد الزمنية المحددة في القوانين ذات العلاقة.',
          'يتم حفظ كافة وثائق الوقف (الصكوك، السندات، شهادات الاستثمار، السجلات، المحاضر، والمستندات، والتقارير، والوثائق الأخرى) في مقر الوقف.',
          'تنوع أساليب الحفظ بحسب أهمية الوثائق وتكرار الرجوع لها.',
          'تحفظ نسخة من الوثائق بشكل ورقي بالإضافة إلى حفظ نسخ منها إلكترونياً على مختلف الوسائط.',
          'بما لا يتعارض مع خصوصية الوثيقة تحفظ نسخة من الوثائق على الحسابات الإلكترونية الخاصة بالوقف بما يسهل على المخولين باستخدامها من الوصول إليها وقت الحاجة.',
        ],
      },
      {
        heading: 'تشمل هذه الوثائق على سبيل المثال لا الحصر',
        bullets: [
          'وثيقة الوقف (صك الوقف).',
          'لائحة الحوكمة.',
          'اللوائح الداخلية.',
          'مدونة السلوك المهني.',
          'التقارير المالية.',
          'التقارير الإدارية.',
          'المستندات المالية.',
          'ملفات الحسابات.',
          'المراسلات المالية.',
          'صور وثائق مؤسس الوقف.',
          'صور وثائق أعضاء هيئة المتولين.',
          'صور وثائق أعضاء مجلس الإدارة.',
          'ملفات العاملين.',
          'قاعدة بيانات الواقفين مؤسسات وأفراد.',
          'نماذج العمل ومحاضر اجتماعات الهيئات القيادية واللجان التابعة لها.',
          'المخاطبات الداخلية والخارجية.',
          'نماذج ومطبوعات وأدبيات الوقف.',
          'مراعاة مبدأ التأبيد في حفظ الوثائق الأساسية للوقف.',
          'يجب حفظ خطط الوقف ونماذج العمل ودراسات المشاريع وتقارير الإقفال.',
          'يجب حفظ نسخ من جميع إصدارات الوقف المطبوعة بصيغتي Word وPDF بالإضافة إلى النسخ المطبوعة.',
          'يجب حفظ المواد الفلمية الخاصة بالوقف بدقة عالية مع حفظ المواد الأولية لها.',
          'حفظ التصاميم الخاصة بالقلائد والشهادات الخاصة بالمساهمين.',
          'حفظ تصاميم شعار الوقف وكل متعلقات الهوية البصرية والدليل الخاص بها.',
          'حفظ الوثائق يكون وفق منهجية منظمة تسهل الحصول عليها عند الحاجة.',
          'عمل فهرسة كاملة لكل الوثائق المؤرشفة.',
        ],
      },
    ],
  },
];

function translatePolicyTitles(
  translations: Record<string, { title: string; summary: string; blocks: TextBlock[] }>
): Policy[] {
  return arPolicies.map((policy) => ({
    id: policy.id,
    title: translations[policy.id].title,
    summary: translations[policy.id].summary,
    blocks: translations[policy.id].blocks,
  }));
}

const enPolicies = translatePolicyTitles({
  whistleblowing: {
    title: 'Whistleblowing Policy',
    summary: 'Defines covered parties, secure reporting channels, confidentiality, and protection for stakeholders.',
    blocks: [
      {
        heading: 'Policy Scope',
        paragraphs: ['This policy applies to all relevant parties, including beneficiaries of the waqf programs and projects.'],
        bullets: ['Waqf employees.', 'Executive partners.', 'Members of the Board of Trustees.', 'Board members and founders.', 'Committees formed by the Board of Trustees and the Board of Directors.', 'Executive management.'],
      },
      {
        heading: 'Policy Purpose',
        bullets: [
          'Help all relevant parties, including employees and beneficiaries, report to the Board or the competent committee any acts or practices committed by executive management that violate laws, rules, approved regulations, or waqf values.',
          'Provide an environment that preserves the confidentiality of reporting procedures in an easy and secure way.',
          'Provide the necessary protection for concerned parties, including the safeguards stated in the Conflict of Interest Policy.',
          'Enable employees to report verified violations to higher levels if the competent authority does not address them.',
        ],
      },
    ],
  },
  'conflict-of-interest': {
    title: 'Conflict of Interest Policy',
    summary: 'Regulates the waqf relationship with people and entities working with or for it and protects rights and reputation.',
    blocks: [
      {
        heading: 'Policy Scope',
        paragraphs: [
          'Without prejudice to applicable laws in the host country and the standards governing waqfs and civil society organizations, this policy applies to waqf leadership bodies, employees, committees, volunteers, waqf partners, and executive partners in areas where waqf programs are delivered to beneficiaries.',
        ],
        bullets: ['All waqf leadership bodies, branches, representative offices, and higher committees.', 'All full-time employees.', 'All part-time employees.', 'All waqf volunteers.'],
      },
      { paragraphs: ['This policy covers all waqf operations and programs in all times and circumstances.'] },
      {
        heading: 'Policy Purpose',
        paragraphs: [
          'The policy aims to manage the interests of the different relevant parties by preventing practices that constitute or may be interpreted as conflicts of interest. This includes people and relevant parties, decision-makers or those influencing them, and the interests of any person personally connected to them, including spouses, children, parents, siblings, or other family members up to the third degree.',
          'The Conflict of Interest Policy is a governing document for Veysel Karani Waqf because it protects rights and prevents reputation, investment, or contracting risks that may be classified or interpreted as conflicts of interest. It therefore regulates the waqf relationship with entities and people working with it or for it, and with related decisions such as appointments, permanent or temporary employment contracts, partnership agreements, and other decisions.',
        ],
      },
    ],
  },
  'transparency-disclosure': {
    title: 'Transparency and Disclosure Policy',
    summary: 'Strengthens sound procedures, accountability, and mutual trust with stakeholders.',
    blocks: [
      {
        heading: 'Policy Scope',
        paragraphs: ['All waqf leadership bodies, boards, committees, departments, units, and executive committees fall within this policy and must observe transparency and disclose to internal and external stakeholders through authorized disclosure channels only.'],
      },
      {
        heading: 'Policy Statement',
        paragraphs: ['The policy safeguards procedures and professionalism across all aspects of waqf work, and strengthens accountability and mutual trust between the waqf and stakeholders.', 'Employees and those working for the waqf are expected to:'],
        bullets: ['Disclose their current jobs and relationships with waqfs, organizations, associations, and entities working in the waqf fields.', 'Announce standards for selections, tenders, choices, and any competitive process for waqf services so everyone has equal opportunities.', 'Be familiar with waqf systems, regulations, and everything related to their role.', 'Apply standards professionally in all operations without bias or favoritism.', 'Announce evaluation criteria for programs, activities, and events before implementation to help ensure compliance.', 'Report violations when they occur.', 'Provide documents to relevant parties when requested.'],
      },
    ],
  },
  compliance: {
    title: 'Compliance Policy',
    summary: 'Connects waqf operations to approved policies, laws, regulations, and sector standards.',
    blocks: [
      {
        heading: 'Policy Purpose',
        paragraphs: ['This policy aims to achieve the highest level of institutional work and best practices at all levels of Veysel Karani Waqf through compliance with the policies in this guide and with legislation, laws, and standards approved by relevant local and regional bodies, protecting the interests of stakeholders inside and outside the waqf.'],
      },
      {
        heading: 'Policy References',
        bullets: ['Host country law.', 'Waqf deed.', 'Law No. 23 of 1992 and its amendments by Republican Decree No. 32 of 2008 concerning the charitable waqf.', 'Relevant Islamic jurisprudence academy resolutions.', 'Standards of Arab and Islamic bodies regulating waqf and humanitarian work.', 'Financial Action Task Force (FATF) standards.'],
      },
      {
        heading: 'Policy Scope',
        paragraphs: ['This policy is governing and comprehensive. It covers all administrative levels, committees, and newly established entities of the waqf. It governs the conduct of Veysel Karani Waqf bodies from the highest level, including the higher waqf body, the founder, the Board of Trustees, and all bodies, councils, and committees created by the Board of Trustees, whether executive, oversight, or supporting bodies such as the Board of Directors, Audit Committee, Investment Committee, Experts Committee, Supervisory Committee, branches, representative offices, or any supporting or partner components in the host country or abroad.'],
      },
    ],
  },
  'risk-management': {
    title: 'Risk Management Policy',
    summary: 'Keeps decisions and operations governed by clear standards and risk awareness across all waqf stages.',
    blocks: [
      {
        heading: 'Policy Purpose',
        paragraphs: ['The Risk Management Policy deepens institutional work so waqf decisions are governed by clear, defined, unbiased standards and are away from personal influence. Individual preferences remain subject to governing standards, principles, and policies.', 'To achieve this, the following must be observed:'],
        bullets: ['Observe the waqf purposes in every decision and operation carried out directly or through partners.', 'Commit to the approved and announced waqf tracks.', 'Work according to Sharia controls regulating waqf activities.', 'Continuously verify compliance with laws regulating waqf work.', 'All waqf committees consider risk management in decisions related to establishment, investment, and disbursement.', 'Identify expected risks before implementing any project and identify proposed alternatives for approval or prevention.', 'Disclose risks when they occur.', 'Select partners, whether supporters or implementers, according to the due diligence policy.', 'Organize decision-making and voting according to approved charters of leadership bodies, committee policies, and related conflict of interest procedures.', 'Organize recruitment and selection of beneficiaries and executive partners according to the approved due diligence policy.', 'Conflict of interest, anti-corruption, anti-fraud, and counter-terrorism financing policies help avoid potential risks.'],
      },
      {
        heading: 'Policy Scope',
        paragraphs: ['Without prejudice to the waqf deed, applicable laws in the host country, and approved waqf standards, this policy applies to:'],
        bullets: ['All waqf leadership bodies.', 'All full-time employees.', 'All part-time employees.', 'All waqf volunteers.', 'Institutions and committees affiliated with or working for the waqf in the host country or anywhere they operate.', 'All waqf operations, including establishment, investment, and disbursement, in all times and circumstances.'],
      },
    ],
  },
  'aml-ctf': {
    title: 'Anti-Money Laundering and Counter-Terrorism Financing Policy',
    summary: 'Defines preventive measures, due diligence, documentation, transparency, and legal cooperation.',
    blocks: [
      { heading: 'Scope', paragraphs: ['Due to the diversity and specificity of waqf stages, this policy covers all leadership bodies, committees, employees, contractual or volunteer relationships, logistics service providers, supporters, and partners of Veysel Karani Waqf.'] },
      {
        heading: 'Policy Statement',
        paragraphs: ['This policy defines the preventive methods adopted by the waqf to combat money laundering and terrorism financing crimes as follows:'],
        bullets: ['Identify, study, and understand expected money laundering and terrorism financing risks that the waqf may face.', 'Apply due diligence to reduce these risks in the waqf fields, programs, and projects.', 'Raise staff capacity and train them on this policy and on any activity suspected of money laundering or terrorism financing.', 'Develop procedures for improving customer identification and due diligence.', 'Strengthen the financial policy aligned with anti-money laundering and counter-terrorism financing requirements.', 'Document and publish internal control procedures and mechanisms according to approved standards, laws, and waqf policy.', 'Identify the true natural or legal beneficiary of waqf programs and projects.', 'Use lists circulated by relevant financial institutions.', 'Follow documentation practices and take all appropriate steps to verify information related to the Know Your Customer principle in the due diligence policy and keep it updated.', 'All decisions on establishing the waqf, investment operations, and disbursement comply with this policy.', 'All operations are conducted through written and signed contracts, agreements, memoranda of understanding, or framework memoranda with partners, supporters, and implementers.', 'Keep contracts, agreements, and financial records for the legally required periods and for at least five years.', 'Comply with disclosure and transparency to meet lawful information requests from governmental and related bodies.'],
      },
    ],
  },
  volunteering: {
    title: 'Volunteering Policy',
    summary: 'Defines volunteering responsibilities, a safe work environment, training, appreciation, and communication.',
    blocks: [
      { heading: 'Scope', paragraphs: ['This policy defines the general responsibilities of volunteering and the specific responsibilities of the parties involved.', 'It applies to all individuals engaged in volunteer teams affiliated with Veysel Karani Waqf in different regions.'] },
      {
        heading: 'Policy Statement',
        bullets: ['Waqf values, work parameters, and ethical controls are binding on the volunteer unit in all programs and activities.', 'Activate volunteer capacities in a way that achieves waqf purposes.', 'Provide a motivating, safe, and encouraging work environment for volunteers.', 'Sort abilities, energies, and skills to achieve the highest benefit from volunteers in different regions according to each project.', 'Commit to waqf standards and controls when selecting volunteers.', 'Qualify volunteers in their fields of participation according to projects.', 'Educate volunteers about the waqf vision, mission, and volunteering policy.', 'Honor volunteers, appreciate their efforts, and highlight outstanding volunteers.', 'Encourage a culture of volunteering on different occasions and through waqf electronic platforms.', 'Open active communication channels with volunteers and listen to their suggestions and development ideas.'],
      },
    ],
  },
  'anti-fraud-corruption': {
    title: 'Anti-Fraud and Anti-Corruption Policy',
    summary: 'Affirms sound governance, independence, due diligence, awareness, and formal measures against violations.',
    blocks: [
      { heading: 'Policy Scope', paragraphs: ['This policy covers leadership bodies and the waqf work team, including:'], bullets: ['Board of Trustees.', 'Waqf Board of Directors.', 'Oversight and Audit Committee.', 'Investment Committee.', 'Experts Committee.', 'Department managers.', 'Section and work unit officers.', 'Employees.', 'External supervisors under permanent or temporary contracts.', 'Volunteer teams.'] },
      {
        heading: 'Policy Statement',
        paragraphs: ['The waqf relationship with all stakeholders is based on independence in a way that achieves the waqf purposes and objectives under approved policies that guard against fraud and corruption, including:'],
        bullets: ['Transparency and disclosure according to stakeholder needs inside and outside the waqf.', 'Professional dealing according to approved standards and guides to achieve justice and equal opportunities for all parties to receive services or contribute to the waqf.', 'Promote a culture of governance.', 'Conduct due diligence for third parties, including supporters, beneficiaries, partners, and logistics support providers.', 'Spread institutional awareness among the work team about approved policies.', 'Prepare training and awareness programs for work teams to combat fraud.', 'Obtain adequate declarations during recruitment proving that an employee has not been involved in suspicious operations or criminal activity.', 'Have workers sign the code of conduct and related policies.', 'Continuously monitor and evaluate compliance with policies.', 'Without prejudice to legal procedures, the waqf takes all necessary formal measures against those involved, suspected, or proven to have committed fraud according to internal procedures.', 'The Chair of the Board is responsible for informing the Board of Trustees of any fraud incident or suspicion that may negatively affect waqf performance, affiliated committees and projects, or waqf reputation.'],
      },
    ],
  },
  'document-retention': {
    title: 'Document Retention Policy',
    summary: 'Organizes paper and electronic document retention, indexing, and preservation according to legal periods.',
    blocks: [
      { heading: 'Policy Scope', paragraphs: ['All waqf departments, units, and committees fall within this policy. Each party is responsible for retaining its documents according to this policy without prejudice to legal obligations related to document type and retention periods.'] },
      { heading: 'Document Retention Statement', bullets: ['Documents of all types must be retained according to legally defined periods.', 'All waqf documents, including deeds, bonds, investment certificates, records, minutes, documents, reports, and other documents, are kept at the waqf headquarters.', 'Retention methods vary according to document importance and frequency of reference.', 'A paper copy is kept in addition to electronic copies on various media.', 'Without violating document privacy, a copy is kept on waqf electronic accounts so authorized users can access it when needed.'] },
      { heading: 'Documents include, but are not limited to', bullets: ['Waqf deed.', 'Governance regulation.', 'Internal regulations.', 'Code of professional conduct.', 'Financial reports.', 'Administrative reports.', 'Financial documents.', 'Account files.', 'Financial correspondence.', 'Copies of the founder documents.', 'Copies of Board of Trustees members documents.', 'Copies of Board of Directors members documents.', 'Employee files.', 'Database of individual and institutional endowers.', 'Work templates and minutes of leadership bodies and their committees.', 'Internal and external correspondence.', 'Waqf templates, print materials, and literature.', 'Observe the principle of perpetuity in preserving basic waqf documents.', 'Keep waqf plans, work templates, project studies, and closing reports.', 'Keep copies of all printed waqf publications in Word and PDF in addition to printed copies.', 'Keep waqf film materials in high resolution and preserve their raw materials.', 'Keep designs for contributor medals and certificates.', 'Keep waqf logo designs, visual identity materials, and the related guide.', 'Retain documents according to an organized methodology that makes access easy when needed.', 'Prepare complete indexing for all archived documents.'] },
    ],
  },
});

const trPolicies = translatePolicyTitles({
  whistleblowing: {
    title: 'İhlal Bildirim Politikası',
    summary: 'Kapsamdaki tarafları, güvenli bildirim yöntemini, gizliliği ve ilgili tarafların korunmasını tanımlar.',
    blocks: [
      { heading: 'Politikanın Kapsamı', paragraphs: ['Bu politika, vakfın program ve projelerinden yararlananlar dahil tüm ilgili tarafları kapsar.'], bullets: ['Vakfın çalışanları.', 'Yürütücü ortaklar.', 'Mütevelli Heyeti üyeleri.', 'Yönetim Kurulu üyeleri ve kurucular.', 'Mütevelli Heyeti ve Yönetim Kurulundan doğan komite üyeleri.', 'İcra yönetimi.'] },
      { heading: 'Politikanın Amacı', bullets: ['Çalışanlar ve yararlanıcılar dahil ilgili tüm tarafların, icra yönetimi tarafından işlenen ve yürürlükteki kanunları, kuralları, onaylı düzenlemeleri veya vakıf değerlerini ihlal eden fiil ve uygulamaları Yönetim Kuruluna veya yetkili komiteye bildirmesine yardımcı olmak.', 'Bildirim süreçlerinin gizliliğini kolay ve güvenli şekilde koruyan bir ortam sağlamak.', 'Menfaat Çatışması Politikasındaki kontroller dahil ilgili taraflara gerekli korumayı sağlamak.', 'Yetkili birim tarafından giderilmeyen doğrulanmış ihlallerin çalışanlar tarafından daha üst düzeylere bildirilmesini sağlamak.'] },
    ],
  },
  'conflict-of-interest': {
    title: 'Menfaat Çatışması Politikası',
    summary: 'Vakfın birlikte çalıştığı kişi ve kurumlarla ilişkisini düzenler, hakları ve itibarı korur.',
    blocks: [
      { heading: 'Politikanın Kapsamı', paragraphs: ['Merkez ülkesindeki geçerli mevzuat ve vakıflar ile sivil toplum kuruluşlarının menfaat çatışmasını düzenleyen standartları saklı kalmak üzere bu politika; vakıf liderlik organları, tüm çalışanlar, komiteler, gönüllüler, vakıf ortakları ve programların sunulduğu bölgelerdeki yürütücü ortaklar için uygulanır.'], bullets: ['Vakfın tüm liderlik organları, şubeleri, temsilcilikleri ve üst komiteleri.', 'Tam zamanlı çalışanların tamamı.', 'Yarı zamanlı çalışanların tamamı.', 'Vakfın tüm gönüllüleri.'] },
      { paragraphs: ['Bu politika vakfın tüm operasyonlarını ve programlarını her zaman ve her koşulda kapsar.'] },
      { heading: 'Politikanın Amacı', paragraphs: ['Politika, menfaat çatışması sayılan veya öyle yorumlanabilecek uygulamaları engelleyerek ilgili tarafların menfaatlerini yönetmeyi amaçlar. Bu kapsam karar vericiler, onları etkileyen kişiler ve eşler, çocuklar, anne-baba, kardeşler veya üçüncü dereceye kadar aile üyeleri gibi kişisel bağlantısı olanların menfaatlerini içerir.', 'Menfaat Çatışması Politikası, Veysel Karani Vakfı için hakları koruyan ve itibar, yatırım ya da sözleşme risklerini önleyen yönetici belgelerden biridir. Atama kararları, daimi ya da geçici iş sözleşmeleri, ortaklık anlaşmaları ve benzeri kararlar dahil vakıf adına ya da vakıfla çalışan kişi ve kurumlarla ilişkiyi düzenler.'] },
    ],
  },
  'transparency-disclosure': {
    title: 'Şeffaflık ve Açıklama Politikası',
    summary: 'Süreç güvenliğini, hesap verebilirliği ve ilgili taraflarla karşılıklı güveni güçlendirir.',
    blocks: [
      { heading: 'Politikanın Kapsamı', paragraphs: ['Vakfın tüm liderlik organları, kurulları, komiteleri, idareleri, birimleri ve yürütme komiteleri bu politika kapsamındadır; iç ve dış ilgili taraflara yalnızca yetkilendirilmiş açıklama kanalları üzerinden şeffaflık ve açıklama yükümlülüğüne uyarlar.'] },
      { heading: 'Politika Beyanı', paragraphs: ['Şeffaflık ve açıklama politikası, vakıf çalışmalarının tüm yönlerinde süreçlerin güvenliğini ve profesyonelliği korur; vakıf ile ilgili taraflar arasında hesap verebilirliği ve karşılıklı güveni güçlendirir.', 'Vakfın çalışanlarından veya vakıf adına çalışanlardan beklenenler:'], bullets: ['Mevcut görevlerini ve vakıflar, kuruluşlar, dernekler ve vakıf çalışma alanlarında faaliyet gösteren kurumlarla ilişkilerini açıklamak.', 'Herkese eşit fırsat sağlamak için seçim, ihale, tercih ve vakıf hizmetlerine ilişkin tüm rekabet süreçlerinin kriterlerini duyurmak.', 'Vakfın sistemleri, yönetmelikleri ve görevle ilgili her konuda bilgi sahibi olmak.', 'Tüm işlemlerde standartları tarafsız ve kayırmadan profesyonelce uygulamak.', 'Program, faaliyet ve etkinlik değerlendirme maddelerini uygulamadan önce ilan ederek uyumu kolaylaştırmak.', 'İhlaller meydana geldiğinde bildirmek.', 'Talep edildiğinde ilgili taraflara belgeleri sağlamak.'] },
    ],
  },
  compliance: {
    title: 'Uyum Politikası',
    summary: 'Vakıf çalışmalarını onaylı politikalar, mevzuat ve ilgili standartlarla ilişkilendirir.',
    blocks: [
      { heading: 'Politikanın Amacı', paragraphs: ['Bu politika, Veysel Karani Vakfının tüm düzeylerinde en yüksek kurumsallığı ve en iyi uygulamaları gerçekleştirmek için bu kılavuzdaki politikalara, mevzuata ve ilgili yerel ve bölgesel kurumların onaylı standartlarına uyumu sağlamayı; vakıf içindeki ve dışındaki tüm ilgili tarafların menfaatlerini korumayı amaçlar.'] },
      { heading: 'Politikanın Dayanakları', bullets: ['Merkez ülke kanunu.', 'Vakıf belgesi (vakıf senedi).', 'Şerî vakıf hakkındaki 1992 tarihli 23 sayılı kanun ve 2008 tarihli 32 sayılı Cumhurbaşkanlığı kararıyla yapılan değişiklikleri.', 'İlgili fıkıh akademilerinin kararları.', 'Arap ve İslam dünyasında vakıf ve insani çalışma alanını düzenleyen kurumların standartları.', 'Mali Eylem Görev Gücü FATF standartları.'] },
      { heading: 'Politikanın Kapsamı', paragraphs: ['Bu politika bağlayıcı ve kapsamlıdır. Vakfın tüm idari düzeyleri, komiteleri ve sonradan oluşturulan yapıları bu kapsamdadır. Veysel Karani Vakfının en üst düzeyi olan vakıf üst kurulu, kurucu, Mütevelli Heyeti ve Mütevelli Heyetinden doğan tüm organlar, kurullar ve komiteler; Yönetim Kurulu, Denetim Komitesi, Yatırım Komitesi, Uzmanlar Komitesi, Gözetim Komitesi, şubeler ve temsilcilikler gibi icrai, denetleyici veya destekleyici yapılar ile merkez ülkede veya dışında vakfı destekleyen ya da vakıfla ortak çalışan yapılar bu politika tarafından yönetilir.'] },
    ],
  },
  'risk-management': {
    title: 'Risk Yönetimi Politikası',
    summary: 'Karar ve işlemleri net standartlara ve vakfın tüm aşamalarında risk bilincine bağlar.',
    blocks: [
      { heading: 'Politikanın Amacı', paragraphs: ['Risk Yönetimi Politikası, vakıfta kurumsal çalışmayı derinleştirerek kararların açık, belirli, tarafsız ve kişisel etkilerden uzak standartlarla alınmasını sağlar; bireysel iradeler bu standart, ilke ve yönetici politikalara tabi olur.', 'Bunu gerçekleştirmek için aşağıdakilere uyulur:'], bullets: ['Vakfın doğrudan veya ortakları aracılığıyla yürüttüğü tüm karar ve işlemlerde vakıf amaçlarını gözetmek.', 'Onaylı ve ilan edilmiş vakıf yollarına bağlı kalmak.', 'Vakıf çalışmalarını düzenleyen şerî kontrollere göre çalışmak.', 'Vakıf çalışmalarını düzenleyen kanunlara sürekli uyumu doğrulamak.', 'Vakfın tüm komitelerinin, kurma, yatırım veya sarf kararlarında risk yönetimi politikasını dikkate alması.', 'Her proje uygulanmadan önce beklenen riskleri ve onay ya da ret için önerilen alternatifleri belirlemek.', 'Riskler gerçekleştiğinde açıklama yapmak.', 'Destekçi veya uygulayıcı ortak seçimini gerekli özen politikasına tabi tutmak.', 'Karar alma ve oylamayı liderlik organlarının onaylı sözleşmelerine, komite politikalarına ve bu kılavuzdaki menfaat çatışması prosedürlerine göre düzenlemek.', 'İşe alım, yararlanıcı ve yürütücü ortak seçimini onaylı gerekli özen politikasına göre düzenlemek.', 'Menfaat çatışması, yolsuzluk ve dolandırıcılıkla mücadele ve terörizmin finansmanıyla mücadele politikaları muhtemel riskleri önlemeyi güvence altına alır.'] },
      { heading: 'Politikanın Kapsamı', paragraphs: ['Vakıf senedi, merkez ülkesindeki geçerli mevzuat ve onaylı vakıf standartları saklı kalmak üzere bu politika aşağıdakilere uygulanır:'], bullets: ['Vakfın tüm liderlik organları.', 'Tam zamanlı çalışanların tamamı.', 'Yarı zamanlı çalışanların tamamı.', 'Vakfın tüm gönüllüleri.', 'Merkez ülkede veya bulundukları herhangi bir yerde vakfa bağlı ya da vakıf adına çalışan kurum ve komiteler.', 'Kurma, yatırım ve sarf dahil vakfın tüm işlemleri, her zaman ve her koşulda bu politikanın kapsamındadır.'] },
    ],
  },
  'aml-ctf': {
    title: 'Kara Para Aklama ve Terörizmin Finansmanını Önleme Politikası',
    summary: 'Önleyici tedbirleri, gerekli özeni, belgelendirmeyi, şeffaflığı ve yasal iş birliğini tanımlar.',
    blocks: [
      { heading: 'Kapsam', paragraphs: ['Vakfın aşamalarının çeşitliliği ve özel niteliği nedeniyle bu politika, Veysel Karani Vakfının tüm liderlik organlarını, komitelerini, çalışanlarını, sözleşmeli veya gönüllü ilişkilerini, lojistik hizmet sağlayıcılarını, destekçilerini ve ortaklarını kapsar.'] },
      { heading: 'Politika Beyanı', paragraphs: ['Bu politika, vakfın kara para aklama ve terörizmin finansmanı suçlarıyla mücadele için aldığı önleyici yöntemleri şöyle belirler:'], bullets: ['Vakfın karşılaşabileceği kara para aklama ve terörizmin finansmanı risklerini belirlemek, incelemek ve anlamak.', 'Vakfın çalışma alanları, programları ve projelerine ilişkin riskleri azaltacak gerekli özeni uygulamak.', 'Çalışanların bu politika ve şüpheli faaliyetler konusunda kapasitesini artırmak ve eğitim vermek.', 'Müşteri tanıma ve gerekli özen süreçlerinin kalitesini artıran prosedürleri geliştirmek.', 'Kara para aklama ve terörizmin finansmanıyla mücadele politikasıyla uyumlu mali politika uygulamasını güçlendirmek.', 'İç kontrol prosedür ve mekanizmalarını onaylı standartlar, kanunlar ve vakıf politikası uyarınca belgelemek ve yayımlamak.', 'Vakfın program ve projelerinden yararlanan gerçek veya tüzel nihai faydalanıcıyı tanımak.', 'İlgili finans kuruluşları tarafından yayımlanan listelerden yararlanmak.', 'Bu kılavuzdaki gerekli özen politikasında yer alan Müşterini Tanı ilkesi için tüm uygun adımları atmak, bilgileri doğrulamak ve sürekli güncellemek.', 'Vakfı kurma kararları, yatırım işlemleri ve sarf işlemleri bu politikaya uyar.', 'Tüm işlemler destekçi ve uygulayıcı ortaklarla yazılı ve imzalı sözleşme, anlaşma, mutabakat zaptı veya çerçeve metinleri üzerinden yürütülür.', 'Sözleşmeler, anlaşmalar ve mali kayıtlar yasal süreler boyunca ve en az beş yıl saklanır.', 'Devlet kurumları ve ilgili taraflardan gelen yasal bilgi taleplerini karşılamak için açıklama ve şeffaflık ilkelerine uyulur.'] },
    ],
  },
  volunteering: {
    title: 'Gönüllülük Politikası',
    summary: 'Gönüllülüğün sorumluluklarını, güvenli çalışma ortamını, eğitimi, takdiri ve iletişimi tanımlar.',
    blocks: [
      { heading: 'Kapsam', paragraphs: ['Bu politika gönüllülük sürecinin genel sorumluluklarını ve tarafların özel sorumluluklarını tanımlar.', 'Farklı bölgelerde Veysel Karani Vakfına bağlı gönüllü ekiplerine katılan tüm bireylere uygulanır.'] },
      { heading: 'Politika Beyanı', bullets: ['Vakfın değerleri, çalışma sınırları ve ahlaki kontrolleri tüm program ve faaliyetlerde gönüllülük birimi için bağlayıcıdır.', 'Gönüllülerin kapasitelerini vakfın amaçlarını gerçekleştirecek şekilde harekete geçirmek.', 'Gönüllüler için motive edici, güvenli ve teşvik edici bir çalışma ortamı sağlamak.', 'Farklı bölgelerde ve her projeye uygun biçimde gönüllülerden en yüksek yararı sağlamak için yetenek, enerji ve becerileri ayrıştırmak.', 'Gönüllü seçiminde vakıf standart ve kontrollerine bağlı kalmak.', 'Gönüllüleri projelere göre katılım alanlarında yetiştirmek.', 'Gönüllüleri vakfın vizyonu, misyonu ve gönüllülük politikası hakkında bilgilendirmek.', 'Gönüllüleri onurlandırmak, emeklerini takdir etmek ve başarılı olanları öne çıkarmak.', 'Farklı vesilelerle ve vakfın elektronik platformları üzerinden gönüllülük kültürünü teşvik etmek.', 'Gönüllülerle etkili iletişim kanalları açmak, öneri ve geliştirme görüşlerini dinlemek.'] },
    ],
  },
  'anti-fraud-corruption': {
    title: 'Dolandırıcılık ve Yolsuzlukla Mücadele Politikası',
    summary: 'İyi yönetişimi, bağımsızlığı, gerekli özeni, farkındalığı ve ihlallere karşı resmi önlemleri vurgular.',
    blocks: [
      { heading: 'Politikanın Kapsamı', paragraphs: ['Bu politika vakfın liderlik organlarını ve çalışma ekibini kapsar; bunlar arasında şunlar vardır:'], bullets: ['Mütevelli Heyeti.', 'Vakıf Yönetim Kurulu.', 'Gözetim ve Denetim Komitesi.', 'Yatırım Komitesi.', 'Uzmanlar Komitesi.', 'İdare müdürleri.', 'Bölüm ve iş birimi sorumluları.', 'Çalışanlar.', 'Daimi veya geçici sözleşmeli dış denetçiler.', 'Gönüllü çalışma ekipleri.'] },
      { heading: 'Politika Beyanı', paragraphs: ['Vakfın tüm ilgili taraflarla ilişkisi, vakfın amaç ve gayelerini gerçekleştiren ve dolandırıcılık ile yolsuzluğu önlemeyi güvence altına alan onaylı politikalar uyarınca bağımsızlığa dayanır. Bu kapsamda:'], bullets: ['Vakıf içi ve dışı ilgili tarafların ihtiyaçlarına uygun şeffaflık ve açıklama.', 'Hizmet alma veya vakfa katkıda bulunma konusunda tüm taraflar için adalet ve fırsat eşitliği sağlayan onaylı standart ve kılavuzlara göre profesyonel yaklaşım.', 'Yönetişim kültürünü yaymak.', 'Destekçiler, yararlanıcılar, ortaklar ve lojistik destek sağlayıcıları dahil üçüncü taraf için gerekli özen yürütmek.', 'Çalışma ekibinde onaylı politikalar hakkında kurumsal farkındalık yaymak.', 'Dolandırıcılıkla mücadele için ekip eğitim ve farkındalık programları hazırlamak.', 'İşe alım sırasında çalışanın şüpheli işlem veya herhangi bir suç faaliyetine karışmadığını gösteren yeterli beyanları almak.', 'Çalışanların davranış kuralları ve ilgili politikaları imzalamasını sağlamak.', 'Politikalara uyumu sürekli izlemek ve değerlendirmek.', 'Yasal işlemlerle çelişmemek kaydıyla vakıf, iç prosedürlerine göre dolandırıcılığa karışan, şüpheli görülen veya suçu sabit olanlar hakkında gerekli resmi önlemleri alır.', 'Yönetim Kurulu Başkanı, vakfın performansını, bağlı komite ve projeleri veya itibarını olumsuz etkileyebilecek herhangi bir dolandırıcılık olayı ya da şüphesini Mütevelli Heyetine bildirmekle yükümlüdür.'] },
    ],
  },
  'document-retention': {
    title: 'Belge Saklama Politikası',
    summary: 'Basılı ve elektronik belgelerin yasal sürelerine göre saklanmasını, indekslenmesini ve korunmasını düzenler.',
    blocks: [
      { heading: 'Politikanın Kapsamı', paragraphs: ['Vakfın tüm idareleri, birimleri ve komiteleri bu politika kapsamındadır. Her taraf, belge türü ve saklama sürelerine ilişkin yasal yükümlülükleri ihlal etmeden belgelerini bu politikaya göre saklamakla sorumludur.'] },
      { heading: 'Belge Saklama Beyanı', bullets: ['Belgeler, ilgili kanunlarda belirlenen sürelere göre farklı türleriyle saklanmalıdır.', 'Vakıf belgelerinin tamamı, vakıf senetleri, belgeler, yatırım sertifikaları, kayıtlar, tutanaklar, raporlar ve diğer belgeler dahil vakıf merkezinde saklanır.', 'Saklama yöntemleri belgenin önemine ve başvuru sıklığına göre çeşitlenir.', 'Basılı kopya yanında farklı ortamlarda elektronik kopyalar saklanır.', 'Belge gizliliğine aykırı olmayacak şekilde, yetkililerin ihtiyaç anında erişebilmesi için vakfın elektronik hesaplarında bir kopya tutulur.'] },
      { heading: 'Belgeler örnek olarak şunları içerir', bullets: ['Vakıf belgesi.', 'Yönetişim yönetmeliği.', 'İç yönetmelikler.', 'Mesleki davranış kuralları.', 'Mali raporlar.', 'İdari raporlar.', 'Mali belgeler.', 'Hesap dosyaları.', 'Mali yazışmalar.', 'Vakıf kurucusunun belgelerinin kopyaları.', 'Mütevelli Heyeti üyelerinin belge kopyaları.', 'Yönetim Kurulu üyelerinin belge kopyaları.', 'Çalışan dosyaları.', 'Kurumsal ve bireysel bağışçı/verici veri tabanı.', 'Liderlik organları ve komitelerinin iş formları ve toplantı tutanakları.', 'İç ve dış yazışmalar.', 'Vakıf formları, basılı materyalleri ve literatürü.', 'Temel vakıf belgelerinin saklanmasında süreklilik ilkesini gözetmek.', 'Vakıf planları, iş formları, proje çalışmaları ve kapanış raporlarını saklamak.', 'Vakfın tüm basılı yayınlarının Word ve PDF kopyalarını, basılı kopyalarla birlikte saklamak.', 'Vakfa ait film materyallerini yüksek çözünürlükte ve ham materyalleriyle birlikte saklamak.', 'Katılımcı madalyaları ve sertifikalarına ait tasarımları saklamak.', 'Vakıf logosu tasarımları, görsel kimlik materyalleri ve ilgili kılavuzu saklamak.', 'Belgeleri ihtiyaç anında kolay erişim sağlayan düzenli bir metodolojiye göre saklamak.', 'Arşivlenen tüm belgeler için tam indeksleme yapmak.'] },
    ],
  },
});

export const aboutPages: Record<Locale, AboutPagesContent> = {
  ar: {
    nav: [
      { label: 'وقف أويس', href: aboutRoutes.waqf },
      { label: 'نظام الحوكمة', href: aboutRoutes.governance },
    ],
    waqf: {
      seo: {
        title: 'وقف أويس | وقف أويس القرني',
        description: 'تعريف بوقف أويس القرني، ترخيصه، غاياته، قيمه، منهجيته، كلمة رئيس الوقف، والدورة الوقفية.',
        canonical: assets.waqfSource,
      },
      hero: {
        title: 'وقف أويس',
        description: 'مؤسسة تنموية ذات طبيعة وقفية لإيجاد أكبر وقف نوعي تشاركي في تاريخ اليمن.',
        image: assets.waqfHero,
        imageAlt: 'وقف أويس',
      },
      breadcrumbs: [
        { label: 'الرئيسية', href: '/' },
        { label: 'عن الوقف' },
        { label: 'وقف أويس' },
      ],
      intro: {
        eyebrow: 'من نحن',
        title: 'وقف أويس القرني',
        paragraphs: [
          'مؤسسة تنموية ذات طبيعة وقفية لإيجاد أكبر وقف نوعي تشاركي في تاريخ اليمن يعود ريعه على برامج النهوض الحضاري ومساراته، يسهم في إيجاده وتنميته كافة اليمنيين ومحبي اليمن في العالم، بوصفه مؤسسة مالية استثمارية وقفية.',
          'تأسس الوقف في مدينة إسطنبول التركية ومُنِح الترخيص له بحكم من المحكمة بتاريخ 27 مارس 2017م وفق قانون الوقف التركي الذي يُعد من أقوى قوانين الوقف في العالم ما يضمن استدامة الوقف وتنمية موارده، ويسمح بتثمير أمواله وتطوير أصوله في مجالات الاستثمار المتنوعة داخل تركيا وخارجها.',
          'تم البناء المؤسسي للوقف ولوائحه وأنظمته وخططه في العام 2018م، وبدأ إشهار الوقف والتعريف به وتسويقيه مطلع العام 2019م.',
        ],
        facts: [
          { label: 'رقم الترخيص', value: '6222' },
          { label: 'رقم قرار الحكم من المحكمة', value: '2016/223-2016/501' },
          { label: 'الرقم الضريبي', value: '9250524198' },
          { label: 'الحالة الضريبية', value: 'معفي من الضرائب' },
        ],
        downloadLabel: 'حمل الملف التعريفي',
        downloadUrl: assets.profileFileAr,
      },
      video: {
        title: 'الفيديو التعريفي',
        description: 'الفيديو الموجود في صفحة وقف أويس للتعريف برسالة الوقف ومجالات عمله.',
        videoId: 'dvDQGL8IWX8',
        sourceUrl: assets.videoSource,
      },
      goals: {
        eyebrow: 'هويتنا',
        title: 'غاياتنا',
        description:
          'رؤية ورسالة وغايات وقيم تشكّل معًا هوية وقف أويس، وتوجّه عمله نحو بناء أكبر وقف في تاريخ اليمن بمساهمة كل اليمنيين ومحبي اليمن.',
        items: [
          'إيجاد الوقف بمساهمة كل اليمنيين ومحبي اليمن حول العالم، وتنمية موارده كمؤسسة مالية استثمارية وقفية.',
          'تعزيز الروح الوطنية لدى اليمنيين كشركاء في إيجاد أكبر وقف في تاريخ اليمن بمساهمتهم جميعًا.',
          'ترسيخ الهُوية الوطنية الجامعة وتحقيق التنمية المستدامة لليمن.',
        ],
      },
      identity: {
        valuesTitle: 'قيمنا',
        values: ['المبادرة', 'الطموح', 'الشراكة', 'الشفافية', 'المؤسسية', 'الاستدامة'],
        missionTitle: 'رسالتنا',
        mission:
          'صنع أوعية وقفية استثمارية مبتكرة تؤمن موارد النهوض الحضاري لليمن، نتكامل مع شركائنا في بناء القدرات، والبرامج المساندة، والتشبيك التخصصي.',
        visionTitle: 'رؤيتنا',
        vision: 'رواد الوقف التخصصي في نهوض اليمن الحضاري.',
      },
      methodology: {
        eyebrow: 'كيف نعمل',
        title: 'منهجيتنا',
        description:
          'خمسة مبادئ عملية تحكم طريقة بناء الوقف وإدارته واستثماره، من الانفتاح على كل مساهم إلى ضمان الاستدامة والشراكات الفاعلة.',
        stepLabel: 'المبدأ',
        itemTitles: ['الانفتاح والمشاركة', 'المساهم شريك', 'الاستثمار الوقفي', 'الاستدامة 70 / 30', 'الشراكات الفاعلة'],
        items: [
          'الانفتاح على جميع أبناء اليمن ومحبيه، واستقبال مساهماتهم بالأفكار والأموال، ليكون كل يمني ومحب لليمن مساهماً في بناء الوقف بسهم وقفي عن نفسه، أو بأكثر من سهم يهديها لوالديه أو من يحب.',
          'المساهم معنا شريك في الوقف لبناء وتنمية اليمن، ومن حقه الحصول على وثيقة مساهمة وقفية، والتقارير الدورية، وإبداء الآراء والمقترحات لتطوير عمل الوقف.',
          'الوقف مؤسسة مالية وقفية تستثمر الأموال والأصول الموقوفة في محافظ استثمارية وقفية مفتوحة، وفق دراسات جدوى اقتصادية لمشاريع استثمارية متنوعة ذات ربحية عالية، بإشراف لجنة الاستثمار بالوقف المكونة من نخبة من رجال الأعمال وخبراء الاقتصاد الموثوقين.',
          'المحافظة على استدامة الوقف وتطويره وفق قانون الوقف التركي من خلال إنفاق 70% من عوائد الوقف على البرامج التي تحقق أهدافه، و30% تعود على زيادة رأس مال الوقف للحفاظ عليه من الإهلاك وضمان استدامته.',
          'بناء شراكات فاعلة مع كافة الجهات والهيئات ذات العلاقة للمساهمة في تطوير عمل الوقف، وتمويل المشاريع الوقفية والبرامج التنموية، والتعاون في تنفيذها.',
        ],
      },
      president: {
        title: 'كلمة رئيس الوقف',
        name: 'أ/ صلاح باتيس',
        role: 'رئيس الوقف',
        image: assets.president,
        paragraphs: [
          'كلنا يعلم المكانة العظيمة التي يحظى بها اليمن واليمنيون في قلوب الناس جميعاً، فهم أصل العرب وأرق الناس قلوباً وألينهم أفئدة، وبلدهم ذات الموقع الجغرافي جنوب غرب الجزيرة العربية على مضيق باب المندب، إضافة إلى ثروات البلاد الطبيعية ومناخها المتنوع.',
          'ويبقى الإنسان اليمني أهم ثروة وعامل فاعل في التنمية بما يتميز به من صفات وتحمل وصبر وتأقلم مع ظروف الحياة المتقلبة، وخلال الهجرات المتتالية لليمنيين شهدت لهم شعوب الأرض بالتعايش والتسامح والقدرة على الاندماج والفاعلية.',
          'هذا الإرث والحضارة والتاريخ دافع كبير لإحداث تنمية شاملة وازدهار واستقرار وتطور، لذا اخترنا أن نبادر في هذه الظروف العصيبة، وأطلقنا هذه المبادرة التشاركية والفكرة الطموحة المتمثلة بوقف أويس القرني تُرك لليمن السعيد.',
          'دعوتي لكل أبناء اليمن ومحبيه بكل مكوناتهم وفئاتهم وانتماءاتهم أن نلتف حول هذه المبادرة ونبني معاً وقف أويس القرني ليكون انطلاقة عملية تشاركية نوعية لبناء اليمن السعيد بعون الله.',
        ],
      },
      cycle: {
        title: 'الدورة الوقفية',
        description:
          'يتبنى الوقف منهجية عمل واضحة تقوم على أفضل القيم والممارسات وقواعد العمل المؤسسي والحوكمة في مجال العمل الوقفي، وترتكز على ثلاث مراحل.',
        phases: [
          {
            title: 'المرحلة الأولى: إيجاد الوقف',
            description:
              'ترتكز هذه المرحلة على إيجاد الوقف بمساهمة كل اليمنيين ومحبي اليمن حول العالم بالأسهم والأصول الوقفية وتعزيز الروح الوطنية لديهم كشركاء في إيجاد أكبر وقف في تاريخ اليمن.',
            bullets: [
              'السهم الوقفي (100$) مائة دولار.',
              'المحافظ الوقفية.',
              'أصول وقفية عقارية أو تجارية أو معادن وغيرها.',
              'وقف نسبة من أصول مشاريع استثمارية.',
              'وقف نسبة من أرباح مشاريع استثمارية.',
            ],
          },
          {
            title: 'المرحلة الثانية: تثمير الوقف',
            description:
              'تزامناً مع إيجاد الوقف يتم تثمير الأموال بإشراف نخبة من رجال الأعمال اليمنيين ومحبي اليمن من أصحاب الخبرة في مجالات الاستثمار المختلفة.',
            bullets: [
              'المحافظة على أصول وموارد الوقف وتنميتها على المدى الطويل.',
              'اتباع سياسات استثمارية متوازنة تغطي أصولاً ومشاريع متنوعة.',
              'حماية الأصول الموقوفة من خلال تنويع محافظ الاستثمار.',
              'التركيز على الاستثمارات قليلة المخاطر ذات عوائد مالية مجزية.',
            ],
          },
          {
            title: 'المرحلة الثالثة: مصارف الوقف',
            description:
              'يشرف على هذه المرحلة فريق من الخبراء لتحقيق أهداف الوقف عبر مؤسسات تخصصية وشراكات ومعايير وبرامج لترسيخ الهوية الوطنية الجامعة وتحقيق النهوض الحضاري لليمن.',
            bullets: [
              'الاهتمام بالموهوبين والمتميزين وإعدادهم قادة للمستقبل.',
              'تطوير القيادات الإدارية والمجتمعية ورفع قدراتهم المهنية والمهارية.',
              'تطوير أداء المؤسسات الحكومية والأهلية بتعزيز العمل المؤسسي والجودة والحوكمة والشراكات.',
              'الاهتمام بالوعي المجتمعي وإعادة صياغة الرأي العام بما يعزز الهوية الوطنية الجامعة وثقافة التعايش والسلام.',
            ],
          },
        ],
      },
    },
    governance: {
      seo: {
        title: 'نظام الحوكمة | وقف أويس القرني',
        description: 'السياسات الحاكمة لوقف أويس القرني، وتشمل الإبلاغ، تعارض المصالح، الشفافية، الامتثال، المخاطر، مكافحة غسل الأموال، التطوع، مكافحة الاحتيال، وحفظ الوثائق.',
        canonical: assets.governanceSource,
      },
      hero: {
        title: 'نظام الحوكمة',
        description: 'سياسات حاكمة تعزز المؤسسية والشفافية والامتثال وإدارة المخاطر في عمل الوقف.',
        image: assets.governanceHero,
        imageAlt: 'نظام الحوكمة',
      },
      breadcrumbs: [
        { label: 'الرئيسية', href: '/' },
        { label: 'عن الوقف' },
        { label: 'نظام الحوكمة' },
      ],
      intro: {
        eyebrow: 'حوكمة الوقف',
        title: 'السياسات الحاكمة',
        description: 'تجمع هذه الصفحة السياسات المنشورة في نظام الحوكمة، مع روابط داخلية مباشرة لكل سياسة وقوائم قابلة للفتح والقراءة.',
        navTitle: 'روابط السياسات',
      },
      policies: arPolicies,
    },
  },
  en: {
    nav: [
      { label: 'Veysel Karani Waqf', href: aboutRoutes.waqf },
      { label: 'Governance System', href: aboutRoutes.governance },
    ],
    waqf: {
      seo: {
        title: 'Veysel Karani Waqf | Veysel Karani Waqf',
        description: 'Profile of Veysel Karani Waqf, including license information, purposes, values, methodology, president message, and the waqf cycle.',
        canonical: assets.waqfSource,
      },
      hero: {
        title: 'Veysel Karani Waqf',
        description: 'A development institution with a waqf nature that seeks to establish a major participatory waqf for Yemen.',
        image: assets.waqfHero,
        imageAlt: 'Veysel Karani Waqf',
      },
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'About' },
        { label: 'Veysel Karani Waqf' },
      ],
      intro: {
        eyebrow: 'Who We Are',
        title: 'Veysel Karani Waqf',
        paragraphs: [
          'A development institution with a waqf nature that seeks to establish the largest qualitative participatory waqf in Yemen history, whose returns support civilizational advancement programs and tracks. Yemenis and friends of Yemen around the world contribute to establishing and growing it as a financial, investment, and waqf institution.',
          'The waqf was founded in Istanbul, Turkiye, and was licensed by a court ruling on 27 March 2017 under Turkish waqf law, one of the strongest waqf laws in the world, ensuring sustainability, resource growth, and investment of funds and assets in diverse fields inside and outside Turkiye.',
          'The institutional structure, bylaws, systems, and plans were built in 2018, and public introduction and promotion began at the start of 2019.',
        ],
        facts: [
          { label: 'License Number', value: '6222' },
          { label: 'Court Decision Number', value: '2016/223-2016/501' },
          { label: 'Tax Number', value: '9250524198' },
          { label: 'Tax Status', value: 'Tax exempt' },
        ],
        downloadLabel: 'Download Profile',
        downloadUrl: assets.profileFileEn,
      },
      video: {
        title: 'Introductory Video',
        description: 'The video used on the Veysel Karani Waqf page to introduce the waqf mission and areas of work.',
        videoId: 'STmMVySqqtg',
        sourceUrl: assets.videoSourceEn,
      },
      goals: {
        eyebrow: 'Our Identity',
        title: 'Our Purposes',
        description:
          'A vision, mission, purposes, and values that together shape the identity of Veysel Karani Waqf and guide its work toward building the largest waqf in the history of Yemen.',
        items: [
          'Establish the waqf through contributions from Yemenis and friends of Yemen around the world and grow its resources as a financial investment waqf institution.',
          'Strengthen national spirit among Yemenis as partners in building the largest waqf in Yemen history.',
          'Consolidate the inclusive national identity and achieve sustainable development for Yemen.',
        ],
      },
      identity: {
        valuesTitle: 'Our Values',
        values: ['Initiative', 'Ambition', 'Partnership', 'Transparency', 'Institutionalism', 'Sustainability'],
        missionTitle: 'Our Mission',
        mission:
          'Creating innovative waqf investment vehicles that secure resources for Yemen civilizational advancement, integrating with partners in capacity building, support programs, and specialized networking.',
        visionTitle: 'Our Vision',
        vision: 'Pioneers of specialized waqf for Yemen civilizational advancement.',
      },
      methodology: {
        eyebrow: 'How We Work',
        title: 'Our Methodology',
        description:
          'Five working principles that govern how the waqf is built, managed, and invested — from openness to every contributor to sustainability and active partnerships.',
        stepLabel: 'Principle',
        itemTitles: ['Openness & Participation', 'Contributor as Partner', 'Waqf Investment', 'Sustainability 70 / 30', 'Active Partnerships'],
        items: [
          'Openness to all Yemenis and friends of Yemen, receiving their ideas and contributions so every Yemeni and friend of Yemen can help build the waqf with a waqf share for themselves or additional shares gifted to parents or loved ones.',
          'Every contributor is a partner in building and developing Yemen and has the right to receive a waqf contribution document, periodic reports, and opportunities to provide opinions and suggestions.',
          'The waqf is a financial waqf institution that invests endowed funds and assets in open waqf investment portfolios based on feasibility studies for diverse, high-return projects, supervised by the waqf investment committee.',
          'Sustainability is preserved under Turkish waqf law by allocating 70% of waqf returns to programs that achieve its objectives and 30% to increasing waqf capital.',
          'Building active partnerships with relevant entities to develop waqf work, fund waqf projects and development programs, and cooperate in implementation.',
        ],
      },
      president: {
        title: 'Message from the Waqf President',
        name: 'Salah Batiss',
        role: 'Waqf President',
        image: assets.president,
        paragraphs: [
          'Yemen and Yemenis hold a great place in people hearts. Yemen is located in the southwest of the Arabian Peninsula on Bab al-Mandab, with natural wealth and diverse climate.',
          'The Yemeni person remains the most important wealth and active factor in development, known for endurance, patience, adaptability, coexistence, tolerance, and respect for the laws of host countries.',
          'This heritage, civilization, and history are a strong motive to launch a comprehensive development effort. For this reason, the participatory initiative and ambitious idea of Veysel Karani Waqf was launched for happy Yemen.',
          'My invitation to all Yemenis and friends of Yemen is to gather around this initiative and build Veysel Karani Waqf together as a practical, participatory, and qualitative start for building Yemen.',
        ],
      },
      cycle: {
        title: 'The Waqf Cycle',
        description: 'The waqf adopts a clear work methodology based on best values, institutional work rules, and governance in the waqf field, organized around three stages.',
        phases: [
          {
            title: 'Stage One: Establishing the Waqf',
            description: 'This stage builds the waqf through contributions from Yemenis and friends of Yemen worldwide using waqf shares and assets, strengthening their national spirit as partners.',
            bullets: ['Waqf share: 100 USD.', 'Waqf portfolios.', 'Waqf assets such as real estate, commercial assets, and minerals.', 'Endowing a percentage of investment project assets.', 'Endowing a percentage of investment project profits.'],
          },
          {
            title: 'Stage Two: Investing the Waqf',
            description: 'Alongside establishment, funds are invested under the supervision of experienced Yemeni businesspeople and friends of Yemen across different investment fields.',
            bullets: ['Preserve and grow waqf assets and resources over the long term.', 'Follow balanced investment policies covering diverse short and long-term assets and projects.', 'Protect endowed assets by diversifying investment portfolios.', 'Focus on low-risk investments with rewarding financial returns.'],
          },
          {
            title: 'Stage Three: Waqf Disbursement',
            description: 'Experts supervise this stage to achieve waqf objectives through specialized institutions, partnerships, standards, and programs that strengthen inclusive national identity and Yemen advancement.',
            bullets: ['Care for talented and distinguished students and prepare them as future leaders.', 'Develop administrative and community leaders and raise their professional and skill capacities.', 'Develop the performance of public and civil institutions through institutional work, quality, governance, and partnerships.', 'Promote community awareness, coexistence, lasting peace, and rejection of all causes of social division.'],
          },
        ],
      },
    },
    governance: {
      seo: {
        title: 'Governance System | Veysel Karani Waqf',
        description: 'Governance policies of Veysel Karani Waqf, including reporting, conflict of interest, transparency, compliance, risk, AML/CTF, volunteering, anti-fraud, and document retention.',
        canonical: assets.governanceSource,
      },
      hero: {
        title: 'Governance System',
        description: 'Policies that strengthen institutional work, transparency, compliance, and risk management in the waqf.',
        image: assets.governanceHero,
        imageAlt: 'Governance System',
      },
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'About' },
        { label: 'Governance System' },
      ],
      intro: {
        eyebrow: 'Waqf Governance',
        title: 'Governing Policies',
        description: 'This page presents the published governance policies with direct internal links and readable accordion sections.',
        navTitle: 'Policy Links',
      },
      policies: enPolicies,
    },
  },
  tr: {
    nav: [
      { label: 'Veysel Karani Vakfı', href: aboutRoutes.waqf },
      { label: 'Yönetişim Sistemi', href: aboutRoutes.governance },
    ],
    waqf: {
      seo: {
        title: 'Veysel Karani Vakfı | Veysel Karani Vakfı',
        description: 'Veysel Karani Vakfının tanıtımı, lisans bilgileri, gayeleri, değerleri, metodolojisi, başkan mesajı ve vakıf döngüsü.',
        canonical: assets.waqfSource,
      },
      hero: {
        title: 'Veysel Karani Vakfı',
        description: 'Yemen için büyük ve katılımcı bir vakıf kurmayı hedefleyen vakıf niteliğinde bir kalkınma kurumu.',
        image: assets.waqfHero,
        imageAlt: 'Veysel Karani Vakfı',
      },
      breadcrumbs: [
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Vakıf Hakkında' },
        { label: 'Veysel Karani Vakfı' },
      ],
      intro: {
        eyebrow: 'Biz Kimiz',
        title: 'Veysel Karani Vakfı',
        paragraphs: [
          'Yemen tarihindeki en büyük nitelikli ve katılımcı vakfı kurmayı hedefleyen, getirilerini medeniyet kalkınması programlarına ve yollarına yönlendiren vakıf niteliğinde bir kalkınma kurumudur. Dünyadaki tüm Yemenliler ve Yemen dostları, vakfın kurulmasına ve geliştirilmesine bir mali yatırım vakfı olarak katkı sağlar.',
          'Vakıf İstanbulda kurulmuş ve 27 Mart 2017 tarihinde mahkeme kararıyla Türk vakıf hukukuna göre lisans almıştır. Bu hukuk vakfın sürdürülebilirliğini, kaynaklarının geliştirilmesini ve varlıklarının Türkiyede ve yurtdışında farklı yatırım alanlarında değerlendirilmesini güvence altına alır.',
          'Vakfın kurumsal yapısı, yönetmelikleri, sistemleri ve planları 2018 yılında tamamlanmış; vakfın tanıtımı ve duyurusu 2019 yılının başında başlamıştır.',
        ],
        facts: [
          { label: 'Lisans Numarası', value: '6222' },
          { label: 'Mahkeme Kararı Numarası', value: '2016/223-2016/501' },
          { label: 'Vergi Numarası', value: '9250524198' },
          { label: 'Vergi Durumu', value: 'Vergiden muaftır' },
        ],
        downloadLabel: 'Tanıtım Dosyasını İndir',
        downloadUrl: assets.profileFileTr,
      },
      video: {
        title: 'Tanıtım Videosu',
        description: 'Veysel Karani Vakfı sayfasında yer alan, vakfın misyonunu ve çalışma alanlarını tanıtan video.',
        videoId: 'DPY--Zs7Ero',
        sourceUrl: assets.videoSourceTr,
      },
      goals: {
        eyebrow: 'Kimliğimiz',
        title: 'Gayelerimiz',
        description:
          'Vizyon, misyon, gayeler ve değerler; Veysel Karani Vakfının kimliğini birlikte oluşturur ve çalışmalarını Yemen tarihinin en büyük vakfını kurmaya yönlendirir.',
        items: [
          'Dünyadaki tüm Yemenliler ve Yemen dostlarının katkısıyla vakfı kurmak ve kaynaklarını mali yatırım vakfı olarak geliştirmek.',
          'Yemenlilerin, Yemen tarihindeki en büyük vakfı kurma ortakları olarak ulusal ruhunu güçlendirmek.',
          'Kapsayıcı ulusal kimliği pekiştirmek ve Yemen için sürdürülebilir kalkınmayı gerçekleştirmek.',
        ],
      },
      identity: {
        valuesTitle: 'Değerlerimiz',
        values: ['Girişim', 'Hırs', 'Ortaklık', 'Şeffaflık', 'Kurumsallık', 'Sürdürülebilirlik'],
        missionTitle: 'Misyonumuz',
        mission:
          'Yemenin medeniyet kalkınması için kaynak sağlayan yenilikçi vakıf yatırım araçları üretmek; kapasite geliştirme, destek programları ve uzmanlaşmış ağ kurma alanlarında ortaklarımızla bütünleşmek.',
        visionTitle: 'Vizyonumuz',
        vision: 'Yemenin medeniyet kalkınmasında uzmanlaşmış vakfın öncüleri olmak.',
      },
      methodology: {
        eyebrow: 'Nasıl Çalışıyoruz',
        title: 'Metodolojimiz',
        description:
          'Vakfın kuruluşunu, yönetimini ve yatırımını belirleyen beş çalışma ilkesi; her katılımcıya açıklıktan sürdürülebilirliğe ve etkin ortaklıklara kadar.',
        stepLabel: 'İlke',
        itemTitles: ['Açıklık ve Katılım', 'Katılımcı Ortaktır', 'Vakıf Yatırımı', 'Sürdürülebilirlik 70 / 30', 'Etkin Ortaklıklar'],
        items: [
          'Tüm Yemenlilere ve Yemen dostlarına açık olmak, fikirlerini ve mali katkılarını kabul ederek her Yemenlinin ve Yemen dostunun kendisi, anne babası veya sevdikleri adına vakıf hissesiyle vakfın inşasına katkı vermesini sağlamak.',
          'Katkı veren kişi, Yemenin inşası ve kalkınmasında vakfın ortağıdır; vakıf katkı belgesi, dönemsel raporlar ve görüş-öneri sunma hakkına sahiptir.',
          'Vakıf, bağışlanan para ve varlıkları açık vakıf yatırım portföylerinde, fizibilite çalışmalarına dayanan ve yüksek karlılığa sahip çeşitli projelerde değerlendiren bir mali vakıf kurumudur.',
          'Türk vakıf hukukuna göre sürdürülebilirliği korumak için vakıf getirilerinin 70% kadarı hedefleri gerçekleştiren programlara, 30% kadarı ise vakıf sermayesini artırmaya ayrılır.',
          'Vakfın çalışmalarını geliştirmek, vakıf projelerini ve kalkınma programlarını finanse etmek ve uygulamada iş birliği yapmak için ilgili tüm kurumlarla etkin ortaklıklar kurmak.',
        ],
      },
      president: {
        title: 'Vakıf Başkanı Mesajı',
        name: 'Salah Batiss',
        role: 'Vakıf Başkanı',
        image: assets.president,
        paragraphs: [
          'Yemen ve Yemenliler insanların gönlünde büyük bir yere sahiptir. Yemen, Arap Yarımadasının güneybatısında Babülmendep Boğazı üzerinde yer alır; doğal zenginlikleri ve çeşitli iklimiyle önemli bir ülkedir.',
          'Yemen insanı, dayanıklılığı, sabrı, değişen şartlara uyumu, birlikte yaşama kültürü, hoşgörüsü ve göç ettiği ülkelerin kanunlarına saygısıyla kalkınmanın en önemli zenginliği ve etkin unsurudur.',
          'Bu miras, medeniyet ve tarih kapsamlı kalkınma için büyük bir motivasyondur. Bu nedenle zor şartlarda bu katılımcı girişimi ve Veysel Karani Vakfı fikrini Yemen için başlattık.',
          'Tüm Yemenlileri ve Yemen dostlarını bu girişim etrafında birleşmeye ve Veysel Karani Vakfını birlikte kurmaya davet ediyorum; bu, Yemenin inşası için pratik, katılımcı ve nitelikli bir başlangıç olsun.',
        ],
      },
      cycle: {
        title: 'Vakıf Döngüsü',
        description: 'Vakıf, vakıf alanında en iyi değerler, uygulamalar, kurumsal çalışma kuralları ve yönetişime dayanan açık bir metodoloji benimser; bu metodoloji üç aşamaya dayanır.',
        phases: [
          {
            title: 'Birinci Aşama: Vakfın Kurulması',
            description: 'Bu aşama, dünyadaki Yemenliler ve Yemen dostlarının vakıf hisseleri ve varlıklarıyla katkı sunması ve Yemen tarihindeki en büyük vakfı kurma ortaklığı bilincinin güçlendirilmesine dayanır.',
            bullets: ['Vakıf hissesi: 100 USD.', 'Vakıf portföyleri.', 'Gayrimenkul, ticari varlıklar ve madenler gibi vakıf varlıkları.', 'Yatırım projelerinin varlıklarından bir oranı vakfetmek.', 'Yatırım projelerinin karlarından bir oranı vakfetmek.'],
          },
          {
            title: 'İkinci Aşama: Vakfın Yatırıma Yönlendirilmesi',
            description: 'Kuruluş aşamasıyla eş zamanlı olarak fonlar, farklı yatırım alanlarında deneyimli Yemenli iş insanları ve Yemen dostlarının gözetiminde yatırıma yönlendirilir.',
            bullets: ['Vakıf varlıklarını ve kaynaklarını uzun vadede korumak ve geliştirmek.', 'Kısa ve uzun vadeli çeşitli varlık ve projeleri kapsayan dengeli yatırım politikaları izlemek.', 'Yatırım portföylerini çeşitlendirerek vakfedilen varlıkları korumak.', 'Düşük riskli ve tatmin edici getirili yatırımlara odaklanmak.'],
          },
          {
            title: 'Üçüncü Aşama: Vakıf Sarf Alanları',
            description: 'Bu aşama, kapsayıcı ulusal kimliği pekiştirmek ve Yemenin medeniyet kalkınmasını gerçekleştirmek için uzman kurumlar, ortaklıklar, standartlar ve programlar aracılığıyla yürütülür.',
            bullets: ['Yetenekli ve seçkin öğrencilerle ilgilenmek ve onları geleceğin liderleri olarak yetiştirmek.', 'İdari ve toplumsal liderlerin mesleki ve beceri kapasitelerini geliştirmek.', 'Kamu ve sivil kurumların performansını kurumsal çalışma, kalite, yönetişim ve ortaklıklarla geliştirmek.', 'Toplumsal farkındalığı, birlikte yaşamayı, kalıcı barışı ve bölünme sebeplerinin reddini desteklemek.'],
          },
        ],
      },
    },
    governance: {
      seo: {
        title: 'Yönetişim Sistemi | Veysel Karani Vakfı',
        description: 'Veysel Karani Vakfının yönetişim politikaları: bildirim, menfaat çatışması, şeffaflık, uyum, risk, kara para aklama ile mücadele, gönüllülük, yolsuzlukla mücadele ve belge saklama.',
        canonical: assets.governanceSource,
      },
      hero: {
        title: 'Yönetişim Sistemi',
        description: 'Vakfın kurumsallığını, şeffaflığını, uyumunu ve risk yönetimini güçlendiren politikalar.',
        image: assets.governanceHero,
        imageAlt: 'Yönetişim Sistemi',
      },
      breadcrumbs: [
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Vakıf Hakkında' },
        { label: 'Yönetişim Sistemi' },
      ],
      intro: {
        eyebrow: 'Vakıf Yönetişimi',
        title: 'Yönetici Politikalar',
        description: 'Bu sayfa yayımlanan yönetişim politikalarını, her politika için doğrudan iç bağlantılar ve okunabilir açılır bölümlerle sunar.',
        navTitle: 'Politika Bağlantıları',
      },
      policies: trPolicies,
    },
  },
};

export function getAboutContent(locale: Locale): AboutPagesContent {
  const base = aboutPages[locale] ?? aboutPages.ar;
  return {
    ...base,
    nav: cmsPageContent('about-nav', locale, base.nav),
    waqf: cmsPageContent('about-waqf', locale, base.waqf),
    governance: cmsPageContent('governance', locale, base.governance),
  };
}
