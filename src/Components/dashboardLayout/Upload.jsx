'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Save } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminUpload() {
  const [examCode, setExamCode] = useState('');
  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [duration, setDuration] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [questionPdf, setQuestionPdf] = useState(null);
  const [answerPdf, setAnswerPdf] = useState(null);
  const [loading, setLoading] = useState(false);
const [batchName, setbatchName] = useState('');
const [customBatch, setCustomBatch] = useState('');

  // 🧠 Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('examDraft');
    if (draft) {
      const data = JSON.parse(draft);
      setExamCode(data.examCode || '');
      setExamName(data.examName || '');
      setExamDescription(data.examDescription || '');
      setCategory(data.category || '');
      setYear(data.year || '');
      setMonth(data.month || '');
      setDuration(data.duration || '');
      setbatchName(data.batchName || '');
    }
  }, []);

  // 💾 Save draft to localStorage
  const saveDraft = () => {
    const data = { examCode, examName, examDescription, category, year, month, duration,batchName };
    localStorage.setItem('examDraft', JSON.stringify(data));
    toast.success('Draft saved!');
  };

  // 📤 Submit PDFs
 const handleSubmit = async () => {
  if (
    !examCode || !examName || !examDescription ||
    !category || !year || !month || !questionPdf || !answerPdf
  ) {
    return alert('Please fill all fields and upload both PDFs.');
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('examCode', examCode);
    formData.append('examName', examName);
    formData.append('examDescription', examDescription);
    formData.append('category', category === 'Custom' ? customCategory : category);
    formData.append('year', year);
    formData.append('month', month);
    formData.append('duration', duration === 'Custom' ? customDuration : duration);
    formData.append('questionPDF', questionPdf);
    formData.append('answerPDF', answerPdf);
    formData.append('batchName', batchName === 'Custom' ? customBatch : batchName);

 
<<<<<<< HEAD
    await axios.post('https://api-backend-institute.onrender.com/Batch/upload-exam', formData);
=======
    await axios.post('https://api-backend-institute.onrender.com/Batch/upload-exam', formData);
>>>>>>> a5be5d2 (updated code)
//  await axios.post('https://api-backend-institute.onrender.com/api/upload-question-answer-pdf', formData);

    toast.success('Upload successful!');
    window.location.reload();

  } catch (err) {
    console.error(err);
    toast.error('Upload failed.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 sm:p-8 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-6">📤 Admin Exam Upload</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextInput label="Exam Code" value={examCode} setValue={setExamCode} />
        <TextInput label="Exam Name" value={examName} setValue={setExamName} />
        <TextInput label="Description" value={examDescription} setValue={setExamDescription} full />

        <SelectWithCustom
          label="Category"
          value={category}
          setValue={setCategory}
          options={['General Knowledge', 'Civil Engineering']}
          customValue={customCategory}
          setCustomValue={setCustomCategory}
        />

<SelectWithCustom
  label="Batch"
  value={batchName}
  setValue={setbatchName}
  options={['Batch A', 'Batch B', 'Batch C', 'Custom']}
  customValue={customBatch}
  setCustomValue={setCustomBatch}
/>

        <SelectInput label="Year" value={year} setValue={setYear} options={['2023', '2024', '2025', '2026']} />
        <SelectInput
          label="Month"
          value={month}
          setValue={setMonth}
          options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
          displayOptions={[
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
          ]}
        />

        <SelectWithCustom
          label="Duration (mins)"
          value={duration}
          setValue={setDuration}
          options={['0', '30', '60', 'Custom']}
          customValue={customDuration}
          setCustomValue={setCustomDuration}
        />

        <FileDropzone label="Drop or select Question PDF" file={questionPdf} setFile={setQuestionPdf} />
        <FileDropzone label="Drop or select Answer Key PDF" file={answerPdf} setFile={setAnswerPdf} />
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
        >
          <UploadCloud size={16} /> {loading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

// Input components
function TextInput({ label, value, setValue, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}

function SelectInput({ label, value, setValue, options, displayOptions }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option key={opt} value={opt}>
            {displayOptions ? displayOptions[idx] : opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SelectWithCustom({ label, value, setValue, options, customValue, setCustomValue }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {value === 'Custom' && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder={`Enter custom ${label.toLowerCase()}`}
          className="mt-2 w-full border px-3 py-2 rounded"
        />
      )}
    </div>
  );
}

function FileDropzone({ label, file, setFile }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, [setFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer bg-gray-50"
      onClick={() => document.getElementById(label).click()}
    >
      <FileText className="mx-auto mb-2 text-gray-600" size={20} />
      {file ? <span className="text-green-700 font-semibold">{file.name}</span> : <span>{label}</span>}
      <input
        id={label}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => setFile(e.target.files[0])}
      />
    </div>
  );
}
