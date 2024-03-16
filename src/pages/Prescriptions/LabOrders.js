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

const LabOrders = ({ user, width, time }) => {
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(window.location.search);

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
      logo:
        establishment?.logo ||
        "https://ik.imagekit.io/jybala7h3/psymate-logo-white_JVApKhT3e_eDlzx9shh.png?updatedAt=1680327160872",
    },
    onSubmit: async (values) => {
      const payload = {
        user: userId,
        careManager: userProfile._id,
        createdBy: time.userId[1],
        date: values.date,
        company: establishment._id,
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
              <div className="">
                <Table className="prescription-table table-borderless table-nowrap">
                  <thead className="align-middle">
                    <tr className="table-active">
                      <th scope="col" style={{ width: "50px" }}>
                        #
                      </th>
                      <th scope="col">Lab Test</th>
                      <th scope="col">
                        <div className="d-flex currency-select input-light align-items-center">Instruction</div>
                      </th>
                      <th scope="col" style={{ width: "50px" }}></th>
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
                          </td>
                          <td>
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
                  <tbody>
                    <tr id="newForm" style={{ display: "none" }}>
                      <td className="d-none" colSpan="5">
                        <p>Add New Form</p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5">
                        <div>
                          <Label
                            for="choices-payment-type"
                            className="form-label text-muted text-uppercase fw-semibold"
                          >
                            Select Lab Tests
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
                                  const response = await axios.get(
                                    config.api.API_URL +
                                      `/api/tools?search=${inputValue},assessments&searchBy=displayName,category`,
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
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="mt-4">
                <Label for="exampleFormControlTextarea1" className="form-label text-muted text-uppercase fw-semibold">
                  NOTES
                </Label>
                <Input
                  type="textarea"
                  className="form-control alert alert-info"
                  id="exampleFormControlTextarea1"
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
        </Col>
      </Row>
    </div>
  );
};

export default LabOrders;
