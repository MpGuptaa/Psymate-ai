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
  Label,
} from "reactstrap";
import classnames from "classnames";

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import DeleteModal from "../../../Components/Common/DeleteModal";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { Price } from "./EcommerceSaltCol";
//Import data

//Import actions
import { getSalts as onGetSalts, deleteSalts } from "../../../store/ecommerce/action";
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

const SingleOptions = [
  { value: "Watches", label: "Watches" },
  { value: "Headset", label: "Headset" },
  { value: "Sweatshirt", label: "Sweatshirt" },
  { value: "20% off", label: "20% off" },
  { value: "4 star", label: "4 star" },
];

const EcommerceSalts = (props) => {
  const dispatch = useDispatch();

  const { salts } = useSelector((state) => ({
    salts: state.Ecommerce.salts,
  }));

  const [patient, setPatient] = useState([]);
  const [saltList, setSaltList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedMulti, setselectedMulti] = useState(null);
  const [salt, setSalt] = useState(null);

  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }
  const history = useNavigate();

  useEffect(() => {
    if (salts && !salts?.data?.length) {
      dispatch(onGetSalts(1));
    }
  }, [dispatch]);

  useEffect(() => {
    setSaltList(salts?.data);
  }, [salts]);

  useEffect(() => {
    if (!isEmpty(salts)) setSaltList(salts?.data);
  }, [salts]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredSalts = salts?.data;
      if (type !== "all") {
        filteredSalts = salts?.data.filter((salt) => salt.status === type);
      }
      setSaltList(filteredSalts);
    }
  };

  const onUpdate = (value) => {};

  const [cate, setCate] = useState("all");

  const categories = (category) => {
    let filteredSalts = salts?.data;
    if (category !== "all") {
      filteredSalts = salts?.data.filter((salt) => salt.category === category);
    }
    setSaltList(filteredSalts);
    setCate(category);
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const onClickDelete = (salt) => {
    setSalt(salt);
    setDeleteModal(true);
  };

  const handleDeleteSalt = () => {
    if (salt) {
      dispatch(deleteSalts(salt._id));
      setDeleteModal(false);
      dispatch(onGetSalts(1));
    }
  };

  // Displat Delete Button
  const [dele, setDele] = useState(0);
  const displayDelete = () => {
    const ele = document.querySelectorAll(".saltCheckBox:checked");
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
    const ele = document.querySelectorAll(".saltCheckBox:checked");
    const del = document.getElementById("selection-element");
    ele.forEach((element) => {
      dispatch(deleteSalts(element.value));
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
              className="saltCheckBox form-check-input"
              value={cell.row.original._id}
              onClick={() => displayDelete()}
            />
          );
        },
      },
      {
        Header: "Salt",
        Cell: (salt) => {
          return (
            <>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar-sm bg-light rounded p-1">
                    <img src={salt.row.original.photoURL} alt="" className="img-fluid d-block" />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-14 mb-1">
                    <Link to={`/apps-ecommerce-salt-details?id=${salt.row.original._id}`} className="text-dark">
                      {salt.row.original.displayName}
                    </Link>
                  </h5>
                </div>
              </div>
            </>
          );
        },
      },

      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm" tag="button">
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem href={`/apps-ecommerce-salt-details?id=${cellProps.row.original._id}`}>
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                  View
                </DropdownItem>

                <DropdownItem href={`/apps-ecommerce-add-salt?id=${cellProps.row.original._id}`}>
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  Edit
                </DropdownItem>

                <DropdownItem
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
                      },
                    );
                  }}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  Add To Cart
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const saltData = cellProps.row.original;
                    onClickDelete(saltData);
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
    [],
  );
  document.title = "Salts | Psymate - Management Portal";

  return (
    <div className="page-content">
      <ToastContainer closeButton={false} limit={1} />
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteSalt} onCloseClick={() => setDeleteModal(false)} />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <Container fluid>
        <BreadCrumb title="Salts" pageTitle="Ecommerce" />
        <Row>
          <div className="">
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center border-0">
                    <div className="col">
                      <Nav className="nav-tabs-custom card-header-tabs border-bottom-0" role="tablist">
                        <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === "1" }, "fw-semibold")}
                            onClick={() => {
                              dispatch(onGetSalts());
                            }}
                            href="#"
                          >
                            Refresh
                            {/* <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                              12
                            </span> */}
                          </NavLink>
                        </NavItem>
                        {/* <NavItem>
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
                        </NavItem> */}
                      </Nav>
                    </div>
                    <div className="col-auto">
                      <div id="selection-element">
                        <div className="my-n1 d-flex align-items-center text-muted">
                          Select
                          <div id="select-content" className="text-body fw-semibold px-1">
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
                <div className="card-body pt-0">
                  {saltList && saltList?.length > 0 ? (
                    <TableContainer
                      columns={columns}
                      data={saltList || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      totalPages={salts?.totalPages}
                      onChangeFunction={(pay) => dispatch(onGetSalts(pay))}
                      customPageSize={10}
                      divClass="table-responsive mb-1"
                      tableClass="mb-0 align-middle table-borderless"
                      theadClass="table-light text-muted"
                      isSaltsFilter={true}
                      SearchPlaceholder="Search for Salts..."
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
                <UploadCSV id="salts" />
                {/* <div className="card-body">
                  <TabContent className="text-muted">
                    <TabPane>
                      <div
                        id="table-salt-list-all"
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

export default EcommerceSalts;
