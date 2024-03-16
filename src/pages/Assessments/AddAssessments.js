import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Row,
  Form,
} from "reactstrap";

// Redux
import { useDispatch, useSelector } from "react-redux";
//Import actions
import {
  getAssessments as onGetAssessments,
  updateAssessment as onUpdateAssessment,
  addNewAssessment as onAddNewAssessment,
} from "../../store/lab/action";
import { useLocation, useNavigate } from "react-router-dom";
//formik
import { useFormik } from "formik";
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useProfile } from "../../Components/Hooks/UserHooks";
import axios from "axios";
import config from "../../config";
import { validateForm } from "../../helpers/Helper";
import Tools from "../Forms/Builder/Tools";
import { getAssessments } from "../../store/lab/action";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddAssessment = (props) => {
  document.title = "Create Assessment | Psymate - Management Portal";
  const { loading } = useProfile();
  const { assessments } = useSelector((state) => ({
    assessments: state.Lab.assessments,
  }));

  const history = useNavigate();
  const dispatch = useDispatch();
  const initialState = {};
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const collection = queryParams.get("collection");
  const [state, setState] = useState(assessments);
  const [forms, setForms] = useState([]);

  const getForms = async () => {
    await axios.get(`/api/tools?id=${collection}`).then((res) => {
      const data = res.data[0];
      data.items.forEach((input) => {
        initialState[input.name] = "";
      });
      setForms(data.items);
    });
  };

  useEffect(() => {
    getForms();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(onGetAssessments(1, id, "_id&exact=true"));
    }
  }, [loading]);
  useEffect(() => {
    if (assessments) setState(assessments.data?.[0]);
  }, [assessments]);

  const validation = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      if (validateForm(forms, setForms, state)) {
        if (id) {
          dispatch(
            onUpdateAssessment({
              ...state,
              query: `?searchBy=_id&search=${id}&exact=true`,
            })
          );
        } else {
          dispatch(onAddNewAssessment(state));
        }
        dispatch(onGetAssessments(1, "", "category"));
        history("/apps-lab-assessments");
        validation.resetForm();
      }
    },
  });
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Assessment" pageTitle="Lab" />

        <Row>
          <Col lg={8}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Basic Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Tools
                      state={state}
                      setState={setState}
                      inputs={forms?.filter((i) => i.tag === "Basic Details")}
                    />
                  </Row>
                </CardBody>
              </Card>

              {forms?.filter((i) => i.tag === "Gallery").length > 0 && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">Assessment Gallery</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Tools
                        state={state}
                        setState={setState}
                        inputs={forms?.filter((i) => i.tag === "Gallery")}
                      />
                    </Row>
                  </CardBody>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Review & Submit</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <button type="submit" className="btn btn-success w-sm">
                      Submit
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </Col>

          <Col lg={4}>
            {forms?.filter((i) => i.tag === "Discount").length > 0 && (
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Discount</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Tools
                      state={state}
                      setState={setState}
                      inputs={forms?.filter((i) => i.tag === "Discount")}
                    />
                  </Row>
                </CardBody>
              </Card>
            )}

            {forms?.filter((i) => i.tag === "Quantity").length > 0 && (
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Quantity</h5>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Tools
                      state={state}
                      setState={setState}
                      inputs={forms?.filter((i) => i.tag === "Quantity")}
                    />
                  </Row>
                </CardBody>
              </Card>
            )}

            {forms?.filter((i) => i.tag === "Other Info").length > 0 && (
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Other Info</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Tools
                      state={state}
                      setState={setState}
                      inputs={forms?.filter((i) => i.tag === "Other Info")}
                    />
                  </Row>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddAssessment;
