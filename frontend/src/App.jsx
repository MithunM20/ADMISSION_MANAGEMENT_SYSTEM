import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Student from "./components/Student/Student";
import Admin from "./components/Admin/Admin";
import Enquiry from "./components/Admin/Enquiry";
import Admissions from "./components/Admin/admissions";
import FeesCollection from "./components/Admin/FeesCollection";

const AppContent = () => {
  const location = useLocation();
  // Hide Navbar on admin routes
  const showNavbar = !location.pathname.startsWith("/admin");

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/*" element={<Student />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Enquiry />} />
          <Route path="enquiries" element={<Enquiry />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="fees" element={<FeesCollection />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;