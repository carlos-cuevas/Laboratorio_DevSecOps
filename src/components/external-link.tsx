import Link from 'next/link';

export default function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-emerald-500 font-medium hover:text-emerald-600 transition-colors duration-200'
    >
      {children}
    </Link>
  );
}
