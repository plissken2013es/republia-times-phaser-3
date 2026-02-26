import { GameState } from './GameState';
import { Readership } from './Readership';

export class Goal {
  public static readonly kStatusNone = 0;
  public static readonly kStatusNotWorking = 1;
  public static readonly kStatusWorkingTowards = 2;
  public static readonly kStatusMet = 3;

  public id: string;
  public targetDayNumber: number;
  public targetLoyalty: number;
  public targetReaderCount: number;

  public constructor(
    id: string,
    targetDayNumber: number,
    targetLoyalty: number,
    targetReaderCount: number,
  ) {
    this.id = id;
    this.targetDayNumber = targetDayNumber;
    this.targetLoyalty = targetLoyalty;
    this.targetReaderCount = targetReaderCount;
  }

  public isMet(readership: Readership): boolean {
    if (this.targetLoyalty < 0 && readership.curLoyalty > this.targetLoyalty) return false;
    if (this.targetLoyalty > 0 && readership.curLoyalty < this.targetLoyalty) return false;
    if (this.targetReaderCount && readership.curReaderCount < this.targetReaderCount) return false;
    return true;
  }

  public getStatus(readership: Readership): number {
    if (this.isMet(readership)) return Goal.kStatusMet;

    if (this.targetLoyalty < 0 && readership.curLoyalty > this.targetLoyalty) {
      if (readership.getLoyaltyDelta() < 0) return Goal.kStatusWorkingTowards;
      return Goal.kStatusNotWorking;
    }
    if (this.targetLoyalty > 0 && readership.curLoyalty < this.targetLoyalty) {
      if (readership.getLoyaltyDelta() > 0) return Goal.kStatusWorkingTowards;
      return Goal.kStatusNotWorking;
    }
    if (this.targetReaderCount && readership.curReaderCount < this.targetReaderCount) {
      if (readership.getReaderCountDelta() > 0) return Goal.kStatusWorkingTowards;
      return Goal.kStatusNotWorking;
    }

    return Goal.kStatusNone;
  }

  public toString(): string {
    return `day=${this.targetDayNumber} loy=${this.targetLoyalty} cnt=${this.targetReaderCount}`;
  }

  public static readonly allGoals: Goal[] = [
    new Goal('first-state', 3, 20, 0),
    new Goal('second-state', 5, 20, 400),
    new Goal('last-rebel', 10, -30, 1000),
  ];

  public static getGoalForDay(dayNumber: number): Goal | null {
    for (const goal of Goal.allGoals) {
      if (goal.targetDayNumber >= dayNumber) return goal;
    }
    return null;
  }

  public static getCurGoalStatus(readership?: Readership, dayNumber?: number): number {
    if (readership && dayNumber !== undefined) {
      const goal = Goal.getGoalForDay(dayNumber);
      if (!goal) return Goal.kStatusNone;
      return goal.getStatus(readership);
    }

    const goal = Goal.getGoalForDay(GameState.instance.dayNumber);
    if (!goal) return Goal.kStatusNone;
    return goal.getStatus(GameState.instance.readership);
  }
}
