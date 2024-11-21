import React from "react";
import { SecurityComponent } from "../components/SecurityComponent";

const Security = () => {
  return (
    // bg can be added below
    <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50">
      <div className=" container mx-auto py-16 content-center px-80">
        <SecurityComponent />
      </div>
    </div>
  );
};

export default Security;
