"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTranslations, type Locale } from '@/lib/i18n';
import { Search, Filter, Calendar, Eye, Heart, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

interface Story {
  id: number;
  title: string;
  slug: string;
  type: 'photo_essay' | 'oral_history' | 'timeline' | 'map';
  content: string;
  featured_image?: string;
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
}

interface LocaleStoriesPageProps {
  params: {
    locale: Locale;
  };
}

export default function LocaleStoriesPage({ params }: LocaleStoriesPageProps) {
  const t = getTranslations(params.locale);
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  useEffect(() => {
    fetchStories();
  }, [searchTerm, selectedType, selectedLanguage]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedType && selectedType !== 'all') params.append('type', selectedType);
      if (selectedLanguage && selectedLanguage !== 'all') params.append('language', selectedLanguage);
      
      const response = await fetch(`/api/v1/stories?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setStories(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {params.locale === 'fil' ? 'Mga Kwento ng Artisan' : 'Artisan Stories'}
          </Badge>
          <h1 className="h1 text-balance mb-4">
            {params.locale === 'fil' ? 'Mga Kwento ng Aming Mga Manghahabi' : 'Stories of Our Weavers'}
          </h1>
          <p className="body text-balance max-w-2xl mx-auto">
            {params.locale === 'fil'
              ? 'Kilalanin ang mga tao sa likod ng aming magagandang kamay na ginawang tela at kanilang mga kwento ng tradisyon at kultura.'
              : 'Meet the people behind our beautiful handwoven textiles and their stories of tradition and culture.'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={params.locale === 'fil' ? 'Maghanap ng mga kwento...' : 'Search stories...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={params.locale === 'fil' ? 'Lahat ng Uri' : 'All Types'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{params.locale === 'fil' ? 'Lahat ng Uri' : 'All Types'}</SelectItem>
                <SelectItem value="photo_essay">Photo Essay</SelectItem>
                <SelectItem value="oral_history">Oral History</SelectItem>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="map">Map</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={params.locale === 'fil' ? 'Lahat ng Wika' : 'All Languages'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{params.locale === 'fil' ? 'Lahat ng Wika' : 'All Languages'}</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fil">Filipino</SelectItem>
                <SelectItem value="ceb">Cebuano</SelectItem>
                <SelectItem value="ilo">Ilocano</SelectItem>
                <SelectItem value="war">Waray</SelectItem>
                <SelectItem value="hil">Hiligaynon</SelectItem>
                <SelectItem value="bik">Bikol</SelectItem>
                <SelectItem value="pam">Kapampangan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Create Story Button (for authenticated users) */}
        {isAuthenticated && (
          <div className="mb-8">
            <Link href="/stories/create">
              <Button className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {params.locale === 'fil' ? 'Gumawa ng Kwento' : 'Create Story'}
              </Button>
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {params.locale === 'fil' ? 'Naglo-load ng mga kwento...' : 'Loading stories...'}
            </p>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link key={story.id} href={`/stories/${story.slug}`} className="block">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img
                      src={story.featured_image || '/placeholder-story.jpg'}
                      alt={story.title}
                      className="w-full h-48 object-cover"
                    />
                    {story.is_featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                        {params.locale === 'fil' ? 'Featured' : 'Featured'}
                      </Badge>
                    )}
                    <Badge className={`absolute top-2 right-2 ${getTypeColor(story.type)}`}>
                      {getTypeLabel(story.type)}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="h4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {story.title}
                    </CardTitle>
                    {story.weaver && (
                      <CardDescription className="body-sm">
                        {params.locale === 'fil' ? 'ni' : 'by'} {story.weaver.user?.name || story.weaver.name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="body-sm text-muted-foreground line-clamp-3 mb-4">
                      {story.content.substring(0, 150)}...
                    </p>
                    
                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {story.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {story.views_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {story.likes_count}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(story.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && stories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="h2 text-balance mb-4">
              {params.locale === 'fil' ? 'Walang Nahanap na Kwento' : 'No Stories Found'}
            </h2>
            <p className="body text-balance max-w-2xl mx-auto">
              {params.locale === 'fil'
                ? 'Walang kwento ang natagpuan sa iyong mga filter. Subukan ang ibang mga termino sa paghahanap.'
                : 'No stories found with your filters. Try different search terms.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
