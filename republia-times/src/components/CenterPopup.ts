import Phaser from 'phaser';

export class CenterPopup {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private messageText: Phaser.GameObjects.Text;
  private button: Phaser.GameObjects.Rectangle;
  private buttonLabel: Phaser.GameObjects.Text;
  private onConfirm: (() => void) | null = null;

  public visible = false;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.background = scene.add.rectangle(270, 160, 400, 180, 0xffffff).setStrokeStyle(2, 0x000000);
    this.messageText = scene.add.text(120, 110, '', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#000000',
      wordWrap: { width: 300 },
    });

    this.button = scene.add.rectangle(270, 250, 140, 30, 0xcccccc);
    this.buttonLabel = scene.add.text(270, 250, 'OK', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#000000',
    }).setOrigin(0.5, 0.5);

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
