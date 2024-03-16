import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import config from "../../config";
import { toast } from "react-toastify";
import Flatpickr from "react-flatpickr";

const ChangeSessions = ({ establishmentData, doctor }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedEstablishment, setEstablishment] = useState();
  const [sessions, setSessions] = useState([]);
  const getSessions = async (clinicId) => {
    await axios
      .get(
        `/sessions?doctorId=${doctor._id}&slotDuration=120&establishmentId=${clinicId}&days=0-7&returnSession=true`
      )
      .then((res) => {
        setSessions(res);
      });
  };

  const handleChange = (index, value, key) => {
    const updatedSessions = [...sessions];
    updatedSessions[index][key] = value;
    setSessions(updatedSessions);
  };
  return (
    <div>
      {establishmentData.map((establishment) => (
        <div
          key={establishment._id}
          className="d-flex  gap-3 pb-4 flex-column"
          style={{ cursor: "pointer" }}
        >
          <p
            onClick={() => {
              if (selectedEstablishment) setEstablishment();
              else {
                setEstablishment(establishment);
                getSessions(establishment._id);
              }
            }}
            className="ml-2 mb-0 clinic-name-container"
          >
            {establishment.establishmentName}
          </p>
          {establishment._id === selectedEstablishment?._id && (
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="visitTime" className="form-label">
                    Doctor Visit Timings
                  </Label>
                </div>
              </Col>
              {sessions.map((session, index) => {
                return (
                  <Col className="" key={session._id} lg={12}>
                    <Label>Session {index + 1}</Label>
                    <div className="checkbox-days-container">
                      {daysOfWeek.map((day) => (
                        <div className="me-2" key={day}>
                          <label>
                            <input
                              type="checkbox"
                              checked={session.weekdays.includes(day)}
                              onChange={(e) => {
                                const selectedDay = day;
                                const isChecked = e.target.checked;
                                const updatedWeekdays = isChecked
                                  ? [...session.weekdays, selectedDay]
                                  : session.weekdays.filter(
                                      (d) => d !== selectedDay
                                    );

                                handleChange(
                                  index,
                                  updatedWeekdays,
                                  "weekdays"
                                );
                              }}
                              className="days-input"
                            />
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="startTimeInput"
                            className="form-label"
                          >
                            Start Time
                          </Label>

                          <Flatpickr
                            className="form-control"
                            placeholder="Select a date"
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                            }}
                            onChange={(e) =>
                              handleChange(index, e, "startTime")
                            }
                            value={session.startTime}
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="endTimeInput" className="form-label">
                            End Time
                          </Label>
                          <Flatpickr
                            className="form-control"
                            placeholder="Select a date"
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                            }}
                            onChange={(e) => handleChange(index, e, "endTime")}
                            value={session.endTime}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Button
                      onClick={() => {
                        if (session._id)
                          axios
                            .put(
                              `${config.api.API_URL}/sessions/${session._id}`,
                              sessions[index]
                            )
                            .then((res) => {
                              toast.success(`${"sessions"} Updated`);
                              getSessions();
                            });
                        else
                          axios
                            .post(
                              `${config.api.API_URL}/sessions`,
                              sessions[index]
                            )
                            .then((res) => {
                              toast.success(`${"Session"} Added`);
                              getSessions();
                            });
                      }}
                    >
                      Save Changes
                    </Button>
                    {session._id && (
                      <Button
                        className="ms-2"
                        onClick={() => {
                          axios
                            .delete(
                              `${config.api.API_URL}/sessions/${session._id}`
                            )
                            .then((res) => {
                              toast.success(`${"sessions"} Updated`);
                              getSessions();
                            });
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </Col>
                );
              })}
              <Col lg={12} className="mt-2">
                <Button
                  onClick={() => {
                    const newSession = {
                      establishmentId: selectedEstablishment._id,
                      doctorId: doctor._id,
                      startTime: new Date().toISOString(),
                      endTime: new Date().toISOString(),
                      weekdays: [],
                    };

                    setSessions([...sessions, newSession]);
                  }}
                >
                  Create Session
                </Button>
              </Col>
            </Row>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChangeSessions;
