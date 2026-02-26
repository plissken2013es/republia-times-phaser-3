import { beforeEach, describe, expect, it } from 'vitest';

import { GameState } from '../game/GameState';
import { NewsItem } from '../game/NewsItem';
import { Storage } from './Storage';

const makeLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
};

describe('Storage', () => {
  beforeEach(() => {
    const mock = makeLocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mock,
      configurable: true,
    });
    GameState.instance.reset();
  });

  it('returns false for invalid save data', () => {
    localStorage.setItem('republiatimes-save', JSON.stringify({ version: 2 }));
    expect(Storage.load()).toBe(false);
  });

  it('saves and loads core fields', () => {
    const gs = GameState.instance;
    gs.dayNumber = 4;
    gs.readership.curLoyalty = 10;
    gs.readership.curReaderCount = 350;
    gs.stateInControl = false;
    gs.haveWonAtLeastOnce = true;
    gs.savedMute = true;
    NewsItem.allNewsItems[0].used = true;

    Storage.save();
    gs.dayNumber = 1;
    gs.readership.curLoyalty = 0;
    gs.readership.curReaderCount = 200;
    gs.stateInControl = true;
    gs.haveWonAtLeastOnce = false;
    gs.savedMute = false;
    NewsItem.resetAllNewsItems();

    expect(Storage.load()).toBe(true);
    expect(gs.dayNumber).toBe(4);
    expect(gs.readership.curLoyalty).toBe(10);
    expect(gs.readership.curReaderCount).toBe(350);
    expect(gs.stateInControl).toBe(false);
    expect(gs.haveWonAtLeastOnce).toBe(true);
    expect(gs.savedMute).toBe(true);
    expect(NewsItem.allNewsItems[0].used).toBe(true);
  });
});
