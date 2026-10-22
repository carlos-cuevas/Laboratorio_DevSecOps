import { Switch } from '@headlessui/react';

interface ToggleProps {
  checked: boolean;
  onChange: (enabled: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className='group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-neutral-700 transition data-[checked]:bg-emerald-500'
    >
      <span className='size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6' />
    </Switch>
  );
}
