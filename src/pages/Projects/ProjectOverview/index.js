import React from "react";
import { Container } from "reactstrap";
import Section from "./Section";

const ProjectOverview = () => {
  document.title = "Project Overview | Psymate - Management Portal";
  const searchParams = new URLSearchParams(window.location.search);
  const itemId = searchParams.get("id");
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Section itemId={itemId} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProjectOverview;
