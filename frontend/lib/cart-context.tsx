'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './auth-context';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  weaver_name?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getItemById: (id: number) => CartItem | undefined;
  isCartAccessible: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuthenticated, isLoading } = useAuth();

  // Check if cart is accessible (user is authenticated and not loading)
  const isCartAccessible = isAuthenticated && !isLoading;

  // Load cart from localStorage on mount, but only if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setItems(parsedCart);
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          localStorage.removeItem('cart');
          setItems([]);
        }
      }
    } else if (!isLoading && !isAuthenticated) {
      // Clear cart if user is not authenticated
      setItems([]);
      localStorage.removeItem('cart');
    }
  }, [isAuthenticated, isLoading]);

  // Save cart to localStorage whenever items change, but only if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated, isLoading]);

  // Listen for cart cleared event from auth logout
  useEffect(() => {
    const handleCartCleared = () => {
      setItems([]);
    };

    window.addEventListener('cartCleared', handleCartCleared);
    
    return () => {
      window.removeEventListener('cartCleared', handleCartCleared);
    };
  }, []);

  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    if (!isCartAccessible) {
      console.warn('Cannot add item to cart: user not authenticated');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product_id === newItem.product_id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.product_id === newItem.product_id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item with unique ID
        return [...prevItems, { ...newItem, id: Date.now() }];
      }
    });
  }, [isCartAccessible]);

  const removeItem = useCallback((id: number) => {
    if (!isCartAccessible) {
      console.warn('Cannot remove item from cart: user not authenticated');
      return;
    }

    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, [isCartAccessible]);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (!isCartAccessible) {
      console.warn('Cannot update cart: user not authenticated');
      return;
    }

    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [isCartAccessible, removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  const getItemById = useCallback((id: number) => {
    return items.find(item => item.id === id);
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    getItemById,
    isCartAccessible,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
