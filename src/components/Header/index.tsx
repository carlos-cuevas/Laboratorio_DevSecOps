'use client';

import { useRouter, usePathname } from 'next/navigation';
import HeaderIconButton from './icon-button';
import { getNavItemById } from '@/common/utils/nav.util';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { Tooltip } from 'react-tooltip';

export default function Header({
  onToggleSidebar,
  isSidebarOpen,
  isDarkMode,
  onToggleDarkMode,
}: {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}) {
  const router = useRouter();
  const pathName = usePathname();

  const buyMeCofeeOnClick = (name: string) => {
    sendGAEvent('event', 'buy_me_coffee_click', {
      label: name,
      current_path: pathName,
    });
  };

  return (
    <div className='bg-white flex h-14 border-b px-4 py-2 items-center justify-between dark:bg-backgroundDark dark:border-zinc-800'>
      <div className='flex items-center gap-2'>
        <HeaderIconButton
          id='toggle-sidebar'
          name='Toggle Sidebar'
          icon={isSidebarOpen ? 'fa-outdent' : 'fa-indent'}
          onClick={onToggleSidebar}
        />
        <HeaderIconButton
          id='home'
          name='Home'
          icon='fa-home'
          onClick={() => router.push('/')}
        />

        {/* TODO: Add search */}
        {/* <div className='flex items-center gap-2 bg-slate-100 dark:bg-zinc-700 h-full px-2 py-1 rounded-md'>
          <i className='far fa-fw fa-search'></i>
          <input
            type='text'
            placeholder='Search'
            className='bg-transparent outline-none hidden sm:block'
          />
        </div> */}
      </div>
      <div className='flex items-center gap-2'>
        <HeaderIconButton
          id='github'
          name='GitHub'
          icon={getNavItemById('github')?.icon || ''}
          href={getNavItemById('github')?.externalLink || ''}
          target='_blank'
          type='link'
        />
        <HeaderIconButton
          id='linkedin'
          name='Linkedin'
          icon={getNavItemById('linkedin')?.icon || ''}
          href={getNavItemById('linkedin')?.externalLink || ''}
          target='_blank'
          type='link'
        />
        <HeaderIconButton
          id='about'
          name='About'
          icon={getNavItemById('about')?.icon || ''}
          type='link'
          href={getNavItemById('about')?.route || '/'}
        />
        <HeaderIconButton
          id='toggle-dark-mode'
          name='Toggle Dark Mode'
          icon={isDarkMode ? 'fa-lightbulb-on' : 'fa-moon'}
          onClick={onToggleDarkMode}
        />

        <Link
          href={getNavItemById('buy-me-coffee')?.externalLink || ''}
          onClick={() => buyMeCofeeOnClick('Buy Me a Coffee')}
          target='_blank'
          className='p-2 rounded-md h-9 font-medium flex items-center justify-center gap-1.5 transition-all duration-200 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600'
          data-tooltip-id={`buy-me-coffee-tooltip`}
          data-tooltip-content='Buy Me a Coffee'
          data-tooltip-place='bottom'
        >
          <i className='fad fa-fw fa-mug-hot' />

          <Tooltip id={`buy-me-coffee-tooltip`} />
        </Link>
      </div>
    </div>
  );
}
