// Shared types for the article database

export enum ArticleCategory {
  Plot = 'plot',
  Military = 'military',
  War = 'war',
  Politics = 'politics',
  Weather = 'weather',
  Sports = 'sports',
  Entertainment = 'entertainment',
}

export enum LoyaltyEffect {
  Up = 1,
  Down = -1,
  None = 0,
}

export interface ArticleText {
  blurb: string;
  headline: string | null;
}

export interface ArticleData {
  id: string;
  legacyIndex: number;
  category: ArticleCategory;
  dayRangeStart: number;
  dayRangeEnd: number;
  loyaltyEffect: LoyaltyEffect;
  interesting: boolean;
  /** Whether the article can be dragged onto the paper. False for rebel cipher messages. */
  placeable: boolean;
  text: {
    en: ArticleText;
    es: ArticleText;
  };
}
