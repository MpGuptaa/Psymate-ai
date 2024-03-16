import React, { useEffect, useState } from "react";
import Tools from "./Tools";
import {
  generateRandomId,
  inputValueChange,
  removeSpecialCharacters,
  toCamelCase,
} from "../../../../src/helpers/Helper.js";
import axios from "axios";
import { Button, ButtonGroup, Row } from "reactstrap";
import { toast } from "react-toastify";

const InputElement = ({ data, parentId, inputs, callback }) => {
  const [state, setState] = useState(data);

  useEffect(() => {
    // if (!state?.name)
    setState({
      ...state,
      name: state?.label ? removeSpecialCharacters(toCamelCase(state?.label)) : "",
    });
  }, [state?.label]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        axios.put(`/api/tools/inputs?id=${data.id}`, { ...state, id: data.id }).then((res) => {
          toast.success("Updated");
          callback(parentId);
        });
      }}
    >
      <Row className="gy-4 pt-4">
        <Tools data={data} inputs={inputs} setState={setState} state={state} inputValueChange={inputValueChange} />
      </Row>
      <ButtonGroup>
        <Button type="submit" color="success" style={{ marginTop: 10, marginBottom: 10 }}>
          Save Element
        </Button>
        <Button
          type="button"
          color="info"
          style={{ marginTop: 10, marginBottom: 10 }}
          onClick={(e) =>
            axios.put(`/api/tools/inputs?id=${data.id}`, { ...state, id: data.id }).then((res) => {
              axios
                .post("/api/tools/inputs", {
                  _id: parentId,
                  item: { ...data, id: generateRandomId("number", 10) },
                })
                .then((res) => {
                  toast.success("Added Duplicate Item");
                  callback(parentId);
                });
            })
          }
        >
          Duplicate Element
        </Button>
        <Button
          type="button"
          color="danger"
          style={{ marginTop: 10, marginBottom: 10 }}
          onClick={(e) =>
            axios.delete(`/api/tools/inputs?id=${data.id}`).then((res) => {
              toast.success("Deleted");
              callback(parentId);
            })
          }
        >
          Delete
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default InputElement;
