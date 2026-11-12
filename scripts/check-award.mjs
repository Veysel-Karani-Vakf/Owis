// Owais Volunteer Award — checks that need no network and no database:
//   1. the server's rules (api/_lib/awardRules.ts) match the form's (src/data/award/form.ts);
//   2. what the form sends passes the server, and tampered submissions do not;
//   3. the award's switches: hidden / form closed / deadline at the end of the day, Yemen time;
//   4. award pictures saved in one language reach the others; a hidden award has no menu tab;
//   5. the Excel export holds every application, right-to-left in Arabic;
//   6. every dashboard field of the two award pages maps to a shipped text and
//      every shipped text is editable; saved texts, hidden sections and the
//      menu label reach the site; the organiser's notice keeps its old home.
// Usage: npm run test:award
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { createServer } from 'vite';

const server = await createServer({
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const load = (path) => server.ssrLoadModule(path);
  const rules = await load('/api/_lib/awardRules.ts');
  const form = await load('/src/data/award/form.ts');
  const state = await load('/src/components/award/form/applyState.ts');
  const settings = await load('/src/data/award/settings.ts');
  const routes = await load('/src/data/award/routes.ts');
  const content = await load('/src/data/award/content.ts');
  const store = await load('/src/cms/store.ts');
  const applications = await load('/src/admin/lib/awardApplications.ts');
  const exporter = await load('/src/admin/lib/awardExport.ts');

  /* 1. Rule parity ---------------------------------------------------------- */
  assert.deepEqual(rules.AWARD_WORD_LIMITS, form.awardFormRules.wordLimits, 'word limits');
  assert.deepEqual([...rules.AWARD_IMPACT_IDS], form.impactIds, 'impact question ids');
  assert.deepEqual([...rules.AWARD_CATEGORIES], form.categoryValues, 'categories');
  assert.deepEqual(
    [...rules.AWARD_GOVERNORATES],
    form.yemenGovernorates.map((entry) => entry.code),
    'governorate codes',
  );
  assert.deepEqual(rules.AWARD_PLATFORMS, form.platformIds, 'platform ids');
  assert.deepEqual(rules.AWARD_PLATFORM_DOMAINS, form.platformDomains, 'platform domains');
  assert.equal(rules.AWARD_LIMITS.windowMonths, form.awardFormRules.windowMonths);
  assert.equal(rules.AWARD_LIMITS.minSocialPlatforms, form.awardFormRules.minSocialPlatforms);
  assert.equal(rules.AWARD_LIMITS.maxSocialRows, form.awardFormRules.maxSocialRows);
  assert.equal(rules.AWARD_LIMITS.maxTeamSize, form.awardFormRules.maxTeamSize);
  assert.equal(rules.AWARD_LIMITS.maxTextLength, form.awardFormRules.maxTextLength);
  assert.equal(rules.AWARD_LIMITS.minImages, form.awardFormRules.images.min);
  assert.equal(rules.AWARD_LIMITS.maxImages, form.awardFormRules.images.max);
  assert.equal(rules.AWARD_LIMITS.maxImageBytes, form.awardFormRules.images.maxBytes);
  assert.deepEqual([...rules.AWARD_LIMITS.imageTypes], form.awardFormRules.images.types);
  assert.equal(rules.AWARD_SETTINGS_KEY, settings.AWARD_SETTINGS_KEY);
  assert.equal(rules.AWARD_UTC_OFFSET, settings.AWARD_UTC_OFFSET);

  for (const sample of [
    'عالجنا مشكلة نقص المياه في القرية، ووفّرنا ٣ خزانات بسعة 1,200 لتر.',
    'A well-known, self-funded team — 12 members (2025).',
    '   ',
    'كلمةٌ واحدةٌ',
  ]) {
    assert.equal(rules.countWords(sample), state.countWords(sample), `word count of "${sample}"`);
  }

  /* 2. The form's payload against the server -------------------------------- */
  const now = new Date('2026-11-12T09:00:00Z');
  const values = {
    ...state.initialApplyValues(),
    initiativeName: 'مبادرة سُقيا الخير',
    representative: 'أحمد علي سعيد',
    phoneCountry: 'YE',
    phoneNumber: '777 123 456',
    email: 'team@example.org',
    allYemeni: 'yes',
    teamSize: '١٢',
    governorate: 'YE-TA',
    district: 'المظفر',
    startMonth: '3',
    startYear: '2026',
    endMonth: '9',
    endYear: '2026',
    ongoing: false,
    category: 'other',
    categoryOther: 'المياه والإصحاح',
    social: [
      { id: 'a', platform: 'facebook', name: '', url: 'facebook.com/suqia' },
      { id: 'b', platform: 'other', name: 'الموقع', url: 'https://suqia.example.org/about' },
      { id: 'c', platform: '', name: '', url: '' },
    ],
    answers: {
      idea: 'عالجنا نقص مياه الشرب في ثلاث قرى بحفر بئر وتركيب مضخة تعمل بالطاقة الشمسية.',
      results: 'استفادت 240 أسرة، وانخفض وقت جلب الماء من ساعتين إلى عشر دقائق.',
      team: 'تناوب الفريق على العمل ليلاً، واختيرت القرى الأبعد عن أقرب مصدر ماء.',
      sustainability: 'تدريب لجنة من الأهالي على الصيانة، وقد كررت قرية مجاورة الفكرة.',
    },
    declaration: true,
  };
  const formContent = form.getAwardFormContent('ar');
  for (const step of form.applySteps) {
    assert.deepEqual(state.validateStep(step, values, formContent, { now, imageCount: 1 }), [], `form step "${step}" is valid`);
  }
  assert.deepEqual(
    state.validateStep('review', values, formContent, { now, imageCount: 0 }).map((error) => error.key),
    ['images'],
    'the last step asks for at least one photo',
  );
  assert.equal(formContent.fields.period.label, 'فترة تنفيذ المبادرة');

  const upload = 'award/3f2b8c1e-5a47-4d0e-9b1a-6c2d7e8f9a0b';
  const payload = {
    ...state.buildApplicationPayload(values, []),
    images: [{ path: `${upload}/1-0a1b2c3d.jpg`, name: 'صورة البئر.jpg', type: 'image/jpeg', size: 204800 }],
    locale: 'ar',
    sourceUrl: 'https://example.org/volunteer-award/apply',
    website: '',
  };
  const accepted = rules.validateAwardApplication(payload, now);
  assert.equal(accepted.ok, true, `the form's payload is accepted: ${JSON.stringify(accepted.fields ?? [])}`);
  assert.equal(accepted.value.whatsapp, '+967777123456');
  assert.equal(accepted.value.teamSize, 12);
  assert.equal(accepted.value.periodEnd, '2026-09');
  assert.equal(accepted.value.socialLinks[0].url, 'https://facebook.com/suqia');
  assert.equal(accepted.value.socialLinks[1].name, 'الموقع');

  const row = rules.toAwardRow(accepted.value, 'hash');
  assert.equal(row.reference_no, undefined, 'the reference is assigned by the database, never by the request');
  assert.equal(row.status, undefined, 'the status always starts from the column default');
  assert.equal(row.answer_team, values.answers.team);

  const rejects = (label, change, field) => {
    const tampered = JSON.parse(JSON.stringify(payload));
    change(tampered);
    const result = rules.validateAwardApplication(tampered, now);
    assert.equal(result.ok, false, `${label} must be refused`);
    assert.ok(result.fields.includes(field), `${label}: expected "${field}" in ${JSON.stringify(result.fields)}`);
  };
  rejects('a non-Yemeni team', (p) => (p.allMembersYemeni = false), 'allMembersYemeni');
  rejects('an unchecked declaration', (p) => (p.declarationAccepted = false), 'declarationAccepted');
  rejects('a filled honeypot', (p) => (p.website = 'http://spam.example'), 'website');
  rejects('an answer over its word limit', (p) => (p.answers.idea = 'كلمة '.repeat(51)), 'answers.idea');
  rejects('an empty answer', (p) => (p.answers.team = '  '), 'answers.team');
  rejects('an activity that ended 14 months ago', (p) => (p.period = { start: '2025-01', end: '2025-09', ongoing: false }), 'period');
  rejects('an end before the start', (p) => (p.period.end = '2026-01'), 'period');
  rejects('a future start', (p) => (p.period = { start: '2027-03', end: null, ongoing: true }), 'period');
  rejects('an unknown governorate', (p) => (p.governorate = 'YE-XX'), 'governorate');
  rejects('one social platform only', (p) => p.socialLinks.pop(), 'socialLinks');
  rejects('the same platform twice', (p) => (p.socialLinks[1] = { ...p.socialLinks[0] }), 'socialLinks');
  rejects('a link on the wrong site', (p) => (p.socialLinks[0].url = 'https://example.com/suqia'), 'socialLinks');
  rejects('a javascript: link', (p) => (p.socialLinks[1].url = 'javascript:alert(1)'), 'socialLinks');
  rejects('a bad email', (p) => (p.email = 'team@example'), 'email');
  rejects('a bad phone', (p) => (p.whatsapp = '777123456'), 'whatsapp');
  rejects('a team of zero', (p) => (p.teamSize = 0), 'teamSize');
  rejects('"other" with no field named', (p) => (p.categoryOther = ''), 'categoryOther');
  rejects('no photo at all', (p) => (p.images = []), 'images');
  rejects('a missing photo list', (p) => delete p.images, 'images');
  rejects('a photo outside the upload folder', (p) => (p.images[0].path = 'volunteer/cv.pdf'), 'images');
  rejects('a photo in someone else’s folder', (p) =>
    p.images.push({ ...p.images[0], path: 'award/00000000-0000-4000-8000-000000000000/2-aaaaaaaa.jpg' }),
    'images',
  );
  rejects('six photos', (p) => {
    p.images = Array.from({ length: 6 }, (_, i) => ({ ...p.images[0], path: `${upload}/${i + 1}-0a1b2c3d.jpg` }));
  }, 'images');
  rejects('an oversized photo', (p) => (p.images[0].size = 3 * 1024 * 1024 + 1), 'images');

  const ongoing = JSON.parse(JSON.stringify(payload));
  ongoing.period = { start: '2024-02', end: null, ongoing: true };
  assert.equal(rules.validateAwardApplication(ongoing, now).ok, true, 'a long-running, still ongoing activity is accepted');

  /* 3. Application window --------------------------------------------------- */
  for (const api of [rules, settings]) {
    assert.deepEqual(api.parseAwardSettings(null), { visible: true, accepting: true, deadline: null }, 'no row = visible and open');
    assert.deepEqual(api.parseAwardSettings({ accepting: false, deadline: '2026-13-40' }), { visible: true, accepting: false, deadline: null });
    assert.equal(api.parseAwardSettings({ visible: false }).visible, false);
    const withDeadline = api.parseAwardSettings({ accepting: true, deadline: '2026-11-30' });
    // 23:59 on the 30th in Yemen is 20:59 UTC; one minute past midnight there is 21:01 UTC.
    assert.equal(api.awardWindow(withDeadline, new Date('2026-11-30T20:59:00Z')).open, true);
    assert.deepEqual(api.awardWindow(withDeadline, new Date('2026-11-30T21:01:00Z')), { open: false, reason: 'deadline' });
    assert.deepEqual(api.awardWindow({ visible: true, accepting: false, deadline: null }), { open: false, reason: 'paused' });
    // A hidden award accepts nothing, whatever the form's own switch says.
    assert.deepEqual(api.awardWindow({ visible: false, accepting: true, deadline: null }), { open: false, reason: 'hidden' });
  }
  assert.match(settings.formatAwardDeadline('2026-11-30', 'en'), /30 November 2026/);

  /* 4. Pictures and the notice from the dashboard --------------------------- */
  const builtIn = content.defaultAwardMedia;
  store.setPublished({ tables: {}, pages: {} });
  for (const locale of ['ar', 'tr', 'en']) {
    assert.deepEqual(content.getAwardContent(locale).media, builtIn, `${locale}: built-in pictures by default`);
    assert.equal(form.getAwardFormContent(locale).declaration.noticeApproved, false, 'the notice starts as a draft');
  }

  const custom = 'https://cdn.example.org/media/images/trophy-2026.png';
  store.setPublished({
    tables: {},
    pages: {
      'award-page': {
        ar: {
          media: { ...builtIn, trophy: custom, about: '' },
          hero: { imageAlt: 'مجسّم جديد' },
          declaration: { noticeText: 'النص الرسمي للإشعار.', noticeApproved: true },
        },
        // English was saved before the change and still holds the built-in paths.
        en: { media: { ...builtIn } },
      },
      'award-settings': { accepting: true, deadline: '2026-11-30' },
    },
  });
  for (const locale of ['ar', 'tr', 'en']) {
    const media = content.getAwardContent(locale).media;
    assert.equal(media.trophy, custom, `${locale}: the trophy changed in Arabic is used`);
    assert.equal(media.about, builtIn.about, `${locale}: a blank picture falls back to the built-in one`);
    assert.equal(media.share, builtIn.share);
  }
  assert.equal(content.getAwardContent('ar').hero.imageAlt, 'مجسّم جديد');
  assert.notEqual(content.getAwardContent('en').hero.imageAlt, 'مجسّم جديد', 'texts never leak across languages');
  assert.deepEqual(content.awardImageAttrs('trophy', custom), {}, 'no built-in dimensions on an uploaded picture');
  assert.ok(content.awardImageAttrs('about', builtIn.about).srcSet, 'the built-in photo keeps its responsive variants');
  assert.equal(form.getAwardFormContent('ar').declaration.noticeText, 'النص الرسمي للإشعار.');
  assert.equal(form.getAwardFormContent('ar').declaration.noticeApproved, true);
  assert.equal(form.getAwardFormContent('tr').declaration.noticeApproved, false, 'approval is per language');
  assert.deepEqual(settings.getAwardSettings(), { visible: true, accepting: true, deadline: '2026-11-30' });

  // The menu tab follows the dashboard's visibility switch.
  const nav = [
    { label: 'الأخبار', href: '/news' },
    { label: 'شاركنا', href: '/participate/share-ideas' },
  ];
  const hrefs = (links) => links.map((link) => link.href);
  assert.deepEqual(hrefs(routes.withAwardNavLink(nav, 'ar')), ['/news', '/volunteer-award', '/participate/share-ideas']);
  store.setPublished({ tables: {}, pages: { 'award-settings': { visible: false } } });
  assert.deepEqual(hrefs(routes.withAwardNavLink(nav, 'ar')), ['/news', '/participate/share-ideas'], 'hidden: no tab');
  assert.deepEqual(
    hrefs(routes.withAwardNavLink([...nav, { label: 'الجائزة', href: '/volunteer-award' }], 'ar')),
    ['/news', '/participate/share-ideas'],
    'hidden: a tab added by hand in the dashboard is dropped too',
  );
  assert.equal(settings.awardWindow(settings.getAwardSettings()).reason, 'hidden');

  store.setPublished({
    tables: {},
    pages: { 'award-page': { ar: { media: { ...builtIn, trophy: custom } }, tr: { media: { ...builtIn, trophy: '/own.png' } } } },
  });
  assert.equal(content.getAwardContent('tr').media.trophy, '/own.png', 'a language keeps the picture it chose itself');
  store.setPublished({ tables: {}, pages: {} });

  /* 5. Excel export --------------------------------------------------------- */
  const stored = (index, extra = {}) => ({
    id: `id-${index}`,
    reference_no: `OWA-2026-000${index}`,
    edition: 2026,
    locale: 'ar',
    initiative_name: accepted.value.initiativeName,
    representative: accepted.value.representative,
    whatsapp: accepted.value.whatsapp,
    email: accepted.value.email,
    all_members_yemeni: true,
    team_size: 12,
    governorate: 'YE-TA',
    district: 'المظفر',
    period_start: '2026-03',
    period_end: '2026-09',
    ongoing: false,
    category: 'other',
    category_other: 'المياه والإصحاح',
    social_links: accepted.value.socialLinks,
    answer_idea: '=SUM(1,2) ' + values.answers.idea,
    answer_results: values.answers.results,
    answer_team: values.answers.team,
    answer_sustainability: values.answers.sustainability,
    images: accepted.value.images,
    declaration_accepted: true,
    status: 'new',
    admin_notes: '',
    source_url: null,
    created_at: '2026-11-12T21:30:00Z',
    updated_at: '2026-11-12T21:30:00Z',
    ...extra,
  });
  const rows = [
    stored(1),
    stored(2, { email: 'TEAM@example.org', whatsapp: '+967711000000', status: 'shortlisted', ongoing: true, period_end: null }),
    stored(3, { email: 'other@example.org', whatsapp: '+967733000000', category: 'health', category_other: null, locale: 'en' }),
  ];
  const duplicates = applications.findDuplicates(rows);
  assert.deepEqual(duplicates.get('id-1'), ['OWA-2026-0002'], 'same email in another case is a duplicate');
  assert.equal(duplicates.has('id-3'), false);

  const written = await exporter.buildAwardWorkbook(ExcelJS, rows, 'ar', duplicates).xlsx.writeBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(written);
  const sheet = workbook.worksheets[0];
  assert.equal(sheet.views[0].rightToLeft, true, 'the Arabic sheet reads right to left');
  assert.equal(sheet.views[0].state, 'frozen', 'the header row stays in view');
  assert.equal(sheet.rowCount, rows.length + 1, 'one row per application under the header');

  const headers = sheet.getRow(1).values.slice(1);
  const columnOf = (key) => exporter.awardExportColumns('ar').findIndex((column) => column.key === key) + 1;
  assert.equal(headers.length, exporter.awardExportColumns('ar').length);
  assert.equal(headers[0], 'رقم الطلب');
  const first = sheet.getRow(2);
  assert.equal(first.getCell(columnOf('reference')).value, 'OWA-2026-0001');
  assert.equal(first.getCell(columnOf('whatsapp')).value, '+967777123456', 'the phone number stays text, plus sign included');
  assert.equal(first.getCell(columnOf('team')).value, 12);
  assert.equal(first.getCell(columnOf('governorate')).value, 'تعز');
  assert.equal(first.getCell(columnOf('category')).value, 'المياه والإصحاح');
  assert.equal(first.getCell(columnOf('duplicate')).value, 'OWA-2026-0002');
  assert.equal(first.getCell(columnOf('images')).value, 1);
  assert.match(String(first.getCell(columnOf('social')).value), /فيسبوك: https:\/\/facebook\.com\/suqia\n/);
  const idea = first.getCell(columnOf('answer-idea'));
  assert.equal(typeof idea.value, 'string', 'an answer starting with "=" is stored as text, never as a formula');
  assert.ok(String(idea.value).startsWith('=SUM(1,2)'));
  // 21:30 UTC on the 12th is 00:30 on the 13th in Yemen.
  assert.equal(first.getCell(columnOf('submitted')).value.toISOString(), '2026-11-13T00:30:00.000Z');
  assert.equal(sheet.getRow(3).getCell(columnOf('status')).value, 'مقبول مبدئياً');
  assert.equal(sheet.getRow(3).getCell(columnOf('end')).value, 'مستمر حتى الآن');
  assert.equal(sheet.getRow(4).getCell(columnOf('category')).value, 'الصحة');
  assert.equal(sheet.getRow(4).getCell(columnOf('language')).value, 'English');

  const english = new ExcelJS.Workbook();
  await english.xlsx.load(await exporter.buildAwardWorkbook(ExcelJS, rows, 'en', duplicates).xlsx.writeBuffer());
  assert.notEqual(english.worksheets[0].views[0].rightToLeft, true, 'the English sheet reads left to right');
  assert.equal(english.worksheets[0].getRow(2).getCell(columnOf('governorate')).value, "Ta'izz");

  /* 6. Every text from the dashboard ---------------------------------------- */
  const schema = await load('/src/admin/lib/pageSchema.ts');
  const paths = await load('/src/admin/lib/paths.ts');
  const defaults = await load('/src/admin/lib/pageDefaults.ts');
  const icons = await load('/src/components/award/awardIcons.ts');
  const locales = ['ar', 'tr', 'en'];

  // A schema path with no shipped value would open as an empty field and save
  // junk; only the hide switches, the FAQ draft flags and the optional question
  // notes may be unset.
  const optional = [/\.hidden$/, /^draft$/, /^fields\.impact\.\w+\.note$/];
  const checkFields = (pageKey, fields, value, prefix = '') => {
    for (const field of fields) {
      const path = `${prefix}${field.path}`;
      const current = paths.getAtPath(value, field.path);
      if (field.type === 'repeater') {
        assert.ok(Array.isArray(current) && current.length > 0, `${pageKey}: ${path} is a shipped list`);
        for (const item of current) checkFields(pageKey, field.itemFields, item, `${path}[].`);
      } else if (!optional.some((pattern) => pattern.test(field.path))) {
        assert.notEqual(current, undefined, `${pageKey}: ${path} has a shipped value`);
      }
    }
  };
  const editable = new Set();
  for (const pageKey of ['award-page', 'award-form']) {
    const definition = schema.getPageDef(pageKey);
    assert.ok(definition, `${pageKey} is a dashboard page`);
    for (const locale of locales) {
      for (const section of definition.sections) {
        checkFields(pageKey, section.fields, defaults.buildPageValue(pageKey, locale, 'static'));
      }
    }
    for (const section of definition.sections) for (const field of section.fields) editable.add(`${pageKey}:${field.path}`);
  }
  // ... and nothing of the shipped copy is left out of the dashboard.
  const leaves = (value, prefix = '') =>
    Object.entries(value).flatMap(([key, entry]) =>
      entry && typeof entry === 'object' && !Array.isArray(entry) ? leaves(entry, `${prefix}${key}.`) : [`${prefix}${key}`],
    );
  for (const [pageKey, shipped] of [
    ['award-page', content.staticAwardContent('ar')],
    ['award-form', form.staticAwardFormContent('ar')],
  ]) {
    for (const path of leaves(shipped)) assert.ok(editable.has(`${pageKey}:${path}`), `${pageKey}: "${path}" is editable in the dashboard`);
  }

  store.setPublished({
    tables: {},
    pages: {
      'award-page': {
        ar: {
          navLabel: 'الجائزة',
          hero: {
            titleLines: ['جائزة', 'أويس', '2026'],
            quickLinks: [
              { target: 'about', title: 'عن', description: '' },
              { target: 'faq', title: 'أسئلة', description: '' },
            ],
          },
          about: { hidden: true },
          categories: {
            items: [
              { id: 'education', title: 'أ', description: '' },
              { id: 'water', title: 'ب', description: '' },
            ],
          },
          faq: { items: [{ question: 'س؟', answer: 'ج.' }] },
          cta: { hidden: true },
        },
      },
      'award-form': {
        ar: { common: { next: 'استمرار' }, declaration: { noticeText: 'نص الاستمارة.', noticeApproved: true } },
      },
    },
  });
  const edited = content.getAwardContent('ar');
  assert.deepEqual(edited.hero.titleLines, ['جائزة', 'أويس', '2026'], 'the title lines come from the dashboard');
  assert.equal(edited.categories.items.length, 2, 'a list saved in the dashboard replaces the built-in one');
  assert.deepEqual(edited.faq.items, [{ question: 'س؟', answer: 'ج.' }], 'a question needs no id');
  assert.equal(edited.hero.eyebrow, 'تعود من جديد', 'untouched texts keep the shipped copy');
  assert.equal(content.awardSectionHidden(edited, 'about'), true);
  assert.equal(content.awardSectionHidden(edited, 'cta'), true);
  assert.equal(content.awardSectionHidden(edited, 'steps'), false);
  assert.equal(content.awardSectionHidden(content.getAwardContent('en'), 'about'), false, 'hiding is per language');
  assert.equal(routes.withAwardNavLink(nav, 'ar')[1].label, 'الجائزة', 'the menu tab takes its label from the dashboard');
  assert.equal(routes.withAwardNavLink(nav, 'en')[1].label, 'Owais Award');
  assert.equal(icons.categoryIcon('education'), icons.categoryIcons.education);
  assert.ok(icons.categoryIcon('water'), 'an icon id the site does not know still gets an icon');
  assert.equal(icons.categoryIcon('water'), icons.categoryIcon(''), 'the same neutral icon for every unknown id');
  assert.equal(form.getAwardFormContent('ar').common.next, 'استمرار');
  assert.equal(form.getAwardFormContent('ar').common.previous, 'السابق');
  assert.equal(form.getAwardFormContent('ar').declaration.noticeText, 'نص الاستمارة.');
  assert.equal(form.getAwardFormContent('ar').declaration.noticeApproved, true);

  // The notice saved in award-page before the form had its own row still
  // applies — and opens in the form editor — until the form row carries one.
  const legacyNotice = { declaration: { noticeText: 'النص القديم.', noticeApproved: true } };
  store.setPublished({ tables: {}, pages: { 'award-page': { ar: legacyNotice }, 'award-form': { ar: { common: { next: 'استمرار' } } } } });
  assert.equal(form.getAwardFormContent('ar').declaration.noticeText, 'النص القديم.');
  assert.equal(form.getAwardFormContent('ar').declaration.noticeApproved, true);
  assert.equal(paths.getAtPath(defaults.buildPageValue('award-form', 'ar'), 'declaration.noticeText'), 'النص القديم.');
  assert.equal(form.getAwardFormContent('tr').declaration.noticeApproved, false, 'the old notice is per language too');
  store.setPublished({
    tables: {},
    pages: { 'award-page': { ar: legacyNotice }, 'award-form': { ar: { declaration: { noticeText: 'النص الجديد.', noticeApproved: false } } } },
  });
  assert.equal(form.getAwardFormContent('ar').declaration.noticeText, 'النص الجديد.', 'the form row wins once it holds a notice');
  assert.equal(form.getAwardFormContent('ar').declaration.noticeApproved, false);
  store.setPublished({ tables: {}, pages: {} });

  console.log('Owais Award checks passed: rules parity, validation, switches, shared pictures, menu tab, Excel export, dashboard texts.');
} finally {
  await server.close();
}
