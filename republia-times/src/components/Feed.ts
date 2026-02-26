import Phaser from 'phaser';

import { Const } from '../constants/Const';
import {
  IMG_BLURB,
  IMG_BLURB_ARTICLE_B,
  IMG_BLURB_ARTICLE_M,
  IMG_BLURB_ARTICLE_S,
} from '../constants/AssetKeys';
import { ArticleSize, NewsItem } from '../game/NewsItem';
import { Paper } from './Paper';

type Blurb = {
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
  iconS: Phaser.GameObjects.Image;
  iconM: Phaser.GameObjects.Image;
  iconB: Phaser.GameObjects.Image;
  newsItem: NewsItem | null;
  visible: boolean;
};

export class Feed {
  private scene: Phaser.Scene;
  private paper: Paper;
  private blurbs: Blurb[] = [];
  private blurbsTop = 0;
  private blurbsTopTarget = 0;
  private blurbHeight = 40;

  public enabled = true;

  public constructor(scene: Phaser.Scene, paper: Paper) {
    this.scene = scene;
    this.paper = paper;

    for (let i = 0; i < 10; i += 1) {
      const bg = scene.add.image(0, 0, IMG_BLURB).setOrigin(0, 0);
      const text = scene.add.text(10, 6, '', {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#000000',
        wordWrap: { width: 160 },
      });
      const iconS = scene.add.image(180, 6, IMG_BLURB_ARTICLE_S).setOrigin(0, 0);
      const iconM = scene.add.image(200, 6, IMG_BLURB_ARTICLE_M).setOrigin(0, 0);
      const iconB = scene.add.image(220, 6, IMG_BLURB_ARTICLE_B).setOrigin(0, 0);

      const container = scene.add.container(Const.feedX, Const.feedY, [bg, text, iconS, iconM, iconB]);
      container.setVisible(false);

      this.blurbs.push({
        container,
        bg,
        text,
        iconS,
        iconM,
        iconB,
        newsItem: null,
        visible: false,
      });
    }

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.enabled) return;
      for (const blurb of this.blurbs) {
        if (!blurb.visible || !blurb.newsItem) continue;
        const bounds = blurb.container.getBounds();
        if (!bounds.contains(pointer.worldX, pointer.worldY)) continue;

        const localX = pointer.worldX - bounds.x;
        const localY = pointer.worldY - bounds.y;
        if (localY < 0 || localY > this.blurbHeight) continue;

        if (localX >= 180 && localX < 196) {
          this.paper.spawnArticleAtPointer(ArticleSize.S, blurb.newsItem, pointer);
        } else if (localX >= 200 && localX < 216) {
          this.paper.spawnArticleAtPointer(ArticleSize.M, blurb.newsItem, pointer);
        } else if (localX >= 220 && localX < 236) {
          this.paper.spawnArticleAtPointer(ArticleSize.B, blurb.newsItem, pointer);
        }
      }
    });
  }

  public addBlurb(newsItem: NewsItem): void {
    const blurb = this.blurbs.find((entry) => !entry.visible);
    if (!blurb) return;

    blurb.newsItem = newsItem;
    blurb.text.setText(newsItem.getBlurbText());
    if (newsItem.isRebelLeader()) {
      blurb.text.setColor('#ff0000');
    } else {
      blurb.text.setColor('#000000');
    }
    blurb.container.setVisible(true);
    blurb.visible = true;

    this.blurbsTopTarget -= this.blurbHeight;
    this.layoutBlurbs();
  }

  public update(deltaSeconds: number): void {
    if (Math.abs(this.blurbsTop - this.blurbsTopTarget) < 1) return;
    const direction = this.blurbsTopTarget > this.blurbsTop ? 1 : -1;
    this.blurbsTop += direction * deltaSeconds * 100;
    if ((direction > 0 && this.blurbsTop > this.blurbsTopTarget)
      || (direction < 0 && this.blurbsTop < this.blurbsTopTarget)) {
      this.blurbsTop = this.blurbsTopTarget;
    }
    this.layoutBlurbs();
  }

  private layoutBlurbs(): void {
    let index = 0;
    for (const blurb of this.blurbs) {
      if (!blurb.visible) continue;
      blurb.container.y = Const.feedY + this.blurbsTop + index * this.blurbHeight;
      index += 1;
    }
  }
}
