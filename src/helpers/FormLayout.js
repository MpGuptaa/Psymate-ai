import axios from "axios";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { getAllUniqueTagsLowercased, getTagsLowercased } from "./Helper";
import { useProfile } from "../Components/Hooks/UserHooks";
import Tools from "../pages/Forms/Builder/Tools";

const FormLayout = ({
  heading,
  formName,
  search,
  state,
  setState,
  childTab,
  children,
}) => {
  const [verticalTab, setverticalTab] = useState(0);
  const [form, setform] = useState({});
  const [tab, setTab] = useState({});
  const dispatch = useDispatch();
  const { loading } = useProfile();
  console.log(formName, search);
  const getForms = async () => {
    await axios
      .get(`/data/newforms?search=${formName}&searchBy=${search}`)
      .then((res) => {
        setform(res?.data?.[0]);
        setTab(res?.data[0]?.items[0]?.tag.toLowerCase());
      });
  };
  console.log(form);
  useEffect(() => {
    getForms();
  }, [dispatch, loading]);
  const toggleVertical = (tab) => {
    if (verticalTab !== tab) {
      setverticalTab(tab);
    }
  };
  const tags = form?.items && getTagsLowercased(form?.items);
  console.log(tags);
  return (
    <div>
      <Col>
        {heading && <h5 className="mb-3">{heading}</h5>}
        <Row>
          <Col md={3}>
            <Nav pills className="flex-column" id="v-pills-tab">
              {tags?.map((tag, index) => (
                <NavItem key={`tab_${tag}`}>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      "mb-2": true,
                      active: verticalTab === index,
                    })}
                    onClick={() => {
                      toggleVertical(index);
                      setTab(tag);
                    }}
                    id="v-pills-home-tab"
                  >
                    <span className="text-capitalize">{tag}</span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Col>
          <Col md={9}>
            <TabContent
              activeTab={verticalTab}
              className="text-muted mt-4 mt-md-0"
              id="v-pills-tabContent"
            >
              <TabPane tabId={verticalTab} id="v-pills-home">
                <Row className="d-flex flex-wrap">
                  {form?.items
                    ?.filter((item) => {
                      return item?.tag?.toLowerCase() === tab;
                    })
                    ?.map((ele) => {
                      return (
                        <Tools
                          key={ele?.id}
                          setState={setState}
                          state={state}
                          inputs={[ele]}
                        />
                      );
                    })}
                  {tab == childTab && children}
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default FormLayout;
