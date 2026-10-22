import { appConfig, navCategories, navItems } from '@/common/constants';
import { MetadataRoute } from 'next';

// Bump this when site content meaningfully changes. A per-deploy timestamp
// makes every URL look modified on every build, which search engines learn
// to ignore.
const LAST_UPDATED = new Date('2026-07-03');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = appConfig.url;

  const categories = Object.values(navCategories)
    .filter((category) => category.visibleOnSidebar)
    .map((category) => ({
      url: `${baseUrl}${category.route}`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  const tools = navItems
    .filter((tool) => tool.route && tool.page)
    .map((tool) => ({
      url: `${baseUrl}${tool.route}`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...tools,
    ...categories,
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];
}
