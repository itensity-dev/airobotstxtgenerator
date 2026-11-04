/**
 * Weekly sync with ai.robots.txt. Writes data/community-bots.json and prints a Markdown
 * summary (used as the pull request body). Exit codes: 0 = done (changes or not),
 * 2 = upstream format changed (the workflow opens an issue instead of a PR).
 */
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  AI_ROBOTS_TXT_URL,
  UpstreamFormatError,
  buildCommunityList,
  diffCommunity,
  parseUpstream,
} from '../src/sync.js';
import type { BotRegistry, CommunityBotList } from '../src/types.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = join(root, 'src', 'data', 'bots.json');
const communityPath = join(root, 'src', 'data', 'community-bots.json');

async function main() {
  const date = process.env.SYNC_DATE ?? new Date().toISOString().slice(0, 10);
  const source = process.env.AI_ROBOTS_TXT_FILE
    ? await readFile(process.env.AI_ROBOTS_TXT_FILE, 'utf8')
    : await (
        await fetch(AI_ROBOTS_TXT_URL, {
          headers: {
            'user-agent': 'airobotstxtgenerator-sync (+https://airobotstxtgenerator.com/about)',
          },
        })
      ).text();
  let commit: string | undefined;
  try {
    const r = await fetch(
      'https://api.github.com/repos/ai-robots-txt/ai.robots.txt/commits?path=robots.json&per_page=1',
      {
        headers: { accept: 'application/vnd.github+json' },
      },
    );
    if (r.ok) commit = ((await r.json()) as { sha: string }[])[0]?.sha;
  } catch {
    /* commit id is optional */
  }
  const registry = JSON.parse(await readFile(registryPath, 'utf8')) as BotRegistry;
  let before: CommunityBotList | null;
  try {
    before = JSON.parse(await readFile(communityPath, 'utf8')) as CommunityBotList;
  } catch {
    before = null;
  }
  let upstream;
  try {
    upstream = parseUpstream(JSON.parse(source));
  } catch (e) {
    if (e instanceof UpstreamFormatError || e instanceof SyntaxError) {
      console.error(e.message);
      process.exitCode = 2;
      return;
    }
    throw e;
  }
  const after = buildCommunityList(upstream, registry.bots, date, commit);
  const diff = diffCommunity(before, after);
  const changed = diff.added.length + diff.removed.length + diff.changed.length > 0;
  // Keep the previous date when nothing changed, so the file stays byte-identical.
  if (!changed && before) after.updated = before.updated;
  if (!changed && before)
    for (const b of after.bots)
      b.lastVerified = before.bots.find((x) => x.name === b.name)?.lastVerified ?? b.lastVerified;
  await writeFile(communityPath, JSON.stringify(after, null, 2) + '\n');
  const missingCurated = registry.bots
    .filter((b) => b.aiRobotsTxtKey && !upstream.has(b.aiRobotsTxtKey))
    .map((b) => b.aiRobotsTxtKey);
  const summary = [
    `## ai.robots.txt sync — ${date}`,
    '',
    `Upstream entries: ${upstream.size}${commit ? ` (commit ${commit.slice(0, 7)})` : ''}. Community entries after curation: ${after.bots.length}.`,
    '',
    `- Added: ${diff.added.length ? diff.added.map((n) => `\`${n}\``).join(', ') : 'none'}`,
    `- Removed: ${diff.removed.length ? diff.removed.map((n) => `\`${n}\``).join(', ') : 'none'}`,
    `- Changed: ${diff.changed.length ? diff.changed.map((n) => `\`${n}\``).join(', ') : 'none'}`,
    missingCurated.length
      ? `- Curated bots no longer listed upstream (review): ${missingCurated.map((n) => `\`${n}\``).join(', ')}`
      : '',
    '',
    'Curated entries in `data/bots.json` are not changed automatically: new upstream agents with official documentation should be reviewed and promoted by hand.',
  ]
    .filter((l) => l !== null)
    .join('\n');
  console.log(summary);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  }
  if (process.env.SYNC_SUMMARY_FILE) await writeFile(process.env.SYNC_SUMMARY_FILE, summary + '\n');
}

await main();
