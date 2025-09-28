'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  FileText,
  Heart,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast'
import { useAdminHeader } from '@/components/admin/header-context'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

interface ContentItem {
  id: number;
  title: string;
  content: string;
  status: string;
  content_type: 'story' | 'campaign';
  submitted_by: string;
  created_at: string;
  featured_image?: string;
  image?: string;
}

export default function AdminContent() {
  const [stories, setStories] = useState<ContentItem[]>([]);
  const [campaigns, setCampaigns] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stories' | 'campaigns'>('stories');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { setTitle, setSubtitle, setActions } = useAdminHeader();

  useEffect(() => {
    setTitle('Content Management');
    setSubtitle('Moderate stories and campaigns');
    setActions(
      <div className="flex items-center space-x-3">
        <button
          onClick={fetchContent}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </button>
      </div>
    );
    return () => setActions(undefined);
  }, [activeTab]);

  useEffect(() => {
    fetchContent();
  }, [activeTab, searchTerm, statusFilter]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
      });

      if (activeTab === 'stories') {
        const response = await fetch(`${API_BASE_URL}/admin/moderation/stories?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const json = await response.json();
          const payload = json?.data;
          const items = Array.isArray(payload?.data) ? payload.data : (payload || []);
          if ((items || []).length > 0) {
            setStories(items);
          } else {
            // Fallback to public published stories so admin sees what the site shows
            const pubParams = new URLSearchParams({
              per_page: '15',
              ...(searchTerm && { search: searchTerm }),
            });
            const pubRes = await fetch(`${API_BASE_URL}/stories?${pubParams}`);
            if (pubRes.ok) {
              const pubJson = await pubRes.json();
              const pubItems = Array.isArray(pubJson?.data) ? pubJson.data : [];
              const mapped = pubItems.map((s: any) => ({
                id: s.id,
                title: s.title,
                content: s.content,
                status: s.status || (s.is_published ? 'published' : 'draft'),
                content_type: 'story' as const,
                submitted_by: s.weaver?.name || 'CordiWeave',
                created_at: s.created_at,
                featured_image: s.featured_image || s.image_urls?.[0],
              }));
              setStories(mapped);
            } else {
              setStories([]);
            }
          }
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/admin/moderation/campaigns?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const json = await response.json();
          const payload = json?.data;
          const items = Array.isArray(payload?.data) ? payload.data : (payload || []);
          if ((items || []).length > 0) {
            setCampaigns(items);
          } else {
            // Fallback to public active campaigns
            const pubParams = new URLSearchParams({ per_page: '15' });
            const pubRes = await fetch(`${API_BASE_URL}/campaigns?${pubParams}`);
            if (pubRes.ok) {
              const pubJson = await pubRes.json();
              const pubItems = Array.isArray(pubJson?.data) ? pubJson.data : [];
              const mapped = pubItems.map((c: any) => ({
                id: c.id,
                title: c.title,
                content: c.description,
                status: c.status || (c.is_active ? 'active' : 'inactive'),
                content_type: 'campaign' as const,
                submitted_by: c.organizer || 'CordiWeave',
                created_at: c.created_at,
                image: c.image || c.cover_image,
              }));
              setCampaigns(mapped);
            } else {
              setCampaigns([]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (contentId: number, action: string) => {
    try {
    const endpoint = activeTab === 'stories' 
      ? `${API_BASE_URL}/admin/moderation/stories/${contentId}/${action}`
      : `${API_BASE_URL}/admin/moderation/campaigns/${contentId}/${action}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_notes: 'Admin action' }),
      });

      if (response.ok) {
        toast.success(action.charAt(0).toUpperCase() + action.slice(1) + ' successful');
        fetchContent();
      }
    } catch (error) {
      console.error(`Error ${action}ing content:`, error);
      toast.error(`Failed to ${action} content`)
    }
  };

  const handleDelete = async (contentId: number) => {
    if (!confirm('Delete this content? This cannot be undone.')) return;
    try {
      const endpoint = activeTab === 'stories' 
        ? `${API_BASE_URL}/admin/stories/${contentId}`
        : `${API_BASE_URL}/campaigns/${contentId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        toast.success('Content deleted');
        fetchContent();
      } else {
        const err = await response.json().catch(() => ({}));
        // Fallback: admins cannot delete items they don't own. For stories, use moderation reject to remove from site.
        if (activeTab === 'stories' && (response.status === 403 || /only delete/i.test(err?.message || ''))) {
          const rejectRes = await fetch(`${API_BASE_URL}/admin/moderation/stories/${contentId}/reject`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rejection_reason: 'Removed by admin',
              admin_notes: 'Deleted via admin UI',
            }),
          });
          if (rejectRes.ok) {
            toast.success('Story removed (rejected)');
            fetchContent();
            return;
          }
        }
        toast.error(err?.message || 'Failed to delete');
      }
    } catch (e) {
      console.error('Delete failed', e);
      toast.error('Delete failed');
    }
  }

  const handleEdit = async (item: ContentItem) => {
    const newTitle = prompt('Edit title', item.title);
    if (newTitle === null) return;
    const newBody = prompt('Edit content/description', item.content || '');
    if (newBody === null) return;

    try {
      const endpoint = activeTab === 'stories' 
        ? `${API_BASE_URL}/stories/${item.id}`
        : `${API_BASE_URL}/campaigns/${item.id}`;
      const payload = activeTab === 'stories'
        ? { title: newTitle, content: newBody }
        : { title: newTitle, description: newBody };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success('Content updated');
        fetchContent();
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err?.message || 'Failed to update');
      }
    } catch (e) {
      console.error('Update failed', e);
      toast.error('Update failed');
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      draft: { color: 'bg-gray-100 text-gray-800', icon: FileText },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const currentContent = activeTab === 'stories' ? stories : campaigns;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('stories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Campaigns
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.featured_image || item.image ? (
                              <img
                                src={item.featured_image || item.image || ''}
                                alt={item.title}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                {activeTab === 'stories' ? 
                                  <FileText className="h-5 w-5 text-blue-500" /> : 
                                  <Heart className="h-5 w-5 text-red-500" />
                                }
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.submitted_by}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {item.content?.substring(0, 80)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Content"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleContentAction(item.id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                                title="Approve Content"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleContentAction(item.id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                                title="Reject Content"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Content"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
