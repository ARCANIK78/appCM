import { useState, useEffect } from "react";
import { fetchReadingsService } from "../services/fetchReadings";

export const useReadings = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchReadingsService();
      setReadings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Opcional: traer datos al cargar el hook
  useEffect(() => {
    fetchReadings();
  }, []);

  return { readings, fetchReadings, loading, error };
};
