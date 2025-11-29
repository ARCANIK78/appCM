import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useMeterReadings } from "../../hooks/useMeterReadings";

export default function RegMedidor() {
  const { user } = useAuth();
  const { addReading, loading, error } = useMeterReadings(user);

  const [meterNumber, setMeterNumber] = useState("");
  const [reading, setReading] = useState(""); // temperatura automática
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  // Obtener ubicación y temperatura
  const getLocationAndTemp = async () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation({ lat, lon });

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=es`
          );
          const data = await res.json();
          if (data.main?.temp !== undefined) {
            setReading(data.main.temp); // temperatura en °C sin redondeo

          } else {
            console.log("OpenWeather data:", data);
            alert("No se pudo obtener la temperatura");
          }
        } catch (err) {
          console.error(err);
          alert("Error al consultar la temperatura");
        }
      },
      () => alert("No se pudo obtener la ubicación"),
      { enableHighAccuracy: true }
    );
  };

  // Guardar lectura
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("Debe obtener la ubicación primero");

    await addReading({
      meterNumber,
      reading,
      file,
      location,
    });

    alert("Lectura guardada correctamente");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar lectura del medidor</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Número del medidor"
        value={meterNumber}
        onChange={(e) => setMeterNumber(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Grados actuales"
        value={reading}
        readOnly
      />

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />

      <button type="button" onClick={getLocationAndTemp}>
        Obtener ubicación y temperatura
      </button>

      {location && <p>Ubicación: {location.lat}, {location.lon}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar lectura"}
      </button>
    </form>
  );
}
