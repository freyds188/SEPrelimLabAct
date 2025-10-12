'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, Search, Filter, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface Donation {
  id: number
  donor_name: string
  donor_email: string
  amount: string
  status: string
  is_anonymous: boolean
  campaign_title: string
  created_at: string
  paid_at: string
  payment_method: string
  transaction_id: string
}

interface DonationsResponse {
  success: boolean
  data: {
    data: Donation[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [anonymousFilter, setAnonymousFilter] = useState('all')
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  useEffect(() => {
    fetchDonations()
  }, [pagination.current_page, statusFilter, anonymousFilter])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      const adminToken = localStorage.getItem('admin_token')
      
      if (!adminToken) {
        toast.error('Admin authentication required')
        return
      }

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (anonymousFilter !== 'all') {
        params.append('is_anonymous', anonymousFilter === 'anonymous' ? 'true' : 'false')
      }

      const response = await fetch(`http://127.0.0.1:8000/api/v1/admin/donations?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data: DonationsResponse = await response.json()
        setDonations(data.data.data)
        setPagination({
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total
        })
      } else {
        toast.error('Failed to fetch donations')
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast.error('Error fetching donations')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, label: 'Completed', className: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      failed: { variant: 'destructive' as const, label: 'Failed', className: 'bg-red-100 text-red-800' },
      refunded: { variant: 'outline' as const, label: 'Refunded', className: 'bg-gray-100 text-gray-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchTerm === '' || 
      donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.campaign_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }))
  }

  const exportDonations = () => {
    const csvContent = [
      ['ID', 'Donor Name', 'Donor Email', 'Amount', 'Status', 'Campaign', 'Date', 'Payment Method'],
      ...filteredDonations.map(donation => [
        donation.id,
        donation.donor_name,
        donation.donor_email,
        donation.amount,
        donation.status,
        donation.campaign_title,
        formatDate(donation.created_at),
        donation.payment_method
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Manage and view all donation records</p>
        </div>
        <Button onClick={exportDonations} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {donations.filter(d => d.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Successful donations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anonymous</CardTitle>
            <Heart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {donations.filter(d => d.is_anonymous).length}
            </div>
            <p className="text-xs text-muted-foreground">Anonymous donations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Heart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + parseFloat(d.amount), 0).toString())}
            </div>
            <p className="text-xs text-muted-foreground">Completed donations only</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Donor Type</label>
              <Select value={anonymousFilter} onValueChange={setAnonymousFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Donors</SelectItem>
                  <SelectItem value="anonymous">Anonymous</SelectItem>
                  <SelectItem value="named">Named</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={fetchDonations} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Records</CardTitle>
          <CardDescription>
            Showing {filteredDonations.length} of {pagination.total} donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Donor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {donation.donor_name}
                            {donation.is_anonymous && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Anonymous
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{donation.donor_email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(donation.amount)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(donation.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{donation.campaign_title}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{formatDate(donation.created_at)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{donation.payment_method}</div>
                        <div className="text-xs text-gray-500">{donation.transaction_id}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredDonations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No donations found matching your criteria.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {pagination.current_page} of {pagination.last_page}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
