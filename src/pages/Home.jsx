import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useProfile } from "../hooks/useProfile";

const Home = () => {
  const { user } = useAuth();
  const { profile, loading, error, saveProfile } = useProfile(user);
  const [name, setName] = useState("");

  const handleSave = () => {
    saveProfile(name);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/*<p>Email: {user.email}</p>*/}
      <p>Bienvenido: {profile?.full_name || "No name set yet"}</p>
      <input
        type="text"
        placeholder="Your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Home;
