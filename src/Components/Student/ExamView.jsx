import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ExamViewer() {
  const { examCode, batchName } = useParams();
  const studentId = localStorage.getItem('userId');
const router = useNavigate()
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const [filterMode, setFilterMode] = useState('all');
  const [page, setPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const QUESTIONS_PER_PAGE = 20;


  useEffect(() => {
    async function fetchExam() {
      try {
<<<<<<< HEAD
        const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam/${examCode}/${encodeURIComponent(batchName)}`);
=======
        const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam/${examCode}/${encodeURIComponent(batchName)}`);
>>>>>>> a5be5d2 (updated code)

        const uniqueQuestions = res.data.questions.filter((q, i, arr) =>
          i === arr.findIndex(other => other.questionNumber === q.questionNumber)
        );

        setExam({ ...res.data, questions: uniqueQuestions });
        console.log(res.data,'Resposne data')
        const duration = res.data.batchDuration ?? res.data.examDuration ?? 10;
        setTimeLeft(duration * 60);
      } catch {
        setError('Failed to load exam');
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [examCode, batchName]);

  const filteredQuestions = exam ? (
    filterMode === 'reviewedOnly'
      ? exam.questions.filter(q => {
          const answerDetail = report?.answerDetails?.find(a => a.questionId === q._id);
          return answerDetail && !answerDetail.isCorrect;
        })
      : exam.questions
  ) : [];

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) return handleSubmit();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    try {
<<<<<<< HEAD
      await axios.post('https://api-backend-institute.onrender.com/Question/student/submit', {
=======
      await axios.post('https://api-backend-institute.onrender.com/Question/student/submit', {
>>>>>>> a5be5d2 (updated code)
        examCode,
        batchName,
        examId: exam.examId,
        studentId,
        answers,
        reviewedQuestions: Object.keys(reviewed).filter((q) => reviewed[q])
      });
      alert('Exam submitted!');
      setSubmitted(true);
      // fetchReport();
        router(`/student/exam-review/${exam.examId}/${studentId}`);

    } catch {
      alert('Failed to submit exam');
    }
  };

  const fetchReport = async () => {
    try {
<<<<<<< HEAD
const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam-report/${exam.examId}/${studentId}`);
=======
const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam-report/${exam.examId}/${studentId}`);
>>>>>>> a5be5d2 (updated code)

       setReport(res.data);
       router.push(`/exam-review/${exam.examId}/${studentId}`)
    console.log('Fetching report with:', exam.examId, studentId);


    } catch(error) {
      console.error(error);
      
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!exam) return <div>No exam found</div>;

  const answeredOnly = exam.questions.filter(q =>
    answers[q.questionNumber] && !reviewed[q.questionNumber]
  ).length;

  const markedOnly = exam.questions.filter(q =>
    reviewed[q.questionNumber] && !answers[q.questionNumber]
  ).length;

  const markedAndAnswered = exam.questions.filter(q =>
    reviewed[q.questionNumber] && answers[q.questionNumber]
  ).length;

  const notAnswered = exam.questions.filter(q =>
    !answers[q.questionNumber] && !reviewed[q.questionNumber]
  ).length;

  const paginatedQuestions = filteredQuestions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  const currentQuestion = filteredQuestions[currentIndex] || {};

  const getStatusColor = (qNo) => {
    const isAnswered = answers.hasOwnProperty(qNo);
    const isReviewed = reviewed[qNo];
    if (isReviewed && isAnswered) return 'bg-purple-500';
    if (isAnswered) return 'bg-green-500';
    if (isReviewed) return 'bg-yellow-400';
    return 'bg-gray-300';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="md:w-3/4 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{exam.examName}</h1>
          <span className="text-red-600 text-lg">
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
            {String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>

        <div className="flex gap-4 mb-2 text-sm font-medium">
          <button onClick={() => setFilterMode('all')} className={`px-3 py-1 rounded ${filterMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
          <button onClick={() => setFilterMode('reviewedOnly')} className={`px-3 py-1 rounded ${filterMode === 'reviewedOnly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Incorrect Only</button>
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold">Q.{currentQuestion.questionNumber}) {currentQuestion.questionTextEnglish}</p>
          <p className="text-lg font-semibold">{currentQuestion.questionTextTamil}</p>

          {Object.entries(currentQuestion.subOptions || {}).map(([key, value]) => value && (
            <label key={key} className="block py-1">
              <span className="ml-2 font-medium">({key}) {value}</span>
            </label>
          ))}

          {Object.entries(currentQuestion.options || {}).map(([key, value]) => (
            <label key={key} className="block py-1">
              <input
                type="radio"
                name={`q-${currentQuestion.questionNumber}`}
                disabled={submitted}
                checked={answers[currentQuestion.questionNumber] === key}
                onChange={() => setAnswers(prev => ({ ...prev, [currentQuestion.questionNumber]: key }))}
              />
              <span className="ml-2 font-medium">{key}: {value}</span>
            </label>
          ))}

          {!submitted && (
            <label className="block mt-2">
              <input
                type="checkbox"
                checked={!!reviewed[currentQuestion.questionNumber]}
                onChange={() =>
                  setReviewed(prev => ({
                    ...prev,
                    [currentQuestion.questionNumber]: !prev[currentQuestion.questionNumber]
                  }))
                }
              /> <span className="ml-2">Mark for Review</span>
            </label>
          )}

          {submitted && report && (
            <div className="mt-4 p-2 border rounded bg-gray-100 text-sm">
              <strong>Explanation:</strong> {report.answerDetails?.find(a => a.questionId === currentQuestion._id)?.explanation || 'Not available'}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
          <button onClick={() => setCurrentIndex(i => Math.min(i + 1, filteredQuestions.length - 1))} className="px-4 py-2 bg-gray-300 rounded">Next</button>
          {!submitted && (
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
          )}
        </div>
      </div>

      <div className="md:w-1/4 p-4 bg-white border-l">
        <div className="mb-2 text-sm space-y-3">
          <p className="text-green-600">
            <span className="bg-green-500 px-4 py-1 rounded-full text-white">{answeredOnly}</span> ✔ Answered Only
          </p>
          <p className="text-yellow-600">
            <span className="bg-yellow-500 px-4 py-1 rounded-full text-white">{markedOnly}</span> 🔖 Marked Only
          </p>
          <p className="text-purple-600">
            <span className="bg-purple-500 px-4 py-1 rounded-full text-white">{markedAndAnswered}</span> 🟣 Marked + Answered
          </p>
          <p className="text-red-600">
            <span className="bg-red-500 px-4 py-1 rounded-full text-white">{notAnswered}</span> ❌ Not Answered
          </p>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-5 gap-2 text-white text-sm mb-2">
=======
        {/* <div className="grid grid-cols-5 gap-2 text-white text-sm mb-2">
>>>>>>> a5be5d2 (updated code)
        {paginatedQuestions.map((currentQuestion, idx) => {
  const qNo = currentQuestion.questionNumber;
  const answerDetail = report?.answerDetails?.find(a => a.questionId === currentQuestion._id);
  const selectedOption = answers[qNo];
  const isSubmitted = submitted;
  const isCorrect = answerDetail?.correctOption === selectedOption;
  const isWrong = selectedOption && !isCorrect;

  return (
    <div key={qNo} className="mb-6 bg-white p-4 rounded shadow border">
      <p className="text-lg font-semibold mb-1">Q.{qNo}) {currentQuestion.questionTextEnglish}</p>
      <p className="text-base mb-2">{currentQuestion.questionTextTamil}</p>

      {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
        return (
          <label
            key={key}
            className={`block p-2 mb-1 rounded border text-sm font-medium transition-all duration-200 ${
              isSubmitted
                ? key === answerDetail?.correctOption
                  ? 'bg-green-100 text-green-800 border-green-400'
                  : selectedOption === key
                  ? 'bg-red-100 text-red-800 border-red-400'
                  : 'bg-gray-50 border-gray-300'
                : 'bg-gray-50 border-gray-300 hover:bg-blue-50'
            }`}
          >
            <input
              type="radio"
              name={`q-${qNo}`}
              disabled={isSubmitted}
              checked={selectedOption === key}
              onChange={() => {
                if (!isSubmitted) {
                  setAnswers((prev) => ({
                    ...prev,
                    [qNo]: key,
                  }));
                }
              }}
              className="mr-2"
            />
            {key}: {value}
          </label>
        );
      })}

      {!submitted && (
        <label className="block mt-2">
          <input
            type="checkbox"
            checked={!!reviewed[qNo]}
            onChange={() =>
              setReviewed((prev) => ({
                ...prev,
                [qNo]: !prev[qNo],
              }))
            }
          />{' '}
          <span className="ml-2">Mark for Review</span>
        </label>
      )}

      {submitted && (
        <div className="mt-2 text-sm text-gray-700">
          <p>
            ✅ Correct Answer:{' '}
            <strong className="text-green-600">
              {currentQuestion.options[answerDetail?.correctOption] || 'N/A'}
            </strong>
          </p>
          <p>
            🧍 Your Answer:{' '}
            <span className="text-blue-500">
              {currentQuestion.options[answerDetail?.studentAnswer] || 'Not Answered'}
            </span>
          </p>
          <p className="mt-1">
            💡 <strong>Explanation:</strong>{' '}
            {answerDetail?.explanation || 'Not available'}
          </p>
        </div>
      )}
    </div>
  );
})}

<<<<<<< HEAD
        </div>
=======
        </div> */}
>>>>>>> a5be5d2 (updated code)

        <div className="flex justify-between mb-2">
          <button disabled={page === 0} onClick={() => setPage(p => Math.max(p - 1, 0))} className="text-xs bg-gray-200 px-2 py-1 rounded">Prev</button>
          <button disabled={(page + 1) * QUESTIONS_PER_PAGE >= filteredQuestions.length} onClick={() => setPage(p => p + 1)} className="text-xs bg-gray-200 px-2 py-1 rounded">Next</button>
        </div>
        {submitted && report && (
  <div className="mt-2 text-sm text-gray-700">
    <p>
      ✅ Correct Answer: 
      <strong className="ml-1 text-green-600">
        {
          currentQuestion.options[
            report.answerDetails?.find(a => a.questionId === currentQuestion._id)?.correctOption
          ]
        }
      </strong>
    </p>
    <p>
      🧍‍♂️ Your Answer:
      <span className="ml-1 text-blue-500">
        {
          currentQuestion.options[
            report.answerDetails?.find(a => a.questionId === currentQuestion._id)?.studentAnswer
          ] || 'Not Answered'
        }
      </span>
    </p>
  </div>
)}
<<<<<<< HEAD
{Object.entries(currentQuestion.options || {}).map(([key, value]) => {
=======
{/* {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
>>>>>>> a5be5d2 (updated code)
  const answerDetail = report?.answerDetails?.find(a => a.questionId === currentQuestion._id);
  const isCorrect = answerDetail?.correctOption === key;
  const isSelected = answers[currentQuestion.questionNumber] === key;
  const isWrong = isSelected && !isCorrect;

  return (
    <label
      key={key}
      className={`block py-1 px-2 rounded ${
        submitted
          ? isCorrect
            ? 'bg-green-100 text-green-800 border border-green-400'
            : isWrong
            ? 'bg-red-100 text-red-800 border border-red-400'
            : 'bg-gray-100'
          : ''
      }`}
    >
      <input
        type="radio"
        disabled
        checked={isSelected}
        name={`q-${currentQuestion.questionNumber}`}
      />
      <span className="ml-2 font-medium">{key}: {value}</span>
    </label>
  );
<<<<<<< HEAD
})}
=======
})} */}
>>>>>>> a5be5d2 (updated code)

      </div>
    </div>
  );
}

export default ExamViewer;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// function ExamViewer() {
//   const { examCode, batchName } = useParams();
//   const studentId = localStorage.getItem('userId');

//   const [exam, setExam] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [answers, setAnswers] = useState({});
//   const [reviewed, setReviewed] = useState({});
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [report, setReport] = useState(null);
//   const [filterMode, setFilterMode] = useState('all');
//   const [page, setPage] = useState(0);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const QUESTIONS_PER_PAGE = 20;

//   useEffect(() => {
//     async function fetchExam() {
//       try {
<<<<<<< HEAD
//         const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam/${examCode}/${encodeURIComponent(batchName)}`);
=======
//         const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam/${examCode}/${encodeURIComponent(batchName)}`);
>>>>>>> a5be5d2 (updated code)
        
//         // ✅ Remove duplicate questions by questionNumber
//         const uniqueQuestions = res.data.questions.filter((q, i, arr) =>
//           i === arr.findIndex(other => other.questionNumber === q.questionNumber)
//         );

//         setExam({ ...res.data, questions: uniqueQuestions });
//         const duration = res.data.batchDuration ?? res.data.examDuration ?? 10;
//         setTimeLeft(duration * 60);
//       } catch {
//         setError('Failed to load exam');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchExam();
//   }, [examCode, batchName]);

//   const filteredQuestions = exam ? (
//     filterMode === 'reviewedOnly'
//       ? exam.questions.filter(q => {
//           const answerDetail = report?.answerDetails?.find(a => a.questionId === q._id);
//           return answerDetail && !answerDetail.isCorrect;
//         })
//       : exam.questions
//   ) : [];

//   useEffect(() => {
//     if (timeLeft === null || submitted) return;
//     if (timeLeft <= 0) return handleSubmit();

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, submitted]);

//   const handleSubmit = async () => {
//     try {
<<<<<<< HEAD
//       await axios.post('https://api-backend-institute.onrender.com/Question/student/submit', {
=======
//       await axios.post('https://api-backend-institute.onrender.com/Question/student/submit', {
>>>>>>> a5be5d2 (updated code)
//         examCode,
//         batchName,
//         studentId,
//         answers,
//         reviewedQuestions: Object.keys(reviewed).filter((q) => reviewed[q])
//       });
//       alert('Exam submitted!');
//       setSubmitted(true);
//       fetchReport();
//     } catch {
//       alert('Failed to submit exam');
//     }
//   };

//   const fetchReport = async () => {
//     try {
<<<<<<< HEAD
//       const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam-report/${exam._id}/${studentId}`);
=======
//       const res = await axios.get(`https://api-backend-institute.onrender.com/Question/student/exam-report/${exam._id}/${studentId}`);
>>>>>>> a5be5d2 (updated code)
//       setReport(res.data);
//     } catch {}
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   if (!exam) return <div>No exam found</div>;

//   // ✅ Accurate Counts
//   const answeredOnly = exam.questions.filter(q =>
//     answers[q.questionNumber] && !reviewed[q.questionNumber]
//   ).length;

//   const markedOnly = exam.questions.filter(q =>
//     reviewed[q.questionNumber] && !answers[q.questionNumber]
//   ).length;

//   const markedAndAnswered = exam.questions.filter(q =>
//     reviewed[q.questionNumber] && answers[q.questionNumber]
//   ).length;

//   const notAnswered = exam.questions.filter(q =>
//     !answers[q.questionNumber] && !reviewed[q.questionNumber]
//   ).length;

//   const notVisited = notAnswered;

//   const paginatedQuestions = filteredQuestions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
//   const currentQuestion = filteredQuestions[currentIndex] || {};

//   const getStatusColor = (qNo) => {
//     const isAnswered = answers.hasOwnProperty(qNo);
//     const isReviewed = reviewed[qNo];
//     if (isReviewed && isAnswered) return 'bg-purple-500';
//     if (isAnswered) return 'bg-green-500';
//     if (isReviewed) return 'bg-yellow-400';
//     return 'bg-gray-300';
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
//       {/* Main Area */}
//       <div className="md:w-3/4 p-4 overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-bold">{exam.examName}</h1>
//           <span className="text-red-600 text-lg">
//             {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
//             {String(timeLeft % 60).padStart(2, '0')}
//           </span>
//         </div>

//         <div className="flex gap-4 mb-2 text-sm font-medium">
//           <button onClick={() => setFilterMode('all')} className={`px-3 py-1 rounded ${filterMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
//           <button onClick={() => setFilterMode('reviewedOnly')} className={`px-3 py-1 rounded ${filterMode === 'reviewedOnly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Incorrect Only</button>
//         </div>

//         <div className="mb-4">
//           <p className="text-lg font-semibold">Q.{currentQuestion.questionNumber}) {currentQuestion.questionTextEnglish}</p>
//           <p className="text-lg font-semibold">{currentQuestion.questionTextTamil}</p>

//           {Object.entries(currentQuestion.options || {}).map(([key, value]) => (
//             <label key={key} className="block py-1">
//               <input
//                 type="radio"
//                 name={`q-${currentQuestion.questionNumber}`}
//                 disabled={submitted}
//                 checked={answers[currentQuestion.questionNumber] === key}
//                 onChange={() => setAnswers(prev => ({ ...prev, [currentQuestion.questionNumber]: key }))}
//               />
//               <span className="ml-2 font-medium">{key}: {value}</span>
//             </label>
//           ))}

//           {!submitted && (
//             <label className="block mt-2">
//               <input
//                 type="checkbox"
//                 checked={!!reviewed[currentQuestion.questionNumber]}
//                 onChange={() =>
//                   setReviewed(prev => ({
//                     ...prev,
//                     [currentQuestion.questionNumber]: !prev[currentQuestion.questionNumber]
//                   }))
//                 }
//               /> <span className="ml-2">Mark for Review</span>
//             </label>
//           )}

//           {submitted && report && (
//             <div className="mt-4 p-2 border rounded bg-gray-100 text-sm">
//               <strong>Explanation:</strong> {report.answerDetails?.find(a => a.questionId === currentQuestion._id)?.explanation || 'Not available'}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between">
//           <button onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
//           <button onClick={() => setCurrentIndex(i => Math.min(i + 1, filteredQuestions.length - 1))} className="px-4 py-2 bg-gray-300 rounded">Next</button>
//           {!submitted && (
//             <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
//           )}
//         </div>
//       </div>

//       {/* Sidebar */}
//       <div className="md:w-1/4 p-4 bg-white border-l">
//         <div className="mb-2 text-sm space-y-3">
//           <p className="text-green-600">
//             <span className="bg-green-500 px-4 py-1 rounded-full text-white">{answeredOnly}</span> ✔ Answered Only
//           </p>
//           <p className="text-yellow-600">
//             <span className="bg-yellow-500 px-4 py-1 rounded-full text-white">{markedOnly}</span> 🔖 Marked Only
//           </p>
//           <p className="text-purple-600">
//             <span className="bg-purple-500 px-4 py-1 rounded-full text-white">{markedAndAnswered}</span> 🟣 Marked + Answered
//           </p>
//           <p className="text-red-600">
//             <span className="bg-red-500 px-4 py-1 rounded-full text-white">{notAnswered}</span> ❌ Not Answered
//           </p>
//           <p className="text-gray-600">
//             <span className="bg-gray-500 px-4 py-1 rounded-full text-white">{notVisited}</span> 🚫 Not Visited
//           </p>
//         </div>

//         <div className="grid grid-cols-5 gap-2 text-white text-sm mb-2">
//           {paginatedQuestions.map((q) => (
//             <button
//               key={q.questionNumber}
//               onClick={() => setCurrentIndex(filteredQuestions.findIndex(qq => qq.questionNumber === q.questionNumber))}
//               className={`${getStatusColor(q.questionNumber)} py-1 rounded`}
//             >
//               {q.questionNumber}
//             </button>
//           ))}
//         </div>

//         <div className="flex justify-between mb-2">
//           <button disabled={page === 0} onClick={() => setPage(p => Math.max(p - 1, 0))} className="text-xs bg-gray-200 px-2 py-1 rounded">Prev</button>
//           <button disabled={(page + 1) * QUESTIONS_PER_PAGE >= filteredQuestions.length} onClick={() => setPage(p => p + 1)} className="text-xs bg-gray-200 px-2 py-1 rounded">Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ExamViewer;
