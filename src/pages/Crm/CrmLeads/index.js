import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./CrmLeads.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Input,
  ModalHeader,
  ModalBody,
  Label,
  Modal,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Button,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import * as moment from "moment";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { isEmpty } from "lodash";

//Import actions
import {
  addNewLead as onAddNewLead,
  updateLead as onUpdateLead,
  deleteLead as onDeleteLead,
} from "../../../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import CrmFilter from "./CrmFilter";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import config from "../../../config";
import { convertLeadToUser, createLead, getLead } from "../../../api/api";
import { useSSR } from "react-i18next";

const CrmLeads = () => {
  const { users, user } = useSelector((state) => ({
    users: state.User.users,
    user: state.Profile.user,
  }));
  const dispatch = useDispatch();
  const { leads, error } = useSelector((state) => ({
    leads: state.Crm.leads,
    isLeadCreated: state.Crm.isLeadCreated,
    isLeadsSuccess: state.Crm.isLeadsSuccess,
    error: state.Crm.error,
  }));

  useEffect(() => {
    setLead(leads);
  }, [leads]);

  useEffect(() => {
    if (!isEmpty(leads)) {
      setLead(leads);
      setIsEdit(false);
    }
  }, [leads]);

  const [isEdit, setIsEdit] = useState(false);
  const [lead, setLead] = useState([]);

  //delete lead
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const [isInfoDetails, setIsInfoDetails] = useState(false);

  const [tag, setTag] = useState([]);
  const [assignTag, setAssignTag] = useState([]);

  function handlestag(tags) {
    setTag(tags);
    const assigned = tags.map((item) => item.value);
    setAssignTag(assigned);
  }

  const [activeTab, setActiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [selectedFiles, setselectedFiles] = useState([]);

  const options = ["Male", "Female", "Other"];
  const mariiedStatusOptions = ["Married", "Single"];

  const countryOption = [
    {
      name: "India",
    },
    {
      name: "United States",
    },
    {
      name: "Canada",
    },
    {
      name: "United Kingdom",
    },
  ];

  const stateOptions = [
    {
      name: "Delhi",
    },
    {
      name: "Andhra Pradesh",
    },
    {
      name: "Arunachal Pradesh",
    },
    {
      name: "Assam",
    },
    // Add more states as needed
  ];

  const cityOptions = [
    {
      name: "New Delhi",
    },
    {
      name: "Delhi Cantonment",
    },
    {
      name: "Noida",
    },
    {
      name: "Gurgaon",
    },
  ];

  const leadStatus = ["Warm", "Hot", "Cold"];

  const leadSourceOptions = [
    {
      label: "Direct",
      value: "direct",
    },
    {
      label: "Online Listing Platforms",
      value: "online_listing",
      options: [
        {
          label: "Google Business",
          value: "google_business",
        },
        {
          label: "Just Dial",
          value: "just_dial",
        },
        {
          label: "Practo",
          value: "practo",
        },
        {
          label: "Lybrate",
          value: "lybrate",
        },
        {
          label: "1mg",
          value: "1mg",
        },
        {
          label: "Bajaj Health",
          value: "bajaj_health",
        },
        {
          label: "MFine",
          value: "m_fine",
        },
      ],
    },
    {
      label: "Social Meadia",
      value: "social_media",
      options: [
        {
          label: "Facebook",
          value: "facebook",
        },
        {
          label: "Twiiter",
          value: "twitter",
        },
        {
          label: "Instagram",
          value: "instagram",
        },
        {
          label: "LinkedIn",
          value: "linkedIn",
        },
        {
          label: "You Tube",
          value: "uou_tube",
        },
      ],
    },
    {
      label: "Website",
      value: "website",
    },
    {
      label: "App",
      value: "app",
    },
    {
      label: "Referral",
      value: "referral",
      options: [
        {
          label: "Staff",
          value: "staff",
        },
        {
          label: "Users",
          value: "users",
        },
        {
          label: "Partners",
          value: "partners",
        },
      ],
    },
  ];

  const [selectedLeadSource, setSelectedLeadSource] = useState(null);

  const handleLeadSourceChange = (value) => {
    setSelectedLeadSource(value);
  };

  const leadCatOptions = [
    {
      label: "Clinic",
      value: "clinic",
      options: [
        {
          label: "Consultation",
          value: "consultation",
        },
        {
          label: "Assesments",
          value: "assesments",
        },
        {
          label: "Psychotherapy",
          value: "psychotherapy",
        },
        {
          label: "rTMS",
          value: "rtms",
        },
      ],
    },
    {
      label: "Rehabilitation ",
      value: "rehabilitation",
      options: [
        {
          label: "Psymate Reboot ",
          value: "psymate_reboot",
        },
        {
          label: "Psymate Refresh ",
          value: "psymate_refresh",
        },
        {
          label: "Psymate Reconnect ",
          value: "psymate_reconnect",
        },
        {
          label: "Psymate Rejuvenate ",
          value: "psymate_rejuvenate",
        },
        {
          label: "Psymate Recover ",
          value: "psymate_recover",
        },
      ],
    },
    {
      label: "Wellness",
      value: "wellness",
    },
    {
      label: "Pharmacy",
      value: "pharmacy",
    },
    {
      label: "Academy",
      value: "academy",
      options: [
        {
          label: "E-courses",
          value: "e_courses",
        },
        {
          label: "Workshops",
          value: "workshops",
        },
        {
          label: "Training",
          value: "training",
        },
        {
          label: "Research",
          value: "research",
        },
      ],
    },
  ];

  const [selectedLeadCategories, setSelectedLeadCategories] = useState([]);

  const handleLeadCategoryChange = (value) => {
    const isSelected = selectedLeadCategories.includes(value);

    if (isSelected) {
      setSelectedLeadCategories(selectedLeadCategories.filter((item) => item !== value));
    } else {
      setSelectedLeadCategories([...selectedLeadCategories, value]);
    }
  };

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 5) {
        setActiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  const tags = [
    { label: "Exiting", value: "Exiting" },
    { label: "Lead", value: "Lead" },
    { label: "Long-term", value: "Long-term" },
    { label: "Partner", value: "Partner" },
  ];
  const [page, setPage] = useState(1);
  const pageSize = 10; //

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setLead(null);
    } else {
      setModal(true);
      setDate(defaultdate());
      setTag([]);
      setAssignTag([]);
    }
  }, [modal]);

  const toggleOtp = useCallback(() => {
    if (showOtpModal) {
      setShowOtpModal(true);
    } else {
      setShowOtpModal(false);
    }
  });

  // Delete Data
  const handleDeleteLead = () => {
    if (lead) {
      dispatch(onDeleteLead(lead._id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (lead) => {
    setLead(lead);
    setDeleteModal(true);
  };

  // Add Data
  const handleLeadClicks = () => {
    setLead("");
    setIsEdit(false);
    toggle();
  };

  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // leadsId: (lead && lead.leadsId) || '',
      // img: (lead && lead.img) || '',
      name: (lead && lead.name) || "",
      company: (lead && lead.company) || "",
      score: (lead && lead.score) || "",
      phone: (lead && lead.phone) || "",
      location: (lead && lead.location) || "",
      date: (lead && lead.date) || "",
      tags: (lead && lead.tags) || "",
    },
    validationSchema: Yup.object({
      // leadsId: Yup.string().required("Please Enter leads Id"),
      name: Yup.string().required("Please Enter Name"),
      company: Yup.string().required("Please Enter Company"),
      score: Yup.string().required("Please Enter Score"),
      phone: Yup.string().required("Please Enter Phone"),
      location: Yup.string().required("Please Enter Location"),
      // date: Yup.string().required("Please Enter Date"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateLead = {
          _id: lead ? lead._id : 0,
          // leadsId: values.leadsId,
          // img: values.img,
          name: values.name,
          company: values.company,
          score: values.score,
          phone: values.phone,
          location: values.location,
          date: date,
          tags: assignTag,
        };
        // update Company
        dispatch(onUpdateLead(updateLead));
        validation.resetForm();
      } else {
        const newLead = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          // leadsId: values["leadsId"],
          // img: values["img"],
          name: values["name"],
          company: values["company"],
          score: values["score"],
          phone: values["phone"],
          location: values["location"],
          date: date,
          tags: assignTag,
        };
        // save new Lead
        dispatch(onAddNewLead(newLead));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleLeadClick = useCallback(
    (arg) => {
      const lead = arg;

      setLead({
        _id: lead._id,
        // leadsId: lead.leadsId,
        // img: lead.img,
        name: lead.name,
        company: lead.company,
        score: lead.score,
        phone: lead.phone,
        location: lead.location,
        date: lead.date,
        tags: lead.tags,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle],
  );
  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".leadsCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteLead(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".leadsCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const getInitials = (name) => {
    if (name) {
      const nameParts = name?.split(" ");
      return nameParts.map((part) => part[0]).join("");
    }
  };

  const [currentDate, setCurrentDate] = useState("");

  const onClickCall = async (toNum) => {
    setCurrentDate(new Date());
    await axios
      .post(config.api.API_URL + `/call/users`, {
        from: "0" + user.phone,
        to: `0` + toNum,
      })
      .then((success) => {
        console.log("success", success);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="leadsCheckBox form-check-input"
              value={cellProps.row.original._id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
        Cell: (leads) => (
          <>
            {/* {console.log("Leads : ", leads)} */}
            <div className="d-flex align-items-center">
              {leads.row.original.displayName && (
                <div className="flex-shrink-0">
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {getInitials(leads.row.original.displayName)}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex-grow-1 ms-2 name">{leads.row.original.displayName || "- - -"}</div>
            </div>
          </>
        ),
      },
      {
        Header: "Date Of Birth",
        accessor: "dob",
        filterable: false,
        Cell: (leads) => (
          <>
            <div className="flex-grow-1 ms-2 name">{leads.row.original.dateOfBirth || "- - -"}</div>
          </>
        ),
      },
      {
        Header: "Age",
        accessor: "age",
        filterable: false,
        Cell: (leads) => (
          <>
            <div className="flex-grow-1 ms-2 name">{leads.row.original.age || "- - -"}</div>
          </>
        ),
      },
      {
        Header: "Phone",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Lead Source",
        accessor: "source",
        filterable: false,
        Cell: (leads) => (
          <>
            <div className="flex-grow-1 ms-2 name">{leads.row.original.source || "- - -"}</div>
          </>
        ),
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        filterable: false,
        Cell: (leads) => (
          <>
            <div className="flex-grow-1 ms-2 name">
              {new Date(leads.row.original.createdAt).toLocaleTimeString() +
                ", " +
                new Date(leads.row.original.createdAt).toDateString() || "- - -"}
            </div>
          </>
        ),
      },

      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <UncontrolledDropdown>
                  <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm dropdown" tag="button">
                    <i className="ri-more-fill align-middle"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      className="dropdown-item"
                      // href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;
                        setInfo(contactData);
                        handleDropdownItemClick(contactData);
                        handleSendOtp(contactData);
                      }}
                    >
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i> Convert To User
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleLeadClick, checkedAll],
  );

  const defaultdate = () => {
    let d = new Date(),
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (d.getDate() + " " + months[d.getMonth()] + ", " + d.getFullYear()).toString();
  };

  const [date, setDate] = useState(defaultdate());

  document.title = "Leads | Psymate - Management Portal";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [phoneInputValue, setPhoneInputValue] = useState("");
  const [phoneInputValue2, setPhoneInputValue2] = useState("");
  const [otpInputValue, setOtpInputValue] = useState("");
  const [type, setType] = useState("lead");
  const [code, setCode] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [instaValue, setInstaValue] = useState("");
  const [linkInValue, setLinkedInValue] = useState("");
  const [fbValue, setFbValue] = useState("");
  const [twitterValue, setTwitterValue] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentPincode, setCurrentPincode] = useState("");
  const [leadStatuss, setLeadStatus] = useState("");

  const [leadUsers, setLeadUsers] = useState([]);
  const handlePhoneInputChange = (event) => {
    const value = event.target.value;
    setPhoneInputValue(value);
  };

  const handlePhoneValueChange2 = (event) => {
    const value = event.target.value;
    setPhoneInputValue2(value);
  };

  const handleFirstNameChange = (event) => {
    const value = event.target.value;
    setFirstName(value);
  };

  const handleLastNameChange = (event) => {
    const value = event.target.value;
    setLastName(value);
  };

  const handleDobChange = (event) => {
    const value = event.target.value;
    setDob(value);
  };

  const handlAgeChange = (event) => {
    const value = event.target.value;
    setAge(value);
  };

  const calculateDobFromAge = () => {
    if (age) {
      const today = new Date();
      const yearOfBirth = today.getFullYear() - parseInt(age, 10);
      const calculatedDob = new Date(yearOfBirth, 0, 1); // You can adjust the month and day as needed
      setDob(calculatedDob);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleMritalChange = (event) => {
    setMaritalStatus(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };

  const handleInstaChange = (event) => {
    setInstaValue(event.target.value);
  };

  const handleLinkeInChange = (event) => {
    setLinkedInValue(event.target.value);
  };

  const handleTwitterChange = (event) => {
    setTwitterValue(event.target.value);
  };

  const handleFbChange = (event) => {
    setFbValue(event.target.value);
  };

  const handleCurrentAddress = (event) => {
    setCurrentAddress(event.target.value);
  };

  const handleCurrentCountry = (event) => {
    setCurrentCountry(event.target.value);
  };

  const handleCurrentState = (event) => {
    setCurrentState(event.target.value);
  };

  const handleCurrentCity = (event) => {
    setCurrentCity(event.target.value);
  };

  const handleCurrentPinCode = (event) => {
    setCurrentPincode(event.target.value);
  };

  const handleLeadState = (event) => {
    setLeadStatus(event);
  };

  const handleCreateLead = async () => {
    const leadData = {
      phone: phoneInputValue,
      // otp: otpInputValue,
      email: emailValue,
      instagram: instaValue,
      linked_in: linkInValue,
      facebook: fbValue,
      twitter: twitterValue,
      firstName: firstName,
      lastName: lastName,
      displayName: firstName + lastName,
      dateOfBirth: dob,
      gender: gender,
      // uid: "",
      type: type,
      addresses: currentAddress,
      password: "",
      age: age,
      // psyID: { type: Number, unique: true },
      city: currentCity,
      country: currentCountry,
      title: "",
      photoURL: "",
      pincode: currentPincode,
      status: leadStatuss,
      state: currentState,
      categoty: selectedLeadCategories,
      source: selectedLeadSource,
    };

    try {
      const response = await createLead(leadData);
      console.log("Lead created successfully:", response);
    } catch (error) {
      console.error("Error creating lead:", error.message);
    }
  };

  const [info, setInfo] = useState([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const handleSendOtp = async (contactData) => {
    let credential = contactData.phone ? contactData.phone : contactData.email;
    try {
      // Make an API call to SendOTP endpoint
      const response = await axios.get(`${config.api.API_URL}/login/send-otp/${credential}`, {
        params: {
          credential: credential,
        },
      });

      // Check if OTP was sent successfully
      if (response.status === 200) {
        setCode(response.message);
        // console.log(response.message);
        console.log("OTP sent successfully!");
      } else {
        console.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
    }
  };

  const handleOtpChange = (event) => {
    setOtpInputValue(event.target.value);
  };

  const handleSignIn = (res) => {
    if (otpInputValue == code) {
      // setShowNameFields(true);
      handleCreateLeadToUser(res);
      setOtpSent(true);

      // console.log("Success");
    } else {
      toast.error("Wrong OTP");
    }
  };
  const handleCreateLeadToUser = async (res) => {
    // console.log("Res : ", res);
    try {
      const updatedData = {
        phone: res.phone,
        // otp: otpInputValue,
        email: res.email,
        instagram: res.instagram,
        linked_in: res.linked_in,
        facebook: "",
        twitter: "",
        firstName: res.firstName,
        lastName: res.lastName,
        displayName: res.firstName + res.lastName,
        dateOfBirth: res.dateOfBirth,
        gender: res.gender,
        // uid: "",
        type: "patient",
        addresses: "",
        password: "",
        age: res.age,
        // psyID: { type: Number, unique: true },
        city: res.city,
        country: res.country,
        title: "",
        photoURL: "",
        pincode: res.pincode,
        status: res.status,
        state: res.state,
        categoty: res.category,
        source: res.source,
      };
      const result = await convertLeadToUser(res._id, updatedData);
      console.log("Conversion result:", result);
      // Handle the result as needed
    } catch (error) {
      console.error("Error converting lead to user:", error.message);
    }
  };

  const handleDropdownItemClick = async () => {
    setShowOtpModal(true);
  };

  const [totalPages, setTotalPages] = useState(0);
  const fetchData = async (page) => {
    try {
      const users = await getLead(page);
      setLeadUsers(users.data);
      const total = users.totalPages;
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const changeLeadsPage = (page) => {
    setPage((prevPage) => {
      fetchData(prevPage + page);

      return Math.max(prevPage + page, 1);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal show={deleteModal} onDeleteClick={handleDeleteLead} onCloseClick={() => setDeleteModal(false)} />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />

        <Container fluid>
          <BreadCrumb title="Leads" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card id="leadsList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      {/* <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for..."
                          onChange={(e) => searchList(e.target.value)}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div> */}
                    </Col>
                    <div className="col-sm-auto ms-auto">
                      <div className="hstack gap-2">
                        {isMultiDeleteButton && (
                          <button className="btn btn-danger" onClick={() => setDeleteModalMulti(true)}>
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                        <button type="button" className="btn btn-info" onClick={toggleInfo}>
                          <i className="ri-filter-3-line align-bottom me-1"></i> Fliters
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary add-btn"
                          id="create-btn"
                          onClick={() => {
                            setIsEdit(false);
                            toggle();
                          }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add Leads
                        </button>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn btn-soft-info btn-icon fs-14"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ri-settings-4-line"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <li>
                              <DropdownItem>Copy</DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>Move to pipline</DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>Add to exceptions</DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>Switch to common form view</DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>Reset form view to default</DropdownItem>
                            </li>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {leadUsers.length ? (
                      <TableContainer
                        columns={columns}
                        data={leadUsers || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        totalPages={totalPages}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        // handleContactClick={handleContactClicks}
                        isContactsFilter={true}
                        SearchPlaceholder="Search for contact..."
                        onChangeFunction={(page) => {
                          fetchData(page);
                        }}
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                  {/* Pagination Buttons */}
                  <div className="d-flex justify-content-end">
                    <div></div>
                    <div>
                      <button
                        className="btn outline-none"
                        style={{ backgroundColor: "#fa896b", color: "#fff" }}
                        onClick={() => changeLeadsPage(-1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                      <span className="fs-bold mx-3 text-primary"> Page {page} </span>
                      <button
                        className="btn outline-none"
                        style={{ backgroundColor: "#fa896b", color: "#fff" }}
                        onClick={() => changeLeadsPage(1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <Modal centered={true} size="xl" id="showModal" isOpen={modal} toggle={toggle}>
                    <ModalHeader className="p-3 text-uppercase" toggle={toggle}>
                      {!!isEdit ? "Edit Lead" : "Add Lead"}
                    </ModalHeader>
                    <form action="#" className="checkout-tab">
                      <ModalBody className="p-0">
                        <div className="step-arrow-nav">
                          <Nav className="nav-pills nav-justified custom-nav" role="tablist">
                            <NavItem>
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 1,
                                    done: activeTab <= 5 && activeTab >= 0,
                                  },
                                  "p-3",
                                )}
                                onClick={() => {
                                  toggleTab(1);
                                }}
                              >
                                Basic Details
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 2,
                                    done: activeTab <= 5 && activeTab > 1,
                                  },
                                  "p-3",
                                )}
                                onClick={() => {
                                  toggleTab(2);
                                }}
                              >
                                Contact Details
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 3,
                                    done: activeTab <= 5 && activeTab > 2,
                                  },
                                  "p-3",
                                )}
                                onClick={() => {
                                  toggleTab(3);
                                }}
                              >
                                Address Details
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 4,
                                    done: activeTab <= 5 && activeTab > 3,
                                  },
                                  "p-3",
                                )}
                                onClick={() => {
                                  toggleTab(4);
                                }}
                              >
                                Lead Description
                              </NavLink>
                            </NavItem>

                            <NavItem>
                              <NavLink
                                href="#"
                                className={classnames(
                                  {
                                    active: activeTab === 5,
                                    done: activeTab <= 5 && activeTab > 4,
                                  },
                                  "p-3",
                                )}
                                onClick={() => {
                                  toggleTab(5);
                                }}
                              >
                                Verified
                              </NavLink>
                            </NavItem>
                          </Nav>
                        </div>
                      </ModalBody>
                      <div
                        className="modal-body"
                        style={{
                          paddingLeft: "3rem",
                          paddingBottom: "2rem",
                          paddingRight: "3rem",
                        }}
                      >
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId={1}>
                            <Row className="g-3">
                              <Col lg={6}>
                                <div>
                                  <Label for="firstName" className="form-label">
                                    First Name
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    placeholder="Enter your firstname"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div>
                                  <Label for="lastName" className="form-label">
                                    Last Name
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    placeholder="Enter your lastname"
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                  />
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div>
                                  <Label for="dateofBirth" className="form-label">
                                    Date of Birth
                                  </Label>
                                  <Flatpickr
                                    className="form-control"
                                    options={{
                                      dateFormat: "d M, Y",
                                    }}
                                    placeholder="Enter your date of birth"
                                    value={dob}
                                    onChange={handleDobChange}
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div>
                                  <Label for="age" className="form-label">
                                    Age
                                  </Label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="age"
                                    placeholder="Enter your age"
                                    value={age}
                                    onChange={handlAgeChange}
                                    onBlur={calculateDobFromAge}
                                  />
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div>
                                  <Label for="gender" className="form-label">
                                    Gender
                                  </Label>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {options.map((option, index) => (
                                      <div key={index} className="form-check form-radio-danger mb-3">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="genderRadio"
                                          id={`genderRadio${index}`}
                                          value={option}
                                          checked={gender === option}
                                          onChange={handleGenderChange} // Set the first option as defaultChecked
                                        />
                                        <label className="form-check-label" htmlFor={`genderRadio${index}`}>
                                          {option}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div>
                                  <Label for="marriedStatus" className="form-label">
                                    Marital Status
                                  </Label>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {mariiedStatusOptions.map((option, index) => (
                                      <div key={index} className="form-check form-radio-danger mb-3">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="marriedRadio"
                                          id={`marriedRadio${index}`}
                                          value={option} // Set the first option as defaultChecked
                                          checked={maritalStatus === option}
                                          onChange={handleMritalChange}
                                        />
                                        <label className="form-check-label" htmlFor={`marriedRadio${index}`}>
                                          {option}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Col>
                              <Col lg={12}>
                                <div className="d-flex align-items-start gap-3 mt-3">
                                  <button
                                    onClick={() => {
                                      toggleTab(activeTab + 1);
                                    }}
                                    type="button"
                                    className="btn btn-primary btn-label right ms-auto nexttab"
                                  >
                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i> Next Step
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </TabPane>

                          <TabPane tabId={2}>
                            <Row>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="banknameInput" className="form-label">
                                    Phone 1
                                  </Label>
                                  <Input
                                    type="number"
                                    maxLength="10"
                                    className="form-control"
                                    id="phoneInput"
                                    placeholder="Enter your contact number"
                                    value={phoneInputValue}
                                    onChange={handlePhoneInputChange}
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="otp" className="form-label">
                                    Phone 2
                                  </Label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="otp"
                                    placeholder="Enter OTP"
                                    value={phoneInputValue2}
                                    onChange={handlePhoneValueChange2}
                                    // disabled={otpInputDisabled}
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="emailID" className="form-label">
                                    Email ID 1
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    id="emailID"
                                    placeholder="Enter your email"
                                    value={emailValue}
                                    onChange={handleEmailChange}
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="emailID" className="form-label">
                                    Email ID 2
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    id="emailID"
                                    placeholder="Enter your email"
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="instagram" className="form-label">
                                    Instagram
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="insta"
                                    placeholder="Enter your Instagram Handle"
                                    value={instaValue}
                                    onChange={handleInstaChange}
                                  />
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="instagram" className="form-label">
                                    Linkedin
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="linkedin"
                                    placeholder="Enter your LinkedIn Handle"
                                    value={linkInValue}
                                    onChange={handleLinkeInChange}
                                  />
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="fb" className="form-label">
                                    Facebook
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="fb"
                                    placeholder="Enter your Facebook Handle"
                                    value={fbValue}
                                    onChange={handleFbChange}
                                  />
                                </div>
                              </Col>

                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label for="twitter" className="form-label">
                                    Twitter
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="twitter"
                                    placeholder="Enter your Twitter Handle"
                                    value={twitterValue}
                                    onChange={handleTwitterChange}
                                  />
                                </div>
                              </Col>
                              <Col lg={12}>
                                <div className="hstack align-items-start gap-3 mt-4">
                                  <button
                                    onClick={() => {
                                      toggleTab(activeTab - 1);
                                    }}
                                    type="button"
                                    className="btn btn-light btn-label previestab"
                                    data-previous="pills-bill-info-tab"
                                  >
                                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                    Back to Basic Info
                                  </button>
                                  <button
                                    onClick={() => {
                                      toggleTab(activeTab + 1);
                                    }}
                                    type="button"
                                    className="btn btn-primary btn-label right ms-auto nexttab"
                                    data-nexttab="pills-payment-tab"
                                  >
                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                    Next Step
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </TabPane>

                          <TabPane tabId={3}>
                            <Row>
                              <Col lg={12}>
                                <Label for="currentAddress" className="form-label">
                                  Current Address
                                </Label>
                                <Input
                                  type="text"
                                  id="currentAddress"
                                  name="currentAddress"
                                  value={currentAddress}
                                  onChange={handleCurrentAddress}
                                />
                              </Col>

                              <Col lg={6}>
                                <Label for="currentAddress" className="form-label">
                                  Country{" "}
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Enter your Country"
                                  value={currentCountry}
                                  onChange={handleCurrentCountry}
                                />
                              </Col>

                              <Col lg={6}>
                                <Label for="currentAddress" className="form-label">
                                  State{" "}
                                </Label>
                                <Input
                                  type="text"
                                  value={currentState}
                                  onChange={handleCurrentState}
                                  placeholder="Enter your State"
                                />
                              </Col>

                              <Col lg={6}>
                                <Label for="currentAddress" className="form-label">
                                  City{" "}
                                </Label>
                                <Input
                                  type="text"
                                  placeholder="Enter your City"
                                  value={currentCity}
                                  onChange={handleCurrentCity}
                                />
                              </Col>

                              <Col lg={6}>
                                <Label for="currentAddress" className="form-label">
                                  Pincode
                                </Label>
                                <Input
                                  type="text"
                                  id="pincode"
                                  name="pincode"
                                  placeholder="Enter your pincode"
                                  value={currentPincode}
                                  onChange={handleCurrentPinCode}
                                />
                              </Col>
                            </Row>

                            <div className="d-flex align-items-start gap-3 mt-4">
                              <button
                                onClick={() => {
                                  toggleTab(activeTab - 1);
                                }}
                                type="button"
                                className="btn btn-light btn-label previestab"
                                data-previous="pills-bill-address-tab"
                              >
                                <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                Back to Contact Details
                              </button>

                              <button
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                }}
                                type="button"
                                className="btn btn-primary btn-label right ms-auto nexttab"
                              >
                                <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i> Next Step
                              </button>

                              {/* <button
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                }}
                                type="button"
                                className="btn btn-primary btn-label right ms-auto nexttab"
                                data-nexttab="pills-finish-tab"
                              >
                                <i className="ri-save-line label-icon align-middle fs-16 ms-2"></i>
                                Submit
                              </button> */}
                            </div>
                          </TabPane>

                          <TabPane tabId={4}>
                            <Row>
                              <Col lg={12} style={{ paddingTop: "1.5rem" }}>
                                <Label for="currentAddress" className="form-label" style={{ fontSize: "20px" }}>
                                  Lead Status
                                </Label>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                  }}
                                >
                                  {leadStatus.map((option, index) => (
                                    <div key={index} className="form-check form-radio-danger mb-3">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="leadStatusRadio"
                                        id={`leadStatusRadio${index}`}
                                        value={leadStatuss === option}
                                        onChange={() => handleLeadState(option)}
                                      />
                                      <label className="form-check-label" htmlFor={`leadStatusRadio${index}`}>
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg={12} style={{ paddingTop: "1.5rem" }}>
                                <Label for="currentAddress" className="form-label" style={{ fontSize: "20px" }}>
                                  Lead Source
                                </Label>
                                <div className="d-flex justify-content-between">
                                  {leadSourceOptions.map((option, index) => (
                                    <div key={index} className="form-check form-radio mb-3">
                                      <Input
                                        className="form-check-input"
                                        type="radio"
                                        name="leadSource"
                                        id={`leadSourceRadio${index}`}
                                        value={option.value}
                                        checked={selectedLeadSource === option.value}
                                        onChange={() => handleLeadSourceChange(option.value)}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`leadSourceRadio${index}`}
                                        style={{ fontSize: "15px" }}
                                      >
                                        {option.label}
                                      </label>
                                      {option.options && (
                                        <div className="ml-3">
                                          {option.options.map((subOption, subIndex) => (
                                            <div key={subIndex} className="form-check form-radio">
                                              <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`leadSourceSub${index}`}
                                                id={`leadSourceSubRadio${subIndex}`}
                                                value={subOption.value}
                                                checked={selectedLeadSource === subOption.value}
                                                onChange={() => handleLeadSourceChange(subOption.value)}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`leadSourceSubRadio${subIndex}`}
                                              >
                                                {subOption.label}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg={12} style={{ paddingTop: "1.5rem" }}>
                                <Label for="currentAddress" className="form-label" style={{ fontSize: "20px" }}>
                                  Lead Category
                                </Label>
                                <div className="d-flex justify-content-between align-center">
                                  {leadCatOptions.map((option, index) => (
                                    <div key={index} className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`leadCategoryCheckbox${index}`}
                                        value={option.value}
                                        checked={selectedLeadCategories.includes(option.value)}
                                        onChange={() => handleLeadCategoryChange(option.value)}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`leadCategoryCheckbox${index}`}
                                        style={{ fontSize: "15px" }}
                                      >
                                        {option.label}
                                      </label>

                                      {option.options && (
                                        <div className="ml-3">
                                          {option.options.map((subOption, subIndex) => (
                                            <div key={subIndex} className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`leadCategorySubCheckbox${subIndex}`}
                                                value={subOption.value}
                                                checked={selectedLeadCategories.includes(subOption.value)}
                                                onChange={() => handleLeadCategoryChange(subOption.value)}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`leadCategorySubCheckbox${subIndex}`}
                                              >
                                                {subOption.label}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </Col>
                            </Row>

                            <div className="d-flex align-items-start gap-3 mt-4">
                              <button
                                onClick={() => {
                                  toggleTab(activeTab - 1);
                                }}
                                type="button"
                                className="btn btn-light btn-label previestab"
                                data-previous="pills-bill-address-tab"
                              >
                                <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                                Back to Address Details
                              </button>

                              <button
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                  handleCreateLead();
                                }}
                                type="button"
                                className="btn btn-primary btn-label right ms-auto nexttab"
                              >
                                <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i> Next Step
                              </button>
                            </div>
                          </TabPane>

                          <TabPane tabId={5}>
                            <Row className="text-center justify-content-center">
                              <Col lg={12}>
                                <div className="mb-4">
                                  <lord-icon
                                    src="https://cdn.lordicon.com/lupuorrc.json"
                                    trigger="loop"
                                    colors="primary:#0ab39c,secondary:#405189"
                                    style={{ width: "120px", height: "120px" }}
                                  ></lord-icon>
                                </div>
                                <h5>Lead Generated</h5>
                                <div className="hstack justify-content-center gap-2 mt-2">
                                  <button
                                    onClick={toggle}
                                    type="button"
                                    className="btn btn-ghost-success"
                                    data-bs-dismiss="modal"
                                  >
                                    Done <i className="ri-thumb-up-fill align-bottom me-1"></i>
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </TabPane>
                        </TabContent>
                      </div>
                    </form>
                  </Modal>

                  <Modal
                    centered={true}
                    // size="xl"
                    id="showOtpModal"
                    isOpen={showOtpModal}
                    toggle={toggleOtp}
                  >
                    <ModalHeader className="p-3 text-uppercase" toggle={toggleOtp}>
                      Create a User
                    </ModalHeader>
                    <ModalBody className="p-0">
                      <div
                        className="modal-body p-3"
                        // style={{
                        //   paddingLeft: "2rem",
                        //   paddingRight: "3rem",
                        // }}
                      >
                        {otpSent ? (
                          <>
                            <Row className="text-center justify-content-center">
                              <Col lg={12}>
                                <div className="mb-4">
                                  <lord-icon
                                    src="https://cdn.lordicon.com/lupuorrc.json"
                                    trigger="loop"
                                    colors="primary:#0ab39c,secondary:#405189"
                                    style={{ width: "120px", height: "120px" }}
                                  ></lord-icon>
                                </div>
                                <h5>User Generated</h5>
                                <div className="hstack justify-content-center gap-2 mt-2">
                                  <button
                                    // onClick={toggle}
                                    type="button"
                                    className="btn btn-ghost-success"
                                    data-bs-dismiss="modal"
                                  >
                                    Done <i className="ri-thumb-up-fill align-bottom me-1"></i>
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <>
                            <Row className="gy-4">
                              <Col>
                                <div>
                                  <Label htmlFor="basiInput" className="form-label">
                                    Mobile Number
                                  </Label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="mobNo"
                                    placeholder="Enter Mobile Number"
                                    value={info.phone}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row className="gy-4 pt-3">
                              <Col>
                                <div>
                                  <Label htmlFor="basiInput" className="form-label">
                                    OTP
                                  </Label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="otp"
                                    placeholder="Enter OTP"
                                    onChange={handleOtpChange}
                                    value={otpInputValue}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row className="gy-4 pt-3">
                              <Col>
                                <Button
                                  style={{ width: "100%" }}
                                  onClick={() => {
                                    handleSignIn(info);
                                  }}
                                >
                                  Submit OTP
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                      </div>
                    </ModalBody>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <CrmFilter show={isInfoDetails} onCloseClick={() => setIsInfoDetails(false)} />
    </React.Fragment>
  );
};

export default CrmLeads;
