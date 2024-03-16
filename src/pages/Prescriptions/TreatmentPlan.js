import React, { useEffect, useState } from "react";

import { CardBody, Row, Col, Card, Container, Form, Input, Label, Table, FormFeedback, Tooltip } from "reactstrap";
import AsyncSelect from "react-select/async";

import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import Select from "react-select";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPrescription as onAddNewPrescription,
  updatePrescription as onUpdatePrescription,
} from "../../store/prescription/action";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { getEstablishments } from "../../store/establishments/action";
import { getProducts, getTeamData } from "../../store/actions";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { inputValueChange, toCamelCase } from "../../helpers/Helper";
import Tools from "../Forms/Builder/Tools";

const TreatmentPlan = ({ clinicalNotes, user, width, time }) => {
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(window.location.search);
  const [state, setState] = useState({});
  const [isCurrency, setisCurrency] = useState("$");
  const durationFormat = [
    {
      options: [
        { label: "Days", value: "days" },
        { label: "Weeks", value: "weeks" },
        { label: "Months", value: "months" },
        { label: "Years", value: "years" },
      ],
    },
  ];

  const dosageFormat = [
    {
      options: [
        { label: "MCG", value: "mcg" },
        { label: "MG", value: "mg" },
        { label: "KG", value: "kg" },
        { label: "TSP", value: "tsl" },
      ],
    },
  ];
  const [tooltipOpen, setTooltipOpen] = useState({
    morning: false,
    afternoon: false,
    night: false,
  });
  const toggle = (routine) => {
    setTooltipOpen({ [routine]: !tooltipOpen[routine] });
  };
  // Get a specific parameter value
  const userId = user ? user._id : searchParams.get("id");
  const { userProfile, loading } = useProfile();
  const [establishment, setEstablishment] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const itemTotalCalculator = (items = []) => {
    let total = 0;
    items.forEach((item) => {
      const itemDiscount = (item.quantity * item.sellingPrice) / 100;
      const itemPrice = item.quantity * item.sellingPrice - (item.discount || 0);
      if (itemPrice) {
        total += itemPrice;
      }
    });
    return total;
  };

  useEffect(() => {
    dispatch(getTeamData());
    dispatch(getProducts());
    dispatch(getEstablishments());
  }, [dispatch, loading, userId]);

  document.title = "Lab Orders | Psymate - Management Portal";
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      psyID: userProfile?.psyID || "",
      displayName: userProfile.displayName,
      email: userProfile?.email || "",
      website: userProfile?.website || "",
      contact: userProfile?.phone || "",
      number: "",
      about: userProfile?.about || "",
      date: "",
      name: "",
      status: "",
      country: "",
      amount: "",
      notes: "",
      product_name: "",
    },
    onSubmit: async (values) => {
      const payload = {
        user: userId,
        careManager: userProfile._id,
        createdBy: time.userId[1],
        date: values.date,
        items: selectedProducts,
        addToCart: false,
        appointment: time.postId,
        notes: values.notes || "",
        type: "labOrder",
        estimatedCost: itemTotalCalculator(selectedProducts),
      };
      dispatch(onAddNewPrescription({ data: payload }));
      toast.success("Prescription Generated");
      validation.resetForm();
    },
  });
  const [clincalInputs, setClincalInputs] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div>
      <Row className="justify-content-center">
        <Col xxl={width ? width : 9}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            className="needs-validation"
            id="prescription_form"
          >
            <CardBody>
              <Table className="prescription-table table-borderless table-nowrap p-0">
                <thead className="align-middle">
                  <tr className="table-active">
                    <th scope="col" style={{ width: "50px" }}>
                      #
                    </th>
                    <th scope="col">Rx</th>
                    <th scope="col" style={{ width: "120px" }}>
                      <div className="d-flex currency-select input-light align-items-center">Dosage</div>
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      Schedule
                    </th>
                    <th scope="col" style={{ width: "120px" }}>
                      <div className="d-flex currency-select input-light align-items-center">Duration</div>
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
                              name="product_name"
                              value={product.displayName || ""}
                              invalid={validation.errors.product_name && validation.touched.product_name ? true : false}
                            />
                            {validation.errors.product_name && validation.touched.product_name ? (
                              <FormFeedback type="invalid">{validation.errors.product_name}</FormFeedback>
                            ) : null}
                          </div>
                          <Input
                            type="textarea"
                            className="form-control bg-light border-0"
                            id="productDetails-1"
                            rows="2"
                            value={product.instructions}
                            onChange={(e) => {
                              let newquantity;
                              newquantity = e.target.value;
                              setSelectedProducts((prev) => {
                                prev[index] = {
                                  ...prev[index],
                                  instructions: newquantity,
                                };
                                return [...prev];
                              });
                            }}
                            placeholder="Instructions"
                          ></Input>
                        </td>
                        <td>
                          <Input
                            type="number"
                            className="form-control product-price bg-light border-0"
                            placeholder="0.00"
                            id="productRate-1"
                            step="0.01"
                            value={product.dosage}
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
                                    dosage: newquantity,
                                  };
                                  return [...prev];
                                });
                              }
                            }}
                          />
                          <Select
                            defaultValue={isCurrency}
                            onChange={(e) => {
                              let newquantity;
                              newquantity = e.value;
                              setSelectedProducts((prev) => {
                                prev[index] = {
                                  ...prev[index],
                                  dosageFormat: newquantity,
                                };
                                return [...prev];
                              });
                            }}
                            value={{
                              label: product.dosageFormat,
                              value: product.dosageFormat,
                            }}
                            options={dosageFormat}
                            id="choices-payment-currency"
                            className="form-selectborder-0 mt-3 bg-light"
                          />
                        </td>
                        <td className="d-flex flex-wrap">
                          {["morning", "afternoon", "night"].map((routine) => {
                            if (!product[routine]) product[routine] = 0;
                            return (
                              <div key={routine} id={routine} className="input-step">
                                <Tooltip isOpen={tooltipOpen[routine]} target={routine} toggle={() => toggle(routine)}>
                                  {routine}
                                </Tooltip>
                                <button
                                  type="button"
                                  className="minus"
                                  onClick={() => {
                                    if (typeof product[routine] !== "number") {
                                      product[routine] = 1;
                                    }
                                    setSelectedProducts((prev) => {
                                      const newQuantity = prev[index][routine] - 1 >= 0 ? prev[index][routine] - 1 : 0;
                                      prev[index] = {
                                        ...prev[index],
                                        [routine]: newQuantity,
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
                                  value={product[routine]}
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
                                          [routine]: newquantity,
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
                                    if (typeof product?.[routine] !== "number") {
                                      product[routine] = 1;
                                    }
                                    setSelectedProducts((prev) => {
                                      const newQuantity = prev[index][routine] + 1;
                                      prev[index] = {
                                        ...prev[index],
                                        [routine]: newQuantity,
                                      };
                                      return [...prev];
                                    });
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            );
                          })}
                        </td>
                        <td>
                          <Input
                            type="number"
                            className="form-control product-price bg-light border-0"
                            placeholder="0.00"
                            id="productRate-1"
                            step="0.01"
                            value={product.duration}
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
                                    duration: newquantity,
                                  };
                                  return [...prev];
                                });
                              }
                            }}
                          />
                          <Select
                            defaultValue={isCurrency}
                            onChange={(e) => {
                              let newquantity;
                              newquantity = e.value;
                              setSelectedProducts((prev) => {
                                prev[index] = {
                                  ...prev[index],
                                  durationFormat: newquantity,
                                };
                                return [...prev];
                              });
                            }}
                            value={{
                              label: product.durationFormat,
                              value: product.durationFormat,
                            }}
                            options={durationFormat}
                            id="choices-payment-currency"
                            className="form-selectborder-0 mt-3 bg-light"
                          />
                          <div className="invalid-feedback">Please enter a rate</div>
                        </td>

                        <td
                          onClick={() => {
                            setSelectedProducts((prev) => {
                              const newItems = prev;
                              newItems.splice(index, 1);
                              return [...newItems];
                            });
                          }}
                          className="product-removal"
                        >
                          <Link to="#" className="btn btn-success">
                            Delete
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="5">
                      <div>
                        <Label for="choices-payment-type" className="form-label text-muted text-uppercase fw-semibold">
                          Select Lab Tests & Medicines
                        </Label>
                        <div className="input-light">
                          <AsyncSelect
                            value={{
                              value: selectedOption,
                              label: selectedOption?.displayName,
                            }}
                            placeholder="Search For Patients"
                            onChange={(e) => {
                              setSelectedOption(e.value);
                              setSelectedProducts((prevArray) => [...prevArray, e.value]);
                            }}
                            loadOptions={async (inputValue) => {
                              try {
                                const response1Promise = axios.get(
                                  config.api.API_URL +
                                    `/api/tools?search=${inputValue},assessments&searchBy=displayName,category`,
                                );

                                const response2Promise = axios.get(
                                  config.api.API_URL + `/item?search=${inputValue}&searchBy=displayName`,
                                );

                                const response3Promise = axios.get(
                                  config.api.API_URL + `/data/combo?search=${inputValue}&searchBy=displayName`,
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
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Tools
                setState={setClincalInputs}
                state={clincalInputs}
                inputs={[
                  {
                    name: "weight",
                    label: "Weight(kg)",
                    element: "number",
                    placeholder: "Enter Reading",
                    width: 12,
                    horizontal: true,
                    colCssClasses: "my-2",
                  },
                  {
                    name: "bloodPressure",
                    label: "Blood Pressure",
                    element: "number",
                    placeholder: "Enter Reading",
                    width: 12,
                    horizontal: true,
                    colCssClasses: "my-2",
                  },
                  {
                    name: "pulse",
                    label: "Pulse",
                    element: "number",
                    placeholder: "Enter Reading",
                    width: 12,
                    horizontal: true,
                    colCssClasses: "my-2",
                  },
                  {
                    name: "temperature",
                    label: "Temperature",
                    element: "number",
                    placeholder: "Enter Reading",
                    width: 12,
                    horizontal: true,
                    colCssClasses: "my-2",
                  },
                  {
                    name: "respRate",
                    label: "Resp. Rate",
                    element: "number",
                    placeholder: "Enter Reading",
                    width: 12,
                    horizontal: true,
                    colCssClasses: "my-2",
                  },
                ]}
              />
              {clinicalNotes.map((establishment) => (
                <div key={establishment._id} className="d-flex  gap-3 pb-4 flex-column" style={{ cursor: "pointer" }}>
                  <p
                    onClick={() => {
                      if (establishment) setEstablishment();
                      else {
                        setEstablishment(establishment);
                      }
                    }}
                    className="ml-2 mb-0 clinic-name-container"
                  >
                    {establishment.establishmentName}
                  </p>
                  {establishment._id === establishment?._id && (
                    <Row>
                      <Col lg={12}>
                        <textarea
                          onChange={(e) => {
                            inputValueChange(e, "text", toCamelCase(establishment.establishmentName), state, setState);
                          }}
                          className="form-control bg-light border-light"
                          id="exampleFormControlTextarea1"
                          rows="3"
                          placeholder={`Enter ${establishment.establishmentName}`}
                        ></textarea>
                      </Col>
                    </Row>
                  )}
                </div>
              ))}
              <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                <button type="submit" className="btn btn-success">
                  <i className="ri-printer-line align-bottom me-1"></i> Save
                </button>
              </div>
            </CardBody>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default TreatmentPlan;
