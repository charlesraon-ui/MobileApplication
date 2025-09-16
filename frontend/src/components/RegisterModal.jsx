import React, { useState } from "react";

const RegisterModal = ({ setIsRegisterOpen, setView }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // res.ok is true for any 2xx (including 201)
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data.message || `Registration failed (${res.status})`);
        setSubmitting(false);
        return;
      }

      // Save token under the same key your app reads for auth
      if (data.token) localStorage.setItem("pos-token", data.token);

      setView("home");
      setIsRegisterOpen(false);
    } catch (err) {
      setErrorMessage("An error occurred during registration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage("");
            }}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            autoFocus
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />

          <button
            type="submit"
            disabled={submitting || !name || !email || !password}
            className={`w-full py-2 text-white rounded-lg transition-colors ${
              submitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          onClick={() => setIsRegisterOpen(false)}
          className="w-full py-2 mt-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
