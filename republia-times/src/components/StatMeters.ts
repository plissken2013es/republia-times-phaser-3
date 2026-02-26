import Phaser from 'phaser';

import { Const } from '../constants/Const';
import { Readership } from '../game/Readership';

class StatMeter {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private needle: Phaser.GameObjects.Graphics;
  private valueText: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene, x: number, y: number, name: string, onWhite: boolean) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    const base = scene.add.rectangle(0, 0, 80, 50, 0x333333).setOrigin(0, 0);
    const nameText = scene.add.text(40, 34, name, {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: onWhite ? '#000000' : '#ffffff',
    }).setOrigin(0.5, 0.5);

    this.valueText = scene.add.text(40, 24, '0', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5);

    this.needle = scene.add.graphics();
    this.container.add([base, this.needle, this.valueText, nameText]);
  }

  public setValue(value: number): void {
    this.valueText.setText(`${value}`);

    const centerX = 40;
    const centerY = 22;
    const radius = 25;
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
  private readerCountText: Phaser.GameObjects.Text;
  private loyaltyMeter: StatMeter;

  public constructor(scene: Phaser.Scene, x: number, y: number, onWhite: boolean) {
    const readerNameText = scene.add.text(x - 10, y, 'Readers', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: onWhite ? '#000000' : '#ffffff',
    }).setOrigin(0, 0);

    this.readerCountText = scene.add.text(x - 10, y + 12, '0', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: onWhite ? '#000000' : '#ffffff',
    }).setOrigin(0, 0);

    this.loyaltyMeter = new StatMeter(scene, x, y + 25, 'Loyalty', onWhite);
    readerNameText.setDepth(1);
    this.readerCountText.setDepth(1);
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
