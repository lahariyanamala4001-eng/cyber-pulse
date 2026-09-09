import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) return <Image size={16} color="#3b82f6" />;
  if (file.type === 'application/pdf') return <FileText size={16} color="#ef4444" />;
  return <File size={16} color="#64748b" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({
  files,
  onChange,
  maxFiles = 10,
  accept = 'image/*,application/pdf,.doc,.docx,.txt',
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    const combined = [...files, ...arr].slice(0, maxFiles);
    onChange(combined);
  };

  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload evidence files"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      >
        <Upload size={28} color="#94a3b8" className="mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Drop files here or click to upload</p>
        <p className="text-xs text-slate-400 mt-1">
          Supports: Images, PDFs, Documents (max {maxFiles} files)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          aria-hidden="true"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
            >
              <div className="flex-shrink-0">{getFileIcon(file)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <p className="text-xs text-slate-400 mt-2">
            {files.length} file(s) selected · Your evidence will be securely associated with your complaint.
          </p>
        </div>
      )}
    </div>
  );
}
