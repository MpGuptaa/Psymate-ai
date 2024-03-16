import React, { useEffect, useState, useMemo } from "react";
import AsyncSelect from "react-select/async";

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  UncontrolledCollapse,
  Row,
  Card,
  CardHeader,
  Col,
  Input,
  Label,
  Button,
} from "reactstrap";
import classnames from "classnames";

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import DeleteModal from "../../../Components/Common/DeleteModal";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
// import { Published, Price } from "./AcademyCourseCol";
//Import data

//Import actions
import {
  getCourses as onGetCourses,
  deleteCourses,
} from "../../../store/academy/action";
import { isEmpty } from "lodash";
import Select from "react-select";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import axios from "axios";
import { addToCart } from "../../../helpers/fakebackend_helper";
import config from "../../../config";
import UploadCSV from "../../../helpers/UploadCSV";
import { deleteBlog, getBlogs } from "../apiTimes";

const SingleOptions = [
  { value: "Watches", label: "Watches" },
  { value: "Headset", label: "Headset" },
  { value: "Sweatshirt", label: "Sweatshirt" },
  { value: "20% off", label: "20% off" },
  { value: "4 star", label: "4 star" },
];

const GetBlogs = (props) => {
  const dispatch = useDispatch();

  const { courses } = useSelector((state) => ({
    courses: state.Academy.courses,
  }));

  const { loading } = useProfile();
  const [patient, setPatient] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedMulti, setselectedMulti] = useState(null);
  const [course, setCourse] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const id = '';
  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }

  useEffect(() => {
    if (courses && !courses.data?.length) {
      dispatch(onGetCourses());
    }
  }, [dispatch, loading]);

  useEffect(() => {
    setCourseList(courses.data);
  }, [courses]);

  useEffect(() => {
    if (!isEmpty(courses)) setCourseList(courses.data);
  }, [courses]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredCourses = courses.data;
      if (type !== "all") {
        filteredCourses = courses.data.filter(
          (course) => course.status === type
        );
      }
      setCourseList(filteredCourses);
    }
  };

  const [cate, setCate] = useState("all");

  const categories = (category) => {
    let filteredCourses = courses.data;
    if (category !== "all") {
      filteredCourses = courses.data.filter(
        (course) => course.category === category
      );
    }
    setCourseList(filteredCourses);
    setCate(category);
  };

  const [ratingvalues, setRatingvalues] = useState([]);
  /*
  on change rating checkbox method
  */
  const onChangeRating = (value) => {
    // setCourseList(coursesData.filter((course) => course.rating >= value));
    setCourseList([]);

    var modifiedRating = [...ratingvalues];
    modifiedRating.push(value);
    setRatingvalues(modifiedRating);
  };

  const handleSearchInputChange = (e) => {
    const keyword = e.target.value.trim();
    setSearchKeyword(keyword);
  };
  const onUncheckMark = (value) => {
    var modifiedRating = [...ratingvalues];
    const modifiedData = (modifiedRating || []).filter((x) => x !== value);
    /*
    find min values
    */
    // var filteredCourses = coursesData;
    var filteredCourses = [];
    if (modifiedData && modifiedData?.length && value !== 1) {
      var minValue = Math.min(...modifiedData);
      if (minValue && minValue !== Infinity) {
        filteredCourses = [].filter((course) => course.rating >= minValue);
        setRatingvalues(modifiedData);
      }
    } else {
      filteredCourses = [];
    }
    setCourseList(filteredCourses);
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [blogData, setBlogData] = useState([]);
  async function fetchData(page) {
    try {
      const blogData = await getBlogs(page, searchKeyword, id);
      // console.log("Blog Data:", blogData);
      // Do something with the podcast data
      setBlogData(blogData);
    } catch (error) {
      console.error("Error fetching podcast:", error.message);
      // Handle the error appropriately
    }
  }
  useEffect(() => {
    fetchData(1);
  }, [searchKeyword]);

  const onClickDelete = async (course) => {
   setCourse(course);
    // setDeleteModal(true);
    await deleteBlog(course._id)
    window.location.reload();
  };

  const handleDeleteOrder = () => {
    if (course) {
      dispatch(deleteCourses(course._id));
      setDeleteModal(false);
    }
  };

  // Displat Delete Button
  const [dele, setDele] = useState(0);
  const displayDelete = () => {
    const ele = document.querySelectorAll(".courseCheckBox:checked");
    const del = document.getElementById("selection-element");
    setDele(ele?.length);
    if (ele?.length === 0) {
      del.style.display = "none";
    } else {
      del.style.display = "block";
    }
  };

  // Delete Multiple
  const deleteMultiple = () => {
    const ele = document.querySelectorAll(".courseCheckBox:checked");
    const del = document.getElementById("selection-element");
    ele.forEach((element) => {
      dispatch(deleteCourses(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
      del.style.display = "none";
    });
  };
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: (cell) => {
          return (
            <input
              type="checkbox"
              className="courseCheckBox form-check-input"
              value={cell.row.original._id}
              onClick={() => displayDelete()}
            />
          );
        },
      },
      {
        Header: "Blog",
        Cell: (course) => {
          return (
            <>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar-sm bg-light rounded p-1">
                    <img
                      src={course.row.original.thumbnail}
                      alt=""
                      className="img-fluid d-block"
                    />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-14 mb-1">
                    <Link
                      to={`/teams-add-blogs?id=${course.row.original._id}`}
                      className="text-dark"
                    >
                      {course.row.original.title}
                    </Link>
                  </h5>
                  <p className="text-muted mb-0">
                    {course.row.original.index == "index" ? "Published" : "Not Published"}

                    <span className="fw-medium">
                      - {course.row.original.author.displayName}
                    </span>
                  </p>
                </div>
              </div>
            </>
          );
        },
      },
      //   {
      //     Header: "Duration",
      //     accessor: "duration",
      //     filterable: false,
      //   },
      //   {
      //     Header: "Price",
      //     accessor: "price",
      //     filterable: false,
      //     Cell: (cellProps) => {
      //       return <Price {...cellProps} />;
      //     },
      //   },

      //   {
      //     Header: "Published",
      //     accessor: "createdAt",
      //     filterable: false,
      //     Cell: (cellProps) => {
      //       return <Published {...cellProps} />;
      //     },
      //   },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle
                href="#"
                className="btn btn-soft-secondary btn-sm"
                tag="button"
              >
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                {/* <DropdownItem
                  href={`/apps-academy-course-details?id=${cellProps.row.original._id}`}
                >
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                  View
                </DropdownItem> */}

                <DropdownItem
                  href={`/teams-add-blogs?id=${cellProps.row.original._id}`}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  Edit
                </DropdownItem>

                {/* <DropdownItem
                  onClick={() => {
                    if (!patient.displayName) {
                      toast.error("Please select the patient");
                      return;
                    }
                    addToCart(
                      {
                        displayName: patient.displayName,
                        phone: patient.phone,
                        _id: patient._id,
                        email: patient.email,
                      },
                      {
                        ...cellProps.row.original,
                        displayName: cellProps.row.original.name,
                      }
                    );
                  }}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  Add To Cart
                </DropdownItem> */}

                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const courseData = cellProps.row.original;
                    onClickDelete(courseData);
                  }}
                >
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    []
  );

  document.title = "Courses | Psymate - Management Portal";

  return (
    <div className="page-content">
      <ToastContainer closeButton={false} limit={1} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <Container fluid>
        <BreadCrumb title="Blog" pageTitle="Outreach" />

        <Row>
          <div className="col-xl-12 col-lg-8">
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center border-0">
                    <div className="col d-flex justify-content-between ">
                      <Nav
                        className="nav-tabs-custom card-header-tabs border-bottom-0"
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "1" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("1", "all");
                            }}
                            href="#"
                          >
                            All
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                              12
                            </span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "2" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("2", "published");
                            }}
                            href="#"
                          >
                            Published
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                              5
                            </span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "3" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("3", "draft");
                            }}
                            href="#"
                          >
                            Draft
                          </NavLink>
                        </NavItem>
                        
                      </Nav>
                      <Link to="/teams-add-blogs">
                        <Button>Add Blogs</Button>
                      </Link>
                    </div>
                    <div className="col-auto">
                      <div id="selection-element">
                        <div className="my-n1 d-flex align-items-center text-muted">
                          Select
                          <div
                            id="select-content"
                            className="text-body fw-semibold px-1"
                          >
                            {dele}
                          </div>
                          Result
                          <button
                            type="button"
                            className="btn btn-link link-danger p-0 ms-3"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="d-flex justify-content-start gap-2">
                    <div className="search-box me-2 col-sm-10">
                      <Input type="text" className="form-control" placeholder="Search for Blogs..." value={searchKeyword} onChange={handleSearchInputChange} />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>

                <div className="card-body pt-0 ">
                  {blogData && blogData?.length > 0 ? (
                    <TableContainer
                      columns={columns}
                      data={blogData || []}
                      // isGlobalFilter={true}
                      isAddUserList={false}
                      totalPages={blogData?.totalPages}
                      onChangeFunction={(page) => {
                        fetchData(page);
                      }}
                      customPageSize={10}
                      divClass="table-responsive mb-1"
                      tableClass="mb-0 align-middle table-borderless"
                      theadClass="table-light text-muted"
                      isCoursesFilter={true}
                    />
                  ) : (
                    <div className="py-4 text-center">
                      <div>
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#405189,secondary:#0ab39c"
                          style={{ width: "72px", height: "72px" }}
                        ></lord-icon>
                      </div>

                      <div className="mt-4">
                        <h5>Sorry! No Result Found</h5>
                      </div>
                    </div>
                  )}
                </div>
                {/* <UploadCSV id="courses" /> */}
                {/* <div className="card-body">
                  <TabContent className="text-muted">
                    <TabPane>
                      <div
                        id="table-course-list-all"
                        className="table-card gridjs-border-none pb-2"
                      >

                      </div>
                    </TabPane>
                  </TabContent>
                </div> */}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default GetBlogs;