import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode } from "react";

interface iSheetModal {
  button?: ReactNode;
  children: ReactNode;
  isAdmin?: boolean;
  isOpen?: boolean;
  setIsOpen?: ((isOpen: boolean) => void) | undefined;
}

export function SheetModal({
  button,
  children,
  isAdmin = true,
  isOpen,
  setIsOpen,
}: iSheetModal) {
  return (
    <>
      {isAdmin && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side={"bottom"}>{children}</SheetContent>
          {button && <SheetTrigger asChild>{button}</SheetTrigger>}
        </Sheet>
      )}
    </>
  );
}
