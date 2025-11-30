import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../hooks/useProfile";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import SnackAlert from "../../components/snackalert";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, error, saveProfile } = useProfile(user);

  const [name, setName] = useState("");
  const [snack, setSnack] = useState({ show: false, message: "", variant: "success" });

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
  }, [profile]);

  const handleSave = async () => {
    try {
      await saveProfile(name);
      setSnack({ show: true, message: "Perfil actualizado correctamente", variant: "success" });
    } catch (err) {
      setSnack({ show: true, message: "Error al actualizar perfil", variant: "danger" });
    }
  };

  if (loading)
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );

  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <h2>Editar perfil</h2>
      <Form>
        <Form.Group controlId="formFullName" className="mb-3">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSave}>
          Guardar cambios
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
};

export default Profile;
