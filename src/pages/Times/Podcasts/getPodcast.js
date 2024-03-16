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
  Input,
  Card,
  CardHeader,
  Col,
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
import { deletePodcast, getPodcast } from "../apiTimes";

const SingleOptions = [
  { value: "Watches", label: "Watches" },
  { value: "Headset", label: "Headset" },
  { value: "Sweatshirt", label: "Sweatshirt" },
  { value: "20% off", label: "20% off" },
  { value: "4 star", label: "4 star" },
];

const GetPodcast = (props) => {
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
  const handleSearchInputChange = (e) => {
    const keyword = e.target.value.trim();
    setSearchKeyword(keyword);
  };
  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [podCastData, setPodCastData] = useState([]);
  async function fetchData(page) {
    try {
      const podcastData = await getPodcast(page, searchKeyword);
      // console.log("Podcast Data:", podcastData);
      // Do something with the podcast data
      setPodCastData(podcastData);
    } catch (error) {
      console.error("Error fetching podcast:", error.message);
      // Handle the error appropriately
    }
  }

  useEffect(() => {


    fetchData(1);
  }, [searchKeyword]);

  const onClickDelete = async(course) => {
     setCourse(course);
    // setDeleteModal(true);
    await deletePodcast(course._id);
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
        Header: "Podcast",
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
                      to={`/teams-add-podcast?id=${course.row.original._id}`}
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
                  href={`/teams-add-podcast?id=${cellProps.row.original._id}`}
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
        <BreadCrumb title="Podcast" pageTitle="Outreach" />
        {/* <Col xs={4}>
          <div className="mb-3">
            <Label className="form-label">Search For Patients</Label>
            <AsyncSelect
              className="mb-0"
              value={{
                value: patient,
                label: patient?.displayName,
              }}
              placeholder="Search For Patients"
              onChange={(e) => {
                setPatient(e.value);
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
          </div>
        </Col> */}
        <Row>
          {/* <Col xl={3} lg={4}>
            <Card>
              <CardHeader>
                <div className="d-flex mb-3">
                  <div className="flex-grow-1">
                    <h5 className="fs-16">Filters</h5>
                  </div>
                  <div className="flex-shrink-0">
                    <Link to="#" className="text-decoration-underline">
                      Clear All
                    </Link>
                  </div>
                </div>

                <div className="filter-choices-input">
                  <Select
                    value={selectedMulti}
                    isMulti={true}
                    onChange={() => {
                      handleMulti();
                    }}
                    options={SingleOptions}
                  />
                </div>
              </CardHeader>

              <div className="accordion accordion-flush">
                <div className="card-body border-bottom">
                  <div>
                    <p className="text-muted text-uppercase fs-12 fw-medium mb-2">
                      Courses
                    </p>
                    <ul className="list-unstyled mb-0 filter-list">
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Kitchen Storage & Containers"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() =>
                            categories("Kitchen Storage & Containers")
                          }
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Grocery</h5>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Clothes"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Clothes")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Fashion</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">5</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Watches"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Watches")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Watches</h5>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "electronics"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("electronics")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Electronics</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">5</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Furniture"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Furniture")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Furniture</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">6</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Bike Accessories"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Bike Accessories")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">
                              Automotive Accessories
                            </h5>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "appliances"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("appliances")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Appliances</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">7</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Bags, Wallets and Luggage"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() =>
                            categories("Bags, Wallets and Luggage")
                          }
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Kids</h5>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card-body border-bottom">
                  <p className="text-muted text-uppercase fs-12 fw-medium mb-4">
                    Price
                  </p>

                  <Nouislider
                    range={{ min: 0, max: 2000 }}
                    start={[0, 2000]}
                    connect
                    data-slider-color="primary"
                    id="course-price-range"
                  />
                  <div className="formCost d-flex gap-2 align-items-center mt-3">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      id="minCost"
                      readOnly
                    />
                    <span className="fw-semibold text-muted">to</span>
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      id="maxCost"
                      readOnly
                    />
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none"
                      type="button"
                      id="flush-headingBrands"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">
                        Brands
                      </span>
                      <span className="badge bg-success rounded-pill align-middle ms-1">
                        2
                      </span>
                    </button>
                  </h2>
                  <UncontrolledCollapse toggler="#flush-headingBrands">
                    <div
                      id="flush-collapseBrands"
                      className="accordion-collapse collapse show"
                      aria-labelledby="flush-headingBrands"
                    >
                      <div className="accordion-body text-body pt-0">
                        <div className="search-box search-box-sm">
                          <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Search Brands..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                        <div className="d-flex flex-column gap-2 mt-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseBrandRadio5"
                              defaultChecked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseBrandRadio5"
                            >
                              Boat
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseBrandRadio4"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseBrandRadio4"
                            >
                              OnePlus
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseBrandRadio3"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseBrandRadio3"
                            >
                              Realme
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseBrandRadio2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseBrandRadio2"
                            >
                              Sony
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseBrandRadio1"
                              defaultChecked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseBrandRadio1"
                            >
                              JBL
                            </label>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                            >
                              1,235 More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none collapsed"
                      type="button"
                      id="flush-headingDiscount"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">
                        Discount
                      </span>
                      <span className="badge bg-success rounded-pill align-middle ms-1">
                        1
                      </span>
                    </button>
                  </h2>
                  <UncontrolledCollapse toggler="#flush-headingDiscount">
                    <div
                      id="flush-collapseDiscount"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body text-body pt-1">
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="coursediscountRadio6"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="coursediscountRadio6"
                            >
                              50% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="coursediscountRadio5"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="coursediscountRadio5"
                            >
                              40% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="coursediscountRadio4"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="coursediscountRadio4"
                            >
                              30% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="coursediscountRadio3"
                              defaultChecked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="coursediscountRadio3"
                            >
                              20% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="coursediscountRadio2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="coursediscountRadio2"
                            >
                              10% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="coursediscountRadio1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="coursediscountRadio1"
                            >
                              Less than 10%
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none collapsed"
                      type="button"
                      id="flush-headingRating"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">
                        Rating
                      </span>
                      <span className="badge bg-success rounded-pill align-middle ms-1">
                        1
                      </span>
                    </button>
                  </h2>

                  <UncontrolledCollapse toggler="#flush-headingRating">
                    <div
                      id="flush-collapseRating"
                      className="accordion-collapse collapse show"
                      aria-labelledby="flush-headingRating"
                    >
                      <div className="accordion-body text-body">
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseratingRadio4"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(4);
                                } else {
                                  onUncheckMark(4);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseratingRadio4"
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              4 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseratingRadio3"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(3);
                                } else {
                                  onUncheckMark(3);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseratingRadio3"
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              3 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseratingRadio2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseratingRadio2"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(2);
                                } else {
                                  onUncheckMark(2);
                                }
                              }}
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              2 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="courseratingRadio1"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(1);
                                } else {
                                  onUncheckMark(1);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="courseratingRadio1"
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              1
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>
              </div>
            </Card>
          </Col> */}

          <div className="col-xl-12 col-lg-8">
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center border-0">
                    <div className="col d-flex justify-content-between">
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
                      <Link to="/teams-add-podcast">
                        <Button>Add Podcasts</Button>
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
                      <Input type="text" className="form-control" placeholder="Search for Podcast..." value={searchKeyword} onChange={handleSearchInputChange} />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0 ">
                  {podCastData && podCastData?.length > 0 ? (
                    <TableContainer
                      columns={columns}
                      data={podCastData || []}
                      // isGlobalFilter={true}
                      isAddUserList={false}
                      totalPages={podCastData?.totalPages}
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

export default GetPodcast;
