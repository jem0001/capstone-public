import React, { useState } from "react";
import { WeeksGrid } from "../components/WeeksGrid";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Weeks = () => {
  return (
    // bg can be added below
    <div className="w-full h-full bg-gradient-to-t from-gray-700 to-slate-50">
      <div className="h-full container mx-auto py-12 px-28 ">
        <h1 className="text-4xl font-bold text-center mb-16 tracking-widest uppercase"></h1>
        <WeeksGrid />
      </div>
    </div>
  );
};

export default Weeks;
