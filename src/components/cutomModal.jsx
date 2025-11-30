import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function CustomModal({ 
  show, 
  onClose, 
  onConfirm, 
  title = "Modal", 
  children, 
  confirmText = "Aceptar",
  cancelText = "Cancelar"
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      {title && <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>}

      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
