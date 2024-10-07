/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

// Sample Order Type
interface Order {
  [x: string]: string | number | Date;
  id: number;
  status: 'delivered' | 'pending' | 'cancelled' | 'out for delivery';
  totalAmount: number;
  orderDate: string;
}

// Fetch all orders
const fetchAllOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await fetch(`/api/orders/by-user-id/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data: Order[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Fetch user ID
async function fetchCurrentUserId(currentClerUserId: string | null | undefined): Promise<string> {
  if (!currentClerUserId) throw new Error('Clerk user ID is required');
  const response = await fetch(`/api/users/by-clerk-id/${currentClerUserId}`);
  if (!response.ok) throw new Error('Failed to fetch current user ID');
  const data = await response.json();
  return data['id'];
}

const MyOrders = () => {
  const { isLoaded, userId } = useAuth();
  const [orders, setOrders] = useState<Array<Order> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && userId) {
        try {
          const currentUserId = await fetchCurrentUserId(userId);
          const allOrders = await fetchAllOrders(currentUserId);
          const sortedOrders = allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
          setOrders(sortedOrders);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      }
    };
    fetchData();
  }, [isLoaded, userId]);

  const displayedOrders = showAllOrders ? orders : orders?.slice(0, 10);

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-4xl font-extrabold text-center text-black mb-6">My Orders</h1>
      
      {/* Orders Section */}
      <div className="space-y-6">
        {displayedOrders && displayedOrders.map(order => (
          <div key={order.id} className="border border-gray-800 rounded-lg p-4 shadow-lg bg-gray-100 hover:bg-gray-50 transition duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
              <span className={`text-sm font-semibold py-1 px-2 rounded-lg ${
                order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                order.status === 'out for delivery' ? 'bg-blue-100 text-blue-600' : ''
              }`}>
                {order.status}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-lg text-gray-800">Total Amount: <span className="font-semibold">${order.totalAmount}</span></p>
              <p className="text-sm text-gray-500">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Orders Button */}
      {!showAllOrders && orders && orders.length > 10 && (
        <div className="flex justify-center mt-6">
          <button
            className="px-5 py-3 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition-all duration-300"
            onClick={() => setShowAllOrders(true)}
          >
            Show All Orders
          </button>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
