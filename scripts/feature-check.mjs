import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: "new",
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--no-first-run"],
});
const page = await browser.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.setViewport({ width: 1400, height: 900 });

console.log("--- PS4 games ---");
await page.goto("http://localhost:3000/?time=night", { waitUntil: "networkidle0", timeout: 20000 });
await page.waitForSelector(".room3d canvas[data-engine]", { timeout: 15000 });
await new Promise((r) => setTimeout(r, 1500));

const ps4 = await page.$('[aria-label="PS4: penalty shootout"]');
if (!ps4) throw new Error("PS4 hotspot not found");
await ps4.click();
await page.waitForSelector('dialog[aria-label="Choose a game"][open]', { timeout: 3000 });
console.log("picker opened: OK");
await page.screenshot({ path: process.argv[2] + "/ps4-picker.png" });

// pick the reaction game
const buttons = await page.$$('dialog[open] button');
let clicked = false;
for (const b of buttons) {
  const text = await b.evaluate((el) => el.textContent);
  if (text.includes("Reaction game")) { await b.click(); clicked = true; break; }
}
if (!clicked) throw new Error("Reaction game button not found");
await page.waitForSelector('dialog[aria-label="Reaction game"][open]', { timeout: 3000 });
console.log("whack game opened: OK");
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: process.argv[2] + "/whack-game.png" });

// try to hit the active target a couple times
for (let i = 0; i < 3; i++) {
  const target = await page.$('dialog[aria-label="Reaction game"] button[aria-label="Target"]');
  if (target) await target.click();
  await new Promise((r) => setTimeout(r, 850));
}
const score = await page.$eval('dialog[aria-label="Reaction game"] span', (el) => el.textContent);
console.log("score line after hits:", score);

console.log("--- weather storm ---");
const page2 = await browser.newPage();
const errors2 = [];
page2.on("console", (m) => { if (m.type() === "error") errors2.push(m.text()); });
page2.on("pageerror", (e) => errors2.push(String(e)));
await page2.setViewport({ width: 1400, height: 900 });
await page2.goto("http://localhost:3000/?time=night&weather=storm", { waitUntil: "networkidle0", timeout: 20000 });
await page2.waitForSelector(".room3d canvas[data-engine]", { timeout: 15000 });
await page2.screenshot({ path: process.argv[2] + "/storm-1.png" });
await new Promise((r) => setTimeout(r, 2500));
await page2.screenshot({ path: process.argv[2] + "/storm-2.png" });
await new Promise((r) => setTimeout(r, 2500));
await page2.screenshot({ path: process.argv[2] + "/storm-3.png" });

console.log("console errors (page1):", errors.filter((e) => !e.includes("thunder.mp3")));
console.log("console errors (page2):", errors2.filter((e) => !e.includes("thunder.mp3")));

await browser.close();
