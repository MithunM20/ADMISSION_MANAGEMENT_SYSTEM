const Admission = require("../models/Admission");

exports.createAdmission = async (req, res) => {
  try {
    const { studentName, email, phone, course, referralCode } = req.body;
    const files = req.files;

    console.log("Received body:", req.body);
    console.log("Received files:", files);

    if (!studentName || !email || !phone || !course) {
      return res.status(400).json({ message: "Missing required fields: studentName, email, phone, or course" });
    }

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const requiredFileTypes = ["photoId", "proofDocument", "certificate", "resume"];
    const missingFiles = requiredFileTypes.filter(type => !files[type] || files[type].length === 0);
    if (missingFiles.length > 0) {
      return res.status(400).json({ 
        message: "Missing required files", 
        missing: missingFiles 
      });
    }

    const documents = requiredFileTypes.map((type) => {
      const file = files[type][0]; // Access the first (and only) file in the array
      if (!file.originalname || !file.path) {
        throw new Error(`Invalid file data for ${type}: missing originalname or path`);
      }
      return {
        name: file.originalname,
        type: type,
        filePath: file.path,
        uploadDate: new Date(),
        encrypted: false,
        version: 1,
      };
    });

    const admission = new Admission({
      studentName,
      email,
      phone,
      course,
      status: "pending",
      documents,
      admissionDate: new Date(),
      referralCode: referralCode || null,
    });

    await admission.save();

    res.status(201).json({
      message: "Admission submitted successfully",
      admission: {
        id: admission._id,
        studentName: admission.studentName,
        email: admission.email,
        phone: admission.phone,
        course: admission.course,
        referralCode: admission.referralCode,
        documents: admission.documents,
        status: admission.status,
        studentId: admission.studentId,
      },
    });
  } catch (error) {
    console.error("Error creating admission:", error);
    res.status(500).json({ message: "Error submitting admission", error: error.message });
  }
};

// Other functions remain unchanged
exports.updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, studentId } = req.body;

    const admission = await Admission.findById(id);
    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    if (status) admission.status = status;
    if (studentId) admission.studentId = studentId;

    await admission.save();

    res.status(200).json({
      message: "Admission updated successfully",
      admission: {
        id: admission._id,
        studentName: admission.studentName,
        email: admission.email,
        phone: admission.phone,
        course: admission.course,
        referralCode: admission.referralCode,
        documents: admission.documents,
        status: admission.status,
        studentId: admission.studentId,
      },
    });
  } catch (error) {
    console.error("Error updating admission:", error);
    res.status(500).json({ message: "Error updating admission", error: error.message });
  }
};

exports.getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find();
    res.status(200).json(admissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admissions", error: error.message });
  }
};

exports.uploadDocuments = async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};

exports.deleteAdmission = async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};

exports.getMyAdmission = async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameter

    if (!email) {
      return res.status(400).json({ message: "Email is required to fetch admission details" });
    }

    // Find admission by email
    const admission = await Admission.findOne({ email: email });

    if (!admission) {
      return res.status(404).json({ message: "No admission found for this email" });
    }

    // Return only necessary fields for the student
    const response = {
      studentName: admission.studentName,
      email: admission.email,
      phone: admission.phone,
      course: admission.course,
      studentId: admission.studentId || null, // Include student ID if assigned
      documents: admission.documents,
      status: admission.status,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching admission:", error);
    res.status(500).json({ message: "Error fetching admission", error: error.message });
  }
};