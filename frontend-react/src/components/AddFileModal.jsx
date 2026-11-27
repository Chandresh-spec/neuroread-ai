import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddFileModal({ isOpen, onClose, onFileAdded }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const resetAndClose = () => {
    clearTimers();
    setDragActive(false);
    setSelectedFile(null);
    setUploading(false);
    setProgress(0);
    setError(null);
    onClose();
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleFileSelected = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt', 'epub', 'md'].includes(ext)) {
      setError('Please upload a PDF, DOCX, TXT, EPUB, or Markdown file.');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile || uploading) return;
    clearTimers();
    setUploading(true);
    setProgress(20);

    const fileToUpload = selectedFile;
    // Simulated smooth upload progress
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            if (onFileAdded) {
              const ext = fileToUpload.name.split('.').pop()?.toLowerCase() || 'pdf';
              onFileAdded({
                id: `upload-${Date.now()}`,
                name: fileToUpload.name,
                title: fileToUpload.name.replace(/\.[^/.]+$/, ''),
                format: ext === 'md' ? 'txt' : ext,
                author: 'Uploaded by you',
                type: 'E-book',
                sizeBytes: fileToUpload.size,
                size:
                  fileToUpload.size >= 1024 * 1024
                    ? `${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB`
                    : `${Math.max(1, Math.round(fileToUpload.size / 1024))} KB`,
              });
            }
            resetAndClose();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-[#E5E5EA] rounded-3xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#64606E] hover:text-[#141416] hover:bg-[#F3F4F6]"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-editorial text-2xl font-bold text-[#141416] tracking-tight mb-1">
          Add Book or Document
        </h3>
        <p className="text-xs text-[#52525B] mb-5">
          Upload your reading materials. S3 cloud storage &amp; accessible reading formats supported.
        </p>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-[#4B3AE8] bg-[#EFEBFD]/50'
              : 'border-[#DCDCE2] hover:border-[#4B3AE8]/60 bg-white'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.docx,.txt,.epub,.md"
            className="hidden"
            onChange={handleChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EFEBFD] flex items-center justify-center text-[#4B3AE8] mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#141416] mb-1">
              Drag &amp; drop your file here, or <span className="text-[#4B3AE8] underline">browse</span>
            </p>
            <p className="text-xs text-[#64606E]">
              Supports PDF, DOCX, TXT, EPUB, Markdown (Up to 50MB)
            </p>
          </label>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {selectedFile && !error && (
          <div className="mt-4 p-3 bg-white border border-[#E5E5EA] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <FileText className="w-5 h-5 text-[#4B3AE8] flex-shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-[#141416] truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-[#64606E]">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#64606E] mb-1">
              <span>Uploading to cloud storage...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#ECECF2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4B3AE8] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-[#52525B] hover:text-[#141416] hover:bg-[#F3F4F6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-5 py-2 rounded-full text-xs font-bold bg-[#3A2AD9] text-white hover:bg-[#3021C2] disabled:opacity-40 transition-all shadow-sm"
          >
            {uploading ? 'Processing...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
}
