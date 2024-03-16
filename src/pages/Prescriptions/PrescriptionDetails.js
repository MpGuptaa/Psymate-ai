import React, { useEffect, useState } from "react";
import { CardBody, Row, Col, Card, Table, CardHeader, Container, Label, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useProfile } from "../../Components/Hooks/UserHooks";
import AsyncSelect from "react-select/async";
import { getAllUniqueTagsLowercased } from "../../helpers/Helper";
import ChildrenModal from "../../Components/Common/ChildrenModal";
import Tools from "../Forms/Builder/Tools";
import Share from "../../Components/Common/Share";

const PrescriptionDetails = () => {
  document.title = "Prescription Details";
  //Print the Prescription

  const { loading } = useProfile();

  const [order, setOrder] = useState([]);

  const searchParams = new URLSearchParams(window.location.search);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const orderId = searchParams.get("id");

  const getOrder = async () => {
    await axios.get(config.api.API_URL + `/prescriptions?number=${orderId}`).then((res) => {
      setOrder(res.data[0]);
    });
    await axios.get(config.api.API_URL + `/timeline?search=${`RX-${orderId}`}&searchBy=postId`).then((res) => {
      setTimeline(res.data[0]);
    });
  };
  useEffect(() => {
    getOrder();
  }, [loading]);

  const type = getAllUniqueTagsLowercased(order?.items, "undefined", "type");
  const category = getAllUniqueTagsLowercased(order?.items, "undefined", "category");
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Prescription Details" pageTitle="Prescriptions" />
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Col xs={12}>
              <div className="mb-3">
                <Label className="form-label">Search For Prescriptions</Label>
                <AsyncSelect
                  className="mb-0"
                  value={{
                    value: selectedOption,
                    label: selectedOption?.number,
                  }}
                  placeholder="Search For Patients"
                  onChange={(e) => {
                    setOrder(e.value);
                    setSelectedOption(e.value);
                  }}
                  loadOptions={async (inputValue) => {
                    try {
                      const response = await axios.get(config.api.API_URL + `/prescriptions?search=${inputValue}`);
                      const data = response.data;
                      const options = data.map((item) => ({
                        value: item,
                        label: item.number,
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
            {order && (
              <Card id="demo">
                <Row>
                  <Col lg={12}>
                    <CardHeader className="border-bottom-dashed p-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="flex-grow-1 text-center">
                          <img
                            src={order?.company?.logo}
                            className="card-logo card-logo-dark mx-auto"
                            alt="logo dark"
                            height="55"
                          />
                          {order?.company?.website}
                        </div>
                      </div>
                    </CardHeader>
                  </Col>
                  <Col lg={12}>
                    <CardHeader className="border-bottom-dashed p-4 d-flex justify-content-between">
                      <h5 className="text-muted text-uppercase fw-semibold">For Appointment</h5>
                      <h5 className="text-muted text-uppercase fw-semibold">+91 {order?.createdBy?.phone}</h5>
                    </CardHeader>
                  </Col>
                  <Col lg={12}>
                    <CardHeader className="border-bottom-dashed p-4">
                      <h2 className="text-muted text-uppercase fw-semibold">Dr. {order?.createdBy?.displayName}</h2>
                      <NavLink
                        to={order?.company?.directions}
                        target="_blank"
                        className="text-muted mb-1"
                        id="address-details"
                      >
                        {order?.company?.establishmentAddress}
                      </NavLink>
                      <p className="text-muted mb-0" id="zip-code">
                        <span>Zip-code:</span> 90201
                      </p>
                    </CardHeader>
                  </Col>
                  <Col lg={12}>
                    <CardBody className="border-top-bottom p-4">
                      <Row className="g-3">
                        <Col lg={3} className="col-6">
                          <h5 className="fs-14 mb-0">
                            <span id="prescription-no">Patient Name</span>
                          </h5>
                          <p className="text-muted mb-2 text-uppercase fw-semibold">
                            {order?.user?.displayName || "--"}
                          </p>
                        </Col>
                        <Col lg={3} className="col-6">
                          <h5 className="fs-14 mb-0">
                            <span id="prescription-date">Age/Gender</span>
                            <p className="text-muted mb-2 text-uppercase fw-semibold">
                              {`${order?.user?.age || "--"} / ${order?.user?.gender || "--"}`}
                            </p>
                          </h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <h5 className="fs-14 mb-0">
                            <span id="total-amount"> PSY ID</span>
                          </h5>
                          <p className="text-muted mb-2 text-uppercase fw-semibold">{`${order?.user?.psyID}`}</p>
                        </Col>
                        <Col lg={3} className="col-6">
                          <h5 className="fs-14 mb-0">
                            <span id="total-amount"> Date</span>
                          </h5>
                          <p className="text-muted mb-2 text-uppercase fw-semibold">
                            {`${new Date(order?.createdAt).toDateString()}`}
                          </p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Col>
                  {/* <Col lg={12}>
                    <CardBody className="p-4">
                      <Row className="g-3">
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold">
                            Prescription No
                          </p>
                          <h5 className="fs-14 mb-0">
                            #VL<span id="prescription-no">{order?.number}</span>
                          </h5>
                        </Col>
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold">
                            Date
                          </p>
                          <h5 className="fs-14 mb-0">
                            <span id="prescription-date">
                              {new Date(order?.date).toDateString()}
                            </span>{" "}
                            <small
                              className="text-muted"
                              id="prescription-time"
                            >
                              {new Date(order?.date).toTimeString()}
                            </small>
                          </h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold">
                            Estimated Cost
                          </p>
                          <h5 className="fs-14 mb-0">
                            <span id="total-amount">{`Rs. ${order?.estimatedCost}`}</span>
                          </h5>
                        </Col>
                      </Row>
                    </CardBody>
                  </Col> */}

                  <Col lg={12}>
                    <CardBody className="p-4">
                      {type.includes("goods") && (
                        <div className="table-responsive">
                          <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                            <thead>
                              <tr className="table-active">
                                <th scope="col" style={{ width: "50px" }}>
                                  RX
                                </th>
                                <th scope="col">Drug Name</th>
                                <th scope="col">Dosage</th>
                                <th scope="col">Morning</th>
                                <th scope="col">Afternoon</th>
                                <th scope="col">Evening</th>
                                <th scope="col">Night</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Instructions</th>
                              </tr>
                            </thead>
                            <tbody id="products-list">
                              {order?.items
                                ?.filter((i) => i.type === "goods")
                                ?.map((product, index) => (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td className="text-start">
                                      <span className="fw-medium">{product.displayName}</span>
                                      <p className="text-muted mb-0">{product.composition}</p>
                                    </td>
                                    <td>{`${product.dosage}`}</td>
                                    <td>{`${product.morning}`}</td>
                                    <td>{`${product.afternoon}`}</td>
                                    <td>{`${product.evening}`}</td>
                                    <td>{`${product.night}`}</td>
                                    <td>{`${product.duration || "-"} ${product.durationFormat || "-"}`}</td>
                                    <td>{`${product?.instructions || "--"}`}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                      {category.includes("assessments") && (
                        <div className="table-responsive mt-5">
                          <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                            <thead>
                              <tr className="table-active">
                                <th scope="col" style={{ width: "50px" }}>
                                  Index
                                </th>
                                <th scope="col">Lab Order Name</th>
                                <th scope="col">Instructions</th>
                              </tr>
                            </thead>
                            <tbody id="products-list">
                              {order?.items
                                ?.filter((i) => i.category === "assessments")
                                ?.map((product, index) => (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td className="text-center">{product.displayName}</td>
                                    <td>{`${product?.instructions || "--"}`}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </div>
                      )}

                      {(order?.weight ||
                        order?.bloodPressure ||
                        order?.pulse ||
                        order?.respRate ||
                        order?.temperature) && (
                        <div className="mt-5 table-responsive">
                          <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                            <thead>
                              <tr className="table-active">
                                {order?.weight && <th scope="col">Weight</th>}
                                {order?.bloodPressure && <th scope="col">BloodPressure</th>}
                                {order?.pulse && <th scope="col">Pulse</th>}
                                {order?.respRate && <th scope="col">RespRate</th>}
                                {order?.temperature && <th scope="col">Temperature</th>}
                              </tr>
                            </thead>
                            <tbody id="products-list">
                              <tr>
                                {order?.weight && <td>{order?.weight || "--"}</td>}
                                {order?.bloodPressure && <td>{order?.bloodPressure || "--"}</td>}
                                {order?.pulse && <td>{order?.pulse || "--"}</td>}
                                {order?.respRate && <td>{order?.respRate || "--"}</td>}
                                {order?.temperature && <td>{order?.temperature || "--"}</td>}
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      )}
                      {(order?.complaints || order?.diagnoses || order?.observations || order?.notes) && (
                        <div className="">
                          {["complaints", "diagnoses", "observations", "notes"].map(
                            (note) =>
                              order?.[note] && (
                                <div key={note} className="mt-5">
                                  <div className="alert alert-primary">
                                    <p className="mb-0">
                                      <span className="fw-semibold text-capitalize">{note}: </span>
                                      <span id="note">{order?.[note]}</span>
                                    </p>
                                  </div>
                                </div>
                              ),
                          )}
                        </div>
                      )}
                      <Share timeline={timeline} />
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

export default PrescriptionDetails;
