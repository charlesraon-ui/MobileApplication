import React, { useState } from 'react';

const RegisterModal = ({ setIsRegisterOpen, setView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setView('home');
        setIsRegisterOpen(false);
        // Save user data, such as token or profile info
        localStorage.setItem('token', data.token);
      } else {
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration');
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <button
          onClick={handleRegister}
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Register
        </button>
        <button
          onClick={() => setIsRegisterOpen(false)}
          className="w-full py-2 mt-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
