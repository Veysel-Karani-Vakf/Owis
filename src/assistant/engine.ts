import { aboutRoutes, getAboutContent } from '@/data/about';
import { bankAccountsRoute, getBankAccountsContent } from '@/data/bankAccounts';
import { donateRoute, getDonateContent } from '@/data/donate';
import { getLibraryContent, getTextItems, getDocuments, libraryRoutes } from '@/data/library';
import { getNewsLabels, getOrderedNews, newsRoutes } from '@/data/news';
import { getParticipateContent, participateRoutes } from '@/data/participate';
import { getProgramsContent } from '@/data/programs';
import { getProjectsContent, projectRoutes } from '@/data/projects';
import type { Locale, SiteContent } from '@/i18n/content';

/**
 * A self-contained, offline site assistant. Everything it knows comes from the
 * site's own content (static data merged with the CMS snapshot); it never
 * calls an external service and never answers about anything outside the site.
 */

export type AssistantLink = {
  label: string;
  href: string;
  hint?: string;
  kind: EntryKind;
};

export type AssistantReply = {
  text: string;
  links?: AssistantLink[];
  /** Follow-up chips shown under the reply. */
  suggestions?: string[];
};

export type EntryKind = 'page' | 'program' | 'project' | 'news' | 'library' | 'document' | 'form';

export type IndexEntry = {
  id: string;
  kind: EntryKind;
  title: string;
  description: string;
  href: string;
  keywords: string[];
  /** Newer items win ties; ISO date when known. */
  date?: string;
};

export type AssistantLabels = {
  title: string;
  subtitle: string;
  open: string;
  close: string;
  placeholder: string;
  send: string;
  welcome: string;
  suggestions: string[];
  kinds: Record<EntryKind, string>;
  resultsIntro: string;
  noResults: string;
  offTopic: string;
  greeting: string;
  thanks: string;
  help: string;
  donate: string;
  bank: string;
  bankBanks: string;
  contact: string;
  contactEmail: string;
  contactAddress: string;
  volunteer: string;
  complaints: string;
  ideas: string;
  news: string;
  library: string;
  programs: string;
  projects: string;
  about: string;
  governance: string;
  language: string;
  typing: string;
  poweredBy: string;
};

export const assistantLabels: Record<Locale, AssistantLabels> = {
  ar: {
    title: 'مساعد الموقع',
    subtitle: 'أجيب عن أسئلتك حول محتوى هذا الموقع فقط',
    open: 'افتح مساعد الموقع',
    close: 'إغلاق المساعد',
    placeholder: 'اكتب سؤالك عن الموقع…',
    send: 'إرسال',
    welcome:
      'أهلاً بك في وقف أويس القرني. أستطيع مساعدتك في الوصول إلى أي صفحة أو محتوى داخل الموقع: البرامج، المشاريع الوقفية، الأخبار، المكتبة، طرق التبرع، الحسابات البنكية، والتواصل معنا. بماذا أساعدك؟',
    suggestions: ['كيف أتبرع؟', 'الحسابات البنكية', 'برامج الوقف', 'المشاريع الوقفية', 'آخر الأخبار', 'أريد التطوع', 'التواصل معنا'],
    kinds: {
      page: 'صفحة',
      program: 'برنامج',
      project: 'مشروع وقفي',
      news: 'خبر',
      library: 'المكتبة',
      document: 'وثيقة',
      form: 'نموذج',
    },
    resultsIntro: 'وجدت ما يلي داخل الموقع:',
    noResults: 'لم أجد محتوى مطابقاً داخل الموقع. جرّب كلمات أخرى، أو ابدأ من أحد الأقسام الرئيسية:',
    offTopic: 'أنا مساعد مخصص لمحتوى هذا الموقع فقط، ولا أستطيع الإجابة عن أمور خارجه. يمكنني مساعدتك في التنقل داخل الموقع:',
    greeting: 'أهلاً وسهلاً! كيف أساعدك في تصفح الموقع اليوم؟',
    thanks: 'على الرحب والسعة! إن احتجت شيئاً آخر داخل الموقع فأنا هنا.',
    help: 'يمكنك أن تسألني مثلاً: "كيف أتبرع؟"، "ما هي برامج الوقف؟"، "أين الحسابات البنكية؟"، "أريد التطوع"، أو اكتب كلمة للبحث في الصفحات والأخبار والمكتبة.',
    donate: 'يمكنك المساهمة في الوقف عبر صفحة التبرع، حيث تجد فرص المساهمة المتاحة، أو عبر التحويل البنكي المباشر إلى حسابات الوقف الرسمية.',
    bank: 'الحسابات البنكية الرسمية للوقف مسجّلة باسم "{holder}". تجد أرقام IBAN الكاملة لكل عملة في صفحة الحسابات البنكية.',
    bankBanks: 'البنوك المتاحة: {banks}.',
    contact: 'يسعدنا تواصلك معنا. يمكنك مراسلتنا عبر نموذج التواصل في الموقع أو عبر قنواتنا المباشرة.',
    contactEmail: 'البريد الإلكتروني: {email}',
    contactAddress: 'العنوان: {address}',
    volunteer: 'شكراً لرغبتك في التطوع معنا! يمكنك التسجيل عبر نموذج التطوع، والاطلاع على وحدة التطوع ضمن برامج الوقف.',
    complaints: 'يمكنك تقديم شكوى أو اقتراح عبر النموذج المخصص، وسيصل مباشرة إلى الجهة المعنية في الوقف.',
    ideas: 'نرحّب بأفكارك! شاركنا مبادرتك أو فكرتك عبر نموذج مشاركة الأفكار.',
    news: 'إليك آخر الأخبار المنشورة في الموقع:',
    library: 'تضم مكتبة الوقف الأقسام التالية:',
    programs: 'برامج الوقف الحالية:',
    projects: 'المشاريع الوقفية التي يمكنك المساهمة فيها:',
    about: 'تجد التعريف الكامل بالوقف ورؤيته ورسالته وقيمه في صفحة "عن الوقف".',
    governance: 'تجد سياسات الحوكمة المعتمدة في الوقف في صفحة الحوكمة:',
    language: 'يمكنك تغيير لغة الموقع (العربية، التركية، الإنجليزية) من زر اللغة في أعلى الصفحة.',
    typing: 'جارٍ الكتابة…',
    poweredBy: 'يعمل بالكامل داخل الموقع دون أي خدمة خارجية',
  },
  tr: {
    title: 'Site Asistanı',
    subtitle: 'Yalnızca bu sitenin içeriğiyle ilgili sorularınızı yanıtlarım',
    open: 'Site asistanını aç',
    close: 'Asistanı kapat',
    placeholder: 'Site hakkında sorunuzu yazın…',
    send: 'Gönder',
    welcome:
      'Veysel Karani Vakfı’na hoş geldiniz. Sitedeki her sayfa ve içeriğe ulaşmanıza yardımcı olabilirim: programlar, vakıf projeleri, haberler, kütüphane, bağış yolları, banka hesapları ve iletişim. Nasıl yardımcı olabilirim?',
    suggestions: ['Nasıl bağış yaparım?', 'Banka hesapları', 'Vakıf programları', 'Vakıf projeleri', 'Son haberler', 'Gönüllü olmak istiyorum', 'Bize ulaşın'],
    kinds: {
      page: 'Sayfa',
      program: 'Program',
      project: 'Vakıf projesi',
      news: 'Haber',
      library: 'Kütüphane',
      document: 'Belge',
      form: 'Form',
    },
    resultsIntro: 'Sitede şunları buldum:',
    noResults: 'Sitede eşleşen bir içerik bulamadım. Başka kelimeler deneyin veya ana bölümlerden başlayın:',
    offTopic: 'Ben yalnızca bu sitenin içeriği için tasarlanmış bir asistanım; site dışı konularda yanıt veremem. Sitede gezinmenize yardımcı olabilirim:',
    greeting: 'Merhaba! Bugün sitede size nasıl yardımcı olabilirim?',
    thanks: 'Rica ederim! Sitede başka bir şeye ihtiyacınız olursa buradayım.',
    help: 'Örneğin şunları sorabilirsiniz: "Nasıl bağış yaparım?", "Vakfın programları neler?", "Banka hesapları nerede?", "Gönüllü olmak istiyorum" ya da sayfalarda, haberlerde ve kütüphanede aramak için bir kelime yazın.',
    donate: 'Bağış sayfasındaki katkı fırsatları üzerinden veya vakfın resmi banka hesaplarına doğrudan havale ile katkıda bulunabilirsiniz.',
    bank: 'Vakfın resmi banka hesapları "{holder}" adına kayıtlıdır. Her para birimi için tam IBAN numaralarını banka hesapları sayfasında bulabilirsiniz.',
    bankBanks: 'Bankalar: {banks}.',
    contact: 'Bizimle iletişime geçmenizden memnuniyet duyarız. Sitedeki iletişim formunu veya doğrudan kanallarımızı kullanabilirsiniz.',
    contactEmail: 'E-posta: {email}',
    contactAddress: 'Adres: {address}',
    volunteer: 'Gönüllü olmak istediğiniz için teşekkürler! Gönüllü formundan kayıt olabilir ve programlar arasındaki gönüllü birimini inceleyebilirsiniz.',
    complaints: 'Şikayet veya önerinizi ilgili form üzerinden iletebilirsiniz; doğrudan vakıftaki yetkili birime ulaşır.',
    ideas: 'Fikirlerinizi bekliyoruz! Girişiminizi veya fikrinizi fikir paylaşım formu üzerinden iletin.',
    news: 'Sitede yayımlanan son haberler:',
    library: 'Vakıf kütüphanesi şu bölümlerden oluşur:',
    programs: 'Vakfın mevcut programları:',
    projects: 'Katkıda bulunabileceğiniz vakıf projeleri:',
    about: 'Vakfın tanıtımı, vizyonu, misyonu ve değerleri "Vakıf Hakkında" sayfasında yer alır.',
    governance: 'Vakfın onaylı yönetişim politikalarını yönetişim sayfasında bulabilirsiniz:',
    language: 'Site dilini (Arapça, Türkçe, İngilizce) sayfanın üst kısmındaki dil düğmesinden değiştirebilirsiniz.',
    typing: 'Yazıyor…',
    poweredBy: 'Tamamen site içinde, harici bir hizmet olmadan çalışır',
  },
  en: {
    title: 'Site Assistant',
    subtitle: 'I only answer questions about this website’s content',
    open: 'Open the site assistant',
    close: 'Close the assistant',
    placeholder: 'Ask something about the site…',
    send: 'Send',
    welcome:
      'Welcome to the Veysel Karani Waqf. I can help you reach any page or content on this site: programs, waqf projects, news, the library, ways to donate, bank accounts and contact. How can I help?',
    suggestions: ['How do I donate?', 'Bank accounts', 'Waqf programs', 'Waqf projects', 'Latest news', 'I want to volunteer', 'Contact us'],
    kinds: {
      page: 'Page',
      program: 'Program',
      project: 'Waqf project',
      news: 'News',
      library: 'Library',
      document: 'Document',
      form: 'Form',
    },
    resultsIntro: 'Here is what I found on the site:',
    noResults: 'I couldn’t find matching content on the site. Try other words, or start from one of the main sections:',
    offTopic: 'I’m an assistant for this website’s content only and can’t answer questions outside it. I can help you navigate the site:',
    greeting: 'Hello! How can I help you browse the site today?',
    thanks: 'You’re welcome! I’m here if you need anything else on the site.',
    help: 'You can ask me things like: “How do I donate?”, “What are the waqf’s programs?”, “Where are the bank accounts?”, “I want to volunteer”, or type a word to search pages, news and the library.',
    donate: 'You can contribute through the donate page, where the available contribution opportunities are listed, or by direct bank transfer to the waqf’s official accounts.',
    bank: 'The waqf’s official bank accounts are registered under “{holder}”. Full IBANs for each currency are on the bank accounts page.',
    bankBanks: 'Available banks: {banks}.',
    contact: 'We’d love to hear from you. Use the contact form on the site or one of our direct channels.',
    contactEmail: 'Email: {email}',
    contactAddress: 'Address: {address}',
    volunteer: 'Thank you for wanting to volunteer! Register through the volunteer form, and explore the volunteer unit under the waqf’s programs.',
    complaints: 'You can submit a complaint or suggestion through the dedicated form; it reaches the responsible team at the waqf directly.',
    ideas: 'We welcome your ideas! Share your initiative or idea through the idea-sharing form.',
    news: 'Here are the latest news items published on the site:',
    library: 'The waqf library includes the following sections:',
    programs: 'The waqf’s current programs:',
    projects: 'Waqf projects you can contribute to:',
    about: 'The full introduction to the waqf, its vision, mission and values is on the “About the Waqf” page.',
    governance: 'The waqf’s approved governance policies are on the governance page:',
    language: 'You can switch the site language (Arabic, Turkish, English) from the language button at the top of the page.',
    typing: 'Typing…',
    poweredBy: 'Runs entirely inside the site, with no external service',
  },
};

// ---------------------------------------------------------------------------
// Text normalisation and matching

const STOPWORDS = new Set([
  // ar
  'في', 'من', 'على', 'عن', 'الى', 'إلى', 'ما', 'هو', 'هي', 'هل', 'كيف', 'اين', 'أين', 'او', 'أو', 'ان', 'أن', 'مع', 'لي', 'لك', 'انا', 'أنا', 'اريد', 'أريد', 'ابحث', 'أبحث', 'عندكم', 'لديكم', 'الموقع', 'صفحه', 'صفحة', 'اليوم', 'يوم', 'الان', 'الآن',
  // en
  'the', 'a', 'an', 'is', 'are', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'i', 'you', 'me', 'my', 'do', 'does', 'how', 'what', 'where', 'can', 'want', 'find', 'about', 'page', 'site', 'please', 'show', 'today', 'now',
  // tr
  've', 'veya', 'bir', 'bu', 'şu', 'ne', 'nedir', 'nerede', 'nasıl', 'için', 'ile', 'mi', 'mı', 'mu', 'mü', 'ben', 'sen', 'istiyorum', 'sayfa', 'site', 'bugün', 'şimdi',
]);

export function normalize(value: string) {
  // Hamza/madda forms fold before NFKD: decomposition would otherwise split
  // them into a bare alef plus a combining mark the character class misses.
  return value
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .normalize('NFKD')
    .replace(/[ً-ْـ]/g, '')
    .replace(/[\u0653-\u0655\u0670]/g, '')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[؟?!.,،;:'"“”‘’()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strips a leading Arabic "ال" so "البرامج" matches "برامج". */
function stem(token: string) {
  if (token.length > 4 && token.startsWith('ال')) return token.slice(2);
  if (token.length > 4 && (token.startsWith('و') || token.startsWith('ب') || token.startsWith('لل'))) {
    const inner = token.startsWith('لل') ? token.slice(2) : token.slice(1);
    return inner.length > 3 ? inner : token;
  }
  return token;
}

export function tokenize(value: string) {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 2 && !STOPWORDS.has(token))
    .map(stem);
}

function includesAny(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(normalize(needle)));
}

// ---------------------------------------------------------------------------
// Site index

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

export function buildSiteIndex(locale: Locale, site: SiteContent): IndexEntry[] {
  const entries: IndexEntry[] = [];
  const about = getAboutContent(locale);
  const programs = getProgramsContent(locale);
  const projects = getProjectsContent(locale);
  const donate = getDonateContent(locale);
  const bank = getBankAccountsContent(locale);
  const newsLabels = getNewsLabels(locale);
  const library = getLibraryContent(locale);
  const participate = getParticipateContent(locale);

  entries.push({
    id: 'home',
    kind: 'page',
    title: site.siteConfig.name || site.meta.title,
    description: site.meta.description,
    href: '/',
    keywords: ['الرئيسية', 'home', 'ana sayfa', 'anasayfa', 'الصفحة الرئيسية'],
  });

  entries.push({
    id: 'about-waqf',
    kind: 'page',
    title: about.waqf.hero.title,
    description: `${about.waqf.hero.description} ${about.waqf.intro.paragraphs.join(' ')} ${site.about.vision} ${site.about.mission.join(' ')} ${site.about.values.join(' ')}`,
    href: aboutRoutes.waqf,
    keywords: ['عن الوقف', 'رؤية', 'رسالة', 'قيم', 'تعريف', 'من نحن', 'about', 'vision', 'mission', 'values', 'hakkında', 'vizyon', 'misyon', 'değerler'],
  });

  entries.push({
    id: 'about-governance',
    kind: 'page',
    title: about.governance.hero.title,
    description: `${about.governance.hero.description} ${about.governance.policies.map((policy) => `${policy.title} ${policy.summary}`).join(' ')}`,
    href: aboutRoutes.governance,
    keywords: ['حوكمة', 'سياسات', 'سياسة', 'شفافية', 'governance', 'policy', 'policies', 'yönetişim', 'politika'],
  });

  for (const program of programs.programs) {
    entries.push({
      id: `program-${program.slug}`,
      kind: 'program',
      title: program.title,
      description: `${program.summary} ${program.sections.map((section) => `${section.title} ${(section.paragraphs ?? []).join(' ')}`).join(' ')}`,
      href: program.route,
      keywords: ['برنامج', 'برامج', 'program', 'programs', 'programlar'],
    });
  }

  entries.push({
    id: 'projects',
    kind: 'page',
    title: projects.hero.title,
    description: `${projects.hero.description} ${projects.intro.paragraphs.join(' ')}`,
    href: projectRoutes.index,
    keywords: ['مشاريع', 'مشروع', 'وقفية', 'projects', 'projeler'],
  });

  for (const project of projects.projects) {
    entries.push({
      id: `project-${project.slug}`,
      kind: 'project',
      title: project.title,
      description: `${project.shortDescription} ${project.fullDescription.join(' ')}`,
      href: project.route,
      keywords: ['مشروع', 'وقفي', 'مساهمة', 'سهم', 'project', 'proje', project.category],
    });
  }

  entries.push({
    id: 'donate',
    kind: 'page',
    title: donate.hero.title,
    description: `${donate.hero.description} ${donate.intro.paragraphs.join(' ')} ${donate.opportunities.map((item) => `${item.title} ${item.description}`).join(' ')}`,
    href: donateRoute,
    keywords: ['تبرع', 'تبرعات', 'مساهمة', 'ساهم', 'دعم', 'صدقة', 'زكاة', 'donate', 'donation', 'contribute', 'support', 'bağış', 'bağışla', 'destek'],
  });

  entries.push({
    id: 'bank-accounts',
    kind: 'page',
    title: bank.hero.title,
    description: `${bank.hero.description} ${bank.intro.paragraphs.join(' ')} ${bank.banks.map((item) => item.name).join(' ')}`,
    href: bankAccountsRoute,
    keywords: ['حساب', 'حسابات', 'بنك', 'بنكية', 'ايبان', 'تحويل', 'iban', 'bank', 'account', 'transfer', 'swift', 'banka', 'hesap', 'havale'],
  });

  entries.push({
    id: 'news',
    kind: 'page',
    title: newsLabels.news,
    description: newsLabels.heroDescription,
    href: newsRoutes.index,
    keywords: ['اخبار', 'خبر', 'جديد', 'مستجدات', 'news', 'latest', 'haber', 'haberler'],
  });

  for (const article of getOrderedNews(locale).slice(0, 60)) {
    entries.push({
      id: `news-${article.slug}`,
      kind: 'news',
      title: article.title,
      description: article.excerpt,
      href: article.route,
      keywords: [String(article.year), article.category],
      date: article.publishedAt,
    });
  }

  entries.push({
    id: 'library',
    kind: 'page',
    title: library.hero.title,
    description: library.hero.description,
    href: libraryRoutes.index,
    keywords: ['مكتبة', 'كتب', 'تقارير', 'وثائق', 'library', 'books', 'reports', 'kütüphane', 'kitap', 'rapor'],
  });

  for (const collection of Object.values(library.collections)) {
    entries.push({
      id: `library-${collection.slug}`,
      kind: 'library',
      title: collection.title,
      description: collection.description,
      href: collection.route,
      keywords: ['مكتبة', 'library', 'kütüphane', collection.shortTitle, collection.eyebrow],
    });
  }

  (['forum', 'success-stories', 'yemeni-figures'] as const).forEach((collection) => {
    for (const item of getTextItems(locale, collection).slice(0, 40)) {
      entries.push({
        id: `text-${collection}-${item.slug}`,
        kind: 'library',
        title: item.title,
        description: item.excerpt,
        href: item.route,
        keywords: [library.collections[collection].shortTitle, String(item.year ?? '')],
        date: item.date,
      });
    }
  });

  (['periodicReports', 'waqfBooks', 'waqfLiterature'] as const).forEach((collection) => {
    const slug = collection === 'periodicReports' ? 'periodic-reports' : collection === 'waqfBooks' ? 'waqf-books' : 'waqf-literature';
    const route = library.collections[slug].route;
    for (const item of getDocuments(collection, locale).slice(0, 40)) {
      entries.push({
        id: `doc-${slug}-${item.id}`,
        kind: 'document',
        title: item.title,
        description: item.excerpt,
        // Documents open inside the collection page, pre-filtered on the title.
        href: `${route}?q=${encodeURIComponent(item.title)}`,
        keywords: [library.collections[slug].shortTitle, String(item.year ?? '')],
        date: item.date,
      });
    }
  });

  const formKeywords: Record<string, string[]> = {
    shareIdeas: ['فكرة', 'افكار', 'مبادرة', 'مشاركة', 'idea', 'ideas', 'initiative', 'fikir', 'fikirler', 'girişim'],
    complaintsSuggestions: ['شكوى', 'شكاوى', 'اقتراح', 'اقتراحات', 'ملاحظة', 'complaint', 'complaints', 'suggestion', 'feedback', 'şikayet', 'öneri'],
    volunteer: ['تطوع', 'متطوع', 'متطوعين', 'انضم', 'انضمام', 'volunteer', 'join', 'gönüllü', 'katıl'],
    contact: ['تواصل', 'اتصال', 'اتصل', 'راسل', 'بريد', 'ايميل', 'هاتف', 'رقم', 'عنوان', 'واتساب', 'contact', 'email', 'phone', 'address', 'whatsapp', 'reach', 'iletişim', 'ulaşın', 'telefon', 'adres', 'e-posta'],
  };

  for (const [key, page] of Object.entries(participate.pages)) {
    entries.push({
      id: `form-${key}`,
      kind: 'form',
      title: page.hero.title,
      description: `${page.hero.description} ${page.intro.paragraphs.join(' ')}`,
      href: page.route || participateRoutes.index,
      keywords: formKeywords[key] ?? [],
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Search

type Scored = { entry: IndexEntry; score: number };

export function searchIndex(index: IndexEntry[], query: string, limit = 5): IndexEntry[] {
  return searchIndexScored(index, query, limit).map((item) => item.entry);
}

/**
 * The single best hit when it clearly dominates the runner-up, otherwise
 * null: lets intent replies focus on "the Blessed Tree" without guessing.
 */
export function bestMatch(index: IndexEntry[], query: string): IndexEntry | null {
  const [first, second] = searchIndexScored(index, query, 2);
  if (!first) return null;
  if (!second || first.score >= second.score * 1.6) return first.entry;
  return null;
}

export function searchIndexScored(index: IndexEntry[], query: string, limit = 5): Scored[] {
  const tokens = tokenize(query);
  const phrase = normalize(query);
  if (!tokens.length && !phrase) return [];

  const scored: Scored[] = [];
  for (const entry of index) {
    const title = normalize(entry.title);
    const description = normalize(entry.description);
    const keywords = normalize(entry.keywords.join(' '));
    const titleWords = title.split(' ').map(stem);
    const keywordWords = keywords.split(' ').map(stem);
    let score = 0;
    let strongHits = 0;
    let descriptionHits = 0;

    if (phrase.length > 3 && title.includes(phrase)) score += 6;

    for (const token of tokens) {
      let strong = false;
      if (titleWords.includes(token)) { score += 4; strong = true; }
      else if (title.includes(token)) { score += 3; strong = true; }
      else if (token.length >= 3 && titleWords.some((word) => word.startsWith(token) || (token.startsWith(word) && word.length >= 3))) { score += 2; strong = true; }

      if (keywordWords.includes(token)) { score += 3; strong = true; }
      else if (token.length >= 3 && keywordWords.some((word) => word.startsWith(token))) { score += 1.5; strong = true; }

      if (description.includes(token)) { score += 1; descriptionHits += 1; }
      if (strong) strongHits += 1;
    }

    // A hit on the description alone is only trusted when most of the query
    // is in it; otherwise everyday words ("today", "Istanbul") drag in
    // unrelated news for off-topic questions.
    let trusted = strongHits > 0 || (descriptionHits >= 2 && descriptionHits >= Math.ceil(tokens.length * 0.6));
    if (entry.kind === 'news' && tokens.length > 1 && strongHits < 2 && !(phrase.length > 3 && title.includes(phrase))) trusted = false;
    if (!trusted) continue;

    // Prefer landing pages over deep items when scores tie.
    if (entry.kind === 'page' || entry.kind === 'form') score += 0.25;
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score || (b.entry.date ?? '').localeCompare(a.entry.date ?? ''));
  const best = scored[0]?.score ?? 0;
  // Drop weak tails once a confident hit exists so answers stay focused, and
  // collapse duplicates (the same document can sit in two collections).
  const seen = new Set<string>();
  return scored
    .filter((item) => item.score >= Math.max(1.5, best * 0.35))
    .filter((item) => {
      const key = `${item.entry.kind}:${normalize(item.entry.title)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Intents

type Intent =
  | 'greeting'
  | 'thanks'
  | 'help'
  | 'donate'
  | 'bank'
  | 'contact'
  | 'volunteer'
  | 'complaints'
  | 'ideas'
  | 'news'
  | 'library'
  | 'programs'
  | 'projects'
  | 'about'
  | 'governance'
  | 'language';

const INTENT_PATTERNS: [Intent, string[]][] = [
  ['greeting', ['السلام عليكم', 'سلام', 'مرحبا', 'اهلا', 'هلا', 'صباح الخير', 'مساء الخير', 'hello', 'hi ', 'hey', 'good morning', 'good evening', 'merhaba', 'selam', 'günaydın', 'iyi günler', 'iyi akşamlar']],
  ['thanks', ['شكرا', 'يعطيك العافية', 'جزاك الله', 'بارك الله', 'thank', 'thanks', 'teşekkür', 'sağ ol', 'sağol']],
  ['help', ['مساعدة', 'ماذا تستطيع', 'ماذا يمكنك', 'بماذا تساعد', 'كيف استخدم', 'help', 'what can you do', 'how do you work', 'yardım', 'ne yapabilirsin', 'nasıl çalışır']],
  ['bank', ['حساب بنكي', 'حسابات بنكية', 'حسابات', 'ايبان', 'رقم الحساب', 'تحويل بنكي', 'iban', 'bank account', 'bank accounts', 'wire', 'swift', 'banka hesab', 'banka hesap', 'havale', 'hesap numara']],
  ['donate', ['تبرع', 'اتبرع', 'أتبرع', 'ساهم', 'مساهمة', 'اساهم', 'أساهم', 'دعم الوقف', 'صدقة', 'زكاة', 'donate', 'donation', 'contribute', 'contribution', 'give', 'support the waqf', 'bağış', 'bağışla', 'katkıda bulun', 'destek ol']],
  ['volunteer', ['تطوع', 'متطوع', 'اتطوع', 'أتطوع', 'انضم', 'volunteer', 'gönüllü']],
  ['complaints', ['شكوى', 'شكاوى', 'اشتكي', 'اقتراح', 'اقتراحات', 'ملاحظة', 'complaint', 'complain', 'suggestion', 'feedback', 'şikayet', 'öneri']],
  ['ideas', ['فكرة', 'افكار', 'أفكار', 'مبادرة', 'شارك فكرة', 'idea', 'ideas', 'initiative', 'fikir', 'fikrim', 'girişim']],
  ['contact', ['تواصل', 'اتصل', 'اتصال', 'راسل', 'مراسلة', 'بريد', 'ايميل', 'إيميل', 'هاتف', 'رقم الهاتف', 'رقمكم', 'عنوان', 'عنوانكم', 'واتساب', 'اين مقر', 'مقر الوقف', 'contact', 'reach you', 'email', 'e-mail', 'phone', 'address', 'whatsapp', 'location', 'iletişim', 'ulaş', 'telefon', 'adres', 'e-posta', 'nerede']],
  ['news', ['اخبار', 'أخبار', 'خبر', 'اخر الاخبار', 'آخر الأخبار', 'مستجدات', 'جديد الوقف', 'news', 'latest', 'updates', 'haber', 'haberler', 'son gelişmeler']],
  ['library', ['مكتبة', 'المكتبة', 'كتب', 'كتاب', 'تقارير', 'تقرير', 'وثائق', 'ادبيات', 'أدبيات', 'قصص نجاح', 'اعلام', 'أعلام', 'معرض الصور', 'library', 'books', 'book', 'reports', 'report', 'documents', 'gallery', 'success stories', 'figures', 'kütüphane', 'kitap', 'rapor', 'belge', 'galeri', 'başarı hikaye']],
  ['programs', ['برامج', 'البرامج', 'برنامج', 'رواد اليمن', 'بناء القدرات', 'التطوير المؤسسي', 'التوعية المجتمعية', 'program', 'programs', 'programme', 'pioneers', 'capacity', 'awareness', 'programlar', 'kapasite', 'farkındalık']],
  ['projects', ['مشاريع', 'المشاريع', 'مشروع', 'وقفية', 'الشجرة المباركة', 'سهم وقفي', 'محفظة الذهب', 'project', 'projects', 'blessed tree', 'waqf share', 'gold', 'proje', 'projeler', 'altın']],
  ['governance', ['حوكمة', 'الحوكمة', 'سياسات', 'سياسة', 'شفافية', 'تعارض المصالح', 'الابلاغ', 'الإبلاغ', 'governance', 'policy', 'policies', 'transparency', 'whistleblow', 'yönetişim', 'politika', 'şeffaflık']],
  ['about', ['عن الوقف', 'من انتم', 'من أنتم', 'من هو', 'ما هو الوقف', 'تعريف', 'رؤية', 'رسالة', 'قيم', 'اهداف', 'أهداف', 'تأسس', 'اويس القرني', 'أويس القرني', 'about', 'who are you', 'what is the waqf', 'vision', 'mission', 'values', 'goals', 'founded', 'hakkında', 'kimsiniz', 'vizyon', 'misyon', 'değerler', 'vakıf nedir']],
  ['language', ['تغيير اللغة', 'اللغة', 'لغة الموقع', 'بالانجليزي', 'بالتركي', 'language', 'english', 'turkish', 'arabic', 'dil', 'ingilizce', 'türkçe', 'arapça']],
];

function detectIntent(query: string): Intent | null {
  const normalized = ` ${normalize(query)} `;
  // Order matters: "bank" precedes "donate" so "transfer to your account" hits bank.
  for (const [intent, patterns] of INTENT_PATTERNS) {
    if (includesAny(normalized, patterns)) return intent;
  }
  return null;
}

function link(entry: IndexEntry | undefined, kind: EntryKind = 'page'): AssistantLink[] {
  if (!entry) return [];
  return [{ label: entry.title, href: entry.href, hint: hintFor(entry), kind: entry.kind ?? kind }];
}

function firstSentence(value: string, max = 120) {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 60))}…`;
}

function hintFor(entry: IndexEntry) {
  const hint = firstSentence(entry.description);
  // Documents often carry their title as the excerpt; repeating it says nothing.
  return normalize(hint) === normalize(entry.title) ? undefined : hint;
}

function entryLinks(entries: IndexEntry[]): AssistantLink[] {
  return entries.map((entry) => ({ label: entry.title, href: entry.href, hint: hintFor(entry), kind: entry.kind }));
}

export type AssistantContext = {
  locale: Locale;
  site: SiteContent;
  index: IndexEntry[];
};

export function answer(query: string, context: AssistantContext): AssistantReply {
  const { locale, site, index } = context;
  const labels = assistantLabels[locale];
  const byId = (id: string) => index.find((entry) => entry.id === id);
  const ofKind = (kind: EntryKind) => index.filter((entry) => entry.kind === kind);
  const mainSections = () => entryLinks([byId('about-waqf'), byId('projects'), byId('donate'), byId('news'), byId('library'), byId('form-contact')].filter(Boolean) as IndexEntry[]);

  const trimmed = query.trim();
  if (!trimmed) return { text: labels.help, suggestions: labels.suggestions };

  const intent = detectIntent(trimmed);

  switch (intent) {
    case 'greeting':
      return { text: labels.greeting, suggestions: labels.suggestions };
    case 'thanks':
      return { text: labels.thanks };
    case 'help':
      return { text: labels.help, suggestions: labels.suggestions };
    case 'donate':
      return {
        text: labels.donate,
        links: [...link(byId('donate')), ...link(byId('bank-accounts')), ...entryLinks(ofKind('project').slice(0, 3))],
      };
    case 'bank': {
      const bank = getBankAccountsContent(locale);
      const [comma, semicolon] = locale === 'ar' ? ['، ', '؛ '] : [', ', '; '];
      const bankNames = bank.banks.map((item) => `${item.name} (${item.accounts.map((account) => account.currency).join(comma)})`).join(semicolon);
      return {
        text: `${fill(labels.bank, { holder: bank.accountHolder })} ${fill(labels.bankBanks, { banks: bankNames })}`,
        links: [...link(byId('bank-accounts')), ...link(byId('donate'))],
      };
    }
    case 'contact': {
      const info = site.footer.contactInfo;
      const lines = [labels.contact];
      if (info.email) lines.push(fill(labels.contactEmail, { email: info.email }));
      if (info.address) lines.push(fill(labels.contactAddress, { address: info.address }));
      return { text: lines.join('\n'), links: [...link(byId('form-contact')), ...link(byId('form-complaintsSuggestions'))] };
    }
    case 'volunteer':
      return {
        text: labels.volunteer,
        links: [...link(byId('form-volunteer')), ...link(byId('program-capacity-building'))],
      };
    case 'complaints':
      return { text: labels.complaints, links: [...link(byId('form-complaintsSuggestions')), ...link(byId('form-contact'))] };
    case 'ideas':
      return { text: labels.ideas, links: [...link(byId('form-shareIdeas')), ...link(byId('form-contact'))] };
    case 'news': {
      const specific = searchIndex(ofKind('news'), trimmed, 4);
      const latest = specific.length ? specific : ofKind('news').slice(0, 4);
      return { text: labels.news, links: [...entryLinks(latest), ...link(byId('news'))] };
    }
    case 'library': {
      const specific = searchIndex(index.filter((entry) => entry.kind === 'library' || entry.kind === 'document'), trimmed, 4);
      const collections = index.filter((entry) => entry.id.startsWith('library-'));
      return {
        text: specific.length ? labels.resultsIntro : labels.library,
        links: [...entryLinks(specific.length ? specific : collections), ...link(byId('library'))],
      };
    }
    case 'programs': {
      const programs = ofKind('program');
      const specific = bestMatch(programs, trimmed);
      return { text: labels.programs, links: entryLinks(specific ? [specific] : programs) };
    }
    case 'projects': {
      const projects = ofKind('project');
      const specific = bestMatch(projects, trimmed);
      return { text: labels.projects, links: [...entryLinks(specific ? [specific] : projects), ...link(byId('projects'))] };
    }
    case 'governance':
      return { text: labels.governance, links: [...link(byId('about-governance')), ...link(byId('about-waqf'))] };
    case 'about': {
      const vision = site.about.vision ? `\n${site.about.tabs.vision}: ${site.about.vision}` : '';
      return { text: `${labels.about}${vision}`, links: [...link(byId('about-waqf')), ...link(byId('about-governance')), ...entryLinks(ofKind('program').slice(0, 2))] };
    }
    case 'language':
      return { text: labels.language };
    default:
      break;
  }

  const results = searchIndex(index, trimmed, 5);
  if (results.length) {
    return { text: labels.resultsIntro, links: entryLinks(results) };
  }

  // Nothing on the site matches: a long, question-like message is probably
  // off-topic; a short one is probably a term we simply don't have.
  const tokens = tokenize(trimmed);
  const text = tokens.length >= 4 ? labels.offTopic : labels.noResults;
  return { text, links: mainSections(), suggestions: labels.suggestions };
}
