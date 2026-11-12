// The Owais Volunteer Award in the dashboard: two `site_pages` rows that hold
// every text of the award pages, so the award team changes any wording without
// a deployment.
//   - `award-page`: the landing page (/volunteer-award) — all of its copy, its
//     pictures, the name of its tab in the site menu, and a hide switch per
//     section;
//   - `award-form`: the nomination form (/volunteer-award/apply) — the four
//     steps, every field and question, the buttons, the validation messages,
//     the organiser's notice, the "closed" notice and the confirmation page.
// The copy ships in src/data/award/{content,form}.ts; `getAwardContent` and
// `getAwardFormContent` layer the saved rows over it. The pictures are shared
// by every language (see resolveAwardMedia in src/data/award/content.ts).

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Image as ImageIcon,
  ImagePlus,
  Info,
  LayoutGrid,
  ListChecks,
  Lock,
  MapPin,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  Route as RouteIcon,
  ScrollText,
  Search,
  Share2,
  Sparkles,
  Trophy,
  Type,
  UsersRound,
} from 'lucide-react';
import type { Locale } from '@/lib/types';
import type { SelectOption } from './fields';
import type { PageFieldDef, SitePageDef } from './pageSchema';

const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

const text = (path: string, ar: string, tr: string, en: string, extra: Partial<PageFieldDef> = {}): PageFieldDef => ({
  path,
  label: L(ar, tr, en),
  type: 'text',
  ...extra,
});

const textarea = (path: string, ar: string, tr: string, en: string, extra: Partial<PageFieldDef> = {}): PageFieldDef => ({
  path,
  label: L(ar, tr, en),
  type: 'textarea',
  ...extra,
});

/**
 * Help line for a text that carries {placeholders} the site fills in — the
 * editor must keep them as written.
 */
const keep = (tokens: string[], ar: string, tr: string, en: string): Record<Locale, string> => ({
  ar:
    tokens.length > 1
      ? `تبقى ${tokens.join(' و')} في النص كما هي، ويضع الموقع مكانها ${ar}`
      : `يبقى ${tokens[0]} في النص كما هو، ويضع الموقع مكانه ${ar}`,
  tr: `${tokens.join(', ')} olduğu gibi kalır; site yerine ${tr} koyar`,
  en: `Keep ${tokens.join(', ')} as written; the site replaces ${tokens.length > 1 ? 'them' : 'it'} with ${en}`,
});

const hiddenField = (path: string): PageFieldDef => ({
  path,
  label: L('إخفاء هذا القسم من الصفحة', 'Bu bölümü sayfadan gizle', 'Hide this section from the page'),
  type: 'boolean',
  help: L(
    'يختفي القسم بالكامل عن الزوار، ومعه رابطه السريع أعلى الصفحة؛ وتبقى نصوصه محفوظة هنا',
    'Bölüm, sayfanın üstündeki hızlı bağlantısıyla birlikte ziyaretçilerden gizlenir; metinleri burada saklı kalır',
    'The whole section leaves the page for visitors, together with its quick link at the top; its texts stay saved here',
  ),
});

const highlightField = (path: string): PageFieldDef => ({
  path,
  label: L('الكلمة الملوّنة بالأحمر في العنوان', 'Başlıkta kırmızı gösterilen kelime', 'The word shown in red in the title'),
  type: 'text',
  help: L(
    'اكتب جزءاً من العنوان كما هو تماماً؛ اتركه فارغاً لعنوان بلون واحد',
    'Başlığın bir kısmını birebir yazın; tek renkli başlık için boş bırakın',
    'Part of the title, written exactly as it appears there; leave it empty for a single-colour title',
  ),
});

const headingFields = (prefix: string): PageFieldDef[] => [
  text(`${prefix}.title`, 'العنوان', 'Başlık', 'Title'),
  highlightField(`${prefix}.highlight`),
  textarea(`${prefix}.description`, 'الوصف تحت العنوان', 'Başlık altı açıklama', 'Description under the title'),
];

// Icon choices --------------------------------------------------------------
// Each landing list keeps an `id` per item that picks its icon (see
// src/components/award/awardIcons.ts); an unknown id falls back to a neutral icon.

const categoryIconOptions: SelectOption[] = [
  { value: 'education', label: L('قبعة التخرج (التعليم)', 'Mezuniyet kepi (eğitim)', 'Graduation cap (education)') },
  { value: 'health', label: L('نبض القلب (الصحة)', 'Nabız (sağlık)', 'Heartbeat (health)') },
  { value: 'environment', label: L('نبتة (البيئة)', 'Fidan (çevre)', 'Sprout (environment)') },
  { value: 'empowerment', label: L('يد وقلب (التمكين)', 'El ve kalp (güçlendirme)', 'Hand and heart (empowerment)') },
  { value: 'development', label: L('أشكال (مجالات أخرى)', 'Şekiller (diğer alanlar)', 'Shapes (other fields)') },
];

const conditionIconOptions: SelectOption[] = [
  { value: 'yemeni-team', label: L('مجموعة أشخاص (الفريق)', 'Kişi grubu (ekip)', 'Group of people (team)') },
  { value: 'inside-yemen', label: L('تقويم (المدة)', 'Takvim (süre)', 'Calendar (period)') },
  { value: 'voluntary', label: L('مصافحة بقلب (التطوع)', 'Kalpli tokalaşma (gönüllülük)', 'Handshake with heart (voluntary)') },
  { value: 'development-field', label: L('هدف (المجال التنموي)', 'Hedef (kalkınma alanı)', 'Target (development field)') },
  { value: 'independent', label: L('بوصلة (الاستقلالية)', 'Pusula (bağımsızlık)', 'Compass (independence)') },
];

const stepIconOptions: SelectOption[] = [
  { value: 'read', label: L('قائمة تحقق (القراءة)', 'Kontrol listesi (okuma)', 'Checklist (reading)') },
  { value: 'form', label: L('قلم (تعبئة الاستمارة)', 'Kalem (form doldurma)', 'Pen (filling the form)') },
  { value: 'support', label: L('إضافة صورة (المرفقات)', 'Fotoğraf ekleme (ekler)', 'Add photo (attachments)') },
  { value: 'submit', label: L('إرسال', 'Gönder', 'Send') },
];

const pillarIconOptions: SelectOption[] = [
  { value: 'celebrate', label: L('وسام (الاحتفاء)', 'Nişan (kutlama)', 'Award ribbon (celebrating)') },
  { value: 'impact', label: L('بريق (الأثر)', 'Parıltı (etki)', 'Sparkles (impact)') },
  { value: 'sustain', label: L('نبتة (الاستدامة)', 'Fidan (sürdürülebilirlik)', 'Sprout (sustainability)') },
];

const sectionOptions: SelectOption[] = [
  { value: 'about', label: L('عن الجائزة', 'Ödül hakkında', 'About the award') },
  { value: 'categories', label: L('مجالات المشاركة', 'Katılım alanları', 'Participation fields') },
  { value: 'eligibility', label: L('شروط المشاركة', 'Katılım koşulları', 'Participation conditions') },
  { value: 'steps', label: L('كيف تشارك؟', 'Nasıl katılırım?', 'How to participate') },
  { value: 'faq', label: L('الأسئلة الشائعة', 'Sıkça sorulan sorular', 'Frequently asked questions') },
];

const iconField = (options: SelectOption[]): PageFieldDef => ({
  path: 'id',
  label: L('الأيقونة', 'Simge', 'Icon'),
  type: 'select',
  options,
});

/** A list of titled cards (fields, conditions, steps, pillars). */
const cardList = (
  path: string,
  ar: string,
  tr: string,
  en: string,
  options: SelectOption[],
  extra: Partial<PageFieldDef> = {},
): PageFieldDef => ({
  path,
  label: L(ar, tr, en),
  type: 'repeater',
  itemTitleField: 'title',
  itemFields: [
    text('title', 'العنوان', 'Başlık', 'Title'),
    textarea('description', 'الوصف', 'Açıklama', 'Description'),
    iconField(options),
  ],
  ...extra,
});

// The landing page ------------------------------------------------------------

const awardPage: SitePageDef = {
  key: 'award-page',
  group: 'involve',
  label: L('صفحة جائزة أويس', 'Owais Ödülü sayfası', 'Owais Award page'),
  description: L(
    'كل نصوص صفحة الجائزة وصورها واسم تبويبها في قائمة الموقع، مع إمكانية إخفاء أي قسم منها',
    'Ödül sayfasının tüm metinleri, görselleri ve site menüsündeki sekme adı; her bölüm gizlenebilir',
    'Every text and picture of the award page and the name of its tab in the site menu; any section can be hidden',
  ),
  icon: Trophy,
  route: '/volunteer-award',
  sections: [
    {
      key: 'identity',
      label: L('اسم الجائزة وتبويبها وعنوانها في جوجل', 'Ödülün adı, sekmesi ve Google başlığı', 'Award name, menu tab and search title'),
      description: L(
        'اسم الجائزة كما يظهر في رأس صفحتي الاستمارة والاستلام ووصف الصور، واسم تبويب الجائزة في قائمة الموقع، وعنوان الصفحة في نتائج البحث',
        'Form ve alındı sayfalarının başlığında ve görsel açıklamalarında görünen ödül adı, site menüsündeki sekme adı ve arama sonuçlarındaki sayfa başlığı',
        'The award name as it heads the form and confirmation pages and describes the pictures, the name of the award tab in the site menu, and the page title in search results',
      ),
      icon: Search,
      fields: [
        text('name', 'اسم الجائزة الكامل', 'Ödülün tam adı', 'Full name of the award'),
        text('navLabel', 'اسم التبويب في قائمة الموقع', 'Site menüsündeki sekme adı', 'Tab name in the site menu', {
          help: L(
            'التبويب يظهر بين «الأخبار» و«شاركنا» ما دامت الجائزة ظاهرة (إعدادات الجائزة)',
            'Sekme, ödül görünür olduğu sürece “Haberler” ile “Katılım” arasında durur (ödül ayarları)',
            'The tab sits between “News” and “Participate” while the award is shown (award settings)',
          ),
        }),
        text('seo.title', 'عنوان الصفحة في جوجل', 'Google başlığı', 'Search-engine title', {
          help: L('يظهر في تبويب المتصفح ونتائج البحث', 'Tarayıcı sekmesinde ve arama sonuçlarında görünür', 'Shown in the browser tab and in search results'),
        }),
        textarea('seo.description', 'وصف الصفحة في جوجل', 'Google açıklaması', 'Search-engine description'),
      ],
    },
    {
      key: 'hero',
      label: L('الواجهة: النصوص', 'Açılış: metinler', 'Hero: texts'),
      description: L(
        'الجزء الأحمر أعلى الصفحة: السطر الصغير، العنوان الكبير، شارة النسخة والسنة، الوصف، الزران، الوسم، والروابط السريعة الثلاثة أسفله',
        'Sayfanın üstündeki kırmızı bölüm: küçük satır, büyük başlık, dönem ve yıl rozeti, açıklama, iki düğme, etiket ve altındaki üç hızlı bağlantı',
        'The red block at the top of the page: the small line, the big title, the edition and year badge, the description, the two buttons, the hashtag, and the three quick links under it',
      ),
      icon: Type,
      anchor: '#award-hero',
      fields: [
        text('hero.eyebrow', 'السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'),
        {
          path: 'hero.titleLines',
          label: L('سطور العنوان الكبير', 'Büyük başlığın satırları', 'Lines of the big title'),
          type: 'list',
          help: L(
            'كل سطر من العنوان في حقل: «جائزة أويس» ثم «للأعمال التطوعية»',
            'Başlığın her satırı ayrı bir alana: “Owais” sonra “Gönüllülük Ödülü”',
            'One field per line of the title: “Owais”, then “Volunteer Award”',
          ),
        },
        text('hero.edition', 'النسخة (في الشارة)', 'Dönem (rozette)', 'Edition (in the badge)'),
        text('hero.year', 'السنة (في الشارة)', 'Yıl (rozette)', 'Year (in the badge)'),
        textarea('hero.description', 'الوصف', 'Açıklama', 'Description'),
        text('hero.primaryCta', 'الزر الأساسي (يفتح الاستمارة)', 'Ana düğme (formu açar)', 'Primary button (opens the form)'),
        text('hero.secondaryCta', 'الزر الثانوي (ينزل إلى الشروط)', 'İkinci düğme (koşullara iner)', 'Secondary button (scrolls to the conditions)'),
        text('hero.hashtag', 'الوسم (الهاشتاق)', 'Etiket (hashtag)', 'Hashtag'),
        {
          path: 'hero.quickLinks',
          label: L('الروابط السريعة أسفل الواجهة', 'Açılışın altındaki hızlı bağlantılar', 'Quick links under the hero'),
          type: 'repeater',
          itemTitleField: 'title',
          max: 3,
          help: L(
            'ثلاثة روابط كحد أقصى (عرض الشريط)؛ الرابط الذي يشير إلى قسم مخفي لا يظهر',
            'En fazla üç bağlantı (şeridin genişliği); gizli bir bölüme işaret eden bağlantı görünmez',
            'Three links at most (the width of the bar); a link pointing at a hidden section is not shown',
          ),
          itemFields: [
            text('title', 'العنوان', 'Başlık', 'Title'),
            text('description', 'السطر الصغير تحته', 'Altındaki küçük satır', 'Small line under it'),
            {
              path: 'target',
              label: L('القسم الذي ينتقل إليه', 'Gittiği bölüm', 'Section it scrolls to'),
              type: 'select',
              options: sectionOptions,
            },
          ],
        },
        text('labels.sectionNav', 'اسم شريط الروابط السريعة (لقارئات الشاشة)', 'Hızlı bağlantı şeridinin adı (ekran okuyucular için)', 'Name of the quick-link bar (for screen readers)', {
          advanced: true,
        }),
      ],
    },
    {
      key: 'hero-media',
      label: L('الواجهة: الصور', 'Açılış: görseller', 'Hero: pictures'),
      description: L(
        'مجسّم الجائزة والشعاران أعلى صفحة الجائزة؛ المجسّم يظهر أيضاً في رأس صفحة الاستمارة وصفحة استلام الطلب',
        'Ödül sayfasının üstündeki kupa ve iki logo; kupa form ve başvuru alındı sayfalarının başlığında da görünür',
        'The trophy and the two marks at the top of the award page; the trophy also heads the form and confirmation pages',
      ),
      icon: ImageIcon,
      anchor: '#award-hero',
      fields: [
        {
          path: 'media.trophy',
          label: L('صورة مجسّم الجائزة', 'Kupa görseli', 'Trophy picture'),
          type: 'image',
          help: L(
            'يُفضَّل PNG أو WebP بخلفية شفافة وبوضع عمودي. صور الجائزة مشتركة بين اللغات: ما تغيّره هنا يظهر في كل لغة لم تُحفظ لها صورة مختلفة.',
            'Şeffaf zeminli, dikey PNG veya WebP önerilir. Ödül görselleri diller arasında ortaktır: burada değiştirdiğiniz, kendi görseli kaydedilmemiş her dilde görünür.',
            'A portrait PNG or WebP with a transparent background works best. Award pictures are shared across languages: what you change here shows in every language that has no picture of its own saved.',
          ),
        },
        text('hero.imageAlt', 'وصف صورة المجسّم', 'Kupa görseli açıklaması', 'Trophy picture description', {
          help: L('نص بديل لقارئات الشاشة ومحركات البحث', 'Ekran okuyucular ve arama motorları için alternatif metin', 'Alternative text for screen readers and search engines'),
        }),
        {
          path: 'media.logoVolunteerUnit',
          label: L('شعار وحدة التطوع', 'Gönüllülük Birimi logosu', 'Volunteer Unit logo'),
          type: 'image',
          help: L(
            'يُعرض كما هو فوق الخلفية الداكنة، فاستخدم النسخة البيضاء من الشعار بخلفية شفافة',
            'Koyu zemin üzerinde olduğu gibi gösterilir; şeffaf zeminli beyaz logo sürümünü kullanın',
            'Shown as is over the dark background, so use the white version of the logo with a transparent background',
          ),
        },
        text('hero.partners.volunteerUnit', 'اسم شعار وحدة التطوع (نص بديل)', 'Gönüllülük Birimi logosunun adı (alternatif metin)', 'Volunteer Unit logo name (alternative text)'),
        {
          path: 'media.logoMaan',
          label: L('شعار «معاً نبني اليمن»', '“Birlikte Yemen’i İnşa Ediyoruz” logosu', '“Together We Build Yemen” logo'),
          type: 'image',
          help: L('استخدم نسخة فاتحة الحروف تناسب الخلفية الداكنة', 'Koyu zemine uygun açık renkli sürümü kullanın', 'Use the light-lettered version made for dark backgrounds'),
        },
        text('hero.partners.maan', 'اسم شعار «معاً نبني اليمن» (نص بديل)', '“Birlikte Yemen’i İnşa Ediyoruz” logosunun adı (alternatif metin)', '“Together We Build Yemen” logo name (alternative text)'),
      ],
    },
    {
      key: 'about',
      label: L('عن الجائزة: النصوص', 'Ödül hakkında: metinler', 'About the award: texts'),
      description: L(
        'القسم الأبيض بعد الواجهة: السطر الصغير، العنوان، المقدمة، الفقرات، البطاقات الثلاث، والاقتباس المكتوب فوق الصورة',
        'Açılıştan sonraki beyaz bölüm: küçük satır, başlık, giriş, paragraflar, üç kart ve fotoğrafın üstündeki alıntı',
        'The white section after the hero: the small line, the title, the lead, the paragraphs, the three cards, and the quote written over the photo',
      ),
      icon: Info,
      anchor: '#award-about',
      fields: [
        hiddenField('about.hidden'),
        text('about.eyebrow', 'السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'),
        text('about.title', 'العنوان', 'Başlık', 'Title'),
        highlightField('about.highlight'),
        textarea('about.lead', 'المقدمة (بخط عريض)', 'Giriş (kalın)', 'Lead (in bold)'),
        { path: 'about.paragraphs', label: L('الفقرات', 'Paragraflar', 'Paragraphs'), type: 'paragraphs' },
        cardList('about.pillars', 'البطاقات الثلاث', 'Üç kart', 'The three cards', pillarIconOptions),
        textarea('about.quote', 'الاقتباس فوق الصورة', 'Fotoğrafın üstündeki alıntı', 'Quote over the photo'),
      ],
    },
    {
      key: 'about-media',
      label: L('عن الجائزة: الصورة', 'Ödül hakkında: fotoğraf', 'About the award: photo'),
      description: L(
        'الصورة المقوّسة بجانب نص التعريف بالجائزة، مع التعليق المكتوب أسفلها',
        'Ödülü tanıtan metnin yanındaki kemerli fotoğraf ve altındaki açıklama',
        'The arched photo beside the text introducing the award, with the caption under it',
      ),
      icon: ImageIcon,
      anchor: '#award-about',
      fields: [
        {
          path: 'media.about',
          label: L('الصورة', 'Fotoğraf', 'Photo'),
          type: 'image',
          help: L('تُعرض بوضع عمودي (4:5) وتُقصّ أطرافها الزائدة تلقائياً', 'Dikey (4:5) gösterilir; fazlası kendiliğinden kırpılır', 'Shown in portrait (4:5); anything beyond that is cropped automatically'),
        },
        text('about.imageAlt', 'وصف الصورة', 'Fotoğraf açıklaması', 'Photo description'),
        text('about.imageCaption', 'التعليق أسفل الصورة', 'Fotoğraf altı yazısı', 'Caption under the photo'),
      ],
    },
    {
      key: 'categories',
      label: L('مجالات المشاركة', 'Katılım alanları', 'Participation fields'),
      description: L(
        'القسم البيج: العنوان ووصفه وبطاقات المجالات؛ يمكن إضافة مجال أو حذفه أو تغيير ترتيبه',
        'Bej bölüm: başlık, açıklama ve alan kartları; alan eklenebilir, silinebilir veya sıralanabilir',
        'The beige section: the title, its description and the field cards; fields can be added, removed or reordered',
      ),
      icon: LayoutGrid,
      anchor: '#award-categories',
      fields: [
        hiddenField('categories.hidden'),
        ...headingFields('categories'),
        cardList('categories.items', 'المجالات', 'Alanlar', 'Fields', categoryIconOptions),
      ],
    },
    {
      key: 'eligibility',
      label: L('شروط المشاركة', 'Katılım koşulları', 'Participation conditions'),
      description: L(
        'القسم الداكن: العنوان ووصفه والشروط على اللوحة البيضاء وزر بدء الترشيح تحتها. الشروط المعلنة هنا للعرض فقط؛ ما تتحقق منه الاستمارة ثابت في النظام',
        'Koyu bölüm: başlık, açıklama, beyaz paneldeki koşullar ve altındaki aday gösterme düğmesi. Buradaki koşullar yalnızca görüntü içindir; formun denetlediği kurallar sistemde sabittir',
        'The dark section: the title, its description, the conditions on the white panel and the nomination button under them. The conditions listed here are for display; what the form actually checks is fixed in the system',
      ),
      icon: ListChecks,
      anchor: '#award-eligibility',
      fields: [
        hiddenField('eligibility.hidden'),
        ...headingFields('eligibility'),
        cardList('eligibility.items', 'الشروط', 'Koşullar', 'Conditions', conditionIconOptions),
        text('eligibility.cta', 'زر بدء الترشيح', 'Aday gösterme düğmesi', 'Nomination button'),
      ],
    },
    {
      key: 'steps',
      label: L('كيف تشارك؟', 'Nasıl katılırım?', 'How to participate'),
      description: L(
        'القسم الأبيض ذو الخطوات المرقّمة المتصلة: العنوان ووصفه وكلمة «الخطوة» وبطاقات الخطوات',
        'Bağlantılı numaralı adımların olduğu beyaz bölüm: başlık, açıklama, “Adım” kelimesi ve adım kartları',
        'The white section with the connected numbered steps: the title, its description, the word “Step” and the step cards',
      ),
      icon: RouteIcon,
      anchor: '#award-steps',
      fields: [
        hiddenField('steps.hidden'),
        ...headingFields('steps'),
        text('steps.stepLabel', 'كلمة «الخطوة» في شارة كل خطوة', 'Her adımın rozetindeki “Adım” kelimesi', 'The word “Step” in each step badge'),
        cardList('steps.items', 'الخطوات', 'Adımlar', 'Steps', stepIconOptions),
      ],
    },
    {
      key: 'faq',
      label: L('الأسئلة الشائعة', 'Sıkça sorulan sorular', 'Frequently asked questions'),
      description: L(
        'القسم البيج ذو الأسئلة القابلة للطي: العنوان ووصفه والأسئلة وإجاباتها، وعلامة «مسودة» للإجابات الأولية',
        'Açılır-kapanır soruların olduğu bej bölüm: başlık, açıklama, sorular ve yanıtları ile ön yanıtlar için “Taslak” işareti',
        'The beige section with the collapsible questions: the title, its description, the questions and answers, and the “Draft” marker for preliminary answers',
      ),
      icon: MessageSquare,
      anchor: '#award-faq',
      fields: [
        hiddenField('faq.hidden'),
        ...headingFields('faq'),
        {
          path: 'faq.items',
          label: L('الأسئلة', 'Sorular', 'Questions'),
          type: 'repeater',
          itemTitleField: 'question',
          itemFields: [
            text('question', 'السؤال', 'Soru', 'Question'),
            textarea('answer', 'الإجابة', 'Yanıt', 'Answer', { full: true }),
            {
              path: 'draft',
              label: L('إجابة أولية (تظهر عليها علامة «مسودة»)', 'Ön yanıt (“Taslak” işareti görünür)', 'Preliminary answer (shows the “Draft” marker)'),
              type: 'boolean',
            },
          ],
        },
        text('labels.draft', 'كلمة «مسودة» على الإجابات الأولية', 'Ön yanıtlardaki “Taslak” kelimesi', 'The word “Draft” on preliminary answers'),
        textarea('labels.draftNotice', 'التنبيه أسفل الأسئلة عند وجود إجابة أولية', 'Ön yanıt varken soruların altındaki uyarı', 'The notice under the questions while a preliminary answer exists'),
      ],
    },
    {
      key: 'cta',
      label: L('الدعوة الختامية', 'Kapanış çağrısı', 'Closing call'),
      description: L(
        'اللوحة الحمراء في آخر الصفحة: العنوان والنص وزر التقديم',
        'Sayfanın sonundaki kırmızı panel: başlık, metin ve başvuru düğmesi',
        'The red panel at the end of the page: the title, the text and the apply button',
      ),
      icon: Megaphone,
      anchor: '#award-cta',
      fields: [
        hiddenField('cta.hidden'),
        text('cta.title', 'العنوان', 'Başlık', 'Title'),
        textarea('cta.description', 'النص', 'Metin', 'Text'),
        text('cta.button', 'الزر', 'Düğme', 'Button'),
      ],
    },
    {
      key: 'share',
      label: L('صورة المشاركة', 'Paylaşım görseli', 'Share picture'),
      description: L(
        'الصورة التي تظهر عند مشاركة رابط صفحة الجائزة في واتساب ووسائل التواصل',
        'Ödül sayfasının bağlantısı WhatsApp ve sosyal medyada paylaşıldığında görünen görsel',
        'The picture shown when the award page link is shared on WhatsApp and social media',
      ),
      icon: Share2,
      fields: [
        {
          path: 'media.share',
          label: L('صورة المشاركة', 'Paylaşım görseli', 'Share picture'),
          type: 'image',
          help: L('المقاس الأنسب 1200×630 بصيغة JPG', 'En uygun boyut 1200×630, JPG', 'Best at 1200×630, JPG'),
        },
      ],
    },
  ],
};

// The nomination form -----------------------------------------------------------

const stepNames: [key: string, ar: string, tr: string, en: string][] = [
  ['basic', 'الخطوة 1', 'Adım 1', 'Step 1'],
  ['details', 'الخطوة 2', 'Adım 2', 'Step 2'],
  ['impact', 'الخطوة 3', 'Adım 3', 'Step 3'],
  ['review', 'الخطوة 4', 'Adım 4', 'Step 4'],
];

const impactQuestions: [key: string, ar: string, tr: string, en: string][] = [
  ['idea', 'السؤال 1', 'Soru 1', 'Question 1'],
  ['results', 'السؤال 2', 'Soru 2', 'Question 2'],
  ['team', 'السؤال 3', 'Soru 3', 'Question 3'],
  ['sustainability', 'السؤال 4', 'Soru 4', 'Question 4'],
];

const categoryOptions: [key: string, ar: string, tr: string, en: string][] = [
  ['education', 'التعليم', 'Eğitim', 'Education'],
  ['health', 'الصحة', 'Sağlık', 'Health'],
  ['environment', 'البيئة', 'Çevre', 'Environment'],
  ['empowerment', 'التمكين', 'Güçlendirme', 'Empowerment'],
  ['other', 'غير ذلك', 'Diğer', 'Other'],
];

const platformNames: [key: string, label: string][] = [
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['x', 'X'],
  ['tiktok', 'TikTok'],
  ['youtube', 'YouTube'],
  ['linkedin', 'LinkedIn'],
  ['telegram', 'Telegram'],
  ['whatsapp', 'WhatsApp'],
  ['snapchat', 'Snapchat'],
  ['other', 'Other'],
];

/** `label` + `placeholder` of a simple input. */
const inputFields = (prefix: string, ar: string, tr: string, en: string): PageFieldDef[] => [
  text(`${prefix}.label`, `${ar}: اسم الحقل`, `${tr}: alan adı`, `${en}: field label`),
  text(`${prefix}.placeholder`, `${ar}: النص الباهت داخل الحقل`, `${tr}: alan içindeki soluk metin`, `${en}: placeholder`),
];

const awardForm: SitePageDef = {
  key: 'award-form',
  group: 'involve',
  label: L('استمارة الترشيح', 'Aday gösterme formu', 'Nomination form'),
  description: L(
    'كل نصوص استمارة ترشيح الجائزة: الخطوات والحقول وأسئلة الأثر والأزرار ورسائل التحقق والإقرار، ورسالة الإغلاق، وصفحة استلام الطلب',
    'Ödül aday gösterme formunun tüm metinleri: adımlar, alanlar, etki soruları, düğmeler, doğrulama mesajları ve beyan; kapanış mesajı ve başvuru alındı sayfası',
    'Every text of the award nomination form: the steps, the fields, the impact questions, the buttons, the validation messages and the declaration; the “closed” notice; and the confirmation page',
  ),
  icon: ClipboardList,
  route: '/volunteer-award/apply',
  sections: [
    {
      key: 'banner',
      label: L('رأس الصفحة', 'Sayfa başlığı', 'Page header'),
      description: L(
        'الشريط الأحمر أعلى صفحة الاستمارة: العنوان والسطر تحته ومسار التنقل، وسطر آخر موعد للتقديم عندما يكون محدداً',
        'Form sayfasının üstündeki kırmızı şerit: başlık, altındaki satır, gezinme yolu ve belirlenmişse son başvuru tarihi satırı',
        'The red band at the top of the form page: the title, the line under it, the breadcrumb trail, and the deadline line when a deadline is set',
      ),
      icon: Type,
      anchor: '#award-banner',
      fields: [
        text('banner.title', 'العنوان', 'Başlık', 'Title'),
        text('banner.subtitle', 'السطر تحت العنوان', 'Başlık altı satır', 'Line under the title'),
        text('banner.deadline', 'سطر آخر موعد للتقديم', 'Son başvuru tarihi satırı', 'Deadline line', {
          help: keep(['{date}'], 'آخر يوم للتقديم المحدد في إعدادات الجائزة', 'ödül ayarlarındaki son başvuru gününü', 'the last day to apply set in the award settings'),
        }),
        text('banner.crumbHome', 'مسار التنقل: الرئيسية', 'Gezinme yolu: Ana sayfa', 'Breadcrumb: Home'),
        text('banner.crumbAward', 'مسار التنقل: صفحة الجائزة', 'Gezinme yolu: ödül sayfası', 'Breadcrumb: award page'),
        text('banner.crumbForm', 'مسار التنقل: الاستمارة', 'Gezinme yolu: form', 'Breadcrumb: form'),
        text('seo.title', 'عنوان الصفحة في جوجل', 'Google başlığı', 'Search-engine title', { advanced: true }),
        textarea('seo.description', 'وصف الصفحة في جوجل', 'Google açıklaması', 'Search-engine description', { advanced: true }),
      ],
    },
    {
      key: 'steps',
      label: L('الخطوات الأربع: الأسماء والعناوين', 'Dört adım: adlar ve başlıklar', 'The four steps: names and headings'),
      description: L(
        'اسم كل خطوة في شريط التقدم أعلى الاستمارة، وعنوانها والسطر تحته عند فتحها',
        'Formun üstündeki ilerleme çubuğunda her adımın adı ile açıldığında görünen başlığı ve altındaki satır',
        'Each step’s name in the progress bar above the form, and its heading and the line under it once opened',
      ),
      icon: RouteIcon,
      anchor: '#award-apply-form',
      fields: stepNames.flatMap(([key, ar, tr, en]) => [
        text(`steps.${key}.label`, `${ar}: الاسم في شريط التقدم`, `${tr}: ilerleme çubuğundaki ad`, `${en}: name in the progress bar`),
        text(`steps.${key}.heading`, `${ar}: العنوان`, `${tr}: başlık`, `${en}: heading`),
        textarea(`steps.${key}.description`, `${ar}: السطر تحت العنوان`, `${tr}: başlık altı satır`, `${en}: line under the heading`),
      ]),
    },
    {
      key: 'basic',
      label: L('الخطوة 1: البيانات الأساسية', 'Adım 1: temel bilgiler', 'Step 1: basic information'),
      description: L(
        'حقول الخطوة الأولى: اسم المبادرة وممثلها ورقم الواتساب والبريد وسؤال الجنسية وعدد الفريق',
        'İlk adımın alanları: girişimin adı, temsilcisi, WhatsApp numarası, e-posta, vatandaşlık sorusu ve ekip sayısı',
        'The first step’s fields: the initiative name, its representative, the WhatsApp number, the email, the nationality question and the team size',
      ),
      icon: UsersRound,
      anchor: '#award-apply-form',
      fields: [
        ...inputFields('fields.initiativeName', 'اسم المبادرة', 'Girişimin adı', 'Initiative name'),
        ...inputFields('fields.representative', 'ممثل المبادرة', 'Girişim temsilcisi', 'Representative'),
        text('fields.phone.label', 'رقم التواصل: اسم الحقل', 'İletişim numarası: alan adı', 'Contact number: field label'),
        text('fields.phone.hint', 'رقم التواصل: الإرشاد تحته', 'İletişim numarası: altındaki ipucu', 'Contact number: hint under it'),
        text('fields.phone.countryLabel', 'رقم التواصل: اسم قائمة رمز الدولة', 'İletişim numarası: ülke kodu listesinin adı', 'Contact number: country-code list label'),
        text('fields.phone.numberLabel', 'رقم التواصل: اسم حقل الرقم', 'İletişim numarası: numara alanının adı', 'Contact number: number field label'),
        text('fields.phone.numberPlaceholder', 'رقم التواصل: مثال الرقم الباهت', 'İletişim numarası: soluk örnek numara', 'Contact number: placeholder'),
        text('fields.phone.otherCode', 'رقم التواصل: خيار «رمز دولة آخر»', 'İletişim numarası: “başka ülke kodu” seçeneği', 'Contact number: “another country code” option'),
        text('fields.phone.customCodeLabel', 'رقم التواصل: اسم حقل الرمز اليدوي', 'İletişim numarası: elle girilen kod alanının adı', 'Contact number: manual code field label'),
        text('fields.phone.customCodePlaceholder', 'رقم التواصل: مثال الرمز الباهت', 'İletişim numarası: soluk örnek kod', 'Contact number: manual code placeholder'),
        ...inputFields('fields.email', 'البريد الإلكتروني', 'E-posta', 'Email'),
        text('fields.nationality.label', 'سؤال الجنسية', 'Vatandaşlık sorusu', 'Nationality question'),
        text('fields.nationality.yes', 'سؤال الجنسية: خيار «نعم»', 'Vatandaşlık sorusu: “Evet”', 'Nationality question: “Yes”'),
        text('fields.nationality.no', 'سؤال الجنسية: خيار «لا»', 'Vatandaşlık sorusu: “Hayır”', 'Nationality question: “No”'),
        textarea('fields.nationality.note', 'سؤال الجنسية: التوضيح تحته', 'Vatandaşlık sorusu: altındaki açıklama', 'Nationality question: note under it'),
        ...inputFields('fields.teamSize', 'عدد أعضاء الفريق', 'Ekip üyesi sayısı', 'Team size'),
        text('fields.teamSize.hint', 'عدد أعضاء الفريق: الإرشاد تحته', 'Ekip üyesi sayısı: altındaki ipucu', 'Team size: hint under it'),
      ],
    },
    {
      key: 'details',
      label: L('الخطوة 2: تفاصيل المبادرة', 'Adım 2: girişim ayrıntıları', 'Step 2: initiative details'),
      description: L(
        'حقول الخطوة الثانية: مكان التنفيذ وفترته ومجال المبادرة وحساباتها في مواقع التواصل. أسماء المجالات هنا تظهر أيضاً في جدول الطلبات وملف Excel',
        'İkinci adımın alanları: uygulama yeri, dönemi, girişimin alanı ve sosyal medya hesapları. Buradaki alan adları başvuru tablosunda ve Excel dosyasında da görünür',
        'The second step’s fields: the place and period of implementation, the initiative’s field and its social media accounts. The field names here also appear in the applications table and the Excel file',
      ),
      icon: MapPin,
      anchor: '#award-apply-form',
      fields: [
        text('fields.location.label', 'عنوان مجموعة «مكان التنفيذ»', '“Uygulama yeri” grubunun başlığı', '“Place of implementation” group title'),
        ...inputFields('fields.governorate', 'المحافظة', 'İl', 'Governorate'),
        ...inputFields('fields.district', 'المديرية', 'İlçe', 'District'),
        text('fields.period.label', 'فترة التنفيذ: اسم الحقل', 'Uygulama dönemi: alan adı', 'Implementation period: field label'),
        text('fields.period.hint', 'فترة التنفيذ: الإرشاد تحته', 'Uygulama dönemi: altındaki ipucu', 'Implementation period: hint under it'),
        text('fields.period.start', 'فترة التنفيذ: «البداية»', 'Uygulama dönemi: “Başlangıç”', 'Implementation period: “Start”'),
        text('fields.period.end', 'فترة التنفيذ: «النهاية»', 'Uygulama dönemi: “Bitiş”', 'Implementation period: “End”'),
        text('fields.period.month', 'فترة التنفيذ: «الشهر»', 'Uygulama dönemi: “Ay”', 'Implementation period: “Month”'),
        text('fields.period.year', 'فترة التنفيذ: «السنة»', 'Uygulama dönemi: “Yıl”', 'Implementation period: “Year”'),
        text('fields.period.ongoing', 'فترة التنفيذ: خيار «المبادرة مستمرة»', 'Uygulama dönemi: “girişim sürüyor” seçeneği', 'Implementation period: “still ongoing” option'),
        text('fields.category.label', 'مجال المبادرة: اسم الحقل', 'Girişimin alanı: alan adı', 'Field of the initiative: field label'),
        ...categoryOptions.map(([key, ar, tr, en]) =>
          text(`fields.category.options.${key}`, `مجال المبادرة: خيار «${ar}»`, `Girişimin alanı: “${tr}” seçeneği`, `Field of the initiative: “${en}” option`),
        ),
        text('fields.category.otherLabel', 'مجال المبادرة: اسم حقل «غير ذلك»', 'Girişimin alanı: “Diğer” alanının adı', 'Field of the initiative: “Other” field label'),
        text('fields.category.otherPlaceholder', 'مجال المبادرة: النص الباهت لحقل «غير ذلك»', 'Girişimin alanı: “Diğer” alanının soluk metni', 'Field of the initiative: “Other” placeholder'),
        text('fields.social.label', 'مواقع التواصل: عنوان المجموعة', 'Sosyal medya: grup başlığı', 'Social media: group title'),
        text('fields.social.hint', 'مواقع التواصل: الإرشاد تحته', 'Sosyal medya: altındaki ipucu', 'Social media: hint under it'),
        text('fields.social.platform', 'مواقع التواصل: اسم قائمة المنصة', 'Sosyal medya: platform listesinin adı', 'Social media: platform list label'),
        text('fields.social.otherName', 'مواقع التواصل: اسم حقل «اسم المنصة»', 'Sosyal medya: “platform adı” alanının adı', 'Social media: “platform name” field label'),
        text('fields.social.otherNamePlaceholder', 'مواقع التواصل: النص الباهت لاسم المنصة', 'Sosyal medya: platform adının soluk metni', 'Social media: platform name placeholder'),
        text('fields.social.url', 'مواقع التواصل: اسم حقل الرابط', 'Sosyal medya: bağlantı alanının adı', 'Social media: link field label'),
        text('fields.social.urlPlaceholder', 'مواقع التواصل: النص الباهت للرابط', 'Sosyal medya: bağlantının soluk metni', 'Social media: link placeholder'),
        text('fields.social.add', 'مواقع التواصل: زر إضافة منصة', 'Sosyal medya: platform ekleme düğmesi', 'Social media: add-platform button'),
        text('fields.social.remove', 'مواقع التواصل: زر حذف المنصة', 'Sosyal medya: platform silme düğmesi', 'Social media: remove-platform button'),
        text('fields.social.counter', 'مواقع التواصل: عدّاد المنصات', 'Sosyal medya: platform sayacı', 'Social media: platform counter', {
          help: keep(['{count}', '{min}'], 'عدد المنصات المضافة والحد الأدنى المطلوب', 'eklenen platform sayısını ve gereken en az sayıyı', 'the number of platforms added and the minimum required'),
        }),
        ...platformNames.map(([key, name]) =>
          text(`fields.social.platforms.${key}`, `اسم منصة ${name}`, `${name} platformunun adı`, `${name} platform name`, { advanced: true }),
        ),
      ],
    },
    {
      key: 'impact',
      label: L('الخطوة 3: أسئلة الأثر', 'Adım 3: etki soruları', 'Step 3: impact questions'),
      description: L(
        'الأسئلة الأربعة وعناوينها وتوضيحاتها. تغيير نص السؤال لا يغيّر الحد الأقصى لعدد كلماته (50، 50، 75، 50 كلمة) الثابت في النظام',
        'Dört soru, başlıkları ve açıklamaları. Soru metnini değiştirmek sistemde sabit olan kelime sınırını (50, 50, 75, 50) değiştirmez',
        'The four questions, their titles and notes. Changing a question’s wording does not change its word limit (50, 50, 75, 50 words), which is fixed in the system',
      ),
      icon: Sparkles,
      anchor: '#award-apply-form',
      fields: [
        ...impactQuestions.flatMap(([key, ar, tr, en]) => [
          text(`fields.impact.${key}.title`, `${ar}: العنوان`, `${tr}: başlık`, `${en}: title`),
          textarea(`fields.impact.${key}.question`, `${ar}: نص السؤال`, `${tr}: soru metni`, `${en}: question`),
          text(`fields.impact.${key}.note`, `${ar}: توضيح تحت السؤال (اختياري)`, `${tr}: soru altı açıklama (isteğe bağlı)`, `${en}: note under the question (optional)`),
        ]),
        text('fields.answerPlaceholder', 'النص الباهت في حقول الإجابة', 'Yanıt alanlarındaki soluk metin', 'Placeholder in the answer fields'),
        text('fields.wordCounter', 'عدّاد الكلمات', 'Kelime sayacı', 'Word counter', {
          help: keep(['{count}', '{limit}'], 'عدد الكلمات المكتوبة والحد الأقصى', 'yazılan kelime sayısını ve sınırı', 'the words written and the limit'),
        }),
      ],
    },
    {
      key: 'attachments',
      label: L('الخطوة 4: الصور الداعمة', 'Adım 4: destekleyici fotoğraflar', 'Step 4: supporting photos'),
      description: L(
        'مربع رفع صور المبادرة في الخطوة الأخيرة ورسائله. الحدود نفسها (صورة واحدة على الأقل، خمس كحد أقصى، 3 ميغابايت للصورة) ثابتة في النظام',
        'Son adımdaki fotoğraf yükleme kutusu ve mesajları. Sınırlar (en az bir, en fazla beş fotoğraf, fotoğraf başına 3 MB) sistemde sabittir',
        'The photo upload box in the last step and its messages. The limits themselves (at least one photo, five at most, 3 MB each) are fixed in the system',
      ),
      icon: ImagePlus,
      anchor: '#award-apply-form',
      fields: [
        text('attachments.heading', 'العنوان', 'Başlık', 'Heading'),
        textarea('attachments.note', 'التوضيح تحت العنوان', 'Başlık altı açıklama', 'Note under the heading'),
        text('attachments.dropTitle', 'نص مربع السحب والإفلات', 'Sürükle-bırak kutusunun metni', 'Drag-and-drop box text'),
        text('attachments.dropOr', 'كلمة «أو»', '“veya” kelimesi', 'The word “or”'),
        text('attachments.choose', 'زر اختيار الصور', 'Fotoğraf seçme düğmesi', 'Choose-photos button'),
        text('attachments.constraints', 'سطر الصيغ والحدود', 'Biçim ve sınır satırı', 'Formats and limits line', {
          help: keep(['{max}', '{size}'], 'الحد الأقصى لعدد الصور وحجم الصورة بالميغابايت', 'en fazla fotoğraf sayısını ve MB cinsinden boyutu', 'the maximum number of photos and the size in MB'),
        }),
        text('attachments.count', 'عدّاد الصور', 'Fotoğraf sayacı', 'Photo counter', {
          help: keep(['{count}', '{max}'], 'عدد الصور المضافة والحد الأقصى', 'eklenen fotoğraf sayısını ve en fazla sayıyı', 'the photos added and the maximum'),
        }),
        text('attachments.remove', 'زر حذف الصورة', 'Fotoğrafı kaldırma düğmesi', 'Remove-photo button'),
        text('attachments.replace', 'زر استبدال الصورة', 'Fotoğrafı değiştirme düğmesi', 'Replace-photo button'),
        text('attachments.previewAlt', 'وصف معاينة الصورة (لقارئات الشاشة)', 'Fotoğraf önizleme açıklaması (ekran okuyucular için)', 'Photo preview description (for screen readers)', {
          help: keep(['{name}'], 'اسم الملف', 'dosya adını', 'the file name'),
        }),
        textarea('attachments.errors.type', 'خطأ: صيغة غير مدعومة', 'Hata: desteklenmeyen biçim', 'Error: unsupported format', {
          help: keep(['{name}'], 'اسم الملف', 'dosya adını', 'the file name'),
        }),
        textarea('attachments.errors.size', 'خطأ: الصورة أكبر من الحد', 'Hata: fotoğraf çok büyük', 'Error: photo too large', {
          help: keep(['{name}', '{size}', '{max}'], 'اسم الملف وحجمه والحد الأقصى بالميغابايت', 'dosya adını, boyutunu ve MB cinsinden sınırı', 'the file name, its size and the limit in MB'),
        }),
        textarea('attachments.errors.count', 'خطأ: تجاوز عدد الصور', 'Hata: çok fazla fotoğraf', 'Error: too many photos', {
          help: keep(['{name}', '{max}'], 'اسم الملف والحد الأقصى لعدد الصور', 'dosya adını ve en fazla fotoğraf sayısını', 'the file name and the maximum number of photos'),
        }),
      ],
    },
    {
      key: 'review',
      label: L('الخطوة 4: مراجعة الطلب', 'Adım 4: başvurunun kontrolü', 'Step 4: application review'),
      description: L(
        'ملخص الطلب الذي يراجعه المتقدم قبل الإرسال: عنوانه وأسماء أقسامه الأربعة وكلماته القصيرة',
        'Başvuranın göndermeden önce gözden geçirdiği özet: başlığı, dört bölümünün adları ve kısa ifadeleri',
        'The summary the applicant reviews before sending: its heading, the names of its four sections and its short words',
      ),
      icon: ClipboardCheck,
      anchor: '#award-apply-form',
      fields: [
        text('review.heading', 'العنوان', 'Başlık', 'Heading'),
        textarea('review.description', 'السطر تحت العنوان', 'Başlık altı satır', 'Line under the heading'),
        text('review.sections.basic', 'اسم قسم «البيانات الأساسية»', '“Temel bilgiler” bölümünün adı', '“Basic information” section name'),
        text('review.sections.details', 'اسم قسم «تفاصيل المبادرة»', '“Girişim ayrıntıları” bölümünün adı', '“Initiative details” section name'),
        text('review.sections.impact', 'اسم قسم «الأثر»', '“Etki” bölümünün adı', '“Impact” section name'),
        text('review.sections.attachments', 'اسم قسم «الصور»', '“Fotoğraflar” bölümünün adı', '“Photos” section name'),
        text('review.empty', 'كلمة «لم يُدخَل» للحقل الفارغ', 'Boş alan için “girilmedi” kelimesi', 'The word for an empty field'),
        text('review.noImages', 'نص «لا توجد صور»', '“Fotoğraf yok” metni', '“No photos” text'),
        text('review.ongoing', 'كلمة «مستمر حتى الآن» (تظهر أيضاً في جدول الطلبات)', '“Devam ediyor” kelimesi (başvuru tablosunda da görünür)', 'The word “ongoing” (also shown in the applications table)'),
        text('review.words', 'عدّاد كلمات الإجابة', 'Yanıt kelime sayacı', 'Answer word counter', {
          help: keep(['{count}'], 'عدد الكلمات', 'kelime sayısını', 'the number of words'),
        }),
      ],
    },
    {
      key: 'declaration',
      label: L('الإقرار وإشعار الجهة المنظِّمة', 'Beyan ve düzenleyicinin bildirimi', 'Declaration and organiser’s notice'),
      description: L(
        'آخر جزء من الاستمارة: إشعار الجهة المنظِّمة الذي يقرؤه المتقدم، وعبارة الإقرار التي يؤكدها قبل الإرسال',
        'Formun son bölümü: başvuranın okuduğu düzenleyici bildirimi ve göndermeden önce onayladığı beyan',
        'The last part of the form: the organiser’s notice the applicant reads, and the declaration they confirm before sending',
      ),
      icon: ScrollText,
      anchor: '#award-declaration',
      fields: [
        text('declaration.heading', 'عنوان الإقرار', 'Beyan başlığı', 'Declaration heading'),
        textarea('declaration.checkbox', 'عبارة الإقرار بجانب مربع التأكيد', 'Onay kutusunun yanındaki beyan ifadesi', 'Declaration wording beside the checkbox'),
        text('declaration.noticeTitle', 'عنوان الإشعار', 'Bildirim başlığı', 'Notice title'),
        textarea('declaration.noticeText', 'نص الإشعار', 'Bildirim metni', 'Notice text', { full: true }),
        {
          path: 'declaration.noticeApproved',
          label: L('النص معتمد رسمياً (إخفاء علامة «مسودة»)', 'Metin resmen onaylandı (“taslak” işaretini gizle)', 'The wording is official (hide the “draft” marker)'),
          type: 'boolean',
          help: L(
            'فعّله بعد وضع النص الوارد في وثيقة الجائزة الرسمية؛ وما دام غير مفعّل تظهر في الاستمارة علامة «مسودة» والسطر التوضيحي تحتها.',
            'Resmî ödül belgesindeki metni girdikten sonra açın; kapalıyken formda “taslak” işareti ve altındaki açıklama satırı görünür.',
            'Switch it on once the wording of the official award document is in place; while it is off the form shows the “draft” marker and the explanatory line under it.',
          ),
        },
        text('declaration.noticeDraft', 'علامة «مسودة» على الإشعار', 'Bildirimdeki “taslak” işareti', '“Draft” marker on the notice'),
        text('declaration.noticePending', 'السطر التوضيحي تحت الإشعار ما دام مسودة', 'Taslakken bildirimin altındaki açıklama satırı', 'Explanatory line under the notice while it is a draft'),
      ],
    },
    {
      key: 'buttons',
      label: L('الأزرار والرسائل العامة', 'Düğmeler ve genel mesajlar', 'Buttons and general messages'),
      description: L(
        'أزرار التنقل بين الخطوات وزر الإرسال، وعلامة الحقل الإلزامي، ورسائل الإرسال وفشله، وشريط التقدم',
        'Adımlar arası gezinme düğmeleri ve gönder düğmesi, zorunlu alan işareti, gönderim ve hata mesajları ve ilerleme çubuğu',
        'The buttons between the steps and the send button, the required-field marker, the sending and failure messages, and the progress bar',
      ),
      icon: MousePointerClick,
      anchor: '#award-apply-form',
      fields: [
        text('common.next', 'زر «التالي»', '“İleri” düğmesi', '“Next” button'),
        text('common.previous', 'زر «السابق»', '“Geri” düğmesi', '“Previous” button'),
        text('common.backToAward', 'رابط العودة إلى صفحة الجائزة', 'Ödül sayfasına dönüş bağlantısı', 'Back-to-award link'),
        text('common.submit', 'زر الإرسال', 'Gönder düğmesi', 'Send button'),
        text('common.submitting', 'نص الزر أثناء الإرسال', 'Gönderim sırasındaki düğme metni', 'Button text while sending'),
        text('common.uploading', 'نص الزر أثناء رفع الصور', 'Fotoğraflar yüklenirken düğme metni', 'Button text while uploading photos', {
          help: keep(['{current}', '{total}'], 'رقم الصورة الجاري رفعها وعدد الصور', 'yüklenen fotoğrafın sırasını ve toplam sayıyı', 'the photo being uploaded and the total'),
        }),
        text('common.edit', 'زر «تعديل» في الملخص', 'Özetteki “Düzenle” düğmesi', '“Edit” button in the summary'),
        text('common.requiredMark', 'علامة الحقل الإلزامي (لقارئات الشاشة)', 'Zorunlu alan işareti (ekran okuyucular için)', 'Required-field marker (for screen readers)'),
        text('common.optional', 'كلمة «اختياري»', '“İsteğe bağlı” kelimesi', 'The word “Optional”'),
        text('common.selectPlaceholder', 'النص الباهت في القوائم المنسدلة', 'Açılır listelerdeki soluk metin', 'Placeholder in dropdowns'),
        textarea('common.errorSummary', 'رسالة وجود أخطاء في الخطوة', 'Adımda hata var mesajı', 'Errors-in-this-step message', {
          help: keep(['{count}'], 'عدد الحقول التي تحتاج تصحيحاً', 'düzeltilecek alan sayısını', 'the number of fields to correct'),
        }),
        textarea('common.leaveConfirm', 'سؤال التأكيد عند مغادرة الصفحة', 'Sayfadan ayrılırken onay sorusu', 'Confirmation when leaving the page'),
        textarea('common.submitFailed', 'رسالة فشل الإرسال (انقطاع الاتصال)', 'Gönderim başarısız mesajı (bağlantı)', 'Send-failed message (connection)'),
        textarea('common.submitClosed', 'رسالة إغلاق باب الترشيح أثناء التعبئة', 'Form doldurulurken başvuruların kapanması mesajı', 'Applications-closed-meanwhile message'),
        textarea('common.submitRateLimited', 'رسالة كثرة الطلبات من الجهاز نفسه', 'Aynı cihazdan çok fazla başvuru mesajı', 'Too-many-applications message'),
        textarea('common.submitRejected', 'رسالة رفض الخادم للبيانات', 'Sunucunun verileri reddetme mesajı', 'Server-rejected-the-data message'),
        text('progress.stepOf', 'شريط التقدم: «الخطوة س من ص»', 'İlerleme çubuğu: “Adım x / y”', 'Progress bar: “Step x of y”', {
          help: keep(['{current}', '{total}'], 'رقم الخطوة الحالية وعدد الخطوات', 'geçerli adımı ve adım sayısını', 'the current step and the number of steps'),
        }),
        text('progress.navLabel', 'شريط التقدم: اسمه لقارئات الشاشة', 'İlerleme çubuğu: ekran okuyucular için adı', 'Progress bar: name for screen readers', { advanced: true }),
        text('progress.done', 'شريط التقدم: كلمة «مكتملة»', 'İlerleme çubuğu: “tamamlandı” kelimesi', 'Progress bar: the word “completed”', { advanced: true }),
      ],
    },
    {
      key: 'messages',
      label: L('رسائل التحقق من الحقول', 'Alan doğrulama mesajları', 'Field validation messages'),
      description: L(
        'الرسائل الحمراء التي تظهر تحت الحقل عندما يكون فارغاً أو غير صحيح. الشروط نفسها ثابتة في النظام؛ هنا تتغير صياغتها فقط',
        'Alan boş ya da hatalıyken altında görünen kırmızı mesajlar. Kuralların kendisi sistemde sabittir; burada yalnızca ifadeleri değişir',
        'The red messages shown under a field when it is empty or invalid. The rules themselves are fixed in the system; only their wording changes here',
      ),
      icon: AlertTriangle,
      anchor: '#award-apply-form',
      fields: [
        text('messages.required', 'حقل مطلوب', 'Zorunlu alan', 'Required field'),
        text('messages.tooShort', 'نص قصير جداً', 'Çok kısa metin', 'Text too short'),
        text('messages.tooLong', 'نص طويل جداً', 'Çok uzun metin', 'Text too long', {
          help: keep(['{max}'], 'الحد الأقصى لعدد الحروف', 'en fazla karakter sayısını', 'the maximum number of characters'),
        }),
        text('messages.email', 'بريد إلكتروني غير صحيح', 'Geçersiz e-posta', 'Invalid email'),
        text('messages.phone', 'رقم هاتف غير صحيح', 'Geçersiz telefon numarası', 'Invalid phone number'),
        text('messages.phoneYemen', 'رقم يمني غير صحيح', 'Geçersiz Yemen numarası', 'Invalid Yemeni number'),
        text('messages.customCode', 'رمز دولة غير صحيح', 'Geçersiz ülke kodu', 'Invalid country code'),
        textarea('messages.nationality', 'الفريق ليس يمنياً بالكامل', 'Ekip tamamen Yemenli değil', 'Team not entirely Yemeni'),
        text('messages.teamSize', 'عدد الفريق غير صحيح', 'Geçersiz ekip sayısı', 'Invalid team size'),
        text('messages.periodStart', 'بداية التنفيذ غير محددة', 'Başlangıç seçilmedi', 'Start not chosen'),
        text('messages.periodEnd', 'نهاية التنفيذ غير محددة', 'Bitiş seçilmedi', 'End not chosen'),
        text('messages.periodOrder', 'النهاية قبل البداية', 'Bitiş başlangıçtan önce', 'End before start'),
        text('messages.periodFuture', 'تاريخ في المستقبل', 'Gelecekte tarih', 'Date in the future'),
        textarea('messages.periodWindow', 'خارج آخر 12 شهراً', 'Son 12 ayın dışında', 'Outside the last 12 months'),
        text('messages.categoryOther', 'مجال «غير ذلك» غير محدد', '“Diğer” alanı belirtilmedi', '“Other” field not specified'),
        text('messages.socialMin', 'أقل من منصتين', 'İki platformdan az', 'Fewer than two platforms'),
        text('messages.socialPlatform', 'المنصة غير مختارة', 'Platform seçilmedi', 'Platform not chosen'),
        text('messages.socialOtherName', 'اسم المنصة غير مكتوب', 'Platform adı yazılmadı', 'Platform name missing'),
        text('messages.socialUrl', 'رابط غير صحيح', 'Geçersiz bağlantı', 'Invalid link'),
        text('messages.socialDomain', 'الرابط لا يتبع المنصة', 'Bağlantı platforma ait değil', 'Link not on the platform', {
          help: keep(['{platform}'], 'اسم المنصة المختارة', 'seçilen platformun adını', 'the chosen platform’s name'),
        }),
        text('messages.socialDuplicate', 'منصة مكررة', 'Yinelenen platform', 'Duplicate platform'),
        text('messages.wordsOver', 'تجاوز حد الكلمات', 'Kelime sınırı aşıldı', 'Over the word limit', {
          help: keep(['{limit}', '{over}'], 'الحد الأقصى وعدد الكلمات الزائدة', 'sınırı ve fazla kelime sayısını', 'the limit and the number of words over it'),
        }),
        text('messages.imagesRequired', 'لا توجد صورة مرفقة', 'Fotoğraf eklenmedi', 'No photo attached'),
        text('messages.declaration', 'الإقرار غير مؤكد', 'Beyan onaylanmadı', 'Declaration not confirmed'),
      ],
    },
    {
      key: 'closed',
      label: L('رسالة إغلاق باب الترشيح', 'Başvurular kapalı mesajı', '“Applications closed” notice'),
      description: L(
        'ما يراه الزائر مكان الاستمارة عندما تكون مغلقة من إعدادات الجائزة أو بعد انتهاء الموعد',
        'Form, ödül ayarlarından kapatıldığında veya son tarih geçtiğinde ziyaretçinin form yerine gördüğü',
        'What a visitor sees instead of the form when it is closed from the award settings or after the deadline',
      ),
      icon: Lock,
      anchor: '#award-closed',
      fields: [
        text('closed.title', 'العنوان', 'Başlık', 'Title'),
        textarea('closed.paused', 'النص عندما تكون الاستمارة متوقفة', 'Form kapatıldığında metin', 'Text while the form is switched off'),
        textarea('closed.deadline', 'النص بعد انتهاء الموعد', 'Son tarih geçince metin', 'Text after the deadline', {
          help: keep(['{date}'], 'آخر يوم للتقديم', 'son başvuru gününü', 'the last day to apply'),
        }),
        text('closed.back', 'زر العودة إلى صفحة الجائزة', 'Ödül sayfasına dönüş düğmesi', 'Back-to-award button'),
      ],
    },
    {
      key: 'success',
      label: L('صفحة استلام الطلب', 'Başvuru alındı sayfası', 'Confirmation page'),
      description: L(
        'الصفحة التي تظهر بعد إرسال الطلب بنجاح: عنوانها ورقم الطلب والإرشاد تحته وزراها. في المعاينة يظهر رقم طلب تجريبي',
        'Başvuru başarıyla gönderildikten sonra görünen sayfa: başlığı, başvuru numarası, altındaki ipucu ve iki düğmesi. Önizlemede örnek bir numara görünür',
        'The page shown after an application is sent: its heading, the application number, the hint under it and its two buttons. The preview shows a sample number',
      ),
      icon: CheckCircle2,
      route: '/volunteer-award/success',
      anchor: '#award-success',
      fields: [
        text('success.heading', 'العنوان', 'Başlık', 'Heading'),
        text('success.badge', 'الشارة في مسار التنقل', 'Gezinme yolundaki rozet', 'Badge in the breadcrumb trail'),
        textarea('success.withName', 'النص عند معرفة اسم المبادرة', 'Girişim adı bilinirken metin', 'Text when the initiative name is known', {
          help: keep(['{name}'], 'اسم المبادرة', 'girişimin adını', 'the initiative name'),
        }),
        textarea('success.withoutName', 'النص دون اسم المبادرة', 'Girişim adı olmadan metin', 'Text without the initiative name'),
        text('success.referenceLabel', 'عنوان رقم الطلب', 'Başvuru numarası etiketi', 'Application number label'),
        textarea('success.referenceHint', 'الإرشاد تحت رقم الطلب', 'Numaranın altındaki ipucu', 'Hint under the number'),
        text('success.copy', 'زر نسخ الرقم', 'Numarayı kopyalama düğmesi', 'Copy-number button'),
        text('success.copied', 'نص الزر بعد النسخ', 'Kopyalandıktan sonra düğme metni', 'Button text after copying'),
        text('success.back', 'زر العودة إلى صفحة الجائزة', 'Ödül sayfasına dönüş düğmesi', 'Back-to-award button'),
        text('success.again', 'زر تقديم مبادرة أخرى', 'Başka bir girişim için başvuru düğmesi', 'Nominate-another button'),
        text('success.seoTitle', 'عنوان الصفحة في جوجل', 'Google başlığı', 'Search-engine title', { advanced: true }),
      ],
    },
  ],
};

/** The award's dashboard pages, in the order they are listed. */
export const awardPageDefs: SitePageDef[] = [awardPage, awardForm];
