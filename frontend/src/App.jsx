import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import OrderHistory from './components/OrderHistory';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import CartModal from './components/CartModal';
import OrderModal from './components/OrderModal';
import LoginModal from './components/LoginModal.jsx'; // Import LoginModal
import RegisterModal from './components/RegisterModal'; // Import RegisterModal

const API_URL = 'http://localhost:5000/api'; // The new backend API URL

// --- helpers ---
const getJson = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

const isValidGcash = (num) => /^09\d{9}$/.test((num || '').trim());

const App = () => {
  const userId = 'demo-user-1234';

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userProfile, setUserProfile] = useState({ loyaltyPoints: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [gcashNumber, setGcashNumber] = useState('');
  const [view, setView] = useState('home');
  const [orders, setOrders] = useState([]);
  const [lastAddedCategory, setLastAddedCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const [isLoginOpen, setIsLoginOpen] = useState(false); // Login modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // Register modal state

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsData = await getJson(`${API_URL}/products`);
        setProducts(Array.isArray(productsData) ? productsData : []);

        const cartData = await getJson(`${API_URL}/cart/${userId}`);
        setCart(Array.isArray(cartData.items) ? cartData.items : []);

        const ordersData = await getJson(`${API_URL}/orders/${userId}`);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  const categories = ['All', ...new Set(products.map((p) => p?.category ?? 'Uncategorized'))];

  const handleAddToCart = async (product) => {
    const cartItemIndex = cart.findIndex((item) => item.productId === product._id);
    let updatedCart;
    if (cartItemIndex > -1) {
      updatedCart = cart.map((item, index) =>
        index === cartItemIndex ? { ...item, quantity: Number(item.quantity || 0) + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: Number(product.price || 0),
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];
    }
    setCart(updatedCart);

    try {
      const body = JSON.stringify({ userId, items: updatedCart });
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setLastAddedCategory(product?.category ?? 'Uncategorized');
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: updatedCart }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    } catch (e) {
      console.error('Error removing from cart:', e);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) return;
    if (paymentMethod === 'GCash' && !isValidGcash(gcashNumber)) return;

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    const orderData = {
      userId,
      items: cart,
      total,
      address: deliveryAddress,
      paymentMethod,
      status: 'Pending',
      gcashNumber: paymentMethod === 'GCash' ? gcashNumber.trim() : undefined,
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      // optimistic clear for snappier UX
      setCart([]);

      // sync with server state
      const cartData = await getJson(`${API_URL}/cart/${userId}`);
      setCart(Array.isArray(cartData.items) ? cartData.items : []);

      const ordersData = await getJson(`${API_URL}/orders/${userId}`);
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      setDeliveryAddress('');
      setGcashNumber('');
      setIsOrderModalOpen(false);
      setView('orders');
    } catch (e) {
      console.error('Error placing order:', e);
    }
  };

  const filteredProducts = products.filter((product) => {
    const name = product?.name?.toLowerCase() ?? '';
    const category = product?.category ?? 'Uncategorized';
    return (
      (selectedCategory === 'All' || category === selectedCategory) &&
      name.includes(searchQuery.toLowerCase())
    );
  });

  const recommendedProducts = lastAddedCategory
    ? products.filter((p) => (p?.category ?? 'Uncategorized') === lastAddedCategory).slice(0, 3)
    : products.slice(0, 3);

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'orders':
        return <OrderHistory orders={orders} />;
      case 'profile':
        return <ProfileView userId={userId} userProfile={userProfile} />;
      case 'home':
      default:
        return (
          <>
            <div className="overflow-hidden mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Featured Promotions</h2>
              <div className="flex overflow-x-auto gap-4 p-2 custom-scrollbar">
                <div className="bg-green-200 p-6 rounded-xl min-w-[80vw] sm:min-w-[400px] shadow-md flex-shrink-0">
                  <h3 className="text-xl font-bold text-green-800">Fresh Harvest Deals!</h3>
                  <p className="text-sm text-green-700 mt-1">Get 15% off all vegetables this week.</p>
                </div>
                <div className="bg-yellow-200 p-6 rounded-xl min-w-[80vw] sm:min-w-[400px] shadow-md flex-shrink-0">
                  <h3 className="text-xl font-bold text-yellow-800">Free Shipping</h3>
                  <p className="text-sm text-yellow-700 mt-1">On all orders over ₱50. Limited time offer!</p>
                </div>
              </div>
            </div>

            {lastAddedCategory && recommendedProducts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recommended for You</h2>
                <div className="flex overflow-x-auto gap-4 p-2 custom-scrollbar">
                  {recommendedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shop by Category</h2>
              <div className="flex overflow-x-auto gap-3 p-2 custom-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`py-2 px-4 rounded-full flex-shrink-0 font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 text-lg mt-8">No products found in this category.</div>
              )}
            </section>
          </>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800 flex flex-col pb-20">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #f3f4f6; }
      `}</style>

      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => setView('home')}
            className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            FarmShop
          </button>
          <div className="relative flex-grow mx-4 hidden sm:block">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 pr-4 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('profile')}
              className="p-2 px-4 flex items-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              My Profile
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}  // Open Login Modal
              className="p-2 px-4 flex items-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)} // Open Register Modal
              className="p-2 px-4 flex items-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 flex-grow">{renderView()}</main>

      <BottomNav view={view} setView={setView} />

      <CartModal
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        handleRemoveFromCart={handleRemoveFromCart}
        handleCheckout={handleCheckout}
      />

      <OrderModal
        isOrderModalOpen={isOrderModalOpen}
        setIsOrderModalOpen={setIsOrderModalOpen}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        gcashNumber={gcashNumber}
        setGcashNumber={setGcashNumber}
        handlePlaceOrder={handlePlaceOrder}
        cartTotal={cartTotal}
        isPlaceOrderDisabled={
          !deliveryAddress || (paymentMethod === 'GCash' && !isValidGcash(gcashNumber)) || cart.length === 0
        }
      />

      <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
      <RegisterModal isOpen={isRegisterOpen} setIsOpen={setIsRegisterOpen} />
    </div>
  );
};

export default App;

