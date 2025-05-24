
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  breadcrumbs, 
  headerActions,
  className,
  containerSize = 'lg'
}: PageLayoutProps) => {
  const containerClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className="min-h-screen pet-gradient-bg">
      <Header />
      
      <main className={cn('pet-container py-8 lg:py-12', className)}>
        <div className={cn('mx-auto', containerClasses[containerSize])}>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          
          {/* Page Header */}
          {(title || headerActions) && (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                {title && (
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2 gradient-text">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 text-lg">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerActions && (
                <div className="mt-4 lg:mt-0">
                  {headerActions}
                </div>
              )}
            </div>
          )}
          
          {/* Page Content */}
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
