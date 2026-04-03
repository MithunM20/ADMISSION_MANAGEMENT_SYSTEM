import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { LogOut, Bell, Search, Menu } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is logged in and is an admin
  React.useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const menuItems = [
    { id: "enquiries", name: "Enquiries", path: "/admin/enquiries" },
    { id: "admissions", name: "Admissions", path: "/admin/admissions" },
    { id: "fees", name: "Fees Collection", path: "/admin/fees" },
  ];

  // Determine active section based on current path
  const currentPath = location.pathname;
  const activeSection = menuItems.find(item => currentPath.includes(item.path))?.id || "enquiries";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-mesh font-sans relative overflow-hidden">
      {/* Decorative gradient orbs in background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-secondary-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar Component */}
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-500 flex flex-col z-10 ${sidebarOpen ? "ml-[280px]" : "ml-[100px]"
          }`}
      >
        {/* Top Header */}
        <header className="glass-panel mx-6 mt-6 rounded-3xl sticky top-6 z-30 px-8 py-5 flex justify-between items-center transition-all duration-300 shadow-sm border border-white/80">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
              {menuItems.find(item => item.id === activeSection)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 w-64 transition-all"
              />
            </div>

            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 p-[2px]">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center font-bold text-primary-600">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;