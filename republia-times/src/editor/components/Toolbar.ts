import { ArticleCategory } from '../../data/articleTypes';
import type { EditorState } from '../editorState';
import { exportJSON, generateTS, importJSON } from '../editorIO';
import { getApiKey, getBinId, hasApiKey, isConfigured, setApiKey, setBinId } from '../cloudConfig';
import { pullFromCloud, pushToCloud, testConnection } from '../cloudSync';

export class Toolbar {
  private el: HTMLElement;
  private state: EditorState;
  private statusEl!: HTMLSpanElement;
  private dirtyEl!: HTMLSpanElement;
  private cloudStatusEl!: HTMLSpanElement;
  private fileInput!: HTMLInputElement;
  private pushBtn!: HTMLButtonElement;
  private pullBtn!: HTMLButtonElement;
  private settingsPanel: HTMLElement | null = null;

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

    // Cloud status
    this.cloudStatusEl = document.createElement('span');
    this.cloudStatusEl.className = 'status';
    this.el.appendChild(this.cloudStatusEl);

    // Spacer
    const spacer = document.createElement('span');
    spacer.className = 'spacer';
    this.el.appendChild(spacer);

    // New Article
    const newBtn = document.createElement('button');
    newBtn.className = 'primary';
    newBtn.textContent = '+ New';
    newBtn.addEventListener('click', () => this.state.addArticle());
    this.el.appendChild(newBtn);

    // Export JSON
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export';
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
    importBtn.textContent = 'Import';
    importBtn.addEventListener('click', () => this.fileInput.click());
    this.el.appendChild(importBtn);

    // Copy as TS
    const tsBtn = document.createElement('button');
    tsBtn.textContent = 'Copy TS';
    tsBtn.addEventListener('click', () => {
      const ts = generateTS(this.state.articles);
      navigator.clipboard.writeText(ts).then(() => {
        tsBtn.textContent = 'Copied!';
        setTimeout(() => { tsBtn.textContent = 'Copy TS'; }, 2000);
      });
      this.state.dirty = false;
      this.state.notify();
    });
    this.el.appendChild(tsBtn);

    // Separator
    const sep = document.createElement('span');
    sep.textContent = '|';
    sep.style.color = 'var(--border)';
    sep.style.margin = '0 2px';
    this.el.appendChild(sep);

    // Push to Cloud
    this.pushBtn = document.createElement('button');
    this.pushBtn.textContent = 'Push';
    this.pushBtn.title = 'Save to JSONBin.io';
    this.pushBtn.addEventListener('click', () => this.handlePush());
    this.el.appendChild(this.pushBtn);

    // Pull from Cloud
    this.pullBtn = document.createElement('button');
    this.pullBtn.textContent = 'Pull';
    this.pullBtn.title = 'Load from JSONBin.io';
    this.pullBtn.addEventListener('click', () => this.handlePull());
    this.el.appendChild(this.pullBtn);

    // Cloud Settings
    const settingsBtn = document.createElement('button');
    settingsBtn.textContent = 'Cloud';
    settingsBtn.title = 'Configure JSONBin.io connection';
    settingsBtn.addEventListener('click', () => this.toggleSettings());
    this.el.appendChild(settingsBtn);

    this.updateStatus();
  }

  private async handlePush(): Promise<void> {
    if (!hasApiKey()) {
      alert('Configure your JSONBin.io API key first (click "Cloud").');
      return;
    }
    this.pushBtn.disabled = true;
    this.pushBtn.textContent = 'Pushing...';
    const result = await pushToCloud(this.state.articles);
    this.pushBtn.disabled = false;
    this.pushBtn.textContent = 'Push';
    if (result.ok) {
      this.state.dirty = false;
      this.state.notify();
      this.setCloudStatus('Pushed', 'var(--green)');
    } else {
      alert(`Push failed: ${result.error}`);
      this.setCloudStatus('Push failed', 'var(--red)');
    }
  }

  private async handlePull(): Promise<void> {
    if (!isConfigured()) {
      alert('Configure your JSONBin.io API key and bin ID first (click "Cloud").');
      return;
    }
    if (this.state.dirty) {
      if (!confirm('You have unsaved local changes. Pull will replace them. Continue?')) return;
    }
    this.pullBtn.disabled = true;
    this.pullBtn.textContent = 'Pulling...';
    const result = await pullFromCloud();
    this.pullBtn.disabled = false;
    this.pullBtn.textContent = 'Pull';
    if (result.articles) {
      this.state.replaceAll(result.articles);
      this.state.dirty = false;
      this.state.notify();
      this.setCloudStatus(`Pulled ${result.articles.length} articles`, 'var(--green)');
    } else {
      alert(`Pull failed: ${result.error}`);
      this.setCloudStatus('Pull failed', 'var(--red)');
    }
  }

  private setCloudStatus(text: string, color: string): void {
    this.cloudStatusEl.textContent = text;
    this.cloudStatusEl.style.color = color;
    setTimeout(() => {
      this.cloudStatusEl.textContent = '';
      this.cloudStatusEl.style.color = '';
    }, 4000);
  }

  private toggleSettings(): void {
    if (this.settingsPanel) {
      this.settingsPanel.remove();
      this.settingsPanel = null;
      return;
    }

    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed; top: 44px; right: 12px; z-index: 100;
      background: var(--bg-panel); border: 1px solid var(--border);
      border-radius: 6px; padding: 16px; width: 420px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;

    panel.innerHTML = `
      <div style="margin-bottom: 12px; font-weight: 600; font-size: 14px;">JSONBin.io Cloud Settings</div>
      <div style="margin-bottom: 8px; font-size: 11px; color: var(--text-muted);">
        1. Create a free account at <a href="https://jsonbin.io" target="_blank" style="color: var(--accent);">jsonbin.io</a><br>
        2. Go to API Keys and copy your <b>Master Key</b><br>
        3. Paste it below and click "Push" to create your first bin
      </div>
      <div class="form-row" style="margin-bottom: 8px;">
        <label style="width: 70px; font-size: 12px; color: var(--text-muted); text-align: right;">API Key</label>
        <input type="password" id="cloud-api-key" value="${escapeAttr(getApiKey())}"
          style="flex:1; background: var(--bg-input); border: 1px solid var(--border); color: var(--text);
          padding: 4px 8px; border-radius: 3px; font-family: inherit; font-size: 13px;" />
      </div>
      <div class="form-row" style="margin-bottom: 12px;">
        <label style="width: 70px; font-size: 12px; color: var(--text-muted); text-align: right;">Bin ID</label>
        <input type="text" id="cloud-bin-id" value="${escapeAttr(getBinId())}" placeholder="Auto-created on first push"
          style="flex:1; background: var(--bg-input); border: 1px solid var(--border); color: var(--text);
          padding: 4px 8px; border-radius: 3px; font-family: inherit; font-size: 13px;" />
      </div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="cloud-test" style="background: var(--bg-input); border: 1px solid var(--border);
          color: var(--text); padding: 4px 12px; border-radius: 3px; cursor: pointer;
          font-family: inherit; font-size: 13px;">Test</button>
        <button id="cloud-save" style="background: var(--accent); border: 1px solid var(--accent);
          color: #fff; padding: 4px 12px; border-radius: 3px; cursor: pointer;
          font-family: inherit; font-size: 13px;">Save Settings</button>
      </div>
      <div id="cloud-test-result" style="margin-top: 8px; font-size: 11px;"></div>
    `;

    document.body.appendChild(panel);
    this.settingsPanel = panel;

    panel.querySelector('#cloud-save')!.addEventListener('click', () => {
      const keyInput = panel.querySelector('#cloud-api-key') as HTMLInputElement;
      const binInput = panel.querySelector('#cloud-bin-id') as HTMLInputElement;
      setApiKey(keyInput.value);
      setBinId(binInput.value);
      this.settingsPanel?.remove();
      this.settingsPanel = null;
      this.updateStatus();
    });

    panel.querySelector('#cloud-test')!.addEventListener('click', async () => {
      const keyInput = panel.querySelector('#cloud-api-key') as HTMLInputElement;
      const binInput = panel.querySelector('#cloud-bin-id') as HTMLInputElement;
      // Temporarily set for testing
      setApiKey(keyInput.value);
      setBinId(binInput.value);

      const resultEl = panel.querySelector('#cloud-test-result') as HTMLElement;
      resultEl.textContent = 'Testing...';
      resultEl.style.color = 'var(--text-muted)';

      const result = await testConnection();
      if (result.ok) {
        resultEl.textContent = 'Connection OK!';
        resultEl.style.color = 'var(--green)';
      } else {
        resultEl.textContent = `Failed: ${result.error}`;
        resultEl.style.color = 'var(--red)';
      }
    });

    // Close on outside click
    const closeHandler = (e: MouseEvent) => {
      if (!panel.contains(e.target as Node) && this.settingsPanel) {
        this.settingsPanel.remove();
        this.settingsPanel = null;
        document.removeEventListener('mousedown', closeHandler);
      }
    };
    // Delay to avoid catching the current click
    setTimeout(() => document.addEventListener('mousedown', closeHandler), 0);
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

    // Update cloud button states
    this.pushBtn.disabled = !hasApiKey();
    this.pullBtn.disabled = !isConfigured();
    this.pushBtn.title = hasApiKey() ? 'Save to JSONBin.io' : 'Configure API key first';
    this.pullBtn.title = isConfigured() ? 'Load from JSONBin.io' : 'Configure API key + bin ID first';
  }
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
