import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Adjust path as needed
import Admission from "./Admission"; // Adjust path as needed
import FeePayment from "./FeePayment"; // Adjust path as needed

const Student = () => {
  const [activeSection, setActiveSection] = useState("admission");

  const menuItems = [
    { name: "Admission", id: "admission" },
    { name: "Fee Payment", id: "payment" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex font-roboto">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 pt-24 px-4 sm:px-6 md:px-8 lg:ml-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-[#002147] font-bold text-2xl sm:text-3xl mb-6 text-center">
            Admission Dashboard
          </h1>
          {activeSection === "admission" && <Admission />}
          {activeSection === "payment" && <FeePayment />}
        </div>
      </div>
    </div>
  );
};

export default Student;