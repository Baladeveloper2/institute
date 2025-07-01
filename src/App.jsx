import { useState } from 'react'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import AdminLogin from './Components/AdminLogin'
import StudentLogin from './Components/StudentLogin'
import HomePage from './Components/Home'
import StudentRegister from './Components/StudentRegister'
import AdminRegister from './Components/AdminRegister'
import DashboardLayout from './Components/dashboardLayout/Layout'
import Exams from './Components/dashboardLayout/Exams'
import Reports from './Components/dashboardLayout/Reports'
import ExamDashboard from './Components/dashboardLayout/ExamDashboard'
import Dashboard from './Components/dashboardLayout/Dashboard'
import AdminUpload from './Components/dashboardLayout/Upload'
import StudentExam from './Components/Student/StudentExam'
import StudentDashboard from './Components/Student/StudentDashboard'
import StudentExamList from './Components/Student/StudentExamList'
import AdminExamRequests from './Components/dashboardLayout/Request'
import StudentListAdmin from './Components/dashboardLayout/Users'
import AdminDashboard from './Components/dashboardLayout/AdminDashboard'
import StudentDashboardLayout from './Components/Student/StudentDashboard'
import StudentProfile from './Components/Student/StudentProfile'
import StudentExamListing from './Components/Student/StudentExamlisting'
import StudentHomeDashboard from './Components/Student/Dashboard'
import StudentBatchAccessUI from './Components/List'
import StudentBatchList from './Components/Student/BatchesListing'

import Examlist from './Components/Student/ExamPage'
import ExamViewer from './Components/Student/ExamView'
import { ExamReview } from './Components/Student/ExamReview'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        {/* Home page */}
        <Route path='/' element={<HomePage/>} />
        {/* Admin Routes  */}
        <Route path='/institute-exam-admin-Register' element={<AdminRegister/>} />        
       
        
        <Route path='/institute-exam-admin-Login' element={<AdminLogin/>} />
        <Route path='/list' element={<StudentBatchAccessUI/>} />

        {/* Student Routes*/}
        <Route path='/student-Login' element={<StudentLogin/>} />
        <Route path='/student-Register' element={<StudentRegister/>} />
        <Route path='/student/exam' element={<StudentExamList/>} />
        <Route path='/student' element={<StudentDashboardLayout />}>
        <Route path='batchlist' element={<StudentBatchList />} />

    <Route index element={<StudentHomeDashboard/>} /> {/* Default dashboard page */}
    <Route path='exams' element={<StudentExamList />} />
    <Route path='profile' element={<StudentProfile />} />
    <Route path='exams-list' element={<StudentExamListing />} />
    <Route path="/student/batches/:batchName/exams" element={<Examlist />} />
    <Route path="/student/exam/:examCode/:batchName" element={<ExamViewer />} />
    <Route path="/student/exam-review/:examId/:studentId" element={<ExamReview />} />

    
  </Route>
        


      {/* Admin Routes */}
  <Route path="/admin" element={<DashboardLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<StudentListAdmin />} />
  <Route path="upload" element={<AdminUpload />} />
  <Route path="Request" element={<AdminExamRequests />} />
  <Route path="Reports" element={<Reports />} />
  <Route path="Exams" element={<Exams />} />
  <Route path="Dashboard" element={<AdminDashboard />} />
  <Route path="Exam-Dashboard" element={<ExamDashboard />} />
</Route>


      </Routes>
    </div>
  )
}

export default App
