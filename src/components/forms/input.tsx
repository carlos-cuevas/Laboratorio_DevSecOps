interface InputProps {
  placeholder?: string;
  className?: string;
  type?: string;
  disabled?: boolean;
  value: string | number;
  maxLength?: number;
  max?: number;
  min?: number;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export default function Input({
  value,
  placeholder,
  className,
  type,
  disabled,
  maxLength,
  max,
  min,
  readOnly,
  onChange,
  onBlur,
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      className={`w-full bg-white dark:bg-neutral-700 py-1.5 px-3 rounded-md outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-zinc-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6 ${className ?? ''}`}
      disabled={disabled}
      maxLength={maxLength}
      max={max}
      min={min}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      onBlur={onBlur}
    />
  );
}
