import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Users, CreditCard, LogOut, ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";

const Sidebar = ({ menuItems, activeSection, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const getIcon = (id) => {
    switch (id) {
      case "enquiries":
        return <FileText size={20} />;
      case "admissions":
        return <Users size={20} />;
      case "fees":
        return <CreditCard size={20} />; // Changed to CreditCard which is more standard than IndianRupee for generic 'fees' icon context, but IndianRupee is fine too. Let's use IndianRupee if requested but standard icons are safer.
      default:
        return <LayoutDashboard size={20} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-6 left-6 h-[calc(100vh-3rem)] glass-panel rounded-3xl shadow-xl shadow-slate-200/50 z-40 transition-all duration-500 overflow-hidden flex flex-col border border-white/80
      ${sidebarOpen ? "w-64" : "w-20"} before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:pointer-events-none`}
    >
      {/* Sidebar Header */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-white/40 relative z-10">
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-200">
                <span className="text-white font-heading font-extrabold text-xl animate-fade-in">E</span>
             </div>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 font-heading font-extrabold text-2xl tracking-tight">EduBro</span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-200 mx-auto transition-all animate-fade-in-up">
             <span className="text-white font-heading font-extrabold text-xl">E</span>
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white/60 hover:bg-white text-slate-500 hover:text-primary-600 transition-all shadow-sm hidden md:block"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-3 relative z-10 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-3 py-4 rounded-2xl transition-all duration-300 ease-out group relative overflow-hidden
              ${isActive
                  ? "text-white shadow-lg shadow-primary-500/30"
                  : "text-slate-500 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm"
                }`}
            >
              {/* Active State Background Layer */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-100 transition-opacity duration-300"></div>
              )}

              <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary-500"}`}>
                {getIcon(item.id)}
              </div>

              <span
                className={`ml-3 whitespace-nowrap transition-all duration-300 font-bold tracking-wide relative z-10
                ${isActive ? "text-white" : ""}
                ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 overflow-hidden"}`}
              >
                {item.name}
              </span>

              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
        >
          <LogOut size={20} />
          <span
            className={`ml-3 font-medium whitespace-nowrap transition-all duration-200
            ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;