// src/components/shop/AvailableProducts.tsx

"use client";

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; // Import the ProductCard component

// Define Product type based on your schema
interface Product {
  id: string; // Use string to match the ObjectId type
  name: string;
  description: string;
  price: number;
}

const fetchAllAvailableOrders = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const AvailableProducts = () => {
  const [products, setProducts] = useState<Array<Product> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allAvailableProducts = await fetchAllAvailableOrders();
        setProducts(allAvailableProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error :: ', err);
      }
    };
    fetchData();
  }, []);

  // Error handling
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-gray-50 min-h-screen">
      {products ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} /> // Pass product data to ProductCard
        ))
      ) : (
        <p>Loading products...</p> // Display loading text or spinner
      )}
    </div>
  );
};

export default AvailableProducts;
