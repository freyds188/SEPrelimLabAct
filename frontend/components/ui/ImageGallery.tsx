'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../lib/api';

interface Media {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  path: string;
  size: number;
  alt_text?: string;
  caption?: string;
  metadata?: {
    width?: number;
    height?: number;
  };
  optimized_paths?: {
    thumb?: string;
    card?: string;
    full?: string;
  };
  optimization_status: 'pending' | 'processing' | 'completed' | 'failed';
  exif_data?: any;
  created_at: string;
  updated_at: string;
}

interface ImageGalleryProps {
  mediaIds?: number[];
  collection?: string;
  mediableType?: string;
  mediableId?: number;
  onMediaSelect?: (mediaIds: number[]) => void;
  onMediaRemove?: (mediaId: number) => void;
  selectable?: boolean;
  maxSelection?: number;
}

export default function ImageGallery({
  mediaIds = [],
  collection,
  mediableType,
  mediableId,
  onMediaSelect,
  onMediaRemove,
  selectable = false,
  maxSelection,
}: ImageGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
  const [selectedSize, setSelectedSize] = useState<'thumb' | 'card' | 'full'>('card');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch media data
  useEffect(() => {
    fetchMedia();
  }, [mediaIds, collection, mediableType, mediableId]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      
      if (collection) params.collection = collection;
      if (mediableType) params.mediable_type = mediableType;
      if (mediableId) params.mediable_id = mediableId.toString();
      
      const result = await apiService.getMedia(params);
      setMedia(result.data);
    } catch (error) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (mediaId: number) => {
    if (!selectable) return;
    
    setSelectedMedia(prev => {
      const isSelected = prev.includes(mediaId);
      let newSelection;
      
      if (isSelected) {
        newSelection = prev.filter(id => id !== mediaId);
      } else {
        if (maxSelection && prev.length >= maxSelection) {
          toast.error(`Maximum ${maxSelection} images can be selected`);
          return prev;
        }
        newSelection = [...prev, mediaId];
      }
      
      onMediaSelect?.(newSelection);
      return newSelection;
    });
  };

  const handleMediaRemove = async (mediaId: number) => {
    try {
      await apiService.deleteMedia(mediaId);
      setMedia(prev => prev.filter(m => m.id !== mediaId));
      setSelectedMedia(prev => prev.filter(id => id !== mediaId));
      onMediaRemove?.(mediaId);
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const retryOptimization = async (mediaId: number) => {
    try {
      await apiService.retryOptimization(mediaId);
      toast.success('Optimization queued for retry');
      // Refresh the media list after a short delay
      setTimeout(fetchMedia, 2000);
    } catch (error) {
      toast.error('Failed to retry optimization');
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const getImageUrl = (media: Media, size: 'thumb' | 'card' | 'full' = 'card') => {
    if (media.optimized_paths?.[size]) {
      return `/storage/${media.optimized_paths[size]}`;
    }
    return `/storage/${media.path}`;
  };

  const getOptimizationStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'processing':
        return <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getOptimizationStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Optimized';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-1" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
        <p className="text-gray-500">Upload some images to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Image Size:</span>
        <div className="flex space-x-2">
          {(['thumb', 'card', 'full'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedSize === size
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {media.map((item, index) => (
          <div
            key={item.id}
            className={`group relative bg-white rounded-lg border overflow-hidden transition-all ${
              selectable && selectedMedia.includes(item.id)
                ? 'ring-2 ring-blue-500 border-blue-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Selection Checkbox */}
            {selectable && (
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedMedia.includes(item.id)}
                  onChange={() => handleMediaSelect(item.id)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            )}

            {/* Image */}
            <div className="relative aspect-square">
              <img
                src={getImageUrl(item, selectedSize)}
                alt={item.alt_text || item.original_name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openLightbox(index)}
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openLightbox(index)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                  <a
                    href={getImageUrl(item, 'full')}
                    download={item.original_name}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </a>
                  {onMediaRemove && (
                    <button
                      onClick={() => handleMediaRemove(item.id)}
                      className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.original_name}
                </h4>
                {getOptimizationStatusIcon(item.optimization_status)}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>{getOptimizationStatusText(item.optimization_status)}</span>
              </div>

              {/* Optimization Actions */}
              {item.optimization_status === 'failed' && (
                <button
                  onClick={() => retryOptimization(item.id)}
                  className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Optimization</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={32} />
            </button>
            
            <img
              src={getImageUrl(media[lightboxIndex], 'full')}
              alt={media[lightboxIndex]?.alt_text || media[lightboxIndex]?.original_name}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="text-sm">
                {media[lightboxIndex]?.original_name}
              </p>
              {media[lightboxIndex]?.metadata && (
                <p className="text-xs text-gray-300">
                  {media[lightboxIndex].metadata.width} × {media[lightboxIndex].metadata.height}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
