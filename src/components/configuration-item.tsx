interface IConfigurationItemProps {
  icon: string;
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function ConfigurationItem({
  icon,
  label,
  description,
  children,
}: IConfigurationItemProps) {
  return (
    <div className='flex items-center justify-between gap-4 mb-3 py-2 last:mb-0'>
      <div className='flex items-center gap-4'>
        <i className={`fal fa-fw ${icon}`} />
        <div className='flex-1'>
          <h4 className='text-sm'>{label}</h4>
          <p className='text-xs text-gray-500 dark:text-neutral-400'>
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
