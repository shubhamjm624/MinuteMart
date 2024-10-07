import React from 'react';

type OrderStatusMsgProps = {
  msg: string;
};

const OrderStatusMsg: React.FC<OrderStatusMsgProps> = ({ msg }) => {
  return (
    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md w-full text-center">
      <p>{msg}</p>
    </div>
  );
};

export default OrderStatusMsg;
