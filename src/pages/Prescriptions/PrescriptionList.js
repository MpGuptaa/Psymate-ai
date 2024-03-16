import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import * as moment from "moment";
import CountUp from "react-countup";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import AsyncSelect from "react-select/async";

//Import Icons
import FeatherIcon from "feather-icons-react";

import { prescriptionWidgets } from "../../common/data/invoiceList";
//Import actions
import {
  getPrescriptions as onGetPrescriptions,
  deletePrescription as onDeletePrescription,
} from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { useProfile } from "../../Components/Hooks/UserHooks";
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import config from "../../config";

const PrescriptionList = () => {
  document.title = "Prescription List";

  const dispatch = useDispatch();

  const { prescriptions, isPrescriptionSuccess, error } = useSelector(
    (state) => ({
      prescriptions: state.Prescription.prescriptions,
      isPrescriptionSuccess: state.Prescription.isPrescriptionSuccess,
      error: state.Prescription.error,
    })
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [order, setOrder] = useState([]);
  //delete prescription
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [prescription, setPrescription] = useState(null);

  const getOrder = async (id) => {
    await axios.get(config.api.API_URL + `/orders?id=${id}`).then((res) => {
      setPrescription(res.data);
    });
  };

  const { loading } = useProfile();

  useEffect(() => {
    if (prescriptions && !prescriptions?.length) {
      dispatch(onGetPrescriptions());
    }
  }, [dispatch, prescriptions, loading]);

  useEffect(() => {
    setPrescription(prescriptions);
  }, [prescriptions]);

  // Delete Data
  const onClickDelete = (prescription) => {
    setPrescription(prescription);
    setDeleteModal(true);
  };

  const handleDeletePrescription = () => {
    if (prescription) {
      dispatch(onDeletePrescription(prescription?._id));
      setDeleteModal(false);
    }
  };

  const allstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Unpaid", value: "Unpaid" },
        { label: "Paid", value: "Paid" },
        { label: "Cancel", value: "Cancel" },
        { label: "Refund", value: "Refund" },
      ],
    },
  ];

  const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  const handleValidTime = (time) => {
    const time1 = new Date(time);
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
      meridiem = "PM";
    } else {
      meridiem = "AM";
    }
    const updateTime =
      moment(getTime, "hh:mm").format("hh:mm") + " " + meridiem;
    return updateTime;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".prescriptionCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeletePrescription(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".prescriptionCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Prescription Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="prescriptionCheckBox form-check-input"
              value={cellProps.row.original._id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "ID",
        accessor: "number",
        filterable: false,
        Cell: (cell) => {
          return (
            <Link
              to={`/apps-prescriptions-details?id=${cell.value}`}
              className="fw-medium link-primary"
            >
              {cell.value}
            </Link>
          );
        },
      },
      {
        Header: "Customer",
        Cell: (prescription) => {
          console.log(prescription);
          return (
            <>
              <div className="d-flex align-items-center">
                {prescription.cell.row.original.user.displayName}
              </div>
            </>
          );
        },
      },

      {
        Header: "DATE",
        Cell: (prescription) => (
          <>
            {handleValidDate(prescription.row.original.date)},{" "}
            <small className="text-muted">
              {handleValidTime(prescription.row.original.date)}
            </small>
          </>
        ),
      },
      {
        Header: "AMOUNT",
        accessor: "amount",
        filterable: false,
        Cell: (prescription) => (
          <>
            <small className="text-muted">
              Rs. {prescription.row.original.amtPaid}
            </small>
          </>
        ),
      },
      {
        Header: "PAYMENT STATUS",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "Paid":
              return (
                <span className="badge text-uppercase badge-soft-success">
                  {" "}
                  {cell.value}{" "}
                </span>
              );
            case "Unpaid":
              return (
                <span className="badge text-uppercase badge-soft-success">
                  {" "}
                  {cell.value}{" "}
                </span>
              );
            case "Cancel":
              return (
                <span className="badge text-uppercase badge-soft-danger">
                  {" "}
                  {cell.value}{" "}
                </span>
              );
            default:
              return (
                <span className="badge text-uppercase badge-soft-info">
                  {" "}
                  {cell.value}{" "}
                </span>
              );
          }
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle
                href="#"
                className="btn btn-soft-secondary btn-sm dropdown"
                tag="button"
              >
                <i className="ri-more-fill align-middle"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem href="/apps-prescriptions-details">
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                  View
                </DropdownItem>

                <DropdownItem href="/apps-prescriptions-create">
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                  Edit
                </DropdownItem>

                <DropdownItem href="/#">
                  <i className="ri-download-2-line align-bottom me-2 text-muted"></i>{" "}
                  Download
                </DropdownItem>

                <DropdownItem divider />

                <DropdownItem
                  href="#"
                  onClick={() => {
                    const prescriptionData = cellProps.row.original;
                    onClickDelete(prescriptionData);
                  }}
                >
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    [checkedAll]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => handleDeletePrescription()}
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
          <BreadCrumb title="Prescription List" pageTitle="Prescriptions" />
          <Row>
            {prescriptionWidgets.map((prescriptionwidget, key) => (
              <React.Fragment key={key}>
                <Col xl={3} md={6}>
                  <Card className="card-animate">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-uppercase fw-medium text-muted mb-0">
                            {prescriptionwidget.label}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <h5
                            className={
                              "fs-14 mb-0 text-" +
                              prescriptionwidget.percentageClass
                            }
                          >
                            <i className="ri-arrow-right-up-line fs-13 align-middle"></i>{" "}
                            {prescriptionwidget.percentage}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            <CountUp
                              start={0}
                              prefix={prescriptionwidget.prefix || ""}
                              suffix={prescriptionwidget.suffix}
                              decimals="2"
                              end={prescriptionwidget.counter}
                              duration={4}
                              className="counter-value"
                            />
                          </h4>
                          <span className="badge bg-warning me-1">
                            {prescriptionwidget.badge}
                          </span>{" "}
                          <span className="text-muted">
                            {" "}
                            {prescriptionwidget.caption}
                          </span>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title bg-light rounded fs-3">
                            <FeatherIcon
                              icon={prescriptionwidget.feaIcon}
                              className="text-success icon-dual-success"
                            />
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </React.Fragment>
            ))}
          </Row>

          <Row>
            <Col xs={12}>
              <div className="mb-3">
                <Label className="form-label">Search For Patients</Label>
                <AsyncSelect
                  className="mb-0"
                  value={{
                    value: selectedOption,
                    label: selectedOption?.displayName,
                  }}
                  placeholder="Search For Patients"
                  onChange={(e) => {
                    setSelectedOption(e.value);
                    getOrder(e.value._id);
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
            </Col>
            <Col lg={12}>
              <Card id="prescriptionList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">
                      Prescriptions
                    </h5>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        <Link
                          to={"/apps-prescriptions-create"}
                          className="btn btn-secondary me-1"
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          Create Prescription
                        </Link>
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-danger"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {isPrescriptionSuccess && prescription?.length ? (
                      <TableContainer
                        columns={columns}
                        data={prescription || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        theadClass="text-muted text-uppercase"
                        isPrescriptionListFilter={true}
                        SearchPlaceholder="Search for customer, email, country, status or something..."
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PrescriptionList;
