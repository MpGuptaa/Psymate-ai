import React from "react";
import { Col } from "reactstrap";

const Notfound = ({ text }) => {
  return (
    <div>
      <Col lg={12}>
        <div className="text-center mt-sm-5 pt-4 mb-4">
          <div className="mb-5">
            <h1 className="display-2 coming-soon-text">{text}</h1>
          </div>
          <div>
            <div className="mt-5">
              <h4>No results found</h4>
              <p className="text-muted">Change the Page 😊</p>
            </div>
          </div>
        </div>
      </Col>
    </div>
  );
};

export default Notfound;
