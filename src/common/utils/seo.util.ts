import type { Metadata } from 'next';
import { appConfig } from '@/common/constants/app.constant';
import { INavItem, IToolFaq } from '@/common/interfaces';

export interface Crumb {
  name: string;
  path: string;
}

interface BuildMetadataInput {
  /** Page title without the site-name suffix (the root layout template adds it). */
  title: string;
  description: string;
  /** Root-relative path, e.g. '/formatters/json-formatter'. */
  path: string;
  keywords?: string[] | string;
  /**
   * Explicit OG/Twitter image. Omit on routes that provide a file-convention
   * `opengraph-image` so Next.js injects the generated image instead.
   */
  ogImage?: { url: string; width: number; height: number; alt?: string };
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  ogImage,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = `${appConfig.url}${path}`;
  const fullTitle = `${title} | ${appConfig.name}`;
  return {
    title,
    description,
    keywords,
    applicationName: appConfig.name,
    creator: appConfig.creator,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      siteName: appConfig.name,
      title: fullTitle,
      description,
      url,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: appConfig.twitterHandle,
      creator: appConfig.twitterHandle,
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function buildBreadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${appConfig.url}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  };
}

export function buildFaqJsonLd(faqs: IToolFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildToolAppJsonLd(tool: INavItem, features?: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.pageTitle,
    url: `${appConfig.url}${tool.route}`,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(features && features.length > 0 ? { featureList: features } : {}),
    creator: {
      '@type': 'Person',
      name: appConfig.creator,
      url: appConfig.creatorUrl,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: appConfig.name,
      url: appConfig.url,
    },
  };
}

export function buildItemListJsonLd(
  items: Array<{ name: string; description: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      description: item.description,
      url: `${appConfig.url}${item.path}`,
    })),
  };
}
