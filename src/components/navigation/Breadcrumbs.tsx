
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const navigate = useNavigate();

  const handleClick = (href?: string) => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)} aria-label="Breadcrumb">
      <button
        onClick={() => handleClick('/')}
        className="flex items-center text-gray-500 hover:text-green-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => handleClick(item.href)}
            disabled={item.current || !item.href}
            className={cn(
              'transition-colors',
              item.current 
                ? 'text-gray-800 font-medium cursor-default' 
                : 'text-gray-500 hover:text-green-600'
            )}
          >
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );
};
