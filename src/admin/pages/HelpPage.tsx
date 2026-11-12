import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Globe2,
  Image as ImageIcon,
  Inbox,
  Keyboard,
  LayoutTemplate,
  Link2,
  ListChecks,
  Search,
  Trophy,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/lib/types';

type Section = {
  icon: LucideIcon;
  title: Record<Locale, string>;
  body: Record<Locale, string[]>;
  link?: { to: string; label: Record<Locale, string> };
};

const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });
const P = (ar: string[], tr: string[], en: string[]): Record<Locale, string[]> => ({ ar, tr, en });

const SECTIONS: Section[] = [
  {
    icon: Compass,
    title: L('كيف تنتظم لوحة التحكم؟', 'Panel nasıl düzenlenir?', 'How is the dashboard organised?'),
    body: P(
      [
        'القائمة الجانبية فيها بند لكل صفحة من صفحات الموقع، بنفس ترتيب الموقع: الصفحة الرئيسية، عن الوقف، المشاريع، البرامج، الأخبار، المكتبة، شارك معنا، المتجر، الحسابات البنكية، وإعدادات الموقع.',
        'افتح بند أي صفحة تجد كل ما يخصها في تبويبات: قوائمها (المشاريع مثلاً) في تبويب، ونصوصها وصورها في تبويب آخر — لا تحتاج البحث في مكان ثانٍ.',
        'تحت عنوان كل قسم سطر يقول أين يظهر على الموقع بالضبط.',
      ],
      [
        'Kenar çubuğunda, sitenin her sayfası için sitenin kendi sırasıyla bir madde vardır: ana sayfa, hakkında, projeler, programlar, haberler, kütüphane, katılım, mağaza, banka hesapları ve site ayarları.',
        'Bir sayfanın maddesini açın; ona ait her şey sekmeler hâlindedir: listeleri (örneğin projeler) bir sekmede, metin ve görselleri başka bir sekmede — başka yerde aramanız gerekmez.',
        'Her bölüm başlığının altındaki satır, sitede tam olarak nerede göründüğünü söyler.',
      ],
      [
        'The sidebar has one item for every page of the site, in the site’s own order: home, about, projects, programs, news, library, participate, store, bank accounts and site settings.',
        'Open a page’s item and everything about it sits in tabs: its lists (projects, say) in one tab, its texts and images in another — nothing to hunt down elsewhere.',
        'The line under every section title says exactly where it appears on the site.',
      ],
    ),
    link: { to: '/admin/site/home', label: L('افتح الصفحة الرئيسية', 'Ana sayfayı aç', 'Open the home page') },
  },
  {
    icon: Search,
    title: L('أين أجد ما أريد تعديله؟', 'Değiştirmek istediğim şeyi nerede bulurum?', 'Where do I find what I want to change?'),
    body: P(
      [
        'اضغط صندوق البحث في أعلى الشاشة (أو Ctrl + K) واكتب أي كلمة: اسم قسم، اسم حقل، أو عنوان خبر — ستصل مباشرة إلى مكان تعديله.',
        'أو ابدأ من لوحة التحكم: فيها بطاقة لكل صفحة من صفحات الموقع، والبطاقة تفتح كل ما يخص تلك الصفحة.',
      ],
      [
        'Üstteki arama kutusuna (veya Ctrl + K) herhangi bir kelime yazın: bir bölüm adı, bir alan adı ya da bir haber başlığı — doğrudan düzenleme yerine gidersiniz.',
        'Ya da panodan başlayın: sitenin her sayfası için bir kart vardır ve kart o sayfaya ait her şeyi açar.',
      ],
      [
        'Click the search box at the top (or press Ctrl + K) and type anything: a section name, a field name or an article title — it takes you straight to where it is edited.',
        'Or start from the dashboard: it has a card for every page of the site, and the card opens everything about that page.',
      ],
    ),
  },
  {
    icon: Globe2,
    title: L('اللغات الثلاث', 'Üç dil', 'The three languages'),
    body: P(
      [
        'كل نص له نسخة عربية وتركية وإنجليزية. في صفحات الموقع تختار لغة التحرير من الأعلى؛ في القوائم كذلك يوجد مبدّل "لغة التحرير" يقلب كل الحقول دفعة واحدة.',
        'النقاط الصغيرة بجانب اللغات تخبرك أي اللغات مكتملة. إن تركت لغة فارغة يعرض الموقع النص من لغة أخرى بدلاً منها — لا يظهر فراغ.',
        'زر "نسخ من العربية" يملأ الحقل بنص اللغة الأخرى لتبدأ الترجمة منه.',
      ],
      [
        'Her metnin Arapça, Türkçe ve İngilizce sürümü vardır. Sayfalarda düzenleme dilini üstten seçersiniz; listelerde de "Düzenleme dili" anahtarı tüm alanları birden değiştirir.',
        'Dillerin yanındaki küçük noktalar hangi dillerin tamamlandığını gösterir. Bir dili boş bırakırsanız site onun yerine başka bir dildeki metni gösterir.',
        '"Kopyala" butonu alanı diğer dildeki metinle doldurur; çeviriye oradan başlarsınız.',
      ],
      [
        'Every text has an Arabic, Turkish and English version. On site pages you pick the editing language at the top; lists have an "Editing language" switch that flips every field at once.',
        'The small dots next to the languages show which are complete. If you leave a language empty the site shows the text from another language instead — never a blank.',
        '"Copy from" fills the field with another language’s text so you can translate from it.',
      ],
    ),
  },
  {
    icon: ListChecks,
    title: L('النشر، الإخفاء، الحذف', 'Yayınlama, gizleme, silme', 'Publishing, hiding, deleting'),
    body: P(
      [
        'كل عنصر في القوائم له حالة: منشور (يظهر على الموقع) أو مسودة (مخفي). اضغط الحالة في القائمة لتبديلها فوراً.',
        'الحذف نهائي ولا يمكن التراجع عنه — إن أردت إخفاء عنصر مؤقتاً فألغِ نشره بدلاً من حذفه.',
        'الترتيب على الموقع هو ترتيب القائمة هنا: استخدم الأسهم لتحريك العناصر.',
        'التغييرات في صفحات الموقع لا تُنشر إلا بعد الضغط على "حفظ". إن غادرت وهناك تغييرات غير محفوظة سيسألك النظام.',
      ],
      [
        'Listelerdeki her öğenin bir durumu vardır: yayında (sitede görünür) veya taslak (gizli). Listede durumu tıklayarak anında değiştirin.',
        'Silme kalıcıdır ve geri alınamaz — bir öğeyi geçici olarak gizlemek için silmek yerine yayından kaldırın.',
        'Sitedeki sıra buradaki liste sırasıdır: öğeleri oklarla taşıyın.',
        'Sayfalardaki değişiklikler yalnızca "Kaydet"e bastıktan sonra yayınlanır. Kaydedilmemiş değişikliklerle ayrılırsanız sistem sizi uyarır.',
      ],
      [
        'Every list item has a status: published (visible on the site) or draft (hidden). Click the status in the list to toggle it instantly.',
        'Deleting is permanent — to hide something temporarily, unpublish it instead.',
        'The order on the site is the order of the list here: use the arrows to move items.',
        'Changes to site pages go live only after you press "Save". If you leave with unsaved changes, you will be asked first.',
      ],
    ),
  },
  {
    icon: ImageIcon,
    title: L('الصور والملفات', 'Görseller ve dosyalar', 'Images and files'),
    body: P(
      [
        'في أي حقل صورة يمكنك: رفع صورة من جهازك، أو اختيارها من مكتبة الوسائط، أو لصق رابط.',
        'أحجام مناسبة: صور الواجهات والأغلفة 1600×900 تقريباً، بطاقات المشاريع والبرامج 1200×800، الشعارات PNG بخلفية شفافة. حجم الملف يفضل أن يبقى تحت 500 كيلوبايت.',
        '"وصف الصورة" نص قصير يقرؤه المكفوفون ومحركات البحث — اكتب ما تُظهره الصورة.',
        'ملفات PDF تُرفع من حقل الملف في المستندات والمقالات. قبل حذف ملف من مكتبة الوسائط يخبرك النظام إن كان مستخدماً في مكان ما.',
      ],
      [
        'Her görsel alanında: cihazınızdan yükleyebilir, medya kütüphanesinden seçebilir veya bir bağlantı yapıştırabilirsiniz.',
        'Uygun boyutlar: kapak görselleri yaklaşık 1600×900, proje/program kartları 1200×800, logolar şeffaf PNG. Dosya boyutunu 500 KB altında tutmaya çalışın.',
        '"Görsel açıklaması" ekran okuyucuların ve arama motorlarının okuduğu kısa bir metindir — görselde ne olduğunu yazın.',
        'PDF dosyaları belge ve makalelerdeki dosya alanından yüklenir. Medya kütüphanesinden bir dosyayı silmeden önce sistem nerede kullanıldığını söyler.',
      ],
      [
        'In any image field you can upload from your device, choose from the media library, or paste a link.',
        'Good sizes: hero/cover images about 1600×900, project/program cards 1200×800, logos as PNG with a transparent background. Keep files under about 500 KB.',
        '"Image description" is a short text read by screen readers and search engines — write what the image shows.',
        'PDFs are uploaded from the file field on documents and articles. Before deleting a file from the media library, the system tells you if it is used somewhere.',
      ],
    ),
    link: { to: '/admin/media', label: L('افتح مكتبة الوسائط', 'Medya kütüphanesini aç', 'Open the media library') },
  },
  {
    icon: Link2,
    title: L('كيف أكتب الروابط؟', 'Bağlantılar nasıl yazılır?', 'How do I write links?'),
    body: P(
      [
        'رابط صفحة داخل الموقع يبدأ بشرطة مائلة: /projects أو /news أو /donate أو /participate/volunteer.',
        'رابط قسم في الصفحة الرئيسية يبدأ بعلامة #: \u200E#about أو \u200E#programs أو \u200E#participate.',
        'رابط خارجي يُكتب كاملاً: https://…',
        'رابط صفحة خبر أو مشروع تجده في حقل "رابط الصفحة" داخل ذلك العنصر — وتغييره بعد النشر يعطّل الروابط القديمة.',
      ],
      [
        'Site içi bir sayfa bağlantısı eğik çizgiyle başlar: /projects, /news, /donate, /participate/volunteer.',
        'Ana sayfadaki bir bölüme bağlantı # ile başlar: #about, #programs, #participate.',
        'Dış bağlantılar tam yazılır: https://…',
        'Bir haber veya proje sayfasının bağlantısı o öğedeki "Sayfa bağlantısı" alanındadır — yayından sonra değiştirmek eski bağlantıları bozar.',
      ],
      [
        'A link to a page inside the site starts with a slash: /projects, /news, /donate, /participate/volunteer.',
        'A link to a section of the home page starts with #: #about, #programs, #participate.',
        'External links are written in full: https://…',
        'The link of a news or project page is in its "Page link" field — changing it after publishing breaks old links.',
      ],
    ),
  },
  {
    icon: Video,
    title: L('الفيديو', 'Video', 'Video'),
    body: P(
      [
        'الصق رابط يوتيوب في حقل الفيديو وسيُلتقط الغلاف تلقائياً، أو ارفع ملف فيديو من جهازك (حتى 50 ميغابايت). للفيديوهات الطويلة استخدم يوتيوب.',
      ],
      ['Video alanına bir YouTube bağlantısı yapıştırın (kapak otomatik alınır) veya cihazınızdan bir dosya yükleyin (en fazla 50 MB). Uzun videolar için YouTube kullanın.'],
      ['Paste a YouTube link into the video field (the cover is picked up automatically) or upload a file from your device (up to 50 MB). Use YouTube for long videos.'],
    ),
  },
  {
    icon: Inbox,
    title: L('الرسائل والمشتركون', 'Mesajlar ve aboneler', 'Messages and subscribers'),
    body: P(
      [
        'ما يرسله الزوار عبر نماذج "شاركنا" يصل إلى "رسائل النماذج": افتح الرسالة لقراءتها، ثم ضع عليها "مقروء" أو "أرشفة". الرقم الأحمر في القائمة الجانبية هو عدد الرسائل الجديدة.',
        'عناوين البريد المشتركة في النشرة تجدها في "المشتركون" مع زر لتصديرها كملف Excel.',
      ],
      [
        'Ziyaretçilerin "Katılım" formlarından gönderdikleri "Form mesajları"na düşer: mesajı açıp okuyun, sonra "okundu" ya da "arşivle" işaretleyin. Yan menüdeki kırmızı sayı yeni mesaj sayısıdır.',
        'Bülten e-postaları "Aboneler" bölümündedir; Excel olarak dışa aktarabilirsiniz.',
      ],
      [
        'What visitors send through the "Participate" forms lands in "Form submissions": open a message to read it, then mark it read or archive it. The red number in the sidebar is the count of new messages.',
        'Newsletter email addresses are under "Subscribers", with an export-to-Excel button.',
      ],
    ),
    link: { to: '/admin/submissions', label: L('افتح الرسائل', 'Mesajları aç', 'Open messages') },
  },
  {
    icon: Trophy,
    title: L('طلبات جائزة أويس', 'Owais Ödülü başvuruları', 'Owais Award applications'),
    body: P(
      [
        'كل مبادرة تتقدم عبر استمارة الترشيح تظهر في "طلبات جائزة أويس" برقم طلب خاص بها. افتح الطلب لقراءة بياناته كاملة وصوره، ثم غيّر حالته (قيد المراجعة، مقبول مبدئياً، مرفوض، مؤرشف) واكتب ملاحظاتك الداخلية.',
        'زر "تحميل Excel" ينزّل كل ما يظهر في الجدول (بعد البحث والفلترة) في ملف واحد: طلب في كل صف وحقل في كل عمود.',
        'من بطاقة "إعدادات الجائزة" أعلى الصفحة: تُخفي صفحة الجائزة عن الزوار أو تُظهرها (عند الإخفاء يختفي تبويبها من القائمة ولا تُفتح الصفحة ولا الاستمارة)، وتفتح الاستمارة أو تغلقها، وتحدد آخر يوم للتقديم فتُغلق تلقائياً بنهايته بتوقيت اليمن. الطلبات المكررة من نفس البريد أو الرقم تُقبل وتُميَّز بعلامة "مكرر".',
        'من "جائزة أويس" في القائمة الجانبية تُعدَّل كل نصوص صفحة الجائزة وصورها (تبويب "صفحة الجائزة") وكل نصوص استمارة الترشيح ورسائلها وصفحة استلام الطلب (تبويب "استمارة الترشيح")، لكل لغة على حدة، ويمكن إخفاء أي قسم من الصفحة. الشروط التي تتحقق منها الاستمارة (حدود الكلمات وعدد الصور وغيرها) ثابتة ولا تتغير من هناك.',
      ],
      [
        'Aday gösterme formuyla başvuran her girişim, kendi başvuru numarasıyla "Owais Ödülü başvuruları"nda görünür. Başvuruyu açıp tüm bilgilerini ve fotoğraflarını okuyun, sonra durumunu değiştirin (inceleniyor, ön kabul, reddedildi, arşivlendi) ve dahili notlarınızı yazın.',
        '"Excel indir" düğmesi, tabloda görünen her şeyi (arama ve filtreden sonra) tek dosyada indirir: her satırda bir başvuru, her sütunda bir alan.',
        'Sayfanın üstündeki "Ödül ayarları" kartından: ödül sayfasını ziyaretçilerden gizleyebilir veya gösterebilir (gizlenince sekmesi menüden kalkar, sayfa ve form açılmaz), formu açıp kapatabilir ve son başvuru gününü belirleyebilirsiniz; form o günün sonunda (Yemen saatiyle) kendiliğinden kapanır. Aynı e-posta veya numaradan gelen yinelenen başvurular kabul edilir ve "Yinelenen" olarak işaretlenir.',
        'Yan menüdeki "Owais Ödülü" altında ödül sayfasının tüm metinleri ve görselleri ("Ödül sayfası" sekmesi) ile aday gösterme formunun tüm metinleri, mesajları ve alındı sayfası ("Aday gösterme formu" sekmesi) her dil için ayrı ayrı düzenlenir; sayfanın herhangi bir bölümü gizlenebilir. Formun denetlediği kurallar (kelime sınırları, fotoğraf sayısı vb.) sabittir ve oradan değişmez.',
      ],
      [
        'Every initiative that applies through the nomination form appears under "Owais Award applications" with its own application number. Open one to read all its details and photos, then change its status (under review, shortlisted, rejected, archived) and write your internal notes.',
        'The "Download Excel" button saves everything the table shows (after search and filters) into one file: one application per row, one field per column.',
        'The "Award settings" card at the top hides the award page from visitors or shows it (while hidden its tab leaves the menu and neither the page nor the form opens), opens or closes the form, and sets the last day to apply; the form then closes by itself at the end of that day, Yemen time. Repeated applications from the same email or number are accepted and marked "Duplicate".',
        'Under "Owais Award" in the sidebar you edit every text and picture of the award page (the "Award page" tab) and every text, message and confirmation-page line of the nomination form (the "Nomination form" tab), language by language, and you can hide any section of the page. The rules the form checks (word limits, number of photos and so on) are fixed and do not change there.',
      ],
    ),
    link: { to: '/admin/award-applications', label: L('افتح طلبات الجائزة', 'Başvuruları aç', 'Open the applications') },
  },
  {
    icon: Keyboard,
    title: L('اختصارات', 'Kısayollar', 'Shortcuts'),
    body: P(
      ['Ctrl + S: حفظ. Ctrl + K: البحث. Esc: إغلاق أي نافذة.'],
      ['Ctrl + S: kaydet. Ctrl + K: ara. Esc: pencereyi kapat.'],
      ['Ctrl + S: save. Ctrl + K: search. Esc: close any window.'],
    ),
  },
];

export default function HelpPage() {
  const { locale } = useI18n();
  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <BookOpen size={22} className="text-primary-600" />
          {label('دليل الاستخدام', 'Kullanım kılavuzu', 'User guide')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {label(
            'كل ما تحتاج معرفته لإدارة الموقع بنفسك — من الأبسط إلى الأعمق.',
            'Siteyi kendiniz yönetmek için bilmeniz gereken her şey.',
            'Everything you need to run the site yourself — from the basics up.',
          )}
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.title.en} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2.5 font-semibold text-slate-800">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon size={16} />
                </span>
                {section.title[locale]}
              </h2>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                {section.body[locale].map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.link && (
                <Link
                  to={section.link.to}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"
                >
                  <LayoutTemplate size={14} />
                  {section.link.label[locale]}
                </Link>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
