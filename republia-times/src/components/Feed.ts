import Phaser from 'phaser';

import { Const } from '../constants/Const';
import {
  IMG_BLURB,
  IMG_BLURB_ARTICLE_B,
  IMG_BLURB_ARTICLE_M,
  IMG_BLURB_ARTICLE_S,
  FONT_FEED,
} from '../constants/AssetKeys';
import { ArticleSize, NewsItem } from '../game/NewsItem';
import { Paper } from './Paper';

type Blurb = {
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.BitmapText;
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
  private blurbsTop = Const.feedH;
  private blurbsTopTarget = Const.feedH;
  private blurbHeight = 30;

  public enabled = true;

  public constructor(scene: Phaser.Scene, paper: Paper) {
    this.scene = scene;
    this.paper = paper;

    // Shared mask to clip all blurb text within the feed area
    const maskGraphics = scene.make.graphics({ x: 0, y: 0 });
    maskGraphics.fillRect(Const.feedX, Const.feedY, Const.feedW, Const.feedH);
    const feedMask = maskGraphics.createGeometryMask();

    for (let i = 0; i < 10; i += 1) {
      const bg = scene.add.image(0, 0, IMG_BLURB).setOrigin(0, 0);
      const text = scene.add.bitmapText(11, 2, FONT_FEED, '', 8);
      text.setMaxWidth(170);
      text.setLineSpacing(2);
      text.setTint(0x000000);
      const iconB = scene.add.image(204, 4, IMG_BLURB_ARTICLE_B).setOrigin(0, 0);
      const iconM = scene.add.image(229, 4, IMG_BLURB_ARTICLE_M).setOrigin(0, 0);
      const iconS = scene.add.image(247, 4, IMG_BLURB_ARTICLE_S).setOrigin(0, 0);

      const container = scene.add.container(Const.feedX, Const.feedY, [bg, text, iconB, iconM, iconS]);
      container.setVisible(false);
      container.setMask(feedMask);

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

        if (localX >= 204 && localX < 225) {
          this.paper.spawnArticleAtPointer(ArticleSize.B, blurb.newsItem, pointer);
        } else if (localX >= 229 && localX < 243) {
          this.paper.spawnArticleAtPointer(ArticleSize.M, blurb.newsItem, pointer);
        } else if (localX >= 247 && localX < 256) {
          this.paper.spawnArticleAtPointer(ArticleSize.S, blurb.newsItem, pointer);
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
      blurb.text.setTint(0xff0000);
    } else {
      blurb.text.setTint(0x000000);
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
