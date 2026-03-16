import { ArticleCategory } from '../../data/articleTypes';
import type { EditorState } from '../editorState';
import { exportJSON, generateTS, importJSON } from '../editorIO';

export class Toolbar {
  private el: HTMLElement;
  private state: EditorState;
  private statusEl!: HTMLSpanElement;
  private dirtyEl!: HTMLSpanElement;
  private fileInput!: HTMLInputElement;

  public constructor(parent: HTMLElement, state: EditorState) {
    this.state = state;
    this.el = document.createElement('div');
    this.el.className = 'toolbar';
    parent.appendChild(this.el);
    this.build();
    state.onChange(() => this.updateStatus());
  }

  private build(): void {
    // Search
    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Search articles...';
    search.addEventListener('input', () => this.state.setSearch(search.value));
    this.el.appendChild(search);

    // Category filter
    const catSelect = document.createElement('select');
    const allOpt = document.createElement('option');
    allOpt.value = '';
    allOpt.textContent = 'All Categories';
    catSelect.appendChild(allOpt);
    for (const cat of Object.values(ArticleCategory)) {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      catSelect.appendChild(opt);
    }
    catSelect.addEventListener('change', () => {
      this.state.setCategoryFilter(catSelect.value ? (catSelect.value as ArticleCategory) : null);
    });
    this.el.appendChild(catSelect);

    // Status
    this.statusEl = document.createElement('span');
    this.statusEl.className = 'status';
    this.el.appendChild(this.statusEl);

    // Dirty indicator
    this.dirtyEl = document.createElement('span');
    this.dirtyEl.className = 'dirty';
    this.el.appendChild(this.dirtyEl);

    // Spacer
    const spacer = document.createElement('span');
    spacer.className = 'spacer';
    this.el.appendChild(spacer);

    // New Article
    const newBtn = document.createElement('button');
    newBtn.className = 'primary';
    newBtn.textContent = '+ New Article';
    newBtn.addEventListener('click', () => this.state.addArticle());
    this.el.appendChild(newBtn);

    // Export JSON
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export JSON';
    exportBtn.addEventListener('click', () => {
      exportJSON(this.state.articles);
      this.state.dirty = false;
      this.state.notify();
    });
    this.el.appendChild(exportBtn);

    // Import JSON
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.json';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', () => this.handleImport());
    this.el.appendChild(this.fileInput);

    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import JSON';
    importBtn.addEventListener('click', () => this.fileInput.click());
    this.el.appendChild(importBtn);

    // Copy as TS
    const tsBtn = document.createElement('button');
    tsBtn.textContent = 'Copy as TS';
    tsBtn.addEventListener('click', () => {
      const ts = generateTS(this.state.articles);
      navigator.clipboard.writeText(ts).then(() => {
        tsBtn.textContent = 'Copied!';
        setTimeout(() => { tsBtn.textContent = 'Copy as TS'; }, 2000);
      });
      this.state.dirty = false;
      this.state.notify();
    });
    this.el.appendChild(tsBtn);

    this.updateStatus();
  }

  private async handleImport(): Promise<void> {
    const file = this.fileInput.files?.[0];
    if (!file) return;

    const result = await importJSON(file);
    if (result.error) {
      alert(`Import failed: ${result.error}`);
    } else {
      const count = result.articles.length;
      if (confirm(`Import ${count} articles? This will replace all current data.`)) {
        this.state.replaceAll(result.articles);
      }
    }
    this.fileInput.value = '';
  }

  private updateStatus(): void {
    const filtered = this.state.getFilteredArticles().length;
    const total = this.state.articles.length;
    this.statusEl.textContent = filtered === total
      ? `${total} articles`
      : `${filtered} of ${total} articles`;
    this.dirtyEl.textContent = this.state.dirty ? '• Unsaved changes' : '';
  }
}
