"use client"

import React, { useState } from 'react';
import WalletActionModal from '@/components/mywallet/WalletActionModal';

interface WalletActionsProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const WalletActions: React.FC<WalletActionsProps> = ({ balance, setBalance }) => {
  const [showWalletActionModal, setShowWalletActionModal] = useState(false);
  const [walletAction, setWalletAction] = useState<'Add' | 'Withdraw'>('Add');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const action = event.currentTarget.getAttribute('data-action');
    setShowWalletActionModal(true);

    if (action === 'Add Money to Wallet') {
      setWalletAction('Add');
    } else {
      setWalletAction('Withdraw');
    }
  };

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex flex-col space-y-4">
          <button 
            data-action="Add Money to Wallet"
            className="bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-150"
            onClick={handleClick}
          >
            Add Money to Wallet
          </button>
          <button 
            data-action="Withdraw Money"
            className="bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-150"
            onClick={handleClick}
          >
            Withdraw Money
          </button>
        </div>
      </div>

      {/* Render the modal conditionally */}
      {showWalletActionModal && (
        <WalletActionModal
          walletAction={walletAction}
          onClose={() => setShowWalletActionModal(false)}
          balance={balance}
          setBalance={setBalance}
        />
      )}
    </div>
  );
};

export default WalletActions;
