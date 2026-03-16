import Phaser from 'phaser';

import { Const } from '../constants/Const';
import {
  IMG_ARTICLE_B, IMG_ARTICLE_M, IMG_ARTICLE_S,
  FONT_ARTICLE_B, FONT_FEED, FONT_FEED_SMALL,
} from '../constants/AssetKeys';
import { ArticleSize, NewsItem } from '../game/NewsItem';
import { PaperSummary } from '../game/PaperSummary';

type ArticleSpec = {
  size: ArticleSize;
  width: number;
  height: number;
  key: string;
  font: string;
  fontSize: number;
  textOffset: number;
  textMaxWidth: number;
};

const ARTICLE_SPECS: Record<ArticleSize, ArticleSpec> = {
  [ArticleSize.S]: { size: ArticleSize.S, width: Const.p, height: Const.p * 2, key: IMG_ARTICLE_S, font: FONT_FEED_SMALL, fontSize: 6, textOffset: 5, textMaxWidth: 40 },
  [ArticleSize.M]: { size: ArticleSize.M, width: Const.p * 2, height: Const.p * 2, key: IMG_ARTICLE_M, font: FONT_FEED, fontSize: 10, textOffset: 8, textMaxWidth: 84 },
  [ArticleSize.B]: { size: ArticleSize.B, width: Const.p * 3, height: Const.p * 3, key: IMG_ARTICLE_B, font: FONT_ARTICLE_B, fontSize: 12, textOffset: 10, textMaxWidth: 130 },
};

class Article {
  public sprite: Phaser.GameObjects.Image;
  public headline: Phaser.GameObjects.BitmapText;
  public size: ArticleSize;
  public newsItem: NewsItem | null = null;
  public dragging = false;

  public constructor(scene: Phaser.Scene, size: ArticleSize) {
    const spec = ARTICLE_SPECS[size];
    this.size = size;
    this.sprite = scene.add.image(0, 0, spec.key).setVisible(false).setOrigin(0, 0);
    this.sprite.setInteractive({ draggable: true });
    this.headline = scene.add.bitmapText(0, 0, spec.font, '', spec.fontSize)
      .setVisible(false)
      .setMaxWidth(spec.textMaxWidth)
      .setTint(0x000000);
  }

  public setVisible(visible: boolean): void {
    this.sprite.setVisible(visible);
    this.headline.setVisible(visible);
  }

  public updateTextPosition(): void {
    const spec = ARTICLE_SPECS[this.size];
    this.headline.setPosition(
      this.sprite.x + spec.textOffset,
      this.sprite.y + spec.textOffset,
    );
  }
}

export class Paper {
  private scene: Phaser.Scene;
  private articles: Article[] = [];
  /** Article currently being placed from feed (follows pointer until release) */
  private placingArticle: Article | null = null;
  /** Called when an article is removed from the paper (dragged outside grid) */
  public onArticleRemoved: ((newsItem: NewsItem) => void) | null = null;

  public enabled = true;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;

    for (let i = 0; i < 10; i += 1) {
      this.articles.push(new Article(scene, ArticleSize.S));
      this.articles.push(new Article(scene, ArticleSize.M));
      this.articles.push(new Article(scene, ArticleSize.B));
    }

    // Drag existing articles already on the paper
    this.scene.input.on('dragstart', (_: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image) => {
      if (!this.enabled || this.placingArticle) return;
      const article = this.articles.find((entry) => entry.sprite === obj);
      if (!article) return;
      article.dragging = true;
    });

    this.scene.input.on('drag', (_: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image, x: number, y: number) => {
      if (!this.enabled || this.placingArticle) return;
      const article = this.articles.find((entry) => entry.sprite === obj);
      if (!article) return;
      article.sprite.setPosition(x, y);
      article.updateTextPosition();
      this.updateOverlapTints();
    });

    this.scene.input.on('dragend', (_: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image) => {
      if (!this.enabled) return;
      const article = this.articles.find((entry) => entry.sprite === obj);
      if (!article || article === this.placingArticle) return;
      this.finalizeArticleDrop(article);
    });

    // Follow pointer while placing a newly spawned article
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.placingArticle) return;
      const spec = ARTICLE_SPECS[this.placingArticle.size];
      this.placingArticle.sprite.setPosition(
        pointer.worldX - spec.width / 2,
        pointer.worldY - spec.height / 2,
      );
      this.placingArticle.updateTextPosition();
      this.updateOverlapTints();
    });

    // Drop the placing article on pointer release
    this.scene.input.on('pointerup', () => {
      if (!this.placingArticle) return;
      this.finalizeArticleDrop(this.placingArticle);
      this.placingArticle = null;
    });
  }

  /** Spawn a new article from the feed — it follows the pointer until release */
  public spawnArticleAtPointer(
    size: ArticleSize,
    newsItem: NewsItem,
    pointer: Phaser.Input.Pointer,
  ): void {
    if (!this.enabled) return;
    const article = this.articles.find((entry) => entry.size === size && !entry.sprite.visible);
    if (!article) return;

    // Remove any existing article for this news item
    for (const entry of this.articles) {
      if (entry.newsItem === newsItem) {
        entry.setVisible(false);
        entry.newsItem = null;
      }
    }

    const spec = ARTICLE_SPECS[size];
    article.newsItem = newsItem;
    article.headline.setText(newsItem.getArticleText());
    article.setVisible(true);
    article.sprite.setPosition(
      pointer.worldX - spec.width / 2,
      pointer.worldY - spec.height / 2,
    );
    article.updateTextPosition();
    article.dragging = true;

    // Cancel any previous placing
    if (this.placingArticle && this.placingArticle !== article) {
      this.placingArticle.dragging = false;
    }
    this.placingArticle = article;
  }

  public isNewsItemPlaced(newsItem: NewsItem): boolean {
    return this.articles.some((a) => a.sprite.visible && a.newsItem === newsItem && !a.dragging);
  }

  public getSummary(): PaperSummary {
    const summary = new PaperSummary();
    for (const article of this.articles) {
      if (!article.sprite.visible || !article.newsItem) continue;
      summary.applyNewsItem(article.newsItem, article.size);
    }
    return summary;
  }

  public markNewsItemsUsed(): void {
    for (const article of this.articles) {
      if (article.sprite.visible && article.newsItem) {
        article.newsItem.used = true;
      }
    }
  }

  private finalizeArticleDrop(article: Article): void {
    this.snapToGrid(article);
    if (!this.isArticleValid(article)) {
      const removed = article.newsItem;
      article.setVisible(false);
      article.newsItem = null;
      if (removed && this.onArticleRemoved) {
        this.onArticleRemoved(removed);
      }
    }
    article.dragging = false;
    this.updateOverlapTints();
  }

  private snapToGrid(article: Article): void {
    const spec = ARTICLE_SPECS[article.size];
    const snappedX = Const.paperX + Const.p * Math.round((article.sprite.x - Const.paperX) / Const.p);
    const snappedY = Const.paperY + Const.p * Math.round((article.sprite.y - Const.paperY) / Const.p);
    article.sprite.setPosition(snappedX, snappedY);
    article.sprite.setDisplaySize(spec.width, spec.height);
    article.updateTextPosition();
  }

  private isArticleValid(article: Article): boolean {
    const spec = ARTICLE_SPECS[article.size];
    const x = article.sprite.x;
    const y = article.sprite.y;
    if (x < Const.paperX || y < Const.paperY) return false;
    if (x + spec.width > Const.paperX + Const.paperW) return false;
    if (y + spec.height > Const.paperY + Const.paperH) return false;
    return !this.isOverlapping(article);
  }

  private isOverlapping(article: Article): boolean {
    const spec = ARTICLE_SPECS[article.size];
    const ax = article.sprite.x;
    const ay = article.sprite.y;
    const aw = spec.width;
    const ah = spec.height;

    for (const other of this.articles) {
      if (other === article || !other.sprite.visible) continue;
      const otherSpec = ARTICLE_SPECS[other.size];
      const bx = other.sprite.x;
      const by = other.sprite.y;
      const bw = otherSpec.width;
      const bh = otherSpec.height;

      const overlap = ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
      if (overlap) return true;
    }
    return false;
  }

  private updateOverlapTints(): void {
    for (const article of this.articles) {
      if (!article.sprite.visible) continue;
      if (this.isOverlapping(article)) {
        article.sprite.setTint(0xff0000);
      } else {
        article.sprite.setTint(0xffffff);
      }
    }
  }
}
