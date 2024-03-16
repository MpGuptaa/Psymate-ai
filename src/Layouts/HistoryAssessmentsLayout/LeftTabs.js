import React, { useEffect, useState } from "react";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import Tools from "../../pages/Forms/Builder/Tools";
import { getAllUniqueTagsLowercased } from "../../helpers/Helper";
import classnames from "classnames";

const LeftTabs = ({ heading, state, setState, form }) => {
  const [activeTab, setactiveTab] = useState(0);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [tab, setTab] = useState({});

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 0 && tab <= 9) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  useEffect(() => {
    setTab(tags[0]);
  }, [tab]);
  console.log(form);
  const tags = (form && getAllUniqueTagsLowercased(form, 0, "tag")) || [];
  const subtags = (form && getAllUniqueTagsLowercased(form, 1, "tag")) || [];
  const navItems = tags.map((firstPart, index) => (
    <NavItem key={index} role="presentation">
      <NavLink
        href="#"
        className={classnames(
          {
            active: activeTab === index,
            done: activeTab <= 9 && activeTab >= 0,
          },
          "p-3",
        )}
        style={{ textAlign: "left" }}
        onClick={() => {
          toggleTab(index);
          setTab(firstPart);
        }}
      >
        <i className={`las la-vial fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2`}></i>
        <span
          className={`fs-16 ${firstPart === "gab" || firstPart === "hmf" ? "text-uppercase" : "text-capitalize"} ${
            activeTab === index ? "text-white fw-bold" : "text-black"
          }`}
        >
          {firstPart}
        </span>
      </NavLink>
    </NavItem>
  ));
  return (
    <div>
      <Col>
        <h5 className="m-2 rounded bg-light p-3 text-black text-center text-uppercase">{heading || ""}</h5>
        <div style={{ display: "flex", alignItems: "start" }}>
          {(tags.length > 0 || subtags.length > 0) && (
            <Nav
              className="nav-pills nav-justified custom-nav"
              role="tablist"
              style={{ marginTop: "2%", display: "unset", width: "330px", position: "sticky", top: "0" }}
            >
              {navItems}
            </Nav>
          )}
          <Row className="p-3">
            <TabContent activeTab={activeTab} className="text-muted mt-4 mt-md-0" id="v-pills-tabContent">
              <TabPane tabId={activeTab} id="v-pills-home">
                {subtags.length > 0 &&
                  subtags?.map(
                    (subtag) =>
                      form?.filter((item) => {
                        return (
                          item?.tag?.toLowerCase().split(",")[0] === tab &&
                          item?.tag?.toLowerCase().split(",")[1] === subtag
                        );
                      }).length > 0 && (
                        <div key={subtag}>
                          <h5
                            className="m-1 rounded  p-2   text-uppercase"
                            style={{ background: "#f3f6f9", color: "#000" }}
                          >
                            {subtag}
                          </h5>
                          <div className="table">
                            <div>
                              {form
                                ?.filter((item) => {
                                  return (
                                    item?.tag?.toLowerCase().split(",")[0] === tab ||
                                    item?.tag?.toLowerCase().split(",")[1] === subtag
                                  );
                                })
                                ?.map((ele, index) => {
                                  return (
                                    <div
                                      style={{
                                        display: "grid",
                                        gridTemplate: "1fr/ 1fr 1fr",
                                      }}
                                      key={`row_${ele?.label}_${index}`}
                                    >
                                      <div className=" p-2 rounded" style={{ fontSize: "16px" }}>
                                        {ele?.label}
                                      </div>

                                      <div>
                                        <Tools label={false} setState={setState} state={state} inputs={[ele]} />
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      ),
                  )}
                {tags.length > 0 &&
                  form
                    ?.filter((item) => {
                      return item?.tag?.toLowerCase().split(",")[0] === tab;
                    })
                    ?.map((ele, index) => {
                      return (
                        <div key={`row_${ele?.label}_${index}`}>
                          <div className=" p-2 rounded" style={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>
                            {ele?.label}
                          </div>

                          <div>
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
                          </div>
                        </div>
                      );
                    })}
              </TabPane>
            </TabContent>
            {tags.length <= 0 && subtags.length <= 0 && (
              <Row>
                {form?.map((ele, index) => (
                  <Tools
                    key={`row_${ele?.label}_${index}`}
                    label={false}
                    setState={setState}
                    state={state}
                    inputs={[ele]}
                  />
                ))}
              </Row>
            )}
          </Row>
        </div>
      </Col>
    </div>
  );
};

export default LeftTabs;
