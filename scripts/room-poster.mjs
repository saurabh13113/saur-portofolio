// Regenerates public/assets/room-poster.png: a snapshot of the 3D room at its
// native 420x420 render size, used while three.js loads and without WebGL.
// Run against a production server:  npm run build && npm start  (then, in another terminal)  npm run poster
// Uses an installed Chrome/Edge; set CHROME_PATH if it isn't the Windows Edge default.
import puppeteer from "puppeteer-core";

const URL = process.env.ROOM_URL ?? "http://localhost:3000/";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: "new",
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--no-first-run"],
});
const page = await browser.newPage();
// height chosen so the room box (min(900px, 100vh - 11rem)) is exactly 420 CSS px: 1:1 with the render
await page.setViewport({ width: 1280, height: 596, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });
await page.waitForSelector("canvas[data-engine]", { timeout: 15000 });
await page.addStyleTag({ content: ".room3d-spot,.room3d-tip{display:none!important}" });
await new Promise((r) => setTimeout(r, 2000));
const canvas = await page.$("canvas[data-engine]");
const size = await canvas.evaluate((c) => [c.width, c.height]);
if (size[0] !== 420) throw new Error(`expected a 420px canvas, got ${size.join("x")}`);
await canvas.screenshot({ path: "public/assets/room-poster.png" });
await browser.close();
console.log("wrote public/assets/room-poster.png");
