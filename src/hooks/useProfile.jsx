import { useState, useEffect } from "react";
import { getProfile, upsertProfile } from "../services/profileServices";

export const useProfile = (user) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getProfile(user.id);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (fullName) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await upsertProfile(user.id, fullName);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return { profile, loading, error, saveProfile, reload: loadProfile };
};
