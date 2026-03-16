import Phaser from 'phaser';

import {
  FONT_ARTICLE_B,
  FONT_ARTICLE_M,
  FONT_ARTICLE_S,
  FONT_FEED,
  IMG_ARTICLE_B,
  IMG_ARTICLE_M,
  IMG_ARTICLE_S,
  IMG_BACKGROUND,
  IMG_BLURB,
  IMG_BLURB_ARTICLE_B,
  IMG_BLURB_ARTICLE_M,
  IMG_BLURB_ARTICLE_S,
  IMG_BLURB_CHECK,
  IMG_BUTTON,
  IMG_CENTER_POPUP,
  IMG_CURSOR,
  IMG_DRAGGING,
  IMG_LOGO,
  IMG_LOGO2,
  IMG_LOGO_SMALL,
  IMG_LOGO_SMALL2,
  IMG_MORNING,
  IMG_MUTE,
  IMG_PRINTED_PAPER,
  IMG_STAT_METER,
  MUSIC_MAIN,
  MUSIC_NIGHT,
  SFX_ALARM,
  SFX_BTN_DOWN,
  SFX_BTN_UP,
  SFX_CLICK,
  SFX_DAY_OVER,
  SFX_DRAG,
  SFX_DROP,
  SFX_FEED,
  SFX_NULL,
} from '../constants/AssetKeys';
import { GameState } from '../game/GameState';
import { loadLanguagePreference } from '../locale/locale';
import { Storage } from '../utils/Storage';

export class PreloadScene extends Phaser.Scene {
  public static readonly KEY = 'PreloadScene';

  public constructor() {
    super(PreloadScene.KEY);
  }

  public preload(): void {
    this.cameras.main.setBackgroundColor('#ffffff');

    const barWidth = 240;
    const barHeight = 16;
    const x = (this.cameras.main.width - barWidth) / 2;
    const y = (this.cameras.main.height - barHeight) / 2;

    const outline = this.add.graphics();
    outline.lineStyle(2, 0x000000, 1);
    outline.strokeRect(x, y, barWidth, barHeight);

    const fill = this.add.graphics();
    this.load.on('progress', (value: number) => {
      fill.clear();
      fill.fillStyle(0x000000, 1);
      fill.fillRect(x + 2, y + 2, (barWidth - 4) * value, barHeight - 4);
    });

    this.load.image(IMG_BACKGROUND, 'assets/images/Background.png');
    this.load.image(IMG_MORNING, 'assets/images/Morning.png');
    this.load.image(IMG_PRINTED_PAPER, 'assets/images/PrintedPaper.png');
    this.load.image(IMG_LOGO, 'assets/images/Logo.png');
    this.load.image(IMG_LOGO2, 'assets/images/Logo2.png');
    this.load.image(IMG_LOGO_SMALL, 'assets/images/LogoSmall.png');
    this.load.image(IMG_LOGO_SMALL2, 'assets/images/LogoSmall2.png');
    this.load.image(IMG_ARTICLE_S, 'assets/images/ArticleSmall.png');
    this.load.image(IMG_ARTICLE_M, 'assets/images/ArticleMed.png');
    this.load.image(IMG_ARTICLE_B, 'assets/images/ArticleBig.png');
    this.load.image(IMG_BLURB, 'assets/images/Blurb.png');
    this.load.image(IMG_BLURB_CHECK, 'assets/images/BlurbCheck.png');
    this.load.image(IMG_BLURB_ARTICLE_S, 'assets/images/BlurbArticleS.png');
    this.load.image(IMG_BLURB_ARTICLE_M, 'assets/images/BlurbArticleM.png');
    this.load.image(IMG_BLURB_ARTICLE_B, 'assets/images/BlurbArticleB.png');
    this.load.image(IMG_BUTTON, 'assets/images/Button.png');
    this.load.image(IMG_STAT_METER, 'assets/images/StatMeter.png');
    this.load.image(IMG_CENTER_POPUP, 'assets/images/CenterPopup.png');
    this.load.image(IMG_DRAGGING, 'assets/images/Dragging.png');
    this.load.image(IMG_CURSOR, 'assets/images/Cursor.png');
    this.load.spritesheet(IMG_MUTE, 'assets/images/Mute.png', {
      frameWidth: 12,
      frameHeight: 12,
    });

    this.load.audio(MUSIC_MAIN, 'assets/audio/MainMusic.mp3');
    this.load.audio(MUSIC_NIGHT, 'assets/audio/NightMusic.mp3');
    this.load.audio(SFX_NULL, 'assets/audio/Silence.mp3');
    this.load.audio(SFX_FEED, 'assets/audio/Feed.mp3');
    this.load.audio(SFX_DRAG, 'assets/audio/Drag.mp3');
    this.load.audio(SFX_DROP, 'assets/audio/Drop.mp3');
    this.load.audio(SFX_BTN_DOWN, 'assets/audio/ButtonDown.mp3');
    this.load.audio(SFX_BTN_UP, 'assets/audio/ButtonUp.mp3');
    this.load.audio(SFX_DAY_OVER, 'assets/audio/DayOver.mp3');
    this.load.audio(SFX_ALARM, 'assets/audio/Alarm.mp3');
    this.load.audio(SFX_CLICK, 'assets/audio/Click.mp3');

    // Use original game's bitmap fonts (.fnt + _0.png from HaxeFlixel)
    this.load.bitmapFont(FONT_FEED, 'assets/fonts/nokiafc22_0.png', 'assets/fonts/nokiafc22.fnt');
    this.load.bitmapFont(FONT_ARTICLE_B, 'assets/fonts/MotorolaScreentype_0.png', 'assets/fonts/MotorolaScreentype.fnt');
    this.load.bitmapFont(FONT_ARTICLE_M, 'assets/fonts/SILKWONDER_0.png', 'assets/fonts/SILKWONDER.fnt');
    this.load.bitmapFont(FONT_ARTICLE_S, 'assets/fonts/SG03_0.png', 'assets/fonts/SG03.fnt');
  }

  public create(): void {
    loadLanguagePreference();
    Storage.load();
    GameState.instance.savedMute = Storage.getMute();

    this.scene.start('MorningScene');
  }
}
