import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useMeterReadings } from "../../hooks/useMeterReadings";
import { Container, Row, Col, Form, Button, Alert, Image } from "react-bootstrap";
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
  const [snack, setSnack] = useState({ show: false, message: "", variant: "success" });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  // --- Ubicación + temperatura ---
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
          if (data.main?.temp !== undefined) setReading(data.main.temp);
        } catch (err) {
          console.error(err);
        }

        // Abrir cámara automáticamente
        startCamera();
      },
      () => alert("No se pudo obtener la ubicación"),
      { enableHighAccuracy: true }
    );
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    getLocationAndTemp();
  };

  const handleCancelModal = () => navigate("/home");

  const showSnack = (message, variant = "success") =>
    setSnack({ show: true, message, variant });

  // --- Form submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return showSnack("Debe permitir la ubicación primero", "danger");
    if (!file) return showSnack("Debe tomar una foto", "danger");

    await addReading({ meterNumber, reading, file, location });

    // Limpiar
    setMeterNumber("");
    setReading("");
    setFile(null);
    stopCamera();

    showSnack("Lectura guardada correctamente", "success");
  };

  // --- Cámara HTML5 ---
  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraStarted(true);
    } catch (err) {
      console.error("No se pudo acceder a la cámara", err);
      alert("No se pudo acceder a la cámara. Revisa permisos y HTTPS.");
    }
  };

  const stopCamera = () => {
    if (!videoRef.current) return;
    const stream = videoRef.current.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setCameraStarted(false);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const photoFile = new File([blob], `medidor-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setFile(photoFile);
    }, "image/jpeg");
  };

  useEffect(() => {
    return () => stopCamera(); // limpiar cámara al desmontar
  }, []);

  return (
    <Container className="mt-2">
      <CustomModal
        show={showModal}
        onClose={handleCancelModal}
        onConfirm={handleConfirmModal}
        title="Permiso de ubicación"
        confirmText="Aceptar"
        cancelText="Cancelar"
      >
        Necesitamos acceder a tu ubicación para registrar automáticamente los grados.
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
                placeholder="Número del medidor"
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
            <Form.Group>
              <Form.Label>Foto del medidor</Form.Label>

              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
                <video
                  ref={videoRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 12,
                    objectFit: "cover",
                  }}
                  autoPlay
                  muted
                  playsInline
                />
              </div>

              <div className="mt-2 d-flex gap-2">
                <Button variant="primary" onClick={takePhoto}>
                  Tomar foto
                </Button>
              </div>

              <canvas ref={canvasRef} style={{ display: "none" }} />

              {file && (
                <div className="mt-2 text-center">
                  <p>Foto lista: {file.name}</p>
                  <Image
                    src={URL.createObjectURL(file)}
                    thumbnail
                    style={{ maxWidth: "100%", borderRadius: 12 }}
                  />
                </div>
              )}
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
