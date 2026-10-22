import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';

interface PrimaryButtonProps {
  text: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PrimaryButton({
  text,
  className,
  disabled,
  onClick,
}: PrimaryButtonProps) {
  const pathName = usePathname();

  const primaryButtonOnClick = () => {
    sendGAEvent('primary_button_click', {
      label: text,
      current_path: pathName,
    });
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`text-white px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 transition-colors duration-150 ease-in-out ${className}`}
      disabled={disabled}
      onClick={primaryButtonOnClick}
    >
      {text}
    </button>
  );
}
