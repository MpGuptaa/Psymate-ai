import React, { useEffect, useState } from "react";

import { CardBody, Row, Col, Card, Container, Form, Input, Label, Table, FormFeedback, Button } from "reactstrap";
import AsyncSelect from "react-select/async";

import { Link, useParams } from "react-router-dom";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import Select from "react-select";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import { addNewInvoice as onAddNewInvoice } from "../../store/invoice/action";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { getEstablishments } from "../../store/establishments/action";
import { getProducts, getTeamData } from "../../store/actions";
import axios from "axios";
import config from "../../config";
import PaymentForm from "./MoreMethods";

const InvoiceCreate = ({ width, id }) => {
  const dispatch = useDispatch();
  const { paramsId } = useParams();
  const userId = id ? id : paramsId;
  // Get a specific parameter value
  const { userProfile, loading } = useProfile();
  const [state, setState] = useState({ amtPaid: 0, discount: 0 });
  const [establishment, setEstablishment] = useState([]);
  const [isCurrency, setisCurrency] = useState("(₹)");
  const [patient, setPatient] = useState({});
  const [doctor, setDoctor] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);

  function handleisCurrency(isCurrency) {
    setisCurrency(isCurrency);
  }

  const allcurrency = [
    {
      options: [
        { label: "$", value: "($)" },
        { label: "£", value: "(£)" },
        { label: "₹", value: "(₹)" },
        { label: "€", value: "(€)" },
      ],
    },
  ];

  const [dis, setDis] = useState(0);
  const [charge, setCharge] = useState(0);

  const { establishments } = useSelector((state) => ({
    establishments: state.Establishment?.establishments,
  }));

  const itemTotalCalculator = (items = []) => {
    let total = 0;
    items.forEach((item) => {
      const itemPrice = item.quantity * item.sellingPrice - (item.discount || 0);
      if (itemPrice) {
        total += itemPrice;
      }
    });
    return total;
  };

  useEffect(() => {
    setTotal(itemTotalCalculator(selectedProducts) - dis);
  }, [selectedProducts, dis]);

  const getPatient = async () => {
    await axios.get(`${config.api.API_URL}/users?search=${userId}&searchBy=_id&exact=true`).then((res) => {
      setPatient(res.data[0]);
    });
  };

  useEffect(() => {
    setEstablishment(establishments[0]);
  }, [establishments]);

  useEffect(() => {
    getPatient();
    dispatch(getTeamData());
    dispatch(getEstablishments());
    dispatch(getProducts());
  }, [userId]);

  const [notes, setNotes] = useState("");
  const [invoiceModal, setInvoiceModal] = useState(false);

  document.title = "Create Invoice | Psymate - Management Portal";
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      postalcode: establishment?.pincode || "",
      registration: "",
      email: establishment?.email || "",
      website: establishment?.website || "",
      contact: establishment?.phone || "",
      establishmentAddress: establishment?.establishmentAddress || "",
      date: "",
      name: "",
      status: "",
      country: "",
      amount: "",
      displayName: "",
      logo:
        establishment?.logo ||
        "https://ik.imagekit.io/jybala7h3/psymate-logo-white_JVApKhT3e_eDlzx9shh.png?updatedAt=1680327160872",
    },
    // validationSchema: Yup.object({
    //   logo: Yup.string().required("This field is required"),
    //   email: Yup.string().required("Please Enter a Email"),
    //   website: Yup.string().required("Please Enter a website"),
    //   contact: Yup.string().required("Please Enter a contact number"),
    // }),
    onSubmit: async (values) => {
      const payload = {
        address: patient?.addresses?.[0],
        user: {
          displayName: patient.displayName,
          _id: patient._id,
          email: patient.email,
          phone: patient.phone,
        },
        company: establishment,
        items: selectedProducts,
        payment: [
          {
            ...state,
            discount: Number(dis),
            currency: isCurrency,
            amtPaid: (state.methods || []).reduce((acc, initialValue) => {
              return Number(initialValue.amount) + Number(acc);
            }, 0),
          },
        ],
        createdBy: {
          displayName: userProfile.displayName,
          _id: userProfile._id,
          email: userProfile.email,
          phone: userProfile.phone,
        },
        notes: notes || "",
        totalAmount: total,
      };
      dispatch(onAddNewInvoice({ data: payload }));
      validation.resetForm();
    },
  });
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Card>
      <CardBody>
        <Container>
          <BreadCrumb title="Create Invoice" pageTitle="Invoices" />

          <Row className="justify-content-center my-10">
            <Col className="justify-content-center my-10" xxl={width ? width : 9}>
              <Row className="g-3 p-2"></Row>
              <Row
                style={{
                  marginTop: 50,
                  marginBottom: 10,
                }}
                className="mx-auto"
              >
                {!id && (
                  <Col xs={12}>
                    <div className="mb-3">
                      <Label className="form-label text-muted text-uppercase fw-semibold">SELECT User</Label>
                      <AsyncSelect
                        className="mb-0"
                        value={{
                          // value: selectedOption,
                          label: patient?.displayName,
                        }}
                        placeholder="Search For Patients"
                        onChange={(e) => {
                          setPatient(e.value);
                          setSelectedOption(e.value);
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
                  </Col>
                )}
                <Col lg={6}>
                  <div className="mb-2">
                    <Label for="choices-payment-type" className="form-label text-muted text-uppercase fw-semibold">
                      SELECT Establishment
                    </Label>
                    <div className="input-light">
                      <Select
                        value={{
                          label: establishment?.establishmentName,
                        }}
                        onChange={(e) => {
                          setEstablishment(e.value);
                        }}
                        options={establishments.map((i) => {
                          const payload = {
                            label: i.establishmentName,
                            value: i,
                          };
                          return payload;
                        })}
                        name="choices-single-default"
                        id="idStatus"
                        className="bg-light border-0"
                      ></Select>
                    </div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="mb-3">
                    <Label className="form-label text-muted text-uppercase fw-semibold">SELECT Consultant</Label>
                    <AsyncSelect
                      className="mb-0"
                      value={{
                        value: doctor,
                        label: doctor?.displayName,
                      }}
                      placeholder="Search For Patients"
                      onChange={(e) => {
                        setDoctor(e.value);
                      }}
                      loadOptions={async (inputValue) => {
                        try {
                          const response = await axios.get(
                            config.api.API_URL + `/users?search=${inputValue}&type=doctor&searchBy=displayName`,
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
                {/* <Col xs={4}>
                  <div className="mb-3">
                    <Label className="form-label text-muted text-uppercase fw-semibold">SELECT Care Manager</Label>
                    <AsyncSelect
                      className="mb-0"
                      value={{
                        value: selectedOption,
                        label: selectedOption?.displayName,
                      }}
                      placeholder="Search For Patients"
                      onChange={(e) => {
                        setPatient(e.value);
                        setSelectedOption(e.value);
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
              </Row>

              <Card>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                  className="needs-validation"
                  id="invoice_form"
                >
                  <CardBody className="p-4">
                    <div className="">
                      <Table className="invoice-table table-borderless table-nowrap mb-0">
                        <thead className="align-middle">
                          <tr className="table-active">
                            <th scope="col" style={{ width: "50px" }}>
                              #
                            </th>
                            <th scope="col">Item Details</th>
                            <th scope="col" style={{ width: "120px" }}>
                              <div className="d-flex currency-select input-light align-items-center">
                                Rate
                                <Select
                                  defaultValue={{
                                    value: isCurrency,
                                    label: isCurrency,
                                  }}
                                  onChange={(e) => {
                                    handleisCurrency(e.value);
                                  }}
                                  options={allcurrency}
                                  id="choices-payment-currency"
                                  className="form-selectborder-0 bg-light"
                                />
                              </div>
                            </th>
                            <th scope="col" style={{ width: "120px" }}>
                              Quantity
                            </th>
                            <th scope="col" style={{ width: "120px" }}>
                              Discount
                            </th>
                            <th scope="col" className="text-end" style={{ width: "150px" }}>
                              Amount
                            </th>
                            <th scope="col" className="text-end" style={{ width: "105px" }}></th>
                          </tr>
                        </thead>
                        <tbody id="newlink">
                          {selectedProducts?.map((product, index) => {
                            if (!product.itemTotal) product.itemTotal = product.sellingPrice;
                            if (!product.quantity) product.quantity = 1;
                            return (
                              <tr id={index} key={index} className="product">
                                <th scope="row" className="product-id">
                                  {index + 1}
                                </th>
                                <td className="text-start">
                                  <div className="mb-2">
                                    <Input
                                      type="text"
                                      className="form-control bg-light border-0"
                                      id="productName-1"
                                      placeholder="Product Name"
                                      name="displayName"
                                      value={product.displayName || ""}
                                      invalid={
                                        validation.errors.displayName && validation.touched.displayName ? true : false
                                      }
                                    />
                                    {validation.errors.displayName && validation.touched.displayName ? (
                                      <FormFeedback type="invalid">{validation.errors.displayName}</FormFeedback>
                                    ) : null}
                                  </div>
                                  {/* <Input
                                    type="textarea"
                                    className="form-control bg-light border-0"
                                    id="productDetails-1"
                                    rows="2"
                                    value={product.sideEffects}
                                    placeholder="Product Details"
                                  ></Input> */}
                                </td>
                                <td>
                                  <Input
                                    type="number"
                                    className="form-control product-price bg-light border-0"
                                    placeholder="0.00"
                                    id="productRate-1"
                                    step="0.01"
                                    value={product.sellingPrice}
                                    onChange={(e) => {
                                      if (/[0-9]/g.test(e.target.value) || e.target.value === "") {
                                        let newquantity;
                                        if (e.target.value === "") {
                                          newquantity = 0;
                                        } else {
                                          newquantity = parseInt(e.target.value);
                                        }
                                        setSelectedProducts((prev) => {
                                          prev[index] = {
                                            ...prev[index],
                                            sellingPrice: newquantity || 0,
                                            itemTotal: newquantity || 0,
                                            discount: 0,
                                          };
                                          return [...prev];
                                        });
                                      }
                                    }}
                                  />
                                  <div className="invalid-feedback">Please enter a rate</div>
                                </td>
                                <td>
                                  <div className="input-step">
                                    <button
                                      type="button"
                                      className="minus"
                                      onClick={() => {
                                        if (typeof product.quantity !== "number") {
                                          product.quantity = 1;
                                        }
                                        setSelectedProducts((prev) => {
                                          const newQuantity =
                                            prev[index].quantity - 1 >= 0 ? prev[index].quantity - 1 : 0;
                                          prev[index] = {
                                            ...prev[index],
                                            quantity: newQuantity,
                                            itemTotal: newQuantity * product.sellingPrice,
                                          };
                                          return [...prev];
                                        });
                                      }}
                                    >
                                      –
                                    </button>
                                    <Input
                                      type="number"
                                      className="product-quantity"
                                      id="product-qty-1"
                                      value={product.quantity}
                                      // readOnly
                                      onChange={(e) => {
                                        if (/[0-9]/g.test(e.target.value) || e.target.value === "") {
                                          let newquantity;
                                          if (e.target.value === "") {
                                            newquantity = 0;
                                          } else {
                                            newquantity = parseInt(e.target.value);
                                          }
                                          setSelectedProducts((prev) => {
                                            prev[index] = {
                                              ...prev[index],
                                              quantity: newquantity,
                                              itemTotal: newquantity * product.sellingPrice,
                                            };
                                            return [...prev];
                                          });
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="plus"
                                      onClick={() => {
                                        if (typeof product.quantity !== "number") {
                                          product.quantity = 1;
                                        }
                                        setSelectedProducts((prev) => {
                                          const newQuantity = prev[index].quantity + 1;
                                          prev[index] = {
                                            ...prev[index],
                                            quantity: newQuantity,
                                            itemTotal: newQuantity * product.sellingPrice,
                                          };
                                          return [...prev];
                                        });
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <Input
                                    type="number"
                                    className="form-control product-price bg-light border-0"
                                    placeholder="0.00"
                                    id="productDiscount-1"
                                    step="0.01"
                                    value={product.discount}
                                    onChange={(e) => {
                                      if (/[0-9]/g.test(e.target.value) || e.target.value === "") {
                                        let newquantity;
                                        if (e.target.value === "") {
                                          newquantity = 0;
                                        } else {
                                          newquantity = parseInt(e.target.value);
                                        }
                                        setSelectedProducts((prev) => {
                                          prev[index] = {
                                            ...prev[index],
                                            itemTotal: product.sellingPrice * product.quantity - newquantity,
                                            discount: newquantity,
                                          };
                                          return [...prev];
                                        });
                                      }
                                    }}
                                  />
                                  <div className="invalid-feedback">Please enter a rate</div>
                                </td>
                                <td className="text-end">
                                  <div>
                                    <Input
                                      type="text"
                                      className="form-control bg-light border-0 product-line-price"
                                      id="productPrice-1"
                                      placeholder={`${isCurrency}0.00`}
                                      value={`${isCurrency} ${product.itemTotal}`}
                                      readOnly
                                    />
                                  </div>
                                </td>
                                <td className="product-removal">
                                  <Link
                                    onClick={() => {
                                      setSelectedProducts((prev) => {
                                        const newItems = prev;
                                        newItems.splice(index, 1);
                                        return [...newItems];
                                      });
                                    }}
                                    to="#"
                                    className="btn btn-success"
                                  >
                                    Delete
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tbody>
                          <tr id="newForm" style={{ display: "none" }}>
                            <td className="d-none" colSpan="5">
                              <p>Add New Form</p>
                            </td>
                          </tr>

                          <tr>
                            <td colSpan="4">
                              <Row className="mt-3 mx-auto">
                                <Col lg={12}>
                                  <div className="mb-2">
                                    <Label
                                      for="choices-payment-type"
                                      className="form-label text-muted text-uppercase fw-semibold"
                                    >
                                      Select Products and Services
                                    </Label>
                                    <div className="input-light">
                                      <AsyncSelect
                                        className="mb-0"
                                        value={{
                                          value: selectedOption || "",
                                          label: selectedOption?.displayName || "",
                                        }}
                                        placeholder="Type to search"
                                        onChange={(e) => {
                                          setSelectedOption(e.value);
                                          setSelectedProducts((prevArray) => [...prevArray, e.value]);
                                        }}
                                        loadOptions={async (inputValue) => {
                                          try {
                                            const response1Promise = axios.get(
                                              config.api.API_URL + `/item?search=${inputValue}&searchBy=displayName`,
                                            );

                                            const response2Promise = axios.get(
                                              config.api.API_URL +
                                                `/api/tools?search=${inputValue},assessments&searchBy=displayName,category`,
                                            );

                                            const response3Promise = axios.get(
                                              config.api.API_URL +
                                                `/data/services?search=${inputValue}&searchBy=displayName`,
                                            );

                                            const [response1, response2, response3] = await Promise.all([
                                              response1Promise,
                                              response2Promise,
                                              response3Promise,
                                            ]);

                                            let groupedOptions = [];

                                            if (response1.data && response1.data.length > 0) {
                                              const options1 = response1.data.map((item) => ({
                                                label: item.displayName,
                                                value: item,
                                              }));
                                              groupedOptions.push({
                                                label: "Medicines",
                                                options: options1,
                                              });
                                            }

                                            if (response2.data && response2.data.length > 0) {
                                              const options2 = response2.data.map((tool) => ({
                                                label: tool.displayName,
                                                value: tool,
                                              }));
                                              groupedOptions.push({
                                                label: "Lab Orders",
                                                options: options2,
                                              });
                                            }

                                            if (response3.data && response3.data.length > 0) {
                                              const options3 = response3.data.map((service) => ({
                                                label: service.displayName,
                                                value: service,
                                              }));
                                              groupedOptions.push({
                                                label: "Other Services",
                                                options: options3,
                                              });
                                            }

                                            return groupedOptions; // Return the final grouped options
                                          } catch (error) {
                                            console.error("Error loading options:", error);
                                            return [];
                                          }
                                        }}
                                        isClearable
                                        isSearchable
                                      />
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </td>
                            <td colSpan="2" className="p-0">
                              <hr />
                              <Table
                                className="table-border table-sm table-nowrap align-middle mb-0 mt-3"
                                style={{ marginLeft: "2rem" }}
                              >
                                <tbody>
                                  <tr>
                                    <th scope="row">Sub Total</th>
                                    <td style={{ width: "150px" }}>
                                      <Input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        id="cart-subtotal"
                                        placeholder={`${isCurrency}0.00`}
                                        readOnly
                                        value={`${isCurrency} ${itemTotalCalculator(selectedProducts)}`}
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <th scope="row">
                                      Discount <small className="text-muted">(Psymate15)</small>
                                    </th>
                                    <td>
                                      <Input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        id="cart-discount"
                                        placeholder={`${isCurrency}0.00`}
                                        value={dis}
                                        onChange={(e) => setDis(e.target.value)}
                                      />
                                    </td>
                                  </tr>
                                  <tr className="border-top border-top-dashed">
                                    <th scope="row">Total Amount</th>
                                    <td>
                                      <Input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        id="cart-total"
                                        placeholder={`${isCurrency}0.00`}
                                        onChange={(e) => {
                                          setTotal(e.target.value);
                                        }}
                                        value={total}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                          <tr className="border-top border-top-dashed mt-2">
                            <td colSpan="5"></td>
                            <td colSpan="4">
                              <Button color="primary" className="mt-1" onClick={() => setInvoiceModal(true)}>
                                Add Payment Method
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <hr />
                    <Row className="">
                      <Col lg={4}>
                        <div className="mb-2">
                          <PaymentForm
                            isOpen={invoiceModal}
                            state={state}
                            setState={setState}
                            setInvoiceModal={setInvoiceModal}
                          />
                          <Label
                            for="choices-payment-type"
                            className="form-label text-muted text-uppercase fw-semibold mt-4"
                          >
                            Amount Paid
                          </Label>
                          <div>
                            <Input
                              type="text"
                              disabled
                              className="form-control bg-light border-0"
                              id="cart-shipping"
                              placeholder={`${isCurrency}0.00`}
                              value={`${isCurrency} ${state.amtPaid}`}
                            />
                          </div>
                        </div>
                        <div>
                          <Input
                            className="form-control  bg-light border-0"
                            type="text"
                            value={`${isCurrency} ${total}`}
                            id="amountTotalPay"
                            placeholder={`${isCurrency}0.00`}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-4">
                      <Label for="notes" className="form-label text-muted text-uppercase fw-semibold">
                        NOTES
                      </Label>
                      <Input
                        type="textarea"
                        className="form-control alert alert-info"
                        id="notes"
                        placeholder="Add Additional notes to the patients"
                        value={notes || ""}
                        onChange={(e) => {
                          setNotes(e.target.value);
                        }}
                        rows="2"
                      />
                    </div>
                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <button type="submit" className="btn btn-success">
                        <i className="ri-printer-line align-bottom me-1"></i> Save
                      </button>
                      <Link to="#" className="btn btn-primary">
                        <i className="ri-download-2-line align-bottom me-1"></i> Download Invoice
                      </Link>
                      <Link to="#" className="btn btn-danger">
                        <i className="ri-send-plane-fill align-bottom me-1"></i> Send Invoice
                      </Link>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </CardBody>
    </Card>
  );
};

export default InvoiceCreate;
