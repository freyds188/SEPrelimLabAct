'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTranslations, type Locale } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Heart, 
  Share2, 
  User, 
  MapPin, 
  Clock,
  BookOpen,
  Tag,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../lib/auth-context';
import toast from 'react-hot-toast';

interface Story {
  id: number;
  title: string;
  slug: string;
  type: 'photo_essay' | 'oral_history' | 'timeline' | 'map';
  content: string;
  blocks?: any[];
  featured_image?: string;
  images?: string[];
  status: 'draft' | 'published';
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  tags?: string[];
  language_tags?: string[];
  published_at?: string;
  created_at: string;
  weaver?: {
    id: number;
    name: string;
    user?: {
      name: string;
    };
  };
  media?: Array<{
    id: number;
    path: string;
    optimized_paths?: Record<string, string>;
  }>;
}

interface LocaleStoryPageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export default function LocaleStoryPage({ params }: LocaleStoryPageProps) {
  const { isAuthenticated, user } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [params.slug]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/stories/slug/${params.slug}`);
      const result = await response.json();
      
      if (result.success) {
        setStory(result.data);
      } else {
        toast.error('Story not found');
      }
    } catch (error) {
      console.error('Failed to fetch story:', error);
      toast.error('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('You need to log in to like stories');
      return;
    }

    try {
      // TODO: Implement like functionality
      setLiked(!liked);
      toast.success(liked ? 'Removed from likes' : 'Added to likes');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.title,
          text: story?.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleDelete = async () => {
    if (!story) return;
    
    if (!isAuthenticated) {
      toast.error('You need to log in to delete stories');
      return;
    }

    // Check if user owns this story
    if (!user || story.weaver?.user?.name !== user.name) {
      toast.error('You can only delete your own stories');
      return;
    }

    // Check if token exists
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Authentication token expired. Please log in again.');
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }

    const confirmed = window.confirm(
      params.locale === 'fil' 
        ? 'Sigurado ka bang gusto mong tanggalin ang kwentong ito? Hindi na ito maibabalik.'
        : 'Are you sure you want to delete this story? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/v1/stories/${story.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        toast.error('Authentication expired. Please log in again.');
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
        return;
      }

             if (!response.ok) {
         if (response.status === 401) {
           toast.error('Authentication expired. Please log in again.');
           localStorage.removeItem('auth_token');
           window.location.href = '/auth/login';
           return;
         }
         throw new Error(`HTTP error! status: ${response.status}`);
       }

      const result = await response.json();

      if (result.success) {
        toast.success(params.locale === 'fil' ? 'Kwento na-delete na!' : 'Story deleted successfully!');
        // Redirect to stories list
        window.location.href = '/stories';
      } else {
        toast.error(result.message || 'Failed to delete story');
      }
    } catch (error) {
      console.error('Failed to delete story:', error);
      toast.error('Failed to delete story');
    } finally {
      setDeleting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      photo_essay: params.locale === 'fil' ? 'Photo Essay' : 'Photo Essay',
      oral_history: params.locale === 'fil' ? 'Oral History' : 'Oral History',
      timeline: params.locale === 'fil' ? 'Timeline' : 'Timeline',
      map: params.locale === 'fil' ? 'Map' : 'Map',
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getTypeColor = (type: string) => {
    const typeColors = {
      photo_essay: 'bg-blue-100 text-blue-800',
      oral_history: 'bg-green-100 text-green-800',
      timeline: 'bg-purple-100 text-purple-800',
      map: 'bg-orange-100 text-orange-800',
    };
    return typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      params.locale === 'fil' ? 'fil-PH' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const renderBlocks = (blocks: any[]) => {
    if (!blocks || blocks.length === 0) return null;

    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {block.content}
            </p>
          );
        case 'heading':
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              {block.content}
            </h2>
          );
        case 'image':
          return (
            <div key={index} className="my-6">
              <img
                src={block.url}
                alt={block.caption || 'Story image'}
                className="w-full rounded-lg shadow-md"
              />
              {block.caption && (
                <p className="text-sm text-gray-500 mt-2 text-center italic">
                  {block.caption}
                </p>
              )}
            </div>
          );
        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700">
              "{block.content}"
            </blockquote>
          );
        default:
          return null;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {params.locale === 'fil' ? 'Naglo-load ng kwento...' : 'Loading story...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {params.locale === 'fil' ? 'Kwento Hindi Natagpuan' : 'Story Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {params.locale === 'fil'
                ? 'Ang kwento na hinahanap mo ay hindi umiiral o hindi na magagamit.'
                : 'The story you are looking for does not exist or is no longer available.'
              }
            </p>
            <Link href="/stories">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {params.locale === 'fil' ? 'Bumalik sa Mga Kwento' : 'Back to Stories'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/stories">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {params.locale === 'fil' ? 'Bumalik sa Mga Kwento' : 'Back to Stories'}
            </Button>
          </Link>
        </div>

        {/* Story Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {story.is_featured && (
              <Badge className="bg-yellow-500 text-white">
                {params.locale === 'fil' ? 'Featured' : 'Featured'}
              </Badge>
            )}
            <Badge className={getTypeColor(story.type)}>
              {getTypeLabel(story.type)}
            </Badge>
            {story.language_tags && story.language_tags.length > 0 && (
              <Badge variant="outline">
                {story.language_tags.join(', ')}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{story.title}</h1>

          {story.weaver && (
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <User className="w-4 h-4" />
              <span>
                {params.locale === 'fil' ? 'ni' : 'by'} {story.weaver.user?.name || story.weaver.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(story.created_at)}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {story.views_count} {params.locale === 'fil' ? 'views' : 'views'}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {story.likes_count} {params.locale === 'fil' ? 'likes' : 'likes'}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {story.featured_image && (
          <div className="mb-8">
            <img
              src={story.featured_image}
              alt={story.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Story Content */}
        <div className="prose prose-lg max-w-none mb-8">
          {story.blocks && story.blocks.length > 0 ? (
            renderBlocks(story.blocks)
          ) : (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {story.content}
            </div>
          )}
        </div>

        {/* Story Images */}
        {story.images && story.images.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {params.locale === 'fil' ? 'Mga Larawan' : 'Images'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${story.title} ${index + 1}`}
                  className="w-full rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {params.locale === 'fil' ? 'Mga Tag' : 'Tags'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-8 border-t border-gray-200">
          <Button
            onClick={handleLike}
            variant={liked ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {liked 
              ? (params.locale === 'fil' ? 'Liked' : 'Liked')
              : (params.locale === 'fil' ? 'Like' : 'Like')
            }
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {params.locale === 'fil' ? 'Ibahagi' : 'Share'}
          </Button>
          
          {/* Delete Button - Only show for story owner */}
          {isAuthenticated && user && story.weaver?.user?.name === user.name && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex items-center gap-2 ml-auto"
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4" />
              {deleting 
                ? (params.locale === 'fil' ? 'Tinatanggal...' : 'Deleting...')
                : (params.locale === 'fil' ? 'Tanggalin' : 'Delete')
              }
            </Button>
          )}
        </div>

        {/* Related Stories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {params.locale === 'fil' ? 'Mga Katulad na Kwento' : 'Related Stories'}
          </h2>
          <p className="text-gray-600 mb-4">
            {params.locale === 'fil'
              ? 'Tingnan ang iba pang mga kwento mula sa parehong uri o may-akda.'
              : 'Check out other stories from the same type or author.'
            }
          </p>
          {/* TODO: Add related stories component */}
        </div>
      </div>
    </div>
  );
}
















