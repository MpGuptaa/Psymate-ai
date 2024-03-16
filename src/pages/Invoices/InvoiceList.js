import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader, Label } from "reactstrap";
import { Link } from "react-router-dom";
import * as moment from "moment";
import CountUp from "react-countup";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import AsyncSelect from "react-select/async";

//Import Icons
import FeatherIcon from "feather-icons-react";

import { invoiceWidgets } from "../../common/data/invoiceList";
//Import actions
import { getInvoices as onGetInvoices, deleteInvoice as onDeleteInvoice } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { useProfile } from "../../Components/Hooks/UserHooks";
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import config from "../../config";

const InvoiceList = () => {
  document.title = "Invoice List";

  const dispatch = useDispatch();

  const { invoices, isInvoiceSuccess, error, additional } = useSelector((state) => ({
    invoices: state.Invoice.invoices,
    isInvoiceSuccess: state.Invoice.isInvoiceSuccess,
    error: state.Invoice.error,
    additional: state.Invoice.additional,
  }));
  const [selectedOption, setSelectedOption] = useState(null);
  const [order, setOrder] = useState([]);
  //delete invoice
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const getOrder = async (id) => {
    await axios.get(config.api.API_URL + `/orders?search=${id}&searchBy=_id&exact=true`).then((res) => {
      setInvoice(res.data);
    });
  };
  const { loading } = useProfile();

  useEffect(() => {
    if (invoices && !invoices?.length) {
      dispatch(onGetInvoices());
    }
  }, [dispatch, invoices, loading]);

  useEffect(() => {
    setInvoice(invoices);
  }, [invoices]);

  // Delete Data
  const onClickDelete = (invoice) => {
    setInvoice(invoice);
    setDeleteModal(true);
  };

  const handleDeleteInvoice = () => {
    if (invoice) {
      dispatch(onDeleteInvoice(invoice?._id));
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
    const updateTime = moment(getTime, "hh:mm").format("hh:mm") + " " + meridiem;
    return updateTime;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".invoiceCheckBox");

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
      dispatch(onDeleteInvoice(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".invoiceCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Invoice Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="invoiceCheckBox form-check-input"
              value={cellProps.row.original._id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "ID",
        accessor: "invoiceId",
        filterable: false,
        Cell: (cell) => {
          return (
            <Link to={`/apps-invoices-details?id=${cell.value}`} className="fw-medium link-primary">
              {cell.value}
            </Link>
          );
        },
      },
      {
        Header: "Customer",
        Cell: (invoice) => {
          return (
            <>
              <div className="d-flex align-items-center">{invoice.cell.row.original.user?.displayName}</div>
            </>
          );
        },
      },

      {
        Header: "DATE",
        Cell: (invoice) => (
          <>
            {handleValidDate(invoice.row.original.date)},
            <small className="text-muted">{handleValidTime(invoice.row.original.date)}</small>
          </>
        ),
      },
      {
        Header: "AMOUNT",
        accessor: "amount",
        filterable: false,
        Cell: (invoice) => (
          <>
            <small className="text-muted">Rs. {invoice.row.original.totalAmount}</small>
          </>
        ),
      },
      {
        Header: "PAYMENT STATUS",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "Paid":
              return <span className="badge text-uppercase badge-soft-success">{cell.value}</span>;
            case "Unpaid":
              return <span className="badge text-uppercase badge-soft-success">{cell.value}</span>;
            case "Cancel":
              return <span className="badge text-uppercase badge-soft-danger">{cell.value}</span>;
            default:
              return <span className="badge text-uppercase badge-soft-info">{cell.value}</span>;
          }
        },
      },
      // {
      //   Header: "Action",
      //   Cell: (cellProps) => {
      //     return (
      //       <UncontrolledDropdown>
      //         <DropdownToggle
      //           href="#"
      //           className="btn btn-soft-secondary btn-sm dropdown"
      //           tag="button"
      //         >
      //           <i className="ri-more-fill align-middle"></i>
      //         </DropdownToggle>
      //         <DropdownMenu className="dropdown-menu-end">
      //           <DropdownItem
      //             href={`/apps-invoices-details?id${cellProps.data[0].invoiceId}`}
      //           >
      //             <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
      //             View
      //           </DropdownItem>

      //           <DropdownItem href="/apps-invoices-create">
      //             <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
      //             Edit
      //           </DropdownItem>

      //           <DropdownItem href="/#">
      //             <i className="ri-download-2-line align-bottom me-2 text-muted"></i>
      //             Download
      //           </DropdownItem>

      //           <DropdownItem divider />

      //           <DropdownItem
      //             href="#"
      //             onClick={() => {
      //               const invoiceData = cellProps.row.original;
      //               onClickDelete(invoiceData);
      //             }}
      //           >
      //             <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
      //             Delete
      //           </DropdownItem>
      //         </DropdownMenu>
      //       </UncontrolledDropdown>
      //     );
      //   },
      // },
    ],
    [checkedAll],
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => handleDeleteInvoice()}
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
          <BreadCrumb title="Invoice List" pageTitle="Invoices" />
          <Row>
            {[
              {
                id: 1,
                label: "Invoices Sent",
                percentage: "+0",
                percentageClass: "success",
                icon: "ri-arrow-right-up-line",
                counter: additional.total * additional.totalPages,
                badge: additional.total * additional.totalPages,
                caption: "Invoices sent",
                feaIcon: "file-text",
                decimals: 0,
                prefix: "",
                suffix: "",
              },
              {
                id: 2,
                label: "Paid Invoices",
                percentage: "+8.09 %",
                percentageClass: "danger",
                icon: "ri-arrow-right-down-line",
                counter: additional.totalEarnings,
                badge: additional.total * additional.totalPages,
                caption: "Paid by clients",
                feaIcon: "check-square",
                decimals: 2,
                prefix: "Rs.",
                suffix: "",
              },
              {
                id: 3,
                label: "Confirmed Invoices",
                percentage: "+9.01 %",
                percentageClass: "danger",
                icon: "ri-arrow-right-down-line",
                counter: additional.confirmed,
                badge: "338",
                caption: "Unpaid by clients",
                feaIcon: "clock",
                decimals: 0,
                prefix: "",
                suffix: "",
              },
              {
                id: 4,
                label: "Users",
                percentage: "+7.55 %",
                percentageClass: "success",
                icon: "ri-arrow-right-up-line",
                counter: additional.uniqueUserCount,
                badge: "502",
                caption: "Total Unique Users",
                feaIcon: "x-octagon",
                decimals: 0,
                prefix: "",
                suffix: "",
              },
            ].map((invoicewidget, key) => (
              <React.Fragment key={key}>
                <Col xl={3} md={6}>
                  <Card className="card-animate">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-uppercase fw-medium text-muted mb-0">{invoicewidget.label}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <h5 className={"fs-14 mb-0 text-" + invoicewidget.percentageClass}>
                            <i className="ri-arrow-right-up-line fs-13 align-middle"></i>
                            {invoicewidget.percentage}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            <CountUp
                              start={0}
                              prefix={invoicewidget.prefix || ""}
                              suffix={invoicewidget.suffix}
                              decimals="2"
                              end={invoicewidget.counter}
                              duration={4}
                              className="counter-value"
                            />
                          </h4>
                          <span className="badge bg-warning me-1">{invoicewidget.badge}</span>
                          <span className="text-muted">{invoicewidget.caption}</span>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title bg-light rounded fs-3">
                            <FeatherIcon icon={invoicewidget.feaIcon} className="text-success icon-dual-success" />
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
                        config.api.API_URL + `/users?search=${inputValue}&type=patient&searchBy=displayName`,
                      );
                      const data = response.data;
                      const options = data.map((item) => ({
                        value: item,
                        label: item?.displayName,
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
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Invoices</h5>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        <Link to={"/apps-invoices-create"} className="btn btn-secondary me-1">
                          <i className="ri-add-line align-bottom me-1"></i>
                          Create Invoice
                        </Link>
                        {isMultiDeleteButton && (
                          <button className="btn btn-danger" onClick={() => setDeleteModalMulti(true)}>
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {isInvoiceSuccess && invoice?.length ? (
                      <TableContainer
                        columns={columns}
                        data={invoice || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        theadClass="text-muted text-uppercase"
                        isInvoiceListFilter={true}
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

export default InvoiceList;
