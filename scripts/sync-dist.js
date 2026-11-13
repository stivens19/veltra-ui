import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const coreStylesDist = path.resolve(rootDir, 'packages/core-styles/dist');
const vanillaJsDist = path.resolve(rootDir, 'packages/vanilla-js/dist');
const appsDocsDist = path.resolve(rootDir, 'apps/docs/dist');
const rootDist = path.resolve(rootDir, 'dist');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFileSafe(src, dest) {
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Copied: ${path.relative(rootDir, dest)}`);
  } else {
    console.warn(`  ⚠ Warning: Source file not found: ${path.relative(rootDir, src)}`);
  }
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('\n🚀 [VeltraUI] Synchronizing standalone assets and root dist/...\n');

// 1. Copy apps/docs/dist into root dist/
if (fs.existsSync(appsDocsDist)) {
  copyDirRecursive(appsDocsDist, rootDist);
  console.log('  ✓ Cloned apps/docs/dist/ -> root dist/');
}

// 2. Core Styles (veltra.css)
const cssSource = path.join(coreStylesDist, 'veltra.css');
if (fs.existsSync(cssSource)) {
  // To root dist
  copyFileSafe(cssSource, path.join(rootDist, 'veltra.css'));
  copyFileSafe(cssSource, path.join(rootDist, 'css/veltra.css'));
  // To apps/docs/dist
  copyFileSafe(cssSource, path.join(appsDocsDist, 'veltra.css'));
  copyFileSafe(cssSource, path.join(appsDocsDist, 'css/veltra.css'));
}

// 3. Vanilla JS (veltra.umd.js, veltra.es.js, index.d.ts)
const umdSource = path.join(vanillaJsDist, 'veltra.umd.js');
const esSource = path.join(vanillaJsDist, 'veltra.es.js');
const dtsSource = path.join(vanillaJsDist, 'index.d.ts');

if (fs.existsSync(umdSource)) {
  // To root dist
  copyFileSafe(umdSource, path.join(rootDist, 'veltra.js'));
  copyFileSafe(umdSource, path.join(rootDist, 'js/veltra.js'));
  copyFileSafe(umdSource, path.join(rootDist, 'js/veltra.umd.js'));
  // To apps/docs/dist
  copyFileSafe(umdSource, path.join(appsDocsDist, 'veltra.js'));
  copyFileSafe(umdSource, path.join(appsDocsDist, 'js/veltra.js'));
  copyFileSafe(umdSource, path.join(appsDocsDist, 'js/veltra.umd.js'));
}

if (fs.existsSync(esSource)) {
  copyFileSafe(esSource, path.join(rootDist, 'js/veltra.es.js'));
  copyFileSafe(esSource, path.join(appsDocsDist, 'js/veltra.es.js'));
}

if (fs.existsSync(dtsSource)) {
  copyFileSafe(dtsSource, path.join(rootDist, 'js/veltra.d.ts'));
  copyFileSafe(dtsSource, path.join(appsDocsDist, 'js/veltra.d.ts'));
}

// 4. Create ZIP package for direct user download
try {
  console.log('  📦 Packaging veltra-ui.zip for direct user download...');
  const zipPath = path.join(rootDist, 'veltra-ui.zip');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
  execSync(`powershell -Command "Get-ChildItem -Path '${rootDist}' -Exclude 'veltra-ui.zip' | Compress-Archive -DestinationPath '${zipPath}' -Force"`, { stdio: 'ignore' });
  const publicDir = path.resolve(rootDir, 'apps/docs/public');
  ensureDir(publicDir);
  copyFileSafe(zipPath, path.join(publicDir, 'veltra-ui.zip'));
  copyFileSafe(zipPath, path.join(appsDocsDist, 'veltra-ui.zip'));
  console.log('  ✓ Generated dist/veltra-ui.zip & apps/docs/public/veltra-ui.zip');
} catch (e) {
  console.warn('  ⚠ Warning creating ZIP archive:', e.message);
}

console.log('\n✨ [VeltraUI] Distribution build complete:');
console.log('   📁 dist/veltra.css');
console.log('   📁 dist/css/veltra.css');
console.log('   📁 dist/veltra.js');
console.log('   📁 dist/js/veltra.js');
console.log('   📦 dist/veltra-ui.zip');
console.log('   📁 dist/*.html (39 templates + docs.html)\n');

