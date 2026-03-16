import { ArticleCategory, ArticleData, LoyaltyEffect } from '../../data/articleTypes';
import type { EditorState } from '../editorState';

export class ArticleForm {
  private el: HTMLElement;
  private state: EditorState;
  private currentLegacyIndex: number | null = null;

  public constructor(parent: HTMLElement, state: EditorState) {
    this.state = state;
    this.el = document.createElement('div');
    this.el.className = 'form-panel';
    parent.appendChild(this.el);

    state.onChange(() => this.render());
    this.render();
  }

  public render(): void {
    const article = this.state.getSelectedArticle();

    if (!article) {
      this.el.innerHTML = '<div class="empty-state">Select an article from the list to edit</div>';
      this.currentLegacyIndex = null;
      return;
    }

    // Only rebuild DOM if selection changed, otherwise just update values
    if (this.currentLegacyIndex !== article.legacyIndex) {
      this.currentLegacyIndex = article.legacyIndex;
      this.buildForm(article);
    }
  }

  private buildForm(a: ArticleData): void {
    this.el.innerHTML = '';

    // Metadata
    this.addHeader('Metadata');
    this.addTextRow('ID', a.id, (v) => this.update({ id: v }));
    this.addReadonlyRow('Legacy Index', String(a.legacyIndex));
    this.addCategoryRow(a.category);
    this.addNumberRow('Day Start', a.dayRangeStart, (v) => this.update({ dayRangeStart: v }));
    this.addNumberRow('Day End', a.dayRangeEnd, (v) => this.update({ dayRangeEnd: v }));
    this.addLoyaltyRow(a.loyaltyEffect);
    this.addCheckboxRow('Interesting', a.interesting, (v) => this.update({ interesting: v }));

    // EN text
    this.addHeader('English Text');
    this.addTextAreaRow('Blurb', a.text.en.blurb, (v) => this.updateText('en', 'blurb', v));
    this.addNullableTextRow('Headline', a.text.en.headline, (v) => this.updateText('en', 'headline', v));

    // ES text
    this.addHeader('Spanish Text');
    this.addTextAreaRow('Blurb', a.text.es.blurb, (v) => this.updateText('es', 'blurb', v));
    this.addNullableTextRow('Headline', a.text.es.headline, (v) => this.updateText('es', 'headline', v));

    // Validation
    this.addValidation(a);

    // Delete
    const deleteSection = document.createElement('div');
    deleteSection.className = 'delete-section';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete Article';
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Delete article "${a.id}"?`)) {
        this.state.deleteArticle(a.legacyIndex);
      }
    });
    deleteSection.appendChild(deleteBtn);
    this.el.appendChild(deleteSection);
  }

  private update(partial: Partial<ArticleData>): void {
    if (this.currentLegacyIndex === null) return;
    this.state.updateArticle(this.currentLegacyIndex, partial);
  }

  private updateText(lang: 'en' | 'es', field: 'blurb' | 'headline', value: string | null): void {
    if (this.currentLegacyIndex === null) return;
    this.state.updateArticleText(this.currentLegacyIndex, lang, field, value);
  }

  private addHeader(text: string): void {
    const h = document.createElement('h3');
    h.textContent = text;
    this.el.appendChild(h);
  }

  private addTextRow(label: string, value: string, onChange: (v: string) => void): void {
    const row = this.makeRow(label);
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.addEventListener('input', () => onChange(input.value));
    row.appendChild(input);
    this.el.appendChild(row);
  }

  private addReadonlyRow(label: string, value: string): void {
    const row = this.makeRow(label);
    const span = document.createElement('span');
    span.className = 'readonly';
    span.textContent = value;
    row.appendChild(span);
    this.el.appendChild(row);
  }

  private addNumberRow(label: string, value: number, onChange: (v: number) => void): void {
    const row = this.makeRow(label);
    const input = document.createElement('input');
    input.type = 'number';
    input.value = String(value);
    input.style.width = '80px';
    input.style.flex = '0';
    input.addEventListener('input', () => onChange(Number(input.value) || 0));
    row.appendChild(input);
    this.el.appendChild(row);
  }

  private addCategoryRow(value: ArticleCategory): void {
    const row = this.makeRow('Category');
    const select = document.createElement('select');
    for (const cat of Object.values(ArticleCategory)) {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (cat === value) opt.selected = true;
      select.appendChild(opt);
    }
    select.addEventListener('change', () => this.update({ category: select.value as ArticleCategory }));
    row.appendChild(select);
    this.el.appendChild(row);
  }

  private addLoyaltyRow(value: LoyaltyEffect): void {
    const row = this.makeRow('Loyalty');
    const group = document.createElement('div');
    group.className = 'radio-group';

    for (const [label, effect] of [['↑ Up', LoyaltyEffect.Up], ['↓ Down', LoyaltyEffect.Down], ['— None', LoyaltyEffect.None]] as const) {
      const lbl = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'loyalty';
      radio.value = String(effect);
      radio.checked = effect === value;
      radio.addEventListener('change', () => this.update({ loyaltyEffect: effect }));
      lbl.appendChild(radio);
      lbl.appendChild(document.createTextNode(` ${label}`));
      group.appendChild(lbl);
    }

    row.appendChild(group);
    this.el.appendChild(row);
  }

  private addCheckboxRow(label: string, value: boolean, onChange: (v: boolean) => void): void {
    const row = this.makeRow(label);
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = value;
    input.addEventListener('change', () => onChange(input.checked));
    row.appendChild(input);
    this.el.appendChild(row);
  }

  private addTextAreaRow(label: string, value: string, onChange: (v: string) => void): void {
    const row = this.makeRow(label);
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.addEventListener('input', () => onChange(ta.value));
    row.appendChild(ta);
    this.el.appendChild(row);
  }

  private addNullableTextRow(label: string, value: string | null, onChange: (v: string | null) => void): void {
    const row = this.makeRow(label);

    const isNull = value === null;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value ?? '';
    input.disabled = isNull;
    input.style.opacity = isNull ? '0.5' : '1';
    input.addEventListener('input', () => onChange(input.value));

    const toggle = document.createElement('span');
    toggle.className = 'null-toggle';
    toggle.textContent = isNull ? '[set]' : '[null]';
    toggle.addEventListener('click', () => {
      if (input.disabled) {
        input.disabled = false;
        input.style.opacity = '1';
        toggle.textContent = '[null]';
        onChange(input.value || 'Headline');
      } else {
        input.disabled = true;
        input.style.opacity = '0.5';
        toggle.textContent = '[set]';
        onChange(null);
      }
    });

    row.appendChild(input);
    row.appendChild(toggle);
    this.el.appendChild(row);
  }

  private addValidation(a: ArticleData): void {
    const warnings: { msg: string; level: 'error' | 'warning' }[] = [];

    if (!a.text.en.blurb.trim()) {
      warnings.push({ msg: 'English blurb text is required', level: 'error' });
    }
    if (!a.text.es.blurb.trim()) {
      warnings.push({ msg: 'Missing Spanish translation for blurb', level: 'warning' });
    }
    if (a.text.en.headline && !a.text.es.headline) {
      warnings.push({ msg: 'Missing Spanish headline translation', level: 'warning' });
    }
    if (a.text.en.blurb.length > 120) {
      warnings.push({ msg: `Blurb may overflow feed (${a.text.en.blurb.length} chars)`, level: 'warning' });
    }
    if (a.text.en.headline && a.text.en.headline.length > 40) {
      warnings.push({ msg: `Headline may overflow article (${a.text.en.headline.length} chars)`, level: 'warning' });
    }
    if (a.dayRangeEnd > 0 && a.dayRangeEnd < a.dayRangeStart) {
      warnings.push({ msg: 'Day range end must be >= start', level: 'error' });
    }

    // Duplicate ID check
    const dupes = this.state.articles.filter((x) => x.id === a.id && x.legacyIndex !== a.legacyIndex);
    if (dupes.length > 0) {
      warnings.push({ msg: 'Duplicate article ID', level: 'error' });
    }

    for (const w of warnings) {
      const div = document.createElement('div');
      div.className = `validation-msg ${w.level}`;
      div.textContent = `${w.level === 'error' ? '✗' : '⚠'} ${w.msg}`;
      this.el.appendChild(div);
    }
  }

  private makeRow(label: string): HTMLDivElement {
    const row = document.createElement('div');
    row.className = 'form-row';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    row.appendChild(lbl);
    return row;
  }
}
