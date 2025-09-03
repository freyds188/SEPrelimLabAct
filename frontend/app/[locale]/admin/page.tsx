'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  FileText, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Heart,
  BarChart3,
  Activity
} from 'lucide-react';

interface DashboardStats {
  users: {
    total_users: number;
    active_users_30_days: number;
    new_users_last_30_days: number;
    user_growth_rate: number;
  };
  products: {
    total_products: number;
    active_products: number;
    products_in_stock: number;
    out_of_stock_products: number;
    stock_availability_rate: number;
  };
  stories: {
    total_stories: number;
    published_stories: number;
    pending_moderation: number;
    publication_rate: number;
  };
  campaigns: {
    total_campaigns: number;
    active_campaigns: number;
    pending_moderation: number;
    activation_rate: number;
  };
  orders: {
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    total_revenue: number;
    completion_rate: number;
  };
  donations: {
    total_donations: number;
    completed_donations: number;
    total_donation_amount: number;
  };
  weavers: {
    total_weavers: number;
    active_weavers: number;
    verified_weavers: number;
    verification_rate: number;
  };
  system_health: {
    database_size_mb: number;
    cache_status: string;
    last_metrics_update: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have admin credentials before fetching
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      fetchDashboardStats();
    } else {
      // No token, show message instead of loading
      setLoading(false);
      setError('Please log in to view dashboard data');
    }
  }, []);



  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('admin_token');
      console.log('Fetching dashboard stats with token:', !!adminToken);
      
      const response = await fetch('/api/v1/admin/dashboard/metrics', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Dashboard API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received:', data);
        setStats(data.data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Dashboard API error:', errorData);
        setError(`Failed to fetch dashboard data: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(`Failed to fetch dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardStats();
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug: Log the actual structure of stats
  console.log('Stats structure:', stats);
  console.log('Stats keys:', Object.keys(stats || {}));
  
  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-yellow-800">No dashboard data available</span>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardStats();
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Check if we have the expected data structure
  const hasExpectedData = stats.users && stats.products && stats.financial;
  
  if (!hasExpectedData) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-blue-800">
              Dashboard data structure has changed. Received: {JSON.stringify(Object.keys(stats))}
            </span>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardStats();
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
        <div className="mt-2 text-sm text-blue-600">
          <p>Current data structure doesn't match expected format.</p>
          <p>Please check the API response format in the browser console.</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle, 
    trend 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-3">
              <TrendingUp 
                className={`h-4 w-4 mr-1 ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`} 
              />
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    href, 
    color 
  }: {
    title: string;
    description: string;
    icon: any;
    href: string;
    color: string;
  }) => (
    <a 
      href={href}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-1"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4 shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </a>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your admin dashboard. Here's what's happening with your platform.
        </p>
      </div>

             {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard
           title="Total Users"
           value={stats.users?.total_users?.toLocaleString() || '0'}
           icon={Users}
           color="bg-blue-500"
           subtitle={`${stats.users?.active_users_30_days || 0} active this month`}
           trend={{ 
             value: stats.users?.user_growth_rate || 0, 
             isPositive: (stats.users?.user_growth_rate || 0) > 0 
           }}
         />
         
         <StatCard
           title="Total Products"
           value={stats.products?.total_products?.toLocaleString() || '0'}
           icon={Package}
           color="bg-green-500"
           subtitle={`${stats.products?.products_in_stock || 0} in stock`}
         />
         
         <StatCard
           title="Total Orders"
           value={stats.financial?.total_orders?.toLocaleString() || '0'}
           icon={ShoppingCart}
           color="bg-purple-500"
           subtitle={`${stats.financial?.pending_orders || 0} pending`}
           trend={{ 
             value: stats.financial?.completion_rate || 0, 
             isPositive: (stats.financial?.completion_rate || 0) > 80 
           }}
         />
         
         <StatCard
           title="Total Revenue"
           value={`₱${stats.financial?.total_revenue?.toLocaleString() || '0'}`}
           icon={DollarSign}
           color="bg-yellow-500"
           subtitle={`${stats.financial?.completed_orders || 0} completed orders`}
         />
       </div>

      {/* Content and Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h3>
          <div className="space-y-4">
                         <div className="flex items-center justify-between">
               <div className="flex items-center">
                 <FileText className="h-5 w-5 text-blue-500 mr-3" />
                 <span className="text-gray-700">Stories</span>
               </div>
               <div className="text-right">
                 <p className="font-semibold text-gray-900">{stats.content?.total_stories || 0}</p>
                 <p className="text-sm text-gray-500">
                   {stats.content?.published_stories || 0} published
                 </p>
               </div>
             </div>
             
             <div className="flex items-center justify-between">
               <div className="flex items-center">
                 <Heart className="h-5 w-5 text-red-500 mr-3" />
                 <span className="text-gray-700">Campaigns</span>
               </div>
               <div className="text-right">
                 <p className="font-semibold text-gray-900">{stats.content?.total_campaigns || 0}</p>
                 <p className="text-sm text-gray-500">
                   {stats.content?.active_campaigns || 0} active
                 </p>
               </div>
             </div>
             
             <div className="flex items-center justify-between">
               <div className="flex items-center">
                 <Users className="h-5 w-5 text-green-500 mr-3" />
                 <span className="text-gray-700">Weavers</span>
               </div>
               <div className="text-right">
                 <p className="font-semibold text-gray-900">{stats.performance?.total_weavers || 0}</p>
                 <p className="text-sm text-gray-500">
                   {stats.performance?.active_weavers || 0} active
                 </p>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
          <div className="space-y-4">
                         <div className="flex items-center justify-between">
               <span className="text-gray-700">Total Revenue</span>
               <span className="font-semibold text-green-600">
                 ₱{stats.financial?.total_revenue?.toLocaleString() || '0'}
               </span>
             </div>
             
             <div className="flex items-center justify-between">
               <span className="text-gray-700">Total Donations</span>
               <span className="font-semibold text-blue-600">
                 ₱{stats.financial?.total_donations?.toLocaleString() || '0'}
               </span>
             </div>
             
             <div className="flex items-center justify-between">
               <span className="text-gray-700">Order Completion Rate</span>
               <span className="font-semibold text-purple-600">
                 {stats.financial?.completion_rate || 0}%
               </span>
             </div>
             
             <div className="flex items-center justify-between">
               <span className="text-gray-700">Stock Availability</span>
               <span className="font-semibold text-orange-600">
                 {stats.products?.active_rate || 0}%
               </span>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Review Content"
            description="Moderate pending stories and campaigns"
            icon={FileText}
            href="/en/admin/content"
            color="bg-blue-500"
          />
          
          <QuickActionCard
            title="Manage Users"
            description="View and manage user accounts"
            icon={Users}
            href="/en/admin/users"
            color="bg-green-500"
          />
          
          <QuickActionCard
            title="Product Management"
            description="Manage products and inventory"
            icon={Package}
            href="/en/admin/products"
            color="bg-purple-500"
          />
          
          <QuickActionCard
            title="Financial Reports"
            description="View financial analytics and reports"
            icon={BarChart3}
            href="/en/admin/financial"
            color="bg-yellow-500"
          />
          
          <QuickActionCard
            title="System Settings"
            description="Monitor system performance"
            icon={Activity}
            href="/en/admin/settings"
            color="bg-red-500"
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                           <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.performance?.total_weavers || 0}
              </div>
              <div className="text-sm text-gray-500">Total Weavers</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.performance?.weaver_activity_rate || 0}%
              </div>
              <div className="text-sm text-gray-500">Active Weavers</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.performance?.products_per_weaver || 0}
              </div>
              <div className="text-sm text-gray-500">Products/Weaver</div>
            </div>
        </div>
      </div>
    </div>
  );
}

