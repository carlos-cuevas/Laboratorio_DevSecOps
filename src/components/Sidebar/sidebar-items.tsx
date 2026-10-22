import Link from 'next/link';
import { Tooltip } from 'react-tooltip';
import { useStarredTools } from '@/common/context';

export function SidebarItemHeading({
  label,
  icon,
  isOpen,
  onClick,
}: {
  label: string;
  icon?: string;
  isOpen?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className='flex items-center justify-between w-full mt-3 px-5 text-zinc-500 mb-2 hover:text-zinc-600 dark:hover:text-zinc-400 hover:cursor-pointer transition-all duration-200'
      onClick={onClick}
    >
      <h6 className='text-sm font-medium flex items-center gap-2'>
        {icon && <i className={icon} />}
        {label}
      </h6>
      <i
        className={`far fa-fw ${
          isOpen ? 'fa-chevron-down' : 'fa-chevron-right'
        }`}
      ></i>
    </button>
  );
}

export function SidebarItem({
  label,
  icon,
  active,
  route,
  toolId,
  onToggleSidebar,
}: {
  label: string;
  icon: string;
  active?: boolean;
  route: string;
  toolId?: string;
  onToggleSidebar: () => void;
}) {
  const handleCloseSidebar = () => {
    // Check if window width is >= 1024px (lg breakpoint in Tailwind)
    const isLargeScreen = window.innerWidth >= 1024;
    if (!isLargeScreen) {
      onToggleSidebar();
    }
  };

  return (
    <SidebarItemWithStar
      label={label}
      icon={icon}
      active={active}
      route={route}
      toolId={toolId}
      onCloseSidebar={handleCloseSidebar}
    />
  );
}

function SidebarItemWithStar({
  label,
  icon,
  active,
  route,
  toolId,
  onCloseSidebar,
}: {
  label: string;
  icon: string;
  active?: boolean;
  route: string;
  toolId?: string;
  onCloseSidebar: () => void;
}) {
  const { isStarred, toggleStar } = useStarredTools();
  const starred = toolId ? isStarred(toolId) : false;

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toolId) {
      toggleStar(toolId);
    }
  };

  return (
    <div className='group relative'>
      <Link
        href={route}
        onClick={onCloseSidebar}
        className={`flex items-center w-full gap-3 pr-8 pl-6 py-3 text-sm hover:bg-emerald-50 dark:hover:bg-zinc-800 border-r-2 border-transparent transition-colors duration-200 ${
          active
            ? 'border-r-emerald-500 bg-emerald-50 dark:bg-zinc-800 text-emerald-500 dark:text-emerald-500 font-medium'
            : ''
        }`}
      >
        <i className={`${icon}`}></i>
        {label}
      </Link>
      {toolId && (
        <button
          onClick={handleStarClick}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-all duration-200 ${
            starred
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-amber-500'
          }`}
          data-tooltip-id={`sidebar-star-${toolId}`}
          data-tooltip-content={starred ? 'Remove from favorites' : 'Add to favorites'}
        >
          <i className={`${starred ? 'fas' : 'far'} fa-star text-xs`} />
          <Tooltip id={`sidebar-star-${toolId}`} />
        </button>
      )}
    </div>
  );
}

export function StarredSidebarItem({
  label,
  icon,
  active,
  route,
  onToggleSidebar,
  onUnstar,
}: {
  label: string;
  icon: string;
  active?: boolean;
  route: string;
  onToggleSidebar: () => void;
  onUnstar: () => void;
}) {
  const handleCloseSidebar = () => {
    const isLargeScreen = window.innerWidth >= 1024;
    if (!isLargeScreen) {
      onToggleSidebar();
    }
  };

  const handleUnstar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUnstar();
  };

  return (
    <div className='group relative'>
      <Link
        href={route}
        onClick={handleCloseSidebar}
        className={`flex items-center w-full gap-3 pr-8 pl-6 py-3 text-sm hover:bg-emerald-50 dark:hover:bg-zinc-800 border-r-2 border-transparent transition-colors duration-200 ${
          active
            ? 'border-r-emerald-500 bg-emerald-50 dark:bg-zinc-800 text-emerald-500 dark:text-emerald-500 font-medium'
            : ''
        }`}
      >
        <i className={`${icon}`}></i>
        {label}
      </Link>
      <button
        onClick={handleUnstar}
        className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-amber-500 transition-all duration-200'
        data-tooltip-id={`unstar-${label}`}
        data-tooltip-content='Remove from favorites'
      >
        <i className='fas fa-times text-xs' />
        <Tooltip id={`unstar-${label}`} />
      </button>
    </div>
  );
}
