import React from "react";
import { Col, Row } from "reactstrap";
import Tools from "../pages/Forms/Builder/Tools";

const AssessmentLayout = ({ heading, state, setState, form }) => {
  return (
    <div>
      <Col>
        <h5 className="m-2 rounded bg-light p-3 text-black text-center text-uppercase">
          {heading || ""}
        </h5>
        <Row className="p-3">
          {form?.map((ele, index) => {
            return (
              <Tools
                key={`row_${ele.label}_${index}`}
                setState={setState}
                state={state}
                inputs={[ele]}
              />
            );
          })}
        </Row>
      </Col>
    </div>
  );
};

export default AssessmentLayout;
