// Home page content data.
// Centralized here for easy maintenance and future updates.

import blessedTreeImage from '@/assets/projects/blessed-tree.jpg';
import goldPortfolioImage from '@/assets/projects/gold-portfolio.jpeg';
import waqfShareImage from '@/assets/projects/waqf-share.jpeg';

export const siteConfig = {
  name: 'وقف أويس القرني',
  logo: '/media/cropped-cropped-170x57-1-18a12f60.png',
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
  { label: 'المشاريع الوقفية', href: '/projects' },
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
  posterImage: '/media/135a7765-scaled-1-1024x683-97228b97.jpg',
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
  image: '/media/135a7765-scaled-1-1024x683-97228b97.jpg',
};

export type Project = {
  id: string;
  name: string;
  description: string;
  contribution: string;
  image: string;
  detailsUrl: string;
  contributionUrl?: string;
};

export const projects: Project[] = [
  {
    id: 'waqf-share',
    name: 'السهم الوقفي',
    description:
      'سهم وقفي استثماري يتيح لكل يمني ومحبي اليمن المشاركة في بناء أكبر وقف في تاريخ اليمن، بقيمة مساهمة متاحة تسهم في صناعة موارد وقفية مستدامة.',
    contribution: '100 دولار',
    image: waqfShareImage,
    detailsUrl: '/projects/waqf-share',
    contributionUrl: '/donate',
  },
  {
    id: 'blessed-tree',
    name: 'مشروع الشجرة المباركة',
    description:
      'مشروع وقفي استثماري دائم في تركيا من خلال شراء واستثمار أشجار الزيتون المنتجة لا يقل عمرها عن عشر سنين، على مساحة 33 متر مربع من الأرض للشجرة الواحدة.',
    contribution: '100 دولار',
    image: blessedTreeImage,
    detailsUrl: '/projects/blessed-tree',
    contributionUrl: '/donate',
  },
  {
    id: 'gold-portfolio',
    name: 'محفظة الذهب الوقفية',
    description:
      'محفظة وقفية استثمارية مبنية على الذهب، تؤمّن موارد مستدامة لبرامج الوقف وتحافظ على قيمة الأصول الوقفية عبر الزمن.',
    contribution: '100 دولار',
    image: goldPortfolioImage,
    detailsUrl: '/projects/gold-wallet',
    contributionUrl: '/donate',
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
    image: '/media/file-6c159173.jpg',
    url: '/programs/yemen-pioneers',
  },
  {
    id: 'capacity-building',
    title: 'بناء القدرات',
    description:
      'المساهمة في تأهيل قيادات المؤسسات الحكومية والأهلية وتطوير أدائهم ورفع كفاءتهم.',
    image: '/media/5-41deee62.png',
    url: '/programs/capacity-building',
  },
  {
    id: 'institutional-development',
    title: 'التطوير المؤسسي',
    description:
      'تطوير أداء المؤسسات الحكومية والأهلية وتحديث برامجها وآلياتها وخططها واستراتيجياتها.',
    image: '/media/6-8aafe52f.png',
    url: '/programs/institutional-development',
  },
  {
    id: 'community-awareness',
    title: 'التوعية المجتمعية',
    description:
      'إعادة صياغة الرأي العام والهوية الوطنية الجامعة والتوعية بثقافة النهضة والتعايش.',
    image: '/media/4-17cc70a3.png',
    url: '/programs/community-awareness',
  },
];

export const yemenPioneersContent = {
  title: 'رواد اليمن',
  description:
    'برنامج متكامل يهتم بالتعليم والتأهيل النوعي للطلاب الموهوبين والمتفوقين من أبناء اليمن، وإعدادهم قادة للمستقبل عبر منح دراسية وبرامج قيادية ومهارية.',
  button: 'اكتشف البرنامج',
  image: '/media/135a7765-scaled-1-1024x683-97228b97.jpg',
  indicators: [
    { label: 'منح تعليمية', value: 86 },
    { label: 'أبحاث علمية محكّمة', value: 33 },
    { label: 'ملتقيات تدريبية', value: 6 },
    { label: 'مشاركات دولية', value: 7 },
  ],
  statisticsSource: {
    label: 'المصدر: تقرير «أويس في أرقام» — حتى ديسمبر 2025',
    url: '/media/docs/2025-c909c767.pdf',
  },
};

export const statisticsContent = {
  title: 'أويس في أرقام',
  indicators: [
    { label: 'سهماً وقفياً', value: 17488 as number | null, suffix: '' },
    { label: 'مساهماً ومساهمة من 22 دولة', value: 9403 as number | null, suffix: '' },
    { label: 'مستفيداً من المسارات الوقفية', value: 1556 as number | null, suffix: '' },
    { label: 'برنامجاً تنموياً ضمن المسارات الوقفية', value: 40 as number | null, suffix: '' },
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
    image: '/media/.jpg-scaled-ed6ad55b.jpeg',
    url: '/news/shura-member-condolences-sheikh-hamad',
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
      '/media/file-9aa999b6.jpeg',
    url: '/news/democracy-national-unity-day',
  },
  {
    id: 'condolences-qatar',
    title:
      'وقف أويس القرني يعزّي دولة قطر في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني',
    category: 'أخبار',
    date: 'يوليو 2026',
    excerpt:
      'بقلوب مؤمنة بقضاء الله وقدره تلقينا نبأ وفاة سمو الأمير الوالد الشيخ حمد بن خليفة آل ثاني رحمه الله، وتتقدم كافة هيئات الوقف بأحر التعازي.',
    image: '/media/whatsapp-image-2026-07-13-at-15.55.06-7a2c58f4.jpeg',
    url: '/news/qatar-condolences-sheikh-hamad',
  },
];

export type Partner = {
  name: string;
  logo: string;
};

export const partners: Partner[] = [
  { name: 'هيئة المنح التركية YTB', logo: '/media/ytb-logo-yatay-yaldiz-150x150-9e4ed0b3.png' },
  { name: 'البادية للتنمية والأعمال الإنسانية', logo: '/media/logo3-1-50865719.png' },
  { name: 'شريك وقفي', logo: '/media/logo2-150x118-ed42d6c2.png' },
  { name: 'شريك وقفي', logo: '/media/dkghxzrxsaakqa3-150x150-b0778c69.jpg' },
  { name: 'منصة بيفول', logo: '/media/150x150-dc4fef1e.jpg' },
  { name: 'شريك وقفي', logo: '/media/download_image_1714989756380-150x150-e6c9705e.png' },
  { name: 'شريك وقفي', logo: '/media/22ff63b6bb2d8355ef224aada68ed218-1-150x150-b12720b9.png' },
  { name: 'شريك وقفي', logo: '/media/download_image_1717068331986-1-150x150-cdbfa110.png' },
  { name: 'شريك وقفي', logo: '/media/whatsapp-image-2024-08-14-at-14.10.13-150x150-340b1281.jpeg' },
  { name: 'شريك وقفي', logo: '/media/whatsapp-image-2024-08-14-at-14.10.12-150x150-7ed6083a.jpeg' },
  { name: 'شريك وقفي', logo: '/media/whatsapp-image-2024-08-14-at-14.10.11-150x150-7a288ba7.jpeg' },
  { name: 'شريك وقفي', logo: '/media/whatsapp-image-2024-08-14-at-14.10.12-1-150x150-061d7473.png' },
  { name: 'شريك وقفي', logo: '/media/2025-02-25-15.05.46_84749624-150x150-78272285.jpg' },
  { name: 'سيف ذا شلدرن', logo: '/media/1-87baca56.png' },
];

export const participationContent = {
  title: 'كن شريكًا في أثرٍ مستدام',
  description:
    'بمساهمتك، تتحول الموارد الوقفية إلى فرص تعليم وتأهيل ومشروعات يستمر أثرها.',
  primaryButton: 'ساهم الآن',
  secondaryButton: 'تطوع معنا',
  image: '/media/135a7765-scaled-1-1024x683-97228b97.jpg',
};

export const footerContent = {
  description:
    'مؤسسة وقفية تسعى إلى إيجاد أوعية استثمارية مبتكرة ومستدامة، وتوجيه عوائدها نحو التعليم وبناء القدرات وبرامج نهوض اليمن.',
  quickLinks: [
    { label: 'عن الوقف', href: '#about' },
    { label: 'المشاريع الوقفية', href: '/projects' },
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
