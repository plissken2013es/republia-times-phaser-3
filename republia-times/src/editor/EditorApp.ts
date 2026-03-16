import { EditorState } from './editorState';
import { Toolbar } from './components/Toolbar';
import { ArticleList } from './components/ArticleList';
import { ArticleForm } from './components/ArticleForm';

class EditorApp {
  public constructor() {
    const root = document.getElementById('editor-root');
    if (!root) throw new Error('Missing #editor-root');

    const state = new EditorState();

    // Toolbar
    new Toolbar(root, state);

    // Main layout
    const main = document.createElement('div');
    main.className = 'main';
    root.appendChild(main);

    // List + Form panels
    new ArticleList(main, state);
    new ArticleForm(main, state);

    // Dirty-state guard
    window.addEventListener('beforeunload', (e) => {
      if (state.dirty) {
        e.preventDefault();
      }
    });

    // Select first article by default
    if (state.articles.length > 0) {
      state.selectByLegacyIndex(state.articles[0].legacyIndex);
    }
  }
}

new EditorApp();
