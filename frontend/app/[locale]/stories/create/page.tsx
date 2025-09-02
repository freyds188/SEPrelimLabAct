'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getTranslations, type Locale } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Image as ImageIcon,
  Tag,
  Globe,
  Calendar,
  BookOpen,
  Plus,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiService } from '../../../../lib/api';

interface StoryForm {
  title: string;
  type: 'photo_essay' | 'oral_history' | 'timeline' | 'map';
  content: string;
  blocks: any[];
  featured_image: string;
  images: string[];
  status: 'draft' | 'published';
  is_featured: boolean;
  tags: string[];
  language_tags: string[];
  scheduled_at: string;
}



interface LocaleCreateStoryPageProps {
  params: {
    locale: Locale;
  };
}

export default function LocaleCreateStoryPage({ params }: LocaleCreateStoryPageProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const [form, setForm] = useState<StoryForm>({
    title: '',
    type: 'photo_essay',
    content: '',
    blocks: [],
    featured_image: '',
    images: [],
    status: 'draft',
    is_featured: false,
    tags: [],
    language_tags: [],
    scheduled_at: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You need to log in to create stories');
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated]);



  const handleInputChange = (field: keyof StoryForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !form.language_tags.includes(newLanguage.trim())) {
      setForm(prev => ({ ...prev, language_tags: [...prev.language_tags, newLanguage.trim()] }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setForm(prev => ({ ...prev, language_tags: prev.language_tags.filter(lang => lang !== languageToRemove) }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isFeatured: boolean = false) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', files[0]);

      const result = await apiService.uploadMedia(formData);
      
      if (result.success) {
        console.log('Full result:', result);
        console.log('Result data:', result.data);
        const imageUrl = result.data.url || result.data.path;
        console.log('Upload successful, imageUrl:', imageUrl);
        console.log('Current form.featured_image:', form.featured_image);
        
        if (isFeatured || !form.featured_image) {
          setForm(prev => {
            console.log('Setting featured_image to:', imageUrl);
            return { ...prev, featured_image: imageUrl };
          });
        } else {
          setForm(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
        }
        
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = (inputId: string) => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!form.content.trim()) {
      toast.error('Content is required');
      return;
    }

    // Weaver is now optional, so we don't need to validate it

    setSaving(true);
    try {
      const storyData = {
        ...form,
        status: publish ? 'published' : form.status,
      };

      const result = await apiService.request('/stories', {
        method: 'POST',
        body: JSON.stringify(storyData),
      });
      
      if (result.success) {
        toast.success(publish ? 'Story published successfully!' : 'Story saved as draft!');
        router.push(`/stories/${result.data.slug}`);
      } else {
        toast.error(result.message || 'Failed to save story');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save story');
    } finally {
      setSaving(false);
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/stories">
            <Button variant="outline" className="flex items-center gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              {params.locale === 'fil' ? 'Bumalik sa Mga Kwento' : 'Back to Stories'}
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {params.locale === 'fil' ? 'Gumawa ng Bagong Kwento' : 'Create New Story'}
              </h1>
              <p className="text-gray-600 mt-2">
                {params.locale === 'fil'
                  ? 'Ibahagi ang kwento ng tradisyon at kultura ng paghahabi.'
                  : 'Share the story of weaving tradition and culture.'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {previewMode 
                  ? (params.locale === 'fil' ? 'Edit' : 'Edit')
                  : (params.locale === 'fil' ? 'Preview' : 'Preview')
                }
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {params.locale === 'fil' ? 'Pamagat ng Kwento' : 'Story Title'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder={params.locale === 'fil' ? 'Ilagay ang pamagat ng kwento...' : 'Enter story title...'}
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="text-lg"
                />
              </CardContent>
            </Card>

            {/* Story Type */}
            <Card>
              <CardHeader>
                <CardTitle>{params.locale === 'fil' ? 'Uri ng Kwento' : 'Story Type'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={form.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo_essay">Photo Essay</SelectItem>
                    <SelectItem value="oral_history">Oral History</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="map">Map</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  {params.locale === 'fil'
                    ? 'Piliin ang uri ng kwento na pinakaangkop sa iyong nilalaman.'
                    : 'Choose the story type that best fits your content.'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>{params.locale === 'fil' ? 'Nilalaman' : 'Content'}</CardTitle>
                <CardDescription>
                  {params.locale === 'fil'
                    ? 'Isulat ang kwento gamit ang Markdown format.'
                    : 'Write your story using Markdown format.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="prose prose-lg max-w-none border rounded-md p-4 bg-gray-50">
                    <div dangerouslySetInnerHTML={{ __html: form.content }} />
                  </div>
                ) : (
                  <Textarea
                    placeholder={params.locale === 'fil' 
                      ? 'Simulan ang pagsulat ng iyong kwento...' 
                      : 'Start writing your story...'
                    }
                    value={form.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="min-h-[400px] font-mono"
                  />
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  {params.locale === 'fil' ? 'Mga Larawan' : 'Images'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Featured Image */}
                <div>
                  <Label>{params.locale === 'fil' ? 'Featured Image' : 'Featured Image'}</Label>
                  <div className="mt-2">
                    {form.featured_image ? (
                      <div className="relative">
                        <img
                          src={form.featured_image}
                          alt="Featured"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleInputChange('featured_image', '')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                                             <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                         <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => handleImageUpload(e, true)}
                           className="hidden"
                           id="featured-image"
                         />
                         <Button 
                           variant="outline" 
                           disabled={loading}
                           onClick={() => triggerFileInput('featured-image')}
                         >
                           {loading ? 'Uploading...' : 'Upload Featured Image'}
                         </Button>
                       </div>
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <Label>{params.locale === 'fil' ? 'Mga Karagdagang Larawan' : 'Additional Images'}</Label>
                                     <div className="mt-2">
                     <input
                       type="file"
                       accept="image/*"
                       onChange={(e) => handleImageUpload(e, false)}
                       className="hidden"
                       id="additional-images"
                     />
                     <Button 
                       variant="outline" 
                       disabled={loading}
                       onClick={() => triggerFileInput('additional-images')}
                     >
                       <Plus className="w-4 h-4 mr-2" />
                       {loading ? 'Uploading...' : 'Add Image'}
                     </Button>
                   </div>
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {form.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => handleInputChange('images', form.images.filter((_, i) => i !== index))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  {params.locale === 'fil' ? 'Mga Tag' : 'Tags'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={params.locale === 'fil' ? 'Magdagdag ng tag...' : 'Add tag...'}
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {params.locale === 'fil' ? 'Mga Wika' : 'Languages'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'fil', name: 'Filipino' },
                    { code: 'ceb', name: 'Cebuano' },
                    { code: 'ilo', name: 'Ilocano' },
                    { code: 'war', name: 'Waray' },
                    { code: 'hil', name: 'Hiligaynon' },
                    { code: 'bik', name: 'Bikol' },
                    { code: 'pam', name: 'Kapampangan' },
                  ].map((lang) => (
                    <div key={lang.code} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`lang-${lang.code}`}
                        checked={form.language_tags.includes(lang.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm(prev => ({ 
                              ...prev, 
                              language_tags: [...prev.language_tags, lang.code] 
                            }));
                          } else {
                            setForm(prev => ({ 
                              ...prev, 
                              language_tags: prev.language_tags.filter(l => l !== lang.code) 
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`lang-${lang.code}`} className="text-sm cursor-pointer">
                        {lang.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.language_tags.map((lang, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {lang === 'en' ? 'English' : 
                       lang === 'fil' ? 'Filipino' : 
                       lang === 'ceb' ? 'Cebuano' : 
                       lang === 'ilo' ? 'Ilocano' : 
                       lang === 'war' ? 'Waray' : 
                       lang === 'hil' ? 'Hiligaynon' : 
                       lang === 'bik' ? 'Bikol' : 
                       lang === 'pam' ? 'Kapampangan' : lang}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveLanguage(lang)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{params.locale === 'fil' ? 'Mga Setting' : 'Settings'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{params.locale === 'fil' ? 'Featured Story' : 'Featured Story'}</Label>
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  />
                </div>
                
                <div>
                  <Label>{params.locale === 'fil' ? 'Status' : 'Status'}</Label>
                  <Select value={form.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{params.locale === 'fil' ? 'Draft' : 'Draft'}</SelectItem>
                      <SelectItem value="published">{params.locale === 'fil' ? 'Published' : 'Published'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{params.locale === 'fil' ? 'Schedule Publish' : 'Schedule Publish'}</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="w-full"
                variant="outline"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : (params.locale === 'fil' ? 'I-save bilang Draft' : 'Save as Draft')}
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Publishing...' : (params.locale === 'fil' ? 'I-publish' : 'Publish')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


