import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { createServer } from 'vite';

const { Client } = pg;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readEnv(name) {
  if (process.env[name]) return process.env[name];
  const path = join(root, '.env.local');
  if (!existsSync(path)) return null;
  const match = readFileSync(path, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)\\s*$`, 'm'));
  return match?.[1]?.replace(/^["']|["']$/g, '') ?? null;
}

const connectionString = readEnv('SUPABASE_DB_URL');
if (!connectionString) {
  console.error('Missing SUPABASE_DB_URL in .env.local or environment');
  process.exit(1);
}

const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

let arPioneers = [];
let trPioneers = [];
let enPioneers = [];

try {
  const { getPioneersContent } = await server.ssrLoadModule('/src/data/pioneers.ts');
  arPioneers = getPioneersContent('ar').pioneers;
  trPioneers = getPioneersContent('tr').pioneers;
  enPioneers = getPioneersContent('en').pioneers;
} finally {
  await server.close();
}

console.log(`Loaded ${arPioneers.length} pioneers from static source files.`);

const trMap = new Map(trPioneers.map((p) => [p.slug, p]));
const enMap = new Map(enPioneers.map((p) => [p.slug, p]));

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  await client.query('BEGIN');

  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < arPioneers.length; i++) {
    const arP = arPioneers[i];
    const trP = trMap.get(arP.slug) || arP;
    const enP = enMap.get(arP.slug) || arP;

    const row = {
      slug: arP.slug,
      cohort_id: arP.cohortId || 'cohort-1',
      name: JSON.stringify({ ar: arP.name || '', tr: trP.name || '', en: enP.name || '' }),
      short_name: JSON.stringify({ ar: arP.shortName || '', tr: trP.shortName || '', en: enP.shortName || '' }),
      role: JSON.stringify({ ar: arP.role || '', tr: trP.role || '', en: enP.role || '' }),
      image: arP.image || null,
      image_position: arP.imagePosition || 'center 20%',
      origin: JSON.stringify({ ar: arP.origin || '', tr: trP.origin || '', en: enP.origin || '' }),
      city: JSON.stringify({ ar: arP.city || '', tr: trP.city || '', en: enP.city || '' }),
      university: JSON.stringify({ ar: arP.university || '', tr: trP.university || '', en: enP.university || '' }),
      degree: JSON.stringify({ ar: arP.degree || '', tr: trP.degree || '', en: enP.degree || '' }),
      major: JSON.stringify({ ar: arP.major || '', tr: trP.major || '', en: enP.major || '' }),
      short_intro: JSON.stringify({ ar: arP.shortIntro || '', tr: trP.shortIntro || '', en: enP.shortIntro || '' }),
      full_bio: JSON.stringify({ ar: arP.fullBio || [], tr: trP.fullBio || [], en: enP.fullBio || [] }),
      education: JSON.stringify({ ar: arP.education || [], tr: trP.education || [], en: enP.education || [] }),
      career: JSON.stringify({ ar: arP.career || [], tr: trP.career || [], en: enP.career || [] }),
      achievements: JSON.stringify({ ar: arP.achievements || [], tr: trP.achievements || [], en: enP.achievements || [] }),
      program_contribution: JSON.stringify({ ar: arP.programContribution || [], tr: trP.programContribution || [], en: enP.programContribution || [] }),
      sort_order: typeof arP.order === 'number' ? arP.order : i + 1,
      is_published: arP.isPublished ?? true,
    };

    const query = `
      INSERT INTO public.pioneers (
        slug, cohort_id, name, short_name, role, image, image_position,
        origin, city, university, degree, major, short_intro,
        full_bio, education, career, achievements, program_contribution,
        sort_order, is_published
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18,
        $19, $20
      )
      ON CONFLICT (slug) DO UPDATE SET
        cohort_id = EXCLUDED.cohort_id,
        name = EXCLUDED.name,
        short_name = EXCLUDED.short_name,
        role = EXCLUDED.role,
        image = EXCLUDED.image,
        image_position = EXCLUDED.image_position,
        origin = EXCLUDED.origin,
        city = EXCLUDED.city,
        university = EXCLUDED.university,
        degree = EXCLUDED.degree,
        major = EXCLUDED.major,
        short_intro = EXCLUDED.short_intro,
        full_bio = EXCLUDED.full_bio,
        education = EXCLUDED.education,
        career = EXCLUDED.career,
        achievements = EXCLUDED.achievements,
        program_contribution = EXCLUDED.program_contribution,
        sort_order = EXCLUDED.sort_order,
        is_published = EXCLUDED.is_published,
        updated_at = now();
    `;

    const values = [
      row.slug, row.cohort_id, row.name, row.short_name, row.role, row.image, row.image_position,
      row.origin, row.city, row.university, row.degree, row.major, row.short_intro,
      row.full_bio, row.education, row.career, row.achievements, row.program_contribution,
      row.sort_order, row.is_published,
    ];

    await client.query(query, values);
    inserted++;
  }

  await client.query("NOTIFY pgrst, 'reload schema';");
  await client.query('COMMIT');

  console.log(`Successfully seeded ${inserted} pioneers into public.pioneers!`);

  const countRes = await client.query('SELECT count(*)::int as total FROM public.pioneers;');
  console.log(`Current total rows in public.pioneers: ${countRes.rows[0].total}`);
} catch (err) {
  await client.query('ROLLBACK');
  console.error('Error during seeding:', err);
  process.exit(1);
} finally {
  await client.end();
}

