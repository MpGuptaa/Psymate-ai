import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import Flatpickr from "react-flatpickr";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { addNewInvoice as onAddNewInvoice } from "../../store/invoice/action";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
  Input,
  FormFeedback,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import * as Yup from "yup";

import Select from "react-select";
import classnames from "classnames";
import { orderSummary } from "../../common/data/ecommerce";
import { Link } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { useFormik } from "formik";
import Cleave from "cleave.js/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TextareaInput } from "../Forms/Builder/Inputs";
import Dropzone from "react-dropzone";
import { createLead } from "../../api/api";

const PersonalDetails = () => {
  document.title = "Checkout | Psymate - Management Portal";
  const { userProfile, loading } = useProfile();

  const [addresses, setAddresses] = useState([]);
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const searchParams = new URLSearchParams(window.location.search);
  // Get a specific parameter value
  const userId = searchParams.get("user");
  const [cart, setCart] = useState([]);
  const [state, setState] = useState([]);
  const [complete, setcomplete] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [alternativePhoneNumber, setAlternativePhoneNumber] = useState("");
  const [alternativeEmailValue, setAlternativeEmailValue] = useState("");
  const [dob, setDob] = useState("");
  const [ageValue, setAge] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [selectedCountry, setselectedCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationdate, setExpirationdate] = useState("");
  const [cvvNumber, setCvvNumber] = useState("");
  const [qualificationValue, setQualificationValue] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [yearOfCompletionValue, setYearOfCompletionValue] = useState("");

  const [academicDetails, setAcademicDetails] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [nameOfOrganisation, setNameOfOrganisation] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfCompletion, setDateOfCompletion] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [gender, setGender] = useState(""); // State to store the selected gender
  const [showOtpField, setShowOtpField] = useState(false);
  const [code, setCode] = useState("");
  const [edit, setEdit] = useState();
  const [deletemodal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [rensendField, setResendField] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [maritalStatus, setMaritalStatus] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [allergies, setAllergies] = useState("");
  const [kinName, setKinName] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const [selectedFiles, setselectedFiles] = useState([]);
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handleAlternativePhoneChange = (e) => {
    setAlternativePhoneNumber(e.target.value);
  };

  const handleAlternateEmailChange = (e) => {
    setAlternativeEmailValue(e.target.value);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
    setDob(calculateDob(e.target.value));
  };

  const handleDob = (e) => {
    setDob(e[0]);
    setAge(calculateAge(e[0]));
  };

  const handleOtpChange = (e) => {
    setOtpValue(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddressValue(e.target.value);
  };

  function handleSelectCountry(e) {
    setselectedCountry(e.target.value);
  }

  const handleZipCode = (e) => {
    setZipCode(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleCardHolderName = (e) => {
    setCardHolderName(e.target.value);
  };

  const handleCardNumber = (e) => {
    setCardNumber(e.target.value);
  };

  const handleExpirationDate = (e) => {
    setExpirationdate(e.targt.value);
  };

  const handleCvvNumber = (e) => {
    setCvvNumber(e.target.value);
  };

  const handleQualification = (e) => {
    setQualificationValue(e.target.vaue);
  };

  const handleInstituteName = (e) => {
    setInstituteName(e.target.value);
  };

  const handleYearofCompletion = (e) => {
    setYearOfCompletionValue(e.target.value);
  };

  const handleAddAcademicDetails = () => {
    const newAcademicDetail = {
      qualification: "",
      instituteName: "",
      yearOfCompletion: "",
    };
    setAcademicDetails([...academicDetails, newAcademicDetail]);
  };

  const handleDeleteAcademicDetail = (index) => {
    const updatedAcademicDetails = [...academicDetails];
    updatedAcademicDetails.splice(index, 1);
    setAcademicDetails(updatedAcademicDetails);
  };

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleOrganisationName = (e) => {
    setNameOfOrganisation(e.target.value);
  };

  const handleFatherName = (e) => {
    setFatherName(e.target.value);
  };

  const handleMotherName = (e) => {
    setMotherName(e.target.value);
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      }),
    );
    setselectedFiles(files);
  }

  function formatDate(dateString) {
    // Function to ensure the date is always in "mm/dd/yyyy" format
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }

  const toggledeletemodal = () => {
    setDeleteModal(!deletemodal);
  };

  const togglemodal = () => {
    setModal(!modal);
  };

  const handleGetOtp = async () => {
    setShowOtpField(true);
    await axios
      .get(`${config.api.API_URL}/login/${phoneNumber}`)
      .then((res) => {
        console.log("Res: ", res);
        if (res.status === 500) {
          alert("We are Sorry", res.message);
        }
        if (!res.login) {
          return toast.error("Already Registered");
        }
        setCode(res.message);
      })
      .catch((error) => {
        console.log("error", error);
      });

    setResendField(true);
  };

  const handlResendOtp = async () => {
    await axios
      .get(`${config.api.API_URL}/login/resend/otp/${phoneNumber}`)
      .then((res) => {
        toast.success("OTP sent again");
        console.log("resend data otp: ", res.message);
        setCode(res.message);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const verifyOTP = async () => {
    await axios
      .get(`${config.api.API_URL}/login/verify/${phoneNumber}/${otpValue}`)
      .then((res) => {
        console.log(res.message);
        toast.success(res.message);
        return res.status === 200;
      })
      .catch((error) => {
        console.log("error", error);
        return false;
      });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (otpValue) {
      if (verifyOTP()) {
        const userData = {
          type: "patient",
          createdAt: new Date(),
          isAdmin: null,
          gender: gender,
          phone: phoneNumber,
          dateOfBirth: dob,
          deleted: false,
          firstName: firstName,
          lastName: lastName,
          // userId: userIdValue,
          // password: userPasswordValue,
          category: [],
          email: emailValue,
          displayName: firstName + " " + lastName,
          age: ageValue,
        };
        axios
          .post(
            `${config.api.API_URL}/login/register?type=patient}`,
            {
              data: userData,
            },
            {
              "Content-Type": "application/json",
            },
          )
          .then(async (responseData) => {
            console.log("responseData : ", responseData);
            if (responseData.status === 200) {
              const response = responseData.data.user;
              toast.success(`${response.displayName} Is now registered with Psymate Healthcare`);
              // window.location.reload();
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error("Invalid Inputs");
          });
      }
    } else {
      handleCreateLead();
    }

    // toggleTab(2);
  };

  const handleCreateLead = async () => {
    const leadData = {
      phone: phoneNumber,
      // otp: otpInputValue,
      email: emailValue,
      // instagram: instaValue,
      // linked_in: linkInValue,
      // facebook: fbValue,
      // twitter: twitterValue,
      firstName: firstName,
      lastName: lastName,
      displayName: firstName + lastName,
      dateOfBirth: dob,
      gender: gender,
      // uid: "",
      type: "patient",
      addresses: addressValue,
      password: "",
      age: ageValue,
      // psyID: { type: Number, unique: true },
      city: selectedState,
      country: selectedCountry,
      title: "",
      photoURL: "",
      pincode: zipCode,
      // status: leadStatuss,
      // state: currentState,
      // categoty: selectedLeadCategories,
      // source: selectedLeadSource,
    };

    try {
      const response = await createLead(leadData);
      console.log("Lead created successfully:", response);
    } catch (error) {
      console.error("Error creating lead:", error.message);
    }
  };

  const calculateAge = (dob) => {
    // Implement the logic to calculate age from DOB
    // For simplicity, let's assume age is calculated based on the year of birth
    const currentYear = new Date().getFullYear();
    const birthYear = dob ? dob.getFullYear() : currentYear;
    return currentYear - birthYear;
  };

  const calculateDob = (age) => {
    // Implement the logic to calculate DOB from age
    // For simplicity, let's assume age is calculated based on the year of birth
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return new Date(birthYear, 0, 1); // Assuming January 1st of the birth year
  };

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 8) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: userProfile.firstName || "",
      lastName: userProfile.lastName || "",
      email: userProfile.email || "",
      website: "",
      phone: userProfile.phone || "",
      invoiceId: "",
      establishmentAddress: "",
      date: "",
      name: "",
      status: "",
      country: "",
      amount: "",
      product_name: "",
      logo: "https://ik.imagekit.io/jybala7h3/psymate-logo-white_JVApKhT3e_eDlzx9shh.png?updatedAt=1680327160872",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("This field is required"),
      lastName: Yup.string().required("This field is required"),
      email: Yup.string().required("This field is required"),
      phone: Yup.string().required("This field is required"),
      pincode: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {},
  });

  const nationalities = [
    { label: "American", value: "american" },
    { label: "British", value: "british" },
    { label: "Canadian", value: "canadian" },
    { label: "Australian", value: "australian" },
    { label: "German", value: "german" },
    { label: "Indian", value: "indian" },
  ];

  const stateOfOrigin = {
    american: [
      { state: "California", value: "california" },
      { state: "New York", value: "new york" },
      { state: "Texas", value: "texas" },
    ],
    british: [
      // Define British states here
    ],
    canadian: [
      // Define Canadian states here
    ],
    australian: [
      // Define Australian states here
    ],
    german: [
      // Define German states here
    ],
    indian: [
      { state: "Delhi", value: "delhi" },
      { state: "Maharashtra", value: "maharashtra" },
      { state: "Tamil Nadu", value: "tamil nadu" },
      // Add more Indian states as needed
    ],
  };
  const languages = [
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Chinese", value: "chinese" },
    { label: "Hindi", value: "hindi" },
  ];

  const maritalStatusOptions = [
    { label: "Married", value: "married" },
    { label: "Single", value: "single" },
  ];

  const bloodGroups = [
    { label: "A+", value: "A+" },
    { label: "B+", value: "B+" },
    { label: "AB+", value: "AB+" },
    { label: "O+", value: "O+" },
    { label: "A-", value: "A-" },
    { label: "B-", value: "B-" },
    { label: "AB-", value: "AB-" },
    { label: "O-", value: "O-" },
  ];

  const relationOptions = [
    { label: "Spouse", value: "spouse" },
    { label: "Parent", value: "parent" },
    { label: "Sibling", value: "sibling" },
    { label: "Child", value: "child" },
    { label: "Other", value: "other" },
    // Add more relationship options as needed
  ];

  const handleNationalityChange = (selectedOption) => {
    setSelectedNationality(selectedOption);
    setSelectedState(null);
  };
  const handleStateChange = (option) => {
    setSelectedState(option);
  };

  const stateOptions = selectedNationality ? stateOfOrigin[selectedNationality.value] || [] : [];

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions);
  };

  const handleMaritalStatusChange = (event) => {
    setMaritalStatus(event.target.value);
  };

  const handleBloodGroupChange = (selectedOption) => {
    setSelectedBloodGroup(selectedOption);
  };

  const handleAllergiesChange = (event) => {
    setAllergies(event.target.value);
  };

  const handleKinNameChange = (e) => {
    setKinName(e.target.value);
  };

  const handleRelationChange = (selectedOption) => {
    setSelectedRelation(selectedOption);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Details" pageTitle="User" />

          <Row>
            <Col xl="8">
              <Card>
                <CardBody className="checkout-tab">
                  <Form action="#">
                    <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                      <Nav className="nav-pills nav-justified custom-nav" role="tablist" style={{ marginTop: "2%" }}>
                        <NavItem role="presentation">
                          <NavLink
                            href="#"
                            className={classnames(
                              {
                                active: activeTab === 1,
                                done: activeTab <= 8 && activeTab >= 0,
                              },
                              "p-3",
                            )}
                            onClick={() => {
                              toggleTab(1);
                            }}
                          >
                            <i className="ri-user-2-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Basic Details
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink
                            href="#"
                            className={classnames(
                              {
                                active: activeTab === 2,
                                done: activeTab <= 8 && activeTab > 1,
                              },
                              "p-3",
                            )}
                            onClick={() => {
                              toggleTab(2);
                            }}
                          >
                            <i className="ri-bank-card-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Additional Details{" "}
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink
                            href="#"
                            className={classnames(
                              {
                                active: activeTab === 3,
                                done: activeTab <= 8 && activeTab > 2,
                              },
                              "p-3 ",
                            )}
                            onClick={() => {
                              toggleTab(3);
                            }}
                          >
                            <i className="ri-truck-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Address Details
                          </NavLink>
                        </NavItem>

                        <NavItem role="presentation">
                          <NavLink
                            href="#"
                            className={classnames(
                              {
                                active: activeTab === 4,
                                done: activeTab <= 8 && activeTab > 3,
                              },
                              "p-3",
                            )}
                            onClick={() => {
                              toggleTab(4);
                            }}
                          >
                            <i className="ri-bank-card-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Document Verification
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>

                    <TabContent activeTab={activeTab} className="tab-transition">
                      <TabPane tabId={1} className={activeTab === 1 ? "slide-in" : "slide-out"}>
                        <div>
                          <p className="text-muted mb-4">Please fill all information below</p>
                        </div>

                        <div>
                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="billinginfo-firstName" className="form-label">
                                  First Name
                                  <span style={{ fontSize: "16px" }} className="text-danger">
                                    *
                                  </span>
                                </Label>
                                <Input
                                  required
                                  value={firstName}
                                  onChange={handleFirstNameChange}
                                  type="text"
                                  className="form-control"
                                  id="firstName"
                                  placeholder="Enter first name"
                                  invalid={validation.errors.firstName && validation.touched.firstName ? true : false}
                                />
                                {validation.errors.firstName && validation.touched.firstName ? (
                                  <FormFeedback type="invalid">{validation.errors.firstName}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>

                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="billinginfo-lastName" className="form-label">
                                  Last Name
                                  <span style={{ fontSize: "16px" }} className="text-danger">
                                    *
                                  </span>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={lastName}
                                  onChange={handleLastNameChange}
                                  className="form-control"
                                  id="billinginfo-lastName"
                                  placeholder="Enter last name"
                                  invalid={validation.errors.lastName && validation.touched.lastName ? true : false}
                                />
                                {validation.errors.lastName && validation.touched.lastName ? (
                                  <FormFeedback type="invalid">{validation.errors.lastName}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm={6}>
                              <Row>
                                <Col sm={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="billinginfo-phone" className="form-label">
                                      Date of Birth{" "}
                                      <span style={{ fontSize: "16px" }} className="text-danger">
                                        *
                                      </span>
                                    </Label>

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
                                      onChange={handleDob}
                                      required
                                    />
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="billinginfo-phone" className="form-label">
                                      Age
                                      <span style={{ fontSize: "16px" }} className="text-danger">
                                        *
                                      </span>
                                    </Label>
                                    <Input
                                      type="number"
                                      required
                                      value={ageValue}
                                      onBlur={validation.handleBlur}
                                      onChange={handleAge}
                                      className="form-control"
                                      id="age"
                                      placeholder="Enter Age"
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col sm={6}>
                              <Label htmlFor="billinginfo-gender" className="form-label">
                                Gender
                                <span style={{ fontSize: "16px" }} className="text-danger">
                                  *
                                </span>
                              </Label>
                              <Row>
                                <Col sm={12} className="d-flex align-items-center justify-content-between">
                                  <label>
                                    <input
                                      type="radio"
                                      value="male"
                                      checked={gender === "male"}
                                      onChange={handleGenderChange}
                                      required
                                    />
                                    &nbsp; Male
                                  </label>

                                  <br />
                                  <label>
                                    <input
                                      type="radio"
                                      value="female"
                                      checked={gender === "female"}
                                      onChange={handleGenderChange}
                                      required
                                    />
                                    &nbsp; Female
                                  </label>
                                  <br />
                                  <label>
                                    <input
                                      type="radio"
                                      value="other"
                                      checked={gender === "other"}
                                      onChange={handleGenderChange}
                                      required
                                    />
                                    &nbsp; Other
                                  </label>
                                </Col>
                              </Row>
                            </Col>{" "}
                          </Row>

                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="billinginfo-email" className="form-label">
                                  Email
                                  <span className="text-muted">(Optional)</span>
                                </Label>
                                <Input
                                  type="email"
                                  value={emailValue}
                                  onBlur={validation.handleBlur}
                                  onChange={handleEmailChange}
                                  className="form-control"
                                  id="billinginfo-email"
                                  placeholder="Enter email"
                                  invalid={validation.errors.email && validation.touched.email ? true : false}
                                />
                                {validation.errors.email && validation.touched.email ? (
                                  <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>

                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="billinginfo-phone" className="form-label">
                                  Phone
                                  <span style={{ fontSize: "16px" }} className="text-danger">
                                    *
                                  </span>
                                </Label>
                                <Input
                                  type="number"
                                  value={phoneNumber}
                                  onBlur={validation.handleBlur}
                                  onChange={handlePhoneChange}
                                  className="form-control"
                                  id="billinginfo-phone"
                                  placeholder="Enter phone no."
                                  invalid={validation.errors.phone && validation.touched.phone ? true : false}
                                />
                                {validation.errors.phone && validation.touched.phone ? (
                                  <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6}></Col>
                            <Col sm={6}>
                              {rensendField ? (
                                <p
                                  style={{
                                    cursor: "pointer",
                                    textAlign: "right",
                                    fontWeight: "600",
                                  }}
                                  onClick={handlResendOtp}
                                >
                                  Resend Otp
                                </p>
                              ) : (
                                <p
                                  style={{
                                    cursor: "pointer",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    color: phoneNumber === "" ? "grey" : "black",
                                  }}
                                  onClick={phoneNumber !== "" ? handleGetOtp : undefined}
                                  disabled={phoneNumber === ""}
                                >
                                  Get Otp
                                </p>
                              )}
                            </Col>
                          </Row>

                          {showOtpField && (
                            <Row>
                              <Col sm={12}>
                                <div className="mb-3">
                                  <Label htmlFor="billinginfo-phone" className="form-label">
                                    OTP
                                  </Label>
                                  <Input
                                    type="number"
                                    value={otpValue}
                                    onBlur={validation.handleBlur}
                                    onChange={handleOtpChange}
                                    className="form-control"
                                    id="billinginfo-phone"
                                    placeholder="Enter One time Password."
                                    invalid={validation.errors.phone && validation.touched.phone ? true : false}
                                  />
                                </div>
                              </Col>
                            </Row>
                          )}
                          <div className="d-flex align-items-start gap-3 mt-3">
                            {otpValue ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-label right ms-auto nexttab"
                                onClick={(e) => {
                                  handleSignIn(e);
                                }}
                              >
                                <i className="ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                                Next
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary btn-label right ms-auto nexttab"
                                onClick={() => {
                                  handleCreateLead();
                                }}
                              >
                                <i className="ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                                Next
                              </button>
                            )}
                          </div>
                        </div>
                      </TabPane>

                      <TabPane tabId={2} className={activeTab === 2 ? "slide-in" : "slide-out"}>
                        <div>
                          <p className="text-muted mb-4">Please fill all information below</p>
                        </div>{" "}
                        <div>
                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="nationality" className="form-label">
                                  Country of Origin
                                </Label>
                                <Select
                                  id="nationality"
                                  value={selectedNationality || ""}
                                  onChange={handleNationalityChange}
                                  options={nationalities}
                                  isSearchable={true}
                                  placeholder="Search for a country..."
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="state" className="form-label">
                                  State of Origin
                                </Label>
                                <Select
                                  id="state"
                                  value={selectedState}
                                  onChange={handleStateChange}
                                  options={stateOptions}
                                  isSearchable={true}
                                  placeholder="Search for a state..."
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="language">Languages</Label>
                                <Select
                                  id="language"
                                  value={selectedLanguages}
                                  onChange={handleLanguageChange}
                                  options={languages}
                                  isMulti
                                  isSearchable
                                  placeholder="Search for languages..."
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <Row>
                                <Col sm={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="bloodGroup">Blood Group</Label>
                                    <Select
                                      id="bloodGroup"
                                      value={selectedBloodGroup}
                                      onChange={handleBloodGroupChange}
                                      options={bloodGroups}
                                      isSearchable={true}
                                      placeholder="Search for a blood group..."
                                    />
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div className="mb-3">
                                    <Label htmlFor="allergies">Allergies</Label>
                                    <Input
                                      type="text"
                                      id="allergies"
                                      value={allergies}
                                      onChange={handleAllergiesChange}
                                      placeholder="Enter allergies..."
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label>Marital Status:</Label>
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                  {maritalStatusOptions.map((option, index) => (
                                    <div key={index}>
                                      <Input
                                        type="radio"
                                        id={option.value}
                                        value={option.value}
                                        checked={maritalStatus === option.value}
                                        onChange={handleMaritalStatusChange}
                                        style={{ marginRight: "3px" }}
                                      />
                                      <label htmlFor={option.value}>{option.label}</label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <div>
                              <p className="text-muted mb-4">Family Details</p>
                            </div>{" "}
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label htmlFor="family-name">Next of Kin Name</Label>
                                <Input
                                  value={kinName}
                                  onChange={handleKinNameChange}
                                  type="text"
                                  className="form-control"
                                  id="kinName"
                                  placeholder="Enter name"
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="mb-3">
                                <label htmlFor="relation">Relation with Next of Kin:</label>
                                <Select
                                  id="relation"
                                  value={selectedRelation}
                                  onChange={handleRelationChange}
                                  options={relationOptions}
                                  isSearchable={true}
                                  placeholder="Search for a relationship..."
                                />
                              </div>{" "}
                            </Col>
                          </Row>
                        </div>
                        <div className="d-flex align-items-start justify-content-between gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Back{" "}
                          </button>
                          <div className="d-flex gap-3 ">
                            <button
                              type="button"
                              className="btn btn-primary btn-label right ms-auto nexttab"
                              onClick={() => {
                                toggleTab(activeTab + 1);
                              }}
                            >
                              Skip
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary btn-label right ms-auto nexttab"
                              onClick={() => {
                                toggleTab(activeTab + 1);
                              }}
                            >
                              <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                              Next{" "}
                            </button>
                          </div>
                        </div>
                      </TabPane>

                      <TabPane tabId={3} className={activeTab === 3 ? "slide-in" : "slide-out"}>
                        <div>
                          <p className="text-muted mb-4">Please fill all information below</p>
                        </div>

                        <div className="mt-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="flex-grow-1">
                              <h5 className="fs-15 mb-0">Saved Address</h5>
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                className="btn btn-sm btn-success mb-3"
                                onClick={() => {
                                  setEdit();
                                  togglemodal();
                                }}
                              >
                                Add Address
                              </button>
                            </div>
                          </div>
                          <Row className="gy-3">
                            <Col
                              onClick={() => {
                                setState({
                                  ...state,
                                  // address: i,
                                });
                              }}
                              // key={`address_${index}`}
                              lg={4}
                              sm={6}
                            >
                              <div className="form-check card-radio">
                                <Input
                                  id="shippingAddress01"
                                  name="shippingAddress"
                                  type="radio"
                                  className="form-check-input"
                                  defaultChecked
                                />
                                <Label className="form-check-label" htmlFor="shippingAddress01">
                                  <span className="mb-4 fw-semibold d-block text-muted text-uppercase">
                                    Home Address
                                  </span>

                                  <span className="fs-15 mb-2 d-block">{`${firstName} ${lastName}`}</span>
                                  <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                    {addressValue} {selectedCountry} {zipCode}
                                  </span>
                                  <span className="text-muted fw-normal d-block">{phoneNumber}</span>
                                </Label>
                              </div>
                              <div className="d-flex flex-wrap p-2 py-1 bg-light rounded-bottom border mt-n1">
                                <div>
                                  <Link
                                    to="#"
                                    className="d-block text-body p-1 px-2"
                                    onClick={() => {
                                      togglemodal();
                                      setEdit();
                                    }}
                                  >
                                    <i className="ri-pencil-fill text-muted align-bottom me-1"></i>
                                    Edit
                                  </Link>
                                </div>
                                <div>
                                  <Link to="#" className="d-block text-body p-1 px-2" onClick={toggledeletemodal}>
                                    <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i>
                                    Remove
                                  </Link>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div className="d-flex align-items-start justify-content-between gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Back{" "}
                          </button>
                          <div className="d-flex gap-3 ">
                            <button
                              type="button"
                              className="btn btn-primary btn-label right ms-auto nexttab"
                              onClick={() => {
                                toggleTab(activeTab + 1);
                              }}
                            >
                              Skip
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary btn-label right ms-auto nexttab"
                              onClick={() => {
                                toggleTab(activeTab + 1);
                              }}
                            >
                              <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                              Next{" "}
                            </button>
                          </div>
                        </div>
                      </TabPane>

                      <TabPane tabId={4} className={activeTab === 4 ? "slide-in" : "slide-out"}>
                        <h5 className="mb-3">Choose Document Type</h5>

                        <div className="d-flex gap-2">
                          <div>
                            <Input
                              type="radio"
                              className="btn-check"
                              id="passport"
                              defaultChecked
                              name="choose-document"
                            />
                            <Label className="btn btn-outline-info" for="passport">
                              Passport
                            </Label>
                          </div>
                          <div>
                            <Input type="radio" className="btn-check" id="aadhar-card" name="choose-document" />
                            <Label className="btn btn-outline-info" for="aadhar-card">
                              Aadhar Card
                            </Label>
                          </div>
                          <div>
                            <Input type="radio" className="btn-check" id="pan-card" name="choose-document" />
                            <Label className="btn btn-outline-info" for="pan-card">
                              Pan Card
                            </Label>
                          </div>
                          <div>
                            <Input type="radio" className="btn-check" id="other" name="choose-document" />
                            <Label className="btn btn-outline-info" for="other">
                              Other
                            </Label>
                          </div>
                        </div>

                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone dz-clickable">
                              <div className="dz-message needsclick pt-4" {...getRootProps()}>
                                <div className="mb-3">
                                  <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                </div>
                                <h4>Drop files here or click to upload.</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div className="list-unstyled mb-0" id="file-previews">
                          {selectedFiles.map((f, i) => {
                            return (
                              <Card
                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-file"}
                              >
                                <div className="p-2">
                                  <Row className="align-items-center">
                                    <Col className="col-auto">
                                      <img
                                        data-dz-thumbnail=""
                                        height="80"
                                        className="avatar-sm rounded bg-light"
                                        alt={f.name}
                                        src={f.preview}
                                      />
                                    </Col>
                                    <Col>
                                      <Link to="#" className="text-muted font-weight-bold">
                                        {f.name}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>{f.formattedSize}</strong>
                                      </p>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                        <div className="d-flex align-items-start gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Back
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-label right ms-auto nexttab"
                            // onClick={closeForm}
                          >
                            <i className="ri-shopping-basket-line label-icon align-middle fs-16 ms-2"></i>
                            Complete
                          </button>
                        </div>
                      </TabPane>

                      {/* <TabPane
              tabId={4}
              className={activeTab === 4 ? "slide-in" : "slide-out"}
            >
              <div>
                <h5 className="mb-1">Payment Selection</h5>
                <p className="text-muted mb-4">
                  Please select and enter your billing information
                </p>
              </div>

              <Row className="g-4">
                <Col lg={4} sm={6}>
                  <div>
                    <div className="form-check card-radio">
                      <Input
                        id="paymentMethod02"
                        name="paymentMethod"
                        type="radio"
                        className="form-check-input"
                        value="creditCard"
                        checked={selectedPaymentMethod === "creditCard"}
                        onChange={handlePaymentMethodChange}
                      />
                      <Label
                        className="form-check-label"
                        htmlFor="paymentMethod02"
                      >
                        <span className="fs-16 text-muted me-2">
                          <i className="ri-bank-card-fill align-bottom"></i>
                        </span>
                        <span className="fs-14 text-wrap">
                          Credit / Debit Card
                        </span>
                      </Label>
                    </div>
                  </div>
                </Col>

                <Col lg={4} sm={6}>
                  <div>
                    <div className="form-check card-radio">
                      <Input
                        id="paymentMethod03"
                        name="paymentMethod"
                        type="radio"
                        className="form-check-input"
                        value="cashOnDelivery"
                        checked={selectedPaymentMethod === "cashOnDelivery"}
                        onChange={handlePaymentMethodChange}
                      />
                      <Label
                        className="form-check-label"
                        htmlFor="paymentMethod03"
                      >
                        <span className="fs-16 text-muted me-2">
                          <i className="ri-money-dollar-box-fill align-bottom"></i>
                        </span>
                        <span className="fs-14 text-wrap">
                          Cash on Delivery
                        </span>
                      </Label>
                    </div>
                  </div>
                </Col>
              </Row>

              <div
                className={`collapse ${
                  selectedPaymentMethod === "creditCard" ? "show" : ""
                }`}
                id="paymentmethodCollapse"
              >
                <div className="collapse show" id="paymentmethodCollapse">
                  <Card className="p-4 border shadow-none mb-0 mt-4">
                    <Row className="gy-3">
                      <Col md={12}>
                        <Label htmlFor="cc-name" className="form-label">
                          Name on card
                          <span
                            style={{ fontSize: "16px" }}
                            className="text-danger"
                          >
                            *
                          </span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="cc-name"
                          placeholder="Enter name"
                          onChange={handleCardHolderName}
                          value={cardHolderName}
                          required
                        />
                        <small className="text-muted">
                          Full name as displayed on card
                        </small>
                      </Col>

                      <Col md={6}>
                        <Label htmlFor="cc-number" className="form-label">
                          Credit card number
                          <span
                            style={{ fontSize: "16px" }}
                            className="text-danger"
                          >
                            *
                          </span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="cc-number"
                          placeholder="xxxx xxxx xxxx xxxx"
                          value={cardNumber}
                          onChange={handleCardNumber}
                          required
                        />
                      </Col>

                      <Col md={3}>
                        <Label htmlFor="cc-expiration" className="form-label">
                          Expiration
                          <span
                            style={{ fontSize: "16px" }}
                            className="text-danger"
                          >
                            *
                          </span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="cc-expiration"
                          placeholder="MM/YY"
                          value={expirationdate}
                          onChange={handleExpirationDate}
                          required
                        />
                      </Col>

                      <Col md={3}>
                        <Label htmlFor="cc-cvv" className="form-label">
                          CVV
                          <span
                            style={{ fontSize: "16px" }}
                            className="text-danger"
                          >
                            *
                          </span>
                        </Label>
                        <Input
                          type="password"
                          className="form-control"
                          id="cc-cvv"
                          placeholder="xxx"
                          value={cvvNumber}
                          onChange={handleCvvNumber}
                          required
                        />
                      </Col>
                    </Row>
                  </Card>
                  <div className="text-muted mt-2 fst-italic">
                    <i data-feather="lock" className="text-muted icon-xs"></i>{" "}
                    Your transaction is secured with SSL encryption
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-start justify-content-between gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-light btn-label previestab"
                  onClick={() => {
                    toggleTab(activeTab - 1);
                  }}
                >
                  <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                  Back{" "}
                </button>
                <div className="d-flex gap-3 ">
                  <button
                    type="button"
                    className="btn btn-primary btn-label right ms-auto nexttab"
                    onClick={() => {
                      toggleTab(activeTab + 1);
                    }}
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-label right ms-auto nexttab"
                    onClick={() => {
                      toggleTab(activeTab + 1);
                    }}
                  >
                    <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                    Next{" "}
                  </button>
                </div>
              </div>
            </TabPane> */}
                    </TabContent>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col xl="2"></Col>
          </Row>
        </Container>
      </div>
      {/* modal Delete Address */}
      <Modal
        isOpen={deletemodal}
        role="dialog"
        autoFocus={true}
        centered
        id="removeItemModal"
        toggle={toggledeletemodal}
      >
        <ModalHeader
          toggle={() => {
            setDeleteModal(!deletemodal);
          }}
        ></ModalHeader>
        <ModalBody>
          <div className="mt-2 text-center">
            <lord-icon
              src="https://cdn.lordicon.com/gsqxdxog.json"
              trigger="loop"
              colors="primary:#f7b84b,secondary:#fa896b"
              style={{ width: "100px", height: "100px" }}
            ></lord-icon>
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>Are you Sure ?</h4>
              <p className="text-muted mx-4 mb-0">Are you Sure You want to Remove this Address ?</p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <button
              type="button"
              className="btn w-sm btn-light"
              onClick={() => {
                setDeleteModal(!deletemodal);
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn w-sm btn-danger"
              onClick={() => {
                setDeleteModal(!deletemodal);
              }}
            >
              Yes, Delete It!
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* modal Add Address */}
      <Modal isOpen={modal} role="dialog" autoFocus={true} centered id="addAddressModal" toggle={togglemodal}>
        <ModalHeader
          toggle={() => {
            setModal(!modal);
          }}
        >
          <h5 className="modal-title" id="addAddressModalLabel">
            Address
          </h5>
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Name
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                value={validation.values.firstName || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                placeholder="Enter Name"
              />
            </div>

            <div className="mb-3">
              <Label for="addaddress-textarea" className="form-label">
                Address Line 1
              </Label>
              <textarea
                className="form-control"
                id="addaddress-textarea"
                placeholder="Enter Address"
                onBlur={validation.handleBlur}
                onChange={handleAddressChange}
                value={addressValue}
                rows="2"
              ></textarea>
            </div>

            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Phone
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                value={phoneNumber}
                onBlur={validation.handleBlur}
                onChange={handlePhoneChange}
                placeholder="Enter Phone No."
              />
            </div>

            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Country
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                value={selectedCountry}
                onBlur={validation.handleBlur}
                onChange={handleSelectCountry}
                placeholder="Enter Country"
              />
            </div>
            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Pincode
              </Label>
              <Input
                type="text"
                className="form-control"
                value={zipCode}
                onBlur={validation.handleBlur}
                onChange={handleZipCode}
                id="addaddress-Name"
                placeholder="Enter Pincode."
              />
            </div>

            <div className="mb-3">
              <Label for="state" className="form-label">
                Address Type
              </Label>
              <select
                value={validation.values.type || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                className="form-select"
                id="state"
                data-plugin="choices"
              >
                <option value="homeAddress">Home (7am to 10pm)</option>
                <option value="officeAddress">Office (11am to 7pm)</option>
              </select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              setModal(!modal);
            }}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              console.log(validation.values);
              setModal(!modal);
            }}
          >
            Save
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default PersonalDetails;
