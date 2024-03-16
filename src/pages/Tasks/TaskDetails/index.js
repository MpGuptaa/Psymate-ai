import React from "react";
import { Container, Col, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Comments from "./Comments";
import Summary from "./Summary";
import TimeTracking from "./TimeTracking";

const TaskDetails = () => {
  document.title = "Tasks Details | Psymate - Management Portal";
  const searchParams = new URLSearchParams(window.location.search);
  const taskId = searchParams.get("taskId");
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Tasks Details" pageTitle="Tasks" />
          <Row>
            <Col xxl={3}>
              <TimeTracking taskId={taskId} />
            </Col>
            <Col xxl={9}>
              <Summary taskId={taskId} />
              <Comments />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TaskDetails;
