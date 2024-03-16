import React, { useState } from "react";
import ReactDragListView from "react-drag-listview/lib/index.js";
import {
  Accordion,
  AccordionItem,
  Col,
  Collapse,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { profileItems } from "./constant";
import InputElement from "./InputElement";
import classnames from "classnames";
import axios from "axios";
import { toast } from "react-toastify";

const Drag = ({ setData, parentId, data, callback, state }) => {
  const [col2, setcol2] = useState({});
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onDragEnd = (fromIndex, toIndex) => {
    const newData = [...data];
    const item = newData.splice(fromIndex, 1)[0];
    newData.splice(toIndex, 0, item);
    setData(newData);
    axios
      .put(`/api/tools/hard/save?id=${parentId}`, {
        data: { ...state, items: newData },
        id: parentId,
      })
      .then((res) => {
        toast.success("Saved");
        callback(parentId);
      });
  };

  const dragProps = {
    onDragEnd,
    nodeSelector: "li",
    handleSelector: "div",
  };

  return (
    <div>
      <ListGroup className="nested-sortable-handle">
        <ReactDragListView {...dragProps}>
          {data?.map((item, index) => {
            return (
              <React.Fragment key={item?.name}>
                <ListGroupItem>
                  <Accordion
                    key={item?.name}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                  >
                    <AccordionItem
                      onClick={() => {
                        setcol2({ [index]: !col2[index] });
                      }}
                      aria-controls={`panel${index}bh-content`}
                      id={`panel${index}bh-header`}
                    >
                      <h2 className="accordion-header" id={item?.label}>
                        <button
                          className={classnames("accordion-button", {
                            collapsed: !col2,
                          })}
                          type="button"
                          style={{ cursor: "pointer" }}
                        >
                          {!item?.label
                            ? `Add a name to ${
                                item?.element ? item?.element : `this element`
                              }`
                            : `${item?.label} - ${item?.element}`}
                        </button>
                      </h2>
                    </AccordionItem>
                    <Collapse isOpen={col2[index]}>
                      {profileItems.map((profile, index) => (
                        <InputElement
                          parentId={parentId}
                          key={index}
                          callback={callback}
                          data={item}
                          inputs={profile.components.filter((j) => {
                            return j.for.split(",").includes(item?.element);
                          })}
                        />
                      ))}
                    </Collapse>
                  </Accordion>
                </ListGroupItem>
              </React.Fragment>
            );
          })}
        </ReactDragListView>
      </ListGroup>
    </div>
  );
};

export default Drag;
