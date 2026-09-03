import assert from 'node:assert/strict';
import test from 'node:test';
import { bugPermalink, findBugTarget } from '../.vitepress/vue/bugTarget.mjs';

const bugs = Array.from({ length: 41 }, (_, index) => ({ id: String(1000 + index) }));

test('permalinks use the current mirror and replace existing queries and hashes', () => {
  assert.equal(
    bugPermalink('https://mirror.example/datapack-index/index/misc/bugs.html?bug=1000&old=1#heading', 'MC-1020'),
    'https://mirror.example/datapack-index/index/misc/bugs.html?bug=1020',
  );
  assert.equal(
    bugPermalink('http://localhost:5173/index/misc/bugs', ' 1020 '),
    'http://localhost:5173/index/misc/bugs?bug=1020',
  );
  assert.throws(() => bugPermalink('https://mirror.example/bugs', 'MCPE-1020'));
});

test('bug links locate the correct page, including page boundaries', () => {
  for (const index of [0, 19, 20, 39, 40]) {
    const id = String(1000 + index);
    assert.deepEqual(findBugTarget(bugs, `?bug=${id}`, 20), {
      key: `MC-${id}`, index, page: Math.floor(index / 20) + 1,
    });
  }
});

test('numeric and MC-prefixed IDs work on either side of the match', () => {
  assert.equal(findBugTarget(bugs, '?other=value&bug=%20mc-1020%20', 20)?.page, 2);
  assert.equal(findBugTarget([{ id: 'MC-1020' }], '?bug=1020', 20)?.index, 0);
});

test('absent, invalid, unknown IDs and empty lists do not select a target', () => {
  for (const search of ['', '?other=1020', '?bug=', '?bug=MCPE-1020', '?bug=invalid',
    '?bug=%22%5D', '?bug=999999', '?bug=1020.0']) {
    assert.equal(findBugTarget(bugs, search, 20), null);
  }
  assert.equal(findBugTarget([], '?bug=1020', 20), null);
});
