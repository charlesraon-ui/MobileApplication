import React from 'react';

const OrderHistory = ({ orders }) => (
  <section>
    <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Orders</h2>
    {orders.length === 0 ? (
      <div className="text-center text-gray-500 text-lg mt-8">You have no past orders.</div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">Order ID: {String(order._id).slice(0, 8)}...</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-2 space-y-2">
              {order.items.map((item, idx) => (
                <div key={`${item.productId || item._id || idx}`} className="flex items-center justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">₱{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg mb-2">
                <span>Total:</span>
                <span>₱{Number(order.total || 0).toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Delivery Address:</span> {order.address}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
                {order.gcashNumber ? ` (${order.gcashNumber})` : ''}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold">Order Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default OrderHistory;

