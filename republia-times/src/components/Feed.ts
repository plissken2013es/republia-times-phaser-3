import Phaser from 'phaser';

import { Const } from '../constants/Const';
import {
  IMG_BLURB,
  IMG_BLURB_ARTICLE_B,
  IMG_BLURB_ARTICLE_M,
  IMG_BLURB_ARTICLE_S,
  IMG_BLURB_CHECK,
  IMG_DRAGGING,
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
  draggingIcon: Phaser.GameObjects.Image;
  checkIcon: Phaser.GameObjects.Image;
  newsItem: NewsItem | null;
  visible: boolean;
  placedSize: ArticleSize | null;
};

// Icon local-X offsets within the blurb container (from original game)
const ICON_X = { [ArticleSize.B]: 204, [ArticleSize.M]: 229, [ArticleSize.S]: 247 };
const ICON_Y = 4;

export class Feed {
  private scene: Phaser.Scene;
  private paper: Paper;
  private blurbs: Blurb[] = [];
  private blurbsTop = Const.feedH;
  private blurbsTopTarget = Const.feedH;
  private blurbHeight = 30;
  private activeBlurb: Blurb | null = null;
  private activeSize: ArticleSize | null = null;

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
      const draggingIcon = scene.add.image(0, 0, IMG_DRAGGING).setOrigin(0, 0).setVisible(false);
      const checkIcon = scene.add.image(0, 0, IMG_BLURB_CHECK).setOrigin(0, 0).setVisible(false);

      const container = scene.add.container(Const.feedX, Const.feedY, [
        bg, text, iconB, iconM, iconS, draggingIcon, checkIcon,
      ]);
      container.setVisible(false);
      container.setMask(feedMask);

      this.blurbs.push({
        container, bg, text, iconS, iconM, iconB,
        draggingIcon, checkIcon,
        newsItem: null,
        visible: false,
        placedSize: null,
      });
    }

    // Press on a size icon → spawn article and start dragging
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.enabled) return;
      for (const blurb of this.blurbs) {
        if (!blurb.visible || !blurb.newsItem) continue;
        const bounds = blurb.container.getBounds();
        if (!bounds.contains(pointer.worldX, pointer.worldY)) continue;

        const localX = pointer.worldX - bounds.x;
        const localY = pointer.worldY - bounds.y;
        if (localY < 0 || localY > this.blurbHeight) continue;

        let size: ArticleSize | null = null;
        if (localX >= 204 && localX < 225) size = ArticleSize.B;
        else if (localX >= 229 && localX < 243) size = ArticleSize.M;
        else if (localX >= 247 && localX < 256) size = ArticleSize.S;

        if (size !== null) {
          this.paper.spawnArticleAtPointer(size, blurb.newsItem, pointer);
          this.showDraggingIcon(blurb, size);
        }
      }
    });

    // Release → finalize placement, show check icon
    this.scene.input.on('pointerup', () => {
      if (this.activeBlurb && this.activeSize !== null) {
        this.activeBlurb.draggingIcon.setVisible(false);
        // Check if article was actually placed on paper
        if (this.paper.isNewsItemPlaced(this.activeBlurb.newsItem!)) {
          this.showCheckIcon(this.activeBlurb, this.activeSize);
        }
        this.activeBlurb = null;
        this.activeSize = null;
      }
    });
  }

  private showDraggingIcon(blurb: Blurb, size: ArticleSize): void {
    // Hide any previous dragging/check state
    if (this.activeBlurb) {
      this.activeBlurb.draggingIcon.setVisible(false);
    }
    this.activeBlurb = blurb;
    this.activeSize = size;

    // Position dragging icon over the clicked size icon
    blurb.draggingIcon.setPosition(ICON_X[size], ICON_Y);
    blurb.draggingIcon.setVisible(true);

    // Hide old check if re-selecting
    blurb.checkIcon.setVisible(false);
    blurb.placedSize = null;
  }

  private showCheckIcon(blurb: Blurb, size: ArticleSize): void {
    blurb.checkIcon.setPosition(ICON_X[size], ICON_Y);
    blurb.checkIcon.setVisible(true);
    blurb.placedSize = size;
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
    blurb.placedSize = null;
    blurb.checkIcon.setVisible(false);
    blurb.draggingIcon.setVisible(false);

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
