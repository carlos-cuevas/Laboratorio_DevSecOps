export default function FileSelector({
  onChange,
  ref,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<HTMLInputElement>;
}) {
  return (
    <input
      type='file'
      onChange={(e) => onChange(e)}
      ref={ref}
      className='block w-full text-sm text-slate-500 dark:text-slate-400
  file:mr-4 file:py-2 file:px-4
  file:rounded-full file:border-0
  file:text-sm file:font-semibold
  file:bg-emerald-50 file:text-emerald-700
  hover:file:bg-emerald-100
  dark:file:bg-emerald-900 dark:file:text-emerald-300 dark:hover:file:text-emerald-600 cursor-pointer file:cursor-pointer file:transition-all file:duration-300 file:ease-in-out'
    />
  );
}
