import React from "react";
import { useReadings } from "../../hooks/useReading";
import { Table, Button, Spinner, Alert, Image } from "react-bootstrap";

export default function Historial() {
  const { readings, loading, error, fetchReadings } = useReadings();

  return (
    <div>
      <h2 className="mb-4">Historial de lecturas</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button onClick={fetchReadings} disabled={loading} className="mb-3">
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Actualizando...
          </>
        ) : (
          "Actualizar"
        )}
      </Button>

      {!loading && readings.length === 0 && <p>No hay lecturas registradas.</p>}

      {readings.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Medidor</th>
                <th>Lectura (°C)</th>
                <th>Foto</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r) => (
                <tr key={r.id}>
                  <td>{r.meter_number}</td>
                  <td>{r.reading}</td>
                  <td>
                    {r.photo_url ? (
                      <Image
                        src={r.photo_url}
                        alt="foto medidor"
                        width={80}
                        thumbnail
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
