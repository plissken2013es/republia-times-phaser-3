import Phaser from 'phaser';

import { Const } from '../constants/Const';
import { FONT_FEED, IMG_STAT_METER } from '../constants/AssetKeys';
import { Readership } from '../game/Readership';

class StatMeter {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private needle: Phaser.GameObjects.Graphics;
  private valueText: Phaser.GameObjects.BitmapText;
  public width: number;

  public constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    const base = scene.add.image(0, 0, IMG_STAT_METER).setOrigin(0, 0);
    this.width = base.width;
    const centerX = this.width / 2;

    const nameText = scene.add.bitmapText(centerX, 34, FONT_FEED, name, 10);
    nameText.setOrigin(0.5, 0);
    nameText.setTint(0xffffff);

    this.valueText = scene.add.bitmapText(centerX, 24, FONT_FEED, '0', 10);
    this.valueText.setOrigin(0.5, 0);
    this.valueText.setTint(0xffffff);

    this.needle = scene.add.graphics();
    this.container.add([base, this.needle, this.valueText, nameText]);
  }

  public setValue(value: number): void {
    this.valueText.setText(`${value}`);

    const centerX = this.width / 2;
    const centerY = 23;
    const radius = this.width / 2 - 10;
    const angle = (-Math.PI / 2) + (value / Const.statMax) * (Math.PI / 2);

    this.needle.clear();
    this.needle.lineStyle(2, 0x000000, 1);
    this.needle.lineBetween(
      centerX,
      centerY,
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle),
    );
  }
}

export class StatMeters {
  private readerCountText: Phaser.GameObjects.BitmapText;
  private loyaltyMeter: StatMeter;

  public constructor(scene: Phaser.Scene, x: number, y: number, onWhite: boolean) {
    // Create loyalty meter first to get its width for centering
    this.loyaltyMeter = new StatMeter(scene, x, y + 25, 'Loyalty');
    const centerX = x + this.loyaltyMeter.width / 2;

    const readerNameText = scene.add.bitmapText(centerX, y, FONT_FEED, 'Readers', 10);
    readerNameText.setOrigin(0.5, 0);
    readerNameText.setTint(onWhite ? 0x000000 : 0xffffff);

    this.readerCountText = scene.add.bitmapText(centerX, y + 12, FONT_FEED, '0', 10);
    this.readerCountText.setOrigin(0.5, 0);
    this.readerCountText.setTint(onWhite ? 0x000000 : 0xffffff);
  }

  public setValues(readership: Readership, showDelta: boolean): void {
    let text = `${readership.curReaderCount}`;
    if (showDelta) {
      const delta = readership.curReaderCount - readership.preReaderCount;
      if (delta < 0) text += ` (${delta})`;
      if (delta > 0) text += ` (+${delta})`;
    }
    this.readerCountText.setText(text);
    this.loyaltyMeter.setValue(readership.curLoyalty);
  }
}
