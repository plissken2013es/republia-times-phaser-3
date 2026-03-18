import Phaser from 'phaser';

import { LanguageButton } from '../components/LanguageButton';
import { MuteButton } from '../components/MuteButton';
import { StatMeters } from '../components/StatMeters';
import { Const } from '../constants/Const';
import {
  FONT_FEED,
  IMG_BUTTON,
  IMG_LOGO,
  IMG_LOGO2,
  IMG_MORNING,
  MUSIC_MAIN,
} from '../constants/AssetKeys';
import { GameState } from '../game/GameState';
import { Goal } from '../game/Goal';
import { Readership } from '../game/Readership';
import { S } from '../locale/locale';
import { Storage } from '../utils/Storage';

export class MorningScene extends Phaser.Scene {
  public static readonly KEY = 'MorningScene';

  private statMeters?: StatMeters;
  private muteButton?: MuteButton;
  private langButton?: LanguageButton;

  public constructor() {
    super(MorningScene.KEY);
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    this.sound.mute = GameState.instance.savedMute;
    this.sound.stopAll();
    if (this.sound.locked) {
      this.sound.once('unlocked', () => {
        this.sound.play(MUSIC_MAIN, { loop: true, volume: 0.5 });
      });
    } else {
      this.sound.play(MUSIC_MAIN, { loop: true, volume: 0.5 });
    }

    const gs = GameState.instance;
    const rs = gs.readership;
    const dayNumber = gs.dayNumber;
    const goal = Goal.getGoalForDay(dayNumber);
    const prevGoal = Goal.getGoalForDay(dayNumber - 1);

    const { message, gameOver, rebelsWon } = this.buildMessage(goal, prevGoal);

    this.add.image(0, 0, IMG_MORNING).setOrigin(0, 0);

    const logoKey = gs.stateInControl ? IMG_LOGO : IMG_LOGO2;
    const logoSprite = this.add.image(0, 20, logoKey).setOrigin(0, 0);
    logoSprite.x = 270 - logoSprite.width / 2;

    // Position everything below the logo
    const logoBottom = 20 + logoSprite.height;
    const dayTextY = logoBottom + 4;
    const messageTop = dayTextY + 16;

    const messageText = this.add.bitmapText(100, messageTop, FONT_FEED, message, 10);
    messageText.setMaxWidth(340);
    messageText.setLineSpacing(0);
    messageText.setTint(rebelsWon ? 0xff0000 : 0x000000);
    // Center text vertically in the remaining space between messageTop and button area
    const availableSpace = 270 - messageTop;
    messageText.y = messageTop + Math.max(0, (availableSpace - messageText.height) / 2);

    // Place button below text, but no lower than y=280
    const buttonY = Math.max(280, messageText.y + messageText.height + 12);

    const button = this.add.image(270, buttonY, IMG_BUTTON).setOrigin(0.5, 0.5).setDepth(10);
    const buttonLabel = this.add.bitmapText(
      270,
      buttonY,
      FONT_FEED,
      rebelsWon ? S().ui_letsGo : (gameOver ? S().ui_acceptFate : S().ui_startWork),
      10,
    ).setOrigin(0.5, 0.5).setTint(0x000000).setDepth(11);

    const onClick = () => {
      if (gameOver) {
        gs.haveWonAtLeastOnce = true;
        Storage.clear();
        gs.reset();
        this.scene.start('MorningScene');
      } else {
        if (dayNumber === 1) {
          gs.readership = new Readership();
        }
        this.scene.start('PlayScene');
      }
    };
    button.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    buttonLabel.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);

    const dayText = this.add.bitmapText(270, dayTextY, FONT_FEED, `${S().ui_day} ${dayNumber}`, 10);
    dayText.setOrigin(0.5, 0);
    dayText.setTint(0x000000);

    const creditsText = this.add.bitmapText(540 - 120, 285, FONT_FEED, S().ui_credits, 10);
    creditsText.setMaxWidth(120);
    creditsText.setRightAlign();
    creditsText.setLineSpacing(0);
    creditsText.setTint(0x000000);

    if (dayNumber > 1) {
      this.statMeters = new StatMeters(this, 450, 120, true);
      this.statMeters.setValues(rs, false);
    }

    this.muteButton = new MuteButton(this, 10, 300);
    this.langButton = new LanguageButton(this, 50, 300);

    if (import.meta.env.DEV) {
      const kb = this.input.keyboard;
      if (!kb) return;
      kb.on('keydown-K', () => {
        gs.dayNumber += 1;
        this.scene.start('MorningScene');
      });
      kb.on('keydown-O', () => {
        gs.readership.curLoyalty = Math.max(-Const.statMax, gs.readership.curLoyalty - 10);
        this.scene.start('MorningScene');
      });
      kb.on('keydown-P', () => {
        gs.readership.curLoyalty = Math.min(Const.statMax, gs.readership.curLoyalty + 10);
        this.scene.start('MorningScene');
      });
      kb.on('keydown-N', () => {
        gs.readership.curReaderCount = Math.max(0, gs.readership.curReaderCount - 100);
        this.scene.start('MorningScene');
      });
      kb.on('keydown-M', () => {
        gs.readership.curReaderCount += 100;
        this.scene.start('MorningScene');
      });
    }

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  private buildMessage(goal: Goal | null, prevGoal: Goal | null): { message: string; gameOver: boolean; rebelsWon: boolean } {
    const gs = GameState.instance;
    const rs = gs.readership;
    const dayNumber = gs.dayNumber;
    const L = S();
    let gameOver = false;
    let rebelsWon = false;

    let message = '';

    if (dayNumber === 1 && goal) {
      message += L.morning_welcome + '\n \n';
      if (gs.stateInControl) {
        message += L.morning_warOver + '\n \n';
        message += L.morning_publicNotLoyal + '\n \n';
      } else {
        message += L.morning_freedomReturned + '\n \n';
      }
      message += L.morning_jobIncreaseLoyalty + '\n \n';
      message += L.morning_haveDaysLoyalty(3, goal.targetLoyalty) + '\n \n';

      if (gs.haveWonAtLeastOnce) {
        message += L.morning_newFamily;
      } else {
        message += L.morning_familyHostage;
      }
    } else if (goal && prevGoal && goal !== prevGoal) {
      if (prevGoal.id === 'first-state') {
        if (rs.curLoyalty >= prevGoal.targetLoyalty) {
          message += L.morning_firstTaskComplete + '\n \n';
          message += L.morning_continuePrint(goal.targetLoyalty) + '\n \n';
          message += L.morning_increaseReadership + '\n \n';
          message += L.morning_attainReaders(goal.targetReaderCount, goal.targetDayNumber);
        } else {
          message += L.morning_failedInspire + '\n \n';
          message += L.morning_killMessage;
          gameOver = true;
        }
      } else if (prevGoal.id === 'second-state') {
        if (prevGoal.isMet(rs)) {
          message += L.morning_secondTaskComplete + '\n \n';
          message += L.morning_withdrawOversight + '\n \n';
          message += L.morning_continueIncrease;
        } else {
          message += L.morning_failedReaders(goal.targetLoyalty) + '\n \n';
          message += L.morning_killMessage;
          gameOver = true;
        }
      }
    } else if (goal && goal.id.includes('state')) {
      if (rs.curLoyalty >= goal.targetLoyalty) {
        message += L.morning_goodWork + '\n \n';
        message += L.morning_keepLoyalty(goal.targetLoyalty);
      } else if (rs.getLoyaltyDelta() > 0) {
        message += L.morning_goodProgress + '\n \n';
        message += L.morning_keepWorking(goal.targetLoyalty, goal.targetDayNumber);
      } else if (rs.getLoyaltyDelta() < 0) {
        message += L.morning_loyaltyDropping + '\n';
        message += L.morning_tryHarder + '\n \n';
        message += L.morning_bringLoyalty(goal.targetLoyalty, goal.targetDayNumber);
      } else {
        message += L.morning_loyaltyNotImproving + '\n';
        message += L.morning_tryHarder + '\n \n';
        message += L.morning_bringLoyalty(goal.targetLoyalty, goal.targetDayNumber);
      }
      if (goal.targetReaderCount) {
        message += '\n';
        if (rs.curReaderCount >= goal.targetReaderCount) {
          message += L.morning_maintainReaders(goal.targetReaderCount);
        } else {
          message += L.morning_mustHaveReaders(goal.targetReaderCount, goal.targetDayNumber);
        }
      }
      message += '\n \n';
      message += this.getFamilyMessage(rs.curLoyalty);
    } else if (goal) {
      if (rs.getLoyaltyDelta() >= 0) {
        message += L.morning_goodMorning + '\n \n';
      }
      if (rs.getLoyaltyDelta() < 0) {
        message += L.morning_loyaltyDropNoted + '\n \n';
      }
      message += `${this.getPerformanceMessage(rs.curLoyalty)}\n${this.getFamilyMessage(rs.curLoyalty)}`;
    } else {
      if (prevGoal && prevGoal.isMet(rs)) {
        message += L.morning_rebelsWon + '\n \n';
        message += L.morning_rebelThanks + '\n \n';
        message += L.morning_rebelSorry + '\n \n';
        message += L.morning_rebelNewPosition + '\n \n';
        message += L.morning_longLive;
        gs.stateInControl = !gs.stateInControl;
        rebelsWon = true;
      } else {
        message += L.morning_reviewedFile + '\n \n';
        message += `${this.getPerformanceMessage(rs.curLoyalty)}\n \n`;
        message += L.morning_oldTechnology + '\n \n';
        message += L.morning_killMessage;
      }
      gameOver = true;
    }

    message += '\n \n';
    if (!gameOver) message += this.getTutorialMessage(dayNumber);

    message = GameState.expandGovNames(message);
    return { message, gameOver, rebelsWon };
  }

  private getPerformanceMessage(loyalty: number): string {
    const L = S();
    let str = L.perf_header;
    if (loyalty >= Const.statMax) str += L.perf_appreciated;
    else if (loyalty > (Const.statMax * 2) / 3) str += L.perf_acceptable;
    else if (loyalty > Const.statMax / 3) str += L.perf_marginal;
    else if (loyalty >= -(Const.statMax / 3)) str += L.perf_unsatisfactory;
    else if (loyalty <= -Const.statMax) str += L.perf_disastrous;
    else if (loyalty < -(Const.statMax * 2) / 3) str += L.perf_disastrous;
    else if (loyalty < -(Const.statMax / 3)) str += L.perf_disappointing;
    str += '-';
    return str;
  }

  private getFamilyMessage(loyalty: number): string {
    const L = S();
    let str = L.family_prefix;
    if (loyalty >= Const.statMax) str += L.family_excellent;
    else if (loyalty > (Const.statMax * 2) / 3) str += L.family_wellCared;
    else if (loyalty > Const.statMax / 3) str += L.family_normal;
    else if (loyalty >= -(Const.statMax / 3)) str += L.family_lostPrivileges;
    else if (loyalty <= -Const.statMax) str += L.family_dailyBeatings;
    else if (loyalty < -(Const.statMax * 2) / 3) str += L.family_suffers;
    else if (loyalty < -(Const.statMax / 3)) str += L.family_punished;
    return str;
  }

  private getTutorialMessage(dayNumber: number): string {
    const L = S();
    if (dayNumber === 2) {
      return `${L.tutorial_separator}\n${L.tutorial_day2_title}\n \n${L.tutorial_day2_body}\n`;
    }
    if (dayNumber === 3) {
      return `${L.tutorial_separator}\n${L.tutorial_day3_title}\n \n${L.tutorial_day3_body}\n`;
    }
    if (dayNumber === 4) {
      return `${L.tutorial_separator}\n${L.tutorial_day4_title}\n \n${L.tutorial_day4_body}`;
    }
    if (dayNumber === 5) {
      return `${L.tutorial_separator}\n${L.tutorial_day5_title}\n \n${L.tutorial_day5_body}`;
    }
    if (dayNumber === 6) {
      return `${L.tutorial_separator}\n${L.tutorial_day6_title}\n \n${L.tutorial_day6_body}`;
    }
    if (dayNumber === 7) {
      return `${L.tutorial_separator}\n${L.tutorial_day7_title}\n \n${L.tutorial_day7_body}`;
    }
    return '';
  }
}
