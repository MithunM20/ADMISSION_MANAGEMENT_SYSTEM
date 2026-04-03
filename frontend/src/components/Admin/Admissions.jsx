import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, X, Mail, CheckCircle, Download, FileText } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:5000";

function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmissions(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch admissions");
      toast.error("Error fetching admissions");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (admissionId) => {
    try {
      const studentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
      await axios.put(
        `${API_BASE_URL}/api/admissions/${admissionId}`,
        { status: "verified", studentId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Admission verified! Student ID: " + studentId);
      setAdmissions((prev) =>
        prev.map((admission) =>
          admission._id === admissionId ? { ...admission, status: "verified", studentId } : admission
        )
      );
    } catch (err) {
      toast.error("Error verifying admission");
    }
  };

  const handleSendEmail = (admission) => {
    const subject = "Your Admission Details";
    const body = `Dear ${admission.studentName},\n\nYour admission is confirmed. ID: ${admission.studentId}.`;
    window.location.href = `mailto:${admission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.info("Email client opened.");
  };

  const openPreview = (filePath, fileType) => {
    setPreviewFile({ url: `${API_BASE_URL}/${filePath}`, type: fileType });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading admissions...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {admissions.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-gray-100">
          No admissions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {admissions.map((admission) => (
            <div key={admission._id} className="glass-card p-8 rounded-[2rem] animate-fade-in-up group relative overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-bl-[4rem] pointer-events-none transition-all duration-500 group-hover:scale-125 opacity-50 group-hover:opacity-100 mix-blend-multiply"></div>
              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-10 relative z-10">

                {/* Student Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 flex items-center justify-center font-heading font-bold text-xl shadow-sm border border-primary-200/50">
                        {admission.studentName?.charAt(0) || "S"}
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold text-gray-900 leading-tight">{admission.studentName}</h3>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} className="text-gray-400"/> {admission.email}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border
                      ${admission.status === 'verified' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      {admission.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100/50">
                    <div>
                      <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Course</span>
                      <span className="font-semibold text-gray-800">{admission.course}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Phone</span>
                      <span className="font-semibold text-gray-800">{admission.phone}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Student ID</span>
                      <span className="font-mono font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md inline-block">{admission.studentId || "Pending"}</span>
                    </div>
                  </div>
                </div>

                {/* Documents & Actions */}
                <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-6 md:pt-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <FileText size={14} className="text-gray-400"/> Documents
                    </h4>
                    <div className="space-y-2">
                      {admission.documents && admission.documents.length > 0 ? (
                        admission.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600 truncate">{doc.name}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openPreview(doc.filePath, doc.type)} className="p-1.5 hover:bg-white rounded text-gray-500 hover:text-primary-600">
                                <Eye size={14} />
                              </button>
                              <button onClick={() => window.open(`${API_BASE_URL}/${doc.filePath}`, "_blank")} className="p-1.5 hover:bg-white rounded text-gray-500 hover:text-primary-600">
                                <Download size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">No documents uploaded</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                    {admission.status !== "verified" && (
                      <button
                        onClick={() => handleVerify(admission._id)}
                        className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        <CheckCircle size={16} /> Verify Admission
                      </button>
                    )}
                    <button
                      onClick={() => handleSendEmail(admission)}
                      className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow flex items-center gap-2 transition-all"
                    >
                      <Mail size={16} className="text-primary-500" /> Send Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] relative shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-4 z-10">
              <button onClick={() => setPreviewFile(null)} className="p-2 bg-white/90 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                <X size={20} />
              </button>
            </div>
            <div className="h-[80vh] bg-gray-100 flex items-center justify-center p-4">
              {previewFile.url.match(/\.(jpeg|jpg|png|gif)$/i) || previewFile.type?.startsWith('image') ? (
                <img src={previewFile.url} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg rounded-lg" />
              ) : (
                <iframe src={previewFile.url} className="w-full h-full rounded-lg shadow-inner bg-white" title="Document Preview" />
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-mono text-gray-500 truncate max-w-md">{previewFile.url.split('/').pop()}</span>
              <a
                href={previewFile.url}
                download
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Download Original
              </a>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Admissions;