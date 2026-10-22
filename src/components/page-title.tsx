export default function PageTitle({
  title,
  description,
  icon,
  as: Heading = 'h1',
}: {
  title: string;
  description?: string;
  icon?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <>
      <Heading className={`text-2xl font-bold ${description ? 'mb-2' : 'mb-5'} flex items-center gap-3`}>
        {icon && <i className={icon} />}
        {title}
      </Heading>
      {description && (
        <p className='text-sm text-slate-700 mb-5 dark:text-slate-300'>
          {description}
        </p>
      )}
    </>
  );
}
