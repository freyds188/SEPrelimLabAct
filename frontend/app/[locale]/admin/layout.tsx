'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/i18n';
import { Menu } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { AdminHeaderProvider } from '@/components/admin/header-context'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminTopbar } from '@/components/admin/topbar'

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
  const pathname = usePathname();
  const isLoginRoute = /\/admin\/login$/.test(pathname || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && mounted && !isLoginRoute) {
      checkAdminAuth();
    } else if (isLoginRoute) {
      setLoading(false);
    }
  }, [mounted, isLoginRoute]);

  const checkAdminAuth = async () => {
    console.log('Checking admin auth...');
    const adminToken = localStorage.getItem('admin_token');
    const storedAdminUser = localStorage.getItem('admin_user');

    console.log('Admin token exists:', !!adminToken);
    console.log('Admin user exists:', !!storedAdminUser);

    if (!adminToken || !storedAdminUser) {
      const locale = getLocaleFromPathname(pathname || '/en');
      router.replace(`/${locale}/admin/login`);
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
        setAdminUser(data.data?.user || data.data);
        // Set lightweight cookie so middleware can gate client navigations
        document.cookie = `cw_admin=1; path=/; SameSite=Lax`;
        fetchDashboardStats(adminToken);
      } else {
        // Token invalid, redirect to login
        console.log('Token invalid, redirecting to login...');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        document.cookie = 'cw_admin=; Max-Age=0; path=/';
        const locale = getLocaleFromPathname(pathname || '/en');
        router.replace(`/${locale}/admin/login`);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, still try to load dashboard stats with stored token
      fetchDashboardStats(adminToken || '');
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
    document.cookie = 'cw_admin=; Max-Age=0; path=/';
    const locale = getLocaleFromPathname(pathname || '/en');
    router.push(`/${locale}/admin/login`);
  };

  // legacy navigation removed in favor of AdminSidebar

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="mt-4 text-gray-600">Initializing...</div>
      </div>
    );
  }

  // If on login route, render children without admin chrome
  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Toaster />
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
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Sidebar">
        <AdminSidebar
          adminUser={adminUser}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <AdminHeaderProvider>
          <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="pt-0 pb-8">
            <div className="px-4 sm:px-6 lg:px-10">
              {children}
            </div>
          </main>
        </AdminHeaderProvider>
      </div>
      <Toaster />
    </div>
  );
}
