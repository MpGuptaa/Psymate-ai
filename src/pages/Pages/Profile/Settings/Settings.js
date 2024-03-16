import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import "./setting.css";

import avatar2 from "../../../../assets/images/users/avatar-2.jpg";
import avatar4 from "../../../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../../../assets/images/users/avatar-5.jpg";
//import images
import progileBg from "../../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { event } from "jquery";
import axios from "axios";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import config from "../../../../config";
import profileBg from "./../../../../assets/images/profile-bg.jpg";
import { Table } from "feather-icons-react/build/IconComponents";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import Clinicalhistory from "../SimplePage/components/Clinicalhistory";
import PrescriptionCreate from "../../../Prescriptions/PrescriptionCreate";
import InvoiceCreate from "../../../Invoices/InvoiceCreate";
import { getTimeDifference } from "../../../../helpers/Helper";
import Assesments from "../SimplePage/components/Assesments";
import { document } from "../../../../common/data";
import { toast } from "react-toastify";
import Tools from "../../../Forms/Builder/Tools";

const getTimeInIST = (timeStr) => {
  const dateString = timeStr;
  const date = new Date(dateString);
  const hours = date.getHours() + 5;
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return formattedTime;
};

// const getTimeInIST = (dateString) => {

//   const formatter = new Intl.DateTimeFormat("en-IN", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//     timeZone: "Asia/Kolkata",
//   });

//   const formattedTime = formatter.format(new Date(dateString));
//   return formattedTime;
// };

const Settings = () => {
  const [timeline, setTimeline] = useState([]);

  document.title = "Profile Settings | Psymate - Management Portal";

  const [activeTab, setActiveTab] = useState(1);
  const [jobdescription, setJobdescription] = useState(
    "You always want to make sure that your fonts work well together and try to limit the number of fonts you use to three or less. Experiment and play around with the fonts that you already have in the software you're working with reputable font websites."
  );
  // const { user } = useSelector((state) => ({
  //   user: state.Profile.user,
  // }));

  const [state,setState] = useState([]);


  const [user, setUser] = useState([]);
  // console.log("USERS : : : ", user);

  // Get a specific parameter value
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get("id");
  // console.log("ttt ",userId)
  const { loading } = useProfile();

  const getUser = async () => {
    if (userId)
      await axios
        .get(`/users?search=${userId}&searchBy=_id&exact=true`)
        .then((res) => {
          console.log("user res-->", res);
          setUser(res.data[0]);
          setFirstName(user?.firstName);
          setState(res.data[0]);
          setLastName(user?.lastName);
          setAge(user?.age);
        });
  };
  
  const handleUpdate = async () => {
    try {
      await axios.put(`${config.api.API_URL}/user/${user._id}`, 
      state
      );
  
      toast.success(`Changes Updated`);
  
    } catch (error) {
      throw new Error(error.message || "Network error");
    }
  };
  
  useEffect(() => {
    getUser();
    console.log("user in settings->", user);
  }, [loading]);

  const [forms, setForms] = useState([]);

  const titleOptions = [
    { value: "Dr", label: "Dr." }, 
    { value: "Ms", label: "Ms." },
    { value: "Mr", label: "Mr." },
  ];

  const specialityOptions = [
    { value: "Psychiatry", label: "Psychiatry" },
    { value: "Psycology", label: "Psycology" },
    { value: "Neurology", label: "Neurology" },
    { value: "Internal Medicines", label: "Internal Medicines" },
  ];

  const availabilityOptions = [
    { value: "1", label: "Onsite" },
    { value: "2", label: "Virtual" },
    { value: "3", label: "Hybrid" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
  ];

  const durationOptions = [
    { value: "15 Minutes", label: "15 Minutes" },
    { value: "20 Minutes", label: "20 Minutes" },
    { value: "25 Minutes", label: "25 Minutes" },
    { value: "30 Minutes", label: "35 Minutes" },
    { value: "40 Minutes", label: "45 Minutes" },
    { value: "50 Minutes", label: "50 Minutes" },
    { value: "55 Minutes", label: "55 Minutes" },
    { value: "60 Minutes", label: "60 Minutes" },
  ];

  const jobDescription = (e) => {
    setJobdescription(e.target.value);
  };

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [selectedDays, setSelectedDays] = useState([]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // const clinicNames = [
  //   "Psymate Clinic - Noida",
  //   "Psymate Clinic - South Delhi",
  //   "Psymate Clinic - Gurgaon",
  // ];

  const [selectedGender, setSelectedGender] = useState("");
  const [firstName, setFirstName] = useState("");
  // const [firstName, setFirstName]=useState(user?.firstName);
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(null);
  const [selectedMarital, setSelectedMarital] = useState(null);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Others", value: "Others" },
  ];

  const marriedOptions = [
    { label: "Married", value: "Married" },
    { label: "UnMarried", value: "UnMarried" },
  ];

  const handleAdreesChange = () => {
    setUseSameAddress(!useSameAddress);

    if (!useSameAddress) {
      setPermanentAddress({ ...currentAddress });
    } else {
      setPermanentAddress({
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    }
  };

  const [clinicNames, setClinicName] = useState([]);
  const [establishmentData, setEstablishmentData] = useState([]);
  const [slotsData, setSlotsData] = useState([]);
  const [slotsLoading, setSlotLoading] = useState(false);
  const [estLoading, setEstLoading] = useState(false);

  const location = useLocation();

  const getSessions = async () => {
    setSlotLoading(true);
    await axios
      .get(`/sessions?doctorId=${userId}&slotDuration=120`)
      .then((res) => {
        console.log("res : : ", res);
        setSlotsData(res);
      })
      .finally(() => setSlotLoading(false));
  };

  const est = async () => {
    setEstLoading(true);
    const response = await axios.get(config.api?.API_URL + `/establishment`);
    console.log("!!! : ", response);
    const filteredData = response.data.filter((item) => item.establishmentName);
    setEstablishmentData(response.data);
    // Extract establishment names
    const establishmentNames = filteredData.map(
      (item) => item.establishmentName
    );

    // console.log("Establishment Names: ", establishmentNames);

    setClinicName(establishmentNames);
    setEstLoading(false);
  };

  useEffect(() => {
    getSessions();
    est();
  }, []);

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleMaritalChange = (event) => {
    setSelectedMarital(event.target.value);
  };

  const [openClinics, setOpenClinics] = useState(
    Array(clinicNames.length).fill(false)
  );
  const [sessionsData, setSessionsData] = useState([]);

  const [clinicStates, setClinicStates] = useState(
    clinicNames.map(() => ({
      openInputIndex: -1,
      selectedDuration: "30", // Initial duration value
      selectedDays: [], // Initial selected days
      // Add other state properties for each clinic
    }))
  );

  const handleClinicClick = (index) => {
    const updatedOpenClinics = [...openClinics];
    updatedOpenClinics[index] = !updatedOpenClinics[index];
    setOpenClinics(updatedOpenClinics);
  };

  const handleDurationChange = (index, duration) => {
    setClinicStates((prevClinicStates) => {
      const updatedClinicStates = [...prevClinicStates];
      updatedClinicStates[index].selectedDuration = duration;
      return updatedClinicStates;
    });
  };

  const handleCheckboxChange = (index, day, checked) => {
    setClinicStates((prevClinicStates) => {
      const updatedClinicStates = [...prevClinicStates];
      if (checked) {
        updatedClinicStates[index].selectedDays = [
          ...updatedClinicStates[index].selectedDays,
          day,
        ];
      } else {
        updatedClinicStates[index].selectedDays = updatedClinicStates[
          index
        ].selectedDays.filter((d) => d !== day);
      }
      return updatedClinicStates;
    });
  };

  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  const [selectedDuration, setSelectedDuration] = useState("");

  const [selectedTitle, setSelectedTitle] = useState(
    user.title ? user.title : ""
  );
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedSpeciality, setSelectedSpeciaity] = useState(
    user.specialization ? user.specialization : ""
  );

  const [selectedLanguage, setSelectedLanguage] = useState(
    user.languages ? user.languages : ""
  );

  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleSpecialityChange = (event) => {
    setSelectedSpeciaity(event.target.value);
  };

  const handleAvailabilityChange = (event) => {
    setSelectedAvailability(event.target.value);
  };

  const handleLanguage = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const [academicDetails, setAcademicDetails] = useState([]);
  const [workDetails, setWorkDetails] = useState([]);

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

  const handleAcademicDetailChange = (index, field, value) => {
    const updatedAcademicDetails = [...academicDetails];
    updatedAcademicDetails[index][field] = value;
    setAcademicDetails(updatedAcademicDetails);
  };

  const handleAddWorkDetails = () => {
    const newWorkDetail = {
      job: "",
      organisation: "",
      joiningDate: "",
      completionDate: "",
    };
    setWorkDetails([...workDetails, newWorkDetail]);
  };

  const handleWorkChange = (index, field, value) => {
    const updatedWorkDetails = [...workDetails];
    updatedWorkDetails[index][field] = value;
    setWorkDetails(updatedWorkDetails);
  };

  const handleDeleteWorkDetail = (index) => {
    const updatedWorkDetails = [...workDetails];
    updatedWorkDetails.splice(index, 1);
    setWorkDetails(updatedWorkDetails);
  };

  const [openInputIndex, setOpenInputIndex] = useState(-1);
  const [copyTimingsMap, setCopyTimingsMap] = useState(new Map());

  const [newEmail, setNewEmail] = useState("");
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const [subMenu, setSubMenu] = useState("Clinical History");

  const handleUpdateEmail = () => {
    // Implement the logic to update the email address on the server here.
    // For this example, we'll just set it in the component state.
    user.email = newEmail;
    setIsEmailUpdated(true);
  };

  const GetAddTimingJSX = (data) => {
    const { daysOfWeek, timeMap, index, startTime, endTime, establishment } =
      data;

    const AddTimingJSX = (
      <>
        <Row>
          <Col lg={12}>
            <div className="mb-3">
              <Label htmlFor="visitTime" className="form-label">
                Doctor Visit Timings
              </Label>

              <div className="checkbox-days-container">
                {daysOfWeek.map((day) => {
                  const allOtherDays = [...timeMap.entries()].filter(
                    ([key, value]) => !key.toLowerCase().includes("sunday")
                  );

                  const allStartAndEndDates = allOtherDays.map(
                    ([key, value]) => value
                  );
                  let isChecked = false;

                  // const isDayMatching = allOtherDays.some(([key, value]) =>
                  //   key.toLowerCase().includes(day.toLowerCase())
                  // );
                  //
                  // if (isDayMatching) {
                  //   const isStartAndEndTImeMatching =
                  //     allStartAndEndDates.reduce((acc, val) => {
                  //       if (acc === true) return true;
                  //
                  //       return (
                  //         acc.startTime === val.startTime &&
                  //         acc.endTime === val.endTime
                  //       );
                  //     });
                  //
                  //   isChecked = isStartAndEndTImeMatching;
                  // }

                  return (
                    <div key={day}>
                      <label>
                        <input
                          type="checkbox"
                          value={day}
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxChange(index, day, e.target.checked)
                          }
                          className="days-input"
                        />
                        {day}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <Label>Session 1</Label>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="startTimeInput" className="form-label">
                    Start Time
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="startTimeInput"
                    placeholder="Enter your Start Time"
                    // defaultValue={startTime}
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="endTimeInput" className="form-label">
                    End Time
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="endTimeInput"
                    placeholder="Enter your End Time"
                    // defaultValue={endTime}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Label>Session 2</Label>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="startTimeInput" className="form-label">
                    Start Time
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="startTimeInput"
                    placeholder="Enter your Start Time"
                    // defaultValue={}
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="endTimeInput" className="form-label">
                    End Time
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="endTimeInput"
                    placeholder="Enter your End Time"
                    // defaultValue={}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );

    const FinalJSX = copyTimingsMap.get(establishment) && (
      <>
        {[...Array(copyTimingsMap.get(establishment))].map(() => AddTimingJSX)}
      </>
    );

    return FinalJSX;
  };

  const handleAddTimingButtonClick = (establishment) => {
    const finalCount = copyTimingsMap.get(establishment) + 1;

    setCopyTimingsMap((map) => {
      var newMap = new Map(map);
      newMap.set(establishment, finalCount || 1);

      return newMap;
    });

    console.log(copyTimingsMap);
  };

  const [dob, setDob] = useState({
    // Assuming initial user data
    dateOfBirth: user?.dateOfBirth ? user?.dateOfBirth : null,
    // Other user data
  });

  function formatDate(dateString) {
    // Function to ensure the date is always in "mm/dd/yyyy" format
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }

  const updateUserDateOfBirth = (newDateOfBirth) => {
    // Update the user's date of birth in the state
    setDob({ ...dob, dateOfBirth: newDateOfBirth });
  };

  const [useSameAddress, setUseSameAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [permanentAddress, setPermanentAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const handleAddresshange = () => {
    setUseSameAddress(!useSameAddress);

    if (!useSameAddress) {
      setPermanentAddress({ ...currentAddress });
    } else {
      setPermanentAddress({
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    }
  };

  const [activityTab, setActivityTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const toggleActivityTab = (tab) => {
    if (activityTab !== tab) {
      setActivityTab(tab);
    }
  };

  const leftPane = () => {
    return (
      <Col xxl={3}>
        <Card>
          <CardBody>
            <h5 className="card-title mb-5">Complete Your Profile</h5>
            <Progress
              value={30}
              color="danger"
              className="animated-progess custom-progress progress-label"
            >
              <div className="label">30%</div>
            </Progress>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h5 className="card-title mb-3">Basic Details</h5>
            <div className="table-responsive">
              <Table className="table-borderless mb-0">
                <tbody>
                  <tr>
                    <th className="ps-0" scope="row">
                      Full Name :
                    </th>
                    <td className="text-muted">{user?.displayName}</td>
                  </tr>
                  <tr>
                    <th className="ps-0" scope="row">
                      Date of Birth :
                    </th>
                    <td className="text-muted">{user?.dob}</td>
                  </tr>
                  <tr>
                    <th className="ps-0" scope="row">
                      Gender :
                    </th>
                    <td className="text-muted text-capitalize">
                      {user?.gender}
                    </td>
                  </tr>
                  <tr>
                    <th className="ps-0" scope="row">
                      Psymate ID :
                    </th>
                    <td className="text-muted">{user?.psyID}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h5 className="card-title mb-3">Contact Details</h5>
            <div className="table-responsive">
              <Table className="table-borderless mb-0">
                <tbody>
                  <tr>
                    <th className="ps-0" scope="row">
                      Phone Number :
                    </th>
                    <td className="text-muted">{user?.phone}</td>
                  </tr>
                  <tr>
                    <th className="ps-0" scope="row">
                      Email Id :
                    </th>
                    <td className="text-muted">{user?.email}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h5 className="card-title mb-3">Address Details</h5>
            {user?.addresses?.map((i) => (
              <div key={i.itemId} className="table-responsive">
                <Table className="table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="ps-0" scope="row">
                        Name :
                      </th>
                      <td className="text-muted">{`${i?.firstName} ${i?.lastName}`}</td>
                    </tr>
                    <tr>
                      <th className="ps-0" scope="row">
                        Address :
                      </th>
                      <td className="text-muted">{i?.addressLine1}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ))}
          </CardBody>
        </Card>

        
      </Col>
    );
  };

  const slotsMap = new Map();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="profile-foreground position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg">
              <img src={profileBg} alt="" className="profile-wid-img" />
            </div>
          </div>
          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <Row className="g-4">
              <div className="col-auto">
                <div className="avatar-lg">
                  <img
                    src={avatar1}
                    alt="user-img"
                    className="img-thumbnail rounded-circle"
                  />
                </div>
              </div>

              <Col>
                <div className="p-2">
                  <h3 className="text-white mb-1 profile-text-color">
                    {user?.displayName}
                  </h3>
                  <p className="text-white-75 profile-text-color">
                    {user?.qualifications}
                  </p>
                  <p className="text-white-75 profile-text-color">
                    PSY ID : {user?.psyID}
                  </p>
                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle profile-text-color"></i>
                      {user?.country}
                    </div>
                    <div>
                      <i className="ri-building-line me-1 text-white-75 fs-16 align-middle profile-text-color"></i>
                      {user?.category?.[0]}
                    </div>
                  </div>
                </div>
              </Col>
              
            </Row>
          </div>

          <Row style={{ paddingBottom: "4rem" }}>
            <Col lg={12}>
              <div>
                <div className="d-flex profile-wrapper">
                  <Nav
                    pills
                    className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        href={`/pages-profile?id=${userId}#overview-tab`}
                        className={classnames({ active: activeTab === "9" })}
                        onClick={() => {
                          toggleTab("9");
                        }}
                      >
                        <i className="ri-airplay-fill d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">
                          Overview
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href={`/pages-profile?id=${userId}#activities`}
                        className={classnames({ active: activeTab === "10" })}
                        onClick={() => {
                          toggleTab("10");
                        }}
                      >
                        <i className="ri-list-unordered d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">
                          EMR
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href={`/pages-profile?id=${userId}#projects`}
                        className={classnames({ active: activeTab === "11" })}
                        onClick={() => {
                          toggleTab("11");
                        }}
                      >
                        <i className="ri-price-tag-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">
                          Financials
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href={`/pages-profile?id=${userId}#documents`}
                        className={classnames({ active: activeTab === "12" })}
                        onClick={() => {
                          toggleTab("12");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">
                          Documents
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        // href="#documents"
                        className={classnames({ active: activeTab === "13" })}
                        onClick={() => {
                          toggleTab("13");
                        }}
                      >
                        <Link to={`/pages-profile?id=${userId}#documents`}>
                          <i className="ri-folder-4-line d-inline-block d-md-none"></i>
                          <span className="d-none d-md-inline-block profile-text-color ">
                            Timeline
                          </span>
                        </Link>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href={`/pages-profile?id=${userId}#analytics`}
                        className={classnames({ active: activeTab === "14" })}
                        onClick={() => {
                          toggleTab("14");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">
                          Analytics
                        </span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <div className="flex-shrink-0 d-flex">
                    {/* <div className="m-3">
                      <AsyncSelect
                        className="mb-0"
                        // value={{
                        //   value: selectedOption,
                        //   label: selectedOption?.displayName,
                        // }}
                        placeholder="Search For Patients"
                        onChange={(e) => {
                          setUser(e.value);
                        }}
                        loadOptions={async (inputValue) => {
                          try {
                            const response = await axios.get(
                              config.api.API_URL +
                                `/users?search=${inputValue}&type=patient&searchBy=displayName`
                            );
                            const data = response.data;
                            const options = data.map((item) => ({
                              value: item,
                              label: item.displayName,
                            }));
                            return options;
                          } catch (error) {
                            console.error("Error loading options:", error);
                            return [];
                          }
                        }}
                        isClearable
                        isSearchable
                      />
                    </div> */}
                    <div className="m-3">
                      <Link
                        to={`/pages-profile-settings?id=${userId}`}
                        className="btn btn-success yellow-btn"
                      >
                        <i className="ri-edit-box-line align-bottom"></i> Edit
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xxl={2}>
              <Card className="mt-n5">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      <img
                        src={user?.photoURL ? user?.photoURL : avatar1}
                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                        alt="user-profile"
                      />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-17 mb-1">{user?.displayName}</h5>
                    <p className="text-muted mb-0">{user?.qualifications}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-5">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Complete Your Profile</h5>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        to="#"
                        className="badge bg-light text-primary fs-12"
                      >
                        <i className="ri-edit-box-line align-bottom me-1"></i>{" "}
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="progress animated-progress custom-progress progress-label">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "30%" }}
                      aria-valuenow="30"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div className="label">30%</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Portfolio</h5>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        to="#"
                        className="badge bg-light text-primary fs-12"
                      >
                        <i className="ri-add-fill align-bottom me-1"></i> Add
                      </Link>
                    </div>
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                        <i className="ri-twitter-fill"></i>
                      </span>
                    </div>
                    <Input
                      type="email"
                      className="form-control"
                      id="gitUsername"
                      placeholder="Username"
                      defaultValue={user?.userId}
                    />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-primary">
                        <i className="ri-global-fill"></i>
                      </span>
                    </div>
                    <Input
                      type="text"
                      className="form-control"
                      id="websiteInput"
                      placeholder="www.example.com"
                      defaultValue={user?.email}
                    />
                  </div>
                  <div className="mb-3 d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-success">
                        <i className="ri-linkedin-fill"></i>
                      </span>
                    </div>
                    <Input
                      type="text"
                      className="form-control"
                      id="dribbleName"
                      placeholder="Username"
                      defaultValue={user?.userId}
                    />
                  </div>
                  <div className="d-flex">
                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                      <span className="avatar-title rounded-circle fs-16 bg-danger">
                        <i className="ri-facebook-fill"></i>
                      </span>
                    </div>
                    <Input
                      type="text"
                      className="form-control"
                      id="pinterestName"
                      placeholder="Username"
                      defaultValue={user?.firstName}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={10}>
              <Card className="mt-xxl-n5">
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >

                    {
                      [
                        "Basic Details",
                        "Contact Details",
                        "Verification Details",
                        "Academic Details",
                        "Work Details",
                        "Roles"
                      ].map((data,index)=>(
                        <NavItem key={index}>
                        <NavLink
                          className={classnames({ active: activeTab === index + 1 })}
                          onClick={() => {
                            tabChange(index + 1); 
                          }}
                          type="button"
                        >
                          <i className="fas fa-home"></i>
                          {data}
                        </NavLink>
                      </NavItem>
                      ))
                    }


                    {user.type != "patient" && (
                      <>
                        <NavItem>
                          <NavLink
                            to="#"
                            className={classnames({
                              active: activeTab === 7,
                            })}
                            onClick={() => {
                              tabChange(7);
                            }}
                            type="button"
                          >
                            <i className="far fa-user"></i>
                            Practice Details{" "}
                          </NavLink>
                        </NavItem>

                        <NavItem>
                          <NavLink
                            to="#"
                            className={classnames({
                              active: activeTab === 8,
                            })}
                            onClick={() => {
                              tabChange(8);
                            }}
                            type="button"
                          >
                            <i className="far fa-user"></i>
                            Appointment Details{" "}
                          </NavLink>
                        </NavItem>
                      </>
                    )}
                    
                  </Nav>
                </CardHeader>

                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId={1}>
                      <Form>
                        <Row>
                          <Tools 
                          setState={setState}
                          state={state}
                          inputs={[
                            {
                              element : "text",
                              label : "First Name",
                              name: "firstName",
                              width: "6", 
                            },
                            {
                              element : "text",
                              label : "Last Name",
                              name: "lastName",
                              width: "6",
                            },
                            {
                              element : "date",
                              label : "Date of birth", 
                              name: "dateOfBirth",
                              width: "6",
                            
                            },
                            {
                              element : "number",
                              label : "Age",
                              name: "age",
                              width: "6",
                            },
                            
                          ]}
                         />
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="genderInput"
                                className="form-label"
                              >
                                Gender
                              </Label>
                              <div className="form-check form-radio-danger mb-3 radio-days-container">
                                {genderOptions.map((option, index) => (
                                  <div key={index}>
                                    <Input
                                      className="form-check-input"
                                      type="radio"
                                      name="genderRadio"
                                      id={`genderRadio${index}`}
                                      value={option.value}
                                      checked={selectedGender === option.value}
                                      onChange={handleGenderChange}
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor={`genderRadio${index}`}
                                    >
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="maritalInput"
                                className="form-label"
                              >
                                Marital Status
                              </Label>
                              <div className="form-check form-radio-danger mb-3 radio-days-container">
                                {marriedOptions.map((option, index) => (
                                  <div key={index}>
                                    <Input
                                      className="form-check-input"
                                      type="radio"
                                      name="maritalRadio"
                                      id={`maritalRadio${index}`}
                                      value={option.value}
                                      checked={selectedMarital == option.value}
                                      onChange={handleMaritalChange}
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor={`genderRadio${index}`}
                                    >
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Col>

                        </Row>
                        
                       
                          <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                }}
                              >
                                Next
                              </button>
                              <button
                                type="button"
                                className="btn btn-soft-success"
                              >
                                Cancel
                              </button>
                            </div>
                          </Col>
                      </Form>
                    </TabPane>


                    <TabPane tabId={2}>
                      <Form>
                        <Row>

                        <Tools 
                          setState={setState}
                          state={state}
                          inputs={[
                            {
                              element : "number",
                              label : "Phone Number",
                              name: "phone",
                              width: "6",
                            },
                            {
                              element : "number",
                              label : " Alternate Phone Number",
                              name: "alternateNumber",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Email Address",
                              name: "email",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Alternate Email Address",
                              name: "alternateEmail",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Current Address",
                              name: "currentAddress",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Country",
                              name: "country",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Address Line 1",
                              name: "address1",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Address Line 2",
                              name: "address2",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "City",
                              name: "city",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Postal Code",
                              name: "postalCode",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "State",
                              name: "state",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Permanent Address",
                              name: "permanent",
                              width: "6",
                            },
                            {
                              element : "text",
                              label : "Same as Current Address",
                              name: "address2",
                              width: "6",
                            },
                          ]}
                         />

                          

                          <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                }}
                              >
                                Next
                              </button>
                              <button
                                type="button"
                                className="btn btn-soft-success"
                              >
                                Cancel
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>

                    <TabPane tabId={3}>
                      <Form>
                        <Row className="g-2">
                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="oldpasswordInput"
                                className="form-label"
                              >
                                Identification Id*
                              </Label>

                              <select
                                className="form-select mb-3"
                                aria-label="Default select example"
                              >
                                <option value="1">Adhar Number</option>
                                <option value="2">PAN Number</option>
                                <option value="3">Passport Number</option>
                              </select>
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="newpasswordInput"
                                className="form-label"
                              >
                                Identification Number*
                              </Label>
                              <Input
                                required
                                type="text"
                                className="form-control"
                                id="idNo"
                                placeholder="Enter Identification Number"
                              />
                            </div>
                          </Col>
                        </Row>
                      </Form>
                      <Col className="mt-2">
                        <Dropzone
                          className="dropzone-design"
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone dz-clickable">
                              <div
                                className="dz-message needsclick"
                                {...getRootProps()}
                              >
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
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
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
                      </Col>
                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                        <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                }}
                              >
                                Next
                              </button>
                          <button
                            type="button"
                            className="btn btn-soft-success"
                          >
                            Cancel
                          </button>
                        </div>
                      </Col>
                    </TabPane>

                    <TabPane tabId={4}>
                      <Form>
                        <Row className="g-2">
                          <Col lg={4}>
                            <div>
                              <Label className="form-label">
                                Academic Details*
                              </Label>
                            </div>
                            {academicDetails.map((academicDetail, index) => (
                              <div key={index} className="mb-3">
                                <div className="qualification-container">
                                  <Label className="form-label">
                                    Qualification
                                  </Label>
                                  <Input
                                    type="text"
                                    value={academicDetail.qualification}
                                    className="form-control"
                                    id="qualification"
                                    onChange={(e) =>
                                      handleAcademicDetailChange(
                                        index,
                                        "qualification",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="qualification-container">
                                  <Label className="form-label">
                                    Institute Name
                                  </Label>
                                  <Input
                                    type="text"
                                    value={academicDetail.instituteName}
                                    className="form-control"
                                    id="instituteName"
                                    onChange={(e) =>
                                      handleAcademicDetailChange(
                                        index,
                                        "instituteName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="qualification-container">
                                  <Label className="form-label">
                                    Year of Completion
                                  </Label>
                                  <Input
                                    type="text"
                                    value={academicDetail.yearOfCompletion}
                                    className="form-control"
                                    id="yearOfCompletion"
                                    onChange={(e) =>
                                      handleAcademicDetailChange(
                                        index,
                                        "yearOfCompletion",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <Button
                                  onClick={() =>
                                    handleDeleteAcademicDetail(index)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}

                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddAcademicDetails();
                              }}
                            >
                              Add Academic Details
                            </Button>
                          </Col>
                        </Row>
                      </Form>

                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                        <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                }}
                              >
                                Next
                              </button>
                          <button
                            type="button"
                            className="btn btn-soft-success"
                          >
                            Cancel
                          </button>
                        </div>
                      </Col>
                    </TabPane>

                    <TabPane tabId={5}>
                      <Form>
                        <Row className="g-2" style={{ paddingTop: "2rem" }}>
                          <Col lg={4}>
                            <div>
                              <Label className="form-label">
                                Work Details*
                              </Label>
                            </div>
                            {workDetails.map((academicDetail, index) => (
                              <div key={index} className="mb-3">
                                <div className="qualification-container">
                                  <Label className="form-label">
                                    Job Title
                                  </Label>
                                  <Input
                                    type="text"
                                    value={workDetails.job}
                                    className="form-control"
                                    id={`job-${index}`} // Unique id for job input
                                    onChange={(e) =>
                                      handleWorkChange(
                                        index,
                                        "job",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="qualification-container">
                                  <Label className="form-label">
                                    Name of Organisation
                                  </Label>
                                  <Input
                                    type="text"
                                    value={workDetails.organisation}
                                    className="form-control"
                                    id={`organisation-${index}`} // Unique id for organisation input
                                    onChange={(e) =>
                                      handleWorkChange(
                                        index,
                                        "organisation",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="qualification-container">
                                  <Label className="form-label">
                                    Date of joining
                                  </Label>
                                  <Input
                                    type="text"
                                    value={workDetails.joiningDate}
                                    className="form-control"
                                    id={`joiningDate-${index}`} // Unique id for joiningDate input
                                    onChange={(e) =>
                                      handleWorkChange(
                                        index,
                                        "joiningDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="qualification-container">
                                  <Label className="form-label">
                                    Date of Completion
                                  </Label>
                                  <Input
                                    type="text"
                                    value={workDetails.completionDate}
                                    className="form-control"
                                    id={`completionDate-${index}`} // Unique id for completionDate input
                                    onChange={(e) =>
                                      handleWorkChange(
                                        index,
                                        "completionDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <Button
                                  onClick={() => handleDeleteWorkDetail(index)}
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}

                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddWorkDetails();
                              }}
                            >
                              Add Work Details
                            </Button>
                          </Col>
                          <div className="hstack gap-2 justify-content-end">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  toggleTab(activeTab + 1);
                                }}
                              >
                                Next
                              </button>
                              <button
                                type="button"
                                className="btn btn-soft-success"
                              >
                                Cancel
                              </button>
                            </div> 
                        </Row>
                      </Form>
                    </TabPane>

                    <TabPane tabId={6}>
                      <Form>
                        <Row className="g-2">
                          <Col lg={4}>
                            <div>
                              <Label htmlFor="roles" className="form-label">
                                Roles*
                              </Label>

                              <select
                                className="form-select mb-3"
                                aria-label="Default select example"
                              >
                                <option value="1">Admin</option>
                                <option value="2">Practitioner</option>
                              </select>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            onClick={handleUpdate}
                            className="btn btn-primary"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-soft-success"
                          >
                            Cancel
                          </button>
                        </div>
                      </Col>
                    </TabPane>

                    <TabPane tabId={7}>
                      <Form>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="title" className="form-label">
                                Display Title
                              </Label>
                              <select
                                className="form-select mb-3"
                                id="titleDropdown"
                                value={selectedTitle}
                                onChange={handleTitleChange}
                              >
                                {titleOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="fullnameInput"
                                className="form-label"
                              >
                                Display Name
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="fyllnameInput"
                                placeholder="Enter your Full name"
                                defaultValue={user?.displayName}
                              />
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="mb-3 pb-2">
                              <Label
                                htmlFor="exampleFormControlTextarea"
                                className="form-label"
                              >
                                Description
                              </Label>
                              <textarea
                                style={{ height: "150px" }}
                                className="form-control"
                                id="exampleFormControlTextarea"
                                rows="3"
                                defaultValue={user?.about}
                              ></textarea>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="speciality"
                                className="form-label"
                              >
                                Speciality{" "}
                              </Label>
                              <select
                                className="form-select mb-3"
                                id="titleDropdown"
                                value={selectedSpeciality}
                                onChange={handleSpecialityChange}
                              >
                                {specialityOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="qualificationInput"
                                className="form-label"
                              >
                                Qualification
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="qualificationInput"
                                placeholder="Enter your Qualifications"
                                defaultValue={user?.qualifications}
                              />
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="designationInput"
                                className="form-label"
                              >
                                Designation
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="designationInput"
                                placeholder="Enter your Designation"
                                defaultValue={user?.designation}
                              />
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="experienceInput"
                                className="form-label"
                              >
                                Experience Years
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="experienceInput"
                                placeholder="Enter your Experience Years"
                                defaultValue={user?.yearsOfExperience}
                              />
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="availability"
                                className="form-label"
                              >
                                Availability{" "}
                              </Label>
                              <select
                                className="form-select mb-3"
                                id="availability"
                                value={selectedAvailability}
                                onChange={handleAvailabilityChange}
                              >
                                {availabilityOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="language" className="form-label">
                                Language{" "}
                              </Label>
                              <select
                                className="form-select mb-3"
                                id="availability"
                                value={selectedLanguage}
                                onChange={handleLanguage}
                              >
                                {languageOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="consultationFees"
                                className="form-label"
                              >
                                Consultation Fees*
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="price"
                                placeholder="Enter your Consultation Fees"
                                defaultValue="1500"
                              />
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="meetInput" className="form-label">
                                Meet Link
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="meetInput"
                                placeholder="Enter your Meet Link"
                                defaultValue={
                                  user?.meetLink ? user.meetLink : ""
                                }
                              />
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                              <button
                                type="button"
                                onClick={handleUpdate}
                                className="btn btn-primary"
                              >
                                Update
                              </button>
                              <button
                                type="button"
                                className="btn btn-soft-success"
                              >
                                Cancel
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>

                    <TabPane tabId={8}>
                      <Form>
                        <Row className="g-2">
                          <div>
                            <Form>
                              {!slotsLoading &&
                                !estLoading &&
                                establishmentData.map((clinic, index) => {
                                  const matchedSlots = slotsData.find(
                                    (obj) => clinic._id === obj.establishment
                                  );

                                  // console.log("matchedSlots : ",matchedSlots)

                                  // if (!matchedSlots) return <></>;

                                  let startTime, endTime;
                                  let startTimeForSunday, endTimeForSunday;

                                  const timeMap = new Map();

                                  if (matchedSlots?.slots) {
                                    const slotsArr = Object.entries(
                                      matchedSlots.slots
                                    );

                                    slotsArr.forEach((arr) => {
                                      const [key, value] = arr;

                                      const datesArr = value
                                        .map(({ time }) => time)
                                        .map((item) => item.split("-"))
                                        .flat(1)
                                        .map((item) => item.trim())
                                        .sort((d1, d2) => {
                                          const time1Date = new Date(d1);
                                          const time2Date = new Date(d2);

                                          return (
                                            time1Date.getTime() -
                                            time2Date.getTime()
                                          );
                                        });

                                      const sundayDate = datesArr
                                        .filter((dateStr) => {
                                          const date = new Date(dateStr);
                                          return date.getDay() === 0;
                                        })
                                        .sort((d1, d2) => {
                                          const time1Date = new Date(d1);
                                          const time2Date = new Date(d2);

                                          return (
                                            time1Date.getTime() -
                                            time2Date.getTime()
                                          );
                                        });

                                      startTime = getTimeInIST(datesArr.at(0));
                                      endTime = getTimeInIST(datesArr.at(-1));

                                      if (sundayDate.length > 1) {
                                        startTimeForSunday = getTimeInIST(
                                          sundayDate.at(0)
                                        );
                                        endTimeForSunday = getTimeInIST(
                                          sundayDate.at(-1)
                                        );
                                      }

                                      const mapKey = value
                                        .map(({ date }) => date)
                                        .at(0);

                                      timeMap.set(mapKey, {
                                        startTime,
                                        endTime,
                                      });
                                    });
                                  }
                                  return (
                                    <>
                                      <div key={index}>
                                        <p
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "18px",
                                            fontWeight: "500",
                                          }}
                                          onClick={() =>
                                            handleClinicClick(index)
                                          }
                                        >
                                          {clinic.establishmentName}
                                        </p>
                                        {openClinics[index] && (
                                          <>
                                            <div>
                                              <Row>
                                                <Col lg={12}>
                                                  <div className="mb-3">
                                                    <Label
                                                      htmlFor="visitTime"
                                                      className="form-label"
                                                    >
                                                      Doctor Visit Timings
                                                    </Label>

                                                    <div className="checkbox-days-container">
                                                      {daysOfWeek.map((day) => {
                                                        const allOtherDays = [
                                                          ...timeMap.entries(),
                                                        ].filter(
                                                          ([key, value]) =>
                                                            !key
                                                              .toLowerCase()
                                                              .includes(
                                                                "sunday"
                                                              )
                                                        );

                                                        const allStartAndEndDates =
                                                          allOtherDays.map(
                                                            ([key, value]) =>
                                                              value
                                                          );
                                                        let isChecked = false;

                                                        const isDayMatching =
                                                          allOtherDays.some(
                                                            ([key, value]) =>
                                                              key
                                                                .toLowerCase()
                                                                .includes(
                                                                  day.toLowerCase()
                                                                )
                                                          );

                                                        if (isDayMatching) {
                                                          const isStartAndEndTImeMatching =
                                                            allStartAndEndDates.reduce(
                                                              (acc, val) => {
                                                                if (
                                                                  acc === true
                                                                )
                                                                  return true;

                                                                return (
                                                                  acc.startTime ===
                                                                    val.startTime &&
                                                                  acc.endTime ===
                                                                    val.endTime
                                                                );
                                                              }
                                                            );

                                                          isChecked =
                                                            isStartAndEndTImeMatching;
                                                        }

                                                        return (
                                                          <div key={day}>
                                                            <label>
                                                              <input
                                                                type="checkbox"
                                                                value={day}
                                                                checked={
                                                                  isChecked
                                                                }
                                                                onChange={(e) =>
                                                                  handleCheckboxChange(
                                                                    index,
                                                                    day,
                                                                    e.target
                                                                      .checked
                                                                  )
                                                                }
                                                                className="days-input"
                                                              />
                                                              {day}
                                                            </label>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                </Col>
                                                <Col lg={6}>
                                                  <Label>Session 1</Label>
                                                  <Row>
                                                    <Col lg={6}>
                                                      <div className="mb-3">
                                                        <Label
                                                          htmlFor="startTimeInput"
                                                          className="form-label"
                                                        >
                                                          Start Time
                                                        </Label>
                                                        <Input
                                                          type="text"
                                                          className="form-control"
                                                          id="startTimeInput"
                                                          placeholder="Enter your Start Time"
                                                          defaultValue={
                                                            startTime
                                                          }
                                                        />
                                                      </div>
                                                    </Col>

                                                    <Col lg={6}>
                                                      <div className="mb-3">
                                                        <Label
                                                          htmlFor="endTimeInput"
                                                          className="form-label"
                                                        >
                                                          End Time
                                                        </Label>
                                                        <Input
                                                          type="text"
                                                          className="form-control"
                                                          id="endTimeInput"
                                                          placeholder="Enter your End Time"
                                                          defaultValue={endTime}
                                                        />
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                </Col>
                                                <Col lg={6}>
                                                  <Label>Session 2</Label>
                                                  <Row>
                                                    <Col lg={6}>
                                                      <div className="mb-3">
                                                        <Label
                                                          htmlFor="startTimeInput"
                                                          className="form-label"
                                                        >
                                                          Start Time
                                                        </Label>
                                                        <Input
                                                          type="text"
                                                          className="form-control"
                                                          id="startTimeInput"
                                                          placeholder="Enter your Start Time"
                                                          // defaultValue={}
                                                        />
                                                      </div>
                                                    </Col>

                                                    <Col lg={6}>
                                                      <div className="mb-3">
                                                        <Label
                                                          htmlFor="endTimeInput"
                                                          className="form-label"
                                                        >
                                                          End Time
                                                        </Label>
                                                        <Input
                                                          type="text"
                                                          className="form-control"
                                                          id="endTimeInput"
                                                          placeholder="Enter your End Time"
                                                          // defaultValue={}
                                                        />
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                </Col>

                                                {/* <Col lg={12}>
                                            <div>
                                              <button
                                                onClick={() =>
                                                  handleAddTiming(index)
                                                }
                                              >
                                                Add Timing
                                              </button>
                                            </div>
                                          </Col> */}
                                              </Row>

                                              <>
                                                {!startTimeForSunday &&
                                                  !endTimeForSunday &&
                                                  GetAddTimingJSX({
                                                    daysOfWeek,
                                                    timeMap,
                                                    index,
                                                    startTime,
                                                    endTime,
                                                    establishment:
                                                      clinic.establishmentName,
                                                  })}
                                              </>
                                            </div>
                                            <div>
                                              {startTimeForSunday &&
                                                endTimeForSunday && (
                                                  <>
                                                    <Row>
                                                      <Col lg={12}>
                                                        <div className="mb-3">
                                                          <Label
                                                            htmlFor="visitTime"
                                                            className="form-label"
                                                          >
                                                            Doctor Visit Timings
                                                          </Label>

                                                          <div className="checkbox-days-container">
                                                            {daysOfWeek.map(
                                                              (day) => {
                                                                const isChecked =
                                                                  day.toLowerCase() ===
                                                                  "sunday";

                                                                return (
                                                                  <div
                                                                    key={day}
                                                                  >
                                                                    <label>
                                                                      <input
                                                                        type="checkbox"
                                                                        value={
                                                                          day
                                                                        }
                                                                        checked={
                                                                          isChecked
                                                                        }
                                                                        onChange={(
                                                                          e
                                                                        ) =>
                                                                          handleCheckboxChange(
                                                                            index,
                                                                            day,
                                                                            e
                                                                              .target
                                                                              .checked
                                                                          )
                                                                        }
                                                                        className="days-input"
                                                                      />
                                                                      {day}
                                                                    </label>
                                                                  </div>
                                                                );
                                                              }
                                                            )}
                                                          </div>
                                                        </div>
                                                      </Col>

                                                      <Col lg={6}>
                                                        <Label>Session 1</Label>
                                                        <Row>
                                                          <Col lg={6}>
                                                            <div className="mb-3">
                                                              <Label
                                                                htmlFor="startTimeInput"
                                                                className="form-label"
                                                              >
                                                                Start Time
                                                              </Label>
                                                              <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="startTimeInput"
                                                                placeholder="Enter your Start Time"
                                                                defaultValue={
                                                                  startTimeForSunday
                                                                }
                                                              />
                                                            </div>
                                                          </Col>

                                                          <Col lg={6}>
                                                            <div className="mb-3">
                                                              <Label
                                                                htmlFor="endTimeInput"
                                                                className="form-label"
                                                              >
                                                                End Time
                                                              </Label>
                                                              <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="endTimeInput"
                                                                placeholder="Enter your End Time"
                                                                defaultValue={
                                                                  endTimeForSunday
                                                                }
                                                              />
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </Col>

                                                      <Col lg={6}>
                                                        <Label>Session 1</Label>
                                                        <Row>
                                                          <Col lg={6}>
                                                            <div className="mb-3">
                                                              <Label
                                                                htmlFor="startTimeInput"
                                                                className="form-label"
                                                              >
                                                                Start Time
                                                              </Label>
                                                              <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="startTimeInput"
                                                                placeholder="Enter your Start Time"
                                                                // defaultValue={
                                                                //   startTimeForSunday
                                                                // }
                                                              />
                                                            </div>
                                                          </Col>

                                                          <Col lg={6}>
                                                            <div className="mb-3">
                                                              <Label
                                                                htmlFor="endTimeInput"
                                                                className="form-label"
                                                              >
                                                                End Time
                                                              </Label>
                                                              <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="endTimeInput"
                                                                placeholder="Enter your End Time"
                                                                // defaultValue={
                                                                //   endTimeForSunday
                                                                // }
                                                              />
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </Col>
                                                    </Row>
                                                    {startTimeForSunday &&
                                                      endTimeForSunday &&
                                                      GetAddTimingJSX({
                                                        daysOfWeek,
                                                        timeMap,
                                                        index,
                                                        startTime,
                                                        endTime,
                                                        establishment:
                                                          clinic.establishmentName,
                                                      })}
                                                  </>
                                                )}
                                              <Col lg={12}>
                                                <div>
                                                  <button
                                                    style={{
                                                      background: "none",
                                                      border: "none",
                                                      color: "#da8872",
                                                    }}
                                                    type="button"
                                                    onClick={() =>
                                                      handleAddTimingButtonClick(
                                                        clinic.establishmentName
                                                      )
                                                    }
                                                  >
                                                    + Add Timing
                                                  </button>
                                                </div>
                                              </Col>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  );
                                })}
                            </Form>
                          </div>
                        </Row>
                      </Form>

                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-primary">
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-soft-success"
                          >
                            Cancel
                          </button>
                        </div>
                      </Col>
                    </TabPane>

                    <TabPane tabId="9">
                      <Row>
                        {leftPane()}
                        <Col xxl={9}>
                          <Row>
                            <Col lg={12}>
                              <Card>
                                <CardHeader className="align-items-center d-flex">
                                  <h4 className="card-title mb-0  me-2">
                                    Recent Activity
                                  </h4>
                                  <div className="flex-shrink-0 ms-auto">
                                    <Nav
                                      className="justify-content-end nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                      role="tablist"
                                    >
                                      <NavItem>
                                        <NavLink
                                          href="#"
                                          className={classnames({
                                            active: activityTab === "1",
                                          })}
                                          onClick={() => {
                                            toggleActivityTab("1");
                                          }}
                                        >
                                          Today
                                        </NavLink>
                                      </NavItem>
                                      <NavItem>
                                        <NavLink
                                          href="#"
                                          className={classnames({
                                            active: activityTab === "2",
                                          })}
                                          onClick={() => {
                                            toggleActivityTab("2");
                                          }}
                                        >
                                          Weekly
                                        </NavLink>
                                      </NavItem>
                                      <NavItem className="nav-item">
                                        <NavLink
                                          href="#"
                                          className={classnames({
                                            active: activityTab === "3",
                                          })}
                                          onClick={() => {
                                            toggleActivityTab("3");
                                          }}
                                        >
                                          Monthly
                                        </NavLink>
                                      </NavItem>
                                    </Nav>
                                  </div>
                                </CardHeader>
                                <CardBody>
                                  <TabContent
                                    activeTab={activityTab}
                                    className="text-muted"
                                  >
                                    <TabPane tabId="1">
                                      <div className="profile-timeline">
                                        <div></div>
                                        <div
                                          className="accordion accordion-flush"
                                          id="todayExample"
                                        >
                                          {timeline?.map((i) => (
                                            <div
                                              key={i._id}
                                              className="accordion-item border-0"
                                            >
                                              <div className="accordion-header">
                                                <button
                                                  className="accordion-button p-2 shadow-none"
                                                  type="button"
                                                  id="headingOne"
                                                >
                                                  <div className="d-flex">
                                                    <div className="flex-shrink-0">
                                                      <img
                                                        src={avatar2}
                                                        alt=""
                                                        className="avatar-xs rounded-circle"
                                                      />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                      <h6 className="fs-14 mb-1">
                                                        {i.title}
                                                      </h6>
                                                      <small className="text-muted">
                                                        {i.description}
                                                      </small>
                                                    </div>
                                                  </div>
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </TabPane>
                                  </TabContent>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Card>
                            <CardBody>
                              <h5 className="card-title">Documents</h5>
                              <div className="d-flex justify-content-end gap-2 mb-2">
                                <div className="slider-button-prev">
                                  <div className="avatar-title fs-18 rounded px-1 yellow-btn">
                                    <i className="ri-arrow-left-s-line"></i>
                                  </div>
                                </div>
                                <div className="slider-button-next">
                                  <div className="avatar-title fs-18 rounded px-1 yellow-btn">
                                    <i className="ri-arrow-right-s-line"></i>
                                  </div>
                                </div>
                              </div>
                              <Swiper
                                className="project-swiper"
                                slidesPerView={3}
                                spaceBetween={20}
                                autoplay={{
                                  delay: 3000,
                                  disableOnInteraction: false,
                                }}
                                pagination={{ clickable: true }}
                              >
                                <div className="swiper-wrapper">
                                  <SwiperSlide>
                                    <Card className="profile-project-card shadow-none profile-project-success mb-0">
                                      <CardBody className="p-4">
                                        <div className="d-flex">
                                          <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-15 text-truncate mb-1">
                                              <Link
                                                to="#"
                                                className="text-dark"
                                              >
                                                ABC Project Customization
                                              </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                              Last Update :
                                              <span className="fw-semibold text-dark">
                                                4 hr Ago
                                              </span>
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-warning fs-11">
                                              Inprogress
                                            </div>
                                          </div>
                                        </div>
                                        <div className="d-flex mt-4">
                                          <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <h5 className="fs-12 text-muted mb-0">
                                                  Members :
                                                </h5>
                                              </div>
                                              <div className="avatar-group">
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar4}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar5}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <div className="avatar-title rounded-circle bg-light text-primary">
                                                      A
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar2}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </SwiperSlide>

                                  <SwiperSlide>
                                    <Card className="profile-project-card shadow-none profile-project-danger mb-0">
                                      <CardBody className="p-4">
                                        <div className="d-flex">
                                          <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-15 text-truncate mb-1">
                                              <Link
                                                to="#"
                                                className="text-dark"
                                              >
                                                Client - John
                                              </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                              Last Update :
                                              <span className="fw-semibold text-dark">
                                                1 hr Ago
                                              </span>
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-success fs-11">
                                              Completed
                                            </div>
                                          </div>
                                        </div>
                                        <div className="d-flex mt-4">
                                          <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <h5 className="fs-13 text-muted mb-0">
                                                  Members :
                                                </h5>
                                              </div>
                                              <div className="avatar-group">
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar2}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <div className="avatar-title rounded-circle bg-light text-primary">
                                                      C
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </SwiperSlide>
                                  <SwiperSlide>
                                    <Card className="profile-project-card shadow-none profile-project-info mb-0">
                                      <CardBody className="p-4">
                                        <div className="d-flex">
                                          <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-15 text-truncate mb-1">
                                              <Link
                                                to="#"
                                                className="text-dark"
                                              >
                                                Brand logo Design
                                              </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                              Last Update :
                                              <span className="fw-semibold text-dark">
                                                2 hr Ago
                                              </span>
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-warning fs-11">
                                              Inprogress
                                            </div>
                                          </div>
                                        </div>
                                        <div className="d-flex mt-4">
                                          <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <h5 className="fs-13 text-muted mb-0">
                                                  Members :
                                                </h5>
                                              </div>
                                              <div className="avatar-group">
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar5}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </SwiperSlide>
                                  <SwiperSlide>
                                    <Card className="profile-project-card shadow-none profile-project-danger mb-0">
                                      <CardBody className="p-4">
                                        <div className="d-flex">
                                          <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-15 text-truncate mb-1">
                                              <Link
                                                to="#"
                                                className="text-dark"
                                              >
                                                Project update
                                              </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                              Last Update :
                                              <span className="fw-semibold text-dark">
                                                4 hr Ago
                                              </span>
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-success fs-11">
                                              Completed
                                            </div>
                                          </div>
                                        </div>

                                        <div className="d-flex mt-4">
                                          <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <h5 className="fs-13 text-muted mb-0">
                                                  Members :
                                                </h5>
                                              </div>
                                              <div className="avatar-group">
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar4}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar5}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </SwiperSlide>

                                  <SwiperSlide>
                                    <Card className="profile-project-card shadow-none profile-project-warning mb-0">
                                      <CardBody className="p-4">
                                        <div className="d-flex">
                                          <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-15 text-truncate mb-1">
                                              <Link
                                                to="#"
                                                className="text-dark"
                                              >
                                                Chat App
                                              </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                              Last Update :
                                              <span className="fw-semibold text-dark">
                                                1 hr Ago
                                              </span>
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0 ms-2">
                                            <div className="badge badge-soft-warning fs-11">
                                              Inprogress
                                            </div>
                                          </div>
                                        </div>

                                        <div className="d-flex mt-4">
                                          <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <h5 className="fs-13 text-muted mb-0">
                                                  Members :
                                                </h5>
                                              </div>
                                              <div className="avatar-group">
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar4}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <img
                                                      src={avatar5}
                                                      alt=""
                                                      className="rounded-circle img-fluid"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="avatar-group-item">
                                                  <div className="avatar-xs">
                                                    <div className="avatar-title rounded-circle bg-light text-primary">
                                                      A
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </SwiperSlide>
                                </div>
                              </Swiper>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="10">
                      <Row>
                        <Col xxl={3}>
                          <Card>
                            <CardBody>
                              <div className="d-flex align-items-center mb-4">
                                <div className="flex-grow-1">
                                  <h5 className="card-title mb-0">Actions</h5>
                                </div>
                                <div className="flex-shrink-0">
                                  <UncontrolledDropdown direction="start">
                                    <DropdownToggle
                                      tag="a"
                                      id="dropdownMenuLink2"
                                      role="button"
                                    >
                                      <i className="ri-more-2-fill fs-14"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem>View</DropdownItem>
                                      <DropdownItem>Edit</DropdownItem>
                                      <DropdownItem>Delete</DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </div>
                              </div>
                              <div>
                                {[
                                  "Clinical History",
                                  "Clinical Examination",
                                  "Assessments",
                                  "Management Plan",
                                  "Visit Notes",
                                ].map((i) => (
                                  <div
                                    onClick={() => {
                                      setSubMenu(i);
                                    }}
                                    key={i}
                                    className={`d-flex border align-items-center p-1 mb-1 rounded ${
                                      i == subMenu && "text-bg-primary"
                                    } cursor-pointer`}
                                  >
                                    <div className="flex-grow-1">
                                      <div>
                                        <h5
                                          className={`fs-15 ${
                                            i == subMenu && "text-white"
                                          }`}
                                        >
                                          {i}
                                        </h5>
                                        {/* <p className="fs-14 text-muted mb-0">
                                        Frontend Developer
                                      </p> */}
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0 ms-2">
                                      <button
                                        type="button"
                                        className="btn btn-sm "
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col xxl={9}>
                          <Card>
                            {subMenu === "Clinical History" && (
                              <CardBody>
                                <Clinicalhistory
                                  userId={userId}
                                  forms={forms}
                                />
                              </CardBody>
                            )}

                            {subMenu === "Visit Notes" && (
                              <CardBody>
                                <PrescriptionCreate width={12} id={userId} />
                              </CardBody>
                            )}
                            {subMenu === "Clinical Examination" && (
                              <CardBody>
                                <Clinicalhistory
                                  userId={userId}
                                  subMenu={subMenu
                                    ?.toString()
                                    ?.toLowerCase()
                                    ?.replace(/ /g, "_")}
                                  forms={forms}
                                />
                              </CardBody>
                            )}
                            {subMenu === "Assessments" && (
                              <CardBody>
                                <Assesments
                                  userId={userId}
                                  subMenu={subMenu
                                    ?.toString()
                                    ?.toLowerCase()
                                    ?.replace(/ /g, "_")}
                                  forms={forms}
                                />
                              </CardBody>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="11">
                      <Row>
                        <Col xxl={3}>
                          <Card>
                            <CardBody>
                              <div className="d-flex align-items-center mb-4">
                                <div className="flex-grow-1">
                                  <h5 className="card-title mb-0">Actions</h5>
                                </div>
                                <div className="flex-shrink-0">
                                  <UncontrolledDropdown direction="start">
                                    <DropdownToggle
                                      tag="a"
                                      id="dropdownMenuLink2"
                                      role="button"
                                    >
                                      <i className="ri-more-2-fill fs-14"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem>View</DropdownItem>
                                      <DropdownItem>Edit</DropdownItem>
                                      <DropdownItem>Delete</DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </div>
                              </div>
                              <div>
                                {["Create Invoice", "Invoice List"].map((i) => (
                                  <div
                                    key={i}
                                    className={`d-flex border align-items-center p-1 mb-1 rounded ${
                                      i == subMenu && "text-bg-primary"
                                    } cursor-pointer`}
                                    onClick={() => {
                                      setSubMenu(i);
                                    }}
                                  >
                                    <div className="flex-grow-1">
                                      <div>
                                        <h5 className="fs-15 ">{i}</h5>
                                        {/* <p className="fs-14 text-muted mb-0">
                                        Frontend Developer
                                      </p> */}
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0 ms-2">
                                      <button
                                        type="button"
                                        className="btn btn-sm "
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xxl={9}>
                          <Card>
                            <CardBody>
                              {subMenu === "Create Invoice" && (
                                <CardBody>
                                  <InvoiceCreate width={12} id={userId} />
                                </CardBody>
                              )}
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="12">
                      <Row>
                        {leftPane()}
                        <Col xxl={9}>
                          <Card>
                            <CardBody>
                              <div className="d-flex align-items-center mb-4">
                                <h5 className="card-title flex-grow-1 mb-0">
                                  Documents
                                </h5>
                                <div className="flex-shrink-0">
                                  <Input
                                    className="form-control d-none"
                                    type="file"
                                    id="formFile"
                                  />
                                  <Label
                                    htmlFor="formFile"
                                    className="btn btn-danger"
                                  >
                                    <i className="ri-upload-2-fill me-1 align-bottom"></i>
                                    Upload File
                                  </Label>
                                </div>
                              </div>
                              <Row>
                                <Col lg={12}>
                                  <div className="table-responsive">
                                    <Table className="table-borderless align-middle mb-0">
                                      <thead className="table-light">
                                        <tr>
                                          <th scope="col">File Name</th>
                                          <th scope="col">Type</th>
                                          <th scope="col">Size</th>
                                          <th scope="col">Upload Date</th>
                                          <th scope="col">Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(document || []).map((item, key) => (
                                          <tr key={key}>
                                            <td>
                                              <div className="d-flex align-items-center">
                                                <div className="avatar-sm">
                                                  <div
                                                    className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}
                                                  >
                                                    <i
                                                      className={item.icon}
                                                    ></i>
                                                  </div>
                                                </div>
                                                <div className="ms-3 flex-grow-1">
                                                  <h6 className="fs-15 mb-0">
                                                    <Link to="#">
                                                      {item.fileName}
                                                    </Link>
                                                  </h6>
                                                </div>
                                              </div>
                                            </td>
                                            <td>{item.fileType}</td>
                                            <td>{item.fileSize}</td>
                                            <td>{item.updatedDate}</td>
                                            <td>
                                              <UncontrolledDropdown direction="start">
                                                <DropdownToggle
                                                  tag="a"
                                                  className="btn btn-light btn-icon"
                                                  id="dropdownMenuLink15"
                                                  role="button"
                                                >
                                                  <i className="ri-equalizer-fill"></i>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                  <DropdownItem>
                                                    <i className="ri-eye-fill me-2 align-middle text-muted" />
                                                    View
                                                  </DropdownItem>
                                                  <DropdownItem>
                                                    <i className="ri-download-2-fill me-2 align-middle text-muted" />
                                                    Download
                                                  </DropdownItem>
                                                  <DropdownItem divider />
                                                  <DropdownItem>
                                                    <i className="ri-delete-bin-5-line me-2 align-middle text-muted" />
                                                    Delete
                                                  </DropdownItem>
                                                </DropdownMenu>
                                              </UncontrolledDropdown>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                  <div className="text-center mt-3">
                                    <Link to="#" className="text-success ">
                                      <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>
                                      Load more
                                    </Link>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="13">
                      <Row>
                        {leftPane()}
                        <Col xxl={9}>
                          <Card>
                            <CardBody>
                              <h5 className="card-title mb-3">Activities</h5>
                              <div className="timeline">
                                {timeline?.map((time, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className={`timeline-item ${
                                        index % 2 ? "right" : "left"
                                      }`}
                                    >
                                      <i className="icon ri-stack-line"></i>
                                      <div className="date">
                                        {new Date(
                                          time.createdAt
                                        ).toDateString()}
                                      </div>
                                      <div className="content">
                                        <div className="d-flex">
                                          <div className="flex-shrink-0">
                                            <img
                                              src={avatar5}
                                              alt=""
                                              className="avatar-sm rounded"
                                            />
                                          </div>
                                          <div className="flex-grow-1 ms-3">
                                            <h5 className="text-capitalize">
                                              {time?.type}
                                              <small className="text-muted fs-13 fw-normal">
                                                -{" "}
                                                {getTimeDifference(
                                                  time?.createdAt
                                                )}
                                              </small>
                                            </h5>
                                            <p className="text-muted mb-2">
                                              {time?.description}
                                            </p>
                                            <div className="hstack gap-2">
                                              {time?.reference?.document?.[0]
                                                ?.Location && (
                                                <Link
                                                  to={
                                                    time?.reference
                                                      ?.document?.[0]?.Location
                                                  }
                                                  download
                                                  className="btn btn-sm btn-light"
                                                >
                                                  {/* <span className="me-1">
                                                  &#128293;
                                                </span> */}
                                                  Download Report
                                                </Link>
                                              )}
                                              {/* <Link
                                              to="#"
                                              className="btn btn-sm btn-light"
                                            >
                                              <span className="me-1">
                                                &#129321;
                                              </span>
                                              22
                                            </Link> */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Settings;
