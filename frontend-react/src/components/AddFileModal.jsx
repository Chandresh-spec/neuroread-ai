import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddFileModal({ isOpen, onClose, onFileAdded }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

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
  };

  const handleFileSelected = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt', 'epub', 'md'].includes(ext)) {
      setError('Please upload a PDF, TXT, EPUB, or Markdown file.');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(20);

    // Simulated smooth upload progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setUploading(false);
            if (onFileAdded) {
              onFileAdded({
                id: `upload-${Date.now()}`,
                title: selectedFile.name.replace(/\.[^/.]+$/, ''),
                author: 'Uploaded by you',
                type: 'E-book',
                size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
              });
            }
            onClose();
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
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F5] border border-[#E5DFD3] rounded-3xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#6B665F] hover:text-[#141416] hover:bg-[#EAE4D7]"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-editorial text-2xl font-bold text-[#141416] tracking-tight mb-1">
          Add Book or Document
        </h3>
        <p className="text-xs text-[#5E5A54] mb-5">
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
              ? 'border-[#3A2AD9] bg-[#E3DFFA]/40'
              : 'border-[#DED8CB] hover:border-[#3A2AD9]/60 bg-white'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.txt,.epub,.md"
            className="hidden"
            onChange={handleChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E3DFFA] flex items-center justify-center text-[#3A2AD9] mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#141416] mb-1">
              Drag &amp; drop your file here, or <span className="text-[#3A2AD9] underline">browse</span>
            </p>
            <p className="text-xs text-[#6B665F]">
              Supports PDF, TXT, EPUB, Markdown (Up to 50MB)
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
          <div className="mt-4 p-3 bg-white border border-[#E5DFD3] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <FileText className="w-5 h-5 text-[#3A2AD9] flex-shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-[#141416] truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-[#6B665F]">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#6B665F] mb-1">
              <span>Uploading to cloud storage...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#EAE4D7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3A2AD9] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-[#5E5A54] hover:text-[#141416] hover:bg-[#EAE4D7] transition-colors"
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
