import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('apps/docs/public/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
  { name: 'dashboard-1', url: 'http://localhost:3000/dashboard1.html' },
  { name: 'dashboard-2', url: 'http://localhost:3000/index2.html' },
  { name: 'dashboard-3', url: 'http://localhost:3000/index3.html' },
  { name: 'kanban', url: 'http://localhost:3000/kanban.html' },
  { name: 'calendar', url: 'http://localhost:3000/calendar.html' },
  { name: 'pos', url: 'http://localhost:3000/pages-pos.html' },
  { name: 'ecommerce', url: 'http://localhost:3000/pages-ecommerce.html' },
  { name: 'datatables', url: 'http://localhost:3000/tables-datatables.html' },
  { name: 'forms', url: 'http://localhost:3000/forms-advanced.html' },
  { name: 'invoice', url: 'http://localhost:3000/pages-invoice.html' },
];

async function capture() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  for (const item of PAGES) {
    console.log(`Capturing ${item.name} (${item.url})...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 15000 });
      // wait a bit for Lucide icons and Chart.js animations
      await new Promise(r => setTimeout(r, 1200));

      const lightPath = path.join(OUTPUT_DIR, `${item.name}-light.png`);
      await page.screenshot({ path: lightPath, type: 'png' });
      console.log(`  ✓ Saved light: ${lightPath}`);

      // Now toggle dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('veltra_theme', 'dark');
      });
      await new Promise(r => setTimeout(r, 600));

      const darkPath = path.join(OUTPUT_DIR, `${item.name}-dark.png`);
      await page.screenshot({ path: darkPath, type: 'png' });
      console.log(`  ✓ Saved dark: ${darkPath}`);

      // Reset dark mode
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('veltra_theme', 'light');
      });
    } catch (err) {
      console.error(`  ✗ Error capturing ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('🎉 All screenshots captured successfully in', OUTPUT_DIR);
}

capture();

