import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const ExamReview = () => {
  const { examId, studentId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [viewMode, setViewMode] = useState('all'); // all | wrong
=======
  const [viewMode, setViewMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
>>>>>>> a5be5d2 (updated code)

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get(
<<<<<<< HEAD
          `https://api-backend-institute.onrender.com/Question/student/exam-report/${examId}/${studentId}`
=======
          `https://api-backend-institute.onrender.com/Question/student/exam-report/${examId}/${studentId}`
>>>>>>> a5be5d2 (updated code)
        );
        setReport(res.data);
      } catch (err) {
        console.error('Failed to load exam report:', err);
      } finally {
        setLoading(false);
      }
    }
<<<<<<< HEAD

=======
>>>>>>> a5be5d2 (updated code)
    fetchReport();
  }, [examId, studentId]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!report) return <div className="p-4 text-center">Report not found</div>;

  const allQuestions = report.examId?.questions || [];
  const answers = report.answerDetails || [];

  const chartData = [
    { name: 'Correct', value: report.correctAnswers },
    { name: 'Wrong', value: report.wrongAnswers },
    { name: 'Unanswered', value: report.unansweredQuestions },
  ];

  const COLORS = ['#22c55e', '#ef4444', '#9ca3af'];

<<<<<<< HEAD
  const filteredAnswers =
    viewMode === 'wrong'
      ? answers.filter((ans) => ans.selectedOption !== ans.correctOption)
      : answers;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {report.examId.examName} - Review
      </h2>
=======
  // ✅ Filter logic
  const filteredAnswers =
    viewMode === 'correct'
      ? answers.filter((ans) => ans.isCorrect === true)
      : viewMode === 'wrong'
      ? answers.filter((ans) => ans.selectedOption && ans.isCorrect === false)
      : viewMode === 'unanswered'
      ? answers.filter((ans) => !ans.selectedOption)
      : viewMode === 'review'
      ? answers.filter((ans) => ans.markedForReview)
      : answers;

  const totalPages = Math.ceil(filteredAnswers.length / itemsPerPage);
  const paginatedAnswers = filteredAnswers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h2 className="text-3xl font-bold text-blue-800">
          {report.examId.examName} - Review
        </h2>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          🖨️ Print Review
        </button>
      </div>
>>>>>>> a5be5d2 (updated code)

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1 bg-blue-50 p-4 rounded border border-blue-300 shadow">
          <p>Total Questions: {report.totalQuestions}</p>
          <p>Attempted: {report.attemptedQuestions}</p>
          <p>
            Correct:{' '}
            <span className="text-green-600 font-semibold">
              {report.correctAnswers}
            </span>
          </p>
          <p>
            Wrong:{' '}
            <span className="text-red-600 font-semibold">
              {report.wrongAnswers}
            </span>
          </p>
          <p>
            Score:{' '}
            <strong className="text-blue-700">{report.result}%</strong>
          </p>
        </div>

        <div className="flex-1 bg-white rounded shadow p-2">
          <h3 className="text-lg font-semibold text-center mb-2">
            Performance Chart
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

<<<<<<< HEAD
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded font-medium ${
            viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          All Questions
        </button>
        <button
          onClick={() => setViewMode('wrong')}
          className={`px-4 py-2 rounded font-medium ${
            viewMode === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-200'
          }`}
        >
          Incorrect Only
        </button>
      </div>

{filteredAnswers.map((ans, idx) => {
  const q = allQuestions.find((question) => {
    const qId = question._id?.toString?.();
    const aId = typeof ans.questionId === 'string'
      ? ans.questionId
      : ans.questionId?._id?.toString?.();
    return qId === aId;
  });

  if (!q) return null;

  const isCorrect = ans.selectedOption === ans.correctOption;

  return (
    <div
      key={idx}
      className={`mb-6 border-b pb-4 shadow rounded-lg p-4 ${
        isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
      }`}
    >
      <p className="font-semibold mb-1 text-gray-800">
        Q{q?.questionNumber}) {q?.questionTextEnglish}
      </p>
      <p className="mb-2 text-sm text-gray-600">{q?.questionTextTamil}</p>

      {Object.entries(q?.options || {}).map(([key, value]) => {
        const isRight = key === ans.correctOption;
        const isChosen = key === ans.selectedOption;

        return (
          <div
            key={key}
            className={`p-2 rounded mb-1 text-sm font-medium border transition-all duration-200 ${
              isRight
                ? 'bg-green-100 text-green-800 border-green-400'
                : isChosen
                ? 'bg-red-100 text-red-800 border-red-400'
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            {key}: {value}
=======
      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap justify-center mb-6 print:hidden">
        {[
          { mode: 'all', label: 'All Questions', color: 'bg-blue-600' },
          { mode: 'correct', label: 'Correct', color: 'bg-green-600' },
          { mode: 'wrong', label: 'Incorrect', color: 'bg-red-600' },
          { mode: 'unanswered', label: 'Unanswered', color: 'bg-yellow-500' },
          { mode: 'review', label: 'Marked for Review', color: 'bg-purple-600' },
        ].map(({ mode, label, color }) => (
          <button
            key={mode}
            onClick={() => {
              setViewMode(mode);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded font-medium ${
              viewMode === mode ? `${color} text-white` : 'bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Questions */}
      {paginatedAnswers.map((ans, idx) => {
        const q = allQuestions.find((question) => {
          const qId = String(question?._id ?? '');
          const aId =
            typeof ans.questionId === 'string'
              ? ans.questionId
              : String(ans.questionId?._id ?? '');
          return qId === aId;
        });

        if (!q) return null;

        const cardClass = ans.markedForReview
          ? 'bg-purple-50 border-purple-400'
          : ans.selectedOption == null
          ? 'bg-yellow-50 border-yellow-300'
          : ans.isCorrect
          ? 'bg-green-50 border-green-300'
          : 'bg-red-50 border-red-300';

        return (
          <div
            key={idx}
            className={`mb-6 border-b pb-4 shadow rounded-lg p-4 ${cardClass}`}
          >
            <p className="font-semibold mb-1 text-gray-800">
              Q{q.questionNumber}) {q.questionTextEnglish}
            </p>

            {ans.markedForReview && (
              <span className="inline-block bg-purple-200 text-purple-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                🔖 Marked for Review
              </span>
            )}

            <p className="mb-2 text-sm text-gray-600">{q.questionTextTamil}</p>

            {Object.entries(q.options || {}).map(([key, value]) => {
              const isRight = key === q.correctOption;
              const isChosen = key === ans.selectedOption;

              return (
                <div
                  key={key}
                  className={`p-2 rounded mb-1 text-sm font-medium border ${
                    isRight
                      ? 'bg-green-100 text-green-800 border-green-400'
                      : isChosen
                      ? 'bg-red-100 text-red-800 border-red-400'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  {key}: {value}
                </div>
              );
            })}

            <p className="mt-2 text-sm text-gray-700">
              <strong>Explanation:</strong>{' '}
              {q.explanation || 'Not available'}
            </p>

            <p
              className={`text-sm mt-1 ${
                ans.selectedOption == null
                  ? 'text-yellow-700'
                  : ans.isCorrect
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              {ans.selectedOption == null
                ? '⚠ No answer selected'
                : ans.isCorrect
                ? '✔ Correct answer selected'
                : '✖ Incorrect answer selected'}
            </p>
>>>>>>> a5be5d2 (updated code)
          </div>
        );
      })}

<<<<<<< HEAD
      <p className="mt-2 text-sm text-gray-700">
        <strong>Explanation:</strong>{' '}
        {q?.explanation || 'Not available'}
      </p>

      <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
        {isCorrect ? '✔ Correct answer selected' : '✖ Incorrect answer selected'}
      </p>
    </div>
  );
})}


      <div className="text-center mt-8">
=======
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 print:hidden">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="px-3 py-1 text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}

      <div className="text-center mt-8 print:hidden">
>>>>>>> a5be5d2 (updated code)
        <Link
          to="/student"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ⬅ Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
