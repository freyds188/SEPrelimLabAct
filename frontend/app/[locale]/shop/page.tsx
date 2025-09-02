'use client';

import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Filter as FilterIcon, ShoppingBag, Sparkles, Star, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-brand-50 via-white to-accent-50 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fef3c7%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-brand-200 to-accent-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-accent-200 to-brand-200 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-100 to-accent-100 border border-brand-200 rounded-full px-6 py-2 mb-6">
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span className="text-brand-700 font-medium text-sm">
                Handwoven Collection
              </span>
            </div>
            <h1 className="h1 text-balance mb-4 bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 bg-clip-text text-transparent">
              Shop Handwoven Textiles
            </h1>
            <p className="body text-balance max-w-3xl mx-auto text-neutral-700 leading-relaxed mb-8">
              Discover authentic Filipino handwoven textiles crafted by skilled artisans from various tribes and regions.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for traditional textiles, patterns, or artisans..."
                className="w-full pl-12 pr-4 py-4 border-2 border-brand-200 rounded-xl focus:ring-4 focus:ring-brand-100 focus:border-brand-400 transition-all duration-300 text-lg placeholder-neutral-400"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>Press Enter to search</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="group w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-brand-50 to-accent-50 border-2 border-brand-200 rounded-xl hover:from-brand-100 hover:to-accent-100 hover:border-brand-300 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FilterIcon className="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-brand-700">Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-accent-500 rounded-full shadow-sm">
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
            {/* Enhanced Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 p-6 bg-gradient-to-r from-neutral-50 to-brand-50 rounded-2xl border border-neutral-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-neutral-800">
                      {pagination.total} products found
                    </span>
                    {getActiveFiltersCount() > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="w-4 h-4 text-brand-500" />
                        <span className="text-sm text-brand-600 font-medium">
                          {getActiveFiltersCount()} filter(s) applied
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-neutral-200 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md' 
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md' 
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <List className="w-5 h-5" />
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

                {/* Enhanced Pagination */}
                {pagination.last_page > 1 && (
                  <div className="flex items-center justify-center mt-12">
                    <nav className="flex items-center space-x-2 bg-white rounded-2xl p-2 shadow-lg border border-neutral-200">
                      <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-4 py-2 text-sm font-medium border-2 border-neutral-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                            className={`px-4 py-2 text-sm font-medium border-2 rounded-xl transition-all duration-300 ${
                              isCurrent
                                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white border-brand-600 shadow-md'
                                : 'border-neutral-200 hover:border-brand-300 hover:bg-brand-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-4 py-2 text-sm font-medium border-2 border-neutral-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-3">No products found</h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
