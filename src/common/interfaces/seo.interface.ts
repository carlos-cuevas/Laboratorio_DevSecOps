export interface IToolFaq {
  question: string;
  answer: string;
}

export interface IToolSeoContent {
  overview: string[];
  features: string[];
  faqs: IToolFaq[];
}
