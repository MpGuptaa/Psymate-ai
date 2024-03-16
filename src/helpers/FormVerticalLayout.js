import React, { useState } from "react";

import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { getAllUniqueTagsLowercased } from "./Helper";
import Tools from "../pages/Forms/Builder/Tools";

const FormVerticalLayout = ({ heading, state, setState, form }) => {
  const [verticalTab, setverticalTab] = useState(0);
  const [tab, setTab] = useState({});

  const toggleVertical = (tab) => {
    if (verticalTab !== tab) {
      setverticalTab(tab);
    }
  };
  const tags = form && getAllUniqueTagsLowercased(form, 0, "tag");
  const subtags = form && getAllUniqueTagsLowercased(form, 1, "tag");
  return (
    <div>
      <Col>
        <h5 className="m-2 rounded bg-light p-3 text-black text-center text-uppercase">
          {heading || ""}
        </h5>
        <h5 className="m-2 rounded bg-primary p-3 text-black text-center text-uppercase"></h5>
        <Row className="p-3">
          <Col className={`border py-2 mx-1 rounded`} md={3}>
            <Nav pills className="flex-column" id="v-pills-tab">
              {tags?.map((tag, index) => (
                <NavItem key={`tab_${tag}_${index}`}>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={`d-flex align-items-center p-1 mb-3 rounded ${
                      verticalTab === index
                        ? "bg-primary text-white"
                        : "bg-light"
                    } cursor-pointer`}
                    onClick={() => {
                      toggleVertical(index);
                      setTab(tag);
                    }}
                    id="v-pills-home-tab"
                  >
                    <span
                      className={`fs-16 ${
                        tag === "gab" || tag === "hmf"
                          ? "text-uppercase"
                          : "text-capitalize"
                      } ${
                        verticalTab === index
                          ? "text-white fw-bold"
                          : "text-black"
                      }`}
                    >
                      {tag}
                    </span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Col>
          <Col className={`mx-2 mb-2 rounded`} md={8}>
            <TabContent
              activeTab={verticalTab}
              className="text-muted mt-4 mt-md-0"
              id="v-pills-tabContent"
            >
              <TabPane tabId={verticalTab} id="v-pills-home">
                {subtags?.map(
                  (subtag) =>
                    form?.filter((item) => {
                      return (
                        item?.tag?.toLowerCase().split(",")[0] === tab &&
                        item?.tag?.toLowerCase().split(",")[1] === subtag
                      );
                    }).length > 0 && (
                      <div key={subtag}>
                        <h6 className="m-1 rounded bg-primary p-2 text-white text-center text-uppercase">
                          {subtag}
                        </h6>
                        <table className="table">
                          <tbody>
                            {form
                              ?.filter((item) => {
                                return (
                                  item?.tag?.toLowerCase().split(",")[0] ===
                                    tab &&
                                  item?.tag?.toLowerCase().split(",")[1] ===
                                    subtag
                                );
                              })
                              ?.map((ele, index) => {
                                return (
                                  <tr key={`row_${ele?.label}_${index}`}>
                                    <td>
                                      <div className="d-flex align-items-end bg-light my-2 p-2 rounded">
                                        {ele?.label}
                                      </div>
                                    </td>

                                    <td>
                                      <Tools
                                        label={false}
                                        setState={setState}
                                        state={state}
                                        inputs={[
                                          {
                                            ...ele,
                                            label: null,
                                            title: null,
                                          },
                                        ]}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )
                )}
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default FormVerticalLayout;
