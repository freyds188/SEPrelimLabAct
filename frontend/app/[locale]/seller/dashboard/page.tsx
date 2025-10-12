"use client"

import SellerLayout from '@/components/seller/SellerLayout'
import SellerRouteGuard from '@/components/seller/SellerRouteGuard'

export default function SellerDashboard() {
  return (
    <SellerRouteGuard>
      <SellerLayout>
        <div className="space-y-6">
          {/* Welcome section */}
          <div className="bg-gradient-to-r from-brand-50 to-accent-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-600">Here's what's happening with your store today.</p>
              </div>
              <a
                href="/seller/products/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700"
              >
                Add New Product
              </a>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-gray-900">0</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Products</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-gray-900">0</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-gray-900">0</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-gray-900">₱0</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="/seller/products/create"
                className="relative group bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="mt-8">
                  <h3 className="text-lg font-medium">Add New Product</h3>
                  <p className="mt-2 text-sm text-gray-500">Create and submit a new product for approval</p>
                </div>
              </a>
              <a
                href="/seller/products"
                className="relative group bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="mt-8">
                  <h3 className="text-lg font-medium">Manage Products</h3>
                  <p className="mt-2 text-sm text-gray-500">View and edit your existing products</p>
                </div>
              </a>
              <a
                href="/seller/analytics"
                className="relative group bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="mt-8">
                  <h3 className="text-lg font-medium">View Analytics</h3>
                  <p className="mt-2 text-sm text-gray-500">Track your sales and performance</p>
                </div>
              </a>
            </div>
          </div>

          {/* Simple dashboard info */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Dashboard</h3>
              <div className="mt-5">
                <p className="text-sm text-gray-500">Welcome to your seller dashboard! This is a simplified version to test the navigation hiding.</p>
              </div>
            </div>
          </div>
        </div>
      </SellerLayout>
    </SellerRouteGuard>
  )
}