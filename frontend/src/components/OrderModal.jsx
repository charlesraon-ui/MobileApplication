import React from 'react';

const OrderModal = ({
  isOrderModalOpen,
  setIsOrderModalOpen,
  deliveryAddress,
  setDeliveryAddress,
  paymentMethod,
  setPaymentMethod,
  gcashNumber,
  setGcashNumber,
  handlePlaceOrder,
  cartTotal,
  isPlaceOrderDisabled
}) => {
  if (!isOrderModalOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      <div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 id="order-modal-title" className="text-2xl font-bold text-gray-700">Order Details</h3>
          <button type="button" onClick={() => setIsOrderModalOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600">Delivery Address</label>
            <textarea
              rows="4"
              placeholder="Enter your full delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div>
            <span className="block text-sm font-semibold mb-2 text-gray-600">Payment Method</span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="form-radio text-green-500"
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="GCash"
                  checked={paymentMethod === 'GCash'}
                  onChange={() => setPaymentMethod('GCash')}
                  className="form-radio text-green-500"
                />
                <span className="ml-2">GCash</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'GCash' && (
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-600">GCash Number</label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="e.g., 09171234567"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₱{Number(cartTotal || 0).toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlaceOrderDisabled}
            className="w-full py-3 rounded-lg bg-green-500 text-white font-bold shadow-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
