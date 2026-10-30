import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import { stripVTControlCharacters } from 'node:util';
import { chromium } from 'playwright';

const url = 'http://127.0.0.1:4175';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { stdio: 'pipe' });
let output = '';
server.stdout.on('data', data => { output += data; });
server.stderr.on('data', data => { output += data; });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(output);
    if (stripVTControlCharacters(output).includes(url)) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, `Preview failed to start: ${output}`);
  browser = await chromium.launch({ headless: true, executablePath: process.env.SMOKE_CHROMIUM_PATH || undefined });
  await mkdir('test-results', { recursive: true });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    page.setDefaultTimeout(10000);
    const errors = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.route('**/*', route => {
      if (new URL(route.request().url()).origin !== url) {
        external.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });
    const visible = async locator => { await locator.waitFor({ state: 'visible' }); };
    const click = name => page.getByRole('button', { name, exact: true }).click();
    await page.goto(url);
    assert.match(await page.title(), /DLR/);
    await visible(page.getByRole('heading', { name: '週末のパーク旅行' }));
    assert.equal(await page.locator('vite-error-overlay').count(), 0);
    await visible(page.getByText('0% Complete', { exact: true }));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `test-results/initial-${viewport.width}.png`, fullPage: true });
    await click('完了');
    await visible(page.getByText('25% Complete', { exact: true }));
    assert.equal(await page.getByText('NOW', { exact: true }).locator('../..').getByRole('heading').innerText(), 'リバー・クルーズ');
    await click('Day 2');
    await visible(page.getByRole('heading', { name: 'Day 2 の旅程' }));
    await click('Day 1');
    await click('編集');
    await click('スカイ・ジャーニーを編集');
    await page.getByRole('dialog').locator('textarea[name=notes]').fill('公開デモの検証メモ');
    await click('保存する');
    await click('完了');
    await page.getByRole('button', { name: 'スカイ・ジャーニーの詳細', exact: true }).press('Enter');
    await visible(page.getByRole('dialog').getByText('公開デモの検証メモ', { exact: true }));
    await click('閉じる');
    await click('待ち時間');
    await visible(page.getByText('リアルタイム情報ではありません。', { exact: true }));
    await click('Map');
    await visible(page.getByRole('heading', { name: '旅程のつながり' }));
    await click('Restaurant');
    await visible(page.getByRole('heading', { name: '食事の候補' }));
    await click('デモをリセット');
    await visible(page.getByText('0% Complete', { exact: true }));
    await click('編集');
    await click('スカイ・ジャーニーを後ろへ移動');
    assert.equal(await page.locator('[role="button"][aria-label$="の詳細"]').first().getAttribute('aria-label'), 'リバー・クルーズの詳細');
    await click('光のパレードを削除');
    assert.equal(await page.getByRole('button', { name: '光のパレードの詳細', exact: true }).count(), 0);
    await click('デモをリセット');
    await visible(page.getByRole('button', { name: '光のパレードの詳細', exact: true }));
    await page.reload();
    await visible(page.getByText('0% Complete', { exact: true }));
    assert.deepEqual(errors, [], 'Browser errors');
    assert.deepEqual(external, [], 'Unexpected external requests');
    console.log(`PASS ${viewport.width}x${viewport.height}: initial render, completion, day switch, edit, keyboard detail, tabs, reorder, delete, reset, reload, no external requests/errors`);
    await page.close();
  }
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
}
