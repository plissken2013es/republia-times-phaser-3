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
    return GameState.instance.stateInControl ? 'Republia' : 'Democria';
  }

  public static expandGovNames(str: string): string {
    return str.replace(/\[GOV\]/g, GameState.getGovName());
  }
}
