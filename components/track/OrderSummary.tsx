import React from 'react';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orderId, items, totalAmount }) => {
  return (
    <div className="flex flex-col items-center w-full p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <p className="text-lg font-medium text-gray-700 mb-4">
          Order ID: <span className="font-normal">{orderId}</span>
        </p>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-gray-800">{item.name}</span>
              <span className="text-gray-600">{item.quantity} x ${item.price.toFixed(2)}</span>
              <span className="text-gray-800 font-semibold">${(item.quantity * item.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between items-center text-lg font-semibold">
          <span>Total Amount:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
