import { ArticleCategory, ArticleData, LoyaltyEffect } from '../../data/articleTypes';
import type { EditorState } from '../editorState';

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  [ArticleCategory.Plot]: 'var(--cat-plot)',
  [ArticleCategory.Military]: 'var(--cat-military)',
  [ArticleCategory.War]: 'var(--cat-war)',
  [ArticleCategory.Politics]: 'var(--cat-politics)',
  [ArticleCategory.Weather]: 'var(--cat-weather)',
  [ArticleCategory.Sports]: 'var(--cat-sports)',
  [ArticleCategory.Entertainment]: 'var(--cat-entertainment)',
};

export class ArticleList {
  private el: HTMLElement;
  private tbody: HTMLTableSectionElement;
  private state: EditorState;

  public constructor(parent: HTMLElement, state: EditorState) {
    this.state = state;
    this.el = document.createElement('div');
    this.el.className = 'list-panel';
    parent.appendChild(this.el);

    const table = document.createElement('table');
    table.className = 'list-table';
    this.el.appendChild(table);

    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
      <th style="width:40px">#</th>
      <th style="width:160px">ID</th>
      <th style="width:90px">Category</th>
      <th>Blurb</th>
      <th style="width:50px">Loy</th>
      <th style="width:40px">Int</th>
      <th style="width:60px">Days</th>
    </tr>`;
    table.appendChild(thead);

    this.tbody = document.createElement('tbody');
    table.appendChild(this.tbody);

    state.onChange(() => this.render());
    this.render();
  }

  public render(): void {
    const articles = this.state.getFilteredArticles();
    const selected = this.state.selectedIndex;

    this.tbody.innerHTML = '';
    for (const a of articles) {
      const tr = document.createElement('tr');
      if (a.legacyIndex === selected) tr.className = 'selected';
      tr.addEventListener('click', () => this.state.selectByLegacyIndex(a.legacyIndex));
      tr.innerHTML = `
        <td>${a.legacyIndex}</td>
        <td>${escapeHtml(a.id)}</td>
        <td><span class="cat-badge" style="background:${CATEGORY_COLORS[a.category]}">${a.category}</span></td>
        <td>${escapeHtml(a.text.en.blurb.slice(0, 60))}${a.text.en.blurb.length > 60 ? '...' : ''}</td>
        <td>${loyaltyIcon(a.loyaltyEffect)}</td>
        <td>${a.interesting ? '★' : ''}</td>
        <td>${dayRange(a)}</td>
      `;
      this.tbody.appendChild(tr);
    }
  }
}

function loyaltyIcon(effect: LoyaltyEffect): string {
  switch (effect) {
    case LoyaltyEffect.Up: return '<span class="loyalty-up">↑</span>';
    case LoyaltyEffect.Down: return '<span class="loyalty-down">↓</span>';
    case LoyaltyEffect.None: return '<span class="loyalty-none">—</span>';
  }
}

function dayRange(a: ArticleData): string {
  if (a.dayRangeStart === 0 && a.dayRangeEnd === 0) return 'any';
  if (a.dayRangeEnd === -1) return `${a.dayRangeStart}+`;
  return `${a.dayRangeStart}-${a.dayRangeEnd}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
