/**
 * Prebuild script — runs the Python crawler to generate fresh data before `npm run build`.
 *
 * Strategy:
 *   1. Try python3, python, py in order.
 *   2. If Python is found and crawler succeeds, data files are refreshed.
 *   3. If Python is unavailable or crawler fails, warn and continue
 *      (the repo already contains fallback data files).
 *
 * Usage: added as "prebuild" hook in package.json.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.join(__dirname, '..');
const CRAWLER_SCRIPT = 'crawler/main.py';

const PYTHON_COMMANDS = ['python3', 'python', 'py'];

function findPython() {
  for (const cmd of PYTHON_COMMANDS) {
    try {
      execSync(`"${cmd}" --version`, { stdio: 'pipe', timeout: 5000 });
      return cmd;
    } catch {
      // Try next
    }
  }
  return null;
}

function runCrawler(pythonCmd) {
  const args = process.argv.includes('--crawl-debug') ? ' --debug' : '';
  const fullCmd = `"${pythonCmd}" "${CRAWLER_SCRIPT}"${args}`;

  console.log(`\n[prebuild] Running: ${pythonCmd} ${CRAWLER_SCRIPT}${args}`);
  console.log('[prebuild] ------------------------------------------------');

  try {
    execSync(fullCmd, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      timeout: 180000, // 3 minutes max
    });
    return true;
  } catch (err) {
    console.error(`[prebuild] Crawler exited with error: ${err.message}`);
    return false;
  }
}

function main() {
  // Skip if crawler was already run in CI (deploy workflow runs it before npm build)
  if (process.env.SKIP_CRAWLER === '1') {
    console.log('[prebuild] SKIP_CRAWLER=1 set. Crawler already ran in CI, skipping.');
    return;
  }

  console.log('[prebuild] Checking for Python...');

  const pythonCmd = findPython();

  if (!pythonCmd) {
    console.warn('[prebuild] ⚠ Python not found (tried: python3, python, py).');
    console.warn('[prebuild]   Skipping crawler. Using existing data files in src/data/.');
    console.warn('[prebuild]   Install Python 3.10+ and run `python crawler/main.py` manually to refresh.');
    return;
  }

  console.log(`[prebuild] Found: ${pythonCmd}`);

  const ok = runCrawler(pythonCmd);

  if (ok) {
    console.log('[prebuild] ------------------------------------------------');
    console.log('[prebuild] ✓ Data files generated successfully.');
  } else {
    console.warn('[prebuild] ------------------------------------------------');
    console.warn('[prebuild] ⚠ Crawler failed. Build will use existing data files.');
  }
}

main();
