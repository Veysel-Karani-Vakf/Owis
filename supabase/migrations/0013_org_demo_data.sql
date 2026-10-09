-- =============================================================================
-- Migration 0013: Demo Data for Board of Trustees, Board of Directors, and Investment Body
-- =============================================================================

-- 1. Insert People into public.org_people
insert into public.org_people (slug, name, short_name, image, image_position, short_bio, full_bio)
values
  -- Board of Trustees Members
  (
    'dr-abdulrahman-baabbad',
    '{"ar": "د. عبد الرحمن بن عبد الله باعباد", "tr": "Dr. Abdurrahman Baabbad", "en": "Dr. Abdulrahman Baabbad"}'::jsonb,
    '{"ar": "د. عبد الرحمن باعباد", "tr": "Dr. Abdurrahman Baabbad", "en": "Dr. Abdulrahman Baabbad"}'::jsonb,
    '/media/404289685_754231176742469_222560613102746640_n-fb323dc2.jpg',
    'center 20%',
    '{"ar": "عالم وباحث إسلامي، قيادي في العمل الخيري والتنموي ورعاية الأوقاف الإسلامية.", "tr": "İslam alimi ve araştırmacı, hayır işleri ve vakıf yönetimi lideri.", "en": "Islamic scholar and leader in waqf and philanthropic development."}'::jsonb,
    '{"ar": "د. عبد الرحمن بن عبد الله باعباد، شخصية علمية وفكرية بارزة في رعاية وتأسيس المشروعات الوقفية، يمتلك خبرات واسعة في حوكمة الأوقاف ورعاية مقاصدها الشرعية والتنموية، وله إسهامات مشهودة في مساندة المبادرات الإنسانية والتعليمية.", "tr": "Dr. Abdurrahman Baabbad, vakıf projelerinin gözetimi ve kurumsallaşması alanında öncü bir ilim adamıdır.", "en": "Dr. Abdulrahman Baabbad is a prominent scholar in waqf governance and philanthropic leadership."}'::jsonb
  ),
  (
    'sheikh-abdullah-al-ahdal',
    '{"ar": "الشيخ عبد الله بن علي الأهدل", "tr": "Şeyh Abdullah Al-Ahdal", "en": "Sheikh Abdullah Al-Ahdal"}'::jsonb,
    '{"ar": "الشيخ عبد الله الأهدل", "tr": "Şeyh Abdullah Al-Ahdal", "en": "Sheikh Abdullah Al-Ahdal"}'::jsonb,
    '/media/336698213_626096582863996_8393318027431424252_n-8903ee50.jpg',
    'center 20%',
    '{"ar": "رائد عمل مجتمعي وخبير في تنمية الموارد الوقفية وتوجيه برامجها الاستراتيجية.", "tr": "Toplum lideri ve vakıf kaynaklarının geliştirilmesi uzmanı.", "en": "Community leader and endowment resource development expert."}'::jsonb,
    '{"ar": "الشيخ عبد الله الأهدل، من رواد العمل الوقفي والمجتمعي، شارك في تأسيس وإدارة العديد من المؤسسات الخيرية والوقفية، ويركز على ترسيخ مفاهيم الوقف المستدام ودعم نهضة المجتمعات.", "tr": "Şeyh Abdullah Al-Ahdal, hayır kurumlarının yönetiminde ve sürdürülebilir vakıf bilincinin yaygınlaştırılmasında öncü bir rol oynamaktadır.", "en": "Sheikh Abdullah Al-Ahdal is a veteran in waqf and civic leadership, advocating for sustainable endowment models."}'::jsonb
  ),
  (
    'dr-omar-bahwaireth',
    '{"ar": "د. عمر بن عبد العزيز باحويرث", "tr": "Dr. Ömer Bahwaireth", "en": "Dr. Omar Bahwaireth"}'::jsonb,
    '{"ar": "د. عمر باحويرث", "tr": "Dr. Ömer Bahwaireth", "en": "Dr. Omar Bahwaireth"}'::jsonb,
    '/media/409032959_764536392378614_3117098578156848748_n-5338666a.jpg',
    'center 20%',
    '{"ar": "أكاديمي ومستشار حوكمة وإدارة مؤسسية، يشرف على أمانة سر الهيئة وتوثيق قراراتها.", "tr": "Akademisyen, kurumsal yönetim danışmanı ve heyet genel sekreteri.", "en": "Academic and governance advisor serving as Board Secretary."}'::jsonb,
    '{"ar": "يحمل دكتوراه في الإدارة والسياسات العامة، وعمل مستشاراً للعديد من الهيئات والمنظمات التنموية، ويتولى أمانة سر هيئة المتولين ومتابعة تنفيذ توصياتها وسياساتها العامة.", "tr": "Yönetim ve kamu politikaları alanında doktora derecesine sahip olup heyet kararlarının takibini yürütmektedir.", "en": "Holds a doctorate in Management & Public Policy, overseeing secretarial governance and trustee resolution tracking."}'::jsonb
  ),
  (
    'eng-khaled-binmahfouz',
    '{"ar": "م. خالد بن محمد بن محفوظ", "tr": "Halid Bin Mahfuz", "en": "Eng. Khaled Bin Mahfouz"}'::jsonb,
    '{"ar": "م. خالد بن محفوظ", "tr": "Halid Bin Mahfuz", "en": "Eng. Khaled Bin Mahfouz"}'::jsonb,
    '/media/427939442_809323871233199_6779110555377559500_n-c18c7f47.jpg',
    'center 20%',
    '{"ar": "مستشار تنموي ورجل أعمال، مهتم بتمكين الشباب والمشاريع المستدامة.", "tr": "İş insanı ve sürdürülebilir kalkınma danışmanı.", "en": "Business leader and advisor on youth empowerment and sustainable initiatives."}'::jsonb,
    '{"ar": "يمتلك مسيرة مهنية غنية في قطاع الأعمال وإدارة المشاريع الاقتصادية والوقفية الكبرى في منطقة الشرق الأوسط وتركيا.", "tr": "Orta Doğu ve Türkiye''de büyük ölçekli ekonomik ve vakıf projelerinin yönetiminde zengin bir kariyere sahiptir.", "en": "Extensive track record in business development and major endowment projects across the Middle East and Turkey."}'::jsonb
  ),

  -- Board of Directors Members
  (
    'eng-hassan-alkaf',
    '{"ar": "م. حسان بن عبد العزيز الكاف", "tr": "Hassan El-Kaf", "en": "Eng. Hassan Al-Kaf"}'::jsonb,
    '{"ar": "م. حسان الكاف", "tr": "Hassan El-Kaf", "en": "Eng. Hassan Al-Kaf"}'::jsonb,
    '/media/412632127_772634611568792_6683881247781714342_n-5260ca1d.jpg',
    'center 20%',
    '{"ar": "خبير التخطيط الاستراتيجي والحوكمة المؤسسية، يقود مجلس الإدارة في رسم السياسات.", "tr": "Stratejik planlama ve kurumsal yönetim uzmanı, Yönetim Kurulu Başkanı.", "en": "Strategic planning and corporate governance expert leading the Board."}'::jsonb,
    '{"ar": "مهندس ومستشار تنفيذي ذو خبرة تفوق 20 عاماً في إدارة المؤسسات الكبرى وتوجيه خطط التحول المؤسسي والحوكمة والتميز التشغيلي.", "tr": "20 yılı aşkın kurumsal liderlik ve stratejik dönüşüm deneyimine sahip mühendis ve üst düzey yönetici.", "en": "Executive advisor with over 20 years of experience leading organizational governance and strategic transformation."}'::jsonb
  ),
  (
    'dr-fouad-al-himyari',
    '{"ar": "د. فؤاد بن محمد الحميري", "tr": "Dr. Fuad El-Himyari", "en": "Dr. Fouad Al-Himyari"}'::jsonb,
    '{"ar": "د. فؤاد الحميري", "tr": "Dr. Fuad El-Himyari", "en": "Dr. Fouad Al-Himyari"}'::jsonb,
    '/media/409000022_817066153792304_5364602523541778477_n-a0ca861e.jpg',
    'center 20%',
    '{"ar": "باحث ومفكر ومحاضر دولي، متخصص في تنمية الفكر والنهوض الحضاري.", "tr": "Araştırmacı, yazar ve uluslararası konuşmacı, düşünce ve kalkınma uzmanı.", "en": "Researcher, author, and international speaker specializing in civilizational development."}'::jsonb,
    '{"ar": "كاتب ومفكر بارز وله العديد من المؤلفات والبرامج الفكرية والتوعوية، يساهم في توجيه الرؤية الفكرية والتعليمية للوقف.", "tr": "Çok sayıda telif esere sahip düşünür; vakfın düşünsel ve eğitsel vizyonunun geliştirilmesine katkı sunmaktadır.", "en": "Prominent intellectual and author, contributing to the strategic direction of educational and awareness programs."}'::jsonb
  ),
  (
    'dr-abdulqader-othman',
    '{"ar": "د. عبد القادر بن عثمان", "tr": "Dr. Abdülkadir Osman", "en": "Dr. Abdulqader Othman"}'::jsonb,
    '{"ar": "د. عبد القادر بن عثمان", "tr": "Dr. Abdülkadir Osman", "en": "Dr. Abdulqader Othman"}'::jsonb,
    '/media/400111139_745157177649869_4174899741560897834_n-15668bbd.jpg',
    'center 20%',
    '{"ar": "خبير الاقتصاد والمالية الإسلامية، يشرف على مراجعة السياسات المالية واستدامتها.", "tr": "İslami finans ve ekonomi uzmanı, finansal politikaların gözetiminden sorumlu.", "en": "Islamic finance and economics advisor overseeing financial sustainability."}'::jsonb,
    '{"ar": "حاصل على درجة الدكتوراه في المصرفية الإسلامية والاقتصاد، قدم استشارات مالية لمؤسسات تنموية ودولية متعددة.", "tr": "İslami bankacılık alanında doktora yapmış olup çok sayıda kalkınma kurumuna danışmanlık hizmeti sunmuştur.", "en": "Doctorate in Islamic Economics & Banking, consulting for regional and international development institutions."}'::jsonb
  ),
  (
    'nasser-al-qahtani',
    '{"ar": "أ. ناصر بن علي القحطاني", "tr": "Nasır El-Kahtani", "en": "Nasser Al-Qahtani"}'::jsonb,
    '{"ar": "أ. ناصر القحطاني", "tr": "Nasır El-Kahtani", "en": "Nasser Al-Qahtani"}'::jsonb,
    '/media/413871824_776644024501184_8029070847178980447_n-641479b1.jpg',
    'center 20%',
    '{"ar": "مستشار قانوني وحوكمة مؤسسية، يتابع الامتثال لمعايير الشفافية واللوائح التنظيمية.", "tr": "Hukuk ve uyum danışmanı, kurumsal şeffaflık ve mevzuat denetiminden sorumlu.", "en": "Legal and governance counsel overseeing regulatory compliance and institutional transparency."}'::jsonb,
    '{"ar": "محامٍ ومستشار في القانون الدولي وحوكمة المنظمات غير الربحية، يسهر على التزام الوقف بأعلى معايير الإفصاح والنزاهة المؤسسية.", "tr": "Uluslararası hukuk ve kâr amacı gütmeyen kuruluşlar hukuku uzmanı; vakfın şeffaflık standartlarını denetler.", "en": "Counsel in international law and NGO governance, ensuring the highest standards of transparency and integrity."}'::jsonb
  ),

  -- Investment Body Members
  (
    'dr-khaled-al-rajhi',
    '{"ar": "د. خالد بن عبد الله الراجحي", "tr": "Dr. Halid El-Racihi", "en": "Dr. Khaled Al-Rajhi"}'::jsonb,
    '{"ar": "د. خالد الراجحي", "tr": "Dr. Halid El-Racihi", "en": "Dr. Khaled Al-Rajhi"}'::jsonb,
    '/media/421859724_796734252492161_6807517750198352383_n-bbcfd8dc.jpg',
    'center 20%',
    '{"ar": "خبير استثمار الأوقاف وإدارة المحافظ التنموية، يقود استراتيجيات تنمية أصول الوقف.", "tr": "Vakıf yatırımları ve portföy yönetimi uzmanı, Yatırım Heyeti Başkanı.", "en": "Endowment investment and portfolio management expert heading the Investment Body."}'::jsonb,
    '{"ar": "قيادي استثماري يتمتع بخبرة واسعة في إدارة الصناديق الاستثمارية العقارية والمالية، وإعادة هيكلة الأصول لتحقيق عوائد مجزية تدعم مشروعات الوقف التنموية.", "tr": "Gayrimenkul ve finansal fon yönetimi konusunda kapsamlı deneyime sahip yatırım lideri.", "en": "Investment leader with extensive experience managing real estate and financial funds to maximize sustainable waqf yield."}'::jsonb
  ),
  (
    'eng-nabil-al-amoudi',
    '{"ar": "م. نبيل بن سعيد العمودي", "tr": "Nabil El-Amoudi", "en": "Eng. Nabil Al-Amoudi"}'::jsonb,
    '{"ar": "م. نبيل العمودي", "tr": "Nabil El-Amoudi", "en": "Eng. Nabil Al-Amoudi"}'::jsonb,
    '/media/428598155_813094137522839_4058888998799586983_n-e7d1a896.jpg',
    'center 20%',
    '{"ar": "خبير التطوير العقاري وإدارة المشروعات، يشرف على الاستثمارات العقارية للوقف.", "tr": "Gayrimenkul geliştirme ve proje yönetimi uzmanı.", "en": "Real estate development and asset management advisor."}'::jsonb,
    '{"ar": "شارك في تطوير محفظة من الأصول العقارية الكبرى والمشروعات الإنشائية، ويركز على اختيار المواقع ذات العوائد التأجيرية المرتفعة والمستقرة.", "tr": "Büyük ölçekli gayrimenkul geliştirme projelerinde yer almış olup yüksek getirili varlıkların seçimine odaklanmaktadır.", "en": "Extensive background in prime real estate assets and commercial development projects for long-term recurring yields."}'::jsonb
  ),
  (
    'dr-adel-al-shamiri',
    '{"ar": "د. عادل بن محمد الشامري", "tr": "Dr. Adil El-Şamiri", "en": "Dr. Adel Al-Shamiri"}'::jsonb,
    '{"ar": "د. عادل الشامري", "tr": "Dr. Adil El-Şamiri", "en": "Dr. Adel Al-Shamiri"}'::jsonb,
    '/media/386595146_723997039765883_6415471862174929403_n-534d65b8.jpg',
    'center 20%',
    '{"ar": "متخصص في الاقتصاد التنموي وهندسة المنتجات الوقفية المبتكرة.", "tr": "Kalkınma ekonomisi ve yenilikçi vakıf ürünleri uzmanı.", "en": "Specialist in development economics and innovative endowment financial instruments."}'::jsonb,
    '{"ar": "أستاذ مشارك ومستشار اقتصادي، صمم نماذج تمويلية تنموية ساهمت في جذب مساهمات وشراكات مؤسسية استراتيجية لصالح مشروعات التعليم والتمكين.", "tr": "Kalkınma odaklı finansal modeller tasarlayan ve kurumsal ortaklıkları güçlendiren ekonomi danışmanı.", "en": "Economics advisor who has structured financing models for educational and youth empowerment waqf projects."}'::jsonb
  ),
  (
    'samir-al-sharaabi',
    '{"ar": "أ. سمير بن حمود الشرعبي", "tr": "Semir El-Şarabi", "en": "Samir Al-Sharaabi"}'::jsonb,
    '{"ar": "أ. سمير الشرعبي", "tr": "Semir El-Şarabi", "en": "Samir Al-Sharaabi"}'::jsonb,
    '/media/359814573_672978951534359_3013855964438853439_n-89e4271b.jpg',
    'center 20%',
    '{"ar": "محلل مالي ومختص في دراسات الجدوى الاقتصادية وتقييم المخاطر الاستثمارية.", "tr": "Finansal analist, fizibilite ve yatırım riskleri değerlendirme sorumlusu.", "en": "Financial analyst and feasibility studies lead for endowment projects."}'::jsonb,
    '{"ar": "يتولى فحص الفرص الاستثمارية المعروضة على هيئة الاستثمار، وإعداد تقارير الجدوى المالية وتتبع مؤشرات الأداء الاستثماري للوقف.", "tr": "Heyete sunulan yatırım fırsatlarını analiz etmekten ve performans raporlarını hazırlamaktan sorumludur.", "en": "Analyzes prospective investment opportunities, conducts feasibility studies, and tracks portfolio KPIs."}'::jsonb
  )
on conflict (slug) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  image = excluded.image,
  image_position = excluded.image_position,
  short_bio = excluded.short_bio,
  full_bio = excluded.full_bio;


-- 2. Link People to their Respective Organizational Sections in public.org_memberships
do $$
declare
  -- Sections
  sec_trustees uuid;
  sec_directors uuid;
  sec_investment uuid;

  -- People IDs
  p_baabbad uuid;
  p_ahdal uuid;
  p_bahwaireth uuid;
  p_binmahfouz uuid;

  p_alkaf uuid;
  p_himyari uuid;
  p_batiss uuid;
  p_othman uuid;
  p_qahtani uuid;

  p_rajhi uuid;
  p_amoudi uuid;
  p_shamiri uuid;
  p_sharaabi uuid;

begin
  select id into sec_trustees from public.org_sections where slug = 'board-of-trustees';
  select id into sec_directors from public.org_sections where slug = 'board-of-directors';
  select id into sec_investment from public.org_sections where slug = 'investment-body';

  -- Trustees
  select id into p_baabbad from public.org_people where slug = 'dr-abdulrahman-baabbad';
  select id into p_ahdal from public.org_people where slug = 'sheikh-abdullah-al-ahdal';
  select id into p_bahwaireth from public.org_people where slug = 'dr-omar-bahwaireth';
  select id into p_binmahfouz from public.org_people where slug = 'eng-khaled-binmahfouz';

  -- Directors
  select id into p_alkaf from public.org_people where slug = 'eng-hassan-alkaf';
  select id into p_himyari from public.org_people where slug = 'dr-fouad-al-himyari';
  select id into p_batiss from public.org_people where slug = 'president';
  select id into p_othman from public.org_people where slug = 'dr-abdulqader-othman';
  select id into p_qahtani from public.org_people where slug = 'nasser-al-qahtani';

  -- Investment
  select id into p_rajhi from public.org_people where slug = 'dr-khaled-al-rajhi';
  select id into p_amoudi from public.org_people where slug = 'eng-nabil-al-amoudi';
  select id into p_shamiri from public.org_people where slug = 'dr-adel-al-shamiri';
  select id into p_sharaabi from public.org_people where slug = 'samir-al-sharaabi';

  -- A. Insert Board of Trustees Memberships
  if sec_trustees is not null then
    insert into public.org_memberships (section_id, person_id, role_title, level, sort_order, is_published)
    values
      (
        sec_trustees,
        p_baabbad,
        '{"ar": "رئيس هيئة المتولين", "tr": "Mütevelli Heyeti Başkanı", "en": "Chairman of the Board of Trustees"}'::jsonb,
        1,
        1,
        true
      ),
      (
        sec_trustees,
        p_ahdal,
        '{"ar": "نائب رئيس هيئة المتولين", "tr": "Mütevelli Heyeti Başkan Vekili", "en": "Vice Chairman of the Board of Trustees"}'::jsonb,
        2,
        2,
        true
      ),
      (
        sec_trustees,
        p_bahwaireth,
        '{"ar": "عضو هيئة المتولين وأمين السر", "tr": "Mütevelli Heyeti Üyesi ve Genel Sekreter", "en": "Trustee Member & Board Secretary"}'::jsonb,
        2,
        3,
        true
      ),
      (
        sec_trustees,
        p_binmahfouz,
        '{"ar": "عضو هيئة المتولين", "tr": "Mütevelli Heyeti Üyesi", "en": "Member of the Board of Trustees"}'::jsonb,
        3,
        4,
        true
      )
    on conflict (section_id, person_id) do update set
      role_title = excluded.role_title,
      level = excluded.level,
      sort_order = excluded.sort_order,
      is_published = excluded.is_published;
  end if;

  -- B. Insert Board of Directors Memberships
  if sec_directors is not null then
    insert into public.org_memberships (section_id, person_id, role_title, level, sort_order, is_published)
    values
      (
        sec_directors,
        p_alkaf,
        '{"ar": "رئيس مجلس الإدارة", "tr": "Yönetim Kurulu Başkanı", "en": "Chairman of the Board of Directors"}'::jsonb,
        1,
        1,
        true
      ),
      (
        sec_directors,
        p_himyari,
        '{"ar": "نائب رئيس مجلس الإدارة", "tr": "Yönetim Kurulu Başkan Yardımcısı", "en": "Vice Chairman of the Board of Directors"}'::jsonb,
        2,
        2,
        true
      ),
      (
        sec_directors,
        p_batiss,
        '{"ar": "عضو مجلس الإدارة ورئيس الوقف", "tr": "Yönetim Kurulu Üyesi ve Vakıf Başkanı", "en": "Board Member & Waqf President"}'::jsonb,
        2,
        3,
        true
      ),
      (
        sec_directors,
        p_othman,
        '{"ar": "عضو مجلس الإدارة والمستشار المالي", "tr": "Yönetim Kurulu Üyesi ve Finans Danışmanı", "en": "Board Member & Financial Advisor"}'::jsonb,
        3,
        4,
        true
      ),
      (
        sec_directors,
        p_qahtani,
        '{"ar": "عضو مجلس الإدارة ومسؤول الامتثال والحوكمة", "tr": "Yönetim Kurulu Üyesi - Uyum ve Yönetişim", "en": "Board Member - Compliance & Governance"}'::jsonb,
        3,
        5,
        true
      )
    on conflict (section_id, person_id) do update set
      role_title = excluded.role_title,
      level = excluded.level,
      sort_order = excluded.sort_order,
      is_published = excluded.is_published;
  end if;

  -- C. Insert Investment Body Memberships
  if sec_investment is not null then
    insert into public.org_memberships (section_id, person_id, role_title, level, sort_order, is_published)
    values
      (
        sec_investment,
        p_rajhi,
        '{"ar": "رئيس هيئة الاستثمار", "tr": "Yatırım Heyeti Başkanı", "en": "Head of Investment Body"}'::jsonb,
        1,
        1,
        true
      ),
      (
        sec_investment,
        p_amoudi,
        '{"ar": "مستشار استثمار الأصول والمحافظ العقارية", "tr": "Gayrimenkul ve Varlık Yatırım Danışmanı", "en": "Real Estate & Asset Investment Advisor"}'::jsonb,
        2,
        2,
        true
      ),
      (
        sec_investment,
        p_shamiri,
        '{"ar": "خبير الصناديق التنموية والتمويل الوقفي", "tr": "Kalkınma Fonları ve Vakıf Finansmanı Uzmanı", "en": "Development Funds & Waqf Financing Expert"}'::jsonb,
        2,
        3,
        true
      ),
      (
        sec_investment,
        p_sharaabi,
        '{"ar": "أمين سر هيئة الاستثمار ومسؤول دراسات الجدوى", "tr": "Yatırım Heyeti Sekreteri ve Fizibilite Sorumlusu", "en": "Investment Secretary & Feasibility Studies Officer"}'::jsonb,
        3,
        4,
        true
      )
    on conflict (section_id, person_id) do update set
      role_title = excluded.role_title,
      level = excluded.level,
      sort_order = excluded.sort_order,
      is_published = excluded.is_published;
  end if;

end $$;

