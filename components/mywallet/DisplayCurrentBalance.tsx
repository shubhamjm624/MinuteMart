"use client"

interface DisplayCurrentBalanceProps {
  balance: number;
}

const DisplayCurrentBalance: React.FC<DisplayCurrentBalanceProps> = ({ balance }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold">Current Balance</h2>
      <p className="text-2xl font-bold text-black">${balance}</p>
    </div>
  );
};

export default DisplayCurrentBalance;
