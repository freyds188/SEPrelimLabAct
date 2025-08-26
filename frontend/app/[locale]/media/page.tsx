'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Upload } from 'lucide-react';
import UploadDialog from '../../../components/ui/UploadDialog';
import ImageGallery from '../../../components/ui/ImageGallery';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function MediaPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check authentication after loading is complete
    if (!isLoading && !isAuthenticated) {
      toast.error('You should log in first to access media management');
      router.push('/');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const handleUploadComplete = (mediaIds: number[]) => {
    toast.success(`Successfully uploaded ${mediaIds.length} images!`);
    setSelectedMediaIds(mediaIds);
  };

  const handleMediaSelect = (mediaIds: number[]) => {
    setSelectedMediaIds(mediaIds);
  };

  const handleMediaRemove = (mediaId: number) => {
    setSelectedMediaIds(prev => prev.filter(id => id !== mediaId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Media Management</h1>
        <p className="text-gray-600 mb-6">
          Upload, manage, and optimize images for your traditional Filipino weaving platform.
        </p>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </button>
          
          {selectedMediaIds.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedMediaIds.length} image(s) selected
            </span>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Image Gallery</h2>
          <div className="text-sm text-gray-500">
            Click on images to view in lightbox • Hover for actions
          </div>
        </div>
        
        <ImageGallery
          onMediaSelect={handleMediaSelect}
          onMediaRemove={handleMediaRemove}
          selectable={true}
          maxSelection={10}
        />
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploadComplete={handleUploadComplete}
        collection="demo"
        maxFiles={10}
        maxFileSize={10 * 1024 * 1024} // 10MB
      />
    </div>
  );
}


