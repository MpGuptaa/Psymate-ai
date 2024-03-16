import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody } from "reactstrap";

const ChildrenModal = ({
  children,
  show,
  onCloseClick,
  messages,
  onSubmit,
  buttons,
  size,
  scrollable = false,
}) => {
  return (
    <Modal
      size={size}
      scrollable={scrollable}
      isOpen={show}
      toggle={onCloseClick}
      centered={true}
    >
      <ModalBody className="p-3">
        <div className="">
          <div className="fs-15 mx-4 mx-sm-5">
            <p className="text-muted mx-4 mb-0">{messages}</p>
          </div>
          {children}
        </div>
        {buttons && (
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
        )}
      </ModalBody>
    </Modal>
  );
};

ChildrenModal.propTypes = {
  messages: PropTypes.string,
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
};

export default ChildrenModal;
