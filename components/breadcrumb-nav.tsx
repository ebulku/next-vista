'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

const MAX_BREADCRUMB_LENGTH: number = 3;

const BreadcrumbLogic = () => {
  const paths: string = usePathname();
  const separator: string = '/';
  const pathNames: string[] = paths
    .split(separator)
    .filter((path) => path !== '');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <HomeIcon className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length > MAX_BREADCRUMB_LENGTH && <BreadcrumbEllipsis />}
        {pathNames.slice(-MAX_BREADCRUMB_LENGTH).map((link, index) => {
          const href: string = `/${pathNames
            .slice(0, -MAX_BREADCRUMB_LENGTH + index + 1)
            .join('/')}`;
          const linkName: string = link[0].toUpperCase() + link.slice(1);
          const isLastPath: boolean = pathNames.length === index + 1;

          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {!isLastPath ? (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{linkName}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{linkName}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbLogic;
