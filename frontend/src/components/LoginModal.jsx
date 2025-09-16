import React, { useState } from "react";

const LoginModal = ({ setIsLoginOpen, setView }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data.message || `Login failed (${res.status})`);
        setSubmitting(false);
        return;
      }

      // Save auth token consistently
      if (data.token) localStorage.setItem("pos-token", data.token);
      // If you return user, you can store it too:
      // if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      setView("home");
      setIsLoginOpen(false);
    } catch (err) {
      setErrorMessage("An error occurred while logging in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            autoFocus
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
            disabled={submitting || !email || !password}
            className={`w-full py-2 text-white rounded-lg transition-colors ${
              submitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={() => setIsLoginOpen(false)}
          className="w-full py-2 mt-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
