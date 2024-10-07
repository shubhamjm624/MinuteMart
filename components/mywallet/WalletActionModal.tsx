/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface WalletActionModalProps {
  walletAction: string;
  onClose: () => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

// New function to update the wallet balance
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

async function fetchCurrentUserId(
  currentClerkUserId: string | null | undefined
): Promise<string> {
  if (!currentClerkUserId) throw new Error("Clerk user ID is required");

  console.log("Fetching current user ID for Clerk ID:", currentClerkUserId); // Debug log
  const response = await fetch(`/api/users/by-clerk-id/${currentClerkUserId}`);
  if (!response.ok) throw new Error("Failed to fetch current user ID");

  const data = await response.json();
  console.log("Current user ID fetched:", data["id"]); // Debug log
  return data["id"];
}

async function fetchCurrentWalletId(currentUserId: string): Promise<string> {
  if (!currentUserId) throw new Error("User ID is required");

  console.log("Fetching wallet ID for user ID:", currentUserId); // Debug log
  const response = await fetch(`/api/wallets/by-user-id/${currentUserId}`);
  if (!response.ok) throw new Error("Failed to fetch wallet ID");

  const data = await response.json();
  console.log("Wallet ID fetched:", data["id"]); // Debug log
  return data["id"];
}

const WalletActionModal: React.FC<WalletActionModalProps> = ({
  walletAction,
  onClose,
  balance,
  setBalance,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const { isLoaded, userId } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let typeOfTransaction: string = walletAction === "Withdraw" ? "Credit" : "Debit";

    if (walletAction === "Withdraw" && amount > balance) {
      setMessage({ text: "Insufficient balance", type: "error" });
      console.warn("Transaction failed: Insufficient balance."); // Debug log
      return;
    }

    try {
      console.log("Starting transaction process..."); // Debug log
      const currentUserId = await fetchCurrentUserId(userId);
      const currentWalletId = await fetchCurrentWalletId(currentUserId);

      const transactionSuccess = await saveTransaction(
        currentWalletId,
        amount,
        currentUserId,
        typeOfTransaction
      );

      if (transactionSuccess) {
        // Calculate new balance based on transaction type
        const newBalance = walletAction === "Withdraw" ? balance - amount : balance + amount;
        console.log("Calculated new balance:", newBalance); // Debug log

        // Update the wallet balance
        const walletUpdateSuccess = await updateWalletBalance(currentWalletId, newBalance);

        if (walletUpdateSuccess) {
          setBalance(newBalance);
          setMessage({ text: "Transaction successful!", type: "success" });
        } else {
          setMessage({
            text: "Transaction succeeded, but failed to update wallet balance.",
            type: "error",
          });
          console.warn("Wallet balance update failed after transaction success."); // Debug log
        }
      } else {
        setMessage({
          text: "Transaction failed. Please try again.",
          type: "error",
        });
      }

      setAmount(0); // Reset amount
    } catch (error) {
      // Check if error is an instance of Error before accessing 'message'
      if (error instanceof Error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({
          text: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
      console.error("Error during transaction process:", error); // Debug log
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 md:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{walletAction} Money</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
              required
            />
            {message && (
              <p
                className={`mt-2 text-${
                  message.type === "error" ? "red" : "green"
                }-500`}
              >
                {message.text}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-150"
          >
            {walletAction}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletActionModal;
