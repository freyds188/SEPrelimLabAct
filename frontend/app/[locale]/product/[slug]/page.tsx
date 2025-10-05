'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Heart, ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../../../../components/ui/ProductCard';
import { useCart } from '../../../../lib/cart-context';
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
  weight_grams?: number;
  origin_region?: string;
  is_handmade: boolean;
  is_featured: boolean;
  rating: number;
  reviews_count: number;
  views_count: number;
  sales_count: number;
  specifications?: Record<string, any>;
  care_instructions?: string[];
  dimensions?: Record<string, any>;
  main_image_url?: string;
  image_urls: string[];
  weaver?: {
    id: number;
    name: string;
    user?: {
      name: string;
    };
  };
  media?: Array<{
    id: number;
    path: string;
    optimized_paths?: Record<string, string>;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem, isCartAccessible } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params.slug]);

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/products/${slug}`);
      const result = await response.json();

      if (result.success) {
        setProduct(result.data);
        fetchRelatedProducts(result.data.id);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (productId: number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/products/${productId}/related`);
      const result = await response.json();

      if (result.success) {
        setRelatedProducts(result.data);
      }
    } catch (error) {
      console.error('Failed to load related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isCartAccessible) {
      toast.error('You should log in first to add items to your cart');
      return;
    }
    
    // Get the best available image with proper fallbacks
    const productImage = product.main_image_url || 
                        (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null) ||
                        '/placeholder-product.jpg';
    
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: productImage,
      weaver_name: product.weaver?.user?.name || product.weaver?.name || 'Unknown Weaver',
      quantity: quantity,
    });
    
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
  };

  const handleWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.success('Added to wishlist!');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isInStock = product.stock_quantity > 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-gray-700">Shop</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/shop?category=${product.category}`} className="hover:text-gray-700">
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={(product.image_urls && product.image_urls.length > selectedImage && product.image_urls[selectedImage]) || product.main_image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.image_urls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
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
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                isInStock 
                  ? isLowStock 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-green-600 bg-green-50'
                  : 'text-red-600 bg-red-50'
              }`}>
                {product.stock_status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {product.weaver && (
              <p className="text-gray-600 mb-4">
                by {product.weaver.user?.name || product.weaver.name}
              </p>
            )}

            {/* Rating */}
            {Number(product.rating || 0) > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(product.rating || 0))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {Number(product.rating || 0).toFixed(1)} ({product.reviews_count || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            {product.formatted_price}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            {product.technique && (
              <div>
                <span className="text-sm font-medium text-gray-500">Technique</span>
                <p className="text-gray-900">{product.technique}</p>
              </div>
            )}
            {product.material && (
              <div>
                <span className="text-sm font-medium text-gray-500">Material</span>
                <p className="text-gray-900">{product.material}</p>
              </div>
            )}
            {product.color && (
              <div>
                <span className="text-sm font-medium text-gray-500">Color</span>
                <p className="text-gray-900">{product.color}</p>
              </div>
            )}
            {product.weight_grams && (
              <div>
                <span className="text-sm font-medium text-gray-500">Weight</span>
                <p className="text-gray-900">{product.weight_grams}g</p>
              </div>
            )}
            {product.origin_region && (
              <div>
                <span className="text-sm font-medium text-gray-500">Origin</span>
                <p className="text-gray-900">{product.origin_region}</p>
              </div>
            )}
            {product.is_handmade && (
              <div>
                <span className="text-sm font-medium text-gray-500">Craft</span>
                <p className="text-gray-900">Handmade</p>
              </div>
            )}
          </div>

          {/* Dimensions */}
          {product.dimensions && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dimensions</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.dimensions).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <p className="text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Care Instructions */}
          {product.care_instructions && product.care_instructions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Care Instructions</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.care_instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart */}
          <div className="space-y-4">
            {isInStock && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock_quantity} available
                </span>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleWishlist}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Free shipping
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Secure payment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                showWeaver={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
