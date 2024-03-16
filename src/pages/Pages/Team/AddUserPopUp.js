import React, { useState } from "react";
import "./AddUserPop.css";
import { Button, Col, Input, Label, Row } from "reactstrap";
import config from "../../../config";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import maleImage from "../../../assets/icons/male-gender.png";
import femaleImage from "../../../assets/icons/femenine.png";
import { toast } from "react-toastify";

const AddUserPopUp = ({ type, closeForm }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobErrorMessage, setMobErrorMessage] = useState("");
  const [otpField, setOtpField] = useState(false);
  const [otpNumber, setOtpNumber] = useState("");
  const [code, setCode] = useState("");
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [buttonText, setButtonText] = useState("Get Otp");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showNameFields, setShowNameFields] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");

  const [showDobFields, setShowDobFields] = useState(false);
  const [genderFields, setShowGenderFields] = useState(false);

  const [age, setAge] = useState("");
  const [ageErrorMessage, setAgeErrorMessage] = useState("");

  const [dob, setDob] = useState("");
  const [dobErrorMessage, setDobErrorMessage] = useState("");

  const [selectedGender, setSelectedGender] = useState("");

  function formatDate(dateString) {
    // Function to ensure the date is always in "mm/dd/yyyy" format
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;

    // Regular expression to allow only 10 digits
    const pattern = /^[0-9]{0,10}$/;

    if (pattern.test(value) || value === "") {
      setMobileNumber(value);
      setMobErrorMessage("");
      setIsButtonDisabled(value.length === 0);
    } else {
      setMobErrorMessage("Only digits are allowed in the mobile number field.");
      setIsButtonDisabled(true);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;

    // Regular expression to allow only 6 digits
    const pattern = /^[0-9]{0,6}$/;

    if (pattern.test(value) || value === "") {
      setOtpNumber(value);
      setOtpErrorMessage("");
    } else {
      setOtpErrorMessage("OTP should be exactly 6 digits.");
    }
  };

  const handleGetOtp = async () => {
    await axios
      .get(
        `${config.api.API_URL}/login?type=${type}&credential=${mobileNumber}`
      )
      .then((res) => {
        if (res.status === 500) {
          alert("We are Sorry", res.message);
        }
        console.log(res.login);
        if (res.login) {
          return toast.error("Already Registered");
          // console.log("Already Registered");
        }
        setCode(res.message);
      })
      .catch((error) => {
        console.log("error", error);
      });

    setButtonText("Sign In");

    setOtpField(true);
  };

  const handlResendOtp = async () => {
    await axios
      .get(
        `${config.api.API_URL}/login/resend-otp?type=${type}&credential=${mobileNumber}`
      )
      .then((res) => {
        toast.success("OTP sent again");
        // console.log("res.data.message : ",res.message)
        setCode(res.message);
        // console.log("Resend Otp");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleSignIn = () => {
    if (otpNumber === code) {
      setShowNameFields(true);
    } else {
      toast.error("Wrong OTP");
    }
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;

    // Regular expression to check if the value contains only letters and is not empty
    const pattern = /^[a-zA-Z]+$/;

    if (value === "") {
      setFirstNameErrorMessage("First name is required.");
      setIsButtonDisabled(true); // Disable the "Next" button
    } else if (!pattern.test(value)) {
      setFirstNameErrorMessage("First name should contain only letters.");
      setIsButtonDisabled(true); // Disable the "Next" button
    } else if (value && lastName) {
      setFirstNameErrorMessage(""); // Clear the error message
      setIsButtonDisabled(false); // Enable the "Next" button
    } else {
      setFirstNameErrorMessage("");
      setIsButtonDisabled(true); // Disable the "Next" button
    }

    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;

    // Regular expression to check if the value contains only letters and is not empty
    const pattern = /^[a-zA-Z]+$/;

    if (value === "") {
      setLastNameErrorMessage("Last name is required.");
      setIsButtonDisabled(true); // Disable the "Next" button
    } else if (!pattern.test(value)) {
      setLastNameErrorMessage("Last name should contain only letters.");
      setIsButtonDisabled(true); // Disable the "Next" button
    } else if (firstName && value) {
      setLastNameErrorMessage(""); // Clear the error message
      setIsButtonDisabled(false); // Enable the "Next" button
    } else {
      setLastNameErrorMessage("");
      setIsButtonDisabled(true); // Disable the "Next" button
    }

    setLastName(value);
  };

  const handleNextAgeScreen = () => {
    setShowDobFields(true);
    // console.log("clicked", showDobFields);
  };

  const handleDobChange = (selectedDates, dateStr, instance) => {
    const value = dateStr;
    setDob(value);
    const calculatedAge = calculateAgeFromDob(value);
    setAge(calculatedAge.toString());
  };
  const calculateAgeFromDob = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const handleAgeChange = (e) => {
    const value = e.target.value;

    // Regular expression to check if the value contains only numbers and is not empty
    const pattern = /^\d+$/;

    if (!pattern.test(value)) {
      setAgeErrorMessage("Age should contain only numbers.");
    } else {
      setAgeErrorMessage("");
    }

    setAge(value);
    if (value) {
      const today = new Date();
      const birthYear = today.getFullYear() - parseInt(value, 10);
      const calculatedDob = new Date(birthYear, today.getMonth(), today.getDate()).toISOString().split('T')[0];
      setDob(calculatedDob);
    }
  };

  const handleGenderScreen = () => {
    setShowGenderFields(true);
    // console.log("genderFields : ", genderFields);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  const handleRegister = async (e) => {
    // console.log("Register");
    const userData = {
      type: type,
      createdAt: new Date(),
      isAdmin: null,
      gender: selectedGender,
      phone: mobileNumber,
      dateOfBirth: dob,
      deleted: false,
      firstName: firstName,
      lastName: lastName,
      // userId: state.userId,
      // password: state.password,
      category: [],
      // email: email,
      displayName: firstName + " " + lastName,
      age: age,
    };
    axios
      .post(
        `${config.api.API_URL}/login/register?type=${type}`,
        {
          data: userData,
        },
        {
          "Content-Type": "application/json",
        }
      )
      .then(async (responseData) => {
        console.log(responseData);
        if (responseData.status === 200) {
          const response = responseData.data._doc;
          toast.success(
            `${response.displayName} Is now registered with Psymate Healthcare`
          );
          window.location.reload();
        }
      })
      .catch((error) => {
        toast.error("Invalid Inputs");
      });
    // window.location.reload();
  };

  return (
    <div id="popUpForm">
      <div className="popUpBox">
        <div className="formWrapper">
          {genderFields ? (
            <div className="add-user-form">
              <div className="form-header complete-details-form">
                <h2>Complete your Profile</h2>
                <div className="cross-icon " onClick={closeForm}>
                  <i className="las la-times"></i>
                </div>
                <p>
                  Please Fill remaining details for your seamless experience
                </p>

                <Row>
                  <div>
                    <Col lg={12}>
                      <div className="mt-3 mb-3">
                        <div className="hstack gap-4 align-items-center justify-content-between">
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => handleGenderChange("Male")}
                            className={`form-gender-container d-flex flex-column px-3 py-1 ${selectedGender === "Male"
                              ? "selectedGenderColor"
                              : ""
                              }`}
                          >
                            <Label>Male</Label>
                            <img src={maleImage} alt="male" />
                          </div>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => handleGenderChange("Female")}
                            className={`form-gender-container d-flex flex-column px-3 py-1 ${selectedGender === "Female"
                              ? "selectedGenderColor"
                              : ""
                              }`}
                          >
                            <Label>Female</Label>
                            <img src={femaleImage} alt="female" />
                          </div>
                        </div>

                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => handleGenderChange("Others")}
                          className={`form-gender-container others-form-container mt-3 ${selectedGender === "Others"
                            ? "selectedGenderColor"
                            : ""
                            }`}
                        >
                          <Label>Others</Label>
                        </div>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Button
                        style={{ width: "100%" }}
                        onClick={handleRegister}
                      >
                        Register
                      </Button>
                    </Col>
                  </div>
                </Row>
              </div>
            </div>
          ) : showDobFields ? (
            <div className="add-user-form">
              <div className="form-header complete-details-form">
                <h2>Complete your Profile</h2>
                <div className="cross-icon " onClick={closeForm}>
                  <i className="las la-times"></i>
                </div>
                <p>
                  Please Fill remaining details for your seamless experience
                </p>
              </div>

              <Row>
                <div>
                  <Col lg={12}>
                    <div className="mt-3 mb-3">
                      <div className="input-group-calender">
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "m/d/Y",
                            maxDate: "today",
                          }}
                          id="dob"
                          placeholder="Date of Birth"
                          value={formatDate(dob)}
                          style={{ zIndex: "9999" }}
                        onChange={handleDobChange}

                        />
                        <i className="lar la-calendar"></i>
                      </div>
                      <div className="text-danger">{dobErrorMessage}</div>
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="mt-3 mb-3">
                      <Input
                        required
                        type="number"
                        className="form-control"
                        id="age"
                        placeholder="Age"
                        value={age}
                        onChange={handleAgeChange}
                      />
                      <div className="text-danger">{ageErrorMessage}</div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleGenderScreen}
                      >
                        Next
                      </Button>
                    </div>
                  </Col>
                </div>
              </Row>
            </div>
          ) : showNameFields ? (
            <div className="add-user-form">
              <div className="form-header complete-details-form">
                <h2>Complete your Profile</h2>
                <div className="cross-icon " onClick={closeForm}>
                  <i className="las la-times"></i>
                </div>
                <p>
                  Please Fill remaining details for your seamless experience
                </p>
              </div>

              <Row>
                <div>
                  <Col lg={12}>
                    <div className="mt-3 mb-3">
                      <Input
                        required
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={handleFirstNameChange}
                      />
                      <div className="text-danger">{firstNameErrorMessage}</div>
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="mt-3 mb-3">
                      <Input
                        required
                        type="text"
                        className="form-control"
                        id="lasttName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={handleLastNameChange}
                      />
                      <div className="text-danger">{lastNameErrorMessage}</div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        type="button"
                        className="btn btn-primary"
                        disabled={isButtonDisabled}
                        onClick={handleNextAgeScreen}
                      >
                        Next
                      </Button>
                    </div>
                  </Col>
                </div>
              </Row>
            </div>
          ) : (
            <div className="add-user-form">
              <div className="form-header">
                <h2>Register A User</h2>
                <div className="cross-icon " onClick={closeForm}>
                  <i className="las la-times"></i>
                </div>
              </div>
              <Row>
                <div>
                  <Col lg={12}>
                    <div className="mt-3 mb-3">
                      <Input
                        required
                        type="number"
                        className="form-control"
                        id="mobNo"
                        placeholder="Mobile Number"
                        value={mobileNumber}
                        onChange={handleMobileNumberChange}
                      />
                      <div className="text-danger">{mobErrorMessage}</div>
                    </div>
                  </Col>

                  {otpField && (
                    <Col lg={12}>
                      <div className="mt-3 mb-3">
                        <Input
                          required
                          type="number"
                          className="form-control"
                          id="otp"
                          placeholder="Enter OTP"
                          value={otpNumber}
                          onChange={handleOtpChange}
                        />
                        <Label
                          className="pt-3"
                          style={{ cursor: "pointer" }}
                          onClick={handlResendOtp}
                        >
                          Resend OTP
                        </Label>
                        <div className="text-danger">{otpErrorMessage}</div>
                      </div>
                    </Col>
                  )}
                  <div className="popUp-otp-btn">
                    {otpField ? (
                      <Button
                        onClick={handleSignIn}
                        disabled={isButtonDisabled}
                      >
                        Sign In
                      </Button>
                    ) : (
                      <Button
                        onClick={handleGetOtp}
                        disabled={isButtonDisabled}
                      >
                        Get OTP
                      </Button>
                    )}
                  </div>
                </div>
              </Row>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUserPopUp;
