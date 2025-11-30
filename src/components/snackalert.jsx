import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

export default function SnackAlert({ show, onClose, variant = "success", message, duration = 3000 }) {

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "250px",
      }}
    >
      <Alert variant={variant} onClose={onClose} dismissible>
        {message}
      </Alert>
    </div>
  );
}
