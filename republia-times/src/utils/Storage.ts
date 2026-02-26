import { GameState } from '../game/GameState';
import { NewsItem } from '../game/NewsItem';

interface SaveData {
  version: 1;
  dayNumber: number;
  loyalty: number;
  readerCount: number;
  stateInControl: boolean;
  haveWonAtLeastOnce: boolean;
  usedNewsItemIndices: number[];
  mute: boolean;
}

const STORAGE_KEY = 'republiatimes-save';

export class Storage {
  public static save(): void {
    const gs = GameState.instance;
    const usedNewsItemIndices = NewsItem.allNewsItems
      .map((item, index) => (item.used ? index : -1))
      .filter((index) => index >= 0);

    const payload: SaveData = {
      version: 1,
      dayNumber: gs.dayNumber,
      loyalty: gs.readership.curLoyalty,
      readerCount: gs.readership.curReaderCount,
      stateInControl: gs.stateInControl,
      haveWonAtLeastOnce: gs.haveWonAtLeastOnce,
      usedNewsItemIndices,
      mute: gs.savedMute,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore persistence errors
    }
  }

  public static load(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      if (!Storage.isValidSaveData(parsed)) return false;

      const gs = GameState.instance;
      gs.dayNumber = parsed.dayNumber;
      gs.readership.curLoyalty = parsed.loyalty;
      gs.readership.preLoyalty = parsed.loyalty;
      gs.readership.curReaderCount = parsed.readerCount;
      gs.readership.preReaderCount = parsed.readerCount;
      gs.stateInControl = parsed.stateInControl;
      gs.haveWonAtLeastOnce = parsed.haveWonAtLeastOnce;
      gs.savedMute = parsed.mute;

      NewsItem.resetAllNewsItems();
      for (const index of parsed.usedNewsItemIndices) {
        if (NewsItem.allNewsItems[index]) {
          NewsItem.allNewsItems[index].used = true;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  public static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public static getMute(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      if (!Storage.isValidSaveData(parsed)) return false;
      return parsed.mute;
    } catch {
      return false;
    }
  }

  public static setMute(muted: boolean): void {
    GameState.instance.savedMute = muted;
    Storage.save();
  }

  private static isValidSaveData(data: Partial<SaveData>): data is SaveData {
    return (
      data.version === 1
      && typeof data.dayNumber === 'number'
      && typeof data.loyalty === 'number'
      && typeof data.readerCount === 'number'
      && typeof data.stateInControl === 'boolean'
      && typeof data.haveWonAtLeastOnce === 'boolean'
      && Array.isArray(data.usedNewsItemIndices)
      && typeof data.mute === 'boolean'
    );
  }
}
