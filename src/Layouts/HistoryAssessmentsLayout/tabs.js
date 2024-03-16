import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import Tools from "../../pages/Forms/Builder/Tools";
import { getAllUniqueTagsLowercased } from "../../helpers/Helper";
import classnames from "classnames";
import axios from "axios";
import config from "../../config";
import LeftTabs from "./LeftTabs";

const Tabs = ({ heading, onClick }) => {
  const [form, setForm] = useState([]);
  const getData = async () => {
    await axios
      .get(config.api.API_URL + `/api/tools?search=${heading?.toLowerCase()?.replace(/ /g, "_")}&searchBy=category`)
      .then((res) => {
        setForm(res.data);
      });
  };

  useEffect(() => {
    getData();
  }, [heading]);

  return (
    <div>
      <Col>
        <h5 className="m-2 rounded bg-light p-3 text-black text-center text-uppercase">{heading || ""}</h5>
        <Row className="p-3">
          {form?.map((item, key) => {
            return (
              <Col className="mt-3" xxl={6} key={key}>
                {/* <LeftTabs heading={item?.displayName} form={item?.items} /> */}
                <Card
                  onClick={() => {
                    onClick(item);
                  }}
                  className="profile-project-card shadow-none profile-project-success mb-0"
                >
                  <CardBody className="p-4">
                    <div className="d-flex">
                      <div className="flex-grow-1 text-muted overflow-hidden">
                        <h5 className="fs-15 text-capitalization mb-1">{item.displayName}</h5>
                      </div>
                      <div className="flex-shrink-0 ms-2">
                        <div className="badge text-capitalize badge-soft-warning fs-11">
                          {item.category?.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex mt-4">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h5 className="fs-12 text-muted mb-0">{item.items.length} Questions</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Col>
    </div>
  );
};

export default Tabs;
