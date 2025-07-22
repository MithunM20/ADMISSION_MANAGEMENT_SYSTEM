import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjust path as needed
import Home from "./components/Home"; // Assuming you have this
import Student from "./components/Student/Student"; // We'll create this
import Admin from "./components/Admin/Admin";
import Enquiry from "./components/Admin/Enquiry"
import Admissions from "./components/Admin/admissions";
import FeesCollection from "./components/Admin/FeesCollection";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Enquiry />} />
          <Route path="enquiries" element={<Enquiry />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="fees" element={<FeesCollection/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;