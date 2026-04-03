import { useState, useEffect } from "react";
import { FiUpload, FiEye, FiX } from "react-icons/fi";
import DocumentStorageView from "./DocumentStorageView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const ALLOWED_FORMATS = {
  photoId: ["image/jpeg", "image/jpg", "image/png"],
  proofDocument: ["application/pdf"],
  certificate: ["application/pdf"],
  resume: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const INITIAL_STUDENT_DETAILS = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  course: "",
  referralCode: "",
};

const INITIAL_FILES = {
  photoId: null,
  proofDocument: null,
  certificate: null,
  resume: null,
};

function Admission() {
  const [studentDetails, setStudentDetails] = useState(() => {
    const savedDetails = localStorage.getItem("studentDetails");
    return savedDetails ? JSON.parse(savedDetails) : INITIAL_STUDENT_DETAILS;
  });
  const [files, setFiles] = useState(INITIAL_FILES);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [studentId, setStudentId] = useState(null); // Don’t initialize from localStorage here
  const [errors, setErrors] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Save student details to localStorage whenever they change
    localStorage.setItem("studentDetails", JSON.stringify(studentDetails));

    // Fetch admission details when email changes or on mount
    if (studentDetails.email) {
      fetchStudentAdmission();
    }
  }, [studentDetails.email]);

  const fetchStudentAdmission = async () => {
    try {
      const email = studentDetails.email;
      if (!email) {
        toast.error("Please enter your email to load admission details.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/admissions/me?email=${encodeURIComponent(email)}`);
      const admission = response.data;

      setUploadedDocs(admission.documents || []);
      setStudentId(admission.studentId || null);
      setStudentDetails((prev) => ({
        ...prev,
        firstName: admission.studentName.split(" ")[0] || "",
        lastName: admission.studentName.split(" ").slice(-1)[0] || "",
        email: admission.email,
        phone: admission.phone,
        course: admission.course,
        referralCode: admission.referralCode || "",
      }));

      if (admission.studentId) {
        localStorage.setItem("studentId", admission.studentId);
      } else {
        localStorage.removeItem("studentId"); // Clear if no studentId from backend
      }
    } catch (err) {
      console.error("Error fetching admission:", err.response ? err.response.data : err.message);
      if (err.response?.status === 404) {
        // No admission found, clear studentId and uploadedDocs
        setStudentId(null);
        setUploadedDocs([]);
        localStorage.removeItem("studentId");
        toast.error("No admission found for this email.");
      } else {
        toast.error("Failed to load admission details: " + err.message);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!ALLOWED_FORMATS[fileType].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fileType]: `Invalid format. Allowed: ${ALLOWED_FORMATS[fileType].join(", ")}`,
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, [fileType]: "File size exceeds 5MB limit." }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFiles((prev) => ({ ...prev, [fileType]: { file, previewUrl } }));
    setErrors((prev) => ({ ...prev, [fileType]: "" }));
  };

  const handlePreview = (fileType) => {
    if (files[fileType]?.previewUrl) {
      setPreviewFile({
        type: fileType,
        url: files[fileType].previewUrl,
        mimeType: files[fileType].file.type,
      });
    }
  };

  const closePreview = () => setPreviewFile(null);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) closePreview();
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["firstName", "lastName", "email", "phone", "course"];

    requiredFields.forEach((key) => {
      if (!studentDetails[key]) newErrors[key] = "This field is required";
    });

    const requiredFiles = ["photoId", "proofDocument", "certificate", "resume"];
    requiredFiles.forEach((key) => {
      if (!files[key]?.file && !uploadedDocs.some((doc) => doc.type === key)) {
        newErrors[key] = "This document is required";
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please complete all required fields and upload all documents.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("studentName", `${studentDetails.firstName} ${studentDetails.lastName}`.trim());
    formData.append("email", studentDetails.email);
    formData.append("phone", studentDetails.phone);
    formData.append("course", studentDetails.course);
    formData.append("referralCode", studentDetails.referralCode || "");

    const requiredFileTypes = ["photoId", "proofDocument", "certificate", "resume"];
    requiredFileTypes.forEach((type) => {
      if (files[type]?.file) {
        formData.append(type, files[type].file);
      }
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admissions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { message, admission } = response.data;
      setUploadedDocs(admission.documents);
      setStudentId(admission.studentId);
      localStorage.setItem("studentId", admission.studentId);
      toast.success(message);
      setFiles(INITIAL_FILES);
      setPreviewFile(null);
    } catch (error) {
      toast.error("Error submitting admission: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional: Add a reset function to clear all local data
  const handleReset = () => {
    setStudentDetails(INITIAL_STUDENT_DETAILS);
    setFiles(INITIAL_FILES);
    setUploadedDocs([]);
    setStudentId(null);
    localStorage.removeItem("studentDetails");
    localStorage.removeItem("studentId");
    toast.info("All local data cleared.");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-[Roboto, 'Open Sans'] max-w-5xl mx-auto p-6">
      <main className="flex justify-center">
        <section className="w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-[#002147] mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["firstName", "middleName", "lastName"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label htmlFor={field} className="block text-base font-semibold text-[#333333]">
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      {["firstName", "lastName"].includes(field) && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      id={field}
                      type="text"
                      name={field}
                      value={studentDetails[field]}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                      aria-required={["firstName", "lastName"].includes(field)}
                      aria-invalid={!!errors[field]}
                    />
                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-[#002147] mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["email", "phone"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label htmlFor={field} className="block text-base font-semibold text-[#333333]">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id={field}
                      type={field === "email" ? "email" : "tel"}
                      name={field}
                      value={studentDetails[field]}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors[field]}
                    />
                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-[#002147] mb-6">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["course"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label htmlFor={field} className="block text-base font-semibold text-[#333333]">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id={field}
                      type="text"
                      name={field}
                      value={studentDetails[field]}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors[field]}
                    />
                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Code */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-[#002147] mb-6">Referral Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="referralCode" className="block text-base font-semibold text-[#333333]">
                    Referral Code (Optional)
                  </label>
                  <input
                    id="referralCode"
                    type="text"
                    name="referralCode"
                    value={studentDetails.referralCode}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] ${
                      errors.referralCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter referral code if you have one"
                  />
                  {errors.referralCode && <p className="text-red-500 text-sm mt-1">{errors.referralCode}</p>}
                </div>
              </div>
            </div>

            {/* Document Uploads (only if no documents are uploaded yet) */}
            {!uploadedDocs.length && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-[#002147] mb-6">Document Uploads</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {["photoId", "proofDocument", "certificate", "resume"].map((fileType) => (
                    <div key={fileType} className="space-y-4">
                      <label
                        htmlFor={fileType}
                        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-40 cursor-pointer hover:bg-gray-100 transition-colors ${
                          errors[fileType] ? "border-red-500" : "border-[#4A90E2]"
                        }`}
                      >
                        <input
                          id={fileType}
                          type="file"
                          onChange={(e) => handleFileChange(e, fileType)}
                          className="sr-only"
                          accept={ALLOWED_FORMATS[fileType].join(",")}
                          aria-required="true"
                          aria-invalid={!!errors[fileType]}
                        />
                        <FiUpload className="text-3xl text-[#4A90E2] mb-2" />
                        <span className="text-base text-[#4A90E2] text-center">
                          {fileType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          <span className="text-red-500 ml-1">*</span>
                        </span>
                      </label>
                      {files[fileType] && (
                        <div className="flex items-center justify-between text-base">
                          <span className="truncate text-[#333333]" title={files[fileType].file.name}>
                            {files[fileType].file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePreview(fileType)}
                            className="text-[#4A90E2] hover:text-[#002147]"
                            aria-label={`Preview ${files[fileType].file.name}`}
                          >
                            <FiEye />
                          </button>
                        </div>
                      )}
                      {errors[fileType] && <p className="text-red-500 text-sm">{errors[fileType]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              {!uploadedDocs.length && (
                <button
                  type="submit"
                  className={`px-6 py-3 flex items-center gap-2 rounded-lg font-semibold text-white bg-[#002147] hover:bg-[#4A90E2] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>

            {/* Display Student ID and Uploaded Documents */}
            {(studentId || uploadedDocs.length > 0) && (
              <div className="mt-4">
                {studentId && (
                  <div className="p-4 bg-white rounded-lg shadow-md text-center">
                    <p className="text-[#333333] text-lg font-semibold">
                      Your Student ID: <span className="text-[#002147]">{studentId}</span>
                    </p>
                    <p className="text-[#333333] text-base">Please note this ID for future reference.</p>
                  </div>
                )}
                {uploadedDocs.length > 0 && (
                  <div className="mt-8">
                    <DocumentStorageView documents={uploadedDocs} />
                  </div>
                )}
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
          </form>
        </section>
      </main>
      <ToastContainer />
    </div>
  );
}

export default Admission;
