import Phaser from 'phaser';

import { MorningScene } from './scenes/MorningScene';
import { NightScene } from './scenes/NightScene';
import { PlayScene } from './scenes/PlayScene';
import { PreloadScene } from './scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 540,
  height: 320,
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, MorningScene, PlayScene, NightScene],
};

new Phaser.Game(config);
