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
  updateQuantity: (name: string, quantity: number) => void;
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

  // Load cart and wishlist when app mounts
  useEffect(() => {
    // Restore cart from localStorage so refresh doesn't clear it
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart) as CartItem[];
        setCart(parsed);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }

    // Load wishlist from database when user logs in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      fetchWishlist(userData.id);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }, [cart]);

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

  function updateQuantity(name: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(name);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity } : item
      )
    );
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
    console.log('Adding to wishlist:', { userId: userData.id, productId });

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id, productId }),
      });

      const data = await response.json();
      console.log('Wishlist API response:', data);

      if (response.ok) {
        setWishlist((prev) => {
          const updated = [...prev, productId];
          console.log('Wishlist updated:', updated);
          return updated;
        });
      } else {
        console.error('Failed to add to wishlist:', data);
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
      updateQuantity, 
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
}