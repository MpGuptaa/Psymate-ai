import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { topManufacturers } from "../../common/data";

const TopManufacturers = ({ manufacturers }) => {
  return (
    <React.Fragment>
      <Col xl={6}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card mb-0 flex-grow-1 shadow-none">
              Top Manufacturers
            </h4>
            <div className="flex-shrink-0">
              <UncontrolledDropdown
                className="card-header-dropdown"
                direction="start"
              >
                <DropdownToggle
                  tag="a"
                  className="text-reset dropdown-btn"
                  role="button"
                >
                  <span className="text-muted">
                    Report<i className="mdi mdi-chevron-down ms-1"></i>
                  </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu dropdown-menu-end">
                  <DropdownItem>Download Report</DropdownItem>
                  <DropdownItem>Export</DropdownItem>
                  <DropdownItem>Import</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                <tbody>
                  {manufacturers.map((item, key) => (
                    <tr key={key}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-2">
                            <img
                              src={item.logo}
                              alt=""
                              className="avatar-sm p-2"
                            />
                          </div>
                          <div>
                            <h5 className="fs-14 my-1 fw-medium">
                              <Link to={item.website} className="text-reset">
                                {item.displayName}
                              </Link>
                            </h5>
                            <span className="text-muted">{item.type}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{item.phone}</span>
                      </td>
                      <td>
                        <p className="mb-0">{item.email}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
              <div className="col-sm">
                <div className="text-muted">
                  Showing <span className="fw-semibold">5</span> of{" "}
                  <span className="fw-semibold">25</span> Results
                </div>
              </div>
              <div className="col-sm-auto mt-3 mt-sm-0">
                <ul className="pagination pagination-separated pagination-sm mb-0">
                  <li className="page-item disabled">
                    <Link to="#" className="page-link">
                      ←
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">
                      1
                    </Link>
                  </li>
                  <li className="page-item active">
                    <Link to="#" className="page-link">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">
                      →
                    </Link>
                  </li>
                </ul>
              </div>
            </div> */}
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TopManufacturers;
