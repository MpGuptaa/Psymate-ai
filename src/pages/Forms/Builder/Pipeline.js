import React from "react";
import Tools from "./Tools";
import { Row } from "reactstrap";
import { inputValueChange } from "../../../../src/helpers/Helper.js";

const Pipeline = ({ inputs, state, setState }) => {
  return (
    <div>
      <Row className="gy-4">
        <Tools
          inputValueChange={inputValueChange}
          data={state}
          state={state}
          setState={setState}
          inputs={inputs}
        />
      </Row>
    </div>
  );
};

export default Pipeline;
