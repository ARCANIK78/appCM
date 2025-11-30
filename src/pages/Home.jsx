import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useProfile } from "../hooks/useProfile";
import CustomModal from "../components/cutomModal";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";

const Home = () => {
  const { user } = useAuth();
  const { profile, loading, error, saveProfile } = useProfile(user);
  const [loadingPage, setLoadingPage] = useState(true);

  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Si no hay nombre, abrir modal
    if (!loading && profile?.full_name === null) {
      setShowModal(true);
    }
  }, [loading, profile]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }
    saveProfile(name);
    setShowModal(false);
    window.location.reload(); //
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" />
      </div>
    );

  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <Container className="mt-7">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <h2 className="mb-5 text-center">Bienvenido {profile?.full_name || "Usuario"}</h2>
        </Col>
      </Row>

      {/* Modal para pedir nombre si es null */}
      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSave}
        title="Ingresa tu nombre"
        confirmText="Guardar"
        cancelText="Cancelar"
      >
        <Form>
          <Form.Group controlId="modalName">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </CustomModal>
    </Container>
  );
};

export default Home;
