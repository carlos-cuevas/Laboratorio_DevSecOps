import { navItems, toolSeoContent } from '@/common/constants';
import {
  getCategoryById,
  getNavItemByCategoryAndTool,
  getNavItemById,
} from '@/common/utils';
import {
  buildFaqJsonLd,
  buildPageMetadata,
  buildToolAppJsonLd,
} from '@/common/utils/seo.util';
import Breadcrumb from '@/components/breadcrumb';
import Content from '@/components/content';
import JsonLd from '@/components/json-ld';
import ToolPageTitle from '@/components/tool-page-title';
import ToolSeoContent from '@/components/tool-seo-content';
import { notFound } from 'next/navigation';

interface ToolPageProps {
  params: Promise<{ categoryId: string; toolId: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { categoryId, toolId } = await params;

  const data = getNavItemByCategoryAndTool(categoryId, toolId);
  const category = getCategoryById(categoryId);
  if (!data || !category) {
    notFound();
  }

  const seoContent = toolSeoContent[data.id];

  return (
    <Content>
      <Breadcrumb
        crumbs={[
          { name: 'Home', path: '/' },
          { name: category.name, path: category.route },
          { name: data.pageTitle, path: data.route ?? '/' },
        ]}
      />
      <ToolPageTitle
        toolId={data.id}
        title={data.pageTitle}
        description={data.description}
      />

      {data.page && <data.page />}

      {seoContent && (
        <ToolSeoContent title={data.pageTitle} content={seoContent} />
      )}

      <JsonLd
        id={`ld-tool-${data.id}`}
        data={buildToolAppJsonLd(data, seoContent?.features)}
      />
      {seoContent && seoContent.faqs.length > 0 && (
        <JsonLd
          id={`ld-faq-${data.id}`}
          data={buildFaqJsonLd(seoContent.faqs)}
        />
      )}
    </Content>
  );
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { toolId } = await params;

  const tool = getNavItemById(toolId);

  if (!tool || !tool.route) {
    return {
      title: 'Tool Not Found',
      description: 'The specified tool could not be located.',
    };
  }

  // No ogImage here: the file-convention opengraph-image.tsx in this route
  // segment generates a per-tool social image.
  return buildPageMetadata({
    title: tool.pageTitle,
    description: tool.description,
    path: tool.route,
    keywords: tool.keywords,
  });
}

export async function generateStaticParams() {
  const tools = navItems
    .filter((tool) => tool.page)
    .map((tool) => ({
      categoryId: tool.category,
      toolId: tool.id,
    }));

  return tools;
}
