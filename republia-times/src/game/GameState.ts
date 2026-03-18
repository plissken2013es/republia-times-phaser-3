import { S } from '../locale/locale';
import { NewsItem } from './NewsItem';
import { Readership } from './Readership';

export class GameState {
  public static instance: GameState = new GameState();

  public dayNumber = 1;
  public readership: Readership = new Readership();
  public stateInControl = true;
  public haveWonAtLeastOnce = false;
  public savedMute = false;

  public reset(): void {
    this.readership = new Readership();
    this.dayNumber = 1;
    NewsItem.resetAllNewsItems();
  }

  public static getGovName(): string {
    // stateInControl kept for future use (e.g. rebel victory renames the state)
    return S().govName;
  }

  public static getEnemyName(): string {
    return S().enemyName;
  }

  public static expandPlaceholders(str: string): string {
    return str
      .replace(/\[GOV\]/g, GameState.getGovName())
      .replace(/\[ENE\]/g, GameState.getEnemyName());
  }

  /** @deprecated Use expandPlaceholders instead */
  public static expandGovNames(str: string): string {
    return GameState.expandPlaceholders(str);
  }
}
