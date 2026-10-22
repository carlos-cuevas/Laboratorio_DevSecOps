import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';

interface SecondaryButtonProps {
  text: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SecondaryButton({
  text,
  className,
  disabled,
  onClick,
}: SecondaryButtonProps) {
  const pathName = usePathname();

  const secondaryButtonOnClick = () => {
    sendGAEvent('event', 'secondary_button_click', {
      label: text,
      current_path: pathName,
    });
    if (onClick) {
      onClick();
    }
  };
  return (
    <button
      className={`px-4 py-1.5 rounded-md bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 transition-colors duration-150 ease-in-out ${className}`}
      disabled={disabled}
      onClick={secondaryButtonOnClick}
    >
      {text}
    </button>
  );
}
