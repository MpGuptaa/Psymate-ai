import React, { useEffect, useState } from "react";
import Notfound from "./Notfound";
import { camelCaseToNormalCase, getTimeDifference } from "../../../../helpers/Helper";
import Tools from "../../../Forms/Builder/Tools";
import { Button, Col } from "reactstrap";
import { toast } from "react-toastify";
import PrescriptionCreate from "../../../Prescriptions/PrescriptionCreate";
import ClinicalNotes from "../../../Prescriptions/ClinicalNotes";
import LabOrders from "../../../Prescriptions/LabOrders";
import { Link } from "react-router-dom";
import axios from "axios";
import { addNewPrescription as onAddNewPrescription } from "../../../../store/prescription/action";
import { useDispatch } from "react-redux";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import TreatmentPlan from "../../../Prescriptions/TreatmentPlan";

const Timeline = ({ userId, user }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState({
    index: null,
    type: null,
  });
  const [timeline, setTimeline] = useState([]);
  const [clincalInputs, setClincalInputs] = useState([]);
  const dispatch = useDispatch();
  const { userProfile } = useProfile();

  const clearSelection = () => {
    setSelectedItemIndex({ index: null, type: null });
  };

  const getTimeline = async () => {
    await axios
      .get(`/timeline?search=${userId},appointment&searchBy=userId,type&operation=true&operator=in`)
      .then((res) => {
        setTimeline(res.data);
      });
  };

  useEffect(() => {
    getTimeline();
  }, [userId]);

  return (
    <div className="timeline">
      {timeline?.filter((i) => i.type === "appointment").length === 0 ? (
        <Notfound text="No Data Found" />
      ) : (
        timeline
          ?.filter((i) => i.type === "appointment")
          ?.map((time, index) => {
            return (
              <div key={index} className={`timeline-item`}>
                <i className="icon ri-stack-line"></i>
                <div className="date">{new Date(time.createdAt).toDateString()}</div>
                <div className="content">
                  {selectedItemIndex.index === index ? (
                    <div>
                      <h5 className="mb-4">{camelCaseToNormalCase(selectedItemIndex.type)}</h5>

                      {selectedItemIndex.type === "vitalSigns" && (
                        <div>
                          <Tools
                            setState={setClincalInputs}
                            state={clincalInputs}
                            inputs={[
                              {
                                name: "weight",
                                label: "Weight(kg)",
                                element: "number",
                                placeholder: "Enter Reading",
                                width: 12,
                                horizontal: true,
                                colCssClasses: "my-2",
                              },
                              {
                                name: "bloodPressure",
                                label: "Blood Pressure",
                                element: "number",
                                placeholder: "Enter Reading",
                                width: 12,
                                horizontal: true,
                                colCssClasses: "my-2",
                              },
                              {
                                name: "pulse",
                                label: "Pulse",
                                element: "number",
                                placeholder: "Enter Reading",
                                width: 12,
                                horizontal: true,
                                colCssClasses: "my-2",
                              },
                              {
                                name: "temperature",
                                label: "Temperature",
                                element: "number",
                                placeholder: "Enter Reading",
                                width: 12,
                                horizontal: true,
                                colCssClasses: "my-2",
                              },
                              {
                                name: "respRate",
                                label: "Resp. Rate",
                                element: "number",
                                placeholder: "Enter Reading",
                                width: 12,
                                horizontal: true,
                                colCssClasses: "my-2",
                              },
                            ]}
                          />
                          <Col lg={12} className="mt-2">
                            <Button
                              onClick={() => {
                                const payload = {
                                  ...clincalInputs,
                                  user: userId,
                                  createdBy: time.userId[1],
                                  careManager: userProfile._id,
                                  appointment: time.postId,
                                  items: [],
                                  date: new Date().toISOString(),
                                  addToCart: false,
                                  type: "vitalSigns",
                                };
                                dispatch(
                                  onAddNewPrescription({
                                    data: payload,
                                  }),
                                );
                                toast.success("Prescription Generated");
                              }}
                            >
                              Save Changes
                            </Button>
                          </Col>
                        </div>
                      )}
                      {selectedItemIndex.type === "prescriptions" && (
                        <PrescriptionCreate
                          width="col-12"
                          id={userId}
                          time={time}
                          callBack={async () => {
                            clearSelection();
                            await getTimeline();
                            toast.success("Prescription Generated, Please wait while the page is redirected");
                          }}
                        />
                      )}
                      {selectedItemIndex.type === "clinicalNotes" && (
                        <ClinicalNotes
                          time={time}
                          establishmentData={[
                            {
                              _id: "1",
                              establishmentName: "Complaints",
                            },
                            {
                              _id: "2",
                              establishmentName: "Observations",
                            },
                            {
                              _id: "3",
                              establishmentName: "Diagnoses",
                            },
                            {
                              _id: "4",
                              establishmentName: "Notes",
                            },
                          ]}
                          user={user}
                        />
                      )}
                      {selectedItemIndex.type === "labOrders" && <LabOrders width="col-12" time={time} user={user} />}
                      {selectedItemIndex.type === "treatmentPlan" && (
                        <TreatmentPlan
                          clinicalNotes={[
                            {
                              _id: "1",
                              establishmentName: "Complaints",
                            },
                            {
                              _id: "2",
                              establishmentName: "Observations",
                            },
                            {
                              _id: "3",
                              establishmentName: "Diagnoses",
                            },
                            {
                              _id: "4",
                              establishmentName: "Notes",
                            },
                          ]}
                          width="col-12"
                          time={time}
                          user={user}
                        />
                      )}

                      <Button className="mt-2" onClick={clearSelection}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex">
                      {/* <div className="flex-shrink-0">
                        <img src={avatar5} alt="" className="avatar-sm rounded" />
                      </div> */}
                      <div className="flex-grow-1 ms-3">
                        <h5 className="text-capitalize">
                          {new Date(time?.createdAt).toDateString()}
                          <small className="text-muted fs-13 fw-normal">- {getTimeDifference(time?.createdAt)}</small>
                        </h5>
                        <p className="text-muted mb-2">{time?.description}</p>
                        <div className="hstack gap-2">
                          {time?.reference?.document?.[0]?.Location && (
                            <Link
                              to={time?.reference?.document?.[0]?.Location}
                              download
                              className="btn btn-sm btn-light"
                            >
                              Download
                            </Link>
                          )}

                          {time?.type === "appointment" && (
                            <select
                              onChange={(e) => {
                                setSelectedItemIndex({ type: e.target.value, index });
                              }}
                              className={`form-select w-50 form-select-sm`}
                            >
                              <option>Add Records</option>
                              <option value="vitalSigns">Vital Signs</option>
                              <option value="clinicalNotes">Clinical Notes</option>
                              <option value="prescriptions">RX</option>

                              <option value="labOrders">Lab Orders</option>
                              <option value="treatmentPlan">Treatment Plan</option>
                            </select>
                          )}
                        </div>
                        <div className="hstack flex-wrap gap-2">
                          {time?.updates?.map((i) => (
                            <div className="flex-grow-2 me-2 mt-2" key={i.id}>
                              {i?.document?.document?.[0]?.Location && (
                                <Link
                                  to={i?.document?.document?.[0]?.Location}
                                  download
                                  className="btn btn-sm btn-light"
                                >
                                  Download {camelCaseToNormalCase(i.type)}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default Timeline;
