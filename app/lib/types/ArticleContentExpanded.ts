import { ArticleContent, ArticleType, CallToAction, Content, Hero, Title } from "@prisma/client";

export interface ArticleContentExpanded extends ArticleContent {
  title?: Title;
  hero?: Hero;
  content?: Content;
  type?: ArticleType;
  callToAction?: CallToAction;
  author?: string;
  publishedDate?: string;
  affiliateLink?: string;
}
