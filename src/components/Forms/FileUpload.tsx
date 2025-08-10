import React, { useState } from 'react';
import { Upload, FileText, Check, X } from 'lucide-react';

interface Document {
  name: string;
  label: string;
  required: boolean;
  accepted_types: string[];
  max_size_mb: number;
  description?: string;
}

interface FileUploadProps {
  title: string;
  description?: string;
  documents: Document[];
  onUploadComplete: (uploadedDocuments: any[]) => void;
}

interface UploadedFile {
  file: File;
  documentType: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  description,
  documents,
  onUploadComplete
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleFileSelect = async (file: File, documentType: string) => {
    // Validate file size
    const maxSizeMB = documents.find(d => d.name === documentType)?.max_size_mb || 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = documents.find(d => d.name === documentType)?.accepted_types || [];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension && !acceptedTypes.includes(fileExtension)) {
      alert(`File type must be one of: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Add to uploaded files with uploading status
    const newUploadedFile: UploadedFile = {
      file,
      documentType,
      status: 'uploading',
      progress: 0
    };

    setUploadedFiles(prev => [...prev, newUploadedFile]);

    // Simulate upload progress
    const uploadProgress = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(uf => 
          uf.file === file ? 
            { ...uf, progress: Math.min(uf.progress + 20, 100) } : 
            uf
        )
      );
    }, 200);

    // Complete upload after progress reaches 100%
    setTimeout(() => {
      clearInterval(uploadProgress);
      setUploadedFiles(prev => 
        prev.map(uf => 
          uf.file === file ? 
            { ...uf, status: 'completed', progress: 100 } : 
            uf
        )
      );
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent, documentType: string) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0], documentType);
    }
  };

  const handleSubmit = () => {
    const completedUploads = uploadedFiles.filter(uf => uf.status === 'completed');
    
    const uploadedDocuments = completedUploads.map(uf => ({
      type: uf.documentType,
      name: uf.file.name,
      size: uf.file.size,
      path: `uploads/${uf.documentType}/${uf.file.name}`, // Mock path
      uploaded_at: new Date().toISOString()
    }));

    onUploadComplete(uploadedDocuments);
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(uf => uf.file !== fileToRemove));
  };

  const allRequiredUploaded = documents.filter(d => d.required).every(doc => 
    uploadedFiles.some(uf => uf.documentType === doc.name && uf.status === 'completed')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
        )}
      </div>

      {/* Upload Areas */}
      <div className="space-y-4">
        {documents.map((document) => {
          const uploadedFile = uploadedFiles.find(uf => uf.documentType === document.name);
          const isUploaded = uploadedFile?.status === 'completed';

          return (
            <div
              key={document.name}
              className={`border-2 border-dashed rounded-lg p-4 transition-colors duration-200 ${
                dragOver === document.name
                  ? 'border-blue-400 bg-blue-50'
                  : isUploaded
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(document.name);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, document.name)}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${
                  isUploaded ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isUploaded ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-gray-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{document.label}</h4>
                    {document.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  
                  {document.description && (
                    <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1">
                    Accepted: {document.accepted_types.join(', ')} • Max size: {document.max_size_mb}MB
                  </div>

                  {/* Upload Progress */}
                  {uploadedFile && uploadedFile.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Uploading... {uploadedFile.progress}%
                      </p>
                    </div>
                  )}

                  {/* Uploaded File Info */}
                  {isUploaded && (
                    <div className="mt-2 flex items-center justify-between bg-green-100 rounded-lg p-2">
                      <span className="text-sm text-green-800">
                        ✓ {uploadedFile?.file.name}
                      </span>
                      <button
                        onClick={() => uploadedFile && removeFile(uploadedFile.file)}
                        className="text-green-600 hover:text-green-800"
                        title="Remove file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                {!isUploaded && (
                  <div>
                    <input
                      type="file"
                      accept={document.accepted_types.map(type => `.${type}`).join(',')}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(file, document.name);
                        }
                      }}
                      className="hidden"
                      id={`file-${document.name}`}
                    />
                    <label
                      htmlFor={`file-${document.name}`}
                      className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {uploadedFiles.length > 0 && (
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!allRequiredUploaded}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              allRequiredUploaded
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {allRequiredUploaded 
              ? `Submit Documents (${uploadedFiles.filter(uf => uf.status === 'completed').length} uploaded)`
              : 'Upload required documents to continue'
            }
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
        💡 <strong>Tip:</strong> Take clear photos of your documents or scan them for best results. 
        Make sure all text is readable and the entire document is visible.
      </div>
    </div>
  );
};

export default FileUpload;