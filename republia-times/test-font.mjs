import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 640 });
await page.goto('http://localhost:5173');

// Wait for game to load
await page.waitForTimeout(3000);

// Click "Start Work" button (center of screen, y≈540 in screen coords)
await page.mouse.click(540, 540);
await page.waitForTimeout(2000);

// Spawn a big article from the first visible blurb
const result = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return 'no __game';
  const scene = game.scene.getScene('PlayScene');
  if (!scene) return 'no PlayScene';

  // Wait for feed to have blurbs
  const blurbs = scene.feed.blurbs || [];
  // Find a blurb with a long headline to test wrapping
  const visibleBlurb = blurbs.find(b => b.visible && b.newsItem && b.newsItem.placeable
    && b.newsItem.getArticleText().length > 20);
  if (!visibleBlurb) {
    const any = blurbs.find(b => b.visible && b.newsItem && b.newsItem.placeable);
    if (!any) return 'no visible blurb';
  }

  // Spawn big article at paper center
  const pointer = scene.input.activePointer;
  pointer.worldX = 430;
  pointer.worldY = 165;
  scene.paper.enabled = true;
  scene.feed.enabled = true;
  scene.paper.spawnArticleAtPointer(2, visibleBlurb.newsItem, pointer);

  return `spawned: ${visibleBlurb.newsItem.getArticleText()}`;
});

console.log(result);
await page.waitForTimeout(500);

// Click to place it
await page.mouse.click(860, 330);
await page.waitForTimeout(500);

// Screenshot
await page.screenshot({ path: 'font-test-B.png' });
console.log('Screenshot saved to font-test-B.png');

// Keep browser open for manual inspection
await page.waitForTimeout(60000);
await browser.close();
