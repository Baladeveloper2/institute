import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const StudentReportList = () => {
  const { studentId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/all-reports/${studentId}`);
        setReports(res.data || []);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [studentId]);

  if (loading) return <div className="p-6 text-center text-blue-600 font-semibold">Loading reports...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
        Your Exam Reports
      </h2>

      {reports.length === 0 ? (
        <div className="text-center text-gray-600">No reports found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white border shadow rounded-xl p-4 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {report.examCode}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Submitted on: {new Date(report.createdAt).toLocaleDateString()}
              </p>

              <div className="space-y-1 text-sm">
                <p>
                  ✅ Correct: <span className="font-semibold text-green-600">{report.correctAnswers}</span>
                </p>
                <p>
                  ❌ Wrong: <span className="font-semibold text-red-500">{report.wrongAnswers}</span>
                </p>
                <p>
                  ⏳ Unanswered:{' '}
                  <span className="font-semibold text-yellow-600">
                    {report.unansweredQuestions}
                  </span>
                </p>
                <p className="text-blue-700 font-bold mt-2">Score: {report.result}%</p>
              </div>

              <Link
                to={`/student/exam-review/${report.examId}/${studentId}`}
                className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                View Full Report
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentReportList;
