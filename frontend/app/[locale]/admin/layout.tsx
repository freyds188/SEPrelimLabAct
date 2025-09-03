'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Heart
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && mounted) {
      checkAdminAuth();
    }
  }, [mounted]);

  const checkAdminAuth = async () => {
    console.log('Checking admin auth...');
    const adminToken = localStorage.getItem('admin_token');
    const storedAdminUser = localStorage.getItem('admin_user');

    console.log('Admin token exists:', !!adminToken);
    console.log('Admin user exists:', !!storedAdminUser);

    if (!adminToken || !storedAdminUser) {
      console.log('No admin credentials found, but continuing to show admin layout...');
      // For now, don't redirect - just set loading to false
      setLoading(false);
      return;
    }

    try {
      // Set admin user from stored data first
      setAdminUser(JSON.parse(storedAdminUser));
      
      // Verify token is still valid
      const response = await fetch('/api/v1/admin/auth/me', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Admin user data:', data);
        setAdminUser(data.data);
        fetchDashboardStats(adminToken);
      } else {
        // Token invalid, redirect to login
        console.log('Token invalid, redirecting to login...');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/en/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, still try to load dashboard stats with stored token
      fetchDashboardStats(adminToken);
    }
  };

  const fetchDashboardStats = async (token: string) => {
    try {
      const response = await fetch('/api/v1/admin/dashboard/metrics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/en/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/en/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/en/admin/users', icon: Users },
    { name: 'Products', href: '/en/admin/products', icon: Package },
    { name: 'Content', href: '/en/admin/content', icon: FileText },
    { name: 'Financial', href: '/en/admin/financial', icon: BarChart3 },
    { name: 'Settings', href: '/en/admin/settings', icon: Settings },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="mt-4 text-gray-600">Initializing...</div>
      </div>
    );
  }

  // For now, show loading if still checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="mt-4 text-gray-600">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <nav className="flex-1 px-3 py-6">
            <div className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminUser?.email || 'admin@cordiweave.ph'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm border-b border-gray-200 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            CordiWeave Admin Dashboard
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
