import React, { useCallback, useEffect, useState } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Table,
  CardHeader,
  Container,
  Label,
  ModalBody,
  Modal,
  ModalHeader,
  Button,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useProfile } from "../../Components/Hooks/UserHooks";
import AsyncSelect from "react-select/async";
import Tools from "../Forms/Builder/Tools";
import { useDispatch } from "react-redux";
import { addNewPayment as onAddNewPayment } from "../../store/invoice/action";
import downloadIcon from "../../assets/icons/downloads.png";
import qrAndroid from "../../assets/icons/qr-android.jpeg";
import playStore from "../../assets/icons/play-store.png";
import appStore from "../../assets/icons/app-store.png";
import Share from "../../Components/Common/Share";
const InvoiceDetails = () => {
  document.title = "Invoice Details";
  //Print the Invoice
  const printInvoice = () => {
    window.print();
  };
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);

  const [order, setOrder] = useState([]);
  const [state, setState] = useState({});

  const searchParams = new URLSearchParams(window.location.search);
  const [selectedOption, setSelectedOption] = useState(null);

  // Get a specific parameter value
  const orderId = searchParams.get("id");

  const getOrder = async () => {
    await axios.get(config.api.API_URL + `/orders?invoiceId=${orderId}`).then((res) => {
      setOrder(res?.data?.[0]);
    });
  };

  useEffect(() => {
    getOrder();
  }, []);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);
  return (
    <div className="page-content">
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add Payment
        </ModalHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(onAddNewPayment({ id: order._id, payment: state }));
            getOrder();
            toggle();
            setState({ method: "" });
          }}
        >
          <ModalBody>
            <Tools
              setState={setState}
              state={state}
              inputs={[
                {
                  name: "method",
                  label: "Payment Method",
                  element: "select",
                  variants: "searchable",
                  items: "Cash,Bank transfer,UPI,Card,Practo",
                },
                {
                  name: "amtPaid",
                  label: "Amount Paid",
                  element: "number",
                },
              ]}
            />
            {state.method === "Card" && (
              <Tools
                setState={setState}
                state={state}
                inputs={[
                  {
                    name: "cardNumber",
                    label: "Card Number",
                    element: "number",
                  },
                  {
                    name: "cardHolderName",
                    label: "Card Holder Name",
                    element: "text",
                  },
                ]}
              />
            )}
            {state.method === "UPI" && (
              <Tools
                setState={setState}
                state={state}
                inputs={[
                  {
                    name: "upi",
                    label: "UPI ID",
                    element: "text",
                  },
                ]}
              />
            )}
            {state.method === "Bank transfer" && (
              <Tools
                setState={setState}
                state={state}
                inputs={[
                  {
                    name: "bankAccountNumber",
                    label: "Bank Account Number",
                    element: "number",
                  },
                  {
                    name: "ifscCode",
                    label: "IFSC Code",
                    element: "text",
                  },
                ]}
              />
            )}
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button>Pay</Button>
            </div>
          </div>
        </form>
      </Modal>
      <Container fluid>
        <BreadCrumb title="Invoice Details" pageTitle="Invoices" />

        <Row className="justify-content-center">
          <Col xxl={9}>
            <Col xs={12}>
              <div className="mb-3">
                <Label className="form-label">Search For Invoices</Label>
                <AsyncSelect
                  className="mb-0"
                  value={{
                    value: selectedOption,
                    label: selectedOption?.invoiceId,
                  }}
                  placeholder="Search For Patients"
                  onChange={(e) => {
                    setOrder(e.value);
                    setSelectedOption(e.value);
                  }}
                  loadOptions={async (inputValue) => {
                    try {
                      const response = await axios.get(config.api.API_URL + `/orders?search=${inputValue}`);
                      const data = response.data;
                      const options = data.map((item) => ({
                        value: item,
                        label: item.invoiceId,
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
            <Col xs={12}>
              <h2 className="text-center">Invoice-cum-Bill of Supply</h2>
            </Col>
            {order && (
              <Card id="demo">
                <Row>
                  <Col lg={12}>
                    <CardHeader className="border-bottom-dashed p-4">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <img
                            src={order?.company?.logo}
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height="17"
                          />
                          <div className="d-flex justify-content-between">
                            <div>
                              <div className=" d-flex" style={{ gap: "2px" }}>
                                <p className="  mb-0" style={{ fontSize: "16px" }}>
                                  Patient Name:
                                </p>
                                <p className="mb-0" style={{ fontSize: "16px" }}>
                                  {order?.user?.displayName}
                                </p>
                              </div>

                              {/* <div className=" d-flex" style={{ gap: "2px" }}>
                                <p
                                  className="mb-0 "
                                  style={{ fontSize: "16px" }}
                                >
                                  Age:
                                </p>
                                <p
                                  className="mb-0"
                                  style={{ fontSize: "16px" }}
                                >
                                  {order?.user?.age}
                                </p>
                              </div> */}

                              {/* <div className=" d-flex" style={{ gap: "2px" }}>
                                <p
                                  className="mb-0 "
                                  style={{ fontSize: "16px" }}
                                >
                                  {order?.user?.gender}
                                </p>
                              </div> */}

                              <div className=" d-flex" style={{ gap: "2px" }}>
                                <p className="mb-0 " style={{ fontSize: "16px" }}>
                                  Phone:
                                </p>
                                <p className="mb-0" style={{ fontSize: "16px" }}>
                                  {order?.user?.phone}
                                </p>
                              </div>

                              {/* <div className=" d-flex" style={{ gap: "2px" }}>
                                <p
                                  className="mb-0 "
                                  style={{ fontSize: "16px" }}
                                >
                                  Address:
                                </p>
                                <p
                                  className="mb-0"
                                  style={{ fontSize: "16px" }}
                                >
                                  {order?.user?.city}
                                </p>
                              </div> */}
                            </div>
                            <div>
                              <div className=" d-flex" style={{ gap: "2px" }}>
                                <p className="  mb-0" style={{ fontSize: "16px" }}>
                                  Psymate ID:
                                </p>
                                <p className="mb-0" style={{ fontSize: "16px" }}>
                                  {order?.user?.psyId}
                                </p>
                              </div>

                              <div className=" d-flex" style={{ gap: "2px" }}>
                                <p className="  mb-0" style={{ fontSize: "16px" }}>
                                  Bill No:
                                </p>
                                <p className="mb-0" style={{ fontSize: "16px" }}>
                                  {order?.invoiceId}
                                </p>
                              </div>

                              <div className=" d-flex" style={{ gap: "2px" }}>
                                <p className="  mb-0" style={{ fontSize: "16px" }}>
                                  Date:
                                </p>
                                <p className="mb-0" style={{ fontSize: "16px" }}>
                                  {new Date(order?.date).toDateString()}
                                </p>
                              </div>

                              <div className=" d-flex" style={{ gap: "2px" }}>
                                <p className="  mb-0" style={{ fontSize: "16px" }}>
                                  Doctor:
                                </p>
                                <p className="mb-0" style={{ fontSize: "16px" }}>
                                  <b>{order?.createdBy?.displayName}</b>
                                </p>
                              </div>
                              {/* 
                              <div className=" d-flex" style={{ gap: "2px" }}>
                                <p
                                  className="  mb-0"
                                  style={{ fontSize: "16px" }}
                                >
                                  Made By: Karan Rastogi
                                </p>
                                <p
                                  className="mb-0"
                                  style={{ fontSize: "16px" }}
                                ></p>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Col>
                  <Col lg={12}>
                    <CardBody className="p-4">
                      <Row>
                        <Col lg={12}>
                          <hr className="horizontal-line" style={{ borderTop: "5px solid black" }} />
                          <div className="d-flex justify-content-between" style={{ gap: "2px" }}>
                            <div className="downLoad-icon">
                              <img style={{ width: "45px" }} src={downloadIcon} />
                            </div>
                            <div className="download-content" style={{ fontSize: "18px" }}>
                              Download the Psymate App from App Store and Google Play to view your bill and help us go
                              paperless.
                            </div>
                            <div className="qr-code d-flex flex-column align-items-center">
                              <img style={{ width: "100px" }} src={qrAndroid} />
                              <p
                                style={{
                                  fontSize: "16px",
                                  textAlign: "center",
                                }}
                              >
                                Scan QR to download app
                              </p>
                            </div>
                          </div>
                          <hr className="horizontal-line" style={{ borderTop: "2px solid black" }} />
                        </Col>
                      </Row>
                    </CardBody>
                  </Col>
                  {order?.address && (
                    <Col lg={12}>
                      <CardBody className="p-4 border-top border-top-dashed">
                        <Row className="g-3">
                          <Col className="col-6">
                            <h6 className="text-muted text-uppercase fw-semibold mb-3">Bill To</h6>
                            <p className="fw-medium mb-2" id="billing-name">
                              {`${order?.address?.firstName} ${order?.address?.lastName}`}
                            </p>
                            <p className="text-muted mb-1" id="billing-address-line-1">
                              {order?.address?.addressLine1}
                            </p>
                            <p className="text-muted mb-1">
                              <span>Phone: +</span>
                              <span id="billing-phone-no">{order?.address?.contact}</span>
                            </p>
                            <p className="text-muted mb-0">
                              <span>Pin code: </span>
                              <span id="billing-tax-no">{order?.address?.pincode}</span>
                            </p>
                          </Col>
                          {/* <Col className="col-6">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          Shipping Address
                        </h6>
                        <p className="fw-medium mb-2" id="shipping-name">
                          David Nichols
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="shipping-address-line-1"
                        >
                          305 S San Gabriel Blvd
                        </p>
                        <p className="text-muted mb-1">
                          <span>Phone: +</span>
                          <span id="shipping-phone-no">(123) 456-7890</span>
                        </p>
                      </Col> */}
                        </Row>
                      </CardBody>
                    </Col>
                  )}
                  <Col lg={12}>
                    <CardBody className="p-4">
                      <div className="table-responsive">
                        <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                          <thead>
                            <tr className="table-active">
                              <th scope="col" style={{ width: "50px" }}>
                                SN
                              </th>
                              <th scope="col">Product Details</th>
                              <th scope="col">Rate</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Discount</th>
                              <th scope="col">Total Amount</th>
                            </tr>
                          </thead>

                          <tbody id="products-list">
                            {order?.items?.map((product, index) => (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td className="">
                                  <span className="fw-medium">{product.name || product?.displayName}</span>
                                </td>
                                <td>₹{product.sellingPrice}</td>
                                <td>{product.quantity}</td>
                                <td>{`${order?.payment?.[0]?.currency || "₹"} ${product?.itemTotal}`}</td>
                                <td>{product.discount}</td>
                                <td>
                                  ₹
                                  {product.discount
                                    ? (product.sellingPrice * (100 - product.discount)) / 100
                                    : product.sellingPrice}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <div className="border-top border-top-dashed mt-2">
                        <hr className="horizontal-line" style={{ borderTop: "2px solid black" }} />
                        <Table
                          className="table-borderless table-nowrap align-middle mb-0 ms-auto"
                          style={{ width: "250px" }}
                        >
                          <tbody>
                            <tr className="border-top border-top-dashed fs-15">
                              <th scope="row">Grand Total</th>
                              <th>{`${order?.payment?.[0]?.currency || "₹"} ${order?.totalAmount}`}</th>
                            </tr>
                          </tbody>
                        </Table>
                        <hr className="horizontal-line" style={{ borderTop: "2px solid black" }} />
                      </div>

                      {/* {order?.payment?.map((pay, index) => (
                        <div key={`${pay?.amtPaid}${index}`} className="mt-3">
                          <h6 className="text-muted text-uppercase fw-semibold mb-3">
                            Payment Details:
                          </h6>
                          <p className="text-muted mb-1">
                            Payment Method:{" "}
                            <span className="fw-medium" id="payment-method">
                              {pay.method}
                            </span>
                          </p>
                          <p className="text-muted">
                            Amount Paid:{" "}
                            <span className="fw-medium" id="">
                              {order?.payment?.[0]?.currency || '₹'}{" "}
                            </span>
                            <span id="card-total-amount">{`${pay?.amtPaid}`}</span>
                          </p>
                        </div>
                      ))} */}
                      <div>
                        <p style={{ textAlign: "center", fontSize: "16px" }}>
                          This is computer generated bill, authorized signatory is not needed.
                        </p>
                        <hr className="horizontal-line" style={{ borderTop: "2px solid black" }} />
                      </div>

                      <div className="d-flex justify-content-between">
                        <div>
                          <p style={{ fontSize: "18px", fontWeight: "600px" }}>Psymate Healthcare Pvt. Ltd</p>
                          <p style={{ fontSize: "16px", marginBottom: "0" }}>{order?.company?.establishmentName}</p>
                          <span style={{ fontSize: "16px" }}> {order?.company?.establishmentAddress}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: "18px" }}>Download Psymate App Now</p>
                          <div className="d-flex align-items-center justify-content-around">
                            <img style={{ width: "50px", height: "50px" }} src={appStore} />
                            <img style={{ width: "50px", height: "50px" }} src={playStore} />
                          </div>
                        </div>
                      </div>
                      {order?.notes && (
                        <div className="mt-4">
                          <div className="alert alert-info">
                            <p className="mb-0">
                              <span className="fw-semibold">NOTES:</span>
                              <span id="note">{order?.notes}</span>
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                        {order.dueAmount > 0 && (
                          <Link to="#" onClick={toggle} className="btn btn-success">
                            {/* <i className="ri-printer-line align-bottom me-1"></i> */}
                            Pay Due Amount {order?.dueAmount}
                          </Link>
                        )}
                        <Share
                          timeline={{
                            title: "Invoice For Order",
                            description: "",
                            reference: {
                              document: [{ Location: order?.download?.[0] }],
                            },
                          }}
                        />
                      </div>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvoiceDetails;
