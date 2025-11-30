import { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/client";

const Register = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const register = (email, password) =>
    supabase.auth.signUp({ email, password });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !emailRef.current?.value ||
      !passwordRef.current?.value ||
      !confirmPasswordRef.current?.value
    ) {
      setErrorMsg("Por favor, completa todos los campos");
      return;
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    try {
      setErrorMsg("");
      setLoading(true);

      const { data, error } = await register(
        emailRef.current.value,
        passwordRef.current.value
      );

      console.log(data);
      console.log(error);

      if (!error && data) {
        setMsg(
          "Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta"
        );
      } else if (error) {
        setErrorMsg(error.message);
      }
    } catch (error) {
      setErrorMsg("Error al crear la cuenta");
    }

    setLoading(false);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Registro</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Form.Group id="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Form.Group id="confirm-password">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control type="password" ref={confirmPasswordRef} required />
            </Form.Group>

            {errorMsg && (
              <Alert
                variant="danger"
                onClose={() => setErrorMsg("")}
                dismissible
              >
                {errorMsg}
              </Alert>
            )}

            {msg && (
              <Alert
                variant="success"
                onClose={() => setMsg("")}
                dismissible
              >
                {msg}
              </Alert>
            )}

            <div className="text-center mt-2">
              <Button disabled={loading} type="submit" className="w-50">
                Registrarse
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        ¿Ya tienes cuenta? <Link to={"/login"}>Inicia sesión</Link>
      </div>
    </>
  );
};

export default Register;
