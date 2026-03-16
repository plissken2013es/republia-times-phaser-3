import Phaser from 'phaser';

import { MuteButton } from '../components/MuteButton';
import { StatMeters } from '../components/StatMeters';
import { FONT_FEED, IMG_BUTTON, IMG_PRINTED_PAPER, MUSIC_NIGHT } from '../constants/AssetKeys';
import { GameState } from '../game/GameState';

export class NightScene extends Phaser.Scene {
  public static readonly KEY = 'NightScene';

  private statMeters?: StatMeters;
  private muteButton?: MuteButton;

  public constructor() {
    super(NightScene.KEY);
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#000000');
    this.sound.mute = GameState.instance.savedMute;
    this.sound.stopAll();
    this.sound.play(MUSIC_NIGHT, { loop: true, volume: 0.5 });

    const rs = GameState.instance.readership;

    // Printed paper preview — centered horizontally at y=30
    const paper = this.add.image(270, 30, IMG_PRINTED_PAPER).setOrigin(0.5, 0);

    // Results message at (100, 129) matching original
    const message = this.buildResultsMessage();
    const messageText = this.add.bitmapText(100, 129, FONT_FEED, message, 10);
    messageText.setMaxWidth(340);
    messageText.setLineSpacing(0);
    messageText.setTint(0xffffff);

    // "Go to Sleep" button at (210, 270) matching original
    const button = this.add.image(270, 280, IMG_BUTTON).setOrigin(0.5, 0.5);
    const label = this.add.bitmapText(270, 280, FONT_FEED, 'Go to Sleep', 10)
      .setOrigin(0.5, 0.5)
      .setTint(0x000000);
    const onClick = () => {
      GameState.instance.dayNumber += 1;
      this.scene.start('MorningScene');
    };
    button.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
    label.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);

    // StatMeters in top-right, matching original (440, 120)
    this.statMeters = new StatMeters(this, 450, 120, false);
    this.statMeters.setValues(rs, true);

    this.muteButton = new MuteButton(this, 10, 300);

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  private buildResultsMessage(): string {
    const rs = GameState.instance.readership;
    let message = "Today's issue has been printed and distributed.\n \nRESULTS\n \n";
    message += `      ${this.formatResult('Loyalty', Math.round(rs.curLoyalty), Math.round(rs.curLoyalty - rs.preLoyalty))}\n`;
    message += `      ${this.formatResult('Readership', Math.round(rs.curReaderCount), Math.round(rs.curReaderCount - rs.preReaderCount))}\n \n`;
    message += rs.comments;
    return message;
  }

  private formatResult(name: string, value: number, delta: number): string {
    let str = `${name}: ${value}`;
    if (delta > 0) str += `   (+${delta})`;
    else if (delta < 0) str += `   (${delta})`;
    else str += '   (no change)';
    return str;
  }
}
