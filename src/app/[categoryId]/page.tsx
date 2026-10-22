import { appConfig, navCategories } from '@/common/constants';
import { getCategoryById, getNavItemsByCategory } from '@/common/utils';
import {
  buildItemListJsonLd,
  buildPageMetadata,
} from '@/common/utils/seo.util';
import Breadcrumb from '@/components/breadcrumb';
import Content from '@/components/content';
import JsonLd from '@/components/json-ld';
import PageTitle from '@/components/page-title';
import ToolCard from '@/components/tool-card';
import { notFound } from 'next/navigation';
import ogImage from '@/app/cover.png';

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const data = getCategoryById(categoryId);
  if (!data || !data.visibleOnSidebar) {
    notFound();
  }

  const tools = getNavItemsByCategory(categoryId);

  return (
    <Content>
      <Breadcrumb
        crumbs={[
          { name: 'Home', path: '/' },
          { name: data.name, path: data.route },
        ]}
      />
      <PageTitle title={data.name} description={data.description} />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {tools.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
      <JsonLd
        id={`ld-category-${data.id}`}
        data={buildItemListJsonLd(
          tools
            .filter((tool) => tool.route)
            .map((tool) => ({
              name: tool.pageTitle,
              description: tool.description,
              path: tool.route as string,
            }))
        )}
      />
    </Content>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categoryId } = await params;

  const categoryData = getCategoryById(categoryId);

  if (!categoryData || !categoryData.visibleOnSidebar) {
    return {
      title: 'Category Not Found',
      description: 'The specified category could not be located.',
      applicationName: appConfig.name,
    };
  }

  const tools = getNavItemsByCategory(categoryId);
  const toolNames = tools.map((tool) => tool.pageTitle);

  return buildPageMetadata({
    title: `${categoryData.name} - Free Online Tools`,
    description: `${categoryData.description} Includes ${toolNames.join(
      ', '
    )} — free, no signup, and everything runs in your browser.`,
    path: categoryData.route,
    keywords: [
      categoryData.name.toLowerCase(),
      ...tools.flatMap((tool) => tool.keywords?.slice(0, 3) ?? [tool.name]),
    ],
    ogImage: {
      url: ogImage.src,
      width: 1280,
      height: 640,
      alt: appConfig.pageTitle,
    },
  });
}

export async function generateStaticParams() {
  const categories = Object.values(navCategories)
    .filter((category) => category.visibleOnSidebar)
    .map((category) => ({ categoryId: category.id }));

  return categories;
}
