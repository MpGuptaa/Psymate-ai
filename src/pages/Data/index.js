import React, { useEffect, useState, useMemo } from "react";
import AsyncSelect from "react-select/async";

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Row,
  Col,
  Label,
  Card,
  CardHeader,
} from "reactstrap";

// RangeSlider
import "nouislider/distribute/nouislider.css";
import DeleteModal from "../../Components/Common/DeleteModal";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { Price } from "./DataCol";
//Import data

//Import actions
import { getDatas as onGetDatas, deleteDatas } from "../../store/admin/action";
import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useProfile } from "../../Components/Hooks/UserHooks";
import axios from "axios";
import config from "../../config";
import UploadCSV from "../../helpers/UploadCSV";
import ConfirmationDialogBox from "../../Components/Common/ConfirmationDialogBox";

const Datas = (props) => {
  const dispatch = useDispatch();

  const { datas } = useSelector((state) => ({
    datas: state.Admin.datas,
  }));
  const { userProfile } = useProfile();
  const [patient, setPatient] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [assess, setassess] = useState(false);
  const [data, setData] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collectionName = queryParams.get("collectionName");
  const collection = queryParams.get("collection");

  useEffect(() => {
    dispatch(onGetDatas(collectionName, 1, "", ""));
  }, [collection]);

  useEffect(() => {
    setDataList(datas?.data || []);
  }, [datas, collection]);

  useEffect(() => {
    if (!isEmpty(datas)) setDataList(datas?.data || []);
  }, [datas, collection]);

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const onClickDelete = (data) => {
    setData(data);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (data) {
      dispatch(deleteDatas(collectionName, data._id, "_id&exact=true"));
      dispatch(onGetDatas(collectionName, 1, "", ""));
      setDeleteModal(false);
    }
  };

  // Displat Delete Button
  const [dele, setDele] = useState(0);
  const displayDelete = () => {
    const ele = document.querySelectorAll(".dataCheckBox:checked");
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
    const ele = document.querySelectorAll(".dataCheckBox:checked");
    const del = document.getElementById("selection-element");
    ele.forEach((element) => {
      console.log(element.value);
      dispatch(deleteDatas(collectionName, `?searchBy=_id&search=${data._id}&exact=true`));
      // setTimeout(() => {
      //   toast.clearWaitingQueue();
      // }, 3000);
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
              className="dataCheckBox form-check-input"
              value={cell.row.original._id}
              onClick={() => displayDelete()}
            />
          );
        },
      },
      {
        Header: "Data",
        Cell: (data) => {
          return (
            <>
              <div className="d-flex align-items-center">
                {data.row.original.photoURL && (
                  <div className="flex-shrink-0 me-3">
                    <div className="avatar-sm bg-light rounded p-1">
                      <img src={data.row.original.photoURL} alt="" className="img-fluid d-block" />
                    </div>
                  </div>
                )}
                <div className="flex-grow-1">
                  <h5 className="fs-14 mb-1">
                    <Link to={`/apps-lab-data-details?id=${data.row.original._id}`} className="text-dark">
                      {data.row.original.displayName}
                    </Link>
                  </h5>
                  <p className="text-muted mb-0">
                    <span className="fw-medium">
                      {new Date(data.row.original.createdAt).toLocaleTimeString()}{" "}
                      {new Date(data.row.original.createdAt).toDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </>
          );
        },
      },
      // {
      //   Header: "Price",
      //   accessor: "sellingRate",
      //   filterable: false,
      //   Cell: (cellProps) => {
      //     return <Price {...cellProps} />;
      //   },
      // },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm" tag="button">
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  href={`/data/add?collection=${collection}&collectionName=${collectionName}&id=${cellProps.row.original._id}`}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  Edit
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const dataData = cellProps.row.original;
                    onClickDelete(dataData);
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
  document.title = `${collectionName?.toUpperCase()} | Psymate - Management Portal`;

  return (
    <div className="page-content">
      <ToastContainer closeButton={false} limit={1} />
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteOrder} onCloseClick={() => setDeleteModal(false)} />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <ConfirmationDialogBox
        show={assess.state}
        messages={
          <div className="d-flex flex-column text-left">
            <p>You will be redirected to a secure window to take the test</p>
            <div className="d-flex flex-row">
              <div className="form-check ms-4 form-radio-danger mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type"
                  value="one"
                  onChange={(e) => {
                    setassess({ ...assess, type: e.target.value });
                  }}
                />
                <label className="form-check-label">One</label>
              </div>
              <div className="form-check ms-4 form-radio-danger mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type"
                  value="data"
                  onChange={(e) => {
                    setassess({ ...assess, type: e.target.value });
                  }}
                />
                <label className="form-check-label">Multiple</label>
              </div>
            </div>
          </div>
        }
        onSubmit={() => {
          if (patient._id) {
            const url = `/take-data?data=${assess.id}&patient=${patient._id}&doctor=${userProfile._id}&layout=${
              assess.type || "data"
            }&token=${axios.defaults.headers.common.Authorization}`;
            window.open(url, "_blank");
            setassess({ state: false });
          } else {
            toast.error("Patient Not Selected");
          }
        }}
        onCloseClick={() => setassess({ state: false })}
      />

      <Container fluid>
        <BreadCrumb title={collectionName} pageTitle="Lab" />
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
                    config.api.API_URL + `/users?search=${inputValue}&type=patient&searchBy=displayName`,
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
                    <Link
                      to={"/apps-add?collection=6551bd25b952759b64d1caec"}
                      onClick={() => dispatch(onGetDatas(1, "", ""))}
                      className="text-decoration-underline"
                    >
                      Add Datas
                    </Link>
                  </div>
                </div>
              </CardHeader>

              <div className="accordion accordion-flush">
                <div className="card-body border-bottom">
                  <div>
                    <p className="text-muted text-uppercase fs-12 fw-medium mb-2">Datas</p>
                    <ul className="list-unstyled mb-0 filter-list">
                      {[
                        { label: "Mood", value: "mood" },
                        { label: "Anxiety", value: "anxiety" },
                        { label: "Psychology", value: "psychology" },
                        { label: "Routine", value: "routine" },
                      ].map((fil) => (
                        <li key={fil.value}>
                          <Link
                            to="#"
                            className={
                              categories === fil.value
                                ? "active d-flex py-1 align-items-center"
                                : "d-flex py-1 align-items-center"
                            }
                            onClick={() => setCategory(fil.value)}
                          >
                            <div className="flex-grow-1">
                              <h5 className="fs-13 mb-0 listname">{fil.label}</h5>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </Col> */}

          <div
          //  className="col-xl-9 col-lg-8"
          >
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center border-0">
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
                  <TableContainer
                    columns={columns}
                    data={dataList || []}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    totalPages={datas?.totalPages}
                    onChangeFunction={(pay, search, searchBy) => {
                      dispatch(onGetDatas(collectionName, pay, search, searchBy));
                    }}
                    collectionName={collectionName}
                    collection={collection}
                    add={true}
                    customPageSize={10}
                    divClass="table-responsive mb-1"
                    tableClass="mb-0 align-middle table-borderless"
                    theadClass="table-light text-muted"
                    isDatasFilter={true}
                    SearchPlaceholder={`Search for ${collectionName}...`}
                  />
                </div>
                <UploadCSV id={collectionName} />
                {/* <div className="card-body">
                  <TabContent className="text-muted">
                    <TabPane>
                      <div
                        id="table-data-list-all"
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

export default Datas;
