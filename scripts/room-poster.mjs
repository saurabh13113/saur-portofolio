// Regenerates the two snapshots of the home page:
//   public/assets/room-poster.png  the 3D room at its native 420px render size, shown
//                                  while three.js loads and where WebGL is unavailable
//   public/og.png                  1200x630 link-preview image (LinkedIn, Discord, ...)
// Run against a production server:  npm run build && npm start  (then, in another terminal)  npm run poster
// Uses an installed Chrome/Edge; set CHROME_PATH if it isn't the Windows Edge default.
import puppeteer from "puppeteer-core";

const URL = process.env.ROOM_URL ?? "http://localhost:3000/";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: "new",
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--no-first-run"],
});
const settle = () => new Promise((r) => setTimeout(r, 2500));

// 1) room poster: pin the room box to 420 CSS px wide so canvas pixels map 1:1 to the render
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });
await page.addStyleTag({
  content:
    "[data-room]{width:420px!important;max-width:none!important} .room3d-spot,.room3d-tip{display:none!important} html,body{background:transparent!important}",
});
await page.waitForSelector(".room3d canvas[data-engine]", { timeout: 15000 });
await settle();
const canvas = await page.$(".room3d canvas[data-engine]");
const size = await canvas.evaluate((c) => [c.width, c.height]);
if (size[0] !== 420) throw new Error(`expected a 420px-wide canvas, got ${size.join("x")}`);
await canvas.screenshot({ path: "public/assets/room-poster.png", omitBackground: true });
console.log(`wrote public/assets/room-poster.png (${size.join("x")})`);

// 2) link preview: the home page as visitors see it
const og = await browser.newPage();
await og.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await og.goto(URL, { waitUntil: "networkidle0" });
await og.waitForSelector(".room3d canvas[data-engine]", { timeout: 15000 });
await settle();
await og.screenshot({ path: "public/og.png" });
console.log("wrote public/og.png");

await browser.close();
