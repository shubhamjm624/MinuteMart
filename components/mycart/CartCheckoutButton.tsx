/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import CheckoutModal from '@/components/mycart/CheckoutModal';


interface ProductInCart {
  product: { price: number };
  quantity: number;
}

interface CartCheckoutButtonProps {
  cartId: string;
}

const CartCheckoutButton: React.FC<CartCheckoutButtonProps> = ({ cartId }) => {
  const [productsInCart, setProductsInCart] = useState<ProductInCart[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = productsInCart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/productsInCart/by-cart-id/${cartId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        setProductsInCart(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchProducts();
  }, [cartId]);

  return (
    <div className="flex justify-center items-center p-4">
      <button
        onClick={() => setShowModal(true)}
        className="bg-black text-white w-full max-w-xs px-6 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 text-lg font-semibold"
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </button>

      <CheckoutModal
        isOpen={showModal}
        totalPrice={totalPrice}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default CartCheckoutButton;
