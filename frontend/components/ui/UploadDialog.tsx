'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
  mediaId?: number;
  uploadedUrl?: string;
  optimizedUrls?: {
    thumb?: string;
    card?: string;
    full?: string;
  };
}

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (mediaIds: number[]) => void;
  collection?: string;
  mediableType?: string;
  mediableId?: number;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
}

export default function UploadDialog({
  isOpen,
  onClose,
  onUploadComplete,
  collection,
  mediableType,
  mediableId,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: UploadDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [preserveExif, setPreserveExif] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { isAuthenticated } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!isAuthenticated) {
      toast.error('You should log in first to upload images');
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    uploadFiles(newFiles);
  }, [isAuthenticated]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize: maxFileSize,
    disabled: isUploading,
  });

  const uploadFiles = async (files: UploadedFile[]) => {
    setIsUploading(true);
    abortControllerRef.current = new AbortController();

    const uploadPromises = files.map((fileData) => uploadSingleFile(fileData));
    
    try {
      await Promise.all(uploadPromises);
      toast.success('All files uploaded successfully!');
      onUploadComplete?.(uploadedFiles.filter(f => f.mediaId).map(f => f.mediaId!));
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Some files failed to upload');
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const uploadSingleFile = async (fileData: UploadedFile): Promise<void> => {
    const formData = new FormData();
    formData.append('image', fileData.file);
    formData.append('collection', collection || '');
    formData.append('preserve_exif', preserveExif.toString());
    
    if (mediableType) {
      formData.append('mediable_type', mediableType);
    }
    if (mediableId) {
      formData.append('mediable_id', mediableId.toString());
    }

    try {
      const result = await apiService.uploadMedia(formData);
      
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileData.id
                          ? {
                ...file,
                status: 'completed' as const,
                progress: 100,
                mediaId: result.data.id,
                optimizedUrls: result.data.optimized_paths,
                uploadedUrl: result.data.url,
              }
            : file
        )
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileData.id
            ? {
                ...file,
                status: 'failed' as const,
                error: error instanceof Error ? error.message : String(error),
              }
            : file
        )
      );
      throw error;
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const retryUpload = (fileId: string) => {
    const file = uploadedFiles.find((f) => f.id === fileId);
    if (file) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'uploading' as const, progress: 0, error: undefined }
            : f
        )
      );
      uploadFiles([file]);
    }
  };

  const handleClose = () => {
    if (isUploading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploadedFiles([]);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Upload Images</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* EXIF Settings */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preserve-exif"
              checked={preserveExif}
              onChange={(e) => setPreserveExif(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="preserve-exif" className="text-sm text-gray-700">
              Preserve EXIF data (camera info, location, etc.)
            </label>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WebP (max {maxFileSize / 1024 / 1024}MB)
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Uploaded Files</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploadedFiles.map((fileData) => (
                  <div
                    key={fileData.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={fileData.status === 'completed' && fileData.uploadedUrl 
                          ? fileData.uploadedUrl 
                          : fileData.preview}
                        alt={fileData.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {fileData.status === 'uploading' && (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          <span className="text-sm text-blue-600">
                            {fileData.progress}%
                          </span>
                        </div>
                      )}
                      {fileData.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Complete</span>
                        </div>
                      )}
                      {fileData.status === 'failed' && (
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600">Failed</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      {fileData.status === 'failed' && (
                        <button
                          onClick={() => retryUpload(fileData.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(fileData.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Messages */}
          {uploadedFiles.some((f) => f.status === 'failed') && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Some files failed to upload:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {uploadedFiles
                  .filter((f) => f.status === 'failed')
                  .map((f) => (
                    <li key={f.id}>
                      {f.file.name}: {f.error}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {uploadedFiles.some((f) => f.status === 'completed') && (
            <button
              onClick={() => {
                onUploadComplete?.(
                  uploadedFiles.filter((f) => f.mediaId).map((f) => f.mediaId!)
                );
                handleClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Use Selected ({uploadedFiles.filter((f) => f.status === 'completed').length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
