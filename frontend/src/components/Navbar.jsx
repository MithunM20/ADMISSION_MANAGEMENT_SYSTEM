import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { API_BASE_URL } from "../config";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? `${API_BASE_URL}/api/auth/login`
        : `${API_BASE_URL}/api/auth/register`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isLogin ? "Login failed" : "Signup failed"));
      }

      const data = await response.json();

      let normalizedRole;
      if (data.user && data.user.role) {
        normalizedRole = data.user.role.toLowerCase().trim();
      } else if (data.role) {
        // Fallback if backend sends role at root level
        normalizedRole = data.role.toLowerCase().trim();
      } else {
        // If login, maybe we can decode from token, but simplistic here
        // Assume student if unclear or check your specific backend response structure
        normalizedRole = "student";
      }

      localStorage.setItem("token", data.token);
      const userData = { name: data.user ? data.user.name : "User", role: normalizedRole };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (normalizedRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "student" });
    } catch (error) {
      console.error("Error during submission:", error);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-transparent text-white"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${scrolled ? "bg-primary-600 text-white" : "bg-white text-primary-600"}`}>
              E
            </div>
            <span className={`font-heading font-bold text-2xl tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
              EduBro
            </span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className={`font-medium hidden md:block ${scrolled ? "text-gray-700" : "text-gray-100"}`}>
                  Hi, {user.name}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-600" />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-full transition-colors ${scrolled ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/20 text-white"}`}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg
                  ${scrolled
                    ? "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-500/30"
                    : "bg-white text-primary-600 hover:bg-gray-50"
                  }`}
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modal Overlay */}
      {isModalOpen && !user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500" />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-10">
              <div className="text-center mb-8">
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-500">
                  {isLogin ? "Enter your details to access your account" : "Start your learning journey with us"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["student", "admin"].map((role) => (
                        <button
                          type="button"
                          key={role}
                          onClick={() => setFormData({ ...formData, role })}
                          className={`py-3 px-4 rounded-xl border font-medium capitalize transition-all ${formData.role === role
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        role: "student",
                      });
                    }}
                    className="text-primary-600 font-semibold hover:text-primary-700"
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
