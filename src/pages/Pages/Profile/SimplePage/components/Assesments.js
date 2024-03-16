import React, { useEffect, useState } from "react";
import { useProfile } from "../../../../../Components/Hooks/UserHooks";
import axios from "axios";
import { Button, Card, CardBody } from "reactstrap";

import AssessmentLayout from "../../../../../helpers/AssessmentLayout";
import { toast } from "react-toastify";
import config from "../../../../../config";
import { validateForm } from "../../../../../helpers/Helper";
import "./ClinicalHistory.css";
import { useSelector, useDispatch } from "react-redux";
import { getTools as onGetTools } from "../../../../../store/tools/action";
import Notfound from "../Notfound";
import ChildrenModal from "../../../../../Components/Common/ChildrenModal";
import Tabs from "../../../../../Layouts/HistoryAssessmentsLayout/tabs";
import LeftTabs from "../../../../../Layouts/HistoryAssessmentsLayout/LeftTabs";

const Tools = ({ userId, search, searchBy }) => {
  const [form, setForm] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [secondModal, setSecondModal] = useState(false);

  const [page, setpage] = useState(1);
  const [state, setState] = useState({});
  const { userProfile } = useProfile();
  const initialState = {};
  const { tools } = useSelector((state) => ({
    tools: state.Tools.tools,
  }));
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState([]);

  // const getData = async () => {
  //   if (form?._id && userId)
  //     await axios.get(config.api.API_URL + `/clinical_data?patientId=${userId}&formId=${form?._id}`).then((res) => {
  //       setData(res.data);
  //     });
  // };

  useEffect(() => {
    dispatch(onGetTools(1, search, searchBy));

    // if (form?._id && userId) getData();
    if (form) {
      form.items.forEach((input) => {
        initialState[input?.name] = "";
      });
      setState(initialState);
      setInputs(form.items);
    }
  }, [form?._id, userId]);

  return (
    <div>
      <ChildrenModal
        size={"lg"}
        show={modal}
        onSubmit={() => {}}
        buttons={false}
        onCloseClick={() => {
          setModal(false);
        }}
        scrollable={true}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (validateForm(inputs, setInputs, state)) {
              try {
                setLoading(true);
                const loadingToastId = toast.info("Please wait while the report is being generated on our servers...", {
                  autoClose: 3000,
                });

                const res = await axios.post(`/clinical_data`, {
                  formId: form?._id,
                  patientId: userId,
                  doctorId: userProfile._id,
                  data: state,
                });

                setState(initialState);

                toast.update(loadingToastId, {
                  render: `${form.displayName} Saved on ${new Date().toLocaleDateString()}`,
                  type: toast.TYPE.SUCCESS,
                  autoClose: 5000,
                });

                setModal(false);
              } catch (error) {
                console.error(error);
                toast.error("An error occurred while saving.");
              } finally {
                setLoading(false);
              }
            }
          }}
          className="container justify-content-center align-items-center min-vh-100"
        >
          <LeftTabs heading={data?.displayName} form={data?.items} />
          {!loading && <Button type="submit">Submit</Button>}
        </form>
      </ChildrenModal>

      <ChildrenModal
        size={"lg"}
        show={secondModal}
        onSubmit={() => {}}
        buttons={false}
        onCloseClick={() => {
          setSecondModal(false);
        }}
        scrollable={false}
      >
        <Tabs
          heading={form?.displayName}
          onClick={(data) => {
            setModal(true);
            setSecondModal(false);
            setData(data);
          }}
        />
      </ChildrenModal>

      <div className="mb-2">
        <input
          onChange={(e) => {
            dispatch(onGetTools(1, `${search},${e.target.value}`, `${searchBy},displayName`));
          }}
          className="search form-control"
          placeholder="Search"
        />
      </div>
      <div>
        {tools?.data?.length > 0 ? (
          <div className="new-clinical-cards-outer-container">
            {tools.data?.map((item, key) => {
              return !item.subCategory ? (
                <Card
                  key={key}
                  onClick={() => {
                    setSecondModal(true);
                    axios
                      .get(`${config.api.API_URL}/api/tools?search=${item._id}&searchBy=_id&exact=true`)
                      .then((res) => {
                        setForm(res.data[0]);
                      });
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
              ) : (
                <Card
                  key={key}
                  onClick={() => {
                    setModal(true);
                    axios
                      .get(`${config.api.API_URL}/api/tools?search=${item._id}&searchBy=_id&exact=true`)
                      .then((res) => {
                        setForm(res.data[0]);
                      });
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
              );
            })}
          </div>
        ) : (
          <div>
            <Notfound text="Not Found" />
          </div>
        )}
      </div>

      <Button
        onClick={() => {
          const next = page - 1;
          setpage(next);
          dispatch(onGetTools(next, search, searchBy));
        }}
        className="me-3"
      >
        Previous
      </Button>
      <Button
        onClick={() => {
          const next = page + 1;
          setpage(next);
          dispatch(onGetTools(next, search, searchBy));
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default Tools;
