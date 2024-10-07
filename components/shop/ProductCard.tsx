// src/components/shop/ProductCard.tsx

import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

// Define the Product type based on your schema
interface Product {
  id: string; // Use string to match the ObjectId type
  name: string;
  description: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

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

// Function to add a product to the cart
const addToCart = async (cartId: string, productId: string, quantity: number) => {
  const response = await fetch(`/api/carts/${cartId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: { productId, quantity },
    }),
  });

  if (!response.ok) throw new Error('Failed to add product to cart');
  return await response.json();
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { isLoaded, userId } = useAuth();

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta)); // Ensure quantity does not go below 1
  };

  const handleAddToCart = async () => {
    if (!isLoaded || !userId) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    try {
      const currentUserId = await fetchCurrentUserId(userId);
      const currentCartId = await fetchCurrentCartId(currentUserId);
      await addToCart(currentCartId, product.id, quantity);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart. Please try again later.');
    }
  };

  return (
    <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-lg font-semibold text-gray-800">${product.price.toFixed(2)}</p>

      <div className="flex items-center mt-4">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg mr-2 transition duration-200 hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-lg">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg ml-2 transition duration-200 hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-black text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 transition duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
