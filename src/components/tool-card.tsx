'use client';

import { INavItem } from '@/common/interfaces';
import { Card, CardContent } from './card';
import Link from 'next/link';
import { useStarredTools } from '@/common/context';
import { Tooltip } from 'react-tooltip';

export default function ToolCard(tool: INavItem) {
  const { isStarred, toggleStar } = useStarredTools();
  const starred = isStarred(tool.id);

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(tool.id);
  };

  return (
    <Card className='hover:bg-slate-50 transition-colors duration-200 dark:hover:bg-zinc-700 relative group'>
      <Link
        href={tool.route || tool.externalLink || '#'}
        target={tool.externalLink ? '_blank' : '_self'}
      >
        <CardContent>
          <div className='flex flex-row gap-6'>
            <div className='flex flex-row items-center justify-center'>
              <i className={`text-3xl ${tool.icon}`} />
            </div>
            <div className='flex flex-col gap-1.5 pr-6'>
              <h3 className='text-lg font-bold'>{tool.name}</h3>
              <p className='text-sm text-slate-700 dark:text-slate-300'>
                {tool.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Link>
      <button
        onClick={handleStarClick}
        className={`absolute top-3 right-3 p-1.5 rounded-md transition-all duration-200 ${
          starred
            ? 'text-amber-500 hover:text-amber-600'
            : 'text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-amber-500 dark:hover:text-amber-400'
        }`}
        data-tooltip-id={`star-tooltip-${tool.id}`}
        data-tooltip-content={starred ? 'Remove from favorites' : 'Add to favorites'}
      >
        <i className={`${starred ? 'fas' : 'far'} fa-star text-xl`} />
        <Tooltip id={`star-tooltip-${tool.id}`} />
      </button>
    </Card>
  );
}
