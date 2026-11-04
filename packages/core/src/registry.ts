/** The bot registry shipped with the package (curated entries + ai.robots.txt community list). */
import registryData from './data/bots.json' with { type: 'json' };
import communityData from './data/community-bots.json' with { type: 'json' };
import { crawlerToken } from './generator.js';
import type { Bot, BotOperator, BotRegistry, CommunityBotList } from './types.js';

export const registry = registryData as unknown as BotRegistry;
export const communityList = communityData as unknown as CommunityBotList;

/** Curated bots with operator documentation (or observed data) checked by hand. */
export const curatedBots: Bot[] = registry.bots;
/** Additional agents from the ai.robots.txt community list (not individually verified). */
export const communityBots: Bot[] = communityList.bots;

export function allBots(): Bot[] {
  return [...curatedBots, ...communityBots];
}

export function getBot(id: string): Bot | undefined {
  return curatedBots.find((b) => b.id === id) ?? communityBots.find((b) => b.id === id);
}

export function getOperator(id: string): BotOperator | undefined {
  return registry.operators.find((o) => o.id === id);
}

/** Find a bot by robots.txt token or User-Agent product token (case-insensitive). */
export function findBotByToken(token: string): Bot | undefined {
  const t = token.toLowerCase();
  const product = crawlerToken(token).toLowerCase();
  return (
    curatedBots.find((b) => b.token.toLowerCase() === t) ??
    communityBots.find((b) => b.token.toLowerCase() === t) ??
    curatedBots.find((b) => crawlerToken(b.token).toLowerCase() === product)
  );
}

/** Bots that get a page on the site. */
export function pageBots(): Bot[] {
  return curatedBots.filter((b) => b.page);
}
