import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Row,
  TabContent,
  Table,
  TabPane,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "../../../../commonCss.css";
import "./SimplePage.css";

//Images
import profileBg from "../../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { document } from "../../../../common/data";
import axios from "axios";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import Assessments from "./components/Assesments";
import Clinicalhistory from "./components/Clinicalhistory";
import PrescriptionCreate from "../../../Prescriptions/PrescriptionCreate";
import InvoiceCreate from "../../../Invoices/InvoiceCreate";
import "../../../../commonCss.css";
import config from "../../../../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Timeline from "./Timeline";

const SimplePage = () => {
  SwiperCore.use([Autoplay]);
  const [activeTab, setActiveTab] = useState("1");
  const [timeline, setTimeline] = useState([]);
  const [activityTab, setActivityTab] = useState("1");
  const [user, setUser] = useState([]);
  const [subMenu, setSubMenu] = useState("Clinical History");
  // Get a specific parameter value
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get("id");
  const [forms, setForms] = useState([]);

  const getUser = async () => {
    if (userId)
      await axios.get(`/users?search=${userId}&searchBy=_id&exact=true`).then((res) => {
        setUser(res.data[0]);
      });
  };

  const getForms = async () => {
    await axios.get(`/api/tools?searchBy=category&search=clinical_examination`).then((res) => {
      setForms(res.data);
    });
  };
  const getTimeline = async () => {
    await axios
      .get(`/timeline?search=${userId}&searchBy=userId&operation=true&operator=in`)
      .then((res) => {
        setTimeline(res.data);
      });
  };

  useEffect(() => {
    getTimeline();
    getUser();
    getForms();
  }, [userId]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const leftPane = () => {
    return (
      <Col xxl={3}>
        <Card>
          <CardBody>
            <h5 className="card-title mb-5">Complete Your Profile</h5>
            <Progress value={30} color="danger" className="animated-progess custom-progress progress-label">
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
                    <td className="text-muted text-capitalize">{user?.gender}</td>
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

        {/* <Card>
          <CardBody>
            <h5 className="card-title mb-4">Portfolio</h5>
            <div className="d-flex flex-wrap gap-2">
              <div>
                <Link to="#" className="avatar-xs d-block">
                  <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                    <i className="ri-github-fill"></i>
                  </span>
                </Link>
              </div>
              <div>
                <Link to="#" className="avatar-xs d-block">
                  <span className="avatar-title rounded-circle fs-16 bg-primary">
                    <i className="ri-global-fill"></i>
                  </span>
                </Link>
              </div>
              <div>
                <Link to="#" className="avatar-xs d-block">
                  <span className="avatar-title rounded-circle fs-16 bg-success">
                    <i className="ri-dribbble-fill"></i>
                  </span>
                </Link>
              </div>
              <div>
                <Link to="#" className="avatar-xs d-block">
                  <span className="avatar-title rounded-circle fs-16 bg-danger">
                    <i className="ri-pinterest-fill"></i>
                  </span>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card> */}
        {/* 
        <Card>
          <CardBody>
            <h5 className="card-title mb-4">Skills</h5>
            <div className="d-flex flex-wrap gap-2 fs-16">
              <Link to="#" className="badge badge-soft-primary">
                Photoshop
              </Link>
              <Link to="#" className="badge badge-soft-primary">
                illustrator
              </Link>
              <Link to="#" className="badge badge-soft-primary">
                HTML
              </Link>
              <Link to="#" className="badge badge-soft-primary">
                CSS
              </Link>
              <Link to="#" className="badge badge-soft-primary">
                Javascript
              </Link>
              <Link to="#" className="badge badge-soft-primary">
                Php
              </Link>
              <Link to="#" className="badge badge-soft-primary">
                Python
              </Link>
            </div>
          </CardBody>
        </Card> */}

        {/* 
        <Card><CardBody>
            <div className="d-flex align-items-center mb-4">
              <div className="flex-grow-1">
                <h5 className="card-title mb-0">Suggestions</h5>
              </div>
              <div className="flex-shrink-0">
                <UncontrolledDropdown direction="start">
                  <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
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
              <div className="d-flex align-items-center py-3">
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img
                    src={avatar3}
                    alt=""
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="flex-grow-1">
                  <div>
                    <h5 className="fs-15 mb-1">Esther James</h5>
                    <p className="fs-14 text-muted mb-0">Frontend Developer</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ms-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                  >
                    <i className="ri-user-add-line align-middle"></i>
                  </button>
                </div>
              </div>
              <div className="d-flex align-items-center py-3">
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img
                    src={avatar4}
                    alt=""
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="flex-grow-1">
                  <div>
                    <h5 className="fs-15 mb-1">Jacqueline Steve</h5>
                    <p className="fs-14 text-muted mb-0">UI/UX Designer</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ms-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                  >
                    <i className="ri-user-add-line align-middle"></i>
                  </button>
                </div>
              </div>
              <div className="d-flex align-items-center py-3">
                <div className="avatar-xs flex-shrink-0 me-3">
                  <img
                    src={avatar5}
                    alt=""
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="flex-grow-1">
                  <div>
                    <h5 className="fs-15 mb-1">George Whalen</h5>
                    <p className="fs-14 text-muted mb-0">Backend Developer</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ms-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                  >
                    <i className="ri-user-add-line align-middle"></i>
                  </button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="d-flex align-items-center mb-4">
              <div className="flex-grow-1">
                <h5 className="card-title mb-0">Popular Posts</h5>
              </div>
              <div className="flex-shrink-0">
                <UncontrolledDropdown direction="start">
                  <DropdownToggle tag="a" id="dropdownMenuLink1" role="button">
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
            <div className="d-flex mb-4">
              <div className="flex-shrink-0">
                <img src={smallImage4} alt="" height="50" className="rounded" />
              </div>
              <div className="flex-grow-1 ms-3 overflow-hidden">
                <Link to="#">
                  <h6 className="text-truncate">
                    Design your apps in your own way
                  </h6>
                </Link>
                <p className="text-muted mb-0 fs-13">15 Dec 2021</p>
              </div>
            </div>
            <div className="d-flex mb-4">
              <div className="flex-shrink-0">
                <img src={smallImage5} alt="" height="50" className="rounded" />
              </div>
              <div className="flex-grow-1 ms-3 overflow-hidden">
                <Link to="#">
                  <h6 className="text-truncate">
                    Smartest Applications for Business
                  </h6>
                </Link>
                <p className="text-muted mb-0 fs-13">28 Nov 2021</p>
              </div>
            </div>
            <div className="d-flex">
              <div className="flex-shrink-0">
                <img src={smallImage6} alt="" height="50" className="rounded" />
              </div>
              <div className="flex-grow-1 ms-3 overflow-hidden">
                <Link to="#">
                  <h6 className="text-truncate">
                    How to get creative in your work
                  </h6>
                </Link>
                <p className="text-muted mb-0 fs-13">21 Nov 2021</p>
              </div>
            </div>
          </CardBody>
        </Card>
        */}
      </Col>
    );
  };
  document.title = "Profile | Psymate - Management Portal";
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
                  <img src={avatar1} alt="user-img" className="img-thumbnail rounded-circle" />
                </div>
              </div>

              <Col>
                <div className="p-2">
                  <h3 className="text-white mb-1 profile-text-color">{user?.displayName}</h3>
                  <p className="text-white-75 profile-text-color">{user?.qualifications}</p>
                  <p className="text-white-75 profile-text-color">PSY ID : {user?.psyID}</p>
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

          <Row>
            <Col lg={12}>
              <div>
                <div className="d-flex profile-wrapper">
                  <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                    <NavItem>
                      <NavLink
                        href="#overview-tab"
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          toggleTab("1");
                        }}
                      >
                        <i className="ri-airplay-fill d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">Overview</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#activities"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          toggleTab("2");
                        }}
                      >
                        <i className="ri-list-unordered d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">EMR</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#projects"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                          toggleTab("3");
                        }}
                      >
                        <i className="ri-price-tag-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">Financials</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#documents"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => {
                          toggleTab("4");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">Documents</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#documents"
                        className={classnames({ active: activeTab === "5" })}
                        onClick={() => {
                          toggleTab("5");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color ">Timeline</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#analytics"
                        className={classnames({ active: activeTab === "7" })}
                        onClick={() => {
                          toggleTab("7");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>
                        <span className="d-none d-md-inline-block profile-text-color">Analytics</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <div className="flex-shrink-0 d-flex">
                    <div className="m-3">
                      <Link to={`/pages-profile-settings?id=${userId}`} className="btn btn-success yellow-btn">
                        <i className="ri-edit-box-line align-bottom"></i> Edit Profile
                      </Link>
                    </div>
                  </div>
                </div>

                <TabContent activeTab={activeTab} className="pt-4">
                  <TabPane tabId="1">
                    <Row>
                      {leftPane()}
                      <Col xxl={9}>
                        <Card>
                          <CardBody>
                            <h5 className="card-title">Recent activity</h5>
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
                                {timeline?.map((time) => (
                                  <SwiperSlide key={time._id}>
                                    <Card className="profile-project-card shadow-none profile-project-success mb-0">
                                      <CardBody className="p-4">
                                        <div className="d-flex">
                                          <div className="flex-grow-1 text-muted overflow-hidden">
                                            <h5 className="fs-15 text-truncate text-capitalization mb-1">
                                              <Link to="#" className="text-dark">
                                                {time?.title}
                                              </Link>
                                            </h5>
                                            <p className="text-muted text-truncate mb-0">
                                              {/* Last Update : */}
                                              <span className="fw-semibold text-dark">
                                                {new Date(time.createdAt).toDateString()}
                                              </span>
                                            </p>
                                          </div>
                                        </div>
                                        <div className="d-flex mt-4">
                                          <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2">
                                              <div>
                                                <h5 className="fs-12 text-muted mb-0">{time.description}</h5>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </SwiperSlide>
                                ))}
                              </div>
                            </Swiper>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
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
                                  <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
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
                                // "Management Plan",
                                // "Visit Notes",
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
                                      <h5 className={`fs-15 ${i == subMenu && "text-white"}`}>{i}</h5>
                                      {/* <p className="fs-14 text-muted mb-0">
                                        Frontend Developer
                                      </p> */}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 ms-2">
                                    <button type="button" className="btn btn-sm ">
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
                              <Assessments userId={userId} search="clinical_history" searchBy="category" />
                            </CardBody>
                          )}

                          {subMenu === "Visit Notes" && (
                            <CardBody>
                              <PrescriptionCreate
                                width={12}
                                id={userId}
                                callBack={() => {
                                  getTimeline();
                                }}
                              />
                            </CardBody>
                          )}
                          {subMenu === "Clinical Examination" && (
                            <CardBody>
                              <Clinicalhistory
                                userId={userId}
                                search="clinical_examination"
                                searchBy="category"
                                subMenu="clinical_examination"
                                forms={forms}
                              />
                            </CardBody>
                          )}
                          {subMenu === "Assessments" && (
                            <CardBody>
                              <Assessments userId={userId} search="assessments" searchBy="category" />
                            </CardBody>
                          )}
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>

                  <TabPane tabId="3">
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
                                  <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
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
                                    <button type="button" className="btn btn-sm ">
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

                  <TabPane tabId="4">
                    <Row>
                      {leftPane()}
                      <Col xxl={9}>
                        <Card>
                          <CardBody>
                            <div className="d-flex align-items-center mb-4">
                              <h5 className="card-title flex-grow-1 mb-0">Documents</h5>
                              <div className="flex-shrink-0">
                                <Input className="form-control d-none" type="file" id="formFile" />
                                <Label htmlFor="formFile" className="btn btn-danger">
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
                                        <th scope="col">Upload Date</th>
                                        <th scope="col">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {timeline?.filter((i) => i.reference?.document).length !== 0
                                        ? timeline
                                            ?.filter((i) => i.reference?.document)
                                            .map((item, key) => {
                                              const doc = item.reference?.document?.[0];
                                              return (
                                                <tr key={key}>
                                                  <td>
                                                    <div className="d-flex align-items-center">
                                                      <div className="avatar-sm">
                                                        <div
                                                          className={`avatar-title bg-soft-${item.iconBackgroundClass} text-${item.iconBackgroundClass} rounded fs-20`}
                                                        >
                                                          <i className={item.icon}></i>
                                                        </div>
                                                      </div>
                                                      <div className="ms-3 flex-grow-1">
                                                        <h6 className="fs-15 mb-0">{doc.Key}</h6>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td>{item.type}</td>
                                                  <td>{new Date(item.updatedAt).toDateString()}</td>
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
                                                          <Link to={doc.Location}>
                                                            <i className="ri-download-2-fill me-2 align-middle text-muted" />
                                                            Download
                                                          </Link>
                                                        </DropdownItem>
                                                        <DropdownItem
                                                          onClick={() => {
                                                            if (user.email) {
                                                              axios
                                                                .post(`${config.api.API_URL}/file/send/email`, {
                                                                  email: user.email,
                                                                  url: doc.Location,
                                                                  path: doc.Key,
                                                                  subject: "Document Download from Psymate",
                                                                  htmlTemplate: "PFA attached Doc",
                                                                })
                                                                .then((_res) => {
                                                                  toast.success("Email Sent Successfully");
                                                                })
                                                                .catch((res) => {
                                                                  toast.error("Email not Sent");
                                                                });
                                                            } else {
                                                              toast.error("Email not found");
                                                            }
                                                          }}
                                                        >
                                                          <i className="ri-send-fill me-2 align-middle text-muted" />
                                                          Send Email
                                                        </DropdownItem>
                                                      </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                  </td>
                                                </tr>
                                              );
                                            })
                                        : "No Data Found"}
                                    </tbody>
                                  </Table>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="5">
                    <Row>
                      {leftPane()}
                      <Col xxl={9}>
                        <Card>
                          <CardBody>
                            <h5 className="card-title mb-3">Activities</h5>
                            <Timeline userId={userId} user={user} />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SimplePage;
