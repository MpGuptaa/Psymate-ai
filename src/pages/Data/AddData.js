import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Card, CardBody, Col, Container, CardHeader, Row, Form } from "reactstrap";

// Redux
import { useDispatch, useSelector } from "react-redux";
//Import actions
import {
  getDatas as onGetDatas,
  updateData as onUpdateData,
  addNewData as onAddNewData,
} from "../../store/admin/action.js";
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
import { toast } from "react-toastify";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddData = (props) => {
  document.title = "Create Data | Psymate - Management Portal";
  const { loading } = useProfile();
  const { datas } = useSelector((state) => ({
    datas: state.Admin.datas,
  }));

  const history = useNavigate();
  const dispatch = useDispatch();
  const initialState = {};
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const collection = queryParams.get("collection");
  const collectionName = queryParams.get("collectionName");
  const [state, setState] = useState({});
  const [forms, setForms] = useState([]);
  const getForms = async () => {
    await axios.get(`/api/tools?id=${collection}`).then((res) => {
      const data = res.data[0];
      data.items.forEach((input) => {
        initialState[input.name] = "";
      });
      setState(initialState);
      setForms(data.items);
    });
  };

  useEffect(() => {
    getForms();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(onGetDatas(collectionName, 1, id, "_id&exact=true"));
    }
  }, [id]);
  useEffect(() => {
    if (id && datas?.data?.length > 0) setState(datas.data?.[0]);
  }, [datas]);

  const validation = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      if (validateForm(forms, setForms, state)) {
        if (id) {
          dispatch(onUpdateData(collectionName, id, "_id&exact=true", state));
        } else {
          dispatch(onAddNewData(collectionName, state));
        }
        dispatch(onGetDatas(collectionName, 1, "", ""));
        history(`/data?collectionName=${collectionName}&collection=${collection}`);
        validation.resetForm();
      } else {
        window.scrollTo(0, 0);
        toast.error("Invalid Form");
      }
    },
  });
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Data" pageTitle="Lab" />

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
                    <Tools state={state} setState={setState} inputs={forms?.filter((i) => i.tag === "Basic Details")} />
                  </Row>
                </CardBody>
              </Card>

              {forms?.filter((i) => i.tag === "Gallery").length > 0 && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">Data Gallery</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Tools state={state} setState={setState} inputs={forms?.filter((i) => i.tag === "Gallery")} />
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
                    <Tools state={state} setState={setState} inputs={forms?.filter((i) => i.tag === "Discount")} />
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
                    <Tools state={state} setState={setState} inputs={forms?.filter((i) => i.tag === "Quantity")} />
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
                    <Tools state={state} setState={setState} inputs={forms?.filter((i) => i.tag === "Other Info")} />
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

export default AddData;
