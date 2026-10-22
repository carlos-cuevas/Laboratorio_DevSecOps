interface TextareaProps {
  value: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  rows?: number;
}

export default function Textarea({
  value,
  placeholder,
  className,
  readOnly,
  onChange,
  rows,
}: TextareaProps) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      className={`w-full bg-white dark:bg-neutral-700 py-3 px-4 disabled:cursor-text rounded-md outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-zinc-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 active:outline active:outline-2 active:-outline-offset-2 active:outline-emerald-500 ${className}`}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      rows={rows}
    />
  );
}
