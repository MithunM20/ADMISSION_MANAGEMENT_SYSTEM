import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, MessageCircle, MessageSquare } from "lucide-react";
import { API_BASE_URL } from "../../config";

const Enquiries = () => {
  const [leads, setLeads] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/leads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(res.data);
      } catch (error) {
        console.error("Failed to fetch leads", error);
      }
    };
    fetchLeads();
  }, [token]);

  const handleEmailReply = (lead) => {
    const subject = encodeURIComponent(`Re: Enquiry from ${lead.name} for ${lead.course || 'a course'}`);
    const body = encodeURIComponent(`Dear ${lead.name},\n\nThank you for your enquiry about ${lead.course}.`);
    window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppReply = (lead) => {
    const message = encodeURIComponent(`Hello ${lead.name}, thank you for your enquiry about ${lead.course}.`);
    window.open(`https://wa.me/${lead.phone}?text=${message}`, '_blank');
  };

  const handleSMSReply = (lead) => {
    alert(`SMS to ${lead.phone}: Integration required.`);
  };

  const getInterestColor = (level) => {
    if (level >= 8) return "bg-green-500";
    if (level >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="glass-card border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden animate-fade-in p-2">
      <div className="glass-panel m-2 rounded-[2rem] p-8 border border-white/60 flex justify-between items-center bg-white/40 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-primary-200/40 to-transparent rounded-full blur-[40px] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">Recent Enquiries</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage and respond to prospective student leads.</p>
        </div>
        <div className="px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white text-sm font-bold text-primary-600 flex items-center gap-2 relative z-10 hover:shadow-md hover:scale-105 transition-all cursor-default">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Total Leads: {leads.length}
        </div>
      </div>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200/50">
              <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
              <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</th>
              <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Source</th>
              <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Course</th>
              <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Interest</th>
              <th className="py-5 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-white/60 transition-all duration-300 group">
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-primary-700 font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="font-semibold text-gray-900">{lead.name}</div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="text-sm font-medium text-gray-700">{lead.email}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{lead.phone}</div>
                </td>
                <td className="py-5 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary-50 text-secondary-700 border border-secondary-100 capitalize shadow-sm">
                    {lead.source}
                  </span>
                </td>
                <td className="py-5 px-6 text-sm font-medium text-gray-600">
                  {lead.course || "—"}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${getInterestColor(lead.interestLevel)}`}
                        style={{ width: `${(lead.interestLevel / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8">{lead.interestLevel}/10</span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEmailReply(lead)} className="p-2.5 text-gray-400 hover:text-white hover:bg-blue-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Email">
                      <Mail size={16} />
                    </button>
                    <button onClick={() => handleWhatsAppReply(lead)} className="p-2.5 text-gray-400 hover:text-white hover:bg-green-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="WhatsApp">
                      <MessageCircle size={16} />
                    </button>
                    <button onClick={() => handleSMSReply(lead)} className="p-2.5 text-gray-400 hover:text-white hover:bg-purple-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="SMS">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leads.length === 0 && (
        <div className="p-8 text-center text-gray-500">No enquiries found.</div>
      )}
    </div>
  );
};

export default Enquiries;
