// Creates or repairs the Supabase Auth admin account and allow-list row.
// Required in .env.local or process env:
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   ADMIN_PASSWORD
// Optional:
//   ADMIN_EMAIL defaults to vktysv@gmail.com
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const env = readEnvLocal();

const cmd = process.argv[2];
const supabaseUrl = readValue('VITE_SUPABASE_URL');
const serviceRoleKey = readValue('SUPABASE_SERVICE_ROLE_KEY');
const adminEmail = readValue('ADMIN_EMAIL') || 'vktysv@gmail.com';
const adminPassword = readValue('ADMIN_PASSWORD');
const anonKey = readValue('VITE_SUPABASE_ANON_KEY');
let supabase;

if (!cmd || !['bootstrap', 'check', 'login-check', 'resend-confirmation'].includes(cmd)) {
  console.log(
    'Usage: npm run admin:bootstrap | npm run admin:check | node scripts/admin.mjs login-check | node scripts/admin.mjs resend-confirmation',
  );
  process.exit(1);
}

if (cmd === 'login-check') {
  await checkLogin();
} else if (cmd === 'resend-confirmation') {
  await resendConfirmation();
} else {
  if (!supabaseUrl || !serviceRoleKey) {
    const missing = [
      !supabaseUrl && 'VITE_SUPABASE_URL',
      !serviceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean);
    console.error(`Missing ${missing.join(', ')} in .env.local.`);
    process.exit(1);
  }

  supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  if (cmd === 'bootstrap') {
    if (!adminPassword || adminPassword.length < 8) {
      console.error('Missing ADMIN_PASSWORD in .env.local, or it is shorter than 8 characters.');
      process.exit(1);
    }

    await bootstrapAdmin();
  } else {
    await checkAdmin();
  }
}

function readEnvLocal() {
  try {
    const text = readFileSync(join(root, '.env.local'), 'utf8');
    return Object.fromEntries(
      text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const index = line.indexOf('=');
          const key = line.slice(0, index).trim();
          const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
          return [key, value];
        }),
    );
  } catch {
    return {};
  }
}

function readValue(key) {
  return process.env[key] || env[key] || '';
}

async function findUserByEmail(email) {
  const normalized = email.toLowerCase();
  let page = 1;

  while (page < 100) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;

    const user = data.users.find((item) => item.email?.toLowerCase() === normalized);
    if (user) return user;
    if (data.users.length < 100) return null;
    page += 1;
  }

  throw new Error('Too many auth users to scan. Narrow the script before continuing.');
}

async function upsertAdminUser(user) {
  const { error } = await supabase.from('admin_users').upsert(
    {
      user_id: user.id,
      email: user.email,
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    if (error.code === 'PGRST205') {
      console.log('Admin allow-list table is missing; using auth app_metadata role instead.');
      return;
    }

    throw error;
  }
}

async function bootstrapAdmin() {
  let user = await findUserByEmail(adminEmail);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Created auth user: ${adminEmail}`);
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: adminPassword,
      email_confirm: true,
      app_metadata: { ...(user.app_metadata ?? {}), role: 'admin' },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Updated auth user password and confirmation: ${adminEmail}`);
  }

  await upsertAdminUser(user);
  console.log(`Admin allow-list is ready: ${adminEmail}`);
  console.log('You can now sign in at /admin/login with ADMIN_EMAIL and ADMIN_PASSWORD.');
}

async function checkAdmin() {
  const user = await findUserByEmail(adminEmail);
  if (!user) {
    console.log(`Auth user not found: ${adminEmail}`);
    return;
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id,email')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST205') {
      console.log(`Auth user exists: ${adminEmail}`);
      console.log(`Email confirmed: ${Boolean(user.email_confirmed_at)}`);
      console.log('Admin allow-list table: missing');
      console.log(`Admin metadata role: ${user.app_metadata?.role === 'admin' ? 'yes' : 'no'}`);
      return;
    }

    throw error;
  }

  console.log(`Auth user exists: ${adminEmail}`);
  console.log(`Email confirmed: ${Boolean(user.email_confirmed_at)}`);
  console.log(`Admin metadata role: ${user.app_metadata?.role === 'admin' ? 'yes' : 'no'}`);
  console.log(`Admin allow-list row: ${data ? 'yes' : 'no'}`);
}

async function checkLogin() {
  if (!supabaseUrl || !anonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local.');
    process.exit(1);
  }

  if (!adminEmail || !adminPassword) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env.local.');
    process.exit(1);
  }

  const publicClient = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await publicClient.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (error) {
    console.log(`Login failed: ${error.message}`);
    return;
  }

  const { data: adminRow, error: adminError } = await publicClient
    .from('admin_users')
    .select('user_id,email')
    .eq('user_id', data.user.id)
    .maybeSingle();

  await publicClient.auth.signOut();

  const hasAdminMetadata = data.user.app_metadata?.role === 'admin';

  if (adminError) {
    console.log(`Login works, but admin table check failed: ${adminError.message}`);
    console.log(`Admin metadata role: ${hasAdminMetadata ? 'yes' : 'no'}`);
    return;
  }

  console.log(`Login works: ${adminEmail}`);
  console.log(`Admin metadata role: ${hasAdminMetadata ? 'yes' : 'no'}`);
  console.log(`Admin allow-list row: ${adminRow ? 'yes' : 'no'}`);
}

async function resendConfirmation() {
  if (!supabaseUrl || !anonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local.');
    process.exit(1);
  }

  if (!adminEmail) {
    console.error('Missing ADMIN_EMAIL in .env.local.');
    process.exit(1);
  }

  const publicClient = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await publicClient.auth.resend({
    type: 'signup',
    email: adminEmail,
  });

  if (error) {
    console.log(`Confirmation resend failed: ${error.message}`);
    return;
  }

  console.log(`Confirmation email requested: ${adminEmail}`);
}
