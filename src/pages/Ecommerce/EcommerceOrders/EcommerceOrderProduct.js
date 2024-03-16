import React from "react";

const EcommerceOrderProduct = (props) => {
  return (
    <React.Fragment>
      <tr>
        <td>
          <div className="d-flex">
            <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
              <img
                src={props.product.photoURL}
                alt=""
                className="img-fluid d-block"
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <h5 className="fs-16">
                <a
                  href={`/apps-ecommerce-product-details?id=${props.product._id}`}
                  className="link-primary"
                >
                  {props.product.displayName}
                </a>
              </h5>
              <p className="text-muted mb-0">
                Company:{" "}
                <span className="fw-medium">{props.product.company}</span>
              </p>
              {/* <p className="text-muted mb-0">
                Quantity:{" "}
                <span className="fw-medium">
                  {props.product.unit} {props.product.quantity}
                </span>
              </p> */}
            </div>
          </div>
        </td>
        <td>Rs. {props.product.sellingRate}</td>
        <td>
          {props.product.quantity} {props.product.unit}{" "}
        </td>
        {/* <td>
          <div className="text-warning fs-15">
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-half-fill"></i>
          </div>
        </td> */}
        <td className="fw-medium text-end">Rs. {props.product.sellingRate}</td>
      </tr>
    </React.Fragment>
  );
};

export default EcommerceOrderProduct;
