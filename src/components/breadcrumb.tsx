import Link from 'next/link';
import JsonLd from './json-ld';
import { buildBreadcrumbJsonLd, Crumb } from '@/common/utils/seo.util';

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const currentPath = crumbs[crumbs.length - 1]?.path ?? '/';
  const schemaId = `ld-breadcrumb-${currentPath
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-') || 'home'}`;

  return (
    <>
      <nav
        aria-label='Breadcrumb'
        className='mb-3 text-sm text-slate-500 dark:text-slate-400'
      >
        <ol className='flex flex-wrap items-center gap-1.5'>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.path} className='flex items-center gap-1.5'>
                {isLast ? (
                  <span aria-current='page'>{crumb.name}</span>
                ) : (
                  <>
                    <Link
                      href={crumb.path}
                      className='hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'
                    >
                      {crumb.name}
                    </Link>
                    <span aria-hidden='true'>/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd id={schemaId} data={buildBreadcrumbJsonLd(crumbs)} />
    </>
  );
}
