import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminExamsList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingExam, setDeletingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("https://api-backend-institute.onrender.com/batch/get-batches", {
          withCredentials: true,
        });
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching exams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const exportToExcel = () => {
    const allExams = batches.flatMap((batch) =>
      batch.exams.map((exam) => ({
        Batch: batch.batchName,
        Code: exam.examCode,
        Name: exam.examName,
        Category: exam.category,
        Duration: exam.duration,
      }))
    );

    const ws = XLSX.utils.json_to_sheet(allExams);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Exams");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ExamsList.xlsx");
  };

  const handleDelete = async (examCode) => {
    const confirm = window.confirm("Are you sure you want to delete this exam?");
    if (!confirm) return;

    try {
      setDeletingExam(examCode);
      await axios.delete(
       
         ` https://api-backend-institute.onrender.com/Question/exams/delete/${examCode}`,
        // `https://backend-institute-production.up.railway.app/Question/exams/delete/${examCode}`,
        { withCredentials: true }
      );
      setBatches((prev) =>
        prev.map((batch) => ({
          ...batch,
          exams: batch.exams.filter((exam) => exam.examCode !== examCode),
        }))
      );
    } catch (error) {
      console.error("Error deleting exam", error);
    } finally {
      setDeletingExam(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        📝 Admin - Exams by Batch
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={exportToExcel}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
        >
          📥 Export to Excel
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 text-lg">Loading exams...</div>
      ) : (
        batches.map((batch) => (
          <div key={batch._id} className="mb-10">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              📚 {batch.batchName}
            </h2>

            {/* Desktop View */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Duration (mins)</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.exams.map((exam) => (
                    <tr key={exam._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{exam.category}</td>
                      <td className="px-6 py-4">{exam.examCode}</td>
                      <td className="px-6 py-4">{exam.examName}</td>
                      <td className="px-6 py-4">{exam.duration}</td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <Link
                          to={`/admin/exams/edit/${exam.examCode}`}
                          className="inline-block text-blue-600 hover:text-blue-800"
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(exam.examCode)}
                          disabled={deletingExam === exam.examCode}
                          className={`inline-block text-red-600 hover:text-red-800 ${
                            deletingExam === exam.examCode ? "opacity-50 cursor-wait" : ""
                          }`}
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => setSelectedExam(exam)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          👁 View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-6">
              {batch.exams.map((exam) => (
                <div
                  key={exam._id}
                  className="bg-white border border-gray-200 rounded-lg shadow p-4"
                >
                  <p className="mb-2 text-sm font-semibold text-gray-600">
                    <span className="font-bold text-gray-800">Code:</span> {exam.examCode}
                  </p>
                  <p className="mb-2 text-sm font-semibold text-gray-600">
                    <span className="font-bold text-gray-800">Name:</span> {exam.examName}
                  </p>
                  <p className="mb-2 text-sm font-semibold text-gray-600">
                    <span className="font-bold text-gray-800">Category:</span> {exam.category}
                  </p>
                  <p className="mb-4 text-sm font-semibold text-gray-600">
                    <span className="font-bold text-gray-800">Duration:</span> {exam.duration} mins
                  </p>
                  <div className="flex justify-end space-x-4">
                    <Link
                      to={`/admin/exams/edit/${exam.examCode}`}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(exam.examCode)}
                      disabled={deletingExam === exam.examCode}
                      className={`text-red-600 hover:text-red-800 text-lg ${
                        deletingExam === exam.examCode ? "opacity-50 cursor-wait" : ""
                      }`}
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => setSelectedExam(exam)}
                      className="text-indigo-600 hover:text-indigo-800 text-lg"
                    >
                      👁 View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* View Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full relative">
            <h2 className="text-xl font-bold mb-4">Exam Details</h2>
            <p><strong>Name:</strong> {selectedExam.examName}</p>
            <p><strong>Code:</strong> {selectedExam.examCode}</p>
            <p><strong>Category:</strong> {selectedExam.category}</p>
            <p><strong>Duration:</strong> {selectedExam.duration} mins</p>
            <button
              onClick={() => setSelectedExam(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExamsList;
