import React, { ReactNode, SetStateAction } from "react";

const Overlay = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    ></div>
  );
};

const CustomSheetModal = ({
  isOpen,
  children,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  children: ReactNode;
}) => {
  return (
    <div>
      {isOpen && (
        <>
          <Overlay onClick={setIsOpen} />
          {children}
        </>
      )}
    </div>
  );
};

export default CustomSheetModal;
