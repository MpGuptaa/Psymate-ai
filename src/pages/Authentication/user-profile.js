import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
  ModalBody,
  TabContent,
  TabPane,
  Table,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import { toast } from "react-toastify";
import axios from "axios";
import FormLayout from "../../helpers/FormLayout";
import config from "../../config";

const UserProfile = () => {
  const dispatch = useDispatch();

  const [email, setemail] = useState("admin@gmail.com");
  const [idx, setidx] = useState("1");
  const [psyID, setPsyID] = useState("1");
  const [form, setform] = useState({});
  const [state, setState] = useState({});
  const [sessions, setsessions] = useState({});
  const [doctorSessions, setDoctorSessions] = useState([]);

  const [userName, setUserName] = useState("Admin");

  const { user, success, error } = useSelector((state) => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error,
  }));
  const getForms = async () => {
    await axios
      .get(`/data/newforms?search=user&searchBy=displayName`)
      .then((res) => {
        setform(res.data[0]);
        setState(user);
      });
  };
  const getSessions = async () => {
    await axios
      .get(
        `/sessions?doctorId=${user._id}&slotDuration=120&days=0-7&returnSession=true`
      )
      .then((res) => {
        setDoctorSessions(res);
      });
  };
  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      if (!isEmpty(user)) {
        obj.firstName = user.firstName;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(obj));
      }

      setUserName(obj.displayName);
      setemail(obj.email);
      setidx(obj._id || "1");
      setPsyID(obj.psyID || "1");
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
    getForms();
    getSessions();
  }, [dispatch, user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: userName || "Admin",
      idx: idx || "",
    },
    onSubmit: () => {
      // axiosinstance
      //   .put(API_URL_USER_FUNCTIONS + "?type=doctor", values)
      //   .then((res) => {
      //     console.log(res)
      //     toast.success("Successfully updated doctor", { toastId: 1 });
      //     // setUpdateDoctor({ state: false, index: -1 });
      //     // getDoctorData();
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     toast.error(err.message);
      //   });
      dispatch(editProfile(state));
    },
  });
  const [edit, setEdit] = useState({
    state: false,
    data: {},
  });
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEdit({ state: false, data: {} });
    } else {
      setModal(true);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? (
                <Alert color="success">Username Updated To {userName}</Alert>
              ) : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>
                          {user.prefix || ""} {userName || "Admin"}
                        </h5>
                        <p className="mb-1">Email Id : {email}</p>
                        <p className="mb-0">Id No : #{idx}</p>
                        <p className="mb-0">PsyID : {psyID}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Form
            className="form-horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Card>
              <CardBody>
                <FormLayout
                  heading="Update Your Profile"
                  formName="user"
                  search="displayName"
                  state={state}
                  setState={setState}
                  childTab={"practice details"}
                >
                  <Modal
                    className="zoomIn"
                    id={`add${"sessions"}`}
                    size="lg"
                    isOpen={modal}
                    toggle={toggle}
                    centered
                  >
                    <ModalBody>
                      <form name={"sessions"}>
                        <TabContent activeTab={1}>
                          <TabPane tabId={1}>
                            <FormLayout
                              formName={"sessions"}
                              search={"displayName"}
                              heading={`Manage ${"sessions"}`}
                              setState={setsessions}
                              state={sessions}
                            />
                          </TabPane>
                          <div className="hstack gap-2 mt-4 justify-content-between">
                            <button
                              className="btn btn-danger"
                              data-bs-dismiss="modal"
                              onClick={(e) => {
                                axios
                                  .delete(`/${"sessions"}/${edit.data._id}`)
                                  .then((res) => {
                                    toggle();
                                    getSessions();
                                    toast.success(`${"sessions"} Deleted`);
                                  });
                              }}
                              type="button"
                            >
                              Delete
                            </button>
                            <div className="gap-2 hstack">
                              <button
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={toggle}
                                type="button"
                              >
                                <i className="ri-close-line me-1 align-middle"></i>{" "}
                                Close
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!state) {
                                    toast.error(
                                      "Please fill all the fields marked with *"
                                    );
                                    return;
                                  }
                                  console.log(edit.data);
                                  if (edit.state) {
                                    axios
                                      .put(
                                        `${config.api.API_URL}/${"sessions"}/${
                                          edit.data._id
                                        }`,
                                        sessions
                                      )
                                      .then((res) => {
                                        toggle();
                                        toast.success(`${"sessions"} Updated`);
                                        // window.location.reload();
                                        getSessions();
                                      });
                                  } else {
                                    axios
                                      .post(
                                        `${config.api.API_URL}/${"sessions"}`,
                                        {
                                          ...sessions,
                                          doctorId: user._id,
                                        }
                                      )
                                      .then((res) => {
                                        toggle();
                                        toast.success(`${"sessions"} created`);
                                        // window.location.reload();
                                        getSessions();
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  }
                                }}
                                className="btn btn-primary"
                              >
                                <i className="ri-save-3-line align-bottom me-1"></i>
                                Save
                              </button>
                            </div>
                          </div>
                        </TabContent>
                      </form>
                    </ModalBody>
                  </Modal>
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={toggle}
                    type="button"
                  >
                    Add sessions
                  </button>
                  <Table className="align-middle table-nowrap mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Weekdays</th>
                        <th scope="col">Start</th>
                        <th scope="col">End</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorSessions.map((session) => {
                        console.log(session);
                        return (
                          <tr key={session._id}>
                            <td>{session.weekdays.join(",")}</td>
                            <td>{new Date(session.startTime).getHours()}</td>
                            <td>{new Date(session.endTime).getHours()}</td>

                            <td
                              onClick={() => {
                                setModal(true);
                                setsessions(session);
                                setEdit({ state: true, data: session });
                              }}
                            >
                              Edit
                              <i className="ri-arrow-right-line align-middle"></i>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </FormLayout>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Button type="submit" color="danger">
                  Update Details
                </Button>
              </CardBody>
            </Card>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
