import React, { Children } from "react";
import SideBar from "../Bar/SideBar";
import HeaderLayout from "./HeaderLayout";

const SectionLayout = ({ title, children }) => {
  return (
    <>
      <HeaderLayout title={title} />
      <div className="flex sticky">
        <SideBar />
        <div className="p-8 w-full overflow-auto">
          <p className="text-2xl py-8">{title}</p>
          {children}
        </div>
      </div>
    </>
  );
};

export default SectionLayout;
