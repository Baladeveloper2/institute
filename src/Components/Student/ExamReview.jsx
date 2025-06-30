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
  const [viewMode, setViewMode] = useState('all'); // all | wrong

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get(
          `http://localhost:5000/Question/student/exam-report/${examId}/${studentId}`
        );
        setReport(res.data);
      } catch (err) {
        console.error('Failed to load exam report:', err);
      } finally {
        setLoading(false);
      }
    }

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

  const filteredAnswers =
    viewMode === 'wrong'
      ? answers.filter((ans) => ans.selectedOption !== ans.correctOption)
      : answers;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {report.examId.examName} - Review
      </h2>

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
          </div>
        );
      })}

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
