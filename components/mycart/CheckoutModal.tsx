/* eslint-disable @typescript-eslint/no-unused-vars */
//* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import WalletActionModal from '@/components/mywallet/WalletActionModal';

interface CheckoutModalProps {
  isOpen: boolean;
  totalPrice: number;
  onClose: () => void;
}

const fetchCurrentCartId = async (currentUserId: string): Promise<string> => {
  if (!currentUserId) throw new Error('currentUserId is required');
  
  const response = await fetch(`/api/carts/by-user-id/${currentUserId}`);
  
  if (!response.ok) throw new Error('Failed to fetch current cart ID');
  
  const { id } = await response.json();
  return id;
};

const fetchCurrentUserId = async (currentClerkUserId: string | null | undefined): Promise<string> => {
  if (!currentClerkUserId) throw new Error("Clerk user ID is required");

  const response = await fetch(`/api/users/by-clerk-id/${currentClerkUserId}`);
  if (!response.ok) throw new Error("Failed to fetch current user ID");

  const { id } = await response.json();
  console.log("Fetched current user ID:", id); // Log the fetched user ID
  return id;
};

async function updateWalletBalance(walletId: string, newBalance: number): Promise<boolean> {
  try {
    console.log("Updating wallet balance...", { walletId, newBalance }); // Debug log
    const response = await fetch(`/api/wallets/${walletId}`, {
      method: "PUT", // Use PATCH or PUT depending on your API design
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ balance: newBalance }), // Update only the balance field
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update wallet balance:", errorData.error || "Unknown error"); // Debug log
      throw new Error(errorData.error || "Failed to update wallet balance");
    }

    console.log("Wallet balance updated successfully."); // Debug log
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating wallet balance:", error.message);
    } else {
      console.error("Unexpected error occurred while updating wallet balance.");
    }
    return false;
  }
}

async function saveTransaction(
  walletId: string,
  amount: number,
  userId: string,
  typeOfTransaction: string
): Promise<boolean> {
  if (typeOfTransaction === "Credit") {
    amount = amount * -1;
  }

  try {
    console.log("Saving transaction...", { walletId, amount, userId, typeOfTransaction }); // Debug log
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletId, amount, userId, typeOfTransaction }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create transaction:", errorData.error || "Unknown error"); // Debug log
      throw new Error(errorData.error || "Failed to create transaction");
    }

    console.log("Transaction saved successfully."); // Debug log
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating transaction:", error.message);
    } else {
      console.error("Unexpected error occurred during transaction.");
    }
    return false;
  }
}

const emptyCartAndDeleteProductsInCart = async (cartId : string): void => {
};

const createNewOrderItem = async (): void => {
};

const reduceStocksOfProduct = async (): void => {
};

const onPlacingOrder = async (walletId: string, balance: number, amount: number, userId: string, typeOfTransaction: string, cartId: string): void => {
  const newBalance = balance - amount;
  updateWalletBalance(walletId, newBalance);
  saveTransaction( walletId, amount, userId, typeOfTransaction);
  emptyCartAndDeleteProductsInCart(cartId);
  createNewOrderItem(cartId);
  reduceStocksOfProduct(cartId);
};

const fetchCurrentWalletId = async (currentUserId: string): Promise<{ id: string; balance: number }> => {
  if (!currentUserId) throw new Error("currentUserId is required");

  const response = await fetch(`/api/wallets/by-user-id/${currentUserId}`);
  if (!response.ok) throw new Error("Failed to fetch current wallet ID");

  const wallet = await response.json();
  console.log("Fetched wallet data:", wallet); // Log the fetched wallet data
  return wallet; // Assuming the wallet contains `id` and `balance`.
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  totalPrice,
  onClose,
}) => {

  const [balance, setBalance] = useState<number>(0.0);
  const { isLoaded, userId } = useAuth();
  const [showWalletActionModal, setShowWalletActionModal] = useState(false);
  const [walletId, setWalletId] = useState('');
  const [cartId, setCartId] = useState('');

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        console.log("Auth state - isLoaded:", isLoaded, "userId:", userId); // Log auth state
        if (isLoaded && userId) {
          const currentUserId = await fetchCurrentUserId(userId);
          const wallet = await fetchCurrentWalletId(currentUserId);
          const cart = await fetchCurrentCartId(currentUserId);
          setWalletId(wallet.id);
          setBalance(wallet.balance);
          setCartId(cart.id);
          console.log("Balance fetched and set:", wallet.balance); // Log the fetched balance
        } else {
          console.log("User is not loaded or userId is undefined."); // Log when user is not loaded
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error); // Log error
      }
    };

    fetchWalletData();
  }, [isLoaded, userId]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto my-16"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Order Summary</h2>
          <p className="text-gray-700 mb-6 text-center">
            Pay <span className="font-bold">${totalPrice.toFixed(2)}</span> total amount using wallet.
          </p>
          {totalPrice > balance ? (
            <>
              <button
                onClick={onPlacingOrder}
                className="bg-gray-400 text-white w-full py-3 rounded-md cursor-not-allowed"
                aria-label="Place order"
                disabled
              >
                Place Order
              </button>
              <button
                onClick={() => setShowWalletActionModal(true)} // Updated onClick handler
                className="bg-black text-white w-full py-3 rounded-md hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 mb-4"
                aria-label="Add money to wallet"
              >
                Add Money in Wallet
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-black text-white w-full py-3 rounded-md hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 mb-4"
              aria-label="Place order"
            >
              Place Order
            </button>
          )}
          <button onClick={onClose} className="text-gray-700 underline" aria-label="Close modal">
            Close
          </button>
        </div>
      </Modal>
      {showWalletActionModal && (
        <WalletActionModal
          walletAction='Add'
          onClose={() => setShowWalletActionModal(false)}
          balance={balance}
          setBalance={setBalance}
        />
      )}
    </div>
  );
};

export default CheckoutModal;
