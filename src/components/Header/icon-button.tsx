import { sendGAEvent } from '@next/third-parties/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip } from 'react-tooltip';

const buttonClassName =
  'p-2 rounded-md h-9 w-9 flex items-center justify-center transition-all duration-200 hover:bg-slate-100 dark:hover:bg-zinc-700';

export default function HeaderIconButton({
  name,
  id,
  type = 'button',
  icon,
  onClick,
  href,
  target,
}: {
  name: string;
  id: string;
  type?: 'button' | 'link';
  icon: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}) {
  const pathName = usePathname();

  const iconButtonOnClick = () => {
    sendGAEvent('event', 'header_icon_button_click', {
      label: id,
      current_path: pathName,
    });
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      {type === 'button' ? (
        <button
          className={buttonClassName}
          onClick={iconButtonOnClick}
          data-tooltip-id={`${id}-tooltip`}
          data-tooltip-content={name}
        >
          <i className={`far fa-fw ${icon}`}></i>
        </button>
      ) : (
        <Link
          className={buttonClassName}
          href={href || '#'}
          onClick={iconButtonOnClick}
          target={target}
          data-tooltip-id={`${id}-tooltip`}
          data-tooltip-content={name}
        >
          <i className={`far fa-fw ${icon}`}></i>
        </Link>
      )}
      <Tooltip
        id={`${id}-tooltip`}
        place={id === 'toggle-sidebar' ? 'right' : 'bottom'}
      />
    </>
  );
}
