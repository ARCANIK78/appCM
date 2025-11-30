import { useState } from "react";
import { uploadMeterPhoto, saveMeterReading } from "../services/useMeterReadings";

export const useMeterReadings = (user) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addReading = async ({ meterNumber, reading, file, location }) => {
    try {
      setLoading(true);
      setError(null);

      // 1. subir foto
      let photoUrl = null;
      if (file) {
        photoUrl = await uploadMeterPhoto(user.id, file);
      }

      // 2. guardar lectura
      const saved = await saveMeterReading({
        userId: user.id,
        meterNumber,
        reading,
        photoUrl,
        latitude: location?.lat || null,
        longitude: location?.lon || null,
      });

      return saved;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { addReading, loading, error };
};
