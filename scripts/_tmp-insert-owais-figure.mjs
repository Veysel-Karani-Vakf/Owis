// Inserts the Owais Al-Qarni biography into library_articles (yemeni-figures).
// Idempotent: re-running updates the same (collection, slug) row.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const { Client } = pg;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function readEnvLocal(key) {
  const text = readFileSync(join(root, '.env.local'), 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)\\s*$`));
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return null;
}

const title = {
  ar: 'أويس بن عامر القرني: خير التابعين',
  en: "Owais bin Amir Al-Qarni: The Best of the Tabi'in",
  tr: 'Veysel Karani: Tabiinin En Hayırlısı',
};

const excerpt = {
  ar: 'سيرة موجزة لأويس بن عامر القرني، خير التابعين بشهادة النبي صلى الله عليه وسلم: نسبه اليمني، وبرّه بأمه، وزهده وإخفاؤه نفسه، ولقاؤه بعمر بن الخطاب، وسرّ اختيار الوقف لاسمه.',
  en: "A concise biography of Owais bin Amir Al-Qarni, the best of the Tabi'in by the Prophet's own testimony: his Yemeni roots, his devotion to his mother, his asceticism, his meeting with Umar ibn Al-Khattab, and why the waqf carries his name.",
  tr: "Peygamber'in tanıklığıyla tabiinin en hayırlısı Veysel Karani'nin kısa hayat hikayesi: Yemenli kökleri, annesine bağlılığı, zühdü, Hz. Ömer ile buluşması ve vakfın onun adını taşımasının sırrı.",
};

const imageAlt = {
  ar: 'رجل يسير وحيداً بين كثبان الصحراء في إيحاء بزهد أويس القرني',
  en: 'A lone man walking through desert dunes, evoking the asceticism of Owais Al-Qarni',
  tr: "Çöl kumulları arasında tek başına yürüyen bir adam; Veysel Karani'nin zühdünü çağrıştırıyor",
};

const content = {
  ar: [
    'أويس بن عامر القرني علمٌ من أعلام اليمن الخالدين، وأحد أبرز التابعين في تاريخ الإسلام؛ رجل لم يلقَ النبي صلى الله عليه وسلم، ومع ذلك ذكره في أحاديثه وأوصى أصحابه بطلب الدعاء منه. جمع بين برّ الوالدة والزهد في الدنيا وإخفاء العمل الصالح، فصار قدوة تتوارثها الأجيال، وصار اسمه عنواناً للوقف الذي يحمل رسالته اليوم.',
    'نسبه وموطنه',
    'هو أويس بن عامر بن جزء المرادي ثم القرني، ينتسب إلى قبيلة مراد اليمنية، وإلى بطنها المعروف بقرن، ومنه جاءت نسبته «القرني». وُلد وعاش في اليمن في زمن النبوة، وأسلم على عهد رسول الله صلى الله عليه وسلم، غير أنه لم يتمكن من الرحيل ولقاء النبي؛ إذ كانت له والدة كبيرة في السن لا يجد من يقوم عليها سواه، فآثر البقاء إلى جوارها براً بها وإحساناً.',
    'خير التابعين بشهادة النبي',
    'روى الإمام مسلم في صحيحه عن عمر بن الخطاب رضي الله عنه أنه سمع رسول الله صلى الله عليه وسلم يقول: «إن خير التابعين رجل يقال له أويس، وله والدة، وكان به بياض، فمُروه فليستغفر لكم». وفي رواية أخرى: «يأتي عليكم أويس بن عامر مع أمداد أهل اليمن، من مراد ثم من قرن، كان به برص فبرأ منه إلا موضع درهم، له والدة هو بها برّ، لو أقسم على الله لأبرّه، فإن استطعت أن يستغفر لك فافعل». وهكذا نال أويس تزكية نبوية لم ينلها كثير ممن رأوا النبي بأعينهم، وهو الذي لم يره قط.',
    'برّه بأمه',
    'لم يكن برّ أويس بأمه تفصيلاً عابراً في سيرته، بل كان جوهرها الذي بُنيت عليه؛ فقد حبس نفسه على خدمتها ورعايتها، وقدّم حقها على رغبته العميقة في شدّ الرحال للقاء النبي صلى الله عليه وسلم. وبهذا البرّ رفع الله ذكره، حتى صار مضرب المثل في الإحسان إلى الوالدين، ودليلاً عملياً على أن أعمالاً تبدو بسيطة في أعين الناس قد تكون عند الله أعظم من عبادات كثيرة ظاهرة.',
    'لقاؤه بعمر بن الخطاب',
    'لما ولي عمر بن الخطاب رضي الله عنه أمر المؤمنين، جعل يسأل أمداد أهل اليمن القادمين إلى المدينة: «أفيكم أويس بن عامر؟» عملاً بوصية النبي صلى الله عليه وسلم، حتى وجده، فطلب منه أن يستغفر له، ففعل. ثم سأله عمر: أين تريد؟ قال: الكوفة. فعرض عليه أن يكتب له إلى واليها ليكرمه، فأجابه أويس بكلمته الشهيرة: «أكون في غبراء الناس أحبّ إليّ»، مؤثراً الخمول والخفاء على الجاه والمنزلة.',
    'الزاهد الذي أخفى نفسه',
    'عاش أويس في الكوفة عيشة الزهاد؛ يعمل ويتصدق بما يفضل عن قوته، ويلبس ما يستر بدنه، ولا يكاد يُعرف بين الناس. كان يكره أن يُشار إليه بالبنان بعدما شاع خبر تزكية النبي له، فآثر العزلة وإخفاء العمل الصالح، حتى ذكر من عرفه أنه كان يتوارى إذا تحدّث الناس في شأنه. وبهذا الإخلاص العميق صار نموذجاً فريداً للعبادة التي لا تطلب من الدنيا جاهاً ولا ذكراً.',
    'رحيله وأثره الباقي',
    'تذكر أكثر الروايات أن أويساً القرني استُشهد يوم صفّين سنة سبع وثلاثين للهجرة مقاتلاً في صف علي بن أبي طالب رضي الله عنه، وقيل غير ذلك في موضع وفاته. ومهما تعددت الروايات، فقد بقيت سيرته حية في كتب التراجم والسير، وظل اسمه مقترناً بالبر والزهد والإخلاص، ولا تزال مساجد ومقامات تحمل اسمه في اليمن وتركيا وبلاد أخرى شاهدة على مكانته في وجدان المسلمين.',
    'لماذا يحمل الوقف اسمه؟',
    'اختار وقف أويس القرني اسم هذا التابعي الجليل لأنه يختصر رسالته: يمنيٌّ ارتقى بالبر والإخلاص لا بالجاه والمال، وقدّم قصة يلتقي عندها حب الوطن وخدمة الإنسان. وكما خرج أويس من اليمن حاملاً خيرها إلى الأمة، يسعى الوقف إلى أن يكون جسراً يصل أبناء اليمن في الداخل والمهجر بقيمهم، وأن يجدد في كل جيل معاني البر والعطاء الخفي التي جسّدها أويس القرني.',
  ],
};

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL || readEnvLocal('SUPABASE_DB_URL'),
  ssl: { rejectUnauthorized: false },
});
await client.connect();
try {
  const { rows } = await client.query(
    `insert into public.library_articles (
       collection, slug, route, title, original_title, source_url, pdf_url,
       source_language, date, year, excerpt, image, image_alt, content,
       sort_order, is_published
     ) values (
       'yemeni-figures', 'owais-al-qarni', '/library/yemeni-figures/owais-al-qarni',
       $1::jsonb, $2, null, null,
       'ar', '2026-09-02', 2026, $3::jsonb,
       '/library/yemeni-figures/owais-al-qarni.jpeg', $4::jsonb, $5::jsonb,
       0, true
     )
     on conflict (collection, slug) do update set
       route = excluded.route,
       title = excluded.title,
       original_title = excluded.original_title,
       date = excluded.date,
       year = excluded.year,
       excerpt = excluded.excerpt,
       image = excluded.image,
       image_alt = excluded.image_alt,
       content = excluded.content,
       sort_order = excluded.sort_order,
       is_published = excluded.is_published
     returning id, collection, slug, route, is_published`,
    [JSON.stringify(title), title.ar, JSON.stringify(excerpt), JSON.stringify(imageAlt), JSON.stringify(content)]
  );
  console.log('upserted:', rows[0]);
} finally {
  await client.end();
}
