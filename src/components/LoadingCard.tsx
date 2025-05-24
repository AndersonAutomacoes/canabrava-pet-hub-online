
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingCard = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <Skeleton className="aspect-square bg-gray-100 rounded-lg mb-2" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-24" />
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Skeleton className="flex-1 h-10" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
};

export default LoadingCard;
