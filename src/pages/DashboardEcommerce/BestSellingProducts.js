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
import { bestSellingProducts } from "../../common/data";
import { useSelector } from "react-redux";

const BestSellingProducts = ({ products }) => {

  return (
    <React.Fragment>
      <Col xl={6}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              Best Selling Products
            </h4>
            <div className="flex-shrink-0">
              <UncontrolledDropdown
                className="card-header-dropdown"
                direction="start"
              >
                <DropdownToggle tag="a" className="text-reset" role="button">
                  <span className="fw-semibold text-uppercase fs-13">
                    Sort by:{" "}
                  </span>
                  <span className="text-muted">
                    Today<i className="mdi mdi-chevron-down ms-1"></i>
                  </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem>Today</DropdownItem>
                  <DropdownItem>Yesterday</DropdownItem>
                  <DropdownItem>Last 7 Days</DropdownItem>
                  <DropdownItem>Last 30 Days</DropdownItem>
                  <DropdownItem>This Month</DropdownItem>
                  <DropdownItem>Last Month</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                <tbody>
                  {(products || []).map((item, key) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded p-1 me-2">
                            <img
                              src={item.photoURL}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </div>
                          <div>
                            <h5 className="fs-14 my-1">
                              <Link
                                to={`/apps-ecommerce-product-details?id=${item._id}`}
                                className="text-reset"
                              >
                                {item.displayName}
                              </Link>
                            </h5>
                            <span className="text-muted">
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <h5 className="fs-14 my-1 fw-normal">
                          Rs. {item.sellingRate}
                        </h5>
                        <span className="text-muted">Selling Price</span>
                      </td>
                      <td>
                        <h5 className="fs-14 my-1 fw-normal">
                          {item.reOrderDays}
                        </h5>
                        <span className="text-muted">Re Orders</span>
                      </td>
                      <td>
                        <h5 className="fs-14 my-1 fw-normal">
                          {item.quantity >= 1 ? (
                            item.quantity
                          ) : (
                            <span className="badge badge-soft-danger">
                              Out of stock
                            </span>
                          )}{" "}
                        </h5>
                        <span className="text-muted">Stock</span>
                      </td>
                      <td>
                        <h5 className="fs-14 my-1 fw-normal">
                          Rs. {item.mrp}
                        </h5>
                        <span className="text-muted">MRP</span>
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

export default BestSellingProducts;
