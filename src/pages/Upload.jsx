import { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, CheckCircle, AlertCircle } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="glass p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3">Upload Document</h2>
          <p className="text-slate-400">Select a PDF or document to store in your cloud.</p>
        </div>

        <div className="relative group">
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading}
          />
          <div className={`
            border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
            ${file ? 'border-primary bg-primary/5' : 'border-slate-700 group-hover:border-slate-500'}
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}>
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <UploadIcon size={32} className={file ? 'text-primary' : 'text-slate-400'} />
            </div>
            {file ? (
              <div>
                <p className="text-xl font-bold text-white mb-1 truncate max-w-xs mx-auto">{file.name}</p>
                <p className="text-slate-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold mb-1">Click to select file</p>
                <p className="text-slate-500 text-sm">PDF, DOCX up to 100MB</p>
              </div>
            )}
          </div>
          {file && !uploading && (
            <button 
              onClick={() => setFile(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 transition-colors z-20"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {uploading && (
          <div className="mt-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>{progress === 100 ? 'Processing...' : 'Uploading...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`
            w-full mt-10 py-4 rounded-xl font-black text-lg transition-all duration-200
            ${!file || uploading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-hover text-white shadow-xl shadow-primary/20 active:scale-[0.98]'}
          `}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
              Uploading...
            </span>
          ) : 'Start Upload'}
        </button>
        
        {progress === 100 && !error && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-500 animate-bounce">
            <CheckCircle size={20} />
            <p className="font-bold">Successfully Uploaded!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
