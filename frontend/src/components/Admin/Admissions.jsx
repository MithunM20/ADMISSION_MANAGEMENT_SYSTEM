import { useState, useEffect } from "react";
import axios from "axios";
import { FiEye, FiX, FiMail } from "react-icons/fi"; // Added FiMail
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:5000";

function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null); // State for preview modal

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    console.log("Fetching admissions from:", `${API_BASE_URL}/api/admissions`);
    console.log("Token:", localStorage.getItem("token"));
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Admissions Response:", response.data);
      setAdmissions(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch admissions";
      console.error("Error Status:", err.response?.status);
      console.error("Error Data:", err.response?.data);
      console.error("Error Message:", errorMessage);
      setError(errorMessage);
      toast.error("Error fetching admissions: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (admissionId) => {
    try {
      const studentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
      const response = await axios.put(
        `${API_BASE_URL}/api/admissions/${admissionId}`,
        { status: "verified", studentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Verify Response:", response.data);
      toast.success("Admission verified successfully! Student ID: " + studentId);
      setAdmissions((prev) =>
        prev.map((admission) =>
          admission._id === admissionId
            ? { ...admission, status: "verified", studentId }
            : admission
        )
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to verify admission";
      console.error("Verify Error:", errorMessage);
      toast.error("Error verifying admission: " + errorMessage);
    }
  };

  const handleDownload = (filePath) => {
    window.open(`${API_BASE_URL}/${filePath}`, "_blank");
  };

  const handlePreview = (filePath, fileType) => {
    const mimeType = ALLOWED_FORMATS[fileType]?.[0] || "application/pdf"; // Default to PDF if unknown
    setPreviewFile({
      url: `${API_BASE_URL}/${filePath}`,
      mimeType,
      type: fileType,
    });
  };

  const closePreview = () => setPreviewFile(null);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) closePreview();
  };

  const handleSendEmail = (admission) => {
    const subject = "Your Admission Details and Payment Instructions";
    const body = `
      Dear ${admission.studentName},

      Your admission has been processed successfully. Your admission number is: ${admission.studentId}. 

      You can now pay your fees conveniently through your student login. Please log in to your student portal at our website, navigate to the payment section, and follow the instructions to complete your fee payment. This ensures a secure and hassle-free transaction.

      If you encounter any issues or have questions, feel free to contact our support team.

      Best regards,
      Edubro
      www.edubro.com
    `;

    const mailtoLink = `mailto:${admission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    toast.info("Email link opened. Please ensure your email client is configured.");
  };

  const ALLOWED_FORMATS = {
    photoId: ["image/jpeg", "image/jpg", "image/png"],
    proofDocument: ["application/pdf"],
    certificate: ["application/pdf"],
    resume: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-[Roboto, 'Open Sans'] p-6">
      <h1 className="text-2xl font-bold text-[#002147] mb-6">Admissions</h1>

      {loading && (
        <div className="text-center text-[#4A90E2] text-lg">Loading admissions...</div>
      )}

      {error && (
        <div className="text-center text-red-500 text-lg mb-4">{error}</div>
      )}

      {!loading && !error && admissions.length === 0 && (
        <div className="text-center text-[#333333] text-lg">No admissions found.</div>
      )}

      {!loading && !error && admissions.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {admissions.map((admission) => (
            <div key={admission._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#002147] mb-2">Student Details</h2>
                  <p className="text-[#333333] text-base leading-6"><strong>Name:</strong> {admission.studentName}</p>
                  <p className="text-[#333333] text-base leading-6"><strong>Email:</strong> {admission.email}</p>
                  <p className="text-[#333333] text-base leading-6"><strong>Phone:</strong> {admission.phone}</p>
                  <p className="text-[#333333] text-base leading-6"><strong>Course:</strong> {admission.course}</p>
                  <p className="text-[#333333] text-base leading-6"><strong>Referral Code:</strong> {admission.referralCode || "N/A"}</p>
                  <p className="text-[#333333] text-base leading-6"><strong>Student ID:</strong> {admission.studentId || "Not assigned"}</p>
                  <p className="text-[#333333] text-base leading-6"><strong>Status:</strong> {admission.status}</p>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#002147] mb-2">Documents</h2>
                  {admission.documents.length > 0 ? (
                    <ul className="list-disc pl-4 text-[#333333] text-base leading-6">
                      {admission.documents.map((doc, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{doc.name} ({doc.type})</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePreview(doc.filePath, doc.type)}
                              className="text-[#4A90E2] hover:text-[#002147] focus:outline-none"
                              title="Preview"
                            >
                              <FiEye />
                            </button>
                            <button
                              onClick={() => handleDownload(doc.filePath)}
                              className="text-[#4A90E2] hover:text-[#002147] underline focus:outline-none"
                            >
                              Download
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#333333] text-base leading-6">No documents</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-4">
                {admission.status !== "verified" && (
                  <button
                    onClick={() => handleVerify(admission._id)}
                    className="px-4 py-2 bg-[#002147] text-white rounded hover:bg-[#4A90E2] transition-colors font-semibold"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => handleSendEmail(admission)}
                  className="px-4 py-2 bg-[#002147] text-white rounded hover:bg-[#4A90E2] transition-colors font-semibold flex items-center gap-2"
                >
                  <FiMail /> Send Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto shadow-xl relative">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 text-[#333333] hover:text-[#002147]"
              aria-label="Close preview"
            >
              <FiX className="text-2xl" />
            </button>
            <h3 className="text-xl font-bold text-[#002147] mb-4">
              Preview: {previewFile.type.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </h3>
            {previewFile.mimeType.startsWith("image/") ? (
              <img src={previewFile.url} alt="Document preview" className="max-w-full h-auto rounded-lg" />
            ) : previewFile.mimeType === "application/pdf" ? (
              <iframe src={previewFile.url} title="PDF Preview" className="w-full h-[60vh] border-none" />
            ) : (
              <p className="text-[#333333] text-base text-center">Preview not available for this file type.</p>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Admissions;