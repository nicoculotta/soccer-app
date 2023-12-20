import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/authContext";

export function MatchSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="grid grid-cols-1 gap-y-2 mb-8">
        <div className="grid grid-cols-1 gap-y-2 mb-4">
          <Skeleton className="h-4 w-24 rounded-sm" />
          <Skeleton className="h-6 w-36 rounded-sm" />
        </div>
        <div className="flex w-full gap-2">
          <Skeleton className="h-10 w-full rounded-sm" />
          <Skeleton className="h-10 w-full rounded-sm" />
        </div>
      </div>
      <Skeleton className="h-6 w-24 rounded-sm" />
      <div className="flex flex-col gap-2 mt-3">
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md opacity-90" />
        <Skeleton className="h-14 w-full rounded-md opacity-80" />
      </div>
    </>
  );
}
