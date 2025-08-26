'use client';

import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../lib/cart-context';

interface CartItemProps {
  item: {
    id: number;
    product_id: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image?: string;
    weaver_name?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        {item.weaver_name && (
          <p className="text-xs text-gray-500">by {item.weaver_name}</p>
        )}
        <p className="text-sm font-medium text-gray-900 mt-1">
          ₱{Number(item.price).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          disabled={item.quantity <= 1}
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        <span className="w-8 text-center text-sm font-medium text-gray-900">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          ₱{(Number(item.price) * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="p-1 rounded-full hover:bg-red-100 transition-colors"
      >
        <X className="w-4 h-4 text-red-600" />
      </button>
    </div>
  );
}

