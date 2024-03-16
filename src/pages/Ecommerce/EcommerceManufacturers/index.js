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
  Label,
  Form,
} from "reactstrap";
import classnames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { isEmpty } from "lodash";
import Select from "react-select";

//redux

import { useSelector, useDispatch } from "react-redux";

//Import actions
import ManufacturerChats from "./ManufacturerChats";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { getAllUniqueTagsLowercased } from "../../../helpers/Helper";
import FormLayout from "../../../helpers/FormLayout";

const ManageCollections = () => {
  const { loading } = useProfile();
  const pathName = useLocation().pathname.split("/")[1];
  document.title = `${pathName.toUpperCase()} | Psymate - Management Portal`;

  const dispatch = useDispatch();
  const [dataList, setDataList] = useState([]);
  const [update, setUpdate] = useState(false);
  const [modal, setModal] = useState(false);
  const [state, setState] = useState({});
  const [companyType, setcompanyType] = useState(null);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const [forms, setForms] = useState([]);
  const [categories, setCategory] = useState([]);
  const [edit, setEdit] = useState({
    state: false,
    data: {},
  });

  const { manufacturers } = useSelector((state) => ({
    manufacturers: state.Ecommerce.manufacturers,
  }));
  useEffect(() => {
    setState({ ...edit.data });
  }, [edit.state]);

  useEffect(() => {
    setDataList(manufacturers);
  }, [manufacturers]);

  useEffect(() => {
    getData(0, 1);
  }, [dispatch, loading, update]);

  useEffect(() => {
    if (!isEmpty(manufacturers)) setDataList(manufacturers);
  }, [manufacturers]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setEdit({ state: false, data: {} });
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
    setDataList(filter);
  };
  const getData = async (limit, page) => {
    await axios
      .get(`/data/${pathName}?limit=${limit}&page=${page}`)
      .then((res) => {
        setDataList(res.data);
        setPages(
          Array.from({ length: res.totalPages }, (_, index) => index * 2)
        );
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
                            setDataList(res.data);
                          })
                          .catch((err) => {
                            toast.error(err.message || err);
                          });
                      }}
                      className="form-control search"
                      placeholder={`Search for ${pathName} & owner name or something...`}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <div className="col-lg-auto">
                  <div className="hstack gap-2">
                    <button type="button" className="btn btn-danger">
                      <i className="ri-equalizer-fill me-1 align-bottom"></i>
                      Filters
                    </button>
                    <button
                      className="btn btn-success text-capitalize"
                      onClick={() => {
                        setEdit({ state: false, data: {} });
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
            {dataList.map((manufacturer, key) => {
              return (
                <React.Fragment key={manufacturer?._id}>
                  <Col xl={3} lg={6}>
                    <Card className="ribbon-box right overflow-hidden">
                      <CardBody className="text-center p-4">
                        {manufacturer?.isTrending && (
                          <div className="ribbon ribbon-info ribbon-shape trending-ribbon">
                            <i className="ri-flashlight-fill text-white align-bottom"></i>
                            <span className="trending-ribbon-text">
                              Trending
                            </span>
                          </div>
                        )}
                        <div className="d-flex mx-auto justify-center align-items-center">
                          <img
                            src={
                              manufacturer?.logo ||
                              manufacturer?.thumbnail ||
                              manufacturer?.photoURL ||
                              manufacturer?.imageURL ||
                              "https://ik.imagekit.io/Yash/Thewebvale/Console/vecteezy_document-file-not-found-search-no-result-concept_9007126_VN0rj24o-.jpg?updatedAt=1696518480881"
                            }
                            alt=""
                            className="mx-auto w-50"
                          />
                        </div>

                        {/* <h5 className="mb-1 mt-4">
                          <Link
                            to="apps-ecommerce-manufacturer-details"
                            className="link-primary"
                          >
                            {manufacturer?.phone}
                          </Link>
                        </h5> */}

                        <Row className="mt-4">
                          <Col>
                            <h5 className="text-capitalize">
                              {manufacturer?.displayName ||
                                manufacturer?.drugName ||
                                manufacturer?.head ||
                                manufacturer?.establishmentName}
                            </h5>
                            {manufacturer?.spectrum}
                          </Col>
                        </Row>
                        <div className="mt-4 d-flex">
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
              );
            })}
          </Row>

          <Row className="g-0 text-center text-sm-start align-items-center mb-3">
            <Col sm={6}>
              <div>
                <p className="mb-sm-0">Showing 1 to 8 of 12 entries</p>
              </div>
            </Col>
            <Col sm={6}>
              <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0 d-flex flex-wrap">
                <li
                  onClick={() => {
                    if (page >= 1) {
                      getData(10, page - 1);
                      setPage(page - 1);
                    }
                  }}
                  className="page-item"
                >
                  <Link to="#" className="page-link">
                    <i className="mdi mdi-chevron-left"></i>
                  </Link>
                </li>
                <li
                  onClick={() => {
                    getData(10, page - 1);
                    setPage(page - 1);
                  }}
                  className="page-item active"
                >
                  <Link to="#" className="page-link">
                    {page - 1}
                  </Link>
                </li>
                <li
                  onClick={() => {
                    getData(10, page);
                    setPage(2);
                  }}
                  className="page-item active"
                >
                  <Link to="#" className="page-link">
                    {page}
                  </Link>
                </li>
                <li
                  onClick={() => {
                    getData(10, page);
                    setPage(1);
                  }}
                  className="page-item active"
                >
                  <Link to="#" className="page-link">
                    ...
                  </Link>
                </li>
                <li
                  onClick={() => {
                    getData(10, pages.length);
                    setPage(pages.length);
                  }}
                  className="page-item active"
                >
                  <Link to="#" className="page-link">
                    {pages.length}
                  </Link>
                </li>
                <li
                  onClick={() => {
                    getData(10, page + 1);
                    setPage(page + 1);
                  }}
                  className="page-item"
                >
                  <Link to="#" className="page-link">
                    <i className="mdi mdi-chevron-right"></i>
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>

          <Modal
            className="zoomIn"
            id={`add${pathName}`}
            size="xl"
            isOpen={modal}
            toggle={toggle}
            centered
          >
            <ModalBody>
              <form name={pathName}>
                <FormLayout
                  formName={pathName}
                  search={"displayName"}
                  heading={`Manage ${pathName}`}
                  setState={setState}
                  state={state}
                />
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
                      <i className="ri-close-line me-1 align-middle"></i>
                      Close
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
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
                          axios.post(`/data/${pathName}`, state).then((res) => {
                            toggle();
                            setUpdate(!update);
                            toast.success(`${pathName} created`);
                            window.location.reload();
                          });
                        }
                      }}
                      className="btn btn-primary"
                    >
                      <i className="ri-save-3-line align-bottom me-1"></i>
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ManageCollections;
