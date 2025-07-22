import React, { useState } from "react";
import homeimg from "../assets/homeimg.png";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website", // Default source
    interestLevel: 5, // Default interest level (1-10)
    course: "", // New field for interested course
    assignedTo: "", // Optional, can be set by backend
    notes: "", // Optional notes
  });

  const courses = [
    { id: 1, title: "MERN Stack", description: "MERN Stack is a popular web development framework that combines MongoDB, Express.js, React, and Node.js to build dynamic and scalable applications.", price: "39999/-" },
    { id: 2, title: "Python Django", description: "Django is a high-level Python web framework that simplifies web development by providing built-in features like authentication, database management, and an admin panel.", price: "35999/-" },
    { id: 3, title: "Digital Marketing", description: "Digital marketing is the practice of promoting products or services using online channels such as search engines, social media, email, and websites.", price: "32999/-" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      status: "new", // Default status
    };
    console.log("Lead Data Submitted:", finalData);

    fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

    setIsModalOpen(false);
    alert("Thank you for your enquiry! We will contact you soon.");
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Header Image */}
      <header className="w-full h-96 relative mt-20">
        <img
          src={homeimg}
          alt="Header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center pl-20">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">Welcome to EduBro</h1>
            <p className="text-2xl font-bold text-white">Build Your Career with us</p>
          </div>
        </div>
      </header>

      {/* Courses Section */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-[#002147] font-bold text-2xl mb-8 text-center">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-[#002147] font-bold text-xl mb-2">{course.title}</h3>
              <p className="text-[#333333] text-base mb-4">{course.description}</p>
              <p className="text-[#333333] font-semibold">{course.price}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6">
        <p className="text-[#333333] text-lg font-medium">
          After you enquire, our team will contact you with detailed information about the courses and next steps.
        </p>
      </div>

      {/* Enquiry Button */}
      <div className="text-center py-12">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#002147] text-white rounded-lg hover:bg-[#4A90E2] transition-colors"
        >
          Enquiry Now
        </button>
      </div>

      {/* Modal for Lead Enquiry Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-[#002147] font-bold text-2xl mb-4">Lead Enquiry Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                />
              </div>

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
                <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="phone">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                />
              </div>

              <div>
                <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="source">
                  Source*
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                >
                  <option value="website">Website</option>
                  <option value="social media">Social Media</option>
                  <option value="referral">Referral</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="course">
                  Interested Course*
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="interestLevel">
                  Interest Level (1-10)*
                </label>
                <input
                  type="number"
                  id="interestLevel"
                  name="interestLevel"
                  value={formData.interestLevel}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                />
              </div>

              <div>
                <label className="block text-[#333333] text-sm font-medium mb-1" htmlFor="notes">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  rows="3"
                  placeholder="E.g., Interested in premium plan"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#333333] border border-[#002147] rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] text-white rounded-lg hover:bg-[#4A90E2] transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;