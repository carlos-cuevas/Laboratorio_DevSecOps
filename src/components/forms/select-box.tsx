'use client';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';

interface SelectBoxProps {
  className?: string;
  options: { text: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function SelectBox({
  className,
  options,
  value,
  onChange,
}: SelectBoxProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className || ''}`}>
        <ListboxButton className='grid w-full cursor-pointer grid-cols-1 rounded-md bg-white dark:bg-neutral-700 py-1.5 pl-3 pr-2 text-left outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-zinc-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-500 sm:text-sm/6'>
          <span className='col-start-1 row-start-1 flex items-center gap-3 pr-6'>
            <span className='block truncate'>
              {options.find((o) => o.value === value)?.text}
            </span>
          </span>
          <i
            className={`fad fa-fw fa-sort col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 dark:text-neutral-300 sm:size-4`}
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-neutral-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm'
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className='group relative cursor-pointer select-none py-2 pl-3 pr-9  data-[focus]:bg-emerald-500 data-[focus]:text-white data-[focus]:outline-none'
            >
              <div className='flex items-center'>
                <span className='ml-3 block truncate font-normal group-data-[selected]:font-semibold'>
                  {option.text}
                </span>
              </div>

              {value === option.value && (
                <span className='absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-500 dark:text-emerald-400 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white'>
                  <i className='fal fa-fw fa-check flex items-center justify-center size-5' />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
