import React from "react";
import moment from "moment";
const FooterLayout = () => {
  return (
    <div className="z-10 bg-zinc-900 text-zinc-200 flex items-center justify-center py-5 px-5">
      <p>
        Copyright &copy; {moment().format("YYYY")} | RentApt. All Rights
        Reserved
      </p>
    </div>
  );
};

export default FooterLayout;
