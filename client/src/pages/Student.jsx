import React, { useRef } from "react";
import { StudentTable } from "../components/StudentTable";
import PrintQrComponent from "../components/PrintQrComponent";
import { Outlet } from "react-router-dom";

const Student = () => {
  const studentTableRef = useRef();
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      <div
        className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50
">
        <div className="container mx-auto ">
          <div className="w-full mx-auto px-12 py-16 no-print">
            <StudentTable handlePrint={handlePrint} />
          </div>
        </div>
        <div className="hidden print">
          <PrintQrComponent />
        </div>
      </div>
    </>
  );
};

export default Student;
