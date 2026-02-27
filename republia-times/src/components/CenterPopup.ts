import Phaser from 'phaser';

import { FONT_FEED, IMG_BUTTON, IMG_CENTER_POPUP } from '../constants/AssetKeys';

export class CenterPopup {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Image;
  private messageText: Phaser.GameObjects.BitmapText;
  private button: Phaser.GameObjects.Image;
  private buttonLabel: Phaser.GameObjects.BitmapText;
  private onConfirm: (() => void) | null = null;

  public visible = false;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.background = scene.add.image(270, 160, IMG_CENTER_POPUP).setOrigin(0.5, 0.5);
    const left = this.background.x - this.background.width / 2;
    const top = this.background.y - this.background.height / 2;

    this.messageText = scene.add.bitmapText(left + 40, top + 70, FONT_FEED, '', 8);
    this.messageText.setMaxWidth(this.background.width - 80);
    this.messageText.setLineSpacing(8);
    this.messageText.setTint(0xffffff);

    this.button = scene.add.image(this.background.x, top + this.background.height - 35, IMG_BUTTON).setOrigin(0.5, 0.5);
    this.buttonLabel = scene.add.bitmapText(this.button.x, this.button.y, FONT_FEED, 'OK', 8)
      .setOrigin(0.5, 0.5);
    this.buttonLabel.setTint(0x000000);

    this.container = scene.add.container(0, 0, [
      this.background,
      this.messageText,
      this.button,
      this.buttonLabel,
    ]);

    this.button.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      if (this.onConfirm) this.onConfirm();
      this.hide();
    });
    this.buttonLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      if (this.onConfirm) this.onConfirm();
      this.hide();
    });

    this.hide();
  }

  public show(message: string, buttonLabel: string, onConfirm: () => void): void {
    this.onConfirm = onConfirm;
    this.messageText.setText(message);
    this.buttonLabel.setText(buttonLabel);
    this.container.setVisible(true);
    this.visible = true;
  }

  public hide(): void {
    this.container.setVisible(false);
    this.visible = false;
  }
}
