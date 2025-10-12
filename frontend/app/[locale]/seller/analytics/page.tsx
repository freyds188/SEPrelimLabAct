"use client"

import { useState, useEffect } from 'react'
import SellerLayout from '@/components/seller/SellerLayout'
import SellerRouteGuard from '@/components/seller/SellerRouteGuard'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  ShoppingBag,
  DollarSign,
  Users,
  Calendar,
  Package
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  totalOrders: number
  totalRevenue: number
  conversionRate: number
  averageOrderValue: number
  topProducts: Array<{
    id: number
    name: string
    views: number
    orders: number
    revenue: number
  }>
  monthlyStats: Array<{
    month: string
    views: number
    orders: number
    revenue: number
  }>
  recentActivity: Array<{
    id: number
    type: string
    description: string
    timestamp: string
  }>
}

export default function SellerAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalOrders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    topProducts: [],
    monthlyStats: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockAnalytics: AnalyticsData = {
        totalViews: 1250,
        totalOrders: 47,
        totalRevenue: 89500,
        conversionRate: 3.76,
        averageOrderValue: 1904,
        topProducts: [
          { id: 1, name: 'Traditional Ifugao Basket', views: 245, orders: 12, revenue: 18000 },
          { id: 2, name: 'Kalinga Woven Mat', views: 189, orders: 8, revenue: 12000 },
          { id: 3, name: 'Bontoc Storage Basket', views: 156, orders: 6, revenue: 9000 },
          { id: 4, name: 'Igorot Rattan Fruit Basket', views: 134, orders: 5, revenue: 7500 },
          { id: 5, name: 'Premium Kankanaey Abaca Market Basket', views: 98, orders: 3, revenue: 4500 }
        ],
        monthlyStats: [
          { month: 'Oct', views: 320, orders: 12, revenue: 22800 },
          { month: 'Nov', views: 280, orders: 10, revenue: 19000 },
          { month: 'Dec', views: 350, orders: 15, revenue: 28500 },
          { month: 'Jan', views: 300, orders: 10, revenue: 19200 }
        ],
        recentActivity: [
          { id: 1, type: 'order', description: 'New order from Maria Santos', timestamp: '2024-01-15T10:30:00Z' },
          { id: 2, type: 'view', description: 'Product "Traditional Ifugao Basket" viewed 15 times today', timestamp: '2024-01-15T09:15:00Z' },
          { id: 3, type: 'order', description: 'Order #ORD-2024-002 shipped', timestamp: '2024-01-14T16:45:00Z' },
          { id: 4, type: 'view', description: 'Product "Kalinga Woven Mat" viewed 8 times today', timestamp: '2024-01-14T14:20:00Z' }
        ]
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const MetricCard = ({ title, value, icon: Icon, color, change, changeType }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {changeType === 'increase' ? (
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                    ) : (
                      <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                    )}
                    <span className="sr-only">{changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                    {Math.abs(change)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <SellerLayout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SellerLayout>
    )
  }

  return (
    <SellerRouteGuard>
      <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your store's performance and customer engagement.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Views"
            value={analytics.totalViews.toLocaleString()}
            icon={Eye}
            color="text-blue-500"
            change={12.5}
            changeType="increase"
          />
          <MetricCard
            title="Total Orders"
            value={analytics.totalOrders}
            icon={ShoppingBag}
            color="text-green-500"
            change={8.2}
            changeType="increase"
          />
          <MetricCard
            title="Total Revenue"
            value={`₱${analytics.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="text-green-600"
            change={15.3}
            changeType="increase"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${analytics.conversionRate}%`}
            icon={TrendingUp}
            color="text-purple-500"
            change={2.1}
            changeType="increase"
          />
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Monthly Performance */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Monthly Performance</h3>
            <div className="space-y-4">
              {analytics.monthlyStats.map((stat) => (
                <div key={stat.month} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{stat.month}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{stat.views}</span> views
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{stat.orders}</span> orders
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      ₱{stat.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Performing Products</h3>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-brand-700">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{product.views} views</span>
                        <span>•</span>
                        <span>{product.orders} orders</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₱{product.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Average Order Value</h3>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">₱{analytics.averageOrderValue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Per order</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Conversion Rate</h3>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">{analytics.conversionRate}%</p>
                <p className="text-sm text-gray-500">Views to orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Total Products</h3>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">{analytics.topProducts.length}</p>
                <p className="text-sm text-gray-500">Active products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {analytics.recentActivity.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-3 ${
                        activity.type === 'order' ? 'bg-green-400' : 'bg-blue-400'
                      }`} />
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </SellerLayout>
    </SellerRouteGuard>
  )
}
