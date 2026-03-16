import Phaser from 'phaser';

import { CenterPopup } from '../components/CenterPopup';
import { Clock } from '../components/Clock';
import { Feed } from '../components/Feed';
import { MuteButton } from '../components/MuteButton';
import { Paper } from '../components/Paper';
import { StatMeters } from '../components/StatMeters';
import { GameState } from '../game/GameState';
import { Day } from '../game/Day';
import { Goal } from '../game/Goal';
import { Const } from '../constants/Const';
import { FONT_FEED, IMG_BACKGROUND, IMG_BUTTON, IMG_LOGO_SMALL, SFX_ALARM, SFX_DAY_OVER, SFX_NULL } from '../constants/AssetKeys';
import { Storage } from '../utils/Storage';

export class PlayScene extends Phaser.Scene {
  public static readonly KEY = 'PlayScene';

  private clock?: Clock;
  private statMeters?: StatMeters;
  private feed?: Feed;
  private paper?: Paper;
  private popup?: CenterPopup;
  private day?: Day;
  private time = 0;
  private speed = 1;
  private alarmPlayed = false;
  private dayOver = false;
  private appeared = new Set<number>();
  private muteButton?: MuteButton;
  private scoreOverlay?: Phaser.GameObjects.BitmapText;
  private scoreVisible = false;

  public constructor() {
    super(PlayScene.KEY);
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    this.sound.mute = GameState.instance.savedMute;
    this.sound.stopAll();
    this.sound.play(SFX_NULL, { loop: true, volume: 0.1 });

    this.add.image(0, 0, IMG_BACKGROUND).setOrigin(0, 0);

    // Newspaper title logo — matches original at (360, 10)
    this.add.image(360, 10, IMG_LOGO_SMALL).setOrigin(0, 0);

    this.clock = new Clock(this, GameState.instance.dayNumber);
    this.statMeters = new StatMeters(this, 3, 240, true);
    this.statMeters.setValues(GameState.instance.readership, false);
    this.paper = new Paper(this);
    this.feed = new Feed(this, this.paper);
    this.popup = new CenterPopup(this);
    this.day = new Day(GameState.instance.dayNumber);
    this.day.newsItems.sort((a, b) => a.appearTime - b.appearTime);
    this.time = 0;
    this.speed = GameState.instance.dayNumber === 1 ? 0.5 : 1;
    this.alarmPlayed = false;
    this.dayOver = false;

    const button = this.add.image(30, 104, IMG_BUTTON).setOrigin(0.5, 0.5).setDisplaySize(60, 20);
    const label = this.add.bitmapText(30, 104, FONT_FEED, 'End Day', 10)
      .setOrigin(0.5, 0.5)
      .setTint(0x000000);

    button.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.speed = 10;
    });
    label.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.speed = 10;
    });

    this.muteButton = new MuteButton(this, 265, 5);

    if (import.meta.env.DEV) {
      const kb = this.input.keyboard;
      if (!kb) return;
      kb.on('keydown-K', () => {
        const summary = this.paper?.getSummary();
        if (summary) {
          GameState.instance.readership.applyPaperSummary(summary);
          this.paper?.markNewsItemsUsed();
        }
        GameState.instance.dayNumber += 1;
        this.scene.start('PlayScene');
      });
      kb.on('keydown-L', () => {
        this.toggleScoreOverlay();
      });
    }

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  public update(_: number, delta: number): void {
    if (!this.day || !this.feed || !this.paper || !this.popup || this.dayOver) return;
    const deltaSeconds = (delta / 1000) * this.speed;
    this.time += deltaSeconds;

    const timeFraction = this.time / Const.dayDuration;
    this.clock?.setTime(Math.min(timeFraction, 1));
    this.feed.update(deltaSeconds);

    if (!this.alarmPlayed && timeFraction >= 0.75) {
      this.alarmPlayed = true;
      this.sound.play(SFX_ALARM, { volume: 0.25 });
    }

    this.day.newsItems.forEach((item, index) => {
      if (this.appeared.has(index)) return;
      if (item.appearTime <= this.time) {
        this.appeared.add(index);
        this.feed?.addBlurb(item);
      }
    });

    if (this.time >= Const.dayDuration) {
      this.dayOver = true;
      this.feed.enabled = false;
      this.paper.enabled = false;
      this.sound.play(SFX_DAY_OVER, { volume: 0.25 });
      this.popup.show(
        'The day is over. There is no more time. We must send to print immediately.',
        'Send to Print',
        () => {
        const summary = this.paper?.getSummary();
        if (summary) {
          GameState.instance.readership.applyPaperSummary(summary);
          this.paper?.markNewsItemsUsed();
        }
        Storage.save();
        this.scene.start('NightScene');
      });
    }
  }

  private toggleScoreOverlay(): void {
    if (!import.meta.env.DEV) return;
    this.scoreVisible = !this.scoreVisible;

    if (!this.scoreOverlay) {
      this.scoreOverlay = this.add.bitmapText(Const.paperX, 310, FONT_FEED, '', 10);
      this.scoreOverlay.setTint(0xff0000);
    }

    if (this.scoreVisible) {
      const summary = this.paper?.getSummary();
      const goal = Goal.getGoalForDay(GameState.instance.dayNumber);
      const goalText = goal ? ` | Goal: ${goal.toString()}` : '';
      this.scoreOverlay.setText(`${summary?.toString() ?? ''}${goalText}`);
      this.scoreOverlay.setVisible(true);
    } else {
      this.scoreOverlay.setVisible(false);
    }
  }
}
