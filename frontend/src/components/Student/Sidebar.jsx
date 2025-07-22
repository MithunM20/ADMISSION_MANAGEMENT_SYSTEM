import React from "react";
import { FileText } from "react-feather"; // From react-feather
import { IndianRupee } from "lucide-react"; // From lucide-react

const Sidebar = ({ menuItems, activeSection, setActiveSection }) => {
  // Map menu item IDs to icons
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
    <div className="fixed top-20 h-[calc(100vh-5rem)] bg-[#002147] shadow-md z-40 w-64">
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center p-4 text-white hover:bg-[#4A90E2] transition-colors w-full text-left font-roboto ${
              activeSection === item.id ? "bg-[#003087]" : ""
            }`}
          >
            {getIcon(item.id)}
            <span className="text-base md:text-lg font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;