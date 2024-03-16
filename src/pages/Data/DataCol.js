import React from "react";

const Rating = (cell) => {
  return (
    <React.Fragment>
      <span>
        <span className="badge bg-light text-body fs-12 fw-medium">
          <i className="mdi mdi-star text-warning me-1"></i>
          {cell.value}
        </span>
      </span>
    </React.Fragment>
  );
};
// 2241 * 12 = 26892 * 12 = 322704
// At maturity = 1613052
// 7000, 8000
// 420000
const Published = (cell) => {
  return (
    <React.Fragment>
      <span>
        {cell.value}
        {/* <small className="text-muted ms-1">{cell.value}</small> */}
      </span>
    </React.Fragment>
  );
};

const Price = (cell) => {
  return <React.Fragment>{"Rs. " + (cell.value || 0) + ".00"}</React.Fragment>;
};

export { Rating, Published, Price };
