"use client";

import React, { useEffect, useState } from "react";
import DisplayCurrentBalance from "@/components/mywallet/DisplayCurrentBalance";
import WalletActions from "@/components/mywallet/WalletActions";
import RecentTransactions from "@/components/mywallet/RecentTransactions";
import { useAuth } from "@clerk/nextjs";

const fetchCurrentUserId = async (currentClerkUserId: string | null | undefined): Promise<string> => {
  if (!currentClerkUserId) throw new Error("Clerk user ID is required");

  const response = await fetch(`/api/users/by-clerk-id/${currentClerkUserId}`);
  if (!response.ok) throw new Error("Failed to fetch current user ID");

  const { id } = await response.json();
  console.log("Fetched current user ID:", id); // Log the fetched user ID
  return id;
};

const fetchCurrentWalletId = async (currentUserId: string): Promise<{ id: string; balance: number }> => {
  if (!currentUserId) throw new Error("currentUserId is required");

  const response = await fetch(`/api/wallets/by-user-id/${currentUserId}`);
  if (!response.ok) throw new Error("Failed to fetch current wallet ID");

  const wallet = await response.json();
  console.log("Fetched wallet data:", wallet); // Log the fetched wallet data
  return wallet; // Assuming the wallet contains `id` and `balance`.
};

const MyWallet = () => {
  const [balance, setBalance] = useState<number>(0.0);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        console.log("Auth state - isLoaded:", isLoaded, "userId:", userId); // Log auth state
        if (isLoaded && userId) {
          const currentUserId = await fetchCurrentUserId(userId);
          const wallet = await fetchCurrentWalletId(currentUserId);

          // Assuming the wallet response contains a balance field
          setBalance(wallet.balance);
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
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mb-6">My Wallet</h1>
      <DisplayCurrentBalance balance={balance} />
      <WalletActions balance={balance} setBalance={setBalance} />
      <RecentTransactions />
    </div>
  );
};

export default MyWallet;
