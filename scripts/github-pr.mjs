// Pull-request helper for this repository (the GitHub CLI is not installed here).
//
//   node scripts/github-pr.mjs status 4 5     # state and mergeability of PRs #4 and #5
//   node scripts/github-pr.mjs merge 4 5      # merge them into their base, in that order
//
// Talks to api.github.com with the token Git Credential Manager already holds
// for github.com (`git credential fill`); the token is never printed. A merge
// creates a merge commit, like the "Merge pull request" button, and stops at
// the first PR that is not mergeable.
import { execSync } from 'node:child_process';

const REPO = 'Veysel-Karani-Vakf/Owis';
const [, , command, ...rest] = process.argv;
const numbers = rest.map(Number).filter((n) => Number.isInteger(n) && n > 0);

if (!['status', 'merge'].includes(command) || numbers.length === 0) {
  console.error('Usage: node scripts/github-pr.mjs <status|merge> <pr number> [more numbers]');
  process.exit(2);
}

const credential = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8' });
const token = credential.split('\n').find((line) => line.startsWith('password='))?.slice('password='.length);
if (!token) {
  console.error('No GitHub token available from git credential fill.');
  process.exit(1);
}

async function api(method, path, body) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => ({}));
  return { status: response.status, json };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The PR, waiting while GitHub recomputes mergeability after its base moved. */
async function pullRequest(number) {
  let pr = (await api('GET', `/repos/${REPO}/pulls/${number}`)).json;
  for (let attempt = 0; attempt < 10 && pr.state === 'open' && pr.mergeable === null; attempt += 1) {
    await sleep(2000);
    pr = (await api('GET', `/repos/${REPO}/pulls/${number}`)).json;
  }
  return pr;
}

for (const number of numbers) {
  const pr = await pullRequest(number);
  if (!pr.number) {
    console.error(`PR #${number}: ${pr.message ?? 'not found'}`);
    process.exit(1);
  }
  console.log(
    `PR #${number} "${pr.title}" (${pr.head.ref} -> ${pr.base.ref}): ${pr.merged ? 'merged' : pr.state}` +
      (pr.merged ? '' : `, mergeable=${pr.mergeable} (${pr.mergeable_state})`),
  );
  if (command !== 'merge' || pr.merged) continue;
  if (pr.mergeable !== true) {
    console.error(`PR #${number} cannot be merged as it stands; stopping.`);
    process.exit(1);
  }
  const result = await api('PUT', `/repos/${REPO}/pulls/${number}/merge`, {
    merge_method: 'merge',
    commit_title: `Merge pull request #${number} from ${REPO.split('/')[0]}/${pr.head.ref}`,
    commit_message: pr.title,
  });
  console.log(`PR #${number} merge: ${result.status} ${result.json.message ?? ''} ${result.json.sha ?? ''}`.trim());
  if (result.status !== 200) process.exit(1);
  await sleep(3000);
}
