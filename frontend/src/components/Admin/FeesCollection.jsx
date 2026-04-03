import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

const FeesCollection = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch all transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/payments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setMessage("Error loading transactions: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to verify (update status) a transaction
  const verifyTransaction = async (transactionId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          status: "completed",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const updatedData = await response.json();
      setMessage("Transaction verified successfully!");

      // Refresh transactions
      const updatedTransactions = await fetch(`${API_BASE_URL}/api/payments`).then(res => res.json());
      setTransactions(updatedTransactions);
    } catch (error) {
      setMessage("Error verifying transaction: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6 font-roboto">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl">
        <h2 className="text-[#002147] font-bold text-2xl mb-6">Fees Collection</h2>
        <p className="text-gray-800 text-base mb-6 leading-relaxed">
          View and verify all payment transactions.
        </p>

        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-lg">
            <span className="text-[#002147] font-medium text-base">Processing...</span>
          </div>
        )}

        {message && (
          <p className={`text-base mb-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-sm font-medium text-gray-800">Transaction ID</th>
                <th className="p-3 text-sm font-medium text-gray-800">Admission ID</th>
                <th className="p-3 text-sm font-medium text-gray-800">Course</th>
                <th className="p-3 text-sm font-medium text-gray-800">Amount</th>
                <th className="p-3 text-sm font-medium text-gray-800">Method</th>
                <th className="p-3 text-sm font-medium text-gray-800">Date</th>
                <th className="p-3 text-sm font-medium text-gray-800">Status</th>
                <th className="p-3 text-sm font-medium text-gray-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-3 text-center text-gray-800 text-base">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.transactionId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-800">{tx.transactionId}</td>
                    <td className="p-3 text-sm text-gray-800">{tx.admissionId}</td>
                    <td className="p-3 text-sm text-gray-800">{tx.courseName}</td>
                    <td className="p-3 text-sm text-gray-800">₹{tx.amount}</td>
                    <td className="p-3 text-sm text-gray-800">{tx.paymentMethod}</td>
                    <td className="p-3 text-sm text-gray-800">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">{tx.status}</td>
                    <td className="p-3">
                      {tx.status === "pending" ? (
                        <button
                          onClick={() => verifyTransaction(tx.transactionId)}
                          className="bg-[#002147] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#4A90E2] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={isLoading}
                        >
                          Verify
                        </button>
                      ) : (
                        <span className="text-green-600 text-sm">Verified</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeesCollection;
