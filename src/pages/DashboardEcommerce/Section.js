import React from "react";
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import Flatpickr from "react-flatpickr";
import UploadCSV from "../../helpers/UploadCSV";

const Section = (props) => {
  return (
    <React.Fragment>
      <Row className="mb-3 pb-1">
        <Col xs={12}>
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">
                Good Morning, {props?.userProfile?.displayName}!
              </h4>
              <p className="text-muted mb-0">
                Here's what's happening with your store today.
              </p>
            </div>
            <div className="mt-3 mt-lg-0">
              <form action="#">
                <Row className="g-3 mb-0 align-items-center">
                  <div className="col-sm-auto">
                    <div className="input-group">
                      <Flatpickr
                        className="form-control border-0 fs-13 dash-filter-picker shadow"
                        options={{
                          mode: "range",
                          dateFormat: "d M, Y",
                          defaultDate: ["01 Jan 2022", "31 Jan 2022"],
                        }}
                      />
                      <div className="input-group-text bg-secondary border-secondary text-white">
                        <i className="ri-calendar-2-line"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <a
                      href="/apps-ecommerce-add-product"
                      type="button"
                      className="btn btn-soft-success"
                    >
                      <i className="ri-add-circle-line align-middle me-1"></i>
                      Add Product
                    </a>
                  </div>
                  <div className="col-auto">
                    <a
                      href="/apps-ecommerce-add-salt"
                      type="button"
                      className="btn btn-soft-success"
                    >
                      <i className="ri-add-circle-line align-middle me-1"></i>
                      Add Salt
                    </a>
                  </div>
                  <div className="col-auto">
                  <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn btn-soft-info"
                    tag="button"
                  >
                    <i className="ri-more-2-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem className="dropdown-item" href="#" style={{fontSize:"16px", fontWeight:"600"}}>
                      Product
                    </DropdownItem>
                    <DropdownItem className="dropdown-item" href="#" style={{fontSize:"16px", fontWeight:"600"}}>
                      Rehab
                    </DropdownItem>
                    <DropdownItem className="dropdown-item" href="#" style={{fontSize:"16px", fontWeight:"600"}}>
                     Lab
                    </DropdownItem>
                    <DropdownItem className="dropdown-item" href="#" style={{fontSize:"16px", fontWeight:"600"}}>
                     Financial
                    </DropdownItem>
                    <DropdownItem className="dropdown-item" href="#" style={{fontSize:"16px", fontWeight:"600"}}>
                     Psymate Time
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn"
                      onClick={props.rightClickBtn}
                    >
                      <i className="ri-pulse-line"></i>
                    </button>
                  </div>
                </Row>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
