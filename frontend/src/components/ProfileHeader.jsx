// src/components/ProfileHeader.jsx
import { useEffect, useState } from "react";
import { getMe } from "../apiClient";

export default function ProfileHeader() {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getMe()
      .then((data) => setUser(data.user))
      .catch((e) => {
        setErr(e.message);
        if (e.status === 401) {
          localStorage.removeItem("pos-token");
          // optionally trigger your login view here
        }
      });
  }, []);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!user) return <div>Loading…</div>;
  return <div>Hi, {user.name}</div>;
}
