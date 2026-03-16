import Phaser from 'phaser';

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
import { Storage } from '../utils/Storage';

export class MorningScene extends Phaser.Scene {
  public static readonly KEY = 'MorningScene';

  private statMeters?: StatMeters;
  private muteButton?: MuteButton;

  public constructor() {
    super(MorningScene.KEY);
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    this.sound.mute = GameState.instance.savedMute;
    this.sound.stopAll();
    this.sound.play(MUSIC_MAIN, { loop: true, volume: 0.5 });

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

    const messageText = this.add.bitmapText(100, 90, FONT_FEED, message, 8);
    messageText.setMaxWidth(340);
    messageText.setLineSpacing(2);
    messageText.setTint(rebelsWon ? 0xff0000 : 0x000000);
    // Match original: center text vertically around y=180
    messageText.y = 180 - messageText.height / 2;
    // Clamp so text doesn't go above the header area
    if (messageText.y < 85) messageText.y = 85;

    // Place button below text, but no lower than y=270 (original position)
    const buttonY = Math.max(270, messageText.y + messageText.height + 12);

    const button = this.add.image(270, buttonY, IMG_BUTTON).setOrigin(0.5, 0.5).setDepth(10);
    const buttonLabel = this.add.bitmapText(
      270,
      buttonY,
      FONT_FEED,
      rebelsWon ? "Let's Go!" : (gameOver ? 'Accept Fate' : 'Start Work'),
      8,
    ).setOrigin(0.5, 0.5).setTint(0x000000).setDepth(11);

    const onClick = () => {
      if (gameOver) {
        gs.haveWonAtLeastOnce = true;
        Storage.clear();
        gs.reset();
        this.scene.start('MorningScene');
      } else {
        this.scene.start('PlayScene');
      }
    };
    button.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    buttonLabel.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);

    const dayText = this.add.bitmapText(245, 70, FONT_FEED, `Day ${dayNumber}`, 8);
    dayText.setMaxWidth(50);
    dayText.setCenterAlign();
    dayText.setTint(0x000000);

    const creditsText = this.add.bitmapText(540 - 120, 285, FONT_FEED, 'by\nLucas Pope\n@dukope', 8);
    creditsText.setMaxWidth(120);
    creditsText.setRightAlign();
    creditsText.setLineSpacing(4);
    creditsText.setTint(0x000000);

    if (dayNumber > 1) {
      this.statMeters = new StatMeters(this, 450, 120, true);
      this.statMeters.setValues(rs, false);
    }

    this.muteButton = new MuteButton(this, 10, 300);

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
    let gameOver = false;
    let rebelsWon = false;

    const killMessage = 'Your services are no longer required. Your family has been eliminated and you will be reassigned.';
    let message = '';

    if (dayNumber === 1 && goal) {
      message += 'Welcome to The [GOV] Times. You are the new editor-in-chief.\n\n';
      if (gs.stateInControl) {
        message += 'The war with Antegria is over and the rebellion uprising has been crushed. Order is slowly returning to [GOV].\n\n';
        message += 'The public is not loyal to the government.\n\n';
      } else {
        message += 'Freedom has returned to [GOV], but the public is skeptical.\n\n';
      }
      message += 'It is your job to increase their loyalty by editing The [GOV] Times carefully. ';
      message += 'Pick only stories that highlight the good things about [GOV] and its government.\n\n';
      message += `You have 3 days to raise the public's loyalty to ${goal.targetLoyalty}.\n\n`;

      if (gs.haveWonAtLeastOnce) {
        message += 'We have found a new wife and child for you. ';
        message += 'As a precaution against influence, we are keeping them in a safe location.';
      } else {
        message += 'As a precaution against influence, we are keeping your wife and child in a safe location.';
      }
    } else if (goal && prevGoal && goal !== prevGoal) {
      if (prevGoal.id === 'first-state') {
        if (rs.curLoyalty >= prevGoal.targetLoyalty) {
          message += 'You have completed your first task. The Great and Honorable Leader is pleased.\n\n';
          message += `Continue to print positive articles and maintain a loyalty of at least ${goal.targetLoyalty}.\n\n`;
          message += 'We must now work to increase readership. More minds is more power.\n\n';
          message += `Attain at least ${goal.targetReaderCount} readers by the end of day ${goal.targetDayNumber}.`;
        } else {
          message += 'You have failed to inspire your readers and their loyalty remains weak.\n\n';
          message += killMessage;
          gameOver = true;
        }
      } else if (prevGoal.id === 'second-state') {
        if (prevGoal.isMet(rs)) {
          message += 'Congratulations, you have completed your second task. The Great and Honorable Leader is pleased.\n\n';
          message += 'From this point we will withdraw our close oversight.\n\n';
          message += 'Continue to increase readership and maintain the promotion of positive news.';
        } else {
          message += `You have failed to acquire enough readers with loyalty ${goal.targetLoyalty}. Without a loyal audience, The [GOV] Times has no influence.\n\n`;
          message += killMessage;
          gameOver = true;
        }
      }
    } else if (goal && goal.id.includes('state')) {
      if (rs.curLoyalty >= goal.targetLoyalty) {
        message += 'Good work. The Great and Honorable Leader has been notified of your diligent efforts.\n\n';
        message += `Keep your reader's loyalty at ${goal.targetLoyalty} or higher.`;
      } else if (rs.getLoyaltyDelta() > 0) {
        message += 'You are making good progress.\n\n';
        message += `Keep working towards a loyalty of ${goal.targetLoyalty} or above by the end of day ${goal.targetDayNumber}.`;
      } else if (rs.getLoyaltyDelta() < 0) {
        message += 'This is not good. Loyalty is dropping.\n';
        message += 'You must choose positive articles that cast [GOV] in a good light. Try harder.\n\n';
        message += `Bring your reader's loyalty to at least ${goal.targetLoyalty} by the end of day ${goal.targetDayNumber}.`;
      } else {
        message += 'This is not good. Loyalty is not improving.\n';
        message += 'You must choose positive articles that cast [GOV] in a good light. Try harder.\n\n';
        message += `Bring your reader's loyalty to at least ${goal.targetLoyalty} by the end of day ${goal.targetDayNumber}.`;
      }
      if (goal.targetReaderCount) {
        message += '\n';
        if (rs.curReaderCount >= goal.targetReaderCount) {
          message += `Maintain at least ${goal.targetReaderCount} readers.`;
        } else {
          message += `You must have ${goal.targetReaderCount} or more readers by the end of day ${goal.targetDayNumber}.`;
        }
      }
      message += '\n\n';
      message += this.getFamilyMessage(rs.curLoyalty);
    } else if (goal) {
      if (rs.getLoyaltyDelta() >= 0) {
        message += 'Good morning.\n\n';
      }
      if (rs.getLoyaltyDelta() < 0) {
        message += 'A drop in reader loyalty has been noted. Try harder.\n\n';
      }
      message += `${this.getPerformanceMessage(rs.curLoyalty)}\n${this.getFamilyMessage(rs.curLoyalty)}`;
    } else {
      if (prevGoal && prevGoal.isMet(rs)) {
        message += 'We have done it!\n\n';
        message += 'Thank you my friend! Without your efforts the rebellion would have failed once again. ';
        message += 'A new era for our beloved nation begins!\n\n';
        message += "I'm truly sorry that we could not save your family.\n\n";
        message += 'We need someone with your skills to talk with the people. Come back tomorrow for your new position.\n\n';
        message += 'Long Live [GOV]!';
        gs.stateInControl = !gs.stateInControl;
        rebelsWon = true;
      } else {
        message += 'We have reviewed your file.\n\n';
        message += `${this.getPerformanceMessage(rs.curLoyalty)}\n\n`;
        message += 'The Great and Honorable Leader has decided that printed paper is old technology. ';
        message += 'The Ministry of Media will be moving to focus on online communications.\n\n';
        message += killMessage;
      }
      gameOver = true;
    }

    message += '\n\n';
    if (!gameOver) message += this.getTutorialMessage(dayNumber);

    message = GameState.expandGovNames(message);
    return { message, gameOver, rebelsWon };
  }

  private getPerformanceMessage(loyalty: number): string {
    let str = 'Your performance is: -';
    if (loyalty >= Const.statMax) str += 'APPRECIATED';
    else if (loyalty > (Const.statMax * 2) / 3) str += 'ACCEPTABLE';
    else if (loyalty > Const.statMax / 3) str += 'MARGINAL';
    else if (loyalty >= -(Const.statMax / 3)) str += 'UNSATISFACTORY';
    else if (loyalty <= -Const.statMax) str += 'DISASTROUS';
    else if (loyalty < -(Const.statMax * 2) / 3) str += 'DISASTROUS';
    else if (loyalty < -(Const.statMax / 3)) str += 'DISAPPOINTING';
    str += '-';
    return str;
  }

  private getFamilyMessage(loyalty: number): string {
    let str = 'Your family ';
    if (loyalty >= Const.statMax) str += 'is receiving excellent treatment.';
    else if (loyalty > (Const.statMax * 2) / 3) str += 'is being well-cared for.';
    else if (loyalty > Const.statMax / 3) str += 'lives normally under our care.';
    else if (loyalty >= -(Const.statMax / 3)) str += 'has lost several privileges.';
    else if (loyalty <= -Const.statMax) str += 'endures daily beatings.';
    else if (loyalty < -(Const.statMax * 2) / 3) str += 'suffers due to your failures.';
    else if (loyalty < -(Const.statMax / 3)) str += 'is being punished for your poor performance.';
    return str;
  }

  private getTutorialMessage(dayNumber: number): string {
    if (dayNumber === 2) {
      return '__________________________________________\nArticle Size\n\nLarger articles have more influence on your reader\'s loyalty. Use this to emphasize the stories you want and to downplay unflattering ones.\n';
    }
    if (dayNumber === 3) {
      return '__________________________________________\nReader Interest\n\nThe public is interested in sports, entertainment, and military matters. They are also fascinated by the weather. Choose stories on these topics to increase readership.\n';
    }
    if (dayNumber === 4) {
      return '__________________________________________\nArticle Positioning\n\nArticle placement has no effect on loyalty or reader interest. Only the size and content of stories matter. Use your vast artistic and design experience to arrange articles in a way that pleases you.';
    }
    if (dayNumber === 5) {
      return '__________________________________________\nWeather\n\nThe government cannot control the weather yet. As a result, articles about the weather do not affect loyalty.';
    }
    if (dayNumber === 6) {
      return '__________________________________________\nPolitics\n\nThe public finds political stories uninteresting, but positive articles on political subjects can increase loyalty.';
    }
    if (dayNumber === 7) {
      return '__________________________________________\nArticle Size and Reader Interest\n\nArticle size does not affect reader interest. If a paper contains articles on interesting topics of any size, readers will be interested.';
    }
    return '';
  }
}
