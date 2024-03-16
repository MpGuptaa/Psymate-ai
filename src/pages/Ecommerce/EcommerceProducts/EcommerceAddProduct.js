import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormFeedback,
  Form,
} from "reactstrap";

// Redux
import { useDispatch } from "react-redux";
import {
  addNewProduct as onAddNewProduct,
  updateProduct as onUpdateProduct,
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

const EcommerceAddProduct = (props) => {
  document.title = "Create Product | Psymate - Management Portal";

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
    await axios.get(`/api/tools?id=6548c2f64d6ffe2b3253ba61`).then((res) => {
      res.data[0].items.forEach((input) => {
        initialState[input.name] = "";
      });
      setForms(res.data[0].items);
    });
  };

  useEffect(() => {
    if (id)
      axios.get(config.api.API_URL + `/item/${id}`).then((res) => {
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
          dispatch(onUpdateProduct({ ...state, id: id }));
        } else {
          dispatch(onAddNewProduct(state));
        }
        history("/apps-ecommerce-products");
        validation.resetForm();
      }
    },
  });
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Product" pageTitle="Ecommerce" />

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
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Product Gallery</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Tools
                      state={state}
                      setState={setState}
                      inputs={forms.filter((i) => i.tag === "Gallery")}
                    />
                  </Row>
                  <div className="mt-3">
                    <button type="submit" className="btn btn-success w-sm">
                      Submit
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </Col>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Discount</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Tools
                    state={state}
                    setState={setState}
                    inputs={forms.filter((i) => i.tag === "Discount")}
                  />
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Quantity</h5>
              </CardHeader>

              <CardBody>
                <Row>
                  <Tools
                    state={state}
                    setState={setState}
                    inputs={forms.filter((i) => i.tag === "Quantity")}
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

export default EcommerceAddProduct;
