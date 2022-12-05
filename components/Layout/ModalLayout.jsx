import React from "react";

const ModalLayout = ({ children, image }) => {
  return (
    <div className="z-40 top-0 left-0 fixed w-full h-screen bg-black/50 flex items-center justify-center">
      <div
        className={`rounded-md p-4 bg-white ${
          image && "relative max-w-imageModal max-h-imageModal overflow-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
