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
import config from "../../config";

const TopTabs = () => {
  const [activeTab, setactiveTab] = useState(0);
  const [passedSteps, setPassedSteps] = useState([1]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("id");
  const formId = searchParams.get("formId");
  const status = searchParams.get("status");
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

  const getData = async () => {
    if (formId && userId)
      await axios.get(config.api.API_URL + `/users?search=${userId}&searchBy=_id&exact=true`).then((res) => {
        setState(res.data[0]);
      });
  };

  useEffect(() => {
    getForms();
    getData();
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
  // Create NavItems based on unique first parts

  useEffect(() => {
    if (!tab) setTab(tags[0]);
  }, [tags]);

  const navItems = tags.map((firstPart, index) => (
    <NavItem key={index} role="presentation">
      <NavLink
        href="#"
        className={classnames(
          {
            active: activeTab === index,
            done: activeTab <= 9 && activeTab >= 0,
          },
          "p-2",
        )}
        onClick={() => {
          toggleTab(index);
          setTab(firstPart);
        }}
      >
        <span className={`fs-16 text-capitalize ${activeTab === index ? "text-white fw-bold" : "text-black"}`}>
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
                      toast(`Saving Form`, { toastId: "save-form", type: "info" });

                      if (validateForm(inputs, setInputs, state)) {
                        var data = state;
                        if (status) {
                          data.status = "pending";
                        }
                        await axios.put(`/user/${userId}`, data).then((res) => {
                          toast.update(`save-form`, {
                            type: "success",
                            render: `Thanks for registering yourself, Our team will verify your profile and get back soon, on your registered mail ID`,
                          });
                        });
                      } else toast.error("Form not Validated");
                    }}
                    action="#"
                  >
                    <div className="step-arrow-nav mt-n3 mx-n3 mb-3">
                      <div style={{ flex: 3, textAlign: "center", padding: "15px", background: "#da8872" }}>
                        {/* Title in the center */}
                        <h3 style={{ marginTop: "5px", color: "#fff" }} className="text-uppercase">
                          {form?.displayName}
                        </h3>
                      </div>
                      <Nav className="nav-pills nav-justified custom-nav" role="tablist" style={{ marginTop: "2%" }}>
                        {navItems}
                      </Nav>
                    </div>
                    <TabContent activeTab={activeTab} className="text-muted mt-4 mt-md-0" id="v-pills-tabContent">
                      <TabPane tabId={activeTab} id="v-pills-home">
                        <Row className="d-flex flex-wrap">
                          {inputs?.filter((item) => {
                            return item?.tag?.toLowerCase().split(",")[0] === tab;
                          }).length > 0 &&
                            inputs
                              ?.filter((item) => {
                                return item?.tag?.toLowerCase().split(",")[0] === tab;
                              })
                              ?.map((ele, index) => {
                                return (
                                  <Tools
                                    key={`row_${ele?.label}_${index}`}
                                    label={false}
                                    setState={setState}
                                    state={state}
                                    inputs={[ele]}
                                  />
                                );
                              })}
                        </Row>
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

export default TopTabs;
