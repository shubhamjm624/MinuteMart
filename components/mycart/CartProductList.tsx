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

interface CartProductListProps {
  cartId: string;
}

const CartProductList: React.FC<CartProductListProps> = ({ cartId }) => {
  const [productsInCart, setProductsInCart] = useState<ProductInCart[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  const updateQuantity = (productId: number, delta: number) => {
    setProductsInCart(prevProducts =>
      prevProducts.map(productInCart =>
        productInCart.id === productId
          ? { ...productInCart, quantity: Math.max(1, productInCart.quantity + delta) }
          : productInCart
      )
    );
  };

  const removeProductFromCart = async (productInCartId: number) => {
    try {
      const response = await fetch(`/api/carts/remove-product-in-cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productInCartId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from cart.');
      }
      const updatedProductsResponse = await fetch(`/api/productsInCart/by-cart-id/${cartId}`);
      const updatedProductsData = await updatedProductsResponse.json();
      setProductsInCart(Array.isArray(updatedProductsData) ? updatedProductsData : []);
      setSuccessMessage('Product removed from cart successfully!');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Products in Your Cart</h2>
      {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {productsInCart.length === 0 ? (
        <p className="text-gray-700">Your cart is empty.</p>
      ) : (
        productsInCart.map(({ id, product, quantity }) => (
          <div key={id} className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img
                src="/path/to/product-image.jpg" // Use actual image path or URL
                alt={product.name}
                className="w-16 h-16 object-cover border rounded-lg"
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(id, -1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <p className="mx-4 text-gray-600">Quantity: {quantity}</p>
                  <button
                    onClick={() => updateQuantity(id, 1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeProductFromCart(id)}
              className="text-red-500 hover:text-red-700"
              aria-label={`Remove ${product.name} from cart`}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartProductList;
