import React, { useState } from "react";
import "./product.css";
import { Button, Col, Input, Label, Row } from "reactstrap";
import Discount from "./discount";
import Quantity from "./quantity";
import OtherInfo from "./otherInfo";
const Product = () => {
  const [selectedValue, setSelectedValue] = useState(""); // Initialize the selected value state
  const tabNames = ["Discount", "Quantity", "Other Info"];
  const [selectedTab, setSelectedTab] = useState("Discount");

  const [isContainerEnabled, setIsContainerEnabled] = useState(false); // Initial state is enabled

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleCheckboxChange = () => {
    setIsContainerEnabled(!isContainerEnabled);
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value); // Update the selected value when the user makes a selection
  };

  const productOptions = [
    { value: "1", label: "Goods" },
    { value: "2", label: "Services" },
  ];

  const unitDecimal = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
  return (
    <div className="main-wrapper">
      <div className="item-container">
        <div className="fixWidth">
          <div className="windowBox">
            <div className="d-flex align-items-center pageHeader ng-star-inserted">
              <h1 className="mhead mb-2 flex-grow-1 page-heading">
                Modify Item
              </h1>
              <div className="headbtns pr-0">
                <Button color="danger">BacK</Button>
              </div>
            </div>
            <div className="innterContainer createItem pt-3">
              <div className="box-row">
                <div className="col-lg-8">
                  <div className="borderLable pb-0 mb-3">
                    <span className="myLable">Basic Info</span>
                    <div className="form-group-cont row m-0">
                      <Label className="col-sm-2 pl-0 col-form-label">
                        Product
                        <span className="redColor">*</span>
                      </Label>
                      <div className="col-sm-8 prodDrop mb-2 mb-sm-0 px-0">
                        <Input
                          autoComplete="off "
                          className="form-control ng-untouched ng-pristine ng-valid"
                          //   value={}
                        />
                      </div>
                      <div className="col-sm-2 prodDrop pr-0 pl-0 pl-sm-3">
                        <div className="input-group-append">
                          <Row>
                            <Col>
                              <select
                                className="form-control ng-untouched ng-pristine ng-valid"
                                aria-label="Default select example"
                              >
                                {productOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div className="border-bottomnew my-3 col-md-12"></div>
                      <div className="row mb-3">
                        <div className="col-sm-7 pr-4 pr-sm-0 border-rightnew">
                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Package
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Unit 1st
                              <span className="redColor">*</span>
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Unit-2
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Conversion
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Unit in Decimal
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Row>
                                <Col>
                                  <select
                                    className=" form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                  >
                                    {unitDecimal.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                    <i className="las la-angle-down"></i>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              HSN/SAC
                              <span className="redColor">*</span>
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Tax Category
                              <span className="redColor">*</span>
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Company
                              <span className="redColor">*</span>
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label className="col-4 col-sm-3 col-form-label">
                              Salt
                            </Label>
                            <div className="col-6  col-sm-5">
                              <Input
                                className="form-control ng-untouched ng-pristine ng-valid"
                                //   value={}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-5 pr-sm-4">
                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              M.R.P
                            </Label>
                            <div className="col-8 pr-0 ">
                              <div className="poRelative">
                                <div className="input-group">
                                  {/* <div className="input-group-prepends">
                                    <div className="input-group-text">INR</div>
                                  </div> */}
                                  <Input
                                    placeholder="0.00"
                                    className="form-control text-right blueColor ng-untouched ng-pristine ng-valid align-text-input"
                                    //   value={}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Purchase Rate{" "}
                            </Label>
                            <div className="col-8 pr-0 ">
                              <div className="poRelative">
                                <div className="input-group">
                                  {/* <div className="input-group-prepends">
                                    <div className="input-group-text">INR</div>
                                  </div> */}
                                  <Input
                                    placeholder="285.00"
                                    className="form-control text-right blueColor ng-untouched ng-pristine ng-valid align-text-input"
                                    //   value={}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Cost
                            </Label>
                            <div className="col-8 pr-0 ">
                              <div className="poRelative">
                                <div className="input-group">
                                  {/* <div className="input-group-prepends">
                                    <div className="input-group-text">INR</div>
                                  </div> */}
                                  <Input
                                    placeholder="285.00"
                                    className="form-control text-right blueColor ng-untouched ng-pristine ng-valid align-text-input"
                                    //   value={}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              S.Rate{" "}
                            </Label>
                            <div className="col-8 pr-0 ">
                              <div className="poRelative">
                                <div className="input-group">
                                  {/* <div className="input-group-prepends">
                                    <div className="input-group-text">INR</div>
                                  </div> */}
                                  <Input
                                    placeholder="0.00"
                                    className="form-control text-right blueColor ng-untouched ng-pristine ng-valid align-text-input"
                                    //   value={}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Narcotis
                            </Label>
                            <div className="col-8 pr-0 ">
                              <Row>
                                <Col>
                                  <select
                                    className=" form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                  >
                                    {unitDecimal.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                    <i className="las la-angle-down"></i>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Schedule H
                            </Label>
                            <div className="col-8 pr-0 ">
                              <Row>
                                <Col>
                                  <select
                                    className=" form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                    value={selectedValue}
                                    onChange={handleSelectChange}
                                  >
                                    {unitDecimal.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                    <i className="las la-angle-down"></i>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Schedule H1
                            </Label>
                            <div className="col-8 pr-0 ">
                              <Row>
                                <Col>
                                  <select
                                    className=" form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                    value={selectedValue}
                                    onChange={handleSelectChange}
                                  >
                                    {unitDecimal.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                    <i className="las la-angle-down"></i>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Storage Type
                            </Label>
                            <div className="col-8 pr-0 ">
                              <Row>
                                <Col>
                                  <select
                                    className=" form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                    value={selectedValue}
                                    onChange={handleSelectChange}
                                  >
                                    {unitDecimal.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                    <i className="las la-angle-down"></i>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Status
                            </Label>
                            <div className="col-8 pr-0 ">
                              <Row>
                                <Col>
                                  <select
                                    className=" form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                    value={selectedValue}
                                    onChange={handleSelectChange}
                                  >
                                    {unitDecimal.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                    <i className="las la-angle-down"></i>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              Color Type
                            </Label>
                            <div className="col-8 pr-0 ">
                              <Row>
                                <Col>
                                  <select
                                    className=" form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                    value={selectedValue}
                                    onChange={handleSelectChange}
                                  >
                                    {unitDecimal.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                    <i className="las la-angle-down"></i>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          <div className="form-group-cont row m-0">
                            <Label
                              className="col-4 col-sm-3 col-form-label"
                              style={{ width: "112px" }}
                            >
                              TB Item
                            </Label>
                            <div className="col-8 pr-0 ">
                              <Row>
                                <Col>
                                  <select
                                    className="form-select form-control ng-untouched ng-pristine ng-valid"
                                    aria-label="Default select example"
                                  >
                                    <option>Select your Status </option>
                                    <option defaultValue="1">
                                      Declined Payment
                                    </option>
                                    <option defaultValue="2">
                                      Delivery Error
                                    </option>
                                    <option defaultValue="3">
                                      Wrong Amount
                                    </option>
                                  </select>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 pl-md-0">
                  <div className="borderLable px-0 pb-0 mb-3">
                    <div className="myLable d-flex align-items-center">
                      <div className="form-check form-check-danger mb-3">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="formCheck10"
                          onChange={handleCheckboxChange}
                          checked={isContainerEnabled}
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="formCheck10"
                        >
                          Advance Info
                        </Label>
                      </div>
                    </div>
                    <div className="">
                      <div className="navbar-container">
                        {tabNames.map((tabName) => (
                          <div
                            key={tabName}
                            className={`navbar-item ${
                              selectedTab === tabName ? "active" : ""
                            } ${!isContainerEnabled ? "disabled-tab" : ""}`}
                            onClick={() =>
                              isContainerEnabled && handleTabClick(tabName)
                            }
                          >
                            {tabName}
                          </div>
                        ))}
                      </div>

                      <div className="tab-content-container">
                        {selectedTab === "Discount" && (
                          <Discount isContainerEnabled={isContainerEnabled} />
                        )}
                        {selectedTab === "Quantity" && (
                          <Quantity isContainerEnabled={isContainerEnabled} />
                        )}
                        {selectedTab === "Other Info" && (
                          <OtherInfo isContainerEnabled={isContainerEnabled} />
                        )}{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
