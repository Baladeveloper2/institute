'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../../config/API';
import { Route, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

// Icons
const FolderIcon = () => (
  <svg className="w-6 h-6 mr-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a4 4 0 00-4-4h-8l-2-2z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const MonthIcon = () => (
  <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
);

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.1, when: 'beforeChildren' },
  },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ExamBrowser() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Levels: category, year, month, details
  const [level, setLevel] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [results, setResults] = useState({});

  const [requestHistory, setRequestHistory] = useState([]); // raw requests from API
  const [requests, setRequests] = useState({}); // map examCode -> status
  const [submissionStatus, setSubmissionStatus] = useState({}); // map examId -> submission details
  const [loadingMap, setLoadingMap] = useState({}); // per-exam loading for request button
  const [selectedResult, setSelectedResult] = useState(null);
  
  const navigate = useNavigate();
  const studentId = localStorage.getItem('userId');

const [studentExamStatus, setStudentExamStatus] = useState([]);



   

  // Fetch exams, requests, and submission statuses
// 1) Fetch exams, requests, submissionStatus on studentId change
useEffect(() => {
  async function fetchAllData() {
    setLoading(true);
    try {
      const examsRes = await axios.get('https://backend-institute-production.up.railway.app/Question/all-exams',{withCredentials: true});
      const examsList = examsRes.data.exams || examsRes.data || [];
      setExams(examsList);

      const reqRes = await axios.get(`https://backend-institute-production.up.railway.app/Question/student/${studentId}/requests`,{withCredentials: true});
      const reqMap = {};
      (reqRes.data.requests || []).forEach(req => {
        reqMap[req.examCode] = req.status;
      });
      setRequests(reqMap);
      setRequestHistory(reqRes.data.requests || []);

      // Fetch submission statuses in parallel
      const statusPromises = examsList.map(async exam => {
        try {
          const statusRes = await axios.get(`https://backend-institute-production.up.railway.app/Student/student/${studentId}/exam/${exam.examCode}/status`,{withCredentials: true});
          return [exam._id, statusRes.data || {}];
        } catch {
          return [exam._id, {}];
        }
      });
      const statusEntries = await Promise.all(statusPromises);
      const statusMap = Object.fromEntries(statusEntries);
      setSubmissionStatus(statusMap);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  if (studentId) {
    fetchAllData();
  } else {
    toast.error('User not logged in.');
    setLoading(false);
  }
}, [studentId]);

// 2) Fetch detailed statuses + results once exams have been set
useEffect(() => {
  if (!studentId || exams.length === 0) return;

  async function fetchStatusesAndResults() {
    try {
      const statusMap = {};
      const resultMap = {};

      await Promise.all(
        exams.map(async (exam) => {
          const statusRes = await axios.get(`https://backend-institute-production.up.railway.app/Student/student/${studentId}/exam/${exam.examCode}/status`,{withCredentials: true});
          const status = statusRes.data.status;
          statusMap[exam.examCode] = status;

          if (status === 'completed') {
            const resultRes = await axios.get(`https://backend-institute-production.up.railway.app/Student/student/${studentId}/exam/${exam.examCode}/result`,{withCredentials: true});
            resultMap[exam.examCode] = resultRes.data;
            console.log(resultMap,"mao");
            
              setSelectedResult([exam.examCode ]);
          }
        })
      );
      setStatuses(statusMap);
      setResults(resultMap);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching exam statuses/results');
    }
  }

  fetchStatusesAndResults();
}, [studentId, exams]);

useEffect(() => {
  const fetchStatus = async () => {
    try {
        await Promise.all(
      exams.map(async (exam) => {
      const res = await axios.get(`https://backend-institute-production.up.railway.app/Student/student/${studentId}/exam/${exam.examCode}/status`,{withCredentials: true});
      setStudentExamStatus(res.data); // This should include { examId, status }
    }))} catch (err) {
      console.error('Failed to fetch exam statuses', err);
    }
  };

  fetchStatus();
}, []);
  // Change navigation level with transition effect
  const changeLevel = (newLevel, category, year, month) => {
    setLevel(null);
    setTimeout(() => {
      setLevel(newLevel);
      setSelectedCategory(category ?? null);
      setSelectedYear(year ?? null);
      setSelectedMonth(month ?? null);
    }, 200);
  };

  const goBack = () => {
    if (level === 'details') changeLevel('month', selectedCategory, selectedYear);
    else if (level === 'month') changeLevel('year', selectedCategory);
    else if (level === 'year') changeLevel('category');
  };

  // Request exam access
  const requestAccess = async (examId) => {
    try {
      setLoadingMap(prev => ({ ...prev, [examId]: true }));
      await axios.post('https://backend-institute-production.up.railway.app/Question/exams/request', { examCode: examId, studentId });
      toast.success('Access request sent to admin');
      // Refresh requests after successful request
      const reqRes = await axios.get(`https://backend-institute-production.up.railway.app/Question/student/${studentId}/requests`);
      const reqMap = {};
      (reqRes.data.requests || []).forEach(req => {
        reqMap[req.examCode] = req.status;
      });
      setRequests(reqMap);
      setRequestHistory(reqRes.data.requests || []);
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setLoadingMap(prev => ({ ...prev, [examId]: false }));
    }
  };

  // Start exam navigation
  const handleStartExam = async (exam) => {
    if (exam.examEndTime && new Date() > new Date(exam.examEndTime)) {
      toast.warning('Exam time has expired!');
      return;
    }
    try {
      const res = await axios.get(`https://backend-institute-production.up.railway.app/Question/exams/${exam.examCode}/questions`,{withCredentials: true});
      const { questions } = res.data;
      navigate(`/student/exam/${exam.examCode}`, {
        state: { questions, examEndTime: exam.examEndTime },
      });
    } catch {
      toast.error('Failed to start the exam.');
    }
  };

  const handleRequest = async (examCode) => {
    try {
      setLoadingMap(prev => ({ ...prev, [examCode]: true }));
      await axios.post('https://backend-institute-production.up.railway.app/Question/exams/request', { examCode, studentId },{withCredentials: true});
      toast.success('Request sent to admin.');
      setRequests();
    } catch {
      toast.error('Failed to send request.');
    } finally {
      setLoadingMap(prev => ({ ...prev, [examCode]: false }));
    }
  };


  // Derived data for category, year, month and exam details
  const categories = [...new Set(exams.map(e => e.category))];
  const years = selectedCategory
    ? [...new Set(exams.filter(e => e.category === selectedCategory).map(e => e.year))]
    : [];
  const months = selectedCategory && selectedYear
    ? [...new Set(exams.filter(e => e.category === selectedCategory && e.year === selectedYear).map(e => e.month))]
    : [];
const examDetails = selectedCategory && selectedYear && selectedMonth
  ? exams
      .filter(e =>
        e.category === selectedCategory &&
        e.year === selectedYear &&
        e.month === selectedMonth
      )
      .map(e => {
        // Match the status of the exam for the current student
        const matchingStatus = studentExamStatus.find(s => s.examId === e._id);
        return {
          ...e,
          status: matchingStatus?.status || 'not_requested' // fallback if no match
        };
      })
  : [];


  if (loading) {
   return (
  <div className="p-4 max-w-3xl mx-auto min-h-screen bg-gray-50">
    <AnimatePresence mode="wait">
      <motion.div
        key={level}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-4"
      >
        {level !== 'category' && (
          <button
            onClick={goBack}
            className="text-blue-600 underline flex items-center space-x-1"
          >
            ← Back
          </button>
        )}

        {level === 'category' && categories.map((cat) => (
          <motion.div
            key={cat}
            variants={itemVariants}
            onClick={() => changeLevel('year', cat)}
            className="cursor-pointer bg-white p-4 shadow rounded flex items-center hover:bg-blue-50"
          >
            <FolderIcon />
            <span className="text-lg font-semibold">{cat}</span>
          </motion.div>
        ))}

        {level === 'year' && years.map((yr) => (
          <motion.div
            key={yr}
            variants={itemVariants}
            onClick={() => changeLevel('month', selectedCategory, yr)}
            className="cursor-pointer bg-white p-4 shadow rounded flex items-center hover:bg-green-50"
          >
            <CalendarIcon />
            <span className="text-lg font-semibold">{yr}</span>
          </motion.div>
        ))}

        {level === 'month' && months.map((mon) => (
          <motion.div
            key={mon}
            variants={itemVariants}
            onClick={() => changeLevel('details', selectedCategory, selectedYear, mon)}
            className="cursor-pointer bg-white p-4 shadow rounded flex items-center hover:bg-yellow-50"
          >
            <MonthIcon />
            <span className="text-lg font-semibold">{mon}</span>
          </motion.div>
        ))}
{level === 'details' &&
  Array.isArray(examDetails) &&
  examDetails.map((exam) => {
    const status = statuses[exam.examCode];
    console.log(status,"status");

    
    const requestStatus = requests[exam.examCode];
    console.log(requestStatus,"requestStatus");

    const isLoading = loadingMap[exam.examCode];
    console.log(isLoading,"isLoading");


    return (
      <motion.div key={exam._id} variants={itemVariants} className="bg-white p-4 shadow rounded space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{exam.title}</p>
            <p className="text-sm text-gray-600">{exam.description}</p>
          </div>
          <div className="text-right">
            {status === 'completed' && (
              <button
                onClick={() => setSelectedResult(results[exam.examCode])}
                className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded"
              >
                View Result
              </button>
            )}

            {status === 'not_started' && (
              <>
                {requestStatus === 'approved' ? (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Start
                  </button>
                ) : requestStatus === 'pending' ? (
                  <button disabled className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded">
                    Pending
                  </button>
                ) : (
                  <button
                    onClick={() => requestAccess(exam.examCode)}
                    disabled={isLoading}
                    className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
                  >
                    {isLoading ? 'Requesting...' : 'Request Access'}
                  </button>
                )}

                {isLoading && (
                  <span className="ml-2 inline-block animate-spin border-2 border-gray-400 border-t-transparent rounded-full w-4 h-4"></span>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  })}

      </motion.div>
    </AnimatePresence>

    {/* Modal for Result */}

  </div>
);

  }

  return (
    <div className="p-4 max-w-xl mx-auto min-h-screen bg-gray-50">
      {/* Back Button */}
      <AnimatePresence>
        {level !== 'category' && (
          <motion.button
            key="back-button"
            onClick={goBack}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="mb-6 inline-flex items-center bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            &larr; Back
          </motion.button>
        )}
      </AnimatePresence>

      {/* Category View */}
      <AnimatePresence mode="wait">
        {level === 'category' && (
          <motion.div
            key="category"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            <h1 className="col-span-full text-3xl font-bold mb-6 text-center">Select Category</h1>
            {categories.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No exams available.</p>
            ) : (
              categories.map(category => (
                <motion.button
                  key={category}
                  variants={itemVariants}
                  onClick={() => changeLevel('year', category)}
                  className="flex items-center justify-center p-6 bg-yellow-200 rounded shadow hover:bg-yellow-300"
                >
                  <FolderIcon /> {category}
                </motion.button>
              ))
            )}
          </motion.div>
        )}

        {/* Year View */}
        {level === 'year' && (
          <motion.div
            key="year"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-3 sm:grid-cols-4 gap-4"
          >
            <h1 className="col-span-full text-3xl font-bold mb-6 text-center">Select Year for {selectedCategory}</h1>
            {years.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No years found.</p>
            ) : (
              years.map(year => (
                <motion.button
                  key={year}
                  variants={itemVariants}
                  onClick={() => changeLevel('month', selectedCategory, year)}
                  className="flex items-center justify-center p-4 bg-blue-200 rounded shadow hover:bg-blue-300"
                >
                  <CalendarIcon /> {year}
                </motion.button>
              ))
            )}
          </motion.div>
        )}

        {/* Month View */}
        {level === 'month' && (
          <motion.div
            key="month"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            <h1 className="col-span-full text-3xl font-bold mb-6 text-center">
              {selectedCategory} - {selectedYear} - Select Month
            </h1>
            {months.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No months found.</p>
            ) : (
              months.map(month => (
                <motion.button
                  key={month}
                  variants={itemVariants}
                  onClick={() => changeLevel('details', selectedCategory, selectedYear, month)}
                  className="flex items-center justify-center p-4 bg-green-200 rounded shadow hover:bg-green-300"
                >
                  <MonthIcon /> {month}
                </motion.button>
              ))
            )}
          </motion.div>
        )}

        {/* Exam Details View */}
      {level === 'details' &&
  Array.isArray(examDetails) &&
  examDetails.map((exam) => {
    const status = statuses[exam.examCode];
    const requestStatus = requests[exam.examCode];
    const isLoading = loadingMap[exam.examCode];

    return (
      <motion.div key={exam._id} variants={itemVariants} className="bg-white p-4 shadow rounded space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{exam.title}</p>
            <p className="text-sm text-gray-600">{exam.description}</p>
          </div>
          <div className="">
          {status === 'completed' && (
 <div className="bg-white border sm:mr-30 w-full border-green-300 rounded-2xl shadow-md p-6 flex items-center justify-between space-x-6">
  {/* Left Section: Status & Message */}
  <div className="flex items-center space-x-4">
    <div className="bg-green-100 text-green-600 rounded-full p-3">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-green-700">Exam Completed</h2>
      <p className="text-sm text-gray-600">You’ve successfully finished this exam. Great job!</p>
    </div>
  </div>

  {/* Right Section: Score Display */}
  {/* <div className="text-right">
    <p className="text-sm text-gray-500">Your Score</p>
    <p className="text-2xl font-bold text-green-700">
      {results[exam.examCode]?.score ?? '--'} / 100
    </p>
  </div> */}
  
</div>

)}


            {status === 'not_started' && (
              <>
                {requestStatus === 'approved' ? (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Start
                  </button>
                ) : requestStatus === 'pending' ? (
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  {/* Left: Info + Exam Code */}
  <div>
    <p className="text-yellow-800 font-semibold text-md">Access Pending</p>
    <p className="text-sm text-yellow-700">You’ve requested access to this exam. Please wait for approval.</p>
    <p className="text-xs text-gray-500 mt-1">
      Exam Code: <span className="font-mono text-gray-700">{exam.examCode}</span>
    </p>
  </div>

  {/* Right: Conditional Button */}
  <div className="flex items-center gap-2">
    <button
      disabled
      className="text-sm px-4 py-2 rounded bg-yellow-200 text-yellow-800 cursor-not-allowed"
    >
      Requested
    </button>
  </div>
</div>


                ) : (
                  <button
                    onClick={() => requestAccess(exam.examCode)}
                    disabled={isLoading}
                    className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
                  >
                    {isLoading ? 'Requesting...' : 'Request Access'}
                  </button>
                )}

                {isLoading && (
                  <span className="ml-2 inline-block animate-spin border-2 border-gray-400 border-t-transparent rounded-full w-4 h-4"></span>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  })}

           
      </AnimatePresence>
   
    </div>
    
  );
}
