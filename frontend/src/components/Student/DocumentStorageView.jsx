import { useState } from "react";
import { FiEye, FiX } from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "../../config";

function DocumentStorageView({ documents = [] }) {
  const [previewFile, setPreviewFile] = useState(null);

  const handlePreview = async (filePath, fileType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${filePath}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const mimeType = getMimeType(fileType);
      setPreviewFile({ url, mimeType, type: fileType });
    } catch (err) {
      console.error("Error previewing document:", err);
    }
  };

  const closePreview = () => setPreviewFile(null);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) closePreview();
  };

  const getMimeType = (fileType) => {
    const mimeTypes = {
      photoId: "image/jpeg",
      proofDocument: "application/pdf",
      certificate: "application/pdf",
      resume: "application/pdf",
    };
    return mimeTypes[fileType] || "application/pdf";
  };

  return (
    <section className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-[#4A90E2]">
      <h3 className="text-lg font-bold text-[#002147] mb-4">Uploaded Documents</h3>

      {/* Document List */}
      <div className="overflow-x-auto">
        <ul className="list-disc pl-4 text-[#333333] text-base leading-6">
          {Array.isArray(documents) && documents.length > 0 ? (
            documents.map((doc, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <span>{doc.name} ({doc.type})</span>
                <button
                  onClick={() => handlePreview(doc.filePath, doc.type)}
                  className="text-[#4A90E2] hover:text-[#002147] focus:outline-none"
                  title="Preview"
                >
                  <FiEye />
                </button>
              </li>
            ))
          ) : (
            <p className="text-[#333333] text-base">No documents uploaded yet.</p>
          )}
        </ul>
      </div>

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
    </section>
  );
}

export default DocumentStorageView;
