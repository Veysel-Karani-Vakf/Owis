-- =============================================================================
-- Veysel Karani Waqf — Organizational Structure Schema & Policies
-- Stores organizational sections, member profiles, and sectional memberships.
-- =============================================================================

-- 1. Organizational Sections (الهيئات والمجالس الإدارية والتنظيمية)
create table if not exists public.org_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  layout_type text not null default 'cards', -- 'chart' or 'cards'
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_org_sections_updated_at on public.org_sections;
create trigger set_org_sections_updated_at before update on public.org_sections
  for each row execute function public.set_updated_at();

alter table public.org_sections enable row level security;

drop policy if exists "public read" on public.org_sections;
create policy "public read" on public.org_sections for select using (true);

drop policy if exists "admin write" on public.org_sections;
create policy "admin write" on public.org_sections for all
  using (public.is_admin()) with check (public.is_admin());


-- 2. People / Member Profiles (سجلات الأشخاص والسير الذاتية)
create table if not exists public.org_people (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name jsonb not null default '{}'::jsonb,
  short_name jsonb not null default '{}'::jsonb,
  image text,
  image_position text default 'center 20%',
  short_bio jsonb not null default '{}'::jsonb,
  full_bio jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_org_people_updated_at on public.org_people;
create trigger set_org_people_updated_at before update on public.org_people
  for each row execute function public.set_updated_at();

alter table public.org_people enable row level security;

drop policy if exists "public read" on public.org_people;
create policy "public read" on public.org_people for select using (true);

drop policy if exists "admin write" on public.org_people;
create policy "admin write" on public.org_people for all
  using (public.is_admin()) with check (public.is_admin());


-- 3. Organizational Memberships (عضوية الأشخاص في الهيئات والمجالس)
create table if not exists public.org_memberships (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.org_sections(id) on delete cascade,
  person_id uuid not null references public.org_people(id) on delete cascade,
  role_title jsonb not null default '{}'::jsonb,
  level int not null default 3, -- 1: President/Chairperson, 2: Exec/Deputy, 3: Members/Dept managers
  parent_id uuid references public.org_memberships(id) on delete set null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, person_id)
);

drop trigger if exists set_org_memberships_updated_at on public.org_memberships;
create trigger set_org_memberships_updated_at before update on public.org_memberships
  for each row execute function public.set_updated_at();

alter table public.org_memberships enable row level security;

drop policy if exists "public read" on public.org_memberships;
create policy "public read" on public.org_memberships for select using (true);

drop policy if exists "admin write" on public.org_memberships;
create policy "admin write" on public.org_memberships for all
  using (public.is_admin()) with check (public.is_admin());


-- =============================================================================
-- SEED DATA MIGRATION (Idempotent: ON CONFLICT DO NOTHING)
-- =============================================================================

-- Seed 4 Core Organizational Sections
insert into public.org_sections (slug, title, description, layout_type, sort_order, is_published)
values
  (
    'administrative-body',
    '{"ar": "الهيئة الإدارية", "tr": "İdari Heyet", "en": "Administrative Body"}'::jsonb,
    '{"ar": "الهيكل التنفيذي المسؤول عن إدارة وتسيير أعمال الوقف اليومية وتنسيق عمل الإدارات ومتابعة تنفيذ خططه وبرامجه ومبادراته التنموية.", "tr": "Vakfın günlük operasyonlarını yönetmekten, departmanlar arası koordinasyonu sağlamaktan ve stratejik planları uygulamaktan sorumlu icra yapısı.", "en": "The executive body responsible for managing daily foundation operations, coordinating executive departments, and implementing strategic development programs."}'::jsonb,
    'chart',
    1,
    true
  ),
  (
    'board-of-trustees',
    '{"ar": "هيئة المتولين", "tr": "Mütevelli Heyeti", "en": "Board of Trustees"}'::jsonb,
    '{"ar": "الهيئة العليا المعنية برعاية الوقف وحمايته والتأكد من استدامة موارده وتنميتها وتحقيق مقاصده وأهدافه التنموية الكبرى.", "tr": "Vakfın korunması, varlıklarının gözetilmesi, kaynaklarının sürdürülebilirliği ve hedeflerinin gerçekleştirilmesini güvence altına alan üst heyet.", "en": "The supreme supervisory body dedicated to safeguarding waqf assets, asset sustainability, and fulfilling its core developmental purposes."}'::jsonb,
    'cards',
    2,
    true
  ),
  (
    'board-of-directors',
    '{"ar": "مجلس الإدارة", "tr": "Yönetim Kurulu", "en": "Board of Directors"}'::jsonb,
    '{"ar": "المجلس المكلف برسم السياسات العامة والإشراف على التوجهات الاستراتيجية والخطط التنفيذية للوقف وحوكمة أعماله المؤسسية.", "tr": "Genel politikaları belirlemek, stratejik yönelimleri ve vakfın icra planlarını denetlemekle görevli yönetim kurulu.", "en": "The board tasked with formulating general policies, overseeing strategic directions, executive plans, and corporate governance."}'::jsonb,
    'cards',
    3,
    true
  ),
  (
    'investment-body',
    '{"ar": "هيئة الاستثمار", "tr": "Yatırım Heyeti", "en": "Investment Body"}'::jsonb,
    '{"ar": "الهيئة التخصصية المعنية بتنمية واستثمار أصول وأموال الوقف لضمان عوائد مالية مستدامة تدعم برامج ومسارات النهوض الحضاري.", "tr": "Vakıf varlıklarını ve yatırımlarını büyüterek kalkınma programlarına sürdürülebilir gelir sağlamaktan sorumlu uzman heyet.", "en": "The specialized body managing investments and endowment asset growth to generate sustainable financial returns."}'::jsonb,
    'cards',
    4,
    true
  )
on conflict (slug) do nothing;


-- Seed 5 Original Administrative Body People Records
insert into public.org_people (slug, name, short_name, image, image_position, short_bio, full_bio)
values
  (
    'president',
    '{"ar": "أ/ صلاح باتيس", "tr": "Salah Batiss", "en": "Salah Batiss"}'::jsonb,
    '{"ar": "صلاح باتيس", "tr": "Salah Batiss", "en": "Salah Batiss"}'::jsonb,
    '/media/1024x576-3bbcc5a7.jpeg',
    'center 20%',
    '{"ar": "الإشراف العام على الوقف ومجلس الإدارة وتوجيه السياسات الاستراتيجية لتحقيق أهداف الوقف التنموية.", "tr": "Vakfın genel gözetimi, yönetim kurulu liderliği ve stratejik hedeflerin gerçekleştirilmesi.", "en": "General supervision of the foundation and strategic leadership to achieve sustainable development goals."}'::jsonb,
    '{"ar": "رئيس وقف أويس القرني، ورائد العمل التنموي والوقفي، يقود المبادرات الاستراتيجية لبناء أكبر وقف تشاركي نوعي لنهضة اليمن وتوثيق الشراكات المحلية والإقليمية والدولية.", "tr": "Veysel Karani Vakfı Başkanı, Yemen kalkınması için katılımcı vakıf girişimlerine ve kurumsal ortaklıklara liderlik etmektedir.", "en": "President of Veysel Karani Waqf, leading strategic initiatives to establish a premier participatory endowment for Yemen advancement and strengthening institutional partnerships."}'::jsonb
  ),
  (
    'executive-director',
    '{"ar": "أ/ صلاح الدين القياضي", "tr": "Salahuddin Al-Qayadi", "en": "Salahuddin Al-Qayadi"}'::jsonb,
    '{"ar": "صلاح الدين القياضي", "tr": "Salahuddin Al-Qayadi", "en": "Salahuddin Al-Qayadi"}'::jsonb,
    '',
    'center 20%',
    '{"ar": "إدارة العمليات اليومية وتنسيق عمل الإدارات التنفيذية ومتابعة تنفيذ خطط وبرامج الوقف.", "tr": "Günlük operasyonların yönetimi, departmanlar arası koordinasyon ve vakıf planlarının uygulanması.", "en": "Managing daily operations, coordinating executive departments, and overseeing the execution of foundation programs."}'::jsonb,
    '{"ar": "المدير التنفيذي لوقف أويس القرني، يتولى إدارة الجهاز التنفيذي والإشراف المباشر على سير المشروعات والبرامج وتطوير الأداء المؤسسي وضمان تحقيق المستهدفات.", "tr": "Veysel Karani Vakfı İcra Direktörü, idari yapıyı ve proje uygulamalarını yöneterek kurumsal hedeflerin gerçekleştirilmesini sağlar.", "en": "Executive Director of Veysel Karani Waqf, leading executive administration, operational workflows, and strategic program delivery across all departments."}'::jsonb
  ),
  (
    'programs-manager',
    '{"ar": "أ/ أيمن رياض", "tr": "Ayman Riad", "en": "Ayman Riad"}'::jsonb,
    '{"ar": "أيمن رياض", "tr": "Ayman Riad", "en": "Ayman Riad"}'::jsonb,
    '',
    'center 20%',
    '{"ar": "تخطيط وإدارة البرامج والمشاريع التنموية والتعليمية للوقف والإشراف على متابعتها وتقييمها.", "tr": "Kalkınma ve eğitim programlarının planlanması, projelerin uygulanması ve etki değerlendirmesi.", "en": "Planning and managing developmental and educational programs, overseeing project execution and impact evaluation."}'::jsonb,
    '{"ar": "مسؤول إدارة البرامج في وقف أويس القرني، يشرف على تصميم وتنفيذ البرامج النوعية ومسارات النهوض الحضاري ومتابعة جودة التنفيذ وتقييم الأثر التنموي.", "tr": "Veysel Karani Vakfı Program Yöneticisi, nitelikli projelerin tasarımını, uygulanmasını ve etki değerlendirmesini yönetir.", "en": "Head of Programs at Veysel Karani Waqf, overseeing program design, educational tracks, implementation quality, and developmental impact assessment."}'::jsonb
  ),
  (
    'media-manager',
    '{"ar": "إدارة الإعلام والاتصال", "tr": "Medya ve İletişim Birimi", "en": "Media & Communications Department"}'::jsonb,
    '{"ar": "إدارة الإعلام", "tr": "Medya Birimi", "en": "Media Dept"}'::jsonb,
    '',
    'center 20%',
    '{"ar": "إدارة الهوية الإعلامية والاتصال المؤسسي والنشر الرقمي والتواصل مع الشركاء والجمهور.", "tr": "Medya kimliği, kurumsal iletişim, dijital yayıncılık ve halkla ilişkilerin yönetimi.", "en": "Managing media identity, corporate communications, digital publishing, and public relations."}'::jsonb,
    '{"ar": "مسؤول وحدة الإعلام والاتصال المؤسسي، يشرف على التغطيات الإعلامية، صناعة المحتوى، وإدارة المنصات الرقمية وتوثيق مسيرة الوقف وبرامجه ومبادراته.", "tr": "Kurumsal iletişim, medya yayınları, dijital platformlar ve vakıf faaliyetlerinin belgelenmesini yönetir.", "en": "Leading corporate communications, media coverage, content creation, digital platforms, and documenting foundation milestones."}'::jsonb
  ),
  (
    'finance-manager',
    '{"ar": "أ/ شعيب الصليحي", "tr": "Shoaib Al-Sulaihi", "en": "Shoaib Al-Sulaihi"}'::jsonb,
    '{"ar": "شعيب الصليحي", "tr": "Shoaib Al-Sulaihi", "en": "Shoaib Al-Sulaihi"}'::jsonb,
    '',
    'center 20%',
    '{"ar": "إدارة الشؤون المالية والمحاسبية والموازنات وضمان تطبيق معايير الامتثال والرقابة المالية.", "tr": "Mali ve muhasebe işlerinin yönetimi, bütçeleme ve finansal uyum standartlarının sağlanması.", "en": "Managing financial and accounting affairs, budgets, and ensuring compliance and financial governance standards."}'::jsonb,
    '{"ar": "المسؤول المالي لوقف أويس القرني، يدير المنظومة المالية والمحاسبية، إعداد الموازنات، وتطبيق السياسات المالية الرصينة ومعايير الحوكمة والنزاهة والشفافية.", "tr": "Veysel Karani Vakfı Mali İşler Yöneticisi, finansal operasyonları, bütçe yönetimini ve şeffaflık standartlarını yürütür.", "en": "Finance Manager at Veysel Karani Waqf, managing accounting operations, financial reporting, budgeting, and governance standards."}'::jsonb
  )
on conflict (slug) do nothing;


-- Link the 5 people to Administrative Body (الهيئة الإدارية) with their exact hierarchy
do $$
declare
  sec_id uuid;
  pres_p_id uuid;
  exec_p_id uuid;
  prog_p_id uuid;
  med_p_id uuid;
  fin_p_id uuid;
  pres_m_id uuid;
  exec_m_id uuid;
begin
  select id into sec_id from public.org_sections where slug = 'administrative-body';
  select id into pres_p_id from public.org_people where slug = 'president';
  select id into exec_p_id from public.org_people where slug = 'executive-director';
  select id into prog_p_id from public.org_people where slug = 'programs-manager';
  select id into med_p_id from public.org_people where slug = 'media-manager';
  select id into fin_p_id from public.org_people where slug = 'finance-manager';

  if sec_id is not null and pres_p_id is not null then
    -- 1. President (Level 1, order 1, parent null)
    insert into public.org_memberships (section_id, person_id, role_title, level, parent_id, sort_order, is_published)
    values (
      sec_id,
      pres_p_id,
      '{"ar": "الرئيس", "tr": "Başkan", "en": "President"}'::jsonb,
      1,
      null,
      1,
      true
    )
    on conflict (section_id, person_id) do nothing;

    select id into pres_m_id from public.org_memberships where section_id = sec_id and person_id = pres_p_id;

    -- 2. Executive Director (Level 2, order 2, parent = president)
    insert into public.org_memberships (section_id, person_id, role_title, level, parent_id, sort_order, is_published)
    values (
      sec_id,
      exec_p_id,
      '{"ar": "المدير التنفيذي", "tr": "Genel Müdür", "en": "Executive Director"}'::jsonb,
      2,
      pres_m_id,
      2,
      true
    )
    on conflict (section_id, person_id) do update set parent_id = pres_m_id;

    select id into exec_m_id from public.org_memberships where section_id = sec_id and person_id = exec_p_id;

    -- 3. Programs Manager (Level 3, order 3, parent = exec director)
    insert into public.org_memberships (section_id, person_id, role_title, level, parent_id, sort_order, is_published)
    values (
      sec_id,
      prog_p_id,
      '{"ar": "مسؤول البرامج", "tr": "Program Yöneticisi", "en": "Programs Manager"}'::jsonb,
      3,
      exec_m_id,
      3,
      true
    )
    on conflict (section_id, person_id) do update set parent_id = exec_m_id;

    -- 4. Media Manager (Level 3, order 4, parent = exec director)
    insert into public.org_memberships (section_id, person_id, role_title, level, parent_id, sort_order, is_published)
    values (
      sec_id,
      med_p_id,
      '{"ar": "مسؤول الإعلام", "tr": "Medya Yöneticisi", "en": "Media Manager"}'::jsonb,
      3,
      exec_m_id,
      4,
      true
    )
    on conflict (section_id, person_id) do update set parent_id = exec_m_id;

    -- 5. Finance Manager (Level 3, order 5, parent = exec director)
    insert into public.org_memberships (section_id, person_id, role_title, level, parent_id, sort_order, is_published)
    values (
      sec_id,
      fin_p_id,
      '{"ar": "المسؤول المالي", "tr": "Mali İşler Yöneticisi", "en": "Finance Manager"}'::jsonb,
      3,
      exec_m_id,
      5,
      true
    )
    on conflict (section_id, person_id) do update set parent_id = exec_m_id;
  end if;
end $$;

-- Seed site_pages row for administrative-structure (if not exists)
insert into public.site_pages (key, label, data)
values (
  'administrative-structure',
  '{"ar": "الهيكل الإداري", "tr": "İdari Yapı", "en": "Administrative Structure"}'::jsonb,
  '{
    "ar": {
      "seo": {
        "title": "الهيكل الإداري | وقف أويس القرني",
        "description": "تعرّف على الهيكل الإداري لوقف أويس القرني والقيادات المسؤولة عن إدارة أعمال الوقف وتنفيذ برامجه وتحقيق أهدافه.",
        "canonical": "/about/structure"
      },
      "hero": {
        "title": "الهيكل الإداري",
        "description": "القيادة والإدارة في وقف أويس القرني",
        "image": "/media/135a7765-scaled-1-1024x683-97228b97.jpg",
        "imageAlt": "الهيكل الإداري لوقف أويس القرني"
      },
      "intro": {
        "eyebrow": "الهيكل التنظيمي",
        "title": "الهيكل الإداري",
        "subtitle": "القيادة والإدارة في وقف أويس القرني",
        "description": "تعرّف على الهيكل الإداري لوقف أويس القرني والقيادات المسؤولة عن إدارة أعمال الوقف وتنفيذ برامجه وتحقيق أهدافه."
      }
    },
    "en": {
      "seo": {
        "title": "Administrative Structure | Veysel Karani Waqf",
        "description": "Discover the administrative structure of Veysel Karani Waqf and the leadership team managing foundation operations and programs.",
        "canonical": "/about/structure"
      },
      "hero": {
        "title": "Administrative Structure",
        "description": "Leadership and Management at Veysel Karani Waqf",
        "image": "/media/135a7765-scaled-1-1024x683-97228b97.jpg",
        "imageAlt": "Administrative Structure of Veysel Karani Waqf"
      },
      "intro": {
        "eyebrow": "Organizational Chart",
        "title": "Administrative Structure",
        "subtitle": "Leadership and Management at Veysel Karani Waqf",
        "description": "Discover the administrative structure of Veysel Karani Waqf and the leadership team responsible for managing foundation operations, executing programs, and achieving its goals."
      }
    },
    "tr": {
      "seo": {
        "title": "İdari Yapı | Veysel Karani Vakfı",
        "description": "Veysel Karani Vakfının idari yapısını, faaliyetlerini yöneten ve hedeflerini gerçekleştiren kadrosunu tanıyın.",
        "canonical": "/about/structure"
      },
      "hero": {
        "title": "İdari Yapı",
        "description": "Veysel Karani Vakfı Liderlik ve Yönetimi",
        "image": "/media/135a7765-scaled-1-1024x683-97228b97.jpg",
        "imageAlt": "Veysel Karani Vakfı İdari Yapı"
      },
      "intro": {
        "eyebrow": "Organizasyon Şeması",
        "title": "İdari Yapı",
        "subtitle": "Veysel Karani Vakfı Liderlik ve Yönetimi",
        "description": "Veysel Karani Vakfı''nın idari yapısını, vakıf faaliyetlerini yöneten, programlarını uygulayan ve hedeflerini gerçekleştiren kadrosunu tanıyın."
      }
    }
  }'::jsonb
)
on conflict (key) do nothing;

notify pgrst, 'reload schema';

