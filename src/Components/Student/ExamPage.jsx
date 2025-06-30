import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Examlist = () => {
  const { batchName } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/batch/exams/${encodeURIComponent(batchName)}`);
        setExams(res.data);
      } catch (err) {
        setError("Failed to load exams for this batch");
      }
    };

    fetchExams();
  }, [batchName]);

  const handleStartExam = (examCode) => {
    navigate(`/student/exam/${examCode}/${encodeURIComponent(batchName)}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exams in {batchName}</h1>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {exams.length > 0 ? (
        <ul className="space-y-4">
          {exams.map((exam) => (
            <li key={exam._id} className="p-4 border rounded shadow">
              <div className="font-semibold">{exam.examName}</div>
              <div>Code: {exam.examCode}</div>
              <div>Category: {exam.category}</div>
              <div>Duration: {exam.duration} mins</div>
            <button
  onClick={() => handleStartExam(exam.examCode)}
  className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Start Exam
</button>

            </li>
          ))}
        </ul>
      ) : (
        <p>No exams available for this batch.</p>
      )}
    </div>
  );
};

export default Examlist;
