"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTranslations, type Locale } from '@/lib/i18n';
import { Search, Filter, Calendar, Eye, Heart, BookOpen, Sparkles, Users, Star, PenTool } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-accent-50 via-white to-brand-50 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fef3c7%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-16 left-12 w-20 h-20 bg-gradient-to-br from-accent-200 to-brand-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-16 right-12 w-28 h-28 bg-gradient-to-br from-brand-200 to-accent-200 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-100 to-brand-100 border border-accent-200 rounded-full px-6 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-accent-600" />
              <Badge variant="secondary" className="bg-transparent border-0 text-accent-700 font-medium">
                {params.locale === 'fil' ? 'Mga Kwento ng Artisan' : 'Artisan Stories'}
              </Badge>
            </div>
            <h1 className="h1 text-balance mb-6 bg-gradient-to-r from-accent-600 via-accent-700 to-brand-600 bg-clip-text text-transparent">
              {params.locale === 'fil' ? 'Mga Kwento ng Aming Mga Manghahabi' : 'Stories of Our Weavers'}
            </h1>
            <p className="body text-balance max-w-3xl mx-auto text-neutral-700 leading-relaxed">
              {params.locale === 'fil'
                ? 'Kilalanin ang mga tao sa likod ng aming magagandang kamay na ginawang tela at kanilang mga kwento ng tradisyon at kultura.'
                : 'Meet the people behind our beautiful handwoven textiles and their stories of tradition and culture.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Filters */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-100 to-accent-100 rounded-lg px-4 py-2 mb-4">
              <Filter className="w-5 h-5 text-brand-600" />
              <span className="text-brand-700 font-medium text-sm">
                {params.locale === 'fil' ? 'Mga Filter' : 'Filters'}
              </span>
            </div>
            <h2 className="h3 text-balance text-neutral-800 mb-2">
              {params.locale === 'fil' ? 'Hanapin ang Iyong Kwento' : 'Find Your Story'}
            </h2>
            <p className="body-sm text-neutral-600">
              {params.locale === 'fil'
                ? 'Gamitin ang mga filter sa ibaba upang mahanap ang mga kwento na gusto mo.'
                : 'Use the filters below to find the stories you love.'
              }
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors duration-300" />
                  <Input
                    placeholder={params.locale === 'fil' ? 'Maghanap ng mga kwento...' : 'Search stories...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-brand-100 focus:border-brand-400 transition-all duration-300 text-lg placeholder-neutral-400"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-brand-100 focus:border-brand-400 transition-all duration-300">
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
                <SelectTrigger className="w-full sm:w-48 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-brand-100 focus:border-brand-400 transition-all duration-300">
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
        </div>

        {/* Enhanced Create Story Button (for authenticated users) */}
        {isAuthenticated && (
          <div className="mb-12 text-center">
            <Link href="/stories/create">
              <Button className="group bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg">
                <PenTool className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                {params.locale === 'fil' ? 'Gumawa ng Kwento' : 'Create Story'}
              </Button>
            </Link>
          </div>
        )}

        {/* Enhanced Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <BookOpen className="w-8 h-8 text-brand-600" />
            </div>
            <p className="text-neutral-600 text-lg">
              {params.locale === 'fil' ? 'Naglo-load ng mga kwento...' : 'Loading stories...'}
            </p>
          </div>
        )}

        {/* Enhanced Stories Grid */}
        {!loading && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link key={story.id} href={`/stories/${story.slug}`} className="block group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-neutral-50 hover:from-neutral-50 hover:to-white">
                  <div className="relative">
                    <img
                      src={story.featured_image || '/placeholder-story.jpg'}
                      alt={story.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {story.is_featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        {params.locale === 'fil' ? 'Featured' : 'Featured'}
                      </Badge>
                    )}
                    <Badge className={`absolute top-3 right-3 border-0 shadow-lg ${getTypeColor(story.type)}`}>
                      {getTypeLabel(story.type)}
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="h4 line-clamp-2 group-hover:text-accent-600 transition-colors duration-300">
                      {story.title}
                    </CardTitle>
                    {story.weaver && (
                      <CardDescription className="body-sm flex items-center gap-2 text-neutral-600">
                        <Users className="w-4 h-4 text-accent-500" />
                        {params.locale === 'fil' ? 'ni' : 'by'} {story.weaver.user?.name || story.weaver.name}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="body-sm text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
                      {story.content.substring(0, 150)}...
                    </p>
                    
                    {/* Enhanced Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors duration-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Enhanced Stats */}
                    <div className="flex items-center justify-between text-sm text-neutral-500 pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1 rounded-full">
                          <Eye className="w-4 h-4 text-brand-500" />
                          <span className="font-medium">{story.views_count}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1 rounded-full">
                          <Heart className="w-4 h-4 text-accent-500" />
                          <span className="font-medium">{story.likes_count}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4 text-neutral-500" />
                        <span className="font-medium">{formatDate(story.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Enhanced Empty State */}
        {!loading && stories.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-neutral-400" />
            </div>
            <h2 className="h2 text-balance mb-4 text-neutral-800">
              {params.locale === 'fil' ? 'Walang Nahanap na Kwento' : 'No Stories Found'}
            </h2>
            <p className="body text-balance max-w-2xl mx-auto text-neutral-600 mb-8">
              {params.locale === 'fil'
                ? 'Walang kwento ang natagpuan sa iyong mga filter. Subukan ang ibang mga termino sa paghahanap.'
                : 'No stories found with your filters. Try different search terms.'
              }
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedLanguage('all');
              }}
              variant="outline"
              className="border-2 border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {params.locale === 'fil' ? 'I-clear ang Lahat ng Filter' : 'Clear All Filters'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
