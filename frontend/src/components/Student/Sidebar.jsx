import React from "react";
import { FileText } from "react-feather";
import { IndianRupee } from "lucide-react";

const Sidebar = ({ menuItems, activeSection, setActiveSection }) => {
  const getIcon = (id) => {
    switch (id) {
      case "admission":
        return <FileText className="mr-3" size={20} />;
      case "payment":
        return <IndianRupee className="mr-3" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-24 left-6 h-[calc(100vh-8rem)] glass-panel rounded-3xl shadow-xl shadow-slate-200/50 z-40 w-64 flex flex-col transition-all duration-500 border border-white/80 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:pointer-events-none">
      <div className="px-6 pt-8 pb-4 relative z-10 text-center border-b border-white/40">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-200 mb-3">
          <FileText size={24} />
        </div>
        <h2 className="text-xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">EduSpace</h2>
      </div>
      <nav className="mt-6 px-4 flex-1 space-y-3 relative z-10">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ease-out w-full text-left group overflow-hidden relative ${
                isActive 
                ? "text-white shadow-lg shadow-primary-500/30"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm"
              }`}
            >
              {/* Active State Background Layer */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-100 transition-opacity duration-300"></div>
              )}
              
              <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 mr-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary-500"}`}>
                 {getIcon(item.id)}
              </div>
              <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors ${isActive ? "text-white" : ""}`}>{item.name}</span>
            </button>
          );
        })}
      </nav>
      {/* Decorative element at bottom */}
      <div className="p-6 relative z-10 border-t border-white/40">
         <div className="bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-2xl p-4 border border-white/60 text-center shadow-inner">
            <p className="text-xs font-bold text-slate-700">Need Help?</p>
            <p className="text-[10px] text-slate-500 mt-0.5 mb-3 font-medium">Contact support team</p>
            <button className="w-full py-2.5 bg-white rounded-xl text-xs font-extrabold tracking-wide text-primary-600 shadow-sm hover:shadow hover:bg-primary-50 transition-all active:scale-95">Support</button>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;