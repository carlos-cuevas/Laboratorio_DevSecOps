export interface INavCategory {
  id: string;
  name: string;
  route: string;
  visibleOnSidebar: boolean;
  description: string;
  keywords?: string[];
}

export interface INavItem {
  id: string;
  category: string;
  icon: string;
  name: string;
  pageTitle: string;
  description: string;
  route?: string;
  visibleOnSidebar: boolean;
  page?: () => React.JSX.Element;
  externalLink?: string;
  keywords?: string[];
}
