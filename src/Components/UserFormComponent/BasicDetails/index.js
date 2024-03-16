import React, { useState } from "react";
import "./index.css";
import { useDropzone } from "react-dropzone";

const BasicDetails = ({ state }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    // Handle the selected file, for example, by displaying a preview
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Accept only image files
    multiple: false, // Allow only one file to be selected
  });

  const titles = [
    { label: "Mr.", value: "Mr." },
    { label: "Ms.", value: "Ms." },
    { label: "Dr.", value: "Dr." },
  ];

  return (
    <div className="basic-outer-container">
      <div className="basic-heading-container">
        <h2>Basic Details*</h2>
      </div>
      <div className="basic-field-container">
        <div className="basic-form-flex-container">
          <div>
            <label>Profile Photo</label>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected Profile Photo"
                  style={{ width: "150px", height: "150px" }}
                />
              ) : (
                <i className="change-cam las la-camera"></i>
              )}
            </div>
          </div>
        </div>
        <div className="basic-form-flex-container">
          <div className="basic-first-container tile-flex">
            <label>Title</label>
            <select
              // value={selectedTitle}
              // onChange={handleDropdownChange}
              className="title-select-container"
            >
              <option value="">Select a Title</option>
              {titles.map((title) => (
                <option key={title.value} value={title.value}>
                  {title.label}
                </option>
              ))}
            </select>
          </div>
          <div className="basic-left-container">
            <div className="name-container">
              <div className="form-group tile-flex">
                <label>First Name</label>
                <input
                  required
                  type="text"
                  //   value={editableFirstName}
                  pattern="^[A-Za-z]+$"
                  title="Please enter a valid first name (letters only)"
                  //   onChange={handleFirstNameChange}
                />
              </div>

              <div className="form-group tile-flex">
                <label>Last Name</label>
                <input
                  required
                  type="text"
                  //   value={editableLastName}
                  pattern="^[A-Za-z]+$"
                  title="Please enter a valid last name (letters only)"
                  //   onChange={handleLastNameChange}
                />
              </div>
            </div>
          </div>

          <div className="basic-right-container"></div>
        </div>

        <div className="basic-form-flex-container">
          <div className="basic-left-container">
            <label className="tile-flex">
              <label className="dob-cont">Date of Birth</label>
              <input
                required
                type="text"
                //   value={editableLastName}
                pattern="^[A-Za-z]+$"
                title="Please enter a valid last name (letters only)"
                //   onChange={handleLastNameChange}
              />
            </label>
          </div>
          <div className="basic-right-container">
            <div className="form-group tile-flex">
              <label>Age</label>
              <input
                type="number"
                //   value={editableAge}
                //   onChange={handleAgeChange}
              />
            </div>
          </div>
        </div>

        <div className="basic-form-flex-container radio-change-container">
          <div className="basic-left-container">
            <div className="form-group tile-flex">
              <label>Gender</label>
              <div className="basic-form-grid-container">
                <div className="radiio-flex-container">
                  <input
                    type="radio"
                    id="Male"
                    name="gender"
                    value="Male"
                    className="radio-input-box"

                    // checked={selectedGender === "Male"}
                    // onChange={handleGenderChange}
                  />
                  <label htmlFor="Male">Male</label>
                </div>
                <div className="radiio-flex-container">
                  <input
                    type="radio"
                    id="Female"
                    name="gender"
                    value="Female"
                    className="radio-input-box"

                    // checked={selectedGender === "Female"}
                    // onChange={handleGenderChange}
                  />
                  <label htmlFor="Female">Female</label>
                </div>
                <div className="radiio-flex-container">
                  <input
                    type="radio"
                    id="Other"
                    name="gender"
                    value="Other"
                    className="radio-input-box"

                    // checked={selectedGender === "Other"}
                    // onChange={handleGenderChange}
                  />
                  <label htmlFor="Other">Other</label>
                </div>
              </div>
            </div>
          </div>
          <div className="basic-right-container">
            <div className="form-group tile-flex" style={{paddingLeft:"25px"}}>
              <label>Maritial status</label>
              <div className="basic-form-grid-container">
                <div className="radiio-flex-container">
                  <input
                    type="radio"
                    id="Married"
                    name="marriedStatus"
                    value="Married"
                    className="radio-input-box"

                    // checked={selectMaritalStatus === "Married"}
                    // onChange={handleMarriageChange}
                  />
                  <label htmlFor="Male">Married</label>
                </div>
                <div className="radiio-flex-container">
                  <input
                    type="radio"
                    id="UnMarried"
                    name="marriedStatus"
                    value="UnMarried"
                    className="radio-input-box"
                    // checked={selectMaritalStatus === "UnMarried"}
                    // onChange={handleMarriageChange}
                  />
                  <label htmlFor="Female">UnMarried</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
