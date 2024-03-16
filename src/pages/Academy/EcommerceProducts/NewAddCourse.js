import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";
import { useState } from "react";
import { Link } from "feather-icons-react/build/IconComponents";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { useLocation } from "react-router-dom";
import config from "../../../config";

const InitialFieldState = {
  instructorName: "",
  skillLevel: "Introductory",
  topic: "",
  duration: "",
  videoUrl: "",
};
const NewAddCourse = () => {
  const dispatch = useDispatch();

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [image, setImage] = useState({});
  const [state, setState] = useState({});

  const { loading } = useProfile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (id)
      axios.get(config.api.API_URL + `/courses?id=${id}`).then((res) => {
        setCourse(res.data);
      });
  }, []);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          config.api.API_URL + "/getUser?type=doctor",
          {
            credential: course?.instructor,
          }
        );
        setUserData(response?.data?.displayName);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [course]);
  // console.log("userData:", userData);

  const [selectedVisibility, setselectedVisibility] = useState(null);

  const SingleOptions = [
    { value: "Watches", label: "Watches" },
    { value: "Headset", label: "Headset" },
    { value: "Sweatshirt", label: "Sweatshirt" },
    { value: "20% off", label: "20% off" },
    { value: "4 star", label: "4 star" },
  ];

  const [selectedMulti, setselectedMulti] = useState(null);

  const handleMulti = (selectedMulti) => {
    setselectedMulti(selectedMulti);
  };

  //Dropzone file upload
  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  };

  const courseCategory = [
    {
      options: [
        { label: "All", value: "All" },
        { label: "Prescription Medicines", value: "prescription_medicines" },
        { label: "OTC Medicines", value: "otc_medicines" },
        { label: "Health Supplements", value: "health_supplements" },
        { label: "Health Devices", value: "health_devices" },
        { label: "Sexual Wellness", value: "sexual_wellness" },
        { label: "Personal Care", value: "personal_care" },
      ],
    },
  ];

  const dateFormat = () => {
    let d = new Date(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    let h = d.getHours() % 12 || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear() +
      ", " +
      h +
      ":" +
      d.getMinutes() +
      " " +
      ampm
    ).toString();
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");
    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = H % 12 || 12;
    h = h <= 9 ? (h = "0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

  const courseStatus = [
    {
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
      ],
    },
  ];

  const courseVisibility = [
    {
      options: [
        { label: "Hidden", value: "Hidden" },
        { label: "Public", value: "Public" },
      ],
    },
  ];

  const skillLevels = [
    { label: "Beginner", value: "beginner" },
    { label: "Basic", value: "basic" },
    { label: "Advance", value: "advance" },
  ];
  const privacyStatusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Scheduled", value: "scheduled" },
  ];
  /**
   * Formats the size
   */
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  document.title = "Create Project | Psymate Management Portal";

  const [moduleCount, setModuleCount] = useState(1);

  const handleAddModule = () => {
    setModuleCount(moduleCount + 1);
  };

  const handleDeleteModule = () => {
    if (moduleCount > 1) {
      setModuleCount(moduleCount - 1);
    }
  };

  const handleStatusChange = (selectedStatus) => {
    // You can perform any actions you need here, such as updating state
    // console.log("Selected Status:", selectedStatus);
    // setCourse(course?.status);
    setCourse({ ...course, status: selectedStatus });
  };

  const handleLevelChange = (selectedLevel) => {
    setCourse({ ...course, level: selectedLevel });
  };

  const renderModules = () => {
    let modules = [];
    for (let i = 0; i < moduleCount; i++) {
      modules.push(
        <div key={i}>
          <Card>
            <CardBody>
              <div className="mb-3">
                <Label className="form-label" htmlFor="project-title-input">
                  Course Title
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="project-title-input"
                  placeholder="Enter project title"
                  value={course?.displayName}
                />
              </div>

              <div className="mb-3">
                <Label className="form-label" htmlFor="project-thumbnail-img">
                  Thumbnail Image
                </Label>
                <Input
                  className="form-control"
                  id="project-thumbnail-img"
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                />
              </div>

              <div className="mb-3">
                <Label className="form-label">Course Description</Label>
                <CKEditor
                  editor={ClassicEditor}
                  data={course?.description}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                  }}
                  // onChange={(editor) => {
                  //   editor.getData();
                  // }}
                />
              </div>
              <Row>
                <Col lg={12}>
                  <div>
                    <Label
                      htmlFor="datepicker-deadline-input"
                      className="form-label"
                    >
                      Instructor Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter Instructor Name"
                      value={userData}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={6}>
                  <div>
                    <Label
                      htmlFor="datepicker-deadline-input"
                      className="form-label"
                    >
                      Skill Level
                    </Label>

                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      id="choices-priority-input"
                      value={course?.level || ""}
                      onChange={(e) => handleLevelChange(e.target.value)}
                    >
                      {skillLevels.map((level, index) => (
                        <option key={index} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>

                <Col lg={6}>
                  <div>
                    <Label
                      htmlFor="datepicker-deadline-input"
                      className="form-label"
                    >
                      Duration{" "}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter Duration"
                      value={course?.duration}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={12}>
                  <div>
                    <Label
                      htmlFor="datepicker-deadline-input"
                      className="form-label"
                    >
                      Topics
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter Topic"
                      value={course?.topics}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={4}>
                  <div>
                    <Label
                      htmlFor="datepicker-deadline-input"
                      className="form-label"
                    >
                      Video URL
                    </Label>
                    {/* <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d M, Y",
                          }}
                          placeholder="Selact Date"
                        /> */}
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter Video Url"
                      value={course?.videoUrl}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {course?.lessons.map((lesson, lessonIndex) => (
            <div key={`lesson-${lessonIndex}`}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label
                      className="form-label"
                      htmlFor={`lesson-title-${lessonIndex}`}
                    >
                      Module Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id={`lesson-title-${lessonIndex}`}
                      placeholder="Enter project title"
                      value={lesson.title}
                    />
                  </div>

                  <div className="mb-3">
                    <Label
                      className="form-label"
                      htmlFor={`lesson-description-${lessonIndex}`}
                    >
                      Module Description
                    </Label>
                    <CKEditor
                      editor={ClassicEditor}
                      id={`lesson-description-${lessonIndex}`}
                      data={lesson.description}
                      onReady={(editor) => {}}
                    />
                  </div>
                  <Row>
                    <Col lg={12}>
                      <div>
                        <Label
                          htmlFor={`lesson-videourl-${lessonIndex}`}
                          className="form-label"
                        >
                          Video URL
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id={`lesson-videourl-${lessonIndex}`}
                          placeholder="Enter Video Url"
                          value={lesson.videourl}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Button
                className="mb-3"
                color="danger"
                onClick={handleDeleteModule}
              >
                Delete Module
              </Button>
            </div>
          ))}

          {i > 0 && ( // Display delete button after the first module
            <Button
              className="mb-3"
              color="danger"
              onClick={handleDeleteModule}
            >
              Delete Module
            </Button>
          )}
        </div>
      );
    }
    return modules;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Add Courses" pageTitle="Academy" />
          <Row className="pb-5">
            <Col lg={8}>
              {renderModules()}
              <div>
                <Button
                  style={{ width: "125px" }}
                  color="warning"
                  onClick={handleAddModule}
                >
                  Add Module
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Course Gallery</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <p className="text-muted">Add Attached files here.</p>

                    <Dropzone
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

                    <ul className="list-unstyled mb-0" id="dropzone-preview">
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
                                    value={course?.thumbnail}
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
                    </ul>
                  </div>
                </CardBody>
              </Card>

              <div className="text-end mb-4">
                {/* <button type="submit" className="btn btn-danger w-sm me-1">
                  Delete
                </button> */}
                <button type="submit" className="btn btn-secondary w-sm me-1">
                  Add Course
                </button>
              </div>
            </Col>

            <Col lg={4}>
              <div className="card">
               
                <CardBody>
                  <div>
                    <Label
                      htmlFor="choices-privacy-status-input"
                      className="form-label"
                    >
                      Status
                    </Label>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      id="choices-privacy-status-input"
                      value={course?.status || ""}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      {privacyStatusOptions.map((status, index) => (
                        <option key={index} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="choices-privacy-status-input"
                      className="form-label"
                    >
                      Visibility{" "}
                    </Label>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      id="choices-privacy-status-input"
                    >
                      <option defaultValue="Hidden">Hidden</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="choices-priority-input"
                      className="form-label"
                    >
                      Language
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-lang-input"
                      placeholder="Enter Course Language"
                      value={course?.language}
                    />
                  </div>
                </CardBody>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Publish Schedule</h5>
                </div>
                <CardBody>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-categories-input"
                      className="form-label"
                    >
                      Publish Date & Time
                    </Label>
                    <Flatpickr
                      name="publishedDate"
                      id="publishedDate-field"
                      className="form-control"
                      placeholder="Enter publish date"
                      value={new Date(course?.createdAt)}
                      options={{
                        enableTime: true,
                        altInput: true,
                        altFormat: "d M, Y, G:i K",
                        dateFormat: "d M, Y, G:i K",
                      }}
                    />
                  </div>
                </CardBody>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Course Categories</h5>
                </div>
                <CardBody>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-categories-input"
                      className="form-label"
                    >
                      Select course category
                    </Label>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      id="choices-categories-input"
                    >
                      <option defaultValue="Designing">Psychology</option>
                    </select>
                  </div>
                </CardBody>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Course Fees</h5>
                </div>
                <CardBody>
                  <div className="mb-3">
                    <Label
                      htmlFor="choices-categories-input"
                      className="form-label"
                    >
                      Course Fees
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter Course fees"
                      value={course?.price}
                    />
                  </div>
                </CardBody>
              </div>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Members</h5>
                </CardHeader>
                <CardBody>
                  {/* <div className="mb-3">
                    <Label htmlFor="choices-lead-input" className="form-label">
                      Course Director
                    </Label>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      id="choices-lead-input"
                    >
                      <option defaultValue="Brent Gonzalez">
                        Brent Gonzalez
                      </option>
                      <option value="Darline Williams">Darline Williams</option>
                      <option value="Sylvia Wright">Sylvia Wright</option>
                      <option value="Ellen Smith">Ellen Smith</option>
                      <option value="Jeffrey Salazar">Jeffrey Salazar</option>
                      <option value="Mark Williams">Mark Williams</option>
                    </select>
                  </div> */}

                  <div className="mb-3">
                    <Label htmlFor="choices-lead-input" className="form-label">
                      Faculty Name
                    </Label>

                    <Input
                      type="text"
                      className="form-control"
                      id="project-faculty-input"
                      placeholder="Enter Faculty Name"
                    />
                    {/* <Select
                      value={selectedMulti}
                      isMulti={true}
                      onChange={() => {
                        handleMulti();
                      }}
                      options={SingleOptions}
                    /> */}
                  </div>

                  {/* <div>
                    <Label className="form-label">Team Members</Label>
                    <div className="avatar-group">
                      <Link
                        to="#"
                        className="avatar-group-item"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        data-bs-placement="top"
                        title="Brent Gonzalez"
                      >
                        <div className="avatar-xs">
                          <img
                            src={avatar3}
                            alt=""
                            className="rounded-circle img-fluid"
                          />
                        </div>
                      </Link>
                      <Link
                        to="#"
                        className="avatar-group-item"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        data-bs-placement="top"
                        title="Sylvia Wright"
                      >
                        <div className="avatar-xs">
                          <div className="avatar-title rounded-circle bg-secondary">
                            S
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="#"
                        className="avatar-group-item"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        data-bs-placement="top"
                        title="Ellen Smith"
                      >
                        <div className="avatar-xs">
                          <img
                            src={avatar4}
                            alt=""
                            className="rounded-circle img-fluid"
                          />
                        </div>
                      </Link>
                      <Link
                        to="#"
                        className="avatar-group-item"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        data-bs-placement="top"
                        title="Add Members"
                      >
                        <div
                          className="avatar-xs"
                          data-bs-toggle="modal"
                          data-bs-target="#inviteMembersModal"
                        >
                          <div className="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary">
                            +
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewAddCourse;
