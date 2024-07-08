import React from "react";
import Image from "next/image";

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="logo">
        <Image src="/Icons/navigrowth.svg" alt="Logo" layout="fill" />
      </div>
      <div className="search">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    </div>
  );
};

export default TopBar;
