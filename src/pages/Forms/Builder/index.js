import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, Button, ButtonGroup, Card, CardBody, Col, Collapse, Row } from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { categories, inputElements, profileItems } from "./constant";
import Pipeline from "./Pipeline";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import Drag from "./Drag";
import DraggableItem from "./DraggableItem";
import { SelectInput } from "./Inputs";
import AsyncSelect from "react-select/async";
import config from "../../../config";

const FormBuilder = () => {
  document.title = "Basic Elements | Psymate - Management Portal";
  const [state, setState] = useState();
  const [input, setInput] = useState();
  const [search, setSearch] = useState({ search: [] });

  const getInputs = (id) => {
    axios.get(`/data${id ? `/newforms?search=${id}&searchBy=_id&exact=true` : `/newforms`}`).then((res) => {
      setState(res.data[0]);
      setInput(res.data[0].items);
    });
  };

  const generateNewLink = () => {
    const item = { displayName: "New Form", head: "", items: [] };
    axios.post("/data/newforms", item);
    // setState((prevState) => ({ ...prevState, category }));
    toast.success(`Form Added in search, Please reload the page and search the form`, {});
  };

  const renderLinks = () => (
    <div className="w-full my-4 rounded-xl">
      <Pipeline state={state} setState={setState} inputs={categories[0].components} />

      <Drag setData={setInput} data={input} parentId={state?._id} state={state} callback={getInputs} />
    </div>
  );
  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col xl={3}>
            <Card className="card-h-100 p-3">
              {!state ? (
                <AsyncSelect
                  className="mb-0"
                  placeholder="Search For Forms"
                  onChange={(e) => {
                    setState(e.value);
                    setInput(e.value.items);
                  }}
                  loadOptions={async (inputValue) => {
                    try {
                      const response = await axios.get(
                        config.api.API_URL + `/data/newforms?search=${inputValue}&searchBy=displayName`,
                      );
                      const data = response.data;
                      const options = data.map((item) => ({
                        value: item,
                        label: item.displayName,
                      }));
                      return options;
                    } catch (error) {
                      console.error("Error loading options:", error);
                      return [];
                    }
                  }}
                  isClearable
                  isSearchable
                />
              ) : (
                <Button
                  type="button"
                  color="danger"
                  onClick={() => {
                    setState();
                    setInput();
                  }}
                >
                  Change Form Selection
                </Button>
              )}
              <div className="mt-3">
                <SelectInput
                  setState={setSearch}
                  state={search}
                  k={{
                    label: "Form Element",
                    name: "search",
                    items: inputElements,
                    variants: "multiple,searchable",
                  }}
                />
              </div>
              {inputElements
                ?.split(",")
                ?.filter((fil) => {
                  if (search?.search?.length > 0) {
                    return search?.search?.includes(fil);
                  } else {
                    return fil;
                  }
                })
                ?.map((i) => (
                  <div className="border p-3 mt-1 cursor-move" key={i}>
                    <DraggableItem
                      id={i}
                      parentId={state?._id}
                      title="My Draggable Item"
                      setData={setInput}
                      callback={getInputs}
                      data={input}
                    />
                  </div>
                ))}
            </Card>
          </Col>
          <Col xl={9}>
            <Card className="card-h-100 p-3">
              <div className="h-fit">
                <ButtonGroup style={{ marginTop: 10, marginBottom: 10 }}>
                  <Button color="success" type="button" onClick={generateNewLink}>
                    Add A New Form
                  </Button>
                  {state?._id && (
                    <Button
                      type="button"
                      color="danger"
                      sx={{ marginTop: 3 }}
                      onClick={(e) =>
                        axios.delete(`/api/tools?id=${state._id}`).then((res) => {
                          setState();
                          toast.success("Deleted");
                        })
                      }
                    >
                      Delete
                    </Button>
                  )}
                  {state?._id && (
                    <Button
                      type="button"
                      onClick={(e) => {
                        axios
                          .put(`/api/tools/hard/save?id=${state?._id}`, {
                            data: { ...state, items: input },
                            id: state?._id,
                          })
                          .then((res) => {
                            toast.success("Saved");
                            getInputs(state?._id);
                          });
                      }}
                      color="success"
                    >
                      Save Form
                    </Button>
                  )}
                  {state?._id && (
                    <Button
                      type="button"
                      onClick={async (e) => {
                        await navigator.clipboard.writeText(state?._id);
                      }}
                      color="info"
                    >
                      Copy Id
                    </Button>
                  )}
                </ButtonGroup>
              </div>
              {renderLinks()}
            </Card>
          </Col>
        </Row>
        {/* {state?.items && (
          <Card className="p-3 pb-6 m-3">
            <CardBody>
              <Row>
                {state?.items?.map((ele) => (
                  <Tools
                    key={ele?.displayName}
                    setState={setFillings}
                    state={fillings}
                    inputs={[ele]}
                  />
                ))}
              </Row>
              <Button
                color="success"
                className="mt-4"
                type="button"
                onClick={() => {
                  axios
                    .post(`${config.api.API_URL}/data/type`, {
                      data: fillings,
                    })
                    .then((res) => {
                      console.log(res);
                      toast.success(res.message);
                    });
                }}
              >
                Add A Set
              </Button>
            </CardBody>
          </Card>
        )} */}
      </div>
    </React.Fragment>
  );
};

export default FormBuilder;
