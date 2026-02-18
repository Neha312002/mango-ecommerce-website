'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Product = {
  id?: number;
  name: string;
  price: number;
  img: string;
  desc: string;
};

type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  wishlist: number[]; // Array of product IDs
  addToCart: (product: Product) => void;
  removeFromCart: (name: string) => void;
  clearCart: () => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load wishlist from database when user logs in
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      fetchWishlist(userData.id);
    }
  }, []);

  async function fetchWishlist(userId: number) {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const productIds = data.wishlist.map((item: any) => item.productId);
        setWishlist(productIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const found = prev.find((item) => item.name === product.name);
      if (found) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(name: string) {
    setCart((prev) => prev.filter((item) => item.name !== name));
  }

  function clearCart() {
    setCart([]);
  }

  async function addToWishlist(productId: number) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Please login to add items to wishlist');
      return;
    }

    const userData = JSON.parse(currentUser);

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id, productId }),
      });

      if (response.ok) {
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  }

  async function removeFromWishlist(productId: number) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const userData = JSON.parse(currentUser);

    try {
      const response = await fetch(`/api/wishlist?userId=${userData.id}&productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }

  function isInWishlist(productId: number): boolean {
    return wishlist.includes(productId);
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      wishlist,
      addToCart, 
      removeFromCart, 
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
}