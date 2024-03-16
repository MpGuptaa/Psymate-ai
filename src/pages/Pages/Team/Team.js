import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  Offcanvas,
  OffcanvasBody,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import "./Teams.css";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer, toast } from "react-toastify";

//User Images
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import userdummyimg from "../../../assets/images/users/user-dummy-img.jpg";

//Small Images
import smallImage9 from "../../../assets/images/small/img-9.jpg";
import ruppee from "../../../assets/icons/rupee-symbol.png";
import profile from "../../../assets/icons/user.png";
import docs from "../../../assets/icons/google-docs.png";
import stethoscope from "../../../assets/icons/stethoscope.png";
import InfiniteScroll from "react-infinite-scroll-component";

//redux
import { useSelector, useDispatch } from "react-redux";

//import action
import {
  getTeamData as onGetTeamData,
  deleteTeamData as onDeleteTeamData,
  addTeamData as onAddTeamData,
  updateTeamData as onUpdateTeamData,
} from "../../../store/team/action";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { getUsers } from "../../../store/users/action";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import axios from "axios";
import config from "../../../config";
import FormLayout from "../../../helpers/FormLayout";
import ChildrenModal from "../../../Components/Common/ChildrenModal";
import LoginComponent from "./Register";
import UploadCSVExportData from "../../../helpers/UploadCSVExportData";
import { extractCountryCode, removeCountryCode } from "../../../helpers/Helper";
import NewAddMemberForm from "../../NewAddMemForm/index.js";
import AddUserPopUp from "./AddUserPopUp.js";
import UserProfileForm from "../../../Components/Common/UserProfileForm/index.js";
import Filter from "./Filter";
import { createSearchParams } from "../../../helpers/Helper.js";
const Team = () => {
  document.title = "Team | Psymate - Management Portal";

  const dispatch = useDispatch();
  const { loading } = useProfile();
  const { users, user } = useSelector((state) => ({
    users: state.User.users,
    user: state.Profile.user,
  }));

  const [pageCount, setPageCount] = useState(1);

  const [team, setTeam] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [teamList, setTeamlist] = useState([]);

  //Modal
  const [teamMem, setTeamMem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [state, setState] = useState({});
  const [modal, setModal] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [type, setType] = useState("patient");

  const [isNewEditForm, setIsNewEditForm] = useState(false);

  const getInitials = (name) => {
    // Check if name is defined and not null
    if (name && typeof name === "string") {
      // Split the name into words
      const nameWords = name.split(" ");

      // Extract the first letter of each word
      const initials = nameWords.map((word) => word[0]).join("");

      return initials;
    } else {
      // Handle the case when name is undefined, null, or not a string
      return "";
    }
  };

  const onClickDelete = async (toNum) => {
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

  const [userName, setUserName] = useState("Admin");

  const [isContainerVisible, setIsContainerVisible] = useState(false);

  const handleOpenContainer = () => {
    setIsContainerVisible(true);
  };

  const formCategory = [
    "Basic Details",
    "Contact Details",
    "Verification Details",
    "Address Details",
    "Academic Details",
    "Work Experience",
    "Roles",
    "Practice Details",
  ];

  useEffect(() => {
    dispatch(getUsers(type, 1, `search=${type}&searchBy=type`));
  }, [dispatch, loading, type]);

  useEffect(() => {
    setTeam(users);
    const orderedName = users.sort((a, b) => a.displayName.localeCompare(b.displayName));

    setTeamlist(orderedName);
  }, [users]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTeamMem(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Update To do
  const handleTeamClick = useCallback(
    (arg) => {
      const teamMem = arg;
      setTeamMem(teamMem);
      setState(teamMem);
      setIsEdit(true);
      toggle();
    },
    [toggle],
  );

  const handleNewEditForm = useCallback(
    (arg) => {
      console.log("Setting state with:", arg);

      const teamMem = arg;
      // setTeamMem(teamMem);
      setState(teamMem);

      setIsNewEditForm(true); // Toggle the state

      // toggle();
    },
    [toggle],
  );

  const handleAdd = () => {
    setAddMember(true);
  };

  const [registerPopUp, setRegisterPopUp] = useState(false);

  const handleAddUser = () => {
    // console.log("User added")
    setRegisterPopUp(true);
  };

  const closeForm = () => {
    setRegisterPopUp(false);
  };

  // Add To do
  const handleTeamClicks = () => {
    setTeamMem("");
    setModal(!modal);
    setIsEdit(false);
    toggle();
  };

  // delete
  const onClickData = (team) => {
    setTeam(team);
    setDeleteModal(true);
  };

  const handleDeleteTeamData = () => {
    // console.log("Team : ",team)
    if (team) {
      axios.delete(`/data/users?find=${team._id}&findBy=_id`).then((res) => {
        toggle();
        toast.success(`User Deleted`);
        window.location.reload();
      });
      // dispatch(onDeleteTeamData(team));
      setDeleteModal(false);
    }
  };

  useEffect(() => {
    const list = document.querySelectorAll(".team-list");
    const buttonGroups = document.querySelectorAll(".filter-button");
    for (let i = 0; i < buttonGroups.length; i++) {
      buttonGroups[i].addEventListener("click", onButtonGroupClick);
    }

    function onButtonGroupClick(event) {
      const listViewButton = document.getElementById("list-view-button");
      const gridViewButton = document.getElementById("grid-view-button");
      const teamList = document.querySelectorAll(".team-list");

      if (listViewButton && gridViewButton && teamList) {
        if (event.target.id === "list-view-button" || event.target.parentElement.id === "list-view-button") {
          listViewButton.classList.add("active");
          gridViewButton.classList.remove("active");
          teamList.forEach(function (el) {
            el.classList.add("list-view-filter");
            el.classList.remove("grid-view-filter");
          });
        } else {
          gridViewButton.classList.add("active");
          listViewButton.classList.remove("active");
          teamList.forEach(function (el) {
            el.classList.remove("list-view-filter");
            el.classList.add("grid-view-filter");
          });
        }
      }
    }
  }, []);

  const favouriteBtn = (ele) => {
    if (ele.closest("button").classList.contains("active")) {
      ele.closest("button").classList.remove("active");
    } else {
      ele.closest("button").classList.add("active");
    }
  };
  const [filterValues, setFilterValues] = useState({ displayName: "", email: "", phone: "", psyID: "", type: "" });

  const inputFields = [
    { type: "text", name: "displayName", label: "Name", placeholder: "Filter By Name..." },
    { type: "text", name: "email", label: "Email", placeholder: "Filter By Email..." },
    { type: "text", name: "phone", label: "Phone Number", placeholder: "Filter By Phone Number..." },
    // { type: 'number', name: 'psyID', label: 'Psymate Id', placeholder: 'Filter By Psymate Id...' },
    {
      type: "radio",
      name: "type",
      label: "User Type",
      options: [
        { label: "Patient", value: "patient" },
        { label: "Doctor", value: "doctor" },
        { label: "Team", value: "team" },
      ],
    },
  ];

  const searchList = (e) => {
    const searchParamsString = createSearchParams(filterValues);
    axios.get(config.api.API_URL + `/users?page=1&limit=20&${searchParamsString}`).then((res) => {
      setTeam(res.data);
      setTeamlist(res.data);
      if (res.data.length === 0) {
        document.getElementById("noresult").style.display = "block";
        document.getElementById("teamlist").style.display = "none";
      } else {
        document.getElementById("noresult").style.display = "none";
        document.getElementById("teamlist").style.display = "block";
      }
    });
  };

  useEffect(() => {
    searchList();
  }, [filterValues]);

  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    axios.get(config.api.API_URL + `/users?page=${pageCount}&limit=20`).then((res) => {
      if (res.length === 0) {
        // console.log("res.length : ", res.length);
        setHasMore(false); // No more data available
      } else {
        setPageCount(pageCount + 1);
        setTeamlist((prevTeamList) => [...prevTeamList, ...res.data]);
      }
      setTeam((prevTeamList) => [...prevTeamList, ...res.data]);
    });
  };

  //OffCanvas
  const [isOpen, setIsOpen] = useState(false);
  const [sideBar, setSideBar] = useState([]);

  //Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggledropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (teamMem && teamMem.name) || "",
      designation: (teamMem && teamMem.designation) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter team Name"),
      designation: Yup.string().required("Please Enter Your designation"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateTeamData = {
          id: teamMem ? teamMem.id : 0,
          name: values.name,
          designation: values.designation,
          projectCount: values.projectCount,
          taskCount: values.taskCount,
        };
        // save edit Team data
        dispatch(onUpdateTeamData(updateTeamData));
        validation.resetForm();
      } else {
        const newTeamData = {
          id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          name: values.name,
          designation: values.designation,
          projectCount: 0,
          taskCount: 0,
          backgroundImg: smallImage9,
        };
        // save new TeamData
        dispatch(onAddTeamData(newTeamData));
        validation.resetForm();
      }
      toggle();
    },
  });

  const handleFilterChange = (newFilterValues) => {
    setFilterValues(newFilterValues);
  };
  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteTeamData()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <ChildrenModal
        size={"lg"}
        show={addMember}
        onSubmit={() => {}}
        buttons={false}
        onCloseClick={() => setAddMember(false)}
      >
        <LoginComponent type={type} onSubmit={() => setAddMember(false)} />
      </ChildrenModal>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Users" pageTitle="Pages" />
          <Card>
            <CardBody>
              <Row className="g-2">
                <Col className="col-sm-auto ms-auto">
                  <div className="list-grid-nav hstack gap-1">
                    <Button
                      color="info"
                      id="grid-view-button"
                      className="btn btn-soft-info nav-link btn-icon fs-14 active filter-button"
                    >
                      <i className="ri-grid-fill"></i>
                    </Button>
                    <Link to="/apps-crm-contacts">
                      <Button color="info" className="btn btn-soft-info nav-link btn-icon fs-14 filter-button">
                        <i className="ri-list-unordered"></i>
                      </Button>
                    </Link>

                    <Button
                      color="success users-btn"
                      // onClick={() => handleAdd()}
                      onClick={handleAddUser}
                    >
                      <i className="ri-add-fill me-1 align-bottom"></i>
                      Add User
                    </Button>
                    <Filter inputFields={inputFields} filterValues={filterValues} onFilterChange={handleFilterChange} />
                    {registerPopUp && <UserProfileForm openForm={registerPopUp} closeForm={closeForm} type={type} />}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row>
            <Col lg={12}>
              <div id="teamlist">
                {/* {console.log("Team List : ", teamList)} */}
                {type === "patient" ? (
                  <InfiniteScroll
                    dataLength={teamList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                  >
                    <Row className="team-list grid-view-filter">
                      {teamList.map((item, key) => (
                        <Col key={key}>
                          <Card className="team-box">
                            <div style={{ backgroundColor: "#e3ac75" }} className="team-cover">
                              <img src={item.backgroundImg} alt="" className="img-fluid" />
                            </div>
                            <CardBody className="p-4">
                              <Row className="align-items-center team-row">
                                <Col lg={3} className="team-settings">
                                  <Row>
                                    <Col>
                                      <div className="flex-shrink-0 me-2">
                                        <button
                                          type="button"
                                          className="btn btn-light btn-icon rounded-circle btn-sm favourite-btn"
                                          onClick={(e) => favouriteBtn(e.target)}
                                        >
                                          <i className="ri-star-fill fs-14"></i>
                                        </button>
                                      </div>
                                    </Col>
                                    <UncontrolledDropdown direction="start" className="col text-end">
                                      <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
                                        <i className="ri-more-fill fs-17"></i>
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        {/* <DropdownItem
                                          className="dropdown-item edit-list"
                                          href="#addmemberModal"
                                          onClick={() => handleTeamClick(item)}
                                        >
                                          <i className="ri-pencil-line me-2 align-bottom text-muted"></i>
                                          Edit
                                        </DropdownItem> */}
                                        <DropdownItem
                                          className="dropdown-item remove-list"
                                          href="#removeMemberModal"
                                          onClick={() => onClickData(item)}
                                        >
                                          <i className="ri-delete-bin-5-line me-2 align-bottom text-muted"></i>
                                          Remove
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                  </Row>
                                </Col>

                                <Col lg={3} className="col">
                                  <div className="team-profile-img">
                                    <Link
                                      to={`/pages-profile?id=${item._id}`}
                                      // className="btn btn-light view-btn"
                                    >
                                      <div className="avatar-lg img-thumbnail rounded-circle flex-shrink-0 ">
                                        {item.photoURL != null ? (
                                          <img
                                            src={item.photoURL}
                                            alt=""
                                            className="img-fluid d-block rounded-circle"
                                          />
                                        ) : (
                                          <div className="avatar-title text-uppercase border rounded-circle bg-light text-primary avtar-color">
                                            {/* {item.name.charAt(0) +
                                        item.name
                                          .split(" ")
                                          .slice(-1)
                                          .toString()
                                          .charAt(0)} */}
                                            {getInitials(item.displayName)}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                    <div className="team-content">
                                      <Link
                                        to="#"
                                        onClick={() => {
                                          setIsOpen(!isOpen);
                                          setSideBar(item);
                                        }}
                                      >
                                        <h5 className="fs-16 mb-1">{item.displayName}</h5>
                                      </Link>
                                    </div>
                                  </div>
                                </Col>

                                <Col lg={3} className="col">
                                  <Row className="text-muted text-center">
                                    <Col>
                                      {item.psyID ? (
                                        <div className="user-detail-container">
                                          <p className="text-muted mb-0">Psy Id</p>
                                          <h5 className="">{item.psyID}</h5>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {item.age ? (
                                        <div className="user-detail-container">
                                          <p className="text-muted mb-0">Age</p>
                                          <h5 className="">{item.age}</h5>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                {/* <Col lg={3} className="col">
                                  <div className="d-flex justify-content-around mt-2">
                                    {item.phone ? (
                                      <div className="user-detail-container">
                                        <i
                                          onClick={() =>
                                            onClickDelete(item?.phone)
                                          }
                                          style={{ cursor: "pointer" }}
                                          className="las la-phone text-size-20px"
                                        ></i>
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    <div className="user-detail-container">
                                      <i className="las la-sms"></i>{" "}
                                    </div>
                                  </div>
                                </Col> */}

                                <Col lg={2} className="col"></Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </InfiniteScroll>
                ) : (
                  <Row className="team-list grid-view-filter">
                    {teamList.map((item, key) => (
                      <Col key={key}>
                        <Card className="team-box">
                          <div style={{ backgroundColor: "#e3ac75" }} className="team-cover">
                            <img src={item.backgroundImg} alt="" className="img-fluid" />
                          </div>
                          <CardBody className="p-4">
                            <Row className="align-items-center team-row">
                              <Col className="team-settings">
                                <Row>
                                  <Col>
                                    <div className="flex-shrink-0 me-2">
                                      <button
                                        type="button"
                                        className="btn btn-light btn-icon rounded-circle btn-sm favourite-btn"
                                        onClick={(e) => favouriteBtn(e.target)}
                                      >
                                        <i className="ri-star-fill fs-14"></i>
                                      </button>
                                    </div>
                                  </Col>
                                  <UncontrolledDropdown direction="start" className="col text-end">
                                    <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
                                      <i className="ri-more-fill fs-17"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem
                                        className="dropdown-item edit-list"
                                        href="#addmemberModal"
                                        onClick={() => handleTeamClick(item)}
                                      >
                                        <i className="ri-pencil-line me-2 align-bottom text-muted"></i>
                                        Edit
                                      </DropdownItem>
                                      <DropdownItem
                                        className="dropdown-item remove-list"
                                        href="#removeMemberModal"
                                        onClick={() => onClickData(item)}
                                      >
                                        <i className="ri-delete-bin-5-line me-2 align-bottom text-muted"></i>
                                        Remove
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </Row>
                              </Col>

                              <Col lg={4} className="col">
                                <div className="team-profile-img">
                                  <Link
                                    to={`/pages-profile?id=${item._id}`}
                                    // className="btn btn-light view-btn"
                                  >
                                    <div className="avatar-lg img-thumbnail rounded-circle flex-shrink-0 ">
                                      {item.photoURL != null ? (
                                        <img src={item.photoURL} alt="" className="img-fluid d-block rounded-circle" />
                                      ) : (
                                        <div className="avatar-title text-uppercase border rounded-circle bg-light text-primary avtar-color">
                                          {/* {item.name.charAt(0) +
                                  item.name
                                    .split(" ")
                                    .slice(-1)
                                    .toString()
                                    .charAt(0)} */}
                                          {getInitials(item.displayName)}
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                  <div className="team-content">
                                    <Link
                                      to="#"
                                      onClick={() => {
                                        setIsOpen(!isOpen);
                                        setSideBar(item);
                                      }}
                                    >
                                      <h5 className="fs-16 mb-1">
                                        {item.prefix || ""} {item.displayName}
                                      </h5>
                                    </Link>
                                    {item.psyID ? (
                                      <div className="user-detail-container">
                                        <p className="text-muted mb-0">Psy Id</p>
                                        <h5 className="">{item.psyID}</h5>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    {item.age ? (
                                      <div className="user-detail-container">
                                        <p className="text-muted mb-0">Age</p>
                                        <h5 className="">{item.age}</h5>
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    <p className="text-muted mb-0">{item.qualifiations}</p>
                                  </div>
                                </div>
                              </Col>

                              <Col lg={2} className="col"></Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
                <div className="modal fade" id="addmembers" tabIndex="-1" aria-hidden="true">
                  <div className="modal-dialog">
                    <Modal size="lg" isOpen={modal} toggle={toggle} centered>
                      <ModalBody>
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <FormLayout
                            formName={"user"}
                            search={"displayName"}
                            heading={`Manage Users`}
                            setState={setState}
                            state={state}
                          />
                          <div className="hstack gap-2 mt-4 justify-content-between">
                            <button
                              className="btn btn-danger"
                              data-bs-dismiss="modal"
                              onClick={(e) => {
                                setIsEdit(false);
                                setDeleteModal(true);
                              }}
                              type="button"
                            >
                              Delete
                            </button>
                            <div className="gap-2 hstack">
                              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={toggle} type="button">
                                <i className="ri-close-line me-1 align-middle"></i> Close
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  // console.log(state);
                                  if (!state) {
                                    toast.error("Please fill all the fields marked with *");
                                    return;
                                  }
                                  if (isEdit) {
                                    axios.put(`/user/${state._id}`, state).then((res) => {
                                      toggle();
                                      toast.success(`Users Updated`);
                                    });
                                  } else {
                                    axios
                                      .post(`/user?type=${type}`, {
                                        data: state,
                                      })
                                      .then((res) => {
                                        toggle();
                                        toast.success(`User created`);
                                        // window.location.reload();
                                      });
                                  }
                                }}
                                className="btn btn-primary"
                              >
                                <i className="ri-save-3-line align-bottom me-1"></i> Save
                              </button>
                            </div>
                          </div>
                        </Form>
                      </ModalBody>
                    </Modal>
                  </div>
                </div>

                <Offcanvas
                  isOpen={isOpen}
                  direction="end"
                  toggle={() => setIsOpen(!isOpen)}
                  className="offcanvas-end border-0"
                  tabIndex="-1"
                >
                  <OffcanvasBody className="profile-offcanvas p-0">
                    <div className="team-cover">
                      <img src={sideBar.backgroundImg || smallImage9} alt="" className="img-fluid" />
                    </div>
                    <div className="p-3">
                      <div className="team-settings">
                        <Row>
                          <Col>
                            <div className="bookmark-icon flex-shrink-0 me-2">
                              <Input type="checkbox" id="favourite13" className="bookmark-input bookmark-hide" />
                              <Label htmlFor="favourite13" className="btn-star">
                                <svg width="20" height="20">
                                  {/* <use xlink:href="#icon-star"/> */}
                                </svg>
                              </Label>
                            </div>
                          </Col>
                          <UncontrolledDropdown direction="start" className="col text-end">
                            <DropdownToggle tag="a" id="dropdownMenuLink14" role="button">
                              <i className="ri-more-fill fs-17"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem>
                                <i className="ri-eye-line me-2 align-middle" />
                                View
                              </DropdownItem>
                              <DropdownItem>
                                <i className="ri-star-line me-2 align-middle" />
                                Favorites
                              </DropdownItem>
                              <DropdownItem>
                                <i className="ri-delete-bin-5-line me-2 align-middle" />
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Row>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <img
                        src={sideBar.photoURL || avatar2}
                        alt=""
                        className="avatar-lg img-thumbnail rounded-circle mx-auto"
                      />
                      <div className="mt-3">
                        <h5 className="fs-15">
                          <Link to="#" className="link-primary">
                            {sideBar.displayName || "Nancy Martino"}
                          </Link>
                        </h5>
                        <p className="text-muted">{/* {sideBar.designation || "Team Leader & HR"} */}</p>
                      </div>
                      <div className="hstack gap-2 justify-content-center mt-4">
                        <div className="avatar-xs">
                          <Link to="#" className="avatar-title bg-soft-secondary text-secondary rounded fs-16">
                            <i className="ri-facebook-fill"></i>
                          </Link>
                        </div>
                        <div className="avatar-xs">
                          <Link to="#" className="avatar-title bg-soft-success text-success rounded fs-16">
                            <i className="ri-slack-fill"></i>
                          </Link>
                        </div>
                        <div className="avatar-xs">
                          <Link to="#" className="avatar-title bg-soft-info text-info rounded fs-16">
                            <i className="ri-linkedin-fill"></i>
                          </Link>
                        </div>
                        <div className="avatar-xs">
                          <Link to="#" className="avatar-title bg-soft-danger text-danger rounded fs-16">
                            <i className="ri-dribbble-fill"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* <Row className="g-0 text-center">
                      <Col xs={6}>
                        <div className="p-3 border border-dashed border-start-0">
                          <h5 className="mb-1">
                            {sideBar.projectCount || "124"}
                          </h5>
                          <p className="text-muted mb-0">Projects</p>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="p-3 border border-dashed border-start-0">
                          <h5 className="mb-1">{sideBar.taskCount || "81"}</h5>
                          <p className="text-muted mb-0">Tasks</p>
                        </div>
                      </Col>
                    </Row> */}
                    <div className="p-3">
                      <h5 className="fs-15 mb-3">Personal Details</h5>
                      <div className="mb-3">
                        <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">Number</p>
                        <h6>{sideBar.phone}</h6>
                      </div>
                      <div className="mb-3">
                        <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">Email</p>
                        <h6>{sideBar.email}</h6>
                      </div>
                      {/* <div>
                        <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">
                          Location
                        </p>
                        <h6 className="mb-0">Carson City - USA</h6>
                      </div> */}
                    </div>
                    {/* <div className="p-3 border-top">
                      <h5 className="fs-15 mb-4">File Manager</h5>
                      <div className="d-flex mb-3">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-soft-danger text-danger rounded fs-16">
                            <i className="ri-image-2-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Images</Link>
                          </h6>
                          <p className="text-muted mb-0">4469 Files</p>
                        </div>
                        <div className="text-muted">12 GB</div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-soft-secondary text-secondary rounded fs-16">
                            <i className="ri-file-zip-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Documents</Link>
                          </h6>
                          <p className="text-muted mb-0">46 Files</p>
                        </div>
                        <div className="text-muted">3.46 GB</div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-soft-success text-success rounded fs-16">
                            <i className="ri-live-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Media</Link>
                          </h6>
                          <p className="text-muted mb-0">124 Files</p>
                        </div>
                        <div className="text-muted">4.3 GB</div>
                      </div>
                      <div className="d-flex">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-soft-primary text-primary rounded fs-16">
                            <i className="ri-error-warning-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">
                            <Link to="#">Others</Link>
                          </h6>
                          <p className="text-muted mb-0">18 Files</p>
                        </div>
                        <div className="text-muted">846 MB</div>
                      </div>
                    </div> */}
                  </OffcanvasBody>
                  <div className="offcanvas-foorter border p-3 hstack gap-3 text-center position-relative">
                    <button className="btn btn-light w-100">
                      <i className="ri-question-answer-fill align-bottom ms-1"></i>
                      Send Message
                    </button>
                    <Link to="/pages-profile" className="btn btn-primary w-100">
                      <i className="ri-user-3-fill align-bottom ms-1"></i> View Profile
                    </Link>
                  </div>
                </Offcanvas>
              </div>
              <div className="py-4 mt-4 text-center" id="noresult" style={{ display: "none" }}>
                <lord-icon
                  src="https://cdn.lordicon.com/msoeawqm.json"
                  trigger="loop"
                  colors="primary:#405189,secondary:#0ab39c"
                  style={{ width: "72px", height: "72px" }}
                ></lord-icon>
                <h5 className="mt-4">Sorry! No Result Found</h5>
              </div>
            </Col>
          </Row>
          {isNewEditForm && (
            <NewAddMemberForm
              formCategory={
                state.type === "doctor"
                  ? formCategory
                  : formCategory.filter((category) => category !== "Practice Details")
              } // Pass the filtered array
              state={state}
            />
          )}

          {/* <svg className="bookmark-hide">
                        <symbol viewBox="0 0 24 24" stroke="currentColor" fill="var(--color-svg)" id="icon-star"><path strokeWidth=".4" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></symbol>
                    </svg> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Team;
