// All site content sourced from https://veysvakfi.org/
// Centralized here for easy maintenance and future updates.

import blessedTreeImage from '@/assets/projects/blessed-tree.jpg';
import goldPortfolioImage from '@/assets/projects/gold-portfolio.jpeg';
import waqfShareImage from '@/assets/projects/waqf-share.jpeg';

export const siteConfig = {
  name: 'وقف أويس القرني',
  logo: 'https://veysvakfi.org/wp-content/uploads/2023/06/cropped-cropped-شعار-الوقف-170x57-1.png',
  licenseNumber: '6222',
  courtDecision: '2016/223-2016/501',
  taxNumber: '9250524198',
  taxExempt: true,
  socialLinks: {
    facebook: 'https://www.facebook.com/veysvakfi',
    twitter: 'https://twitter.com/veysvakfi',
    instagram: 'https://www.instagram.com/veysvakfi',
    youtube: 'https://www.youtube.com/@veysvakfi',
  },
};

export const navLinks = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'عن الوقف', href: '#about' },
  { label: 'المشاريع الوقفية', href: '#projects' },
  { label: 'البرامج', href: '#programs' },
  { label: 'الأخبار', href: '#news' },
  { label: 'المكتبة', href: '#library' },
  { label: 'تواصل معنا', href: '#contact' },
];

export const heroContent = {
  title: 'وقفٌ يبني الإنسان ويصنع المستقبل',
  description:
    'نصنع أوعية وقفية استثمارية مستدامة، ونوجّه عوائدها نحو التعليم وبناء القدرات والمشروعات التي تسهم في نهوض اليمن.',
  primaryButton: 'تعرّف على الوقف',
  secondaryButton: 'ساهم الآن',
  videoId: 'LMK-Sv__71w',
  posterImage: 'https://veysvakfi.org/wp-content/uploads/2024/05/135A7765-scaled-1-1024x683.jpg',
};

export const aboutContent = {
  title: 'وقف أويس القرني',
  description:
    'مؤسسة وقفية تسعى إلى إيجاد أوعية استثمارية مبتكرة ومستدامة، والتكامل مع الشركاء في بناء القدرات وتنفيذ البرامج المساندة التي تخدم نهوض اليمن.',
  vision: 'رواد الوقف التشاركي التخصصي في نهوض اليمن الحضاري.',
  mission: 'صناعة أوعية وقفية استثمارية مبتكرة تؤمّن موارد مستدامة لبرامج النهوض.',
  values: ['المؤسسية', 'الشراكة', 'الطموح', 'الشفافية', 'المبادرة', 'الاستدامة'],
  goals: [
    'إيجاد الوقف بمساهمة كل اليمنيين ومحبي اليمن حول العالم، وتنمية موارده كمؤسسة مالية استثمارية وقفية.',
    'تعزيز الروح الوطنية لدى اليمنيين كشركاء في إيجاد أكبر وقف في تاريخ اليمن بمساهمتهم جميعًا.',
    'ترسيخ الهُوية الوطنية الجامعة وتحقيق التنمية المستدامة لليمن.',
  ],
  image: 'https://veysvakfi.org/wp-content/uploads/2024/05/135A7765-scaled-1-1024x683.jpg',
};

export type Project = {
  id: string;
  name: string;
  description: string;
  contribution: string;
  image: string;
  detailsUrl: string;
};

export const projects: Project[] = [
  {
    id: 'waqf-share',
    name: 'السهم الوقفي',
    description:
      'سهم وقفي استثماري يتيح لكل يمني ومحبي اليمن المشاركة في بناء أكبر وقف في تاريخ اليمن، بقيمة مساهمة متاحة تسهم في صناعة موارد وقفية مستدامة.',
    contribution: '100 دولار',
    image: waqfShareImage,
    detailsUrl: '#projects',
  },
  {
    id: 'blessed-tree',
    name: 'مشروع الشجرة المباركة',
    description:
      'مشروع وقفي استثماري دائم في تركيا من خلال شراء واستثمار أشجار الزيتون المنتجة لا يقل عمرها عن عشر سنين، على مساحة 33 متر مربع من الأرض للشجرة الواحدة.',
    contribution: '300 دولار',
    image: blessedTreeImage,
    detailsUrl: 'https://blessedtree.veysvakfi.org/',
  },
  {
    id: 'gold-portfolio',
    name: 'محفظة الذهب الوقفية',
    description:
      'محفظة وقفية استثمارية مبنية على الذهب، تؤمّن موارد مستدامة لبرامج الوقف وتحافظ على قيمة الأصول الوقفية عبر الزمن.',
    contribution: '100 دولار',
    image: goldPortfolioImage,
    detailsUrl: '#projects',
  },
];

export type Program = {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
};

export const programs: Program[] = [
  {
    id: 'future-leaders',
    title: 'إعداد قادة المستقبل',
    description:
      'الاهتمام بأوائل الطلاب والموهوبين والمبدعين المتميزين وإعدادهم قادة للمستقبل عبر برنامج رواد اليمن.',
    image: 'https://veysvakfi.org/wp-content/uploads/2025/10/برنامج-رواد-اليمن-وقف-أويس-القرني.jpg',
    url: 'https://veysvakfi.org/برنامج-رواد-اليمن/',
  },
  {
    id: 'capacity-building',
    title: 'بناء القدرات',
    description:
      'المساهمة في تأهيل قيادات المؤسسات الحكومية والأهلية وتطوير أدائهم ورفع كفاءتهم.',
    image: 'https://veysvakfi.org/wp-content/uploads/2024/10/تصميم-بدون-عنوان-5.png',
    url: 'https://veysvakfi.org/بناء-القدرات/',
  },
  {
    id: 'institutional-development',
    title: 'التطوير المؤسسي',
    description:
      'تطوير أداء المؤسسات الحكومية والأهلية وتحديث برامجها وآلياتها وخططها واستراتيجياتها.',
    image: 'https://veysvakfi.org/wp-content/uploads/2024/10/تصميم-بدون-عنوان-6.png',
    url: 'https://veysvakfi.org/التطوير-المؤسسي/',
  },
  {
    id: 'community-awareness',
    title: 'التوعية المجتمعية',
    description:
      'إعادة صياغة الرأي العام والهوية الوطنية الجامعة والتوعية بثقافة النهضة والتعايش.',
    image: 'https://veysvakfi.org/wp-content/uploads/2024/10/تصميم-بدون-عنوان-4.png',
    url: 'https://veysvakfi.org/التوعية-المجتمعية-2/',
  },
];

export const yemenPioneersContent = {
  title: 'رواد اليمن',
  description:
    'برنامج متكامل يهتم بالتعليم والتأهيل النوعي للطلاب الموهوبين والمتفوقين من أبناء اليمن، وإعدادهم قادة للمستقبل عبر منح دراسية وبرامج قيادية ومهارية.',
  button: 'اكتشف البرنامج',
  image: 'https://veysvakfi.org/wp-content/uploads/2024/05/135A7765-scaled-1-1024x683.jpg',
  indicators: [
    { label: 'عدد الطلاب والطالبات', value: null as number | null },
    { label: 'عدد المحافظات', value: null as number | null },
    { label: 'عدد الجامعات', value: null as number | null },
    { label: 'عدد التخصصات', value: null as number | null },
  ],
};

export const statisticsContent = {
  title: 'أويس في أرقام',
  indicators: [
    { label: 'عدد الأسهم الوقفية', value: null as number | null, suffix: '' },
    { label: 'عدد المساهمين', value: null as number | null, suffix: '' },
    { label: 'المستفيدون من البرامج', value: null as number | null, suffix: '' },
    { label: 'عدد البرامج والمشروعات', value: null as number | null, suffix: '' },
  ],
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

export const news: NewsItem[] = [
  {
    id: 'condolences-sheikh-hamad',
    title:
      'عضو مجلس الشورى ورئيس وقف أويس القرني يقدّم واجب العزاء في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني',
    category: 'أخبار',
    date: 'يوليو 2026',
    excerpt:
      'قدّم رئيس وقف أويس القرني عضو مجلس الشورى الأستاذ صلاح باتيس واجب العزاء في وفاة الأمير الوالد سمو الشيخ حمد بن خليفة آل ثاني، وذلك في القنصلية العامة لدولة قطر.',
    image: 'https://veysvakfi.org/wp-content/uploads/2026/07/تعزية-امير-قطر.JPG-scaled.jpeg',
    url: 'https://veysvakfi.org/shura-member-condolences-sheikh-hamad-bin-khalifa/',
    featured: true,
  },
  {
    id: 'democracy-unity-day',
    title:
      'وقف أويس القرني يحيي الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية في تركيا',
    category: 'أخبار',
    date: 'يوليو 2026',
    excerpt:
      'في الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية، يستذكر وقف أويس القرني بكل تقدير تضحيات الشعب التركي في حماة وطنه وإرادته ووحدته.',
    image:
      'https://veysvakfi.org/wp-content/uploads/2026/07/وقف-أويس-القرني-يحيي-الذكرى-العاشرة-ليوم-الديمقراطية-والوحدة-الوطنية-في-تركيا.jpeg',
    url: 'https://veysvakfi.org/owais-waqf-democracy-and-national-unity-day/',
  },
  {
    id: 'condolences-qatar',
    title:
      'وقف أويس القرني يعزّي دولة قطر في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني',
    category: 'أخبار',
    date: 'يوليو 2026',
    excerpt:
      'بقلوب مؤمنة بقضاء الله وقدره تلقينا نبأ وفاة سمو الأمير الوالد الشيخ حمد بن خليفة آل ثاني رحمه الله، وتتقدم كافة هيئات الوقف بأحر التعازي.',
    image: 'https://veysvakfi.org/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-13-at-15.55.06.jpeg',
    url: 'https://veysvakfi.org/owais-waqf-condolences-sheikh-hamad-bin-khalifa/',
  },
];

export type Partner = {
  name: string;
  logo: string;
};

export const partners: Partner[] = [
  { name: 'هيئة المنح التركية YTB', logo: 'https://veysvakfi.org/wp-content/uploads/2018/11/ytb-logo-yatay-yaldiz-150x150.png' },
  { name: 'البادية للتنمية والأعمال الإنسانية', logo: 'https://veysvakfi.org/wp-content/uploads/2018/05/logo3-1.png' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2018/05/logo2-150x118.png' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2018/11/DkGHXZrXsAAkQA3-150x150.jpg' },
  { name: 'منصة بيفول', logo: 'https://veysvakfi.org/wp-content/uploads/2024/01/منصة-بيفول-اويس-القرني-وقف-السهم-الوقفي-سهم-وقفي-150x150.jpg' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2024/05/download_image_1714989756380-150x150.png' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2024/05/22ff63b6bb2d8355ef224aada68ed218-1-150x150.png' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2024/05/download_image_1717068331986-1-150x150.png' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.13-150x150.jpeg' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.12-150x150.jpeg' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.11-150x150.jpeg' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-14-at-14.10.12-1-150x150.png' },
  { name: 'شريك وقفي', logo: 'https://veysvakfi.org/wp-content/uploads/2025/02/صورة-واتساب-بتاريخ-2025-02-25-في-15.05.46_84749624-150x150.jpg' },
  { name: 'سيف ذا شلدرن', logo: 'https://veysvakfi.org/wp-content/uploads/2025/11/سيف-ذا-شلدرن-1.png' },
];

export const participationContent = {
  title: 'كن شريكًا في أثرٍ مستدام',
  description:
    'بمساهمتك، تتحول الموارد الوقفية إلى فرص تعليم وتأهيل ومشروعات يستمر أثرها.',
  primaryButton: 'ساهم الآن',
  secondaryButton: 'تطوع معنا',
  image: 'https://veysvakfi.org/wp-content/uploads/2024/05/135A7765-scaled-1-1024x683.jpg',
};

export const footerContent = {
  description:
    'مؤسسة وقفية تسعى إلى إيجاد أوعية استثمارية مبتكرة ومستدامة، وتوجيه عوائدها نحو التعليم وبناء القدرات وبرامج نهوض اليمن.',
  quickLinks: [
    { label: 'عن الوقف', href: '#about' },
    { label: 'المشاريع الوقفية', href: '#projects' },
    { label: 'البرامج', href: '#programs' },
    { label: 'الأخبار', href: '#news' },
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
};
