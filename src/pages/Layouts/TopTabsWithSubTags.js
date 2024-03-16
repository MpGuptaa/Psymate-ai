import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Form, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useLocation } from "react-router-dom";
import { getAllUniqueTagsLowercased, validateForm } from "../../helpers/Helper";
import Tools from "../Forms/Builder/Tools";
import { useProfile } from "../../Components/Hooks/UserHooks";
import axios from "axios";
import { toast } from "react-toastify";

const TopTabsWithSubTags = () => {
  const [activeTab, setactiveTab] = useState(0);
  const [passedSteps, setPassedSteps] = useState([1]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("id");
  const formId = searchParams.get("formId");
  const [data, setData] = useState([]);
  const [state, setState] = useState({});
  const { userProfile } = useProfile();
  const initialState = {};
  const [inputs, setInputs] = useState([]);
  const [form, setForm] = useState();
  const getForms = async () => {
    await axios.get(`/api/tools?id=${formId}&exact=true`).then((res) => {
      setForm(res?.data?.[0]);
      setTab(getAllUniqueTagsLowercased(form?.items, 0, "tag")[0]);
    });
  };

  useEffect(() => {
    getForms();
    if (form) {
      form?.items?.forEach((input) => {
        initialState[input?.name] = "";
      });
      setState(initialState);
      setInputs(form?.items);
    }
  }, [form?._id, userId]);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];

      if (tab >= 0 && tab <= 9) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  const [tab, setTab] = useState({});
  const tags = form?.items ? getAllUniqueTagsLowercased(form?.items, 0, "tag") : [];
  const subtags = form?.items ? getAllUniqueTagsLowercased(form?.items, 1, "tag") : [];
  console.log(subtags, tags, form?.items);
  // Create NavItems based on unique first parts
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
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Details" pageTitle="User" />

          <Row>
            <Col xl="2"></Col>

            <Col xl="8">
              <Card>
                <CardBody className="checkout-tab">
                  <Form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (validateForm(inputs, setInputs, state))
                        await axios
                          .post(`/clinical_data`, {
                            formId: formId,
                            patientId: userId,
                            doctorId: userProfile._id,
                            data: state,
                          })
                          .then((res) => {
                            setState(initialState);
                            toast.success(`${form?.displayName} Saved on ${new Date().toLocaleDateString()}`);
                          });
                      else toast.error("Form not Validated");
                    }}
                    action="#"
                  >
                    <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                      <div style={{ flex: 3, textAlign: "center", padding: "15px", background: "#da8872" }}>
                        {/* Title in the center */}
                        <h3 style={{ marginTop: "5px", color: "#fff" }}>{location.state.displayName}</h3>
                      </div>
                      <Nav className="nav-pills nav-justified custom-nav" role="tablist" style={{ marginTop: "2%" }}>
                        {navItems}
                      </Nav>
                    </div>
                    <TabContent activeTab={activeTab} className="text-muted mt-4 mt-md-0" id="v-pills-tabContent">
                      <TabPane tabId={activeTab} id="v-pills-home">
                        {subtags.length > 0
                          ? subtags.map((subtag) => {
                              const filteredItems = location.state.items?.filter((item) => {
                                return (
                                  item?.tag?.toLowerCase().split(",")[0] === tab &&
                                  item?.tag?.toLowerCase().split(",")[1] === subtag
                                );
                              });

                              return (
                                filteredItems.length > 0 && (
                                  <div key={subtag}>
                                    <h5
                                      className="m-1 rounded p-2 text-uppercase"
                                      style={{ background: "#f3f6f9", color: "#000" }}
                                    >
                                      {subtag}
                                    </h5>
                                    <div className="table">
                                      <div>
                                        {filteredItems.map((ele, index) => (
                                          <div
                                            style={{
                                              display: "grid",
                                              gridTemplateColumns: "1fr 1fr",
                                            }}
                                            key={`row_${ele?.label}_${index}`}
                                          >
                                            <div className="p-2 rounded" style={{ fontSize: "16px" }}>
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
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )
                              );
                            })
                          : location.state.items
                              ?.filter((item) => {
                                return item?.tag?.toLowerCase().split(",")[0] === tab;
                              })
                              ?.map((ele, index) => (
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                  }}
                                  key={`row_${ele?.label}_${index}`}
                                >
                                  <div className="p-2 rounded" style={{ fontSize: "16px" }}>
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
                              ))}
                      </TabPane>
                      <button type="submit" className="btn btn-sm btn-outline-success">
                        Save Form
                      </button>
                    </TabContent>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col xl="2"></Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TopTabsWithSubTags;
