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
    <div className="min-h-screen bg-mesh flex font-sans relative overflow-hidden">
      {/* Decorative gradient orbs in background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-secondary-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 pt-24 px-4 sm:px-8 md:px-12 lg:ml-[280px] transition-all duration-300 z-10 w-full overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto animate-fade-in-up pb-12">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-[2rem]">
            <div>
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-secondary-700 font-heading font-extrabold text-3xl sm:text-4xl mb-2 tracking-tight">
                Student Portal
              </h1>
              <p className="text-slate-500 text-base font-medium">Manage your academic journey and fee payments seamlessly.</p>
            </div>
            <div className="flex items-center gap-4 bg-white/60 p-2 pr-6 rounded-full border border-white shadow-sm backdrop-blur-md">
               <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 p-[2px] shadow-lg shadow-primary-200">
                 <div className="h-full w-full rounded-full bg-white flex items-center justify-center font-bold text-xl text-primary-600">
                   S
                 </div>
               </div>
               <div className="hidden sm:block">
                 <p className="font-bold text-slate-800 text-sm leading-tight">Student User</p>
                 <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Active Session</p>
               </div>
            </div>
          </div>
          
          <div className="mt-8 relative z-20">
            {activeSection === "admission" && <Admission />}
            {activeSection === "payment" && <FeePayment />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;