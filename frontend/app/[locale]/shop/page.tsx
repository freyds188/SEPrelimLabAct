'use client';

import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Filter as FilterIcon } from 'lucide-react';
import ProductCard from '../../../components/ui/ProductCard';
import ProductFilters from '../../../components/ui/ProductFilters';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  formatted_price: string;
  stock_quantity: number;
  stock_status: string;
  category: string;
  tribe?: string;
  technique?: string;
  material?: string;
  color?: string;
  is_featured: boolean;
  rating: number;
  reviews_count: number;
  main_image_url?: string;
  weaver?: {
    id: number;
    name: string;
    user?: {
      name: string;
    };
  };
}

interface FilterOptions {
  categories: string[];
  tribes: string[];
  techniques: string[];
  materials: string[];
  colors: string[];
  origin_regions: string[];
  price_range: {
    min: number;
    max: number;
  };
  weight_range: {
    min: number;
    max: number;
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  // Fetch products
  const fetchProducts = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '15',
        ...filters,
      });

      const response = await fetch(`/api/v1/products?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
        setPagination({
          current_page: result.meta.current_page,
          last_page: result.meta.last_page,
          per_page: result.meta.per_page,
          total: result.meta.total,
        });
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/v1/products/filters');
      const result = await response.json();

      if (result.success) {
        setFilters(result.data);
      }
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  useEffect(() => {
    fetchProducts(1, appliedFilters);
    fetchFilters();
  }, []);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setAppliedFilters(newFilters);
    fetchProducts(1, newFilters);
  };

  const handleClearFilters = () => {
    setAppliedFilters({});
    fetchProducts(1, {});
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page, appliedFilters);
  };

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...appliedFilters, search: searchTerm };
    setAppliedFilters(newFilters);
    fetchProducts(1, newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(appliedFilters).length;
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop Handwoven Textiles</h1>
        <p className="text-gray-600 mb-6">
          Discover authentic Filipino handwoven textiles crafted by skilled artisans from various tribes and regions.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FilterIcon className="w-4 h-4" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>

          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            {filters && (
              <ProductFilters
                filters={filters}
                appliedFilters={appliedFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {pagination.total} products found
              </span>
              {getActiveFiltersCount() > 0 && (
                <span className="text-sm text-blue-600">
                  {getActiveFiltersCount()} filter(s) applied
                </span>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {[...Array(pagination.last_page)].map((_, i) => {
                      const page = i + 1;
                      const isCurrent = page === pagination.current_page;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
