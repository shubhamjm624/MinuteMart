import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductInCart {
  id: number;
  product: Product;
  quantity: number;
}

interface CartPriceSummaryProps {
  cartId: string;
}

const CartPriceSummary: React.FC<CartPriceSummaryProps> = ({ cartId }) => {
  const [productsInCart, setProductsInCart] = useState<ProductInCart[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/productsInCart/by-cart-id/${cartId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products.');
        }
        const data = await response.json();
        setProductsInCart(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchProducts();
  }, [cartId]);

  const totalPrice = productsInCart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const totalQuantity = productsInCart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Cart Price Summary</h2>
      {error && <p className="text-red-500">{error}</p>}
      {productsInCart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left py-2 px-4">Product</th>
                <th className="text-right py-2 px-4">Price</th>
                <th className="text-right py-2 px-4">Quantity</th>
                <th className="text-right py-2 px-4">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productsInCart.map(({ id, product, quantity }) => (
                <tr key={id} className="border-b">
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="text-right py-2 px-4">${product.price.toFixed(2)}</td>
                  <td className="text-right py-2 px-4">{quantity}</td>
                  <td className="text-right py-2 px-4">${(product.price * quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <p>Total Items: {totalQuantity}</p>
            <p className="font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPriceSummary;
