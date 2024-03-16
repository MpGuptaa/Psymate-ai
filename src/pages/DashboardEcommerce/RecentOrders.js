import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col } from "reactstrap";

const RecentOrders = ({ orders }) => {
  return (
    <React.Fragment>
      <Col xl={8}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Recent Orders</h4>
            {/* <div className="flex-shrink-0">
              <button type="button" className="btn btn-soft-info btn-sm">
                <i className="ri-file-list-3-line align-middle"></i> Generate
                Report
              </button>
            </div> */}
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                <thead className="text-muted table-light">
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Products</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders || []).map((item, key) => (
                    <tr key={key}>
                      <td>
                        <Link
                          to={`/apps-ecommerce-order-details?id=${item?.invoiceId}`}
                          className="fw-medium link-primary"
                        >
                          {item.invoiceId}
                        </Link>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {/* <div className="flex-shrink-0 me-2">
                            <img
                              src={item.img}
                              alt=""
                              className="avatar-xs rounded-circle"
                            />
                          </div> */}
                          <div className="flex-grow-1">
                            {item.user.displayName}
                          </div>
                        </div>
                      </td>
                      <td>{item?.items?.length}</td>
                      <td>
                        <span className="text-success">
                          {item?.payment?.[0]?.currency} {item.totalAmount}
                        </span>
                      </td>
                      <td>{item.title}</td>
                      <td>
                        <span className={""}>{item.status}</span>
                      </td>
                      <td>
                        <span className={""}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default RecentOrders;
