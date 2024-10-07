import React from 'react';

type OrderStatus = 'confirmed' | 'packing' | 'out for delivery' | 'delivered';

type OrderStatusBarProps = {
  status: OrderStatus;
};

const OrderStatusBar: React.FC<OrderStatusBarProps> = ({ status }) => {
  const getStatusPercentage = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 25;
      case 'packing':
        return 50;
      case 'out for delivery':
        return 75;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full bg-gray-300 rounded-full h-3">
      <div
        className="bg-black h-3 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${getStatusPercentage(status)}%` }}
      />
    </div>
  );
};

export default OrderStatusBar;
