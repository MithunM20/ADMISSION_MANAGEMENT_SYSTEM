import React, { useState } from "react";
import { ArrowRight, Star, BookOpen, Users, Award, X } from "lucide-react";
import mernCourseImage from "../assets/course-mern.svg";
import djangoCourseImage from "../assets/course-django.svg";
import marketingCourseImage from "../assets/course-marketing.svg";

const courses = [
  {
    id: 1,
    title: "MERN Stack Development",
    description: "Master MongoDB, Express, React, and Node.js. Build full-stack applications from scratch.",
    price: "Rs. 39,999",
    rating: 4.8,
    students: 1200,
    color: "from-blue-500 to-cyan-500",
    image: mernCourseImage,
    imageAlt: "Illustration representing a MERN stack development course",
    tag: "Full Stack",
    icon: <BookOpen className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    title: "Python Django Masterclass",
    description: "Build robust backends with Python and Django. Includes REST APIs and database management.",
    price: "Rs. 35,999",
    rating: 4.7,
    students: 950,
    color: "from-emerald-500 to-teal-500",
    image: djangoCourseImage,
    imageAlt: "Illustration representing a Python Django programming course",
    tag: "Backend",
    icon: <code className="w-6 h-6 text-white font-bold">Py</code>,
  },
  {
    id: 3,
    title: "Digital Marketing Pro",
    description: "Learn SEO, SEM, social media, and content strategy. Become a certified marketer.",
    price: "Rs. 32,999",
    rating: 4.6,
    students: 1500,
    color: "from-orange-500 to-pink-500",
    image: marketingCourseImage,
    imageAlt: "Illustration representing a digital marketing course",
    tag: "Growth",
    icon: <Users className="w-6 h-6 text-white" />,
  },
];

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website",
    interestLevel: 5,
    course: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, status: "new" };

    fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Enquiry submitted successfully! We'll contact you shortly.");
        setIsModalOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          source: "website",
          interestLevel: 5,
          course: "",
          notes: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <header className="relative flex h-[90vh] w-full items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-block rounded-full border border-primary-500/30 bg-primary-500/20 px-4 py-1.5 backdrop-blur-md">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-300">
              Launch your tech career today
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-heading font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            Build Your Future <br />
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              With EduBro
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-300">
            Join thousands of students mastering the skills of tomorrow. Expert-led courses in coding, design, and marketing.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => {
                const coursesSection = document.getElementById("courses");
                coursesSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-gray-900 shadow-lg transition-all hover:-translate-y-1 hover:bg-gray-100"
            >
              Explore Courses
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 font-bold text-white shadow-lg shadow-primary-600/30 transition-all hover:-translate-y-1 hover:bg-primary-500"
            >
              Get Started <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-16 flex justify-center gap-8 text-gray-400 grayscale opacity-70 md:gap-16">
            <div className="flex items-center gap-2">
              <Star size={20} /> Top Rated
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} /> 10k+ Learners
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} /> Certified
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { label: "Active Students", value: "12,000+" },
              { label: "Courses", value: "50+" },
              { label: "Instructors", value: "120+" },
              { label: "Employment Rate", value: "94%" },
            ].map((stat, i) => (
              <div key={i}>
                <h3 className="mb-1 text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-3 font-semibold uppercase tracking-wide text-primary-600">Education for everyone</h2>
            <h3 className="text-3xl font-heading font-bold text-gray-900 md:text-5xl">Popular Courses</h3>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.imageAlt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-55`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/25 to-white/10"></div>
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white opacity-10 blur-2xl"></div>

                  <div className="relative z-10 flex h-full flex-col justify-between p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                        {course.icon}
                      </div>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                        {course.tag}
                      </span>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">
                        Best Seller
                      </p>
                      <h3 className="max-w-[15rem] text-2xl font-bold leading-tight text-white">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">
                      {course.tag} Course
                    </p>
                  </div>

                  <p className="mb-6 leading-relaxed text-gray-500">{course.description}</p>

                  <div className="mb-8 flex items-center gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-gray-400" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                    <button
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, course: course.title }));
                        setIsModalOpen(true);
                      }}
                      className="rounded-xl bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary-600"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-heading font-bold text-gray-900 md:text-5xl">
            Ready to start your journey?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-500">
            Get in touch with our counselors today and find the perfect path for your career growth.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-2xl"
          >
            Enquire Now
          </button>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
          <div>
            <h4 className="mb-6 text-2xl font-heading font-bold text-white">EduBro</h4>
            <p className="leading-relaxed">Empowering students with industry-ready skills for a brighter future.</p>
          </div>
          <div>
            <h5 className="mb-4 font-bold text-white">Courses</h5>
            <ul className="space-y-2">
              <li className="cursor-pointer hover:text-primary-400">Web Development</li>
              <li className="cursor-pointer hover:text-primary-400">Data Science</li>
              <li className="cursor-pointer hover:text-primary-400">Marketing</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 font-bold text-white">Company</h5>
            <ul className="space-y-2">
              <li className="cursor-pointer hover:text-primary-400">About Us</li>
              <li className="cursor-pointer hover:text-primary-400">Careers</li>
              <li className="cursor-pointer hover:text-primary-400">Contact</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 font-bold text-white">Legal</h5>
            <ul className="space-y-2">
              <li className="cursor-pointer hover:text-primary-400">Terms & Conditions</li>
              <li className="cursor-pointer hover:text-primary-400">Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-gray-800 px-6 pt-8 text-center text-sm">
          (c) {new Date().getFullYear()} EduBro. All rights reserved.
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-in-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <h2 className="mb-2 text-2xl font-heading font-bold text-gray-900">Speak to a Counselor</h2>
              <p className="mb-6 text-gray-500">Fill out the form below and we'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Interested Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Select a course...</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="website">Website</option>
                    <option value="social media">Social Media</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 py-3.5 font-bold text-white shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 hover:shadow-primary-500/40"
                >
                  Submit Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
