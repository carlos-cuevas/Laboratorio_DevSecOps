'use client';

import { appConfig, navCategories } from '@/common/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem, SidebarItemHeading, StarredSidebarItem } from './sidebar-items';
import { StorageKeys } from '@/common/enums';
import { useEffect, useState } from 'react';
import { getNavItemsByCategory } from '@/common/utils';
import ExternalLink from '@/components/external-link';
import { useStarredTools } from '@/common/context';

export default function Sidebar({
  isSidebarOpen,
  onToggleSidebar,
}: {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  );
  const { getStarredTools, toggleStar } = useStarredTools();
  const starredTools = getStarredTools();

  useEffect(() => {
    setCollapsedItems(
      JSON.parse(
        localStorage.getItem(StorageKeys.SidebarCollapsedItems) || '{}'
      )
    );
  }, []);

  const pathname = usePathname();

  const toggleCollapsedItem = (itemId: string) => {
    setCollapsedItems((prev) => {
      const newCollapsedItems = {
        ...prev,
        [itemId]: !prev[itemId],
      };

      localStorage.setItem(
        StorageKeys.SidebarCollapsedItems,
        JSON.stringify(newCollapsedItems)
      );

      return newCollapsedItems;
    });
  };

  return (
    <nav
      className={`shrink-0 w-64 absolute top-0 h-full  ${
        isSidebarOpen ? 'left-0 lg:relative' : '-left-64 lg:hidden'
      }`}
    >
      <div
        className={`z-20 flex shrink-0 flex-col w-64 h-full border-r dark:border-zinc-800 bg-white dark:bg-backgroundDark fixed lg:left-0 top-0 transition-all duration-300 ${
          isSidebarOpen ? 'left-0' : '-left-64 lg:hidden'
        }`}
      >
        {/* Logo */}
        <Link href='/' className='flex items-center h-14 px-6 py-2'>
          <i className='far fa-brackets-curly text-2xl mr-2'></i>
          <span className='text-xl font-bold'>
            {appConfig.firstName}
            <span className='text-emerald-500'>{appConfig.lastName}</span>
          </span>
        </Link>

        {/* Navigation Holder */}
        <div
          className='flex-1 flex flex-col mt-4 overflow-y-scroll'
          style={{
            scrollbarWidth: 'thin',
            scrollbarGutter: 'stable',
            scrollbarColor: '#eaeaea #0000',
          }}
        >
          {/* Favorites Section */}
          {starredTools.length > 0 && (
            <div className='w-full'>
              <SidebarItemHeading
                label='Favorites'
                icon='fas fa-star text-amber-500'
                isOpen={!collapsedItems['favorites']}
                onClick={() => toggleCollapsedItem('favorites')}
              />
              {!collapsedItems['favorites'] && (
                <>
                  {starredTools.map((navItem, navIndex) => (
                    <StarredSidebarItem
                      key={`starred-${navItem.id}-${navIndex}`}
                      label={navItem.name}
                      icon={navItem.icon}
                      active={navItem.route === pathname}
                      route={navItem.route ?? '/'}
                      onToggleSidebar={onToggleSidebar}
                      onUnstar={() => toggleStar(navItem.id)}
                    />
                  ))}
                </>
              )}
            </div>
          )}

          {/* Navigation */}
          {Object.values(navCategories).map((category, catIndex) => {
            if (!category.visibleOnSidebar) return null; // Skip items not visible on the sidebar

            return (
              <div key={`${category.id}-${catIndex}`} className='w-full'>
                {/* Section Heading */}
                <SidebarItemHeading
                  label={category.name}
                  isOpen={!collapsedItems[category.id]}
                  onClick={() => toggleCollapsedItem(category.id)}
                />

                {/* Sub-links */}
                {!collapsedItems[category.id] && (
                  <>
                    {getNavItemsByCategory(category.id).map(
                      (navItem, navIndex) => {
                        if (!navItem.visibleOnSidebar) return null; // Skip invisible sub-links

                        return (
                          <SidebarItem
                            key={`${navItem.id}-${navIndex}`}
                            label={navItem.name}
                            icon={navItem.icon}
                            active={navItem.route === pathname}
                            route={navItem.route ?? '/'}
                            toolId={navItem.page ? navItem.id : undefined}
                            onToggleSidebar={onToggleSidebar}
                          />
                        );
                      }
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-center h-14 px-6 py-2'>
          <span className='text-sm text-zinc-500'>
            &copy; {new Date().getFullYear()}{' '}
            <ExternalLink href='https://mgoyal.com'>Madhur Goyal</ExternalLink>
          </span>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className='fixed lg:hidden w-full h-full top-0 left-0 bg-black/50 z-10 cursor-pointer'
          onClick={onToggleSidebar}
        ></div>
      )}
    </nav>
  );
}
