import React, { useEffect, useState } from "react";
//Import Flatepicker
import Flatpickr from "react-flatpickr";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  CardBody,
  CardHeader,
  Container,
  Card,
  Row,
  Col,
  Input,
  ModalHeader,
  Modal,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { isEmpty } from "lodash";
import Select from "react-select";

//redux

import { useSelector, useDispatch } from "react-redux";

//Import actions
import { getManufacturers as onGetManufacturers } from "../../../store/ecommerce/action";
import ManufacturerChats from "./ManufacturerChats";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { getAllUniqueTagsLowercased } from "../../../helpers/Helper";
import Tools from "../../Forms/Builder/Tools";

const EcommerceManufacturers = () => {
  document.title = "Manufacturers | Psymate - Management Portal";
  const { loading } = useProfile();
  const pathName = useLocation().pathname.split("/")[1];

  const dispatch = useDispatch();
  const [manufacturerList, setManufacturerList] = useState([]);
  const [update, setUpdate] = useState(false);
  const [modal, setModal] = useState(false);
  const [state, setState] = useState({});
  const [companyType, setcompanyType] = useState(null);
  const [forms, setForms] = useState([]);
  const [categories, setCategory] = useState([]);
  const [edit, setEdit] = useState({
    state: false,
    data: {},
  });
  console.log(state);
  const { manufacturers } = useSelector((state) => ({
    manufacturers: state.Ecommerce.manufacturers,
  }));

  useEffect(() => {
    setState({ ...edit.data });
  }, [edit.state]);

  useEffect(() => {
    setManufacturerList(manufacturers);
  }, [manufacturers]);

  useEffect(() => {
    getData();
  }, [dispatch, loading, update]);

  useEffect(() => {
    if (!isEmpty(manufacturers)) setManufacturerList(manufacturers);
  }, [manufacturers]);

  const toggle = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };

  //Tab
  const [activeTab, setActiveTab] = useState(0);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const companytypes = [
    {
      options: [
        { label: "Select type", value: "Select type" },
        { label: "All", value: "All" },
        { label: "Merchandising", value: "Merchandising" },
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Partnership", value: "Partnership" },
        { label: "Corporation", value: "Corporation" },
      ],
    },
  ];

  function handlecompanyType(companyType) {
    setcompanyType(companyType);
  }

  const category = (e) => {
    if (e === "All") {
      var filter = manufacturers.filter((item) => item.category !== e);
    } else {
      filter = manufacturers.filter((item) => item.category === e);
    }
    setManufacturerList(filter);
  };
  const getData = async () => {
    await axios.get(`/data/${pathName}`).then((res) => {
      setManufacturerList(res.data);
    });
  };
  const getForms = async () => {
    await axios
      .get(`/api/tools?search=${pathName}&searchBy=displayName`)
      .then((res) => {
        setForms(res.data[0]);
        setCategory(getAllUniqueTagsLowercased(res.data[0].items));
      });
  };
  useEffect(() => {
    getForms();
  }, [loading]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={pathName} pageTitle="Ecommerce" />
          <Card>
            <CardHeader className="border-0 rounded">
              <Row className="g-2">
                <Col xl={3}>
                  <div className="search-box">
                    <Input
                      type="text"
                      onChange={(e) => {
                        axios
                          .get(
                            `/data/${pathName}?search=${e.target.value}&searchBy=displayName`
                          )
                          .then((res) => {
                            setManufacturerList(res.data);
                          })
                          .catch((err) => {
                            toast.error(err.message || err);
                            console.log(err);
                          });
                      }}
                      className="form-control search"
                      placeholder={`Search for ${pathName} & owner name or something...`}
                    />{" "}
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <Col xl={2} className="ms-auto">
                  <div>
                    <select
                      className="form-control"
                      onChange={(e) => category(e.target.value)}
                    >
                      <option value="All">Select Categories</option>
                      <option value="All">All</option>
                      <option value="Retailer">Retailer</option>
                      <option value="Health & Medicine">
                        Health & Medicine
                      </option>
                      <option value={pathName}>{pathName}</option>
                      <option value="Food Service">Food Service</option>
                      <option value="Computers & Electronics">
                        Computers & Electronics
                      </option>
                    </select>
                  </div>
                </Col>
                <div className="col-lg-auto">
                  <div className="hstack gap-2">
                    <button type="button" className="btn btn-danger">
                      <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "}
                      Filters
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setModal(true);
                      }}
                    >
                      <i className="ri-add-fill me-1 align-bottom"></i> Add{" "}
                      {pathName}
                    </button>
                  </div>
                </div>
              </Row>
            </CardHeader>
          </Card>

          <Row className="mt-4">
            {manufacturerList.map((manufacturer, key) => (
              <React.Fragment key={key}>
                <Col xl={3} lg={6}>
                  <Card className="ribbon-box right overflow-hidden">
                    <CardBody className="text-center p-4">
                      {manufacturer.isTrending && (
                        <div className="ribbon ribbon-info ribbon-shape trending-ribbon">
                          <i className="ri-flashlight-fill text-white align-bottom"></i>{" "}
                          <span className="trending-ribbon-text">Trending</span>
                        </div>
                      )}
                      <img
                        src={
                          manufacturer.logo ||
                          "https://ik.imagekit.io/jybala7h3/employer__hupMUjUa.png?updatedAt=1692180389078"
                        }
                        className="w-50"
                        alt=""
                      />
                      {/* <h5 className="mb-1 mt-4">
                        <Link
                          to="apps-ecommerce-manufacturer-details"
                          className="link-primary"
                        >
                          {manufacturer.phone}
                        </Link>
                      </h5> */}
                      <p className="text-muted mb-4">
                        {manufacturer.displayName}
                      </p>

                      <Row className="mt-4">
                        {/* <Col lg={6} className="border-end-dashed border-end">
                          <h5>{manufacturer.email}</h5>
                          <span className="text-muted"> Email</span>
                        </Col> */}
                        <Col>
                          <h5>{manufacturer.phone}</h5>
                          <span className="text-muted">Phone</span>
                        </Col>
                      </Row>
                      <div className="mt-4 d-flex">
                        <Link
                          to="apps-ecommerce-manufacturer-details"
                          className="btn btn-light w-100"
                        >
                          View Details
                        </Link>
                        <div
                          onClick={() => {
                            toggle();
                            setEdit({
                              state: true,
                              data: manufacturer,
                            });
                          }}
                          className="btn btn-light w-100"
                        >
                          Edit
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </React.Fragment>
            ))}
          </Row>

          <Row className="g-0 text-center text-sm-start align-items-center mb-3">
            <Col sm={6}>
              <div>
                <p className="mb-sm-0">Showing 1 to 8 of 12 entries</p>
              </div>
            </Col>
            <Col sm={6}>
              <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                <li className="page-item disabled">
                  {" "}
                  <Link to="#" className="page-link">
                    <i className="mdi mdi-chevron-left"></i>
                  </Link>{" "}
                </li>
                <li className="page-item active">
                  {" "}
                  <Link to="#" className="page-link">
                    1
                  </Link>{" "}
                </li>
                <li className="page-item ">
                  {" "}
                  <Link to="#" className="page-link">
                    2
                  </Link>{" "}
                </li>
                <li className="page-item">
                  {" "}
                  <Link to="#" className="page-link">
                    3
                  </Link>{" "}
                </li>
                <li className="page-item">
                  {" "}
                  <Link to="#" className="page-link">
                    4
                  </Link>{" "}
                </li>
                <li className="page-item">
                  {" "}
                  <Link to="#" className="page-link">
                    5
                  </Link>{" "}
                </li>
                <li className="page-item">
                  {" "}
                  <Link to="#" className="page-link">
                    <i className="mdi mdi-chevron-right"></i>
                  </Link>{" "}
                </li>
              </ul>
            </Col>
          </Row>

          <Modal
            className="zoomIn"
            id={`add${pathName}`}
            size="lg"
            isOpen={modal}
            toggle={toggle}
            centered
          >
            <ModalHeader toggle={toggle}>Add {pathName}</ModalHeader>
            <div className="modal-content border-0 mt-3">
              <Nav className="nav-tabs nav-tabs-custom nav-success p-2 pb-0 bg-light">
                {categories?.map((category, index) => (
                  <NavItem key={category}>
                    <NavLink
                      href="#"
                      className={`${classnames({
                        active: activeTab === index.toString(),
                      })} text-capitalize`}
                      onClick={() => {
                        toggleTab(index);
                      }}
                    >
                      {category}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </div>
            <ModalBody>
              <form name={pathName}>
                <TabContent activeTab={activeTab}>
                  {categories?.map((category, index) => (
                    <TabPane key={index} tabId={index}>
                      <Row>
                        {forms?.items &&
                          forms?.items
                            ?.filter((item) => {
                              return (
                                item?.tag?.toLowerCase() ===
                                category?.toLowerCase()
                              );
                            })
                            ?.map((ele) => (
                              <Tools
                                key={ele?.displayName}
                                setState={setState}
                                state={state}
                                inputs={[ele]}
                              />
                            ))}
                      </Row>
                    </TabPane>
                  ))}
                  <div className="hstack gap-2 mt-4 justify-content-between">
                    <button
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        axios
                          .delete(
                            `/data/${pathName}?find=${edit.data._id}&findBy=_id`
                          )
                          .then((res) => {
                            toggle();
                            setUpdate(!update);
                            toast.success(`${pathName} Deleted`);
                          });
                      }}
                      type="button"
                    >
                      Delete
                    </button>
                    <div className="gap-2 hstack">
                      <button
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                        onClick={toggle}
                        type="button"
                      >
                        <i className="ri-close-line me-1 align-middle"></i>{" "}
                        Close
                      </button>
                      {activeTab === categories.length - 1 ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            console.log(state);
                            if (!state) {
                              toast.error(
                                "Please fill all the fields marked with *"
                              );
                              return;
                            }
                            if (edit.state) {
                              axios
                                .put(
                                  `/data/${pathName}?find=${edit.data._id}&findBy=_id`,
                                  state
                                )
                                .then((res) => {
                                  toggle();
                                  setUpdate(!update);
                                  toast.success(`${pathName} Updated`);
                                  window.location.reload();
                                });
                            } else {
                              axios
                                .post(`/data/manufacturers`, {
                                  data: state,
                                })
                                .then((res) => {
                                  toggle();
                                  setUpdate(!update);
                                  toast.success(`${pathName} created`);
                                  window.location.reload();
                                });
                            }
                          }}
                          className="btn btn-primary"
                        >
                          <i className="ri-save-3-line align-bottom me-1"></i>{" "}
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          data-bs-dismiss="modal"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(activeTab + 1);
                          }}
                          type="button"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </TabContent>
              </form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceManufacturers;
