import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useMeterReadings } from "../../hooks/useMeterReadings";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import CustomModal from "../../components/cutomModal";
import SnackAlert from "../../components/snackalert";
import { useNavigate } from "react-router-dom";

export default function RegMedidor() {
  const { user } = useAuth();
  const { addReading, loading, error } = useMeterReadings(user);
  const navigate = useNavigate();
  const [meterNumber, setMeterNumber] = useState("");
  const [reading, setReading] = useState("");
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);

  const [showModal, setShowModal] = useState(true);
    const [snack, setSnack] = useState({
    show: false,
    message: "",
    variant: "success",
    });


  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  // Obtener ubicación + temperatura
  const getLocationAndTemp = async () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation({ lat, lon });

        console.log("Ubicación:", lat, lon);

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=es`
          );
          const data = await res.json();

          if (data.main?.temp !== undefined) {
            setReading(data.main.temp);
            console.log("Temperatura:", data.main.temp);
          } else {
            alert("No se pudo obtener la temperatura");
          }
        } catch (err) {
          console.error(err);
          alert("Error al obtener temperatura");
        }
      },
      () => alert("No se pudo obtener la ubicación"),
      { enableHighAccuracy: true }
    );
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    getLocationAndTemp();
  };
  
   const handleCancelModal = () => {
        navigate("/home"); 
    };

  const showSnack = (message, variant = "success") => {
    setSnack({ show: true, message, variant });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location)
        return showSnack("Debe permitir la ubicación primero", "danger");

    await addReading({
        meterNumber,
        reading,
        file,
        location,
    });

    // Limpiar campos
    setMeterNumber("");
    setReading("");
    setFile(null);

    showSnack("Lectura guardada correctamente", "success");

    };

  return (
    <Container className="mt-2">

      {/* Modal de permisos */}
      <CustomModal
        show={showModal}
        onClose={handleCancelModal}
        onConfirm={handleConfirmModal}
        title="Permiso de ubicación"
        confirmText="Aceptar"
        cancelText="Cancelar"
      >
        Necesitamos acceder a tu ubicación para registrar automaticamente los grados.
      </CustomModal>

      <h2 className="mb-4">Registrar lectura del medidor</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="formMeterNumber">
              <Form.Label>Número del medidor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Lectura del medidor"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="formReading">
              <Form.Label>Grados actuales</Form.Label>
              <Form.Control
                type="number"
                value={reading}
                readOnly
                placeholder="Temperatura automática"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="formFile">
              <Form.Label>Foto del medidor</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar lectura"}
        </Button>
      </Form>
    <SnackAlert
        show={snack.show}
        message={snack.message}
        variant={snack.variant}
        onClose={() => setSnack({ ...snack, show: false })}
    />
    </Container>
    
  );
}
