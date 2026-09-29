import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: "new",
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--no-first-run"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });
await page.goto("http://localhost:3000/?time=night&weather=storm", { waitUntil: "networkidle0", timeout: 20000 });
await page.waitForSelector(".room3d canvas[data-engine]", { timeout: 15000 });

// Sample average brightness of the window region (roughly where the sky pane renders on screen)
// every 200ms for 10s, to catch a lightning flash spike.
for (let i = 0; i < 50; i++) {
  const brightness = await page.evaluate(() => {
    const c = document.querySelector(".room3d canvas[data-engine]");
    if (!c) return null;
    const off = document.createElement("canvas");
    off.width = c.width;
    off.height = c.height;
    const ctx = off.getContext("2d");
    ctx.drawImage(c, 0, 0);
    // window region: roughly x 65-95%, y 20-45% of the canvas (matches the sky pane on screen)
    const x = Math.floor(c.width * 0.68);
    const y = Math.floor(c.height * 0.22);
    const w = Math.floor(c.width * 0.22);
    const h = Math.floor(c.height * 0.18);
    const data = ctx.getImageData(x, y, w, h).data;
    let sum = 0;
    for (let p = 0; p < data.length; p += 4) sum += data[p] + data[p + 1] + data[p + 2];
    return sum / (data.length / 4);
  });
  console.log(`t=${i * 200}ms brightness=${brightness?.toFixed(1)}`);
  await new Promise((r) => setTimeout(r, 200));
}

await browser.close();
