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

const PrescriptionCreate = ({ id, width, time, callBack }) => {
  console.log(id, width, time, callBack);
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  // Get a specific parameter value
  const userId = id ? id : searchParams.get("id");
  const { userProfile, loading } = useProfile();
  const [establishment, setEstablishment] = useState([]);
  const [isCurrency, setisCurrency] = useState("$");
  const [patient, setPatient] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState({
    morning: false,
    afternoon: false,
    night: false,
  });
  const toggle = (routine) => {
    setTooltipOpen({ [routine]: !tooltipOpen[routine] });
  };
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

  const { establishments } = useSelector((state) => ({
    establishments: state.Establishment?.establishments,
  }));

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
    // getPatient();
  }, [dispatch, loading, id]);

  document.title = "Create Prescription | Psymate - Management Portal";
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
      logo:
        establishment?.logo ||
        "https://ik.imagekit.io/jybala7h3/psymate-logo-white_JVApKhT3e_eDlzx9shh.png?updatedAt=1680327160872",
    },
    onSubmit: async (values) => {
      const payload = {
        user: userId,
        createdBy: time.userId[1],
        careManager: userProfile._id,
        date: values.date,
        company: establishment._id,
        items: selectedProducts,
        addToCart: false,
        appointment: time.postId,
        notes: values.notes || "",
        type: "prescriptions",
        estimatedCost: itemTotalCalculator(selectedProducts),
      };
      dispatch(onAddNewPrescription({ data: payload }));
      callBack && callBack();
      validation.resetForm();
    },
  });
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div className={id ? id : "page-content"}>
      <Container fluid>
        {!id && <BreadCrumb title="Create Prescription" pageTitle="Prescriptions" />}
        <Row className="justify-content-center">
          <Col xxl={width ? width : 9}>
            <Row className="mt-3 mx-auto">
              {!id && (
                <Col xs={4}>
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
            </Row>

            <Card>
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
                  <Row className="g-3">
                    <Col lg={4}>
                      <div className="mb-2">
                        <Label for="choices-payment-type" className="form-label text-muted text-uppercase fw-semibold">
                          Choose Organization
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
                  </Row>
                </CardBody>
                <CardBody>
                  <div className="">
                    <Table className="prescription-table table-borderless table-nowrap mb-0">
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
                                    invalid={
                                      validation.errors.product_name && validation.touched.product_name ? true : false
                                    }
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
                                      <Tooltip
                                        isOpen={tooltipOpen[routine]}
                                        target={routine}
                                        toggle={() => toggle(routine)}
                                      >
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
                                            const newQuantity =
                                              prev[index][routine] - 1 >= 0 ? prev[index][routine] - 1 : 0;
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
                      </tbody>
                    </Table>
                    <div className="my-2">
                      <Label for="choices-payment-type" className="form-label text-muted text-uppercase fw-semibold">
                        Select medicines
                      </Label>
                      <div className="input-light">
                        <AsyncSelect
                          className="mb-0"
                          value={{
                            value: selectedOption,
                            label: selectedOption?.displayName,
                          }}
                          placeholder="Search For Patients"
                          onChange={(e) => {
                            if (e.type === "combo") {
                              setSelectedOption(e.value.items);
                              setSelectedProducts((prevArray) => [...prevArray, ...e.value.items]);
                            } else {
                              setSelectedOption(e.value);
                              setSelectedProducts((prevArray) => [...prevArray, e.value]);
                            }
                          }}
                          loadOptions={async (inputValue) => {
                            try {
                              // Fetch options from the first API (patients)
                              const response1 = await axios.get(
                                config.api.API_URL + `/item?search=${inputValue}&searchBy=displayName`,
                              );
                              const data1 = response1.data;

                              // Map and format options for patients
                              const options1 = data1.map((item) => ({
                                label: item.displayName,
                                type: "goods",
                                value: item,
                              }));

                              // Fetch options from the second API (tools)
                              const response2 = await axios.get(
                                config.api.API_URL + `/data/combo?search=${inputValue}&searchBy=displayName`,
                              );
                              const data2 = response2.data;

                              // Map and format options for tools
                              const options2 = data2.map((tool) => ({
                                label: tool.displayName,
                                type: "combo",
                                value: tool,
                              }));

                              // Combine options from both APIs and group them
                              const groupedOptions = [
                                {
                                  label: "Combo",
                                  options: options2,
                                },
                                {
                                  label: "Medicines",
                                  options: options1,
                                },
                              ];

                              return groupedOptions; // Return grouped options
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
                  </div>

                  <div className="mt-4">
                    <Label for="notes" className="form-label text-muted text-uppercase fw-semibold">
                      NOTES
                    </Label>
                    <Input
                      type="textarea"
                      className="form-control alert alert-info"
                      id="notes"
                      placeholder="Notes"
                      value={validation.values.notes || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      rows="2"
                    />
                  </div>
                  <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                    <button type="submit" className="btn btn-success">
                      <i className="ri-printer-line align-bottom me-1"></i> Save
                    </button>
                  </div>
                </CardBody>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrescriptionCreate;
