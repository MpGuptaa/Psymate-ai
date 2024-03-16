import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
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
import { useDispatch } from "react-redux";
import {
  addNewSalt as onaddNewSalt,
  updateSalt as onUpdateSalt,
} from "../../../store/ecommerce/action";
import { useLocation, useNavigate } from "react-router-dom";
//formik
import { useFormik } from "formik";
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import axios from "axios";
import config from "../../../config";
import Tools from "../../Forms/Builder/Tools";
import { validateForm } from "../../../helpers/Helper";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EcommerceAddSalt = (props) => {
  document.title = "Create Salt | Psymate - Management Portal";

  const history = useNavigate();
  const dispatch = useDispatch();
  const initialState = {};
  const { loading } = useProfile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [state, setState] = useState({});
  const [forms, setForms] = useState([]);
  const getForms = async () => {
    await axios.get(`/api/tools?id=654a0a4b90e846479c97df97`).then((res) => {
      res.data[0].items.forEach((input) => {
        initialState[input.name] = "";
      });
      setForms(res.data[0].items);
      
    });
  };

  useEffect(() => {
    if (id)
      axios.get(config.api.API_URL + `/salt/${id}`).then((res) => {
        setState(res.item);
      });
  }, [loading]);

  useEffect(() => {
    getForms();
  }, []);

  const validation = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      if (validateForm(forms, setForms, state)) {
        if (id) {
          dispatch(onUpdateSalt({ ...state, id: state._id }));
        } else {
          dispatch(onaddNewSalt(state));
        }
        history("/apps-ecommerce-salts");
        validation.resetForm();
      }
    },
  });
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Salt" pageTitle="Ecommerce" />

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
                <CardBody>
                  <Row>
                    <Tools

                      state={state}
                      setState={setState}
                      inputs={forms.filter((i) => i.tag === "Basic Details")}
                    />
                   
                  </Row>
                  <div className="mt-3">
                    <button type="submit" className="btn btn-success w-sm">
                      Submit
                    </button>
                  </div>
                </CardBody>
              </Card>

              <Card className="text-end pb-10">
                <CardBody></CardBody>
              </Card>
            </Form>
          </Col>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Narcotics</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Tools
                    state={state}
                    setState={setState}
                    inputs={forms.filter((i) => i.tag === "Narcotic Details")}
                  />
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Other Info</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Tools
                    state={state}
                    setState={setState}
                    inputs={forms.filter((i) => i.tag === "Other Info")}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceAddSalt;
