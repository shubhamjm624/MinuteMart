import OrderStatusMsg from '@/components/track/OrderStatusMsg';
import OrderStatusBar from '@/components/track/OrderStatusBar';

type OrderStatus = 'confirmed' | 'packing' | 'out for delivery' | 'delivered';

type OrderStatusDetails = {
  msg: string;
  status: OrderStatus;
};

const OrderStatusTracker = () => {
  const randomOrderStatusDetailsObject: OrderStatusDetails = {
    msg: 'Your order is on its way!',
    status: 'confirmed',
  };

  return (
    <div className="flex flex-col items-center w-full gap-4 p-6 bg-gray-50 rounded-lg shadow-md">
      <OrderStatusMsg msg={randomOrderStatusDetailsObject.msg} />
      <OrderStatusBar status={randomOrderStatusDetailsObject.status} />
    </div>
  );
};

export default OrderStatusTracker;
