import Phaser from 'phaser';

import { IMG_MUTE } from '../constants/AssetKeys';
import { GameState } from '../game/GameState';
import { Storage } from '../utils/Storage';

export class MuteButton {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Image;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.add.image(x, y, IMG_MUTE).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    this.updateFrame();

    this.sprite.on('pointerdown', () => {
      this.scene.sound.mute = !this.scene.sound.mute;
      GameState.instance.savedMute = this.scene.sound.mute;
      Storage.setMute(this.scene.sound.mute);
      this.updateFrame();
    });
  }

  private updateFrame(): void {
    this.sprite.setFrame(this.scene.sound.mute ? 1 : 0);
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
