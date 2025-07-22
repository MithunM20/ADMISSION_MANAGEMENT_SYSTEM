import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      console.log("Loaded user from localStorage:", JSON.stringify(storedUser, null, 2));
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Changing field:", name, "to value:", value, "Current formData:", JSON.stringify(formData, null, 2));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data being sent to backend:", JSON.stringify(formData, null, 2));
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", JSON.stringify(errorData, null, 2));
        throw new Error(errorData.message || (isLogin ? "Login failed" : "Signup failed"));
      }

      const data = await response.json();
      console.log("Response from server:", JSON.stringify(data, null, 2));

      // Check for role in data.user.role (updated from data.role)
      if (!data.user || !data.user.role) {
        console.error("No role found in response. Full response:", JSON.stringify(data, null, 2));
        throw new Error("Server did not return a role. Contact support.");
      }

      // Normalize and validate role
      const normalizedRole = data.user.role.toLowerCase().trim();
      console.log("Normalized and trimmed role from response:", normalizedRole, "(Type:", typeof normalizedRole, ")");

      if (normalizedRole !== "admin" && normalizedRole !== "student") {
        console.error("Unexpected role value:", normalizedRole);
        throw new Error("Invalid role received from server. Expected 'admin' or 'student'.");
      }

      localStorage.setItem("token", data.token);
      const userData = { name: data.user.name, role: normalizedRole }; // Use data.user.name and data.user.role
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      console.log(isLogin ? "Login successful:" : "Signup successful:", JSON.stringify(userData, null, 2));

      alert(isLogin ? "Login successful!" : "Signup successful! Check your email for confirmation.");

      console.log("Final navigation check - Role:", normalizedRole, "Type:", typeof normalizedRole);
      if (normalizedRole === "admin") {
        console.log("CONFIRMED: Navigating to /admin. Role is:", normalizedRole);
        navigate("/admin");
      } else {
        console.log("CONFIRMED: Navigating to /student. Role is:", normalizedRole);
        navigate("/student");
      }

      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "student" });
    } catch (error) {
      console.error("Error during submission:", error);
      alert(error.message || `There was an error during ${isLogin ? "login" : "signup"}. Please try again.`);
    }
  };

  const handleLogout = () => {
    console.log("Logging out user:", JSON.stringify(user, null, 2));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    console.log("User logged out, navigated to /");
  };

  return (
    <nav className="fixed top-0 left-0 w-screen h-20 bg-[#F5F5F5] text-[#002147] shadow-md flex items-center px-6 z-50">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <h1 className="text-[#002147] font-bold text-lg">EduBro</h1>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-[#002147] font-medium hidden md:block">{user.name}</span>
              <img
                src="/path-to-your-image.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-[#002147]"
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#002147] text-white rounded-lg hover:bg-[#4A90E2] transition-colors hidden md:block"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#002147] text-white rounded-lg hover:bg-[#4A90E2] transition-colors hidden md:block"
            >
              Login/Signup
            </button>
          )}
        </div>
      </div>

      {isModalOpen && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-[#002147] font-bold text-2xl mb-4">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="name">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="email">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                />
              </div>

              <div>
                <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="password">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="role">
                    Role*
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ name: "", email: "", password: "", role: "student" });
                    console.log("Switched to", isLogin ? "Signup" : "Login", "mode");
                  }}
                  className="text-[#4A90E2] hover:underline"
                >
                  {isLogin ? "Need to Sign Up?" : "Already have an account? Login"}
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-[#333333] border border-[#002147] rounded-lg hover:bg-gray-100 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#002147] text-white rounded-lg hover:bg-[#4A90E2] transition-colors"
                  >
                    {isLogin ? "Login" : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;