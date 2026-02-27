import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  count?: number;
}

export function SkeletonCard({ count = 1 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card className="w-full h-full" key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="h-full overflow-hidden flex flex-col justify-end">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
