import Phaser from 'phaser';

import { FONT_FEED } from '../constants/AssetKeys';
import { getLanguage, setLanguage } from '../locale/locale';

export class LanguageButton {
  private text: Phaser.GameObjects.BitmapText;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    const lang = getLanguage();
    this.text = scene.add.bitmapText(x, y, FONT_FEED, lang.toUpperCase(), 10);
    this.text.setOrigin(0, 0);
    this.text.setTint(0x000000);
    this.text.setInteractive({ useHandCursor: true });

    this.text.on('pointerdown', () => {
      const newLang = getLanguage() === 'en' ? 'es' : 'en';
      setLanguage(newLang);
      scene.scene.start('MorningScene');
    });
  }
}
