"use client"

import OrderStatusTracker from '@/components/track/OrderStatusTracker';
import LiveTracking from '@/components/track/LiveTracking';
import OrderSummary from '@/components/track/OrderSummary';


const orderItems = [
  { id: 1, name: 'Product A', quantity: 2, price: 25.0 },
  { id: 2, name: 'Product B', quantity: 1, price: 40.0 },
  { id: 3, name: 'Product C', quantity: 3, price: 15.0 },
];

const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

const Tracker: React.FC = () => {
    return (
        <div className="bg-white text-black min-h-screen flex flex-col gap-8 px-4 md:px-12 lg:px-24 py-8">
          <OrderStatusTracker />
          <LiveTracking />
          <OrderSummary orderId="123456789" items={orderItems} totalAmount={totalAmount} />
        </div>
    );
};

export default Tracker;
