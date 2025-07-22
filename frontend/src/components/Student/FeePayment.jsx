import React, { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";

const FeePayment = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [fee, setFee] = useState(0);
  const [courses, setCourses] = useState([]);
  const [admissionId, setAdmissionId] = useState(""); // Changed to dynamic input
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sampleCourses = [
          { id: 1, name: "MERN stack", fee: 39999 },
          { id: 2, name: "Python Django", fee: 34999 },
          { id: 3, name: "Digital Marketing", fee: 31999 },
        ];
        setCourses(sampleCourses);

        if (sampleCourses.length > 0) {
          setSelectedCourse(sampleCourses[0].name);
          setFee(sampleCourses[0].fee);
        }

        const response = await fetch("http://localhost:5000/api/payments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data.filter(tx => tx.status === "completed"));
      } catch (error) {
        setPaymentStatus("Error loading data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    setSelectedCourse(courseName);
    const course = courses.find((c) => c.name === courseName);
    setFee(course ? course.fee : 0);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleAdmissionIdChange = (e) => {
    setAdmissionId(e.target.value); // Update admissionId dynamically
  };

  const handlePayment = useCallback(async () => {
    if (!selectedCourse) {
      setPaymentStatus("Please select a course");
      return;
    }
    if (!admissionId) {
      setPaymentStatus("Please enter an Admission ID");
      return;
    }

    setIsLoading(true);
    setPaymentStatus("Initiating payment...");

    try {
      const orderResponse = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admissionId, // Use dynamic value
          amount: fee,
          currency: "INR",
          courseName: selectedCourse,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      const options = {
        key: "rzp_test_fV9dM9URYbqjm7",
        amount: orderData.amount,
        currency: "INR",
        name: "EduBro",
        description: `Fee Payment for ${selectedCourse}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          const verifyResponse = await fetch("http://localhost:5000/api/payments/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json();
            throw new Error(errorData.message || "Payment verification failed");
          }

          const verifyData = await verifyResponse.json();
          setPaymentStatus(`Payment successful for ${selectedCourse}! Payment ID: ${response.razorpay_payment_id}`);
          const updatedTransactions = await fetch("http://localhost:5000/api/payments").then(res => res.json());
          setTransactions(updatedTransactions.filter(tx => tx.status === "completed"));
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
          contact: "9876543210",
        },
        theme: { color: "#002147" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setPaymentStatus(`Payment failed: ${response.error.description || "Unknown error"} (Code: ${response.error.code})`);
      });
      razorpay.open();
    } catch (error) {
      setPaymentStatus("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse, selectedPaymentMethod, fee, admissionId]);

  const downloadInvoice = (transaction) => {
    const doc = new jsPDF();
    doc.text("EduBro Fee Payment Invoice", 20, 20);
    doc.text(`Transaction ID: ${transaction.transactionId}`, 20, 30);
    doc.text(`Admission ID: ${transaction.admissionId}`, 20, 40); // Include admissionId
    doc.text(`Course: ${transaction.courseName}`, 20, 50);
    doc.text(`Amount: ₹${transaction.amount}`, 20, 60);
    doc.text(`Payment Method: ${transaction.paymentMethod}`, 20, 70);
    doc.text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, 20, 80);
    doc.text(`Status: ${transaction.status}`, 20, 90);
    doc.save(`invoice_${transaction.transactionId}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto font-sans transition-all duration-300">
      <h2 className="text-[#002147] font-bold text-2xl mb-6">Fee Payment</h2>
      <p className="text-gray-600 text-base mb-6 leading-relaxed">
        Select a course and manage your payments.
      </p>

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-lg">
          <span className="text-[#002147] font-medium">Processing...</span>
        </div>
      )}

      <div className="space-y-6 relative">
        {/* Admission ID Input */}
        <div className="relative">
          <label htmlFor="admissionId" className="block text-sm font-medium text-gray-700 mb-2">
            Admission ID
          </label>
          <input
            id="admissionId"
            type="text"
            value={admissionId}
            onChange={handleAdmissionIdChange}
            placeholder="Enter your Admission ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-transparent transition-colors disabled:bg-gray-200"
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={handleCourseChange}
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-transparent transition-colors disabled:bg-gray-200"
          >
            <option value="">Choose a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name} - ₹{course.fee}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <select
            id="paymentMethod"
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodChange}
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-transparent transition-colors disabled:bg-gray-200"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="net banking">Net Banking</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>

        {selectedCourse && (
          <p className="text-gray-600 text-base animate-fade-in">
            Course Fee: ₹{fee}
          </p>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-pulse">
          <p className="text-yellow-800 text-sm font-medium">
            Reminder: Payment confirmation will be processed after verification.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handlePayment}
            disabled={!selectedCourse || !admissionId || isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-[#002147] text-white rounded-lg hover:bg-[#4A90E2] transition-colors font-medium text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#002147] border border-[#002147] rounded-lg hover:bg-[#4A90E2] hover:text-white transition-colors font-medium text-base"
          >
            {showHistory ? "Hide History" : "View Transaction History"}
          </button>
        </div>

        {paymentStatus && (
          <p className={`text-base mt-4 ${paymentStatus.includes("successful") ? "text-green-600" : "text-red-600"} animate-bounce`}>
            {paymentStatus}
          </p>
        )}

        {showHistory && (
          <div className="mt-6">
            <h3 className="text-[#002147] font-bold text-xl mb-4">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-600">No completed transactions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-sm font-medium text-gray-700">Transaction ID</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Admission ID</th> {/* Added */}
                      <th className="p-3 text-sm font-medium text-gray-700">Course</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Amount</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Date</th>
                      <th className="p-3 text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.transactionId} className="border-b">
                        <td className="p-3 text-sm text-gray-600">{tx.transactionId}</td>
                        <td className="p-3 text-sm text-gray-600">{tx.admissionId}</td> {/* Added */}
                        <td className="p-3 text-sm text-gray-600">{tx.courseName}</td>
                        <td className="p-3 text-sm text-gray-600">₹{tx.amount}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => downloadInvoice(tx)}
                            className="text-[#002147] underline hover:text-[#4A90E2]"
                          >
                            Download Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeePayment;