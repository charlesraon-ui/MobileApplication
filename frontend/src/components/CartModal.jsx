import React from 'react';

const CartModal = ({ isCartOpen, setIsCartOpen, cart, handleRemoveFromCart, handleCheckout }) => {
  if (!isCartOpen) return null;

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-lg transform transition-transform duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h3 id="cart-title" className="text-2xl font-bold">Your Cart</h3>
            <button type="button" onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow my-4 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">Your cart is empty.</div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.productId || idx}`} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex-grow">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">₱{Number(item.price || 0).toFixed(2)} x {Number(item.quantity || 0)}</div>
                  </div>
                  <div className="font-bold text-gray-700">₱{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</div>
                  <button type="button" onClick={() => handleRemoveFromCart(item.productId)} className="ml-4 text-red-500 hover:text-red-700" aria-label={`Remove ${item.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>₱{cartTotal.toFixed(2)}</span>
              </div>
              <button type="button" onClick={handleCheckout} className="w-full py-3 rounded-full bg-green-500 text-white text-lg font-bold shadow-lg hover:bg-green-600 transition-colors">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
