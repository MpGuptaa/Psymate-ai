import PropTypes from "prop-types";
import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { Input, Label } from "reactstrap";
import axios from "axios";
import config from "../../config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Tools from "../../pages/Forms/Builder/Tools";

const UserVerifyDialog = ({ show, onCloseClick, data }) => {
  const [type, setUserType] = useState("doctor");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const roles = [
    { value: "users", label: "Users" },
    { value: "superAdmin", label: "SuperAdmin" },
    { value: "calendar", label: "Calendar" },
    { value: "crm", label: "CRM" },
    { value: "dashboard", label: "Dashboard" },
  ];
  const handleUserType = (e) => {
    setUserType(e.target.value);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleOptionChange = (value) => {
    if (selectedRoles.includes(value)) {
      setSelectedRoles(selectedRoles.filter((option) => option !== value));
    } else {
      setSelectedRoles([...selectedRoles, value]);
    }
  };

  const handleCall = async () => {
    await axios
      .post(config.api.API_URL + `/login/verified/${data}`, {
        type: type,
        userId: userId,
        password: password,
        roles: selectedRoles?.roles?.map((_) => _.displayName)
      })
      .then((success) => {
        toast.success("User Verified Successfully", { autoClose: 3000 });
      })
      .catch((err) => {
        toast.error("User Verification Failed", { autoClose: 3000 });
      });
    onCloseClick();
  };
  console.log(selectedRoles?.roles?.map((_) => _.displayName));

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="row">
          <div className="mb-2">
            <Label htmlFor="labelInput" className="form-label">
              Type
            </Label>
            <select className="form-select" id="labelInput" onChange={handleUserType} defaultValue="doctor">
              <option value="doctor">Doctor</option>
              <option value="team">Team</option>
            </select>
          </div>
          <div className="col-6 mb-2">
            <Label htmlFor="labelInput" className="form-label">
              User Id
            </Label>
            <Input type="text" className="form-control" id="labelInput" onChange={handleUserIdChange} />
          </div>
          <div className="col-6 mb-2">
            <Label htmlFor="labelInput" className="form-label">
              Password
            </Label>
            <Input type="text" className="form-control" id="labelInput" onChange={handlePasswordChange} />
          </div>
        </div>
        <Tools
          state={selectedRoles}
          setState={setSelectedRoles}
          inputs={[
            {
              label: "Add Roles",
              variants: "multiple,searchable",
              name: "roles",
              element: "api",
              options: "data/roles?searchBy=displayName",
              items: "displayName,description",
            },
          ]}
        />
        {/* <div className="mb-2" style={{ maxHeight: "100px", overflowY: "auto" }}>
          <Label className="form-label">Roles</Label>
          {roles.map((option) => (
            <div key={option.value} className="form-check">
              <input
                type="checkbox"
                id={option.value}
                className="form-check-input"
                value={option.value}
                checked={selectedRoles?.includes(option.value)}
                onChange={() => handleOptionChange(option.value)}
              />
              <label htmlFor={option.value} className="form-check-label">
                {option.label}
              </label>
            </div>
          ))}
        </div> */}
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            disabled={userId === "" || password === ""}
            type="button"
            className="btn btn-success"
            data-bs-dismiss="modal"
            onClick={handleCall}
          >
            Verified
          </button>
          <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onCloseClick}>
            Close
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

UserVerifyDialog.propTypes = {
  messages: PropTypes.string,
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
  data: PropTypes.any,
};

export default UserVerifyDialog;
