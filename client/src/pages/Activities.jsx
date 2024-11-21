import React from "react";
import { ActivitiesGrid } from "../components/ActivitiesGrid";

const Activities = () => {
  return (
    <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50">
      <div className="h-full container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-8 text-center tracking-widest">
          MGA AKTIBIDAD
        </h1>
        <ActivitiesGrid />
      </div>
    </div>
  );
};

export default Activities;
