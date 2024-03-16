import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

//Import Breadcrumb
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { addNewInvoice as onAddNewInvoice } from "../../store/invoice/action";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";

import Select from "react-select";
import classnames from "classnames";
import { orderSummary } from "../../common/data/ecommerce";
import { Link } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { useFormik } from "formik";
import Cleave from "cleave.js/react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const EcommerceCheckout = () => {
  document.title = "Checkout | Psymate - Management Portal";
  const { userProfile, loading } = useProfile();

  const [selectedCountry, setselectedCountry] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState();
  const [deletemodal, setDeleteModal] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  // Get a specific parameter value
  const userId = searchParams.get("user");
  const [cart, setCart] = useState([]);
  const [state, setState] = useState([]);
  const [complete, setcomplete] = useState(false);

  const getOrder = async () => {
    await axios
      .get(config.api.API_URL + `/user/addresses/${userProfile?._id}`)
      .then((res) => {
        setAddresses(res.data);
      });
    await axios
      .get(config.api.API_URL + `/cart/${userProfile?._id}`)
      .then((res) => {
        setCart(res);
      });
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading) getOrder();
  }, [loading]);

  const toggledeletemodal = () => {
    setDeleteModal(!deletemodal);
  };

  const togglemodal = () => {
    setModal(!modal);
  };

  function handleSelectCountry(selectedCountry) {
    setselectedCountry(selectedCountry);
  }
  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }
  console.log(state);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: userProfile.firstName || "",
      lastName: userProfile.lastName || "",
      email: userProfile.email || "",
      website: "",
      phone: userProfile.phone || "",
      invoiceId: "",
      establishmentAddress: "",
      date: "",
      name: "",
      status: "",
      country: "",
      amount: "",
      product_name: "",
      logo: "https://ik.imagekit.io/jybala7h3/psymate-logo-white_JVApKhT3e_eDlzx9shh.png?updatedAt=1680327160872",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("This field is required"),
      lastName: Yup.string().required("This field is required"),
      email: Yup.string().required("This field is required"),
      phone: Yup.string().required("This field is required"),
      pincode: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {},
  });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Checkout" pageTitle="Ecommerce" />

          <Row>
            <Col xl="8">
              <Col xs={4}>
                {/* <div className="mb-3">
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
                        await axios
                          .get(
                            config.api.API_URL +
                              `/cart?id=${response.data[0]._id}`
                          )
                          .then((res) => {
                            setCart(res.data);
                          });
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
                </div> */}
              </Col>
              <Card>
                <CardBody className="checkout-tab">
                  <Form action="#">
                    <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                      <Nav
                        className="nav-pills nav-justified custom-nav"
                        role="tablist"
                      >
                        <NavItem role="presentation">
                          <NavLink
                            href="#"
                            className={classnames(
                              {
                                active: activeTab === 1,
                                done: activeTab <= 4 && activeTab >= 0,
                              },
                              "p-3 fs-15"
                            )}
                            onClick={() => {
                              toggleTab(1);
                            }}
                          >
                            <i className="ri-user-2-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Personal Info
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink
                            href="#"
                            className={classnames(
                              {
                                active: activeTab === 2,
                                done: activeTab <= 4 && activeTab > 1,
                              },
                              "p-3 fs-15"
                            )}
                            // onClick={() => {
                            //   toggleTab(2);
                            // }}
                          >
                            <i className="ri-truck-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Shipping Info
                          </NavLink>
                        </NavItem>
                        <NavItem role="presentation">
                          <NavLink
                            href="#"
                            className={classnames(
                              {
                                active: activeTab === 3,
                                done: activeTab <= 4 && activeTab > 2,
                              },
                              "p-3 fs-15"
                            )}
                            // onClick={() => {
                            //   toggleTab(3);
                            // }}
                          >
                            <i className="ri-bank-card-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                            Payment Info
                          </NavLink>
                        </NavItem>
                        {complete && (
                          <NavItem role="presentation">
                            <NavLink
                              href="#"
                              className={classnames(
                                {
                                  active: activeTab === 4,
                                  done: activeTab <= 4 && activeTab > 3,
                                },
                                "p-3 fs-15"
                              )}
                              onClick={() => {
                                toggleTab(4);
                              }}
                            >
                              <i className="ri-checkbox-circle-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                              Finish
                            </NavLink>
                          </NavItem>
                        )}
                      </Nav>
                    </div>

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId={1} id="pills-bill-info">
                        <div>
                          <h5 className="mb-1">Billing Information</h5>
                          <p className="text-muted mb-4">
                            Please fill all information below
                          </p>
                        </div>

                        <div>
                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-firstName"
                                  className="form-label"
                                >
                                  First Name
                                </Label>
                                <Input
                                  value={validation.values.firstName || ""}
                                  onBlur={validation.handleBlur}
                                  onChange={validation.handleChange}
                                  type="text"
                                  className="form-control"
                                  id="firstName"
                                  placeholder="Enter first name"
                                  invalid={
                                    validation.errors.firstName &&
                                    validation.touched.firstName
                                      ? true
                                      : false
                                  }
                                />
                                {validation.errors.firstName &&
                                validation.touched.firstName ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.firstName}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>

                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-lastName"
                                  className="form-label"
                                >
                                  Last Name
                                </Label>
                                <Input
                                  type="text"
                                  value={validation.values.lastName || ""}
                                  onBlur={validation.handleBlur}
                                  onChange={validation.handleChange}
                                  className="form-control"
                                  id="billinginfo-lastName"
                                  placeholder="Enter last name"
                                  invalid={
                                    validation.errors.lastName &&
                                    validation.touched.lastName
                                      ? true
                                      : false
                                  }
                                />
                                {validation.errors.lastName &&
                                validation.touched.lastName ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.lastName}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-email"
                                  className="form-label"
                                >
                                  Email
                                  <span className="text-muted">(Optional)</span>
                                </Label>
                                <Input
                                  type="email"
                                  value={validation.values.email || ""}
                                  onBlur={validation.handleBlur}
                                  onChange={validation.handleChange}
                                  className="form-control"
                                  id="billinginfo-email"
                                  placeholder="Enter email"
                                  invalid={
                                    validation.errors.email &&
                                    validation.touched.email
                                      ? true
                                      : false
                                  }
                                />
                                {validation.errors.email &&
                                validation.touched.email ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.email}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>

                            <Col sm={6}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="billinginfo-phone"
                                  className="form-label"
                                >
                                  Phone
                                </Label>
                                <Input
                                  type="text"
                                  value={validation.values.phone || ""}
                                  onBlur={validation.handleBlur}
                                  onChange={validation.handleChange}
                                  className="form-control"
                                  id="billinginfo-phone"
                                  placeholder="Enter phone no."
                                  invalid={
                                    validation.errors.phone &&
                                    validation.touched.phone
                                      ? true
                                      : false
                                  }
                                />
                                {validation.errors.phone &&
                                validation.touched.phone ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.phone}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>

                          <div className="d-flex align-items-start gap-3 mt-3">
                            <button
                              type="button"
                              className="btn btn-primary btn-label right ms-auto nexttab"
                              onClick={() => {
                                toggleTab(2);
                              }}
                            >
                              <i className="ri-truck-line label-icon align-middle fs-16 ms-2"></i>
                              Proceed to Shipping
                            </button>
                          </div>
                        </div>
                      </TabPane>

                      <TabPane tabId={2}>
                        <div>
                          <h5 className="mb-1">Shipping Information</h5>
                          <p className="text-muted mb-4">
                            Please fill all information below
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="flex-grow-1">
                              <h5 className="fs-15 mb-0">Saved Address</h5>
                            </div>
                            {/* <div className="flex-shrink-0">
                              <button
                                type="button"
                                className="btn btn-sm btn-success mb-3"
                                onClick={() => {
                                  setEdit();
                                  togglemodal();
                                }}
                              >
                                Add Address
                              </button>
                            </div> */}
                          </div>
                          <Row className="gy-3">
                            {addresses?.map((i, index) => {
                              return (
                                <Col
                                  onClick={() => {
                                    setState({
                                      ...state,
                                      address: i,
                                    });
                                  }}
                                  key={`address_${index}`}
                                  lg={4}
                                  sm={6}
                                >
                                  <div className="form-check card-radio">
                                    <Input
                                      id="shippingAddress01"
                                      name="shippingAddress"
                                      type="radio"
                                      className="form-check-input"
                                      defaultChecked
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="shippingAddress01"
                                    >
                                      <span className="mb-4 fw-semibold d-block text-muted text-uppercase">
                                        Home Address
                                      </span>

                                      <span className="fs-15 mb-2 d-block">
                                        {`${i.firstName} ${i.lastName}`}
                                      </span>
                                      <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                        {i.addressLine1}
                                      </span>
                                      <span className="text-muted fw-normal d-block">
                                        {i.contact}
                                      </span>
                                    </Label>
                                  </div>
                                  <div className="d-flex flex-wrap p-2 py-1 bg-light rounded-bottom border mt-n1">
                                    <div>
                                      <Link
                                        to="#"
                                        className="d-block text-body p-1 px-2"
                                        onClick={() => {
                                          togglemodal();
                                          setEdit(i);
                                        }}
                                      >
                                        <i className="ri-pencil-fill text-muted align-bottom me-1"></i>
                                        Edit
                                      </Link>
                                    </div>
                                    <div>
                                      <Link
                                        to="#"
                                        className="d-block text-body p-1 px-2"
                                        onClick={toggledeletemodal}
                                      >
                                        <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i>
                                        Remove
                                      </Link>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <div className="mt-4">
                            <h5 className="fs-14 mb-3">Shipping Method</h5>

                            <Row className="g-4">
                              <Col lg={6}>
                                <div className="form-check card-radio">
                                  <Input
                                    id="shippingMethod01"
                                    name="shippingMethod"
                                    type="radio"
                                    onClick={() => {
                                      setState({
                                        ...state,
                                        shippingMethod: "free",
                                        shippingCost: 0,
                                      });
                                    }}
                                    className="form-check-input"
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor="shippingMethod01"
                                  >
                                    <span className="fs-21 float-end mt-2 text-wrap d-block fw-semibold">
                                      Free
                                    </span>
                                    <span className="fs-15 mb-1 text-wrap d-block">
                                      Free Delivery
                                    </span>
                                    <span className="text-muted fw-normal text-wrap d-block">
                                      Expected Delivery 3 to 5 Days
                                    </span>
                                  </Label>
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="form-check card-radio">
                                  <Input
                                    id="shippingMethod02"
                                    name="shippingMethod"
                                    type="radio"
                                    onClick={() => {
                                      setState({
                                        ...state,
                                        shippingMethod: "paid",
                                        shippingCost: 250,
                                      });
                                    }}
                                    className="form-check-input"
                                    defaultChecked
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor="shippingMethod02"
                                  >
                                    <span className="fs-21 float-end mt-2 text-wrap d-block fw-semibold">
                                      $24.99
                                    </span>
                                    <span className="fs-15 mb-1 text-wrap d-block">
                                      Express Delivery
                                    </span>
                                    <span className="text-muted fw-normal text-wrap d-block">
                                      Delivery within 24hrs.
                                    </span>
                                  </Label>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>

                        <div className="d-flex align-items-start gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Back to Personal Info
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-label right ms-auto nexttab"
                            onClick={() => {
                              toggleTab(activeTab + 1);
                            }}
                          >
                            <i className="ri-bank-card-line label-icon align-middle fs-16 ms-2"></i>
                            Continue to Payment
                          </button>
                        </div>
                      </TabPane>

                      <TabPane tabId={3}>
                        <div>
                          <h5 className="mb-1">Payment Selection</h5>
                          <p className="text-muted mb-4">
                            Please select and enter your billing information
                          </p>
                        </div>

                        <Row className="g-4">
                          <Col lg={4} sm={6}>
                            <div>
                              <div className="form-check card-radio">
                                <Input
                                  id="paymentMethod02"
                                  name="paymentMethod"
                                  onClick={() => {
                                    setState({
                                      ...state,
                                      paymentMethod: "card",
                                    });
                                  }}
                                  type="radio"
                                  className="form-check-input"
                                  defaultChecked
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="paymentMethod02"
                                >
                                  <span className="fs-16 text-muted me-2">
                                    <i className="ri-bank-card-fill align-bottom"></i>
                                  </span>
                                  <span className="fs-15 text-wrap">
                                    Credit / Debit Card
                                  </span>
                                </Label>
                              </div>
                            </div>
                          </Col>

                          <Col lg={4} sm={6}>
                            <div>
                              <div className="form-check card-radio">
                                <Input
                                  id="paymentMethod03"
                                  name="paymentMethod"
                                  type="radio"
                                  onClick={() => {
                                    setState({
                                      ...state,
                                      paymentMethod: "cash",
                                    });
                                  }}
                                  className="form-check-input"
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="paymentMethod03"
                                >
                                  <span className="fs-16 text-muted me-2">
                                    <i className="ri-money-dollar-box-fill align-bottom"></i>
                                  </span>
                                  <span className="fs-15 text-wrap">
                                    Cash on Delivery
                                  </span>
                                </Label>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        {/* {state.paymentMethod == "card" && (
                          <div
                            className="collapse show"
                            id="paymentmethodCollapse"
                          >
                            <Card className="p-4 border shadow-none mb-0 mt-4">
                              <Row className="gy-3">
                                <Col md={12}>
                                  <Label
                                    htmlFor="cardName"
                                    className="form-label"
                                  >
                                    Name on card
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="cardName"
                                    value={validation.values.cardName || ""}
                                    onBlur={validation.handleBlur}
                                    onChange={validation.handleChange}
                                    placeholder="Enter name"
                                  />
                                  <small className="text-muted">
                                    Full name as displayed on card
                                  </small>
                                </Col>

                                <Col md={6}>
                                  <div className="mb-3">
                                    <Label
                                      htmlFor="cardNumber"
                                      className="form-label"
                                    >
                                      Credit card number
                                    </Label>
                                    <Cleave
                                      placeholder="xxxx xxxx xxxx xxxx"
                                      options={{
                                        creditCard: true,
                                      }}
                                      value={validation.values.cardNumber || ""}
                                      onBlur={validation.handleBlur}
                                      onChange={validation.handleChange}
                                      className="form-control"
                                    />
                                  </div>
                                </Col>

                                <Col md={3}>
                                  <Label
                                    htmlFor="expiration"
                                    className="form-label"
                                  >
                                    Expiration
                                  </Label>
                                  <Input
                                    type="text"
                                    value={validation.values.expiration || ""}
                                    onBlur={validation.handleBlur}
                                    onChange={validation.handleChange}
                                    className="form-control"
                                    id="expiration"
                                    placeholder="MM/YY"
                                  />
                                </Col>

                                <Col md={3}>
                                  <Label htmlFor="cvv" className="form-label">
                                    CVV
                                  </Label>
                                  <Input
                                    type="text"
                                    value={validation.values.cvv || ""}
                                    onBlur={validation.handleBlur}
                                    onChange={validation.handleChange}
                                    className="form-control"
                                    id="cvv"
                                    placeholder="xxx"
                                  />
                                </Col>
                              </Row>
                            </Card>
                            <div className="text-muted mt-2 fst-italic">
                              <i
                                data-feather="lock"
                                className="text-muted icon-xs"
                              ></i>
                              Your transaction is secured with SSL encryption
                            </div>
                          </div>
                        )} */}

                        <div className="d-flex align-items-start gap-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-light btn-label previestab"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
                            Back to Shipping
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-label right ms-auto nexttab"
                            onClick={() => {
                              if (cart.items.length == 0) {
                                return toast.error("Add Items to cart");
                              }
                              const payload = {
                                address: {
                                  ...state.address,
                                  shippingMethod: state.shippingMethod,
                                  shippingCost: state.shippingCost,
                                },
                                company: {
                                  _id: "644cc2d1fade193c17517f7f",
                                  about: "Psymate clinic Noida",
                                  email: "info@psymate.org",
                                  establishmentAddress:
                                    "D-4, D Block, Pocket D, Sector 20, Noida, Uttar Pradesh 201301",
                                  establishmentName: "Psymate Clinic Noida",
                                  logo: "https://ik.imagekit.io/jybala7h3/psymate-logo-white_JVApKhT3e_eDlzx9shh.png?updatedAt=1680327160872",
                                  phone: 6399006060,
                                  website: "https://www.psymate.org/",
                                },
                                items: cart.items.map((i) => {
                                  return {
                                    ...i.product,
                                    quantity: i.quantity,
                                    name: i.name,
                                    itemTotal:
                                      i?.quantity * i?.product?.sellingRate,
                                    sellingPrice: i?.product?.sellingRate,
                                  };
                                }),
                                payment: [
                                  {
                                    discount: 0,
                                    currency: "Rs.",
                                    method: state.paymentMethod,
                                    amtPaid: cart.price,
                                  },
                                ],
                                createdBy: {
                                  displayName: userProfile.displayName,
                                  email: userProfile.email,
                                  phone: userProfile.phone,
                                  _id: userProfile._id,
                                },
                                type: "product",
                                user: {
                                  displayName: userProfile.displayName,
                                  email: userProfile.email,
                                  phone: userProfile.phone,
                                  _id: userProfile._id,
                                },
                                notes: "Products",
                                totalAmount: cart.price,
                              };
                              console.log(payload);
                              dispatch(onAddNewInvoice({ data: payload }));
                              toggleTab(activeTab + 1);
                              setcomplete(true);
                            }}
                            disabled={cart.items.length === 0}
                          >
                            <i className="ri-shopping-basket-line label-icon align-middle fs-16 ms-2"></i>
                            Complete Order
                          </button>
                        </div>
                      </TabPane>

                      {complete && (
                        <TabPane onClick={() => {}} tabId={4} id="pills-finish">
                          <div className="text-center py-5">
                            <div className="mb-4">
                              <lord-icon
                                src="https://cdn.lordicon.com/lupuorrc.json"
                                trigger="loop"
                                colors="primary:#0ab39c,secondary:#405189"
                                style={{ width: "120px", height: "120px" }}
                              ></lord-icon>
                            </div>
                            <h5>Thank you ! We are generating your order !</h5>
                            <p className="text-muted">
                              You will receive an order confirmation email with
                              details of your order.
                            </p>
                            <h5 className="fw-semibold">
                              This page will be automatically redirected to
                              invoice
                            </h5>
                          </div>
                        </TabPane>
                      )}
                    </TabContent>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Order Summary</h5>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card">
                    <table className="table table-borderless align-middle mb-0">
                      <thead className="table-light text-muted">
                        <tr>
                          <th style={{ width: "90px" }} scope="col">
                            Product
                          </th>
                          <th scope="col">Product Info</th>
                          <th scope="col" className="text-end">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart?.items?.map((item, key) => (
                          <React.Fragment key={item?.product?._id}>
                            <tr>
                              <td>
                                <div className="avatar-md bg-light rounded p-1">
                                  <img
                                    src={item?.product?.photoURL}
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                              </td>
                              <td>
                                <h5 className="fs-15">
                                  <Link
                                    to={`/apps-ecommerce-product-details?id=${item?.product?._id}`}
                                    className="text-reset"
                                  >
                                    {item?.product?.displayName}
                                  </Link>
                                </h5>
                                <p className="text-muted mb-0">
                                  {item?.product?.sellingRate} X{" "}
                                  {item?.quantity}
                                </p>
                              </td>
                              <td className="text-end">
                                {item?.quantity * item?.product?.sellingRate}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}

                        <tr>
                          <td className="fw-semibold" colSpan="2">
                            Sub Total :
                          </td>
                          <td className="fw-semibold text-end">{cart.price}</td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            Discount{" "}
                            <span className="text-muted">(Psymate15)</span>:{" "}
                          </td>
                          <td className="text-end">- 0</td>
                        </tr>
                        <tr>
                          <td colSpan="2">Shipping Charge :</td>
                          <td className="text-end">0</td>
                        </tr>
                        {/* <tr>
                          <td colSpan="2">Estimated Tax (12%): </td>
                          <td className="text-end">$ 18.20</td>
                        </tr> */}
                        <tr className="table-active">
                          <th colSpan="2">Total (INR) :</th>
                          <td className="text-end">
                            <span className="fw-semibold">{cart.price}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {/* modal Delete Address */}
      <Modal
        isOpen={deletemodal}
        role="dialog"
        autoFocus={true}
        centered
        id="removeItemModal"
        toggle={toggledeletemodal}
      >
        <ModalHeader
          toggle={() => {
            setDeleteModal(!deletemodal);
          }}
        ></ModalHeader>
        <ModalBody>
          <div className="mt-2 text-center">
            <lord-icon
              src="https://cdn.lordicon.com/gsqxdxog.json"
              trigger="loop"
              colors="primary:#f7b84b,secondary:#fa896b"
              style={{ width: "100px", height: "100px" }}
            ></lord-icon>
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>Are you Sure ?</h4>
              <p className="text-muted mx-4 mb-0">
                Are you Sure You want to Remove this Address ?
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <button
              type="button"
              className="btn w-sm btn-light"
              onClick={() => {
                setDeleteModal(!deletemodal);
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn w-sm btn-danger"
              onClick={() => {
                setDeleteModal(!deletemodal);
              }}
            >
              Yes, Delete It!
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* modal Add Address */}
      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered
        id="addAddressModal"
        toggle={togglemodal}
      >
        <ModalHeader
          toggle={() => {
            setModal(!modal);
          }}
        >
          <h5 className="modal-title" id="addAddressModalLabel">
            Address
          </h5>
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Name
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                value={validation.values.firstName || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                placeholder="Enter Name"
              />
            </div>

            <div className="mb-3">
              <Label for="addaddress-textarea" className="form-label">
                Address Line 1
              </Label>
              <textarea
                className="form-control"
                id="addaddress-textarea"
                placeholder="Enter Address"
                value={validation.values.addressLine1 || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                rows="2"
              ></textarea>
            </div>

            <div className="mb-3">
              <Label for="addaddress-textarea" className="form-label">
                Address Line 2
              </Label>
              <textarea
                className="form-control"
                value={validation.values.addressLine2 || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                id="addaddress-textarea"
                placeholder="Enter Address"
                rows="2"
              ></textarea>
            </div>

            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Phone
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                value={validation.values.contact || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                placeholder="Enter Phone No."
              />
            </div>

            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Country
              </Label>
              <Input
                type="text"
                className="form-control"
                id="addaddress-Name"
                value={validation.values.country || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                placeholder="Enter Phone No."
              />
            </div>
            <div className="mb-3">
              <Label for="addaddress-Name" className="form-label">
                Pincode
              </Label>
              <Input
                type="text"
                className="form-control"
                value={validation.values.pincode || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                id="addaddress-Name"
                placeholder="Enter Phone No."
              />
            </div>

            <div className="mb-3">
              <Label for="state" className="form-label">
                Address Type
              </Label>
              <select
                value={validation.values.type || ""}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                className="form-select"
                id="state"
                data-plugin="choices"
              >
                <option value="homeAddress">Home (7am to 10pm)</option>
                <option value="officeAddress">Office (11am to 7pm)</option>
              </select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              setModal(!modal);
            }}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={async () => {
              console.log(validation.values);
              // setModal(!modal);
              await axios
                .post(config.api.API_URL + `/user/addresses`, {
                  userId: userProfile._id,
                  itemId: new Date().getTime(),
                  data: validation.values,
                })
                .then((res) => {
                  console.log(res);
                });
            }}
          >
            Save
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default EcommerceCheckout;
