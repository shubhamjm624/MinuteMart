/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';


async function fetchCurrentUserId(currentClerUserId: string | null | undefined): Promise<string> {
  if (currentClerUserId === undefined) {
    throw new Error('Clerk user ID is required');
  }
  const response = await fetch(`/api/users/by-clerk-id/${currentClerUserId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch current user ID');
  }
  
  const data = await response.json();
  return data['id'];
}

async function fetchCurrentWalletId(currentUserId: string): Promise<string> {
  if (currentUserId === undefined) {
    throw new Error('currentUserId is required');
  }

  const response = await fetch(`/api/wallets/by-user-id/${currentUserId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch current wallet ID');
  }
  
  const data = await response.json();
  return data['id'];
}

async function fetchAllTransactions(currentWalletId: string): Promise<Array<Transaction>> {
  if (currentWalletId === undefined) {
    throw new Error('currentWalletId is required');
  }

  const response = await fetch(`/api/transactions/by-wallet-id/${currentWalletId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  
  const data = await response.json();
  return data;
}

const RecentTransactions = () => {
  const { isLoaded, userId } = useAuth();
  const [transactions, setTransactions] = useState<Array<Transaction> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && userId) {
        try {
          const currentUserId   = await fetchCurrentUserId(userId);
          const currentWalletId = await fetchCurrentWalletId(currentUserId);
          const allTransactions = await fetchAllTransactions(currentWalletId);
          const sortedTransactions = allTransactions.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setTransactions(sortedTransactions);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      }
    };

    fetchData();
  }, [isLoaded, userId]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-xl font-extrabold mb-6 text-center border-b border-gray-700 pb-4">
        Recent Transactions
      </h1>
      {transactions && transactions.length > 0 ? (
        <ul className="space-y-4">
          {transactions.slice(0, 5).map((tx) => (
            <li
              key={tx.id}
              className={`p-4 rounded-lg border 
                ${tx.amount < 0 ? 'border-red-600 bg-red-900' : 'border-green-600 bg-green-900'} 
                transition duration-300 transform hover:scale-105`}
            >
              <span className={`block text-lg font-semibold 
                ${tx.amount < 0 ? 'text-red-300' : 'text-green-300'}`}>
                {tx.typeOfTransaction}: 
                <span className="ml-2">{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}</span>
              </span>
              <span className="text-gray-400 text-sm">Transaction ID: {tx.id}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center mt-4">No transactions found.</p>
      )}

      {transactions && transactions.length > 5 && (
        <div className="mt-6 text-center">
          <Link href="/my-transactions" className="text-white hover:text-gray-400 underline transition duration-150">
            ... Show All Transactions
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
