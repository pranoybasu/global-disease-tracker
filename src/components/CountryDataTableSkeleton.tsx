import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for CountryDataTable
 * Displays placeholder UI while data is loading
 */
export function CountryDataTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter Controls Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Input */}
            <Skeleton className="h-10 flex-1" />
            
            {/* Continent Filter */}
            <Skeleton className="h-10 w-full sm:w-48" />
            
            {/* Export Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 pb-3 border-b">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Table Rows - Show 10 skeleton rows */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 py-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}