import React from "react";

import { Modal, Button } from "react-bootstrap";

export default function CommonModal({
  show,
  handleClose,
  title,
  content,
  onConfirm,
  onCancel,
  children,
}) {
  const handleConfirm = () => {
    onConfirm();

    handleClose();
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{content && <p>{content}</p>}</Modal.Body>
      {children}

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
