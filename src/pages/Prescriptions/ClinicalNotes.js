import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { toast } from "react-toastify";
import { addNewPrescription as onAddNewPrescription } from "../../store/prescription/action";
import { useDispatch } from "react-redux";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { inputValueChange, toCamelCase } from "../../helpers/Helper";

const ClinicalNotes = ({ establishmentData, user, time }) => {
  const [selectedEstablishment, setEstablishment] = useState();
  const [sessions, setSessions] = useState([]);
  const [state, setState] = useState({});
  const dispatch = useDispatch();
  const { userProfile } = useProfile();
  return (
    <div>
      {establishmentData.map((establishment) => (
        <div key={establishment._id} className="d-flex  gap-3 pb-4 flex-column" style={{ cursor: "pointer" }}>
          <p
            onClick={() => {
              if (selectedEstablishment) setEstablishment();
              else {
                setEstablishment(establishment);
              }
            }}
            className="ml-2 mb-0 clinic-name-container"
          >
            {establishment.establishmentName}
          </p>
          {establishment._id === selectedEstablishment?._id && (
            <Row>
              <Col lg={12}>
                <textarea
                  onChange={(e) => {
                    inputValueChange(e, "text", toCamelCase(establishment.establishmentName), state, setState);
                  }}
                  className="form-control bg-light border-light"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder={`Enter ${establishment.establishmentName}`}
                ></textarea>
              </Col>
            </Row>
          )}
        </div>
      ))}
      <Col lg={12} className="mt-2">
        <Button
          onClick={() => {
            const newSession = {
              establishmentId: selectedEstablishment._id,
              doctorId: user._id,
              startTime: new Date().toISOString(),
              endTime: new Date().toISOString(),
              weekdays: [],
            };
            const payload = {
              ...state,
              user: user._id,
              appointment: time.postId,
              createdBy: time.userId[1],
              careManager: userProfile._id,
              date: new Date().toISOString(),
              addToCart: false,
              type: "clinicalNotes",
            };
            dispatch(onAddNewPrescription({ data: payload }));
            toast.success("Prescription Generated");
            setSessions([...sessions, newSession]);
          }}
        >
          Save Changes
        </Button>
      </Col>
    </div>
  );
};

export default ClinicalNotes;
