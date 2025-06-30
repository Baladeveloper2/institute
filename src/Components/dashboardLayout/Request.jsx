import React, { useEffect, useState } from 'react';
import API from '../../config/API';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function AdminExamRequests() {
  const [request, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loadingRequestId, setLoadingRequestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, status: '' });

  const pageSize = 5;

  const fetchRequests = async () => {
    try {
     
      const res = await axios.get('https://api-backend-institute.onrender.com/batch/access/requests/list',{withCredentials: true});

      // const res = await axios.get('https://backend-institute-production.up.railway.app/Question/GetALLRequests',{withCredentials: true});
      setRequests(res.data);
      console.log(res.data,"response");
      
    } catch (err) {
      console.error('Failed to load requests:', err);
    }
  };

const updateStatus = async (studentId, status, batchName) => {
  try {
    setLoadingRequestId(studentId);

    await axios.put(
      'https://api-backend-institute.onrender.com/batch/access/update',
      { studentId, status, batchName },
      { withCredentials: true }
    );

    toast.success(`Request ${status} successfully!`);
    fetchRequests();
  } catch (err) {
    toast.error('Error updating request.');
  } finally {
    setLoadingRequestId(null);
    setConfirmModal({ open: false, id: null, status: '', studentId: null, batchName: '' });
  }
};


  useEffect(() => {
    let data = [...request];
    const lowerSearch = searchTerm.toLowerCase();

    data = data.filter((req) => {
      const name = req.studentId?.name?.toLowerCase() || '';
      const email = req.studentId?.email?.toLowerCase() || '';
      const mobileNumber = req.studentId?.mobileNumber?.toLowerCase() || '';

      return name.includes(lowerSearch) || email.includes(lowerSearch) || mobileNumber.includes(lowerSearch);
    });

    if (statusFilter !== 'all') {
      data = data.filter((req) => req.status === statusFilter);
    }

    if (sortBy === 'status') {
      data.sort((a, b) => a.status.localeCompare(b.status));
    } else {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredRequests(data);
    setCurrentPage(1);
  }, [request, searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 bg-white shadow-xl rounded-lg relative">
  <ToastContainer />
  <h2 className="text-2xl font-bold mb-6">Student Exam Access Requests</h2>

  {/* Filters */}
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <input
      type="text"
      placeholder="Search by name or email"
      className="border px-4 py-2 rounded-md w-full sm:w-1/3"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <select
      className="border px-4 py-2 rounded-md w-full sm:w-1/4"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="all">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="declined">Declined</option>
    </select>
    <select
      className="border px-4 py-2 rounded-md w-full sm:w-1/4"
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="date">Newest First</option>
      <option value="status">Sort by Status</option>
    </select>
  </div>

  {/* Request Cards */}
  {paginatedRequests.length === 0 ? (
    <p className="text-center text-gray-500">No matching requests found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {paginatedRequests.map((req) => (
        <div key={req._id} className="p-5 border rounded-xl shadow-sm bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-lg">{req.studentId?.name || 'N/A'}</h3>
              <p className="text-sm text-gray-500">{req.studentId?.email || 'N/A'}</p>
             
              <p className="text-sm text-gray-500">{req.studentId?.mobileNumber || 'N/A'}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                req.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : req.status === 'declined'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {req.status}
            </span>
          </div>
          <p className="text-sm text-gray-700">
            <strong>Exam Code:</strong> {req.examCode}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Requested on {new Date(req.createdAt).toLocaleDateString()}
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setConfirmModal({ open: true, id: req._id,studentId: req.studentId._id,
    batchName: req.batchName,
    status: 'approved' })}
              disabled={loadingRequestId === req._id || req.status === 'approved'}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loadingRequestId === req._id && confirmModal.status === 'approved' ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiCheck />
              )}
              Approve
            </button>
            <button
              onClick={() => setConfirmModal({ open: true, id: req._id,studentId: req.studentId._id,
    batchName: req.batchName,
    status: 'declined' })}
              disabled={loadingRequestId === req._id || req.status === 'declined'}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loadingRequestId === req._id && confirmModal.status === 'declined' ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiX />
              )}
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Pagination */}
  <div className="flex justify-center items-center gap-4 mt-6">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span className="text-sm font-medium">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>

  {/* Modal */}
  {confirmModal.open && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
        <p className="text-sm mb-6">
          Are you sure you want to <strong>{confirmModal.status}</strong> this request?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmModal({ open: false, id: null, status: '' })}
            className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() =>
  updateStatus(confirmModal.studentId, confirmModal.status, confirmModal.batchName)
}
            className={`px-4 py-2 rounded text-white ${
              confirmModal.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
}
