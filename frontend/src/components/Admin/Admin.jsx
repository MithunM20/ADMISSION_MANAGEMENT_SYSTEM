import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Adjust path based on your structure

const Admin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeSection, setActiveSection] = useState("enquiries"); // Default section

  // Check if user is logged in and is an admin
  if (!user || user.role !== "admin") {
    navigate("/"); // Redirect to home if not an admin or not logged in
    return null;
  }

  const menuItems = [
    { id: "enquiries", name: "Enquiries", path: "/admin/enquiries" },
    { id: "admissions", name: "Admissions", path: "/admin/admissions" },
    { id: "fees", name: "Fees Collection", path: "/admin/fees" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    console.log("Admin logged out, navigated to /");
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const selectedItem = menuItems.find((item) => item.id === sectionId);
    if (selectedItem) {
      navigate(selectedItem.path); // Navigate to the respective page
      console.log(`Navigated to ${selectedItem.path}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]" style={{ fontFamily: "Roboto, Open Sans, sans-serif" }}>
      {/* Sidebar Component */}
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        setActiveSection={handleSectionChange} // Pass navigation handler
      />

      {/* Main Content */}
      <div
        className="flex-1 p-6 ml-16 md:ml-20 lg:ml-64" // Adjust margin based on sidebar width
        style={{ transition: "margin-left 0.3s" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-2xl font-bold text-[#002147]"
            style={{ fontFamily: "Roboto, Open Sans, sans-serif" }}
          >
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-[#002147] text-white rounded hover:bg-[#4A90E2] transition-colors"
            style={{ fontFamily: "Roboto, Open Sans, sans-serif", fontSize: "16px" }}
          >
            Logout
          </button>
        </div>
        <Outlet /> {/* Renders nested routes */}
      </div>
    </div>
  );
};

export default Admin;

// Load fonts (if not already in your project)
const fontStyle = document.createElement("link");
fontStyle.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&display=swap";
fontStyle.rel = "stylesheet";
document.head.appendChild(fontStyle);