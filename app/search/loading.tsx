import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Skeleton className="h-8 w-40 mb-8" />
          
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <Card key={i} className="border-amber-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-xl overflow-hidden border-amber-200 h-full">
            <div className="relative h-64 w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-80" />
                <div className="flex flex-wrap gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-20 rounded-full" />
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-3">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-2">
                        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 