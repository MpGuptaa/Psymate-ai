import React, { useEffect, useState } from "react";
import { useProfile } from "../../../../../Components/Hooks/UserHooks";
import axios from "axios";
import { Card, Col, Table } from "reactstrap";
import FormVerticalLayout from "../../../../../helpers/FormVerticalLayout";
import { toast } from "react-toastify";
import config from "../../../../../config";
import { validateForm } from "../../../../../helpers/Helper";
import "./ClinicalHistory.css";
import { Link } from "react-router-dom";
const Clinicalhistory = ({ userId, subMenu, forms }) => {
  const [form, setForm] = useState();
  const [data, setData] = useState([]);
  const [state, setState] = useState({});
  const { userProfile } = useProfile();
  const initialState = {};

  const [inputs, setInputs] = useState([]);
  const getData = async () => {
    if (form?._id && userId)
      await axios.get(config.api.API_URL + `/clinical_data?patientId=${userId}&formId=${form?._id}`).then((res) => {
        setData(res.data);
      });
  };
  useEffect(() => {
    getData();
    if (form) {
      form?.items?.forEach((input) => {
        initialState[input?.name] = "";
      });
      setState(initialState);
      setInputs(form?.items);
    }
  }, [form?._id, userId]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (validateForm(inputs, setInputs, state))
          await axios
            .post(`/clinical_data`, {
              formId: form?._id,
              patientId: userId,
              doctorId: userProfile._id,
              data: state,
            })
            .then((res) => {
              setState(initialState);
              toast.success(`${form.displayName} Saved on ${new Date().toLocaleDateString()}`);
            });
      }}
    >
      {form && (
        <Col
          style={{
            marginBottom: 3,
          }}
          onClick={() => {
            setForm();
          }}
          xxl={3}
          sm={6}
        >
          <button className="btn btn-sm btn-outline-success">Go Back</button>
        </Col>
      )}

      {form && (
        <>
          <FormVerticalLayout heading={form?.displayName} form={inputs} state={state} setState={setState} />
          <button type="submit" className="btn btn-sm btn-outline-success">
            Save Form
          </button>
          <Table className="align-middle table-nowrap mb-0">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((i) => {
                return (
                  <tr key={i._id}>
                    <td>{new Date(i.createdAt).toLocaleString()}</td>
                    <td className="link-success"></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      {!form && (
        <div className="new-clinical-cards-outer-container">
          {(forms.filter((form) => form.category === subMenu) || [])?.map((item, key) => {
            return (
              <Col key={key}>
                <div
                // onClick={() => {
                //   setForm(item);
                // }}
                // className={`profile-project-card mt-4 cursor-pointer shadow-none profile-project-${item.cardBorderColor}`}
                >
                  <Link
                    to={`/layout/tabs/top/subtags?id=${userId}&formId=${item?._id}`}
                    state={item}
                    setState={setState}
                    clinicState={state}
                    userId={userId}
                  >
                    <div className="new-clinical-cards-inner-container">
                      <div>
                        <h5 className="text-dark">{item.displayName}</h5>
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h5 className="fs-13  mb-0 font-dark">Category : </h5>
                          </div>
                          <div>
                            <h5 className="fs-13  mb-0">{item.category}</h5>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h5 className="fs-13  mb-0 font-dark">Items : </h5>
                          </div>
                          <div>
                            <h5 className="fs-13  mb-0">{item.items.length}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            );
          })}
        </div>
      )}
    </form>
  );
};

export default Clinicalhistory;
