import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import BasicDetails from "../../Components/UserFormComponent/BasicDetails";
import LoginComponent from "../Pages/Team/Register";
import ChildrenModal from "../../Components/Common/ChildrenModal";
import DeleteModal from "../../Components/Common/DeleteModal";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import config from "../../config";
import { useFormik } from "formik";
import {
  getTeamData as onGetTeamData,
  deleteTeamData as onDeleteTeamData,
  addTeamData as onAddTeamData,
  updateTeamData as onUpdateTeamData,
} from "../../store/team/action";

import * as Yup from "yup";
import smallImage9 from "../../assets/images/small/img-9.jpg";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const NewAddMemberForm = ({}) => {
  const dispatch = useDispatch();
  const { loading } = useProfile();
  const { users } = useSelector((state) => ({
    users: state.User.users,
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
  const [searchBy, setSearchBy] = useState("phone");
  const [csvData, setCsvData] = useState([]);
  const [type, setType] = useState("patient");

  const onClickData = (team) => {
    setTeam(team);
    setDeleteModal(true);
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTeamMem(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const handleDeleteTeamData = () => {
    if (team) {
      axios.delete(`/data/users&find=${state._id}&findBy=_id`).then((res) => {
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
      if (
        event.target.id === "list-view-button" ||
        event.target.parentElement.id === "list-view-button"
      ) {
        document.getElementById("list-view-button").classList.add("active");
        document.getElementById("grid-view-button").classList.remove("active");
        list.forEach(function (el) {
          el.classList.add("list-view-filter");
          el.classList.remove("grid-view-filter");
        });
      } else {
        document.getElementById("grid-view-button").classList.add("active");
        document.getElementById("list-view-button").classList.remove("active");
        list.forEach(function (el) {
          el.classList.remove("list-view-filter");
          el.classList.add("grid-view-filter");
        });
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

  const searchList = (e) => {
    let inputVal = e.toLowerCase();
    axios
      .get(
        config.api.API_URL +
          `/users?page=1&limit=20&search=${inputVal}&searchBy=${searchBy}`
      )
      .then((res) => {
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

  const handleAdd = () => {
    setAddMember(true);
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
  console.log("page open", state);
  //   const [isFormOpen, setIsFormOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(formCategory[0]);
  const [currentStep, setCurrentStep] = useState(1);

  //   const handleCloseNewEditForm = () => {
  //     setIsFormOpen(!isFormOpen);
  //   };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentStep(1);
  };

  const handleNextClick = () => {
    // Determine the index of the currently selected category
    const currentIndex = formCategory.indexOf(selectedCategory);

    if (currentIndex < formCategory.length - 1) {
      // If not the last category, increment the step and update the selected category
      setCurrentStep(currentStep + 1);
      setSelectedCategory(formCategory[currentIndex + 1]);
    }
  };

  //   useEffect(() => {
  //     // Your code for handling changes when a new category is selected
  //     // You can set CSS classes here based on the selectedCategory
  //   }, [selectedCategory]);

  // Define a mapping of categories to their corresponding components
  const categoryComponentMap = {
    "Basic Details": <BasicDetails state={state} />,
    //     "Contact Details": <ContactDetails state={state} />,
    //     "Verification Details": <VerificationDetails state={state} />,
    //     "Address Details": <AddressDetails state={state} />,
    //     "Academic Details": <AcademicDetails state={state} />,
    //     "Work Experience": <WorkExperience state={state} />,
    //     Roles: <Roles state={state} />,
    //     "Practice Details": <PracticeDetails state={state} />,
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
          <Button
            className={`${type === "patient" && "bg-primary"}`}
            onClick={() => {
              setType("patient");
            }}
            style={{
              marginBottom: 10,
            }}
          >
            Users
          </Button>
          <Button
            onClick={() => {
              setType("doctor");
            }}
            className={`${type == "doctor" && "bg-primary"}`}
            style={{
              marginLeft: 10,
              marginBottom: 10,
            }}
          >
            Team
          </Button>
          <Card>
            <CardBody>
              <Row className="g-2">
                <Col sm={4}>
                  <div className="search-box">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Search.."
                      onChange={(e) => searchList(e.target.value)}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <Col className="col-sm-auto ms-auto">
                  <div className="list-grid-nav hstack gap-1">
                    <Button
                      color="info"
                      id="grid-view-button"
                      className="btn btn-soft-info nav-link btn-icon fs-14 active filter-button"
                    >
                      <i className="ri-grid-fill"></i>
                    </Button>
                    <Button
                      color="info"
                      id="list-view-button"
                      className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"
                    >
                      <i className="ri-list-unordered"></i>
                    </Button>
                    <Dropdown isOpen={dropdownOpen} toggle={toggledropDown}>
                      <DropdownToggle
                        type="button"
                        className="btn btn-soft-info btn-icon fs-14"
                      >
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <li>
                          <Button
                            onClick={() => {
                              setSearchBy("displayName");
                            }}
                            className="dropdown-item"
                            to="#"
                          >
                            Name
                          </Button>
                        </li>
                        <li>
                          <Button
                            onClick={() => {
                              setSearchBy("email");
                            }}
                            className="dropdown-item"
                            to="#"
                          >
                            Email
                          </Button>
                        </li>
                        <li>
                          <Button
                            onClick={() => {
                              setSearchBy("phone");
                            }}
                            className="dropdown-item"
                            to="#"
                          >
                            Phone Number
                          </Button>
                        </li>
                        <li>
                          <Button
                            onClick={() => {
                              setSearchBy("psyID");
                            }}
                            className="dropdown-item"
                            to="#"
                          >
                            Psymate Id
                          </Button>
                        </li>
                      </DropdownMenu>
                    </Dropdown>

                    <Button
                      color="success users-btn"
                      onClick={() => handleAdd()}
                    >
                      <i className="ri-add-fill me-1 align-bottom"></i> Add
                      Users
                    </Button>

                    {/* <UploadCSVExportData
                    setState={setCsvData}
                    state={csvData}
                    onSubmit={() => {
                      const processAndCallAPI = (data, index) => {
                        setTimeout(() => {
                          axios
                            .post(
                              config.api.API_URL +
                                `/login/register?type=${type}`,
                              {
                                data,
                              }
                            )
                            .then((res) => {
                              console.log(
                                `API call ${index + 1} completed:`,
                                res
                              );
                            })
                            .catch((error) => {
                              console.error(
                                `API call ${index + 1} failed:`,
                                error
                              );
                            });
                        }, index * 1000); // Delay each API call by 1 second (1000 milliseconds)
                      };

                      const processedData = [
                        {
                          phone: "919900383820",
                          email: "drsamantdarshi@psymate.org",
                          displayName: "Samant Darshi",
                          gender: "M",
                        },
                      ].map((res, index) => {
                        const code = extractCountryCode(res.phone);

                        const payload = {
                          ...res,
                          firstName: res.displayName?.split(" ")?.[0] || "",
                          lastName: res.displayName?.split(" ")?.[1] || "",
                          gender: res.gender === "M" ? "male" : "female",
                          phone: removeCountryCode(res.phone, code),
                          countryCode: code,
                        };
                        return { payload, index };
                      });

                      // Call APIs with a 1-second delay between each
                      processedData.forEach((item) => {
                        processAndCallAPI(item.payload, item.index);
                      });
                    }}
                  /> */}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <div className="outer-tab-container">
            <div className="inner-tab-container">
              <div className="tab-left-container">
                <div className="inner-left-tab-container">
                  <div className="sticky-inner-tab">
                    {formCategory.map((category, i) => (
                      <div
                        key={i}
                        className={`form-category-text ${
                          category === selectedCategory
                            ? "selected-category-class"
                            : ""
                        }`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <p>{category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="tab-right-container">
                <div className="inner-right-tab">
                  <div className="tab-contentitem">
                    {categoryComponentMap[selectedCategory]}
                  </div>
                  <div className="new-form-next-btn">
                    <div></div>
                    <div>
                      {(state.type === "patient" &&
                        selectedCategory === "Roles") ||
                      (state.type === "doctor" &&
                        selectedCategory === "Practice Details") ? (
                        <button>Save</button>
                      ) : (
                        <button onClick={handleNextClick}>Next</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default NewAddMemberForm;
