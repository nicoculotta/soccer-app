import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode } from "react";

interface iSheetModal {
  button: ReactNode;
  children: ReactNode;
  isAdmin: boolean;
}

export function SheetModal({ button, children, isAdmin = false }: iSheetModal) {
  return (
    <>
      {isAdmin && (
        <Sheet>
          <SheetTrigger asChild>{button}</SheetTrigger>
          <SheetContent side={"bottom"}>{children}</SheetContent>
        </Sheet>
      )}
    </>
  );
}
