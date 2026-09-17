// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { extractOutline } from '../src/outline';

function prose(html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

describe('extractOutline', () => {
  it('collects headings in document order with normalized depth', () => {
    const root = prose('<h2>第一章</h2><p>正文</p><h3>第一节</h3><h2>第二章</h2>');
    const items = extractOutline(root);
    expect(items.map(item => [item.text, item.level, item.depth])).toEqual([
      ['第一章', 2, 0],
      ['第一节', 3, 1],
      ['第二章', 2, 0],
    ]);
    expect(new Set(items.map(item => item.id)).size).toBe(3);
    expect(root.querySelectorAll('h2, h3')[0].id).toBe(items[0].id);
  });
  it('skips empty headings and reuses existing ids', () => {
    const root = prose('<h2>   </h2><h2 id="keep">留</h2><h4>深</h4>');
    const items = extractOutline(root);
    expect(items.map(item => item.text)).toEqual(['留', '深']);
    expect(items[0].id).toBe('keep');
    expect(items[1].depth).toBe(2);
  });
  it('returns empty for prose without headings', () => {
    expect(extractOutline(prose('<p>只有段落</p>'))).toEqual([]);
  });
  it('keeps ids stable across repeated calls', () => {
    const root = prose('<h2>A</h2>');
    const first = extractOutline(root);
    const second = extractOutline(root);
    expect(first[0].id).toBe(second[0].id);
  });
});
