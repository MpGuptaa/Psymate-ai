import React from "react";
import { Input, Label } from "reactstrap";

const Quantity = ({ isContainerEnabled }) => {
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
                    Min Quantity
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
                    Max Quantity
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
                    Reorder Days
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
                    Reorder Quantity
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

export default Quantity;
