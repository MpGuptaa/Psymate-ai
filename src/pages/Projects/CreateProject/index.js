import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import {
  addProjectList
} from "../../../store/projects/action";

import { getUsers } from "../../../store/users/action"

const CreateProject = () => {
  document.title = "Create Project | Psymate - Management Portal";
  const dispatch = useDispatch();
  const { users } = useSelector((state) => ({
    users: state.User.users,
  }));

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCategory, setProjectCategory] = useState("care");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [type, setType] = useState("doctor");

  const handleTitleChange = (e) => {
    setProjectTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setProjectDescription(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setProjectCategory(e.target.value);
  };

  useEffect(() => {
    dispatch(getUsers(type, 1, `search=${type}&searchBy=type`));
  }, [dispatch, type]);

  const handleCreateProject = () => {
    const data = {
      displayName: projectTitle,
      description: projectDescription,
      category: projectCategory,
      access: selectedUsers,
    };

    dispatch(addProjectList(data));

    setProjectTitle("");
    setProjectDescription("");
    setProjectCategory("care");
    setSelectedUsers([]);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create Project" pageTitle="Projects" />
          <Row>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="project-title-input">
                      Project Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter project title"
                      value={projectTitle}
                      onChange={handleTitleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="project-title-input">
                      Project Description
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-description-input"
                      placeholder="Enter project description"
                      value={projectDescription}
                      onChange={handleDescriptionChange}
                    />
                  </div>

                </CardBody>
              </Card>
            </Col>

            <Col lg={4}>
              <Card>
                <CardBody>

                  <div className="card">
                    <CardBody>
                      <div className="mb-1">
                        <Label className="form-label" htmlFor="project-category-input">
                          Project Category
                        </Label>
                        <select
                          className="form-select"
                          id="project-category-input"
                          value={projectCategory}
                          onChange={handleCategoryChange}
                        >
                          <option value="Care">Care</option>
                          <option value="Development">Development</option>
                        </select>
                      </div>
                    </CardBody>
                  </div>

                  <div className="mb-1">
                    <Label className="form-label">Team Members</Label>
                    <SimpleBar style={{ maxHeight: "95px" }}>
                      <ul className="list-unstyled vstack gap-2 mb-0">
                        {users.map((item, key) => (
                          <li key={key}>
                            <div className="form-check d-flex align-items-center">
                              <Input
                                name="selectedUsers"
                                className="form-check-input me-3"
                                type="checkbox"
                                onChange={(e) => {
                                  const checkedItemId = item._id;
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, checkedItemId]);
                                  } else {
                                    setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter(id => id !== checkedItemId));
                                  }
                                }}
                                value={item._id}
                                checked={selectedUsers.includes(item._id)}
                                id={item._id}
                              />
                              <Label className="form-check-label d-flex align-items-center" htmlFor={item._id}>
                                <span className="flex-grow-1 ms-2">
                                  {item.displayName}
                                </span>
                              </Label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </SimpleBar>
                  </div>

                </CardBody>
              </Card>
            </Col>
          </Row>
          <div className="text-end mb-4">
            <button
              type="button"
              className="btn btn-success w-sm me-1"
              disabled={!projectTitle || !projectDescription}
              onClick={handleCreateProject}
            >
              Create Project
            </button>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateProject;
