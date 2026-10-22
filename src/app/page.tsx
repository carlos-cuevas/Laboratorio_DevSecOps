'use client';

import { appConfig } from '@/common/constants';
import { getAllCategories, getNavItemsByCategory } from '@/common/utils';
import Content from '@/components/content';
import PageTitle from '@/components/page-title';
import ToolCard from '@/components/tool-card';
import { useStarredTools } from '@/common/context';

export default function Home() {
  const { getStarredTools } = useStarredTools();
  const starredTools = getStarredTools();

  return (
    <Content>
      <div className='mb-10'>
        <h1 className='text-2xl font-bold mb-2'>
          Free Online Developer Tools
        </h1>
        <p className='text-sm text-slate-700 dark:text-slate-300 max-w-3xl'>
          {appConfig.name} is a free, open-source toolbox of developer
          utilities — formatters, converters, encoders, generators, testers,
          and viewers. No signup, no limits, and every tool runs entirely in
          your browser, so your data never leaves your device.
        </p>
      </div>
      {starredTools.length > 0 && (
        <div className='mb-10'>
          <PageTitle
            as='h2'
            title='Favorites'
            description='Your favorite tools pinned for quick access.'
            icon='fas fa-star text-amber-500'
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {starredTools.map((tool) => (
              <ToolCard key={`starred-${tool.id}`} {...tool} />
            ))}
          </div>
        </div>
      )}
      {getAllCategories().map((category) => (
        <div key={category.id} className='mb-10'>
          <PageTitle
            as='h2'
            title={category.name}
            description={category.description}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {getNavItemsByCategory(category.id).map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>
      ))}
    </Content>
  );
}
