import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/authContext";

export function HomeSkeleton() {
  const { user } = useAuth();
  return (
    <>
      <Skeleton className="h-16 w-full" />
      <div className="max-w-sm mx-auto px-2 mt-4 flex flex-col gap-4">
        {user?.role !== "user" && <Skeleton className="h-8 w-32" />}
        <Skeleton className="h-[278px] w-full" />
      </div>
    </>
  );
}
