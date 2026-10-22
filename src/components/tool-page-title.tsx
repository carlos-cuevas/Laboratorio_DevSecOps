'use client';

import { useStarredTools } from '@/common/context';
import { Tooltip } from 'react-tooltip';

export default function ToolPageTitle({
  toolId,
  title,
  description,
}: {
  toolId: string;
  title: string;
  description?: string;
}) {
  const { isStarred, toggleStar } = useStarredTools();
  const starred = isStarred(toolId);

  const handleStarClick = () => {
    toggleStar(toolId);
  };

  return (
    <>
      <div className='flex items-center justify-between gap-4 mb-2'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <button
          onClick={handleStarClick}
          className={`p-2 rounded-md transition-all duration-200 ${
            starred
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400'
          }`}
          data-tooltip-id={`tool-page-star-${toolId}`}
          data-tooltip-content={starred ? 'Remove from favorites' : 'Add to favorites'}
        >
          <i className={`${starred ? 'fas' : 'far'} fa-star text-xl`} />
          <Tooltip id={`tool-page-star-${toolId}`} />
        </button>
      </div>
      {description && (
        <p className='text-sm text-slate-700 mb-5 dark:text-slate-300'>
          {description}
        </p>
      )}
    </>
  );
}

