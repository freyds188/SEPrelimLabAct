'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

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

interface ProductFiltersProps {
  filters: FilterOptions;
  appliedFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
  className?: string;
}

export default function ProductFilters({
  filters,
  appliedFilters,
  onFilterChange,
  onClearFilters,
  className = '',
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(appliedFilters);

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters };
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.keys(appliedFilters).length;
  };

  const FilterSection = ({ title, children, defaultOpen = false }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [isSectionOpen, setIsSectionOpen] = useState(defaultOpen);

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="flex items-center justify-between w-full py-3 text-left text-sm font-medium text-gray-900 hover:text-gray-700"
        >
          {title}
          {isSectionOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {isSectionOpen && (
          <div className="pb-3 space-y-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  const CheckboxFilter = ({ label, value, checked, onChange }: {
    label: string;
    value: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  const RangeFilter = ({ label, min, max, currentMin, currentMax, onChange }: {
    label: string;
    min: number;
    max: number;
    currentMin?: number;
    currentMax?: number;
    onChange: (min: number, max: number) => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min"
          value={currentMin || ''}
          onChange={(e) => onChange(Number(e.target.value) || min, currentMax || max)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Max"
          value={currentMax || ''}
          onChange={(e) => onChange(currentMin || min, Number(e.target.value) || max)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-gray-600"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          {filters.categories.length > 0 && (
            <FilterSection title="Category">
              <select
                value={localFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {filters.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FilterSection>
          )}

          {/* Tribe */}
          {filters.tribes.length > 0 && (
            <FilterSection title="Tribe">
              <select
                value={localFilters.tribe || ''}
                onChange={(e) => handleFilterChange('tribe', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Tribes</option>
                {filters.tribes.map((tribe) => (
                  <option key={tribe} value={tribe}>
                    {tribe}
                  </option>
                ))}
              </select>
            </FilterSection>
          )}

          {/* Technique */}
          {filters.techniques.length > 0 && (
            <FilterSection title="Technique">
              <select
                value={localFilters.technique || ''}
                onChange={(e) => handleFilterChange('technique', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Techniques</option>
                {filters.techniques.map((technique) => (
                  <option key={technique} value={technique}>
                    {technique}
                  </option>
                ))}
              </select>
            </FilterSection>
          )}

          {/* Material */}
          {filters.materials.length > 0 && (
            <FilterSection title="Material">
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filters.materials.map((material) => (
                  <CheckboxFilter
                    key={material}
                    label={material}
                    value={material}
                    checked={localFilters.material === material}
                    onChange={(checked) => handleFilterChange('material', checked ? material : '')}
                  />
                ))}
              </div>
            </FilterSection>
          )}

          {/* Color */}
          {filters.colors.length > 0 && (
            <FilterSection title="Color">
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filters.colors.map((color) => (
                  <CheckboxFilter
                    key={color}
                    label={color}
                    value={color}
                    checked={localFilters.color === color}
                    onChange={(checked) => handleFilterChange('color', checked ? color : '')}
                  />
                ))}
              </div>
            </FilterSection>
          )}

          {/* Price Range */}
          <FilterSection title="Price Range" defaultOpen={true}>
            <RangeFilter
              label="Price (₱)"
              min={filters.price_range.min}
              max={filters.price_range.max}
              currentMin={localFilters.min_price}
              currentMax={localFilters.max_price}
              onChange={(min, max) => {
                handleFilterChange('min_price', min);
                handleFilterChange('max_price', max);
              }}
            />
          </FilterSection>

          {/* Availability */}
          <FilterSection title="Availability">
            <CheckboxFilter
              label="In Stock Only"
              value="in_stock"
              checked={localFilters.in_stock === true}
              onChange={(checked) => handleFilterChange('in_stock', checked)}
            />
            <CheckboxFilter
              label="Handmade Only"
              value="handmade"
              checked={localFilters.handmade === true}
              onChange={(checked) => handleFilterChange('handmade', checked)}
            />
          </FilterSection>

          {/* Sort */}
          <FilterSection title="Sort By">
            <select
              value={localFilters.sort_by || 'created_at'}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price Low to High</option>
              <option value="price desc">Price High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="views_count">Most Popular</option>
            </select>
          </FilterSection>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


