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

const Combo = ({ id, width, time }) => {
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
    evening: false,
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

  useEffect(() => {
    dispatch(getTeamData());
    dispatch(getProducts());
    dispatch(getEstablishments());
    getPatient();
  }, [dispatch, loading, id]);

  const getPatient = async () => {
    await axios.get(config.api.API_URL + `/users?id=${userId}`).then((res) => {
      setPatient(res.data[0]);
    });
  };

  document.title = "Create Combo | Psymate - Management Portal";
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      psyID: userProfile?.psyID || "",
      displayName: "",
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
        createdBy: userProfile._id,
        items: selectedProducts,
        displayName: values.displayName || "",
        notes: values.notes || "",
        type: "combos",
      };
      await axios
        .post(`${config.api.API_URL}/data/combo`, payload)
        .then((res) => {
          toast.success("Combo Generated");
        })
        .catch((err) => {
          toast.error("Combo not Generated");
        });
      validation.resetForm();
    },
  });
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div className={id ? id : "page-content"}>
      <Container fluid>
        {!id && <BreadCrumb title="Create Combo" pageTitle="Combos" />}
        <Row className="justify-content-center">
          <Col xxl={width ? width : 9}>
            <Card>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
                className="needs-validation"
                id="combo_form"
              >
                <CardBody>
                  <div>
                    <Label for="displayName" className="form-label text-muted text-uppercase fw-semibold">
                      Combo Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="displayName"
                      required="true"
                      placeholder="Enter the name of the combo"
                      value={validation.values.displayName || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                    />
                  </div>
                </CardBody>
                <CardBody>
                  <div className="">
                    <Table className="combo-table table-borderless table-nowrap mb-0">
                      <thead className="align-middle">
                        <tr className="table-active">
                          <th scope="col" style={{ width: "50px" }}>
                            #
                          </th>
                          <th scope="col">Product Details</th>
                          <th scope="col" style={{ width: "120px" }}>
                            <div className="d-flex currency-select input-light align-items-center">Dosage</div>
                          </th>
                          <th scope="col" style={{ width: "120px" }}>
                            <div className="d-flex currency-select input-light align-items-center">Duration</div>
                          </th>
                          <th scope="col" style={{ width: "120px" }}>
                            Routine
                          </th>
                          <th scope="col" className="text-end" style={{ width: "105px" }}></th>
                        </tr>
                      </thead>
                      <tbody id="newlink">
                        {selectedProducts?.map((product, index) => {
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
                                  disabled={product.category === "assessments"}
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
                              </td>
                              <td>
                                <Input
                                  type="number"
                                  className="form-control product-price bg-light border-0"
                                  placeholder="0.00"
                                  id="productRate-1"
                                  step="0.01"
                                  disabled={product.category === "assessments"}
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
                                  isDisabled={product.category === "assessments"}
                                  options={durationFormat}
                                  id="choices-payment-currency"
                                  className="form-selectborder-0 mt-3 bg-light"
                                />
                                <div className="invalid-feedback">Please enter a rate</div>
                              </td>
                              <td className="d-flex flex-wrap">
                                {["morning", "afternoon", "evening", "night"].map((routine) => {
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
                                        disabled={product.category === "assessments"}
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
                                        disabled={product.category === "assessments"}
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
                                        disabled={product.category === "assessments"}
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
                    </Table>
                    <div className="my-2">
                      <Label for="choices-payment-type" className="form-label text-muted text-uppercase fw-semibold">
                        Select Items To add
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
                                config.api.API_URL + `/data/services?search=${inputValue}&searchBy=displayName`,
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

export default Combo;
