import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody } from "reactstrap";

const ConfirmationDialogBox = ({ show, onCloseClick, messages, onSubmit }) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3">
        <div className="mt-2 text-center">
          <div className="fs-15">
            <p className="text-muted mx-4 mb-0">{messages}</p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            Close
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger "
            id="delete-record"
            onClick={onSubmit}
          >
            Confirm
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

ConfirmationDialogBox.propTypes = {
  messages: PropTypes.string,
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
};

export default ConfirmationDialogBox;
