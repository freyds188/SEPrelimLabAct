'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
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

interface ProductCardProps {
  product: Product;
  showWeaver?: boolean;
  showActions?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  showWeaver = true,
  showActions = true,
  className = '',
}: ProductCardProps) {
  const { addItem, isCartAccessible } = useCart();
  const { isAuthenticated } = useAuth();
  const isInStock = product.stock_quantity > 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  const getStockStatusColor = () => {
    if (!isInStock) return 'text-red-600 bg-red-50';
    if (isLowStock) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isCartAccessible) {
      toast.error('You should log in first to add items to your cart');
      return;
    }
    
    if (!isInStock) {
      toast.error('This product is out of stock');
      return;
    }

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image_url || '/placeholder-product.jpg',
      weaver_name: product.weaver?.user?.name || product.weaver?.name || 'Unknown Weaver',
      quantity: 1,
    });
    
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <div className={`group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.main_image_url || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
              Featured
            </span>
          )}
          {product.tribe && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded-full">
              {product.tribe}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor()}`}>
            {product.stock_status}
          </span>
        </div>

        {/* Quick Actions */}
        {showActions && (
          <div className="absolute bottom-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-1">
          {product.category}
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Weaver */}
        {showWeaver && product.weaver && (
          <div className="text-sm text-gray-600 mb-2">
            by {product.weaver.user?.name || product.weaver.name}
          </div>
        )}

        {/* Product Details */}
        <div className="space-y-1 mb-3">
          {product.technique && (
            <div className="text-xs text-gray-500">
              Technique: {product.technique}
            </div>
          )}
          {product.material && (
            <div className="text-xs text-gray-500">
              Material: {product.material}
            </div>
          )}
          {product.color && (
            <div className="text-xs text-gray-500">
              Color: {product.color}
            </div>
          )}
        </div>

        {/* Rating */}
        {Number(product.rating || 0) > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(Number(product.rating || 0))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews_count || 0})
            </span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {product.formatted_price}
            </span>
            {!isInStock && (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
          </div>

          {showActions && isInStock && (
            <button 
              onClick={handleAddToCart}
              className={`p-2 rounded-full transition-colors ${
                isCartAccessible 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
                             title={isCartAccessible ? "Add to Cart" : "You should log in first to add to cart"}
              disabled={!isCartAccessible}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

