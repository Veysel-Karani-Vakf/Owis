import type { Locale } from '@/i18n/content';

/*
 * Owais Volunteer Award 2026 — trilingual content for the public award pages.
 *
 * Static on purpose (frontend-only phase): there is no site_pages row or admin
 * editor for it yet. The five participation conditions and the fields come
 * from the award brief; anything the official award document has not settled
 * yet (deadlines, evaluation, recognition) is marked `draft` and rendered with
 * a visible "draft" badge, never as an announcement.
 */

export type AwardCategoryId = 'education' | 'health' | 'environment' | 'empowerment' | 'development';
export type AwardConditionId = 'yemeni-team' | 'inside-yemen' | 'voluntary' | 'development-field' | 'independent';
export type AwardStepId = 'read' | 'form' | 'support' | 'submit';
export type AwardPillarId = 'celebrate' | 'impact' | 'sustain';

/** In-page sections of the landing page; the quick links under the hero jump to them. */
export type AwardLandingSection = 'about' | 'categories' | 'eligibility' | 'steps' | 'faq';

export const awardSectionIds: Record<AwardLandingSection, string> = {
  about: 'award-about',
  categories: 'award-categories',
  eligibility: 'award-eligibility',
  steps: 'award-steps',
  faq: 'award-faq',
};

export type AwardCategory = { id: AwardCategoryId; title: string; description: string };
export type AwardCondition = { id: AwardConditionId; title: string; description: string };
export type AwardStep = { id: AwardStepId; title: string; description: string };
export type AwardPillar = { id: AwardPillarId; title: string; description: string };
export type AwardQuickLink = { target: AwardLandingSection; title: string; description: string };

export type AwardFaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Not settled by the official award document yet: shown with a draft badge. */
  draft?: boolean;
};

export type AwardContent = {
  /** The award's full name on one line (alt text, share titles). */
  name: string;
  seo: { title: string; description: string };
  labels: {
    draft: string;
    draftNotice: string;
    sectionNav: string;
  };
  hero: {
    titleLines: [string, string];
    year: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    imageAlt: string;
    quickLinks: AwardQuickLink[];
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
    pillars: AwardPillar[];
    quote: string;
    imageAlt: string;
    imageCaption: string;
  };
  categories: { title: string; description: string; items: AwardCategory[] };
  eligibility: { title: string; description: string; items: AwardCondition[]; cta: string };
  steps: { title: string; description: string; stepLabel: string; items: AwardStep[] };
  faq: { title: string; description: string; items: AwardFaqItem[] };
  cta: { title: string; description: string; button: string };
};

/**
 * Photographs, shared by every language. Both come from the waqf's own
 * development program in Wadi Hadramout (Yemen), re-encoded as responsive WebP
 * under public/award/ (originals: public/library/profile/photos/inst-4.jpg and
 * inst-1.jpg). Replace them here once authentic award/volunteer photos exist.
 */
export const awardMedia = {
  hero: {
    src: '/award/award-hero-1600.webp',
    srcSet: '/award/award-hero-720.webp 720w, /award/award-hero-1100.webp 1100w, /award/award-hero-1600.webp 1600w',
    width: 1600,
    height: 1067,
  },
  about: {
    src: '/award/award-about-854.webp',
    srcSet: '/award/award-about-560.webp 560w, /award/award-about-854.webp 854w',
    width: 854,
    height: 1067,
  },
  /** og:image — JPEG for the widest crawler support (1200x630). */
  share: '/award/award-share.jpg',
} as const;

const ar: AwardContent = {
  name: 'جائزة أويس للأعمال التطوعية 2026',
  seo: {
    title: 'جائزة أويس للأعمال التطوعية 2026 | وقف أويس القرني',
    description:
      'جائزة تحتفي بالمبادرات التطوعية الملهمة داخل اليمن. تعرّف على مجالات المشاركة وشروطها وخطوات التقديم في جائزة أويس للأعمال التطوعية 2026.',
  },
  labels: {
    draft: 'مسودة',
    draftNotice: 'الإجابات المعلَّمة بـ«مسودة» أولية، وستُحدَّث عند اعتماد الوثيقة الرسمية للجائزة.',
    sectionNav: 'أقسام صفحة الجائزة',
  },
  hero: {
    titleLines: ['جائزة أويس', 'للأعمال التطوعية'],
    year: '2026',
    description:
      'نحتفي بالعطاء، ونُبرز المبادرات التطوعية الملهمة داخل اليمن؛ تقديرًا لأصحابها، وتشجيعًا لعملٍ تطوعيٍّ يدوم أثره.',
    primaryCta: 'تقدّم للجائزة',
    secondaryCta: 'تعرّف على الشروط',
    imageAlt: 'تسليم شهادة لأحد المشاركين في برنامج تنموي نفّذه وقف أويس القرني في وادي حضرموت',
    quickLinks: [
      { target: 'about', title: 'عن الجائزة', description: 'تعرّف على فكرتها وأهدافها' },
      { target: 'categories', title: 'مجالات المشاركة', description: 'في مختلف المجالات التنموية' },
      { target: 'steps', title: 'طريقة التقديم', description: 'بخطوات سهلة وواضحة' },
    ],
  },
  about: {
    eyebrow: 'جائزة أويس للأعمال التطوعية 2026',
    title: 'عن الجائزة',
    lead: 'مساحةٌ للاحتفاء بالمبادرات التطوعية التي تصنع فرقًا حقيقيًا في حياة الناس داخل اليمن.',
    paragraphs: [
      'جائزة أويس للأعمال التطوعية مبادرةٌ من وقف أويس القرني، تُعنى بإبراز المبادرات التطوعية ذات الأثر داخل اليمن، وتقدير الفرق التي تعمل بإخلاص لخدمة مجتمعاتها.',
      'وتسعى الجائزة إلى تشجيع العمل التطوعي المستدام، ونشر التجارب الناجحة لتكون مصدر إلهامٍ لمبادراتٍ جديدة في مختلف المجالات التنموية.',
    ],
    pillars: [
      {
        id: 'celebrate',
        title: 'الاحتفاء بالعطاء',
        description: 'تسليط الضوء على المبادرات التطوعية والفرق التي تقف خلفها.',
      },
      { id: 'impact', title: 'إبراز الأثر', description: 'إظهار النتائج الملموسة للعمل التطوعي في المجتمع.' },
      { id: 'sustain', title: 'تشجيع الاستدامة', description: 'دعم ثقافة التطوع التي يمتدّ أثرها ويدوم.' },
    ],
    quote: 'نؤمن بأن المبادرات التطوعية تصنع فرقًا حقيقيًا في حياة الناس والمجتمعات.',
    imageAlt: 'متحدث في برنامج لرفع كفاءة منظمات المجتمع المدني نفّذه وقف أويس القرني في وادي حضرموت',
    imageCaption: 'من برامج وقف أويس القرني التنموية في اليمن',
  },
  categories: {
    title: 'مجالات المشاركة',
    description: 'تتنوّع مجالات الجائزة لتشمل أبرز المجالات التنموية في المجتمع اليمني.',
    items: [
      { id: 'education', title: 'التعليم', description: 'مبادرات تنمّي المعرفة والمهارات، وتفتح فرص التعلّم.' },
      { id: 'health', title: 'الصحة', description: 'مبادرات تعزّز الوعي الصحي، وتسهم في رعاية المجتمع.' },
      { id: 'environment', title: 'البيئة والاستدامة', description: 'مبادرات تحمي البيئة، وتنشر ممارسات الاستدامة.' },
      { id: 'empowerment', title: 'التمكين', description: 'مبادرات تمكّن الأفراد والفئات من بناء مستقبل أفضل.' },
      {
        id: 'development',
        title: 'المجالات التنموية الأخرى',
        description: 'مبادرات تنموية أخرى تُحدث أثرًا ملموسًا في المجتمع.',
      },
    ],
  },
  eligibility: {
    title: 'شروط المشاركة',
    description: 'تأكّد من استيفاء مبادرتك لجميع الشروط التالية قبل التقديم.',
    items: [
      {
        id: 'yemeni-team',
        title: 'جميع أعضاء المبادرة يمنيون',
        description: 'أن يكون جميع أعضاء فريق المبادرة من حمَلة الجنسية اليمنية.',
      },
      {
        id: 'inside-yemen',
        title: 'منفّذة داخل اليمن خلال آخر 12 شهرًا',
        description: 'أن تكون المبادرة قد نُفِّذت داخل اليمن خلال الأشهر الاثني عشر الماضية.',
      },
      {
        id: 'voluntary',
        title: 'تطوعية وغير ربحية',
        description: 'أن تكون المبادرة تطوعية بالكامل، ولا تهدف إلى تحقيق أي ربح.',
      },
      {
        id: 'development-field',
        title: 'تركّز على مجال تنموي',
        description: 'أن تركّز المبادرة على مجال تنموي محدّد، كالتعليم أو الصحة أو البيئة أو التمكين.',
      },
      {
        id: 'independent',
        title: 'مستقلة في إدارتها وتنفيذها',
        description: 'أن يدير فريق المبادرة أعمالها وينفّذها باستقلالية.',
      },
    ],
    cta: 'اطّلع على الشروط كاملة',
  },
  steps: {
    title: 'كيف تشارك؟',
    description: 'بأربع خطوات بسيطة يمكنك تقديم مبادرتك للجائزة.',
    stepLabel: 'الخطوة',
    items: [
      { id: 'read', title: 'اقرأ شروط المشاركة', description: 'تأكّد من انطباق الشروط الخمسة على مبادرتك.' },
      { id: 'form', title: 'عبّئ استمارة الترشيح', description: 'أدخل بيانات المبادرة وممثّلها وتفاصيل تنفيذها.' },
      { id: 'support', title: 'أضف المعلومات الداعمة', description: 'أجب عن أسئلة الأثر، وأرفق صورًا داعمة إن رغبت.' },
      { id: 'submit', title: 'أرسل الطلب للمراجعة', description: 'راجع ملخّص طلبك، ثم أرسله لتتم مراجعته.' },
    ],
  },
  faq: {
    title: 'الأسئلة الشائعة',
    description: 'إجابات عن أبرز الاستفسارات حول الجائزة والتقديم.',
    items: [
      {
        id: 'who',
        question: 'من يحق له التقدّم للجائزة؟',
        answer:
          'يحق التقدّم لكل مبادرة تطوعية تستوفي الشروط الخمسة: أن يكون جميع أعضائها يمنيين، وأن تكون قد نُفِّذت داخل اليمن خلال آخر 12 شهرًا، وأن تكون تطوعية وغير ربحية، وأن تركّز على مجال تنموي، وأن تكون مستقلة في إدارتها وتنفيذها.',
      },
      {
        id: 'location',
        question: 'هل يُشترط أن تكون المبادرة منفّذة داخل اليمن؟',
        answer:
          'نعم، يُشترط أن تكون المبادرة قد نُفِّذت داخل اليمن خلال الأشهر الاثني عشر الماضية، وستُسأل في استمارة الترشيح عن المحافظة والمديرية وتاريخ التنفيذ.',
      },
      {
        id: 'independent',
        question: 'هل يمكن لمبادرة ربحية أو غير مستقلة المشاركة؟',
        answer: 'لا، تقتصر الجائزة على المبادرات التطوعية غير الربحية التي يدير فريقها أعمالها وينفّذها باستقلالية.',
      },
      {
        id: 'register',
        question: 'كيف يتم التقديم للجائزة؟',
        answer:
          'يتم التقديم عبر استمارة الترشيح الإلكترونية في هذا الموقع، وتتكوّن من أربع خطوات: البيانات الأساسية، وتفاصيل المبادرة، وأسئلة الأثر والنتائج، ثم المرفقات ومراجعة الطلب قبل إرساله.',
      },
      {
        id: 'requirements',
        question: 'ما المعلومات المطلوبة في استمارة الترشيح؟',
        answer:
          'اسم المبادرة وبيانات التواصل مع ممثّلها، وعدد أعضاء الفريق، ومكان التنفيذ ومدّته ومجال المبادرة، وروابط حسابين على الأقل للمبادرة في وسائل التواصل الاجتماعي، إضافةً إلى إجابات قصيرة عن فكرة المبادرة وأثرها وفريقها واستدامتها. ويمكن إرفاق صور داعمة اختياريًا.',
      },
      {
        id: 'timeline',
        question: 'متى يُغلق باب التقديم؟ وكيف يُختار الفائزون؟',
        answer: 'تُعلَن المواعيد الرسمية ومعايير التقييم وتفاصيل التكريم ضمن الوثيقة الرسمية للجائزة فور اعتمادها.',
        draft: true,
      },
    ],
  },
  cta: {
    title: 'كن جزءًا من التغيير',
    description: 'قد تكون مبادرتك مصدر إلهامٍ لغيرك؛ شارك قصتها مع جائزة أويس للأعمال التطوعية.',
    button: 'تقدّم للجائزة',
  },
};

const en: AwardContent = {
  name: 'Owais Volunteer Award 2026',
  seo: {
    title: 'Owais Volunteer Award 2026 | Veysel Karani Waqf',
    description:
      'Celebrating inspiring volunteer initiatives inside Yemen. Explore the fields, conditions and application steps of the Owais Volunteer Award 2026.',
  },
  labels: {
    draft: 'Draft',
    draftNotice:
      'Answers marked “Draft” are preliminary and will be updated once the official award document is approved.',
    sectionNav: 'Award page sections',
  },
  hero: {
    titleLines: ['Owais', 'Volunteer Award'],
    year: '2026',
    description:
      'We celebrate giving and spotlight inspiring volunteer initiatives inside Yemen — honouring the people behind them and encouraging volunteer work whose impact lasts.',
    primaryCta: 'Apply for the award',
    secondaryCta: 'Read the conditions',
    imageAlt: 'A participant receives a certificate at a Veysel Karani Waqf development program in Wadi Hadramout',
    quickLinks: [
      { target: 'about', title: 'About the award', description: 'Its idea and goals' },
      { target: 'categories', title: 'Participation fields', description: 'Across development fields' },
      { target: 'steps', title: 'How to apply', description: 'In simple, clear steps' },
    ],
  },
  about: {
    eyebrow: 'Owais Volunteer Award 2026',
    title: 'About the award',
    lead: 'A space to celebrate volunteer initiatives that make a real difference in people’s lives across Yemen.',
    paragraphs: [
      'The Owais Volunteer Award is an initiative of Veysel Karani Waqf that highlights impactful volunteer initiatives inside Yemen and honours the teams who serve their communities with dedication.',
      'The award encourages sustainable volunteering and shares successful experiences so they can inspire new initiatives across development fields.',
    ],
    pillars: [
      {
        id: 'celebrate',
        title: 'Celebrating giving',
        description: 'Shining a light on volunteer initiatives and the teams behind them.',
      },
      {
        id: 'impact',
        title: 'Highlighting impact',
        description: 'Showing the tangible results of volunteer work in the community.',
      },
      {
        id: 'sustain',
        title: 'Encouraging sustainability',
        description: 'Supporting a culture of volunteering whose impact lasts.',
      },
    ],
    quote: 'We believe volunteer initiatives make a real difference in the lives of people and communities.',
    imageAlt: 'A speaker at a civil-society capacity-building program run by Veysel Karani Waqf in Wadi Hadramout',
    imageCaption: 'From Veysel Karani Waqf’s development programs in Yemen',
  },
  categories: {
    title: 'Participation fields',
    description: 'The award spans the key development fields of Yemeni society.',
    items: [
      {
        id: 'education',
        title: 'Education',
        description: 'Initiatives that build knowledge and skills and open up learning opportunities.',
      },
      {
        id: 'health',
        title: 'Health',
        description: 'Initiatives that raise health awareness and contribute to community care.',
      },
      {
        id: 'environment',
        title: 'Environment & sustainability',
        description: 'Initiatives that protect the environment and spread sustainable practices.',
      },
      {
        id: 'empowerment',
        title: 'Empowerment',
        description: 'Initiatives that enable individuals and groups to build a better future.',
      },
      {
        id: 'development',
        title: 'Other development fields',
        description: 'Other development initiatives that make a tangible difference in the community.',
      },
    ],
  },
  eligibility: {
    title: 'Participation conditions',
    description: 'Make sure your initiative meets all of the following conditions before applying.',
    items: [
      {
        id: 'yemeni-team',
        title: 'All members are Yemeni',
        description: 'Every member of the initiative team must hold Yemeni nationality.',
      },
      {
        id: 'inside-yemen',
        title: 'Implemented in Yemen within the last 12 months',
        description: 'The initiative must have been carried out inside Yemen during the previous 12 months.',
      },
      {
        id: 'voluntary',
        title: 'Voluntary and non-profit',
        description: 'The initiative must be entirely voluntary and must not seek any profit.',
      },
      {
        id: 'development-field',
        title: 'Focused on a development field',
        description:
          'The initiative must focus on a specific development field, such as education, health, the environment or empowerment.',
      },
      {
        id: 'independent',
        title: 'Independently run',
        description: 'The initiative team must manage and implement its work independently.',
      },
    ],
    cta: 'View the full conditions',
  },
  steps: {
    title: 'How to participate?',
    description: 'Submit your initiative to the award in four simple steps.',
    stepLabel: 'Step',
    items: [
      {
        id: 'read',
        title: 'Read the conditions',
        description: 'Check that your initiative meets all five conditions.',
      },
      {
        id: 'form',
        title: 'Complete the application form',
        description: 'Enter the initiative, its representative and how it was carried out.',
      },
      {
        id: 'support',
        title: 'Add supporting information',
        description: 'Answer the impact questions and attach supporting photos if you wish.',
      },
      {
        id: 'submit',
        title: 'Submit for review',
        description: 'Review your application summary, then send it for review.',
      },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    description: 'Answers to the most common questions about the award and how to apply.',
    items: [
      {
        id: 'who',
        question: 'Who can apply for the award?',
        answer:
          'Any volunteer initiative that meets all five conditions: all of its members are Yemeni, it was implemented inside Yemen within the last 12 months, it is voluntary and non-profit, it focuses on a development field, and it is managed and implemented independently.',
      },
      {
        id: 'location',
        question: 'Does the initiative have to be implemented inside Yemen?',
        answer:
          'Yes. The initiative must have been carried out inside Yemen during the previous 12 months, and the application form asks for the governorate, district and implementation dates.',
      },
      {
        id: 'independent',
        question: 'Can a for-profit or non-independent initiative take part?',
        answer:
          'No. The award is limited to voluntary, non-profit initiatives whose teams manage and implement their work independently.',
      },
      {
        id: 'register',
        question: 'How do I apply?',
        answer:
          'Applications are made through the online nomination form on this website. It has four steps: basic information, initiative details, impact questions, then attachments and a final review before sending.',
      },
      {
        id: 'requirements',
        question: 'What information does the application form ask for?',
        answer:
          'The initiative’s name, its representative’s contact details, the team size, where and when it was implemented, its field and links to at least two of its social media accounts, plus short answers about the initiative’s idea, impact, team and sustainability. Supporting photos can be attached optionally.',
      },
      {
        id: 'timeline',
        question: 'When do applications close, and how are winners chosen?',
        answer:
          'The official dates, evaluation criteria and recognition details will be announced in the official award document once it is approved.',
        draft: true,
      },
    ],
  },
  cta: {
    title: 'Be part of the change',
    description: 'Your initiative could inspire others — share its story with the Owais Volunteer Award.',
    button: 'Apply for the award',
  },
};

const tr: AwardContent = {
  name: 'Owais Gönüllülük Ödülü 2026',
  seo: {
    title: 'Owais Gönüllülük Ödülü 2026 | Veysel Karani Vakfı',
    description:
      'Yemen’deki ilham veren gönüllü girişimleri onurlandıran ödül. Owais Gönüllülük Ödülü 2026’nın alanlarını, koşullarını ve başvuru adımlarını keşfedin.',
  },
  labels: {
    draft: 'Taslak',
    draftNotice:
      '“Taslak” olarak işaretlenen yanıtlar ön bilgidir; ödülün resmî belgesi onaylandığında güncellenecektir.',
    sectionNav: 'Ödül sayfası bölümleri',
  },
  hero: {
    titleLines: ['Owais', 'Gönüllülük Ödülü'],
    year: '2026',
    description:
      'Gönüllülüğü kutluyor, Yemen’deki ilham veren gönüllü girişimleri öne çıkarıyoruz; emeği geçenleri onurlandırıyor, etkisi kalıcı gönüllü çalışmaları teşvik ediyoruz.',
    primaryCta: 'Ödüle başvur',
    secondaryCta: 'Koşulları incele',
    imageAlt: 'Veysel Karani Vakfı’nın Hadramut Vadisi’ndeki bir kalkınma programında katılımcıya sertifika takdimi',
    quickLinks: [
      { target: 'about', title: 'Ödül hakkında', description: 'Fikri ve hedefleri' },
      { target: 'categories', title: 'Katılım alanları', description: 'Farklı kalkınma alanlarında' },
      { target: 'steps', title: 'Başvuru yolu', description: 'Kolay ve net adımlarla' },
    ],
  },
  about: {
    eyebrow: 'Owais Gönüllülük Ödülü 2026',
    title: 'Ödül hakkında',
    lead: 'Yemen’de insanların hayatında gerçek bir fark yaratan gönüllü girişimleri kutlamak için bir alan.',
    paragraphs: [
      'Owais Gönüllülük Ödülü, Veysel Karani Vakfı’nın bir girişimidir; Yemen’deki etkili gönüllü girişimleri görünür kılmayı ve toplumuna özveriyle hizmet eden ekipleri onurlandırmayı amaçlar.',
      'Ödül, sürdürülebilir gönüllülüğü teşvik etmeyi ve başarılı deneyimleri yayarak farklı kalkınma alanlarındaki yeni girişimlere ilham kaynağı olmalarını hedefler.',
    ],
    pillars: [
      {
        id: 'celebrate',
        title: 'Gönüllülüğü kutlamak',
        description: 'Gönüllü girişimlere ve arkalarındaki ekiplere ışık tutmak.',
      },
      {
        id: 'impact',
        title: 'Etkiyi görünür kılmak',
        description: 'Gönüllü çalışmanın toplumdaki somut sonuçlarını ortaya koymak.',
      },
      {
        id: 'sustain',
        title: 'Sürdürülebilirliği teşvik etmek',
        description: 'Etkisi uzun soluklu bir gönüllülük kültürünü desteklemek.',
      },
    ],
    quote: 'Gönüllü girişimlerin insanların ve toplumların hayatında gerçek bir fark yarattığına inanıyoruz.',
    imageAlt:
      'Veysel Karani Vakfı’nın Hadramut Vadisi’nde yürüttüğü sivil toplum kapasite geliştirme programında bir konuşmacı',
    imageCaption: 'Veysel Karani Vakfı’nın Yemen’deki kalkınma programlarından',
  },
  categories: {
    title: 'Katılım alanları',
    description: 'Ödülün alanları, Yemen toplumunun öne çıkan kalkınma alanlarını kapsar.',
    items: [
      {
        id: 'education',
        title: 'Eğitim',
        description: 'Bilgi ve becerileri geliştiren, öğrenme fırsatları sunan girişimler.',
      },
      {
        id: 'health',
        title: 'Sağlık',
        description: 'Sağlık bilincini artıran ve toplumun bakımına katkı sunan girişimler.',
      },
      {
        id: 'environment',
        title: 'Çevre ve sürdürülebilirlik',
        description: 'Çevreyi koruyan ve sürdürülebilir uygulamaları yaygınlaştıran girişimler.',
      },
      {
        id: 'empowerment',
        title: 'Güçlendirme',
        description: 'Bireyleri ve toplulukları daha iyi bir gelecek kurmaya güçlendiren girişimler.',
      },
      {
        id: 'development',
        title: 'Diğer kalkınma alanları',
        description: 'Toplumda somut bir etki yaratan diğer kalkınma girişimleri.',
      },
    ],
  },
  eligibility: {
    title: 'Katılım koşulları',
    description: 'Başvurmadan önce girişiminizin aşağıdaki koşulların tamamını karşıladığından emin olun.',
    items: [
      {
        id: 'yemeni-team',
        title: 'Tüm üyeler Yemenli',
        description: 'Girişim ekibinin tüm üyeleri Yemen vatandaşı olmalıdır.',
      },
      {
        id: 'inside-yemen',
        title: 'Son 12 ayda Yemen’de uygulanmış',
        description: 'Girişim, son on iki ay içinde Yemen’de hayata geçirilmiş olmalıdır.',
      },
      {
        id: 'voluntary',
        title: 'Gönüllü ve kâr amacı gütmeyen',
        description: 'Girişim tamamen gönüllü olmalı ve hiçbir kâr amacı gütmemelidir.',
      },
      {
        id: 'development-field',
        title: 'Bir kalkınma alanına odaklı',
        description: 'Girişim eğitim, sağlık, çevre veya güçlendirme gibi belirli bir kalkınma alanına odaklanmalıdır.',
      },
      {
        id: 'independent',
        title: 'Yönetimi ve uygulaması bağımsız',
        description: 'Girişimin çalışmaları kendi ekibi tarafından bağımsız olarak yönetilmeli ve uygulanmalıdır.',
      },
    ],
    cta: 'Koşulların tamamını görün',
  },
  steps: {
    title: 'Nasıl katılırım?',
    description: 'Girişiminizi dört basit adımda ödüle sunabilirsiniz.',
    stepLabel: 'Adım',
    items: [
      {
        id: 'read',
        title: 'Koşulları okuyun',
        description: 'Girişiminizin beş koşulun tamamını karşıladığını kontrol edin.',
      },
      {
        id: 'form',
        title: 'Başvuru formunu doldurun',
        description: 'Girişimin, temsilcisinin ve uygulamanın bilgilerini girin.',
      },
      {
        id: 'support',
        title: 'Destekleyici bilgileri ekleyin',
        description: 'Etki sorularını yanıtlayın, dilerseniz destekleyici fotoğraflar ekleyin.',
      },
      {
        id: 'submit',
        title: 'Değerlendirmeye gönderin',
        description: 'Başvuru özetinizi gözden geçirin, ardından değerlendirmeye gönderin.',
      },
    ],
  },
  faq: {
    title: 'Sıkça sorulan sorular',
    description: 'Ödül ve başvuru hakkında en çok sorulan soruların yanıtları.',
    items: [
      {
        id: 'who',
        question: 'Ödüle kimler başvurabilir?',
        answer:
          'Beş koşulun tamamını karşılayan her gönüllü girişim başvurabilir: tüm üyeleri Yemenli olmalı, son 12 ay içinde Yemen’de uygulanmış olmalı, gönüllü ve kâr amacı gütmeyen bir girişim olmalı, bir kalkınma alanına odaklanmalı ve yönetimi ile uygulaması bağımsız olmalıdır.',
      },
      {
        id: 'location',
        question: 'Girişimin Yemen’de uygulanmış olması şart mı?',
        answer:
          'Evet. Girişim son on iki ay içinde Yemen’de hayata geçirilmiş olmalıdır; başvuru formunda il, ilçe ve uygulama tarihleri sorulur.',
      },
      {
        id: 'independent',
        question: 'Kâr amaçlı veya bağımsız olmayan bir girişim katılabilir mi?',
        answer:
          'Hayır. Ödül, çalışmalarını kendi ekibi tarafından bağımsız olarak yöneten ve uygulayan, gönüllü ve kâr amacı gütmeyen girişimlerle sınırlıdır.',
      },
      {
        id: 'register',
        question: 'Nasıl başvurulur?',
        answer:
          'Başvurular bu sitedeki çevrim içi aday gösterme formu üzerinden yapılır. Form dört adımdan oluşur: temel bilgiler, girişim ayrıntıları, etki soruları ve göndermeden önce ekler ile son kontrol.',
      },
      {
        id: 'requirements',
        question: 'Başvuru formunda hangi bilgiler istenir?',
        answer:
          'Girişimin adı, temsilcisinin iletişim bilgileri, ekip büyüklüğü, uygulandığı yer ve tarih, alanı ve en az iki sosyal medya hesabının bağlantıları ile girişimin fikri, etkisi, ekibi ve sürdürülebilirliği hakkında kısa yanıtlar. Destekleyici fotoğraflar isteğe bağlı olarak eklenebilir.',
      },
      {
        id: 'timeline',
        question: 'Başvurular ne zaman kapanır, kazananlar nasıl seçilir?',
        answer:
          'Resmî tarihler, değerlendirme ölçütleri ve ödüllendirme ayrıntıları, ödülün resmî belgesi onaylandığında duyurulacaktır.',
        draft: true,
      },
    ],
  },
  cta: {
    title: 'Değişimin bir parçası olun',
    description: 'Girişiminiz başkalarına ilham kaynağı olabilir; hikâyesini Owais Gönüllülük Ödülü ile paylaşın.',
    button: 'Ödüle başvur',
  },
};

const awardContent: Record<Locale, AwardContent> = { ar, en, tr };

export function getAwardContent(locale: Locale): AwardContent {
  return awardContent[locale] ?? awardContent.ar;
}
