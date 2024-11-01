export type Topic = 'adhd' | 'depression' | 'anxiety';

export interface Quote {
  text: string;
  author: string;
  topic: Topic;
}

export interface QuotableResponse {
  _id: string;
  content: string;
  author: string;
  tags: string[];
}