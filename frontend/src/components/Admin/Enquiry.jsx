import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaWhatsapp, FaSms } from "react-icons/fa"; // Icons for replies

const Enquiries = () => {
  const [leads, setLeads] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeads(res.data);
        console.log("Fetched Leads:", res.data); // Debug log to check if course data is present
      } catch (error) {
        console.error("Failed to fetch leads", error);
      }
    };

    fetchLeads();
  }, []);

  const handleEmailReply = (lead) => {
    const subject = encodeURIComponent(`Re: Enquiry from ${lead.name} for ${lead.course || 'a course'}`);
    const body = encodeURIComponent(`Dear ${lead.name},\n\nThank you for your enquiry about ${lead.course}. In this mail attached the document of your prefered course check it `);
    window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppReply = (lead) => {
    const message = encodeURIComponent(`Hello ${lead.name}, thank you for your enquiry about ${lead.course}. How can we assist you further?`);
    window.open(`https://wa.me/${lead.phone}?text=${message}`, '_blank');
  };

  const handleSMSReply = (lead) => {
    const message = `Hello ${lead.name}, thank you for your enquiry about ${lead.course}. How can we assist you further?`;
    alert(`SMS to ${lead.phone}: ${message}\nNote: This is a demo. Integrate with an SMS service like Twilio for actual sending.`);
  };

  const getInterestBarWidth = (interestLevel) => {
    const level = Math.min(10, Math.max(0, Number(interestLevel) || 0));
    return (level / 10) * 100;
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <h2 className="text-2xl font-bold text-[#002147] mb-8 text-center drop-shadow-md animate-fadeIn">Lead Enquiries</h2>
      <div className="max-w-6xl mx-auto">
        <table className="w-full bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-[#4A90E2] to-[#50C878] text-white text-left">
              <th className="py-4 px-6 font-semibold">Name</th>
              <th className="py-4 px-6 font-semibold">Email</th>
              <th className="py-4 px-6 font-semibold">Phone</th>
              <th className="py-4 px-6 font-semibold">Source</th>
              <th className="py-4 px-6 font-semibold">Course</th> {/* New column for Course */}
              <th className="py-4 px-6 font-semibold">Interest</th>
              <th className="py-4 px-6 font-semibold">Reply</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-t hover:bg-gray-50 transition duration-300 ease-in-out">
                <td className="py-4 px-6 text-gray-800">{lead.name}</td>
                <td className="py-4 px-6 text-gray-600 truncate max-w-xs">{lead.email}</td>
                <td className="py-4 px-6 text-gray-600">{lead.phone}</td>
                <td className="py-4 px-6 text-gray-600">{lead.source}</td>
                <td className="py-4 px-6 text-gray-600">{lead.course || "Not specified"}</td> {/* Display course or fallback */}
                <td className="py-4 px-6">
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${getInterestBarWidth(lead.interestLevel)}%` }}
                      title={`${lead.interestLevel || 0}/10`}
                    >
                      <span className="text-xs text-white font-bold px-2">{lead.interestLevel || 0}/10</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 flex gap-4 items-center">
                  <button
                    onClick={() => handleEmailReply(lead)}
                    className="text-blue-500 hover:text-blue-700 focus:outline-none transform hover:scale-110 transition duration-200"
                    aria-label="Reply via Email"
                  >
                    <FaEnvelope size={24} />
                  </button>
                  <button
                    onClick={() => handleWhatsAppReply(lead)}
                    className="text-green-500 hover:text-green-700 focus:outline-none transform hover:scale-110 transition duration-200"
                    aria-label="Reply via WhatsApp"
                  >
                    <FaWhatsapp size={24} />
                  </button>
                  <button
                    onClick={() => handleSMSReply(lead)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none transform hover:scale-110 transition duration-200"
                    aria-label="Reply via SMS"
                  >
                    <FaSms size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add simple CSS animation for fade-in effect
// const styles = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(-20px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   .animate-fadeIn {
//     animation: fadeIn 0.6s ease-out;
//   }
// `;

export default Enquiries;