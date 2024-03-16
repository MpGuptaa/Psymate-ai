import React from "react";
import { Col, Input, Label, Row } from "reactstrap";

const Discount = ({ isContainerEnabled }) => {
  const unitDecimal = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
  return (
    <div className={isContainerEnabled ? "" : "disabled-tab"}>
      <div className="tab-pane fade show advacnceInfo">
        <div className="row mr-0 mr-sm-n3 d-flex align-items-stretch mb-2">
          <div className="col-md-6 col-lg-12">
            <div className="row">
              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Discount
                  </Label>
                  <div className="col-8 col-sm-7">
                    <Row>
                      <Col>
                        <select
                          className=" form-select form-control ng-untouched ng-pristine ng-valid"
                          aria-label="Default select example"
                        >
                          {unitDecimal.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                          <i className="las la-angle-down"></i>
                        </select>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Item Disc 1 %{" "}
                  </Label>
                  <div className="col-8 col-sm-7">
                    <Input
                      autoComplete="off "
                      className="form-control ng-untouched ng-pristine ng-valid"
                      //   value={}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 pr-0">
                <div className="form-group-cont row m-0">
                  <Label
                    className="col-4 col-sm-5 col-form-label"
                    style={{ padding: "10px" }}
                  >
                    Max Disc%{" "}
                  </Label>
                  <div className="col-8 col-sm-7">
                    <Input
                      autoComplete="off "
                      className="form-control ng-untouched ng-pristine ng-valid"
                      //   value={}
                    />
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

export default Discount;
