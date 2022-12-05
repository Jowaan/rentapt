import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between h-12">
      <img src="logo.png" className="h-full" />
      <button className="bg-slate-900 text-white px-4 p-2 rounded-md">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
