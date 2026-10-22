'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import {
  Children as ReactChildren,
  cloneElement,
  isValidElement,
  useState,
} from 'react';
import RenderConditional from './render-conditional';

export function Card({
  children,
  className,
  collapsible = false,
}: {
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Separate header from other children
  const headerChild = ReactChildren.toArray(children).find(
    (child) => isValidElement(child) && child.type === CardHeader
  );
  const otherChildren = ReactChildren.toArray(children).filter(
    (child) => !(isValidElement(child) && child.type === CardHeader)
  );

  return (
    <div
      className={`bg-white rounded-md border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 ${className}`}
    >
      <RenderConditional condition={!collapsible}>{children}</RenderConditional>
      <RenderConditional condition={collapsible}>
        {headerChild &&
          cloneElement(headerChild as React.ReactElement, {
            isCollapsed,
            setIsCollapsed,
            collapsible,
          })}
        <RenderConditional condition={!isCollapsed}>
          {otherChildren}
        </RenderConditional>
      </RenderConditional>
    </div>
  );
}

export function CardHeader({
  children,
  isCollapsed,
  setIsCollapsed,
  collapsible,
}: {
  children: React.ReactNode;
  isCollapsed?: boolean;
  setIsCollapsed?: (value: boolean) => void;
  collapsible?: boolean;
}) {
  return (
    <div
      className={`px-4 py-3 flex items-center justify-between border-gray-200 dark:border-neutral-700 ${
        collapsible ? 'cursor-pointer' : ''
      } ${isCollapsed ? 'border-b-0' : 'border-b'}`}
      onClick={() => setIsCollapsed?.(!isCollapsed)}
    >
      {children}
      {collapsible && (
        <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'}`} />
      )}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className='font-semibold'>{children}</h2>;
}

export function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 py-3 border-t border-gray-200 dark:border-neutral-700 flex justify-end items-center'>
      {children}
    </div>
  );
}

export function CardActions({ children }: { children: React.ReactNode }) {
  return <div className='flex items-center gap-3'>{children}</div>;
}

export function CardActionButton({
  icon,
  text,
  showIcon = true,
  showText = false,
  onClick,
}: {
  icon?: string;
  text: string;
  showIcon?: boolean;
  showText?: boolean;
  onClick: () => void;
}) {
  const pathName = usePathname();

  const cardActionButtonOnClick = () => {
    sendGAEvent('event', 'card_action_button_click', {
      label: text,
      current_path: pathName,
    });
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className='flex text-sm items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors duration-150 ease-in-out'
      onClick={cardActionButtonOnClick}
      data-tooltip-id={`${text}-tooltip`}
      data-tooltip-content={text}
    >
      {showIcon && icon && <i className={`${icon} leading-5`}></i>}
      {showText && text}
      <Tooltip id={`${text}-tooltip`} />
    </button>
  );
}
