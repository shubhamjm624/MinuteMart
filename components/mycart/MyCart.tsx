/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import CartOverview from '@/components/mycart/CartOverview';
import CartProductList from '@/components/mycart/CartProductList';
import CartPriceSummary from '@/components/mycart/CartPriceSummary';
import CartCheckoutButton from '@/components/mycart/CartCheckoutButton';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

// Function to fetch the current user ID
const fetchCurrentUserId = async (currentClerUserId: string | null | undefined): Promise<string> => {
  if (!currentClerUserId) throw new Error('Clerk user ID is required');
  
  const response = await fetch(`/api/users/by-clerk-id/${currentClerUserId}`);
  
  if (!response.ok) throw new Error('Failed to fetch current user ID');
  
  const { id } = await response.json();
  return id;
};

// Function to fetch the current cart ID
const fetchCurrentCartId = async (currentUserId: string): Promise<string> => {
  if (!currentUserId) throw new Error('currentUserId is required');
  
  const response = await fetch(`/api/carts/by-user-id/${currentUserId}`);
  
  if (!response.ok) throw new Error('Failed to fetch current cart ID');
  
  const { id } = await response.json();
  return id;
};

const MyCart = () => {

  const { isLoaded, userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && userId) {
        try {
          const currentUserId   = await fetchCurrentUserId(userId);
          console.log('currentUserId :: ', currentUserId);
          const id = await fetchCurrentCartId(currentUserId);
          setCartId(id);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      }
    };

    fetchData();
  }, [isLoaded, userId]);
  
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto p-4">
      <CartOverview />
      <CartProductList cartId={cartId} />
      <CartPriceSummary cartId={cartId} />
      <CartCheckoutButton cartId={cartId} />
    </div>
    </div>
  );
};

export default MyCart;


