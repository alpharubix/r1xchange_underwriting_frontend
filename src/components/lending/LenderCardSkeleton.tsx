import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function LenderCardSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 h-16 bg-slate-100 rounded-lg animate-pulse" />
            <div className="flex-1 h-16 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          
          <div className="h-10 w-full bg-slate-50 rounded animate-pulse mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}
