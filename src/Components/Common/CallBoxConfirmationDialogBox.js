import PropTypes from "prop-types";
import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { Input, Label } from "reactstrap";
import axios from "axios";
import config from "../../config";
import { useSelector } from "react-redux";

const CallBoxConfirmationDialogBox = ({ show, onCloseClick }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useSelector((state) => ({
    user: state.Profile.user,
  }));

  const handlePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleCall = async () => {
    await axios
      .post(config.api.API_URL + `/call/users`, {
        from: user.phone,
        to: phoneNumber,
      })
      .then((success) => {
        console.log("success", success);
      })
      .catch((err) => {
        console.log("err", err);
      });
    onCloseClick();
  };
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div>
          <Label htmlFor="labelInput" className="form-label">
            Phone Number
          </Label>
          <Input
            type="text"
            className="form-control"
            id="labelInput"
            onChange={handlePhoneNumber}
          />
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn btn-success"
            data-bs-dismiss="modal"
            onClick={handleCall}
          >
            Call
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            Close
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

CallBoxConfirmationDialogBox.propTypes = {
  messages: PropTypes.string,
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
};

export default CallBoxConfirmationDialogBox;
