import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";

const APP_ID = "4369130";
const EXPECTED_ACHIEVEMENTS = 21;
const ACHIEVEMENTS_URL = `https://steamcommunity.com/stats/${APP_ID}/achievements/?l=english`;
const ACHIEVEMENTS_SOURCE = `https://steamcommunity.com/stats/${APP_ID}/achievements/`;
const NEWS_URL = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${APP_ID}&count=30&maxlength=600&format=json`;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const slugify = (value) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const cleanText = (value) => cheerio.load(`<div>${value ?? ""}</div>`)("div").text().replace(/\[[^\]]*]/g, " ").replace(/\s+/g, " ").trim();
const excerpt = (value) => {
  const text = cleanText(value);
  if ([...text].length <= 200) return text;
  const shortened = [...text].slice(0, 199).join("");
  const lastWordBoundary = shortened.search(/\s+\S*$/);
  return `${(lastWordBoundary > 0 ? shortened.slice(0, lastWordBoundary) : shortened).trimEnd()}…`;
};
const rarity = (percent) => percent >= 50 ? "common" : percent >= 20 ? "uncommon" : percent >= 5 ? "rare" : "very-rare";

async function get(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/json;q=0.9,*/*;q=0.8" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response;
}

await fs.mkdir(path.resolve("debug"), { recursive: true });
await fs.mkdir(path.resolve("content/en"), { recursive: true });

const achievementsResponse = await get(ACHIEVEMENTS_URL);
const achievementsHtml = await achievementsResponse.text();
await fs.writeFile(path.resolve("debug/achievements-sample.html"), achievementsHtml, "utf8");

const $ = cheerio.load(achievementsHtml);
const achievements = $(".achieveRow").map((_, element) => {
  const row = $(element);
  const displayName = row.find(".achieveTxt h3").first().text().trim();
  const rawDescription = row.find(".achieveTxt h5").first().text().trim();
  const description = !rawDescription || /^(hidden achievement|hidden)$/i.test(rawDescription) ? null : rawDescription;
  const icon = row.find(".achieveImgHolder img").first().attr("src")?.trim() ?? "";
  const percentText = row.find(".achievePercent").first().text().trim().replace("%", "");
  const globalPercent = Number.parseFloat(percentText);
  if (!displayName || !icon || !Number.isFinite(globalPercent)) throw new Error(`Invalid achievement row: ${row.text().replace(/\s+/g, " ").trim()}`);
  return { slug: slugify(displayName), displayName, description, icon, globalPercent, rarity: rarity(globalPercent) };
}).get();

if (achievements.length !== EXPECTED_ACHIEVEMENTS) {
  throw new Error(`Expected ${EXPECTED_ACHIEVEMENTS} achievements, parsed ${achievements.length}; no output was written.`);
}

const fetchedAt = new Date().toISOString();
const achievementsOutput = { fetchedAt, totalAchievements: achievements.length, source: ACHIEVEMENTS_SOURCE, achievements };

await sleep(2000);
const newsResponse = await get(NEWS_URL);
const newsJson = await newsResponse.json();
const newsItems = newsJson?.appnews?.newsitems;
if (!Array.isArray(newsItems)) throw new Error("Steam news response did not contain appnews.newsitems.");

const updates = newsItems.map((item) => ({
  gid: String(item.gid),
  slug: slugify(item.title),
  title: cleanText(item.title),
  date: new Date(Number(item.date) * 1000).toISOString().slice(0, 10),
  excerpt: excerpt(item.contents),
  url: `https://store.steampowered.com/news/app/${APP_ID}/view/${item.gid}`,
  author: cleanText(item.author),
}));

await fs.writeFile(path.resolve("content/en/achievements.json"), `${JSON.stringify(achievementsOutput, null, 2)}\n`, "utf8");
await fs.writeFile(path.resolve("content/en/updates.json"), `${JSON.stringify({ fetchedAt, updates }, null, 2)}\n`, "utf8");
console.log(`Fetched ${achievements.length} achievements and ${updates.length} Steam news items.`);
if (process.argv.includes("--check-links")) await import("./check-links.mjs");
