import React, { useEffect, useState } from "react";

import { CardBody, Row, Col, Card, Container, Form, Input, Label, Table, FormFeedback, Tooltip } from "reactstrap";
import AsyncSelect from "react-select/async";

import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";

import BreadCrumb from "../../Components/Common/BreadCrumb";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import { loading, useProfile } from "../../Components/Hooks/UserHooks";
import { getUsers } from "../../store/users/action";

import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";

const MultipleAppointments = () => {
  const dispatch = useDispatch();
  const { userProfile, loading } = useProfile();
  const navigate = useNavigate();
  const [searchBy, setsearchBy] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([
    {
      establishment: "",
      practitioner: "",
      date: "",
      time: "",
      duration: "",
      end: "",
      paymentPaid: false,
      comment: "",
    },
  ]);

  const { users } = useSelector((state) => ({
    users: state.User.users,
    user: state.Profile.user,
  }));
  const [tooltipOpen, setTooltipOpen] = useState({
    morning: false,
    afternoon: false,
    evening: false,
    night: false,
  });
  const toggle = (routine) => {
    setTooltipOpen({ [routine]: !tooltipOpen[routine] });
  };

  const filteredUsers = users.filter((user) => user.displayName.toLowerCase().includes(searchBy.toLowerCase()));
  const durationFormat = [
    {
      options: [
        { label: "Days", value: "days" },
        { label: "Weeks", value: "weeks" },
        { label: "Months", value: "months" },
        { label: "Years", value: "years" },
      ],
    },
  ];

  useEffect(() => {
    dispatch(getUsers(userProfile?.type, 1, `search=${userProfile?.type}&searchBy=type`));
  }, [dispatch, loading]);

  document.title = "Multiple Appointment | Psymate - Management Portal";

  const bookAppointments = async () => {
    for (let index = 0; index < selectedAppointments.length; index++) {
      const appointment = selectedAppointments[index];

      const bookingData = {
        patient: selectedOption?._id,
        duration: appointment.duration,
        doctorId: appointment.practitioner,
        startTime: `${new Date(appointment.date).toISOString().split("T")[0]}T${new Date(appointment.time).toISOString().split("T")[1]
          }`,
        establishmentId: appointment.establishment._id,
      };

      if (appointment.paymentPaid) {
        bookingData["payment"] = [{ amtPaid: 1500, method: "cash", currency: "₹", discount: 0 }];
      }
      toast.info("Booking in progress", { toastId: "booking-toast" + index });
      try {
        const res = await axios.post(config.api?.API_URL + "/booking/appointment", bookingData);
        fetchEvents(appointment.practitioner._id);
        toast.update("booking-toast" + index, { render: "Booked", type: "success" });
      } catch (err) {
        toast.error(err);
        toast.update("booking-toast" + index, { render: "Not Available", type: "error" });
      }
    }
  };
  const validation = useFormik({
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      resetForm();
      toggle();
    },
  });
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [doctorEvents, setDoctorEvents] = useState({});
  const fetchEvents = async (doctorId) => {
    axios.get(`${config.api.API_URL}/appointment?search=${doctorId}&searchBy=doctor._id`).then((res) => {
      setDoctorEvents((prevDoctorEvents) => ({
        ...prevDoctorEvents,
        [doctorId]: res.data,
      }));
    });

    if (users?.length !== 0) {
      users
        .filter((doctor) => selectedDoctors.includes(doctor._id))
        .map((doctor) => {
          return (
            doctorEvents[doctor._id] &&
            doctorEvents[doctor._id].map((event) => {
              // console.log(event);
            })
          );
        });
    }

    // console.log("doctorEvents : ", doctorEvents);
  };
  const addAppointment = (event) => {
    event.preventDefault();
    setSelectedAppointments((prevAppointments) => [
      ...prevAppointments,
      {
        establishment: "",
        practitioner: "",
        date: "",
        time: "",
        duration: "",
        end: "",
        paymentPaid: false,
        comment: "",
      },
    ]);
  };

  const handleFieldChange = (index, fieldName, value) => {
    const updatedAppointments = [...selectedAppointments];
    updatedAppointments[index][fieldName] = value;
    setSelectedAppointments(updatedAppointments);
  };

  const handlePaymentPaid = (index) => {
    setSelectedAppointments((prevAppointments) => {
      const updatedAppointments = prevAppointments.map((appt, i) => {
        if (i === index) {
          return {
            ...appt,
            paymentPaid: !appt.paymentPaid,
          };
        }
        return appt;
      });
      return updatedAppointments;
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Appointments" pageTitle="Multiple Appointments" />
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card>
              <Form
                className="needs-validation"
                name="event-form"
                id="form-event"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedOption || selectedOption.length === 0) {
                    toast.error("Select Patient");
                    return;
                  }
                  try {
                    await bookAppointments();
                    navigate('/apps-calendar');
                  } catch (error) {
                    toast.error("Error :- " + error);
                  }
                }}
              >
                <Row className="event-form">
                  <Col xs={12}>
                    <div className="m-3 d-flex justify-content-between align-items-center">
                      <Label className="form-label mb-0 custom-label">Patient Name</Label>
                      <AsyncSelect
                        className="mb-0 col-10 calendar-patient-container"
                        value={{
                          value: selectedOption,
                          label:
                            (selectedOption?.displayName || "Search By Name ") +
                            " - " +
                            (selectedOption?.phone || "or Phone"),
                        }}
                        placeholder="Search For Patients"
                        onChange={(e) => {
                          e && setSelectedOption(e?.value);
                        }}
                        loadOptions={async (inputValue) => {
                          try {
                            const response1Promise = axios.get(
                              config.api.API_URL +
                              `/users?search=${inputValue},patient&type=patient&searchBy=displayName,type`,
                            );

                            const response2Promise = axios.get(
                              config.api.API_URL +
                              `/users?search=${inputValue},patient&type=patient&searchBy=phone,type`,
                            );

                            const [response1, response2] = await Promise.all([response1Promise, response2Promise]);

                            let groupedOptions = [];

                            if (response1.data && response1.data.length > 0) {
                              const options1 = response1.data.map((item) => ({
                                label: item?.displayName + " - " + item?.phone,
                                value: item,
                              }));
                              groupedOptions.push({
                                options: options1,
                              });
                            }

                            if (response2.data && response2.data.length > 0) {
                              const options2 = response2.data.map((tool) => ({
                                label: tool?.displayName == "undefined" ? "" : tool?.displayName + " - " + tool?.phone,
                                value: tool,
                              }));
                              groupedOptions.push({
                                options: options2,
                              });
                            }

                            return groupedOptions; // Return the final grouped options
                          } catch (error) {
                            toast.error("Error loading options:", error);
                            return [];
                          }
                        }}
                        isClearable
                        isSearchable
                      />
                      <Link to="/personal-details">
                        <div
                          style={{
                            border: "2px solid #fa896b",
                            padding: "2px",
                          }}
                        >
                          <i className="las la-plus"></i>
                        </div>
                      </Link>
                      {validation.touched.category && validation.errors.category ? (
                        <FormFeedback type="invalid">{validation.errors.category}</FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <CardBody>
                    <div className="">
                      <Table className="combo-table table-borderless table-nowrap mb-0">
                        <thead className="align-middle">
                          <tr className="table-active">
                            <th scope="col" style={{ width: "3%" }}>
                              #
                            </th>
                            <th scope="col" style={{ width: "35%" }}>
                              <div className="d-flex currency-select input-light align-items-center">
                                Establishments
                              </div>
                            </th>
                            <th scope="col" style={{ width: "25%" }}>
                              <div className="d-flex currency-select input-light align-items-center">Practitioners</div>
                            </th>
                            <th scope="col" style={{ width: "27%" }}>
                              Date & Time
                            </th>
                            <th scope="col" className="text-end" style={{ width: "10%" }}>
                              Payment Status
                            </th>
                            <th scope="col" className="text-end" style={{ width: "10%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody id="newlink">
                          {selectedAppointments?.map((appointment, index) => {
                            if (!appointment.quantity) appointment.quantity = 1;
                            return (
                              <tr id={index} key={index} className="appointment">
                                <th scope="row" className="appointment-id">
                                  {index + 1}
                                </th>
                                <td className="text-start">
                                  <div className="col-10">
                                    <AsyncSelect
                                      required={true}
                                      className="mb-3"
                                      value={
                                        appointment.establishment
                                          ? {
                                            value: appointment.establishment,
                                            label: appointment.establishment.establishmentName,
                                          }
                                          : null
                                      }
                                      placeholder="Search For Establishment"
                                      onChange={(selectedOption) =>
                                        handleFieldChange(
                                          index,
                                          "establishment",
                                          selectedOption ? selectedOption.value : "",
                                        )
                                      }
                                      loadOptions={async (inputValue) => {
                                        try {
                                          const response = await axios.get(
                                            config.api?.API_URL + `/establishment?search=${inputValue}`,
                                          );
                                          const data = response.data;
                                          const options = data.map((item) => ({
                                            value: item,
                                            label: item.establishmentName,
                                          }));
                                          return options;
                                        } catch (error) {
                                          toast.error("Error loading options:", error);
                                          return [];
                                        }
                                      }}
                                      isSearchable
                                    />
                                  </div>

                                  <div className="mb-3 col-10">
                                    <Input
                                      type="textarea"
                                      className="form-control d-block"
                                      id="event-comments"
                                      name="comments"
                                      placeholder="Enter a Comment..."
                                      rows="4"
                                      value={appointment.comment}
                                      onChange={(e) => handleFieldChange(index, "comment", e.target.value)}
                                    ></Input>
                                  </div>
                                </td>

                                <td>
                                  <div className="mb-3 d-flex justify-content-between">
                                    <select
                                      required={true}
                                      className="form-select mb-3 calendar-patient-container"
                                      value={appointment.practitioner}
                                      onChange={(e) => handleFieldChange(index, "practitioner", e.target.value)}
                                    >
                                      <option value="" disabled hidden>
                                        Search For Doctors...
                                      </option>
                                      {filteredUsers.map((item) => (
                                        <option key={item._id} value={item._id}>
                                          {item.displayName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </td>
                                <td>
                                  <div className="mb-3 d-flex col-6">
                                    <Flatpickr
                                      className="form-control"
                                      options={{
                                        dateFormat: "Y-m-d",
                                        minDate: "today",
                                      }}
                                      required={true}
                                      onChange={(selectedtime) => handleFieldChange(index, "date", selectedtime)}
                                      value={appointment.date}
                                      placeholder="Select Date"
                                    />
                                  </div>

                                  <div className="justify-content-between">
                                    <div className="col-6 mb-1">
                                      <Flatpickr
                                        className="form-control"
                                        options={{
                                          enableTime: true,
                                          noCalendar: true,
                                          dateFormat: "H:i",
                                        }}
                                        required={true}
                                        onChange={(selectedDates) => {
                                          const startTime = new Date(selectedDates[0]);
                                          if (!appointment.duration) {
                                            appointment.duration = 15;
                                          }
                                          const endTime = new Date(startTime.getTime() + appointment.duration * 60000);
                                          setSelectedAppointments((prevAppointments) => {
                                            const updatedAppointments = [...prevAppointments];
                                            updatedAppointments[index] = {
                                              ...updatedAppointments[index],
                                              date: startTime,
                                              time: startTime,
                                              duration: appointment.duration,
                                              end: endTime,
                                            };
                                            return updatedAppointments;
                                          });
                                        }}
                                        placeholder="Start Time"
                                        value={appointment.time}
                                      />
                                    </div>

                                    <div className="col-6 mb-1">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="Duration"
                                        value={appointment.duration}
                                        onChange={(e) => {
                                          const newDuration = parseInt(e.target.value, 10) || 0;
                                          const startTime = new Date(appointment.time);
                                          const endTime = new Date(startTime.getTime() + newDuration * 60000);

                                          setSelectedAppointments((prevAppointments) => {
                                            const updatedAppointments = [...prevAppointments];
                                            updatedAppointments[index] = {
                                              ...updatedAppointments[index],
                                              duration: newDuration,
                                              end: endTime,
                                            };
                                            return updatedAppointments;
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="col-6">
                                      <Flatpickr
                                        className="form-control"
                                        disabled={true}
                                        options={{
                                          enableTime: true,
                                          noCalendar: true,
                                          dateFormat: "H:i",
                                        }}
                                        placeholder="end Time"
                                        value={appointment.end}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="form-check mb-2">
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`formCheck${index}`}
                                      checked={appointment.paymentPaid}
                                      onChange={() => handlePaymentPaid(index)}
                                    />
                                    <Label className="form-check-label m-2" htmlFor={`formCheck${index}`}>
                                      Paid
                                    </Label>
                                  </div>
                                </td>
                                <td className="product-removal">
                                  <Link
                                    onClick={() => {
                                      setSelectedAppointments((prev) => {
                                        const newItems = prev;
                                        newItems.splice(index, 1);
                                        return [...newItems];
                                      });
                                    }}
                                    to="#"
                                    className="btn btn-danger"
                                  >
                                    Delete
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <button className="btn btn-success" onClick={addAppointment}>
                        Add Appointment
                      </button>
                      <button type="submit" className="btn btn-success" id="btn-save-event">
                        <i className="ri-printer-line align-bottom me-1"></i> Book Appointments
                      </button>
                    </div>
                  </CardBody>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MultipleAppointments;
