import { useState, useEffect } from 'react';

// Main App component that manages the entire application state.
// All other components are defined below and used within this file.
export default function App() {
  // State to determine if a user is logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // New state for the splash screen visibility.
  const [showSplash, setShowSplash] = useState(true);

  // Handles successful login, changing the application's state.
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Handles logout, changing the application's state.
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Effect to hide the splash screen after a delay.
  useEffect(() => {
    // Set a timer to hide the splash screen after 3 seconds.
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Cleanup the timer on component unmount.
    return () => clearTimeout(timer);
  }, []);

  // Conditionally render the SplashScreen, AuthPage or the ProfilePage based on state.
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {showSplash ? (
        <SplashScreen />
      ) : isLoggedIn ? (
        <ProfilePage onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

// --- SPLASH SCREEN COMPONENT ---
// This component displays a splash screen with a logo and a pulsating effect.
function SplashScreen() {
  // This is the correct way to reference your image URL.
  // We use the `src` variable directly in the `<img>` tag.
  const src = 'https://scontent.fmnl33-2.fna.fbcdn.net/v/t39.30808-6/456139438_122169005354230777_3617883581683179186_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=AU3hwJuUpk0Q7kNvwEDOBgg&_nc_oc=Adk35kM0y2ejr3e3gUr-HTblbPezcOWTOyDfzXE_nxv8qr-6qGZ98zKIkCCHkItlp_DRQ2F9zjbJmJYjVCuG1Pky&_nc_zt=23&_nc_ht=scontent.fmnl33-2.fna&_nc_gid=g4p3aQ2dep-tsXb1RFiRIw&oh=00_AfUvckLUTSAgUqGs5NLTXtYakGprpLM9gopmua1520ayjQ&oe=68AE614B';

  return (
    // The main container for the splash screen, centering its content.
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* A relative container to position the ping animation correctly. */}
      <div className="relative">
        {/* The 'animate-ping' div creates a pulse effect around the logo. */}
        <div className="animate-ping absolute inset-0 rounded-full bg-green-500 opacity-75"></div>

        {/* The image tag using the defined `src` variable. */}
        <img
          src={src}
          alt="Company Logo"
          className="relative w-40 h-40 object-contain rounded-full shadow-lg"
        />
      </div>
    </div>
  );
}

// --- AUTHENTICATION PAGE COMPONENT ---
// This component handles user authentication (sign-in, sign-up, forgot password).
function AuthPage({ onLoginSuccess }) {
  // State for managing the current view (signIn, signUp, forgotPassword)
  const [currentPage, setCurrentPage] = useState('signIn');
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for API call status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // The base URL for our backend API.
  const API_BASE_URL = '/api';

  // Function to handle the login API call
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful, call the parent function to change the view
        onLoginSuccess();
      } else {
        // Display the error message from the API
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (e) {
      console.error("Login failed:", e);
      setError('Network error: Could not connect to the server. Is the backend running?');
    }
    setLoading(false);
  };

  // Function to handle the registration API call
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // If registration is successful, automatically log the user in
        onLoginSuccess();
      } else {
        setError(data.message || 'Registration failed. The email might already be in use.');
      }
    } catch (e) {
      console.error("Registration failed:", e);
      setError('Network error: Could not connect to the server. Is the backend running?');
    }
    setLoading(false);
  };

  // Inline SVG for the lock icon
  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11.5a1 1 0 11-2 0 1 1 0 012 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  );

  // Inline SVG for the user icon
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  // Inline SVG for the eye icon to show/hide password
  const EyeIcon = ({ onClick }) => (
    <button type="button" onClick={onClick} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  );

  // Email icon
  const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 1a2 2 0 012-2h-18a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2z" />
    </svg>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'signIn':
        return (
          <form onSubmit={handleLogin} className="flex flex-col items-center justify-center p-8 w-80 md:w-96">
            <h1 className="text-3xl font-bold mb-8">Go Agri Trading</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <div className="w-full mb-4 relative">
              <UserIcon />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" required />
            </div>
            <div className="w-full mb-4 relative">
              <LockIcon />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" required />
              <EyeIcon onClick={() => setShowPassword(!showPassword)} />
            </div>
            <button type="button" onClick={() => setCurrentPage('forgotPassword')} className="text-sm text-green-500 hover:text-green-600 font-semibold self-end">Forgot Password?</button>
            <button type="submit" className="w-full mt-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="mt-4 text-sm text-gray-600">Don't have an account? <button type="button" onClick={() => setCurrentPage('signUp')} className="text-green-500 font-semibold hover:text-green-600">Sign Up</button></p>
          </form>
        );

      case 'signUp':
        return (
          <form onSubmit={handleRegister} className="flex flex-col items-center justify-center p-8 w-80 md:w-96">
            <h1 className="text-3xl font-bold mb-8">Create an account</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <div className="w-full mb-4 relative">
              <UserIcon />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" required />
            </div>
            <div className="w-full mb-4 relative">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                required
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)} />
            </div>
            <div className="w-full mb-4 relative">
              <LockIcon />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                required
              />
              <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>
            <p className="text-xs text-center text-gray-500 mt-4">
              By clicking the <span className="text-green-500 font-semibold">Register</span> button, you agree to the public offer
            </p>
            <button type="submit" className="w-full mt-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="mt-4 text-sm text-gray-600">Already have an account? <button type="button" onClick={() => setCurrentPage('signIn')} className="text-green-500 font-semibold hover:text-green-600">Sign In</button></p>
          </form>
        );

      case 'forgotPassword':
        return (
          <div className="flex flex-col items-center justify-center p-8 w-80 md:w-96">
            <h1 className="text-3xl font-bold mb-8 text-center">Forgot password?</h1>
            <div className="w-full mb-4 relative">
              <EmailIcon />
              <input type="email" placeholder="Enter your email address" className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * We will send you a message to set or reset your new password
            </p>
            <button type="button" onClick={() => {}} className="w-full mt-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
              Submit
            </button>
            <p className="mt-4 text-sm text-gray-600">Go back to <button type="button" onClick={() => setCurrentPage('signIn')} className="text-green-500 font-semibold hover:text-green-600">Sign In</button></p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    // The main container for the AuthPage, now consistently using flexbox for centering.
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-4">
      {/* Main card container matching the design */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm sm:max-w-md">
        {renderPage()}
      </div>
    </div>
  );
}

// --- PROFILE PAGE COMPONENT ---
// This component displays the user's profile, including addresses, orders, and rewards.
function ProfilePage({ onLogout }) {
  // State to manage the currently active page.
  const [currentPage, setCurrentPage] = useState('shipping');
  // State to manage the visibility of the "Add new address" form
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  // State to hold the current address being edited
  const [editingAddress, setEditingAddress] = useState(null);
  // State to hold the list of shipping addresses from the API
  const [shippingAddresses, setShippingAddresses] = useState([]);
  // State for a simple loading indicator
  const [loading, setLoading] = useState(true);
  // State to hold a descriptive error message if an API call fails
  const [apiError, setApiError] = useState(null);

  // The base URL for our backend API.
  const API_BASE_URL = '/api';

  // Page data and content based on the provided image
  const profileData = {
    name: 'Sofia Havertz',
    profileImageUrl: 'https://placehold.co/100x100/A3A3A3/FFFFFF?text=SH',
  };

  const orderHistory = [{
    id: '#3456_788',
    dates: 'October 17, 2023',
    status: 'Delivered',
    price: '$1234.00',
  }, {
    id: '#3456_788',
    dates: 'October 17, 2023',
    status: 'Delivered',
    price: '$1234.00',
  }];

  const loyaltyBenefits = [
    'Exclusive offers',
    'Early access to sales',
    'Special discounts',
  ];

  // Fetch addresses from the API when the component loads
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setApiError(null); // Clear previous errors

      try {
        const response = await fetch(`${API_BASE_URL}/addresses`);

        if (!response.ok) {
          const errorMsg = `HTTP Error: ${response.status} ${response.statusText}. Please check if the backend server is running and the endpoint is correct.`;
          throw new Error(errorMsg);
        }

        const data = await response.json();
        setShippingAddresses(data);
      } catch (e) {
        const errorMsg = `Network Error: ${e.message}. This could be a CORS issue or the backend server is not running.`;
        console.error("Error fetching addresses: ", e);
        setApiError(errorMsg);
      }
      setLoading(false);
    };

    fetchAddresses();
  }, [API_BASE_URL]);

  // Handler for the "Edit" button
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowNewAddressForm(true);
  };

  // Handler for saving a new or edited address to the API
  const handleSaveAddress = async (newAddress) => {
    if (apiError) {
      console.warn("API not configured. Cannot save address.");
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      if (editingAddress?.id) {
        await fetch(`${API_BASE_URL}/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAddress),
        });
      } else {
        await fetch(`${API_BASE_URL}/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAddress),
        });
      }
      const response = await fetch(`${API_BASE_URL}/addresses`);
      const data = await response.json();
      setShippingAddresses(data);
      setShowNewAddressForm(false);
      setEditingAddress(null);
    } catch (e) {
      const errorMsg = `Save Error: ${e.message}. Check your backend server.`;
      console.error("Error saving address: ", e);
      setApiError(errorMsg);
    }
    setLoading(false);
  };

  // Handler for deleting an address from the API
  const handleDeleteAddress = async (id) => {
    if (apiError) {
      console.warn("API not configured. Cannot delete address.");
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: 'DELETE',
      });
      setShippingAddresses(shippingAddresses.filter(addr => addr.id !== id));
    } catch (e) {
      const errorMsg = `Delete Error: ${e.message}. Check your backend server.`;
      console.error("Error deleting address: ", e);
      setApiError(errorMsg);
    }
    setLoading(false);
  };

  // Helper function to render a page based on the current state
  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      );
    }

    if (apiError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600 bg-red-100 rounded-lg shadow-md mt-6">
          <h4 className="text-lg font-bold text-red-700">API Connection Error</h4>
          <p className="mt-2 text-red-600">{apiError}</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'shipping':
        return (
          <ShippingAddressPage
            shippingAddresses={shippingAddresses}
            showNewAddressForm={showNewAddressForm}
            editingAddress={editingAddress}
            handleEditAddress={handleEditAddress}
            handleDeleteAddress={handleDeleteAddress}
            handleSaveAddress={handleSaveAddress}
            setShowNewAddressForm={setShowNewAddressForm}
            setEditingAddress={setEditingAddress}
          />
        );
      case 'orders':
        return <OrderHistoryPage orderHistory={orderHistory} setCurrentPage={setCurrentPage} />;
      case 'loyalty':
        return <LoyaltyRewardsPage loyaltyBenefits={loyaltyBenefits} setCurrentPage={setCurrentPage} />;
      case 'track':
        return <TrackOrderPage onLogout={onLogout} setCurrentPage={setCurrentPage} />;
      default:
        return null;
    }
  };

  // Shared header component for all pages
  const Header = () => (
    <div className="bg-white p-4 flex justify-between items-center shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <div className="flex items-center">
        <span className="text-2xl font-bold text-gray-800">Agro</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );

  // Reusable profile section component
  const ProfileSection = () => (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center mt-6">
      <div className="relative">
        <img
          src={profileData.profileImageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-gray-200"
        />
        <div className="absolute bottom-0 right-0 p-1 bg-gray-200 rounded-full cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.86-1.554A2 2 0 0110.103 3h3.794a2 2 0 011.664.89l.86 1.554A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <h2 className="text-lg font-semibold mt-2">{profileData.name}</h2>
      <select
        className="mt-4 w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={currentPage}
        onChange={(e) => setCurrentPage(e.target.value)}
      >
        <option value="shipping">Shipping adress</option>
        <option value="orders">Order History</option>
        <option value="loyalty">Loyalty rewards</option>
        <option value="track">My Profile</option>
      </select>
    </div>
  );

  return (
    <div className="bg-gray-200 min-h-screen font-sans">
      <Header />
      <div className="max-w-md mx-auto">
        <ProfileSection />
        {renderPage()}
      </div>
    </div>
  );
}

// New component for the Address form
const AddressForm = ({ address, onSave, onCancel }) => {
  const [name, setName] = useState(address?.name || '');
  const [phone, setPhone] = useState(address?.phone || '');
  const [fullAddress, setFullAddress] = useState(address?.address || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      // A simple way to get an ID for new addresses, since we're not using a real backend
      id: address?.id || Date.now(),
      type: address?.type || 'New Address',
      name,
      phone,
      address: fullAddress,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">{address ? 'Edit Address' : 'Add New Address'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

// Page component for Shipping Address
const ShippingAddressPage = ({
  shippingAddresses,
  showNewAddressForm,
  editingAddress,
  handleEditAddress,
  handleDeleteAddress,
  handleSaveAddress,
  setShowNewAddressForm,
  setEditingAddress,
}) => (
  <div className="p-4 space-y-4">
    <h3 className="text-lg font-semibold mt-4">Address</h3>
    {showNewAddressForm ? (
      <AddressForm
        address={editingAddress}
        onSave={handleSaveAddress}
        onCancel={() => {
          setShowNewAddressForm(false);
          setEditingAddress(null); // Clear editing state on cancel
        }}
      />
    ) : (
      <>
        {shippingAddresses.length > 0 ? (
          shippingAddresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{address.type}</span>
                <div className="flex space-x-2">
                  <button
                    className="text-sm text-indigo-500 font-semibold"
                    onClick={() => handleEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-500 font-semibold"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{address.name}</p>
              <p className="text-gray-700">{address.phone}</p>
              <p className="text-gray-700">{address.address}</p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-4 text-center text-gray-500">
            No shipping addresses found.
          </div>
        )}
        <button
          type="button"
          className="w-full text-center text-indigo-500 font-semibold py-2"
          onClick={() => {
            setShowNewAddressForm(true);
            setEditingAddress(null);
          }}
        >
          Add new shipping address
        </button>
      </>
    )}
  </div>
);

// Page component for Order History
const OrderHistoryPage = ({ orderHistory }) => (
  <div className="p-4 space-y-4">
    <h3 className="text-lg font-semibold mt-4">Order History</h3>
    {orderHistory.map((order, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-500">Number ID</div>
          <div className="text-gray-900 font-medium">{order.id}</div>
          <div className="text-gray-500">Dates</div>
          <div className="text-gray-900 font-medium">{order.dates}</div>
          <div className="text-gray-500">Status</div>
          <div className="text-gray-900 font-medium">{order.status}</div>
          <div className="text-gray-500">Price</div>
          <div className="text-gray-900 font-medium">{order.price}</div>
        </div>
      </div>
    ))}
  </div>
);

// Page component for Loyalty Rewards
const LoyaltyRewardsPage = ({ loyaltyBenefits }) => (
  <div className="p-4 space-y-4">
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4">Loyalty rewards</h3>
      <div className="bg-green-600 rounded-xl p-4 text-white flex justify-between items-center mb-4">
        <div>
          <h4 className="font-medium">Loyalty Card</h4>
          <span className="text-3xl font-bold">₱15,000</span>
          <p className="text-sm">Total earnings</p>
        </div>
        <div>
          <span className="text-xs font-semibold">₱5,000 to next tier</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">Eligibility</h4>
        <p className="text-sm text-green-600 flex items-center mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Eligible for loyalty rewards
        </p>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-900">Benefits</h4>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
          {loyaltyBenefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// Page component for Track Order / Profile
const TrackOrderPage = ({ onLogout, setCurrentPage }) => (
  <div className="p-4 space-y-4">
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col mt-6">
      <h3 className="text-lg font-semibold mb-2">My Profile</h3>
      <ul className="space-y-4 text-gray-700">
        <li className="flex justify-between items-center cursor-pointer" onClick={() => setCurrentPage('orders')}>
          <span className="text-gray-900 font-medium">My orders</span>
          <span className="text-sm text-gray-500">Already have 12 orders</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className="flex justify-between items-center cursor-pointer" onClick={() => setCurrentPage('shipping')}>
          <span className="text-gray-900 font-medium">Shipping addresses</span>
          <span className="text-sm text-gray-500">2 addresses</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className="flex justify-between items-center cursor-pointer">
          <span className="text-gray-900 font-medium">Payment methods</span>
          <span className="text-sm text-gray-500">Visa **34</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className="flex justify-between items-center cursor-pointer" onClick={onLogout}>
          <span className="text-gray-900 font-medium">Sign Out</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </li>
      </ul>
    </div>

    <div className="bg-white rounded-xl shadow-md p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Settings</h3>
      <ul className="space-y-4 text-gray-700">
        <li className="flex justify-between items-center cursor-pointer">
          <span className="text-gray-900 font-medium">New password, password</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
        <li className="flex justify-between items-center cursor-pointer">
          <span className="text-gray-900 font-medium">Set transaction password</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
      </ul>
    </div>
  </div>
);
