import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
//Import Icons
import timeGridPlugin from "@fullcalendar/timegrid"; // Import the timeGridPlugin

import {
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Button,
  Input,
  Dropdown,
  NavItem,
  Nav,
  TabContent,
  TabPane,
} from "reactstrap";
import AsyncSelect from "react-select/async";

import * as Yup from "yup";
import { useFormik } from "formik";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import BootstrapTheme from "@fullcalendar/bootstrap";
//redux
import { useSelector, useDispatch } from "react-redux";
import DeleteModal from "../../Components/Common/DeleteModal";
import {
  getCategories as onGetCategories,
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  updateEvent as onUpdateEvent,
  resetCalendar,
} from "../../store/actions";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { generateRandomId } from "../../helpers/Helper";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import moment from "moment";
import { getUsers } from "../../store/users/action";
import "./calendar.css";
import TeamModal from "./TeamModal";
import Flatpickr from "react-flatpickr";
import classNames from "classnames";
import ChangeSessions from "./ChangeSessions";

const Calender = () => {
  document.title = "Calendar | Psymate - Management Portal";

  const dispatch = useDispatch();
  const [event, setEvent] = useState({});
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [calendarTimings, setCalendarTimings] = useState({
    startTime: "0",
    endTime: "23",
  });
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedNewDay, setSelectedNewDay] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditButton, setIsEditButton] = useState(true);
  const [doctor, setDoctor] = useState({});
  const [establishment, setEstablishment] = useState([]);
  const { loading, userProfile } = useProfile();
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState({
    clinicType: "virtual",
    status: "Scheduled",
    comments: "",
    date: selectedNewDay,
  });

  const { users, isEventUpdated } = useSelector((state) => ({
    users: state.User.users,
    categories: state.Calendar.categories,
    isEventUpdated: state.Calendar.isEventUpdated,
    user: state.Profile.user,
  }));

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

  useEffect(() => {
    if (userProfile)
      if (userProfile?.roles?.includes("superAdmin")) {
        if (users) {
          users.forEach((doctor) => {
            const doctorId = doctor._id;
            fetchEvents(doctorId);
          });
        }
      } else {
        fetchEvents(userProfile?._id);
      }
  }, [users]);
  const [type, setType] = useState("doctor");

  useEffect(() => {
    dispatch(onGetCategories());
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".external-event",
    });

    dispatch(getUsers(type, 1, `search=${type}&searchBy=type`));
  }, [dispatch, loading]);

  useEffect(() => {
    dispatch(getUsers(type, 1, `search=${type}&searchBy=type`));
  }, [type]);

  useEffect(() => {
    if (isEventUpdated) {
      setIsEdit(false);
      setEvent({});
      setTimeout(() => {
        dispatch(resetCalendar("isEventUpdated", false));
      }, 500);
    }
  }, [dispatch, isEventUpdated]);

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEvent(null);
      setIsEdit(false);
      setIsEditButton(true);
    } else {
      setModal(true);
    }
  };
  /**
   * Handling date click on calendar
   */

  const [doctorSessions, setDoctorSessions] = useState([]);
  const [equalDoctorId, setEqualDoctorId] = useState("");
  const [establishmentData, setEstablishmentData] = useState([]);
  const [clinicName, setClinicName] = useState([]);
  const [slotsData, setSlotsData] = useState([]);

  const [clinicId, setClinicId] = useState([]);
  const est = async () => {
    const response = await axios.get(config.api?.API_URL + `/establishment`);
    // console.log("!!! : ", response);
    const filteredData = response.data.filter((item) => item.establishmentName);
    setEstablishmentData(response.data);
    // console.log("esya : ",response.data)
    // Extract establishment names
    const establishmentNames = filteredData.map((item) => item.establishmentName);

    // console.log("Establishment Names: ", establishmentNames);
    setClinicName(establishmentNames);
  };

  // console.log("getSessions : ", user);
  useEffect(() => {
    est();
  }, [users]);

  // useEffect(() => {
  //   if (doctorSessions.doctorId == user._id) {
  //     setEqualDoctorId(doctorSessions.establishmentId);
  //   }
  //   console.log('EEE : ', equalDoctorId);
  // }, []);

  const [selectedDate, setSelectedDate] = useState({
    date: [],
    start: [],
    end: [],
    duration: [],
  });
  const [selectedTimeDrop, setSelectedTimeDrop] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");

  const latestDoctorRef = useRef();

  const str_dt = function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var d = new Date(date),
      month = "" + monthNames[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day + " " + month, year].join(",");
  };

  const date_r = function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    // console.log("handleEventClick : ", arg);
    const event = arg.event;

    const st_date = event.start;
    const ed_date = event.end;
    const r_date = ed_date == null ? str_dt(st_date) : str_dt(st_date) + " to " + str_dt(ed_date);
    const er_date = ed_date == null ? date_r(st_date) : date_r(st_date) + " to " + date_r(ed_date);
    setEvent({
      id: event.id,
      props: event._def.extendedProps,
      title: event.title,
      start: event.start,
      end: event.end,
      className: event.classNames,
      category: event.classNames[0],
      location: event._def.extendedProps.location,
      description: event._def.extendedProps.description,
      defaultDate: er_date,
      datetag: r_date,
    });

    setIsEdit(true);
    setIsEditButton(false);
    toggle();
  };
  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    dispatch(onDeleteEvent(event));
    setDeleteModal(false);

    axios.delete(config.api?.API_URL + `/booking/appointment?id=${event.props.bookingId}`).then((res) => {
      toast.success("Appointment Cancelled");
      fetchEvents(userProfile._id);
      toggle();
    });
  };

  // events validation
  const [doctorIdForPayment, setDoctorIdForPayment] = useState("");
  const isStatusConfirmed = useRef(false);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      location: (event && event.location) || "",
      comments: (event && event.comments) || "",
      defaultDate: (event && event.defaultDate) || "",
      datetag: (event && event.datetag) || "",
    },

    validationSchema: Yup.object({}),
    onSubmit: (values) => {
      var updatedDay = "";
      if (selectedNewDay) {
        updatedDay = new Date(selectedNewDay[1]);
        updatedDay.setDate(updatedDay.getDate() + 1);
      }

      if (isEdit) {
        const updateEvent = {
          id: event.id,
          title: values.title,
          className: values.category,
          start: selectedNewDay ? selectedNewDay[0] : event.start,
          end: selectedNewDay ? updatedDay : event.end,
          location: values.location,
          description: values.description,
        };
        // update event
        dispatch(onUpdateEvent(updateEvent));
        validation.resetForm();
      } else {
        const bookAppointments = async () => {
          for (let index = 0; index < selectedDate.date.length; index++) {
            const date = selectedDate.date[index];
            const bookingData = {
              patient: selectedOption?._id,
              duration: selectedDate.duration[index],
              doctorId: selectedUser?._id,
              startTime: `${new Date(date).toISOString().split("T")[0]}T${
                new Date(selectedDate.start[index]).toISOString().split("T")[1]
              }`,
              establishmentId: establishment._id,
            };

            if (paymentPaid) {
              bookingData["payment"] = [{ amtPaid: selectedUser?.price || 0, method: "cash", currency: "₹", discount: 0 }];
            }
            toast.info("Booking in progress", { toastId: "booking-toast" });

            try {
              const res = await axios.post(config.api?.API_URL + "/booking/appointment", bookingData);
              // window.location.reload();
              fetchEvents(selectedUser?._id);
              toast.update("booking-toast", { render: "Booked", type: "success" });
            } catch (err) {
              console.error(err);
              toast.update("booking-toast", { render: "Not Available", type: "error" });
            }
          }
        };
        bookAppointments();

        validation.resetForm();
      }
      setSelectedDay(null);
      setSelectedNewDay(null);
      toggle();
    },
  });

  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [allDoctorIds, setAllDoctorIds] = useState([]);

  useEffect(() => {
    // Initialize allDoctorIds when users change
    const doctorIds = users.map((doctor) => doctor._id);
    setAllDoctorIds(doctorIds);
    setSelectedDoctors(doctorIds);
  }, [users]);
  // Function to handle checkbox changes

  const handleCheckboxTeamChange = (doctorId) => {
    setSelectedDoctors((prevSelectedDoctors) => {
      if (prevSelectedDoctors.includes(doctorId)) {
        // If doctorId is already in the list, remove it
        return prevSelectedDoctors.filter((id) => id !== doctorId);
      } else {
        // If doctorId is not in the list, add it
        return [...prevSelectedDoctors, doctorId];
      }
    });
  };

  const handleCheckboxEstChange = (doctorId, isClinic = false, e) => {
    setSelectedDoctors((prevSelectedDoctors) => {
      if (isClinic) {
        const { checked } = e.target;

        if (!checked) {
          return allDoctorIds;
        }

        const matchedEstablishmentObj = establishmentData.find((obj) => obj.establishmentName === doctorId);

        const allMatchingDocs = Object.entries(doctorSessions)
          .map(([key, value]) => value)
          .flat()
          .filter((item) => item.establishmentId === matchedEstablishmentObj._id)
          .map((obj) => obj.doctorId);

        const uniqueMatchedDocsIdArr = [...new Set(allMatchingDocs)];

        // console.log(uniqueMatchedDocsIdArr);

        return uniqueMatchedDocsIdArr;
      }

      if (prevSelectedDoctors.includes(doctorId)) {
        // If doctorId is already in the list, remove it
        return prevSelectedDoctors.filter((id) => id !== doctorId);
      } else {
        // If doctorId is not in the list, add it
        return [...prevSelectedDoctors, doctorId];
      }
    });
  };

  const [selectedTime, setSelectedTime] = useState(15);

  /**
   * On calendar drop event
   */
  let dropCount = 0;

  const onDrop = (event, doctorId) => {
    dropCount++;

    if (dropCount === 1) {
      if (!selectedOption) {
        toast.error("Please select a patient");
        return;
      }
      if (!establishment) {
        return toast.error("Please select a patient");
      }
      const date = event["date"];
      // console.log("Datteee : ", date);
      const updatedAt = new Date(date).toISOString();

      const bookingData = {
        patient: selectedOption?._id, // Assuming selectedOption is defined
        duration: selectedTime ? selectedTime : data.duration,
        doctorId: doctorId, // Assuming doctorId is defined
        startTime: selectedStartTime ? selectedStartTime : updatedAt,
        establishmentId: establishment._id, // Assuming establishment is defined
      };

      // Show initial toast
      toast.info("Booking in progress", { toastId: "booking-toast" });

      axios
        .post(config.api?.API_URL + "/booking/appointment", bookingData)
        .then((res) => {
          // Update toast on successful booking
          toast.success("Booking Successfull", { toastId: "booking-toast" });

          // Fetch events and dispatch new event if needed
          fetchEvents(doctorId);

          const draggedEl = event.draggedEl;
          const draggedElclass = draggedEl.className;
          if (draggedEl.classList.contains("external-event") && draggedElclass.indexOf("fc-event-draggable") === -1) {
            dispatch(onAddNewEvent(bookingData));
          }
        })
        .catch((err) => {
          // Update toast on error
          toast.success("Not Available", { toastId: "booking-toast" });
        });
    }
  };

  const [paymentPaid, setPaymentPaid] = useState(false);

  const handlePaymentPaid = () => {
    setPaymentPaid(!paymentPaid);
  };

  function handleEventDrop(event) {
    const { id, start, end } = event.event;
    const details = event.event._def.extendedProps;
    // Access the updated start and end times
    const updatedAt = new Date(start).toISOString();
    axios
      .put(config.api?.API_URL + `/booking/appointment/${details.bookingId}`, {
        patient: details.patient?._id,
        doctorId: details?.doctor?._id,
        startTime: selectedStartTime ? selectedStartTime : updatedAt,
        establishmentId: details?.establishment._id,
      })
      .then((res) => {
        fetchEvents(details?.doctor?._id);
        toast.info(res?.message || "Appointment Updated");
      });
  }

  function handleEventResize(event) {
    const { id, start, end } = event.event;
    // Access the updated start and end times
  }

  const [selectedSection, setSelectedSection] = useState("schedule");
  const [modal_team, setmodal_team] = useState(false);
  function tog_team() {
    setmodal_team(!modal_team);
  }

  const [modal_establishment, setmodal_establishment] = useState(false);
  function tog_establishment() {
    setmodal_establishment(!modal_establishment);
  }

  const doctorsToShow = users.filter((doctor) => selectedDoctors.includes(doctor._id));

  //  console.log(users)

  const [searchBy, setsearchBy] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) => user.displayName?.toLowerCase().includes(searchBy.toLowerCase()));
  const handleDateClick = (arg, doctor) => {
    // console.log("arg : ", doctor);
    const dateTime = new Date(arg.dateStr);
    const formattedDateTime = new Date(arg.dateStr).toISOString();
    // console.log("formattedDateTime : ",formattedDateTime);
    setSelectedStartTime(formattedDateTime);
    // Get date components
    const year1 = dateTime.getFullYear();
    const month1 = dateTime.getMonth() + 1; // Month is zero-based
    const day1 = dateTime.getDate();

    // Get time components
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    // Convert to 12-hour format
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    // Format date and time as needed
    const formattedDate = `${year1}-${month1 < 10 ? "0" : ""}${month1}-${day1 < 10 ? "0" : ""}${day1}`;
    const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

    setSelectedTimeDrop(formattedTime);

    // Store the latest doctor information in the ref
    latestDoctorRef.current = doctor;
    setSelectedUser(doctor);
    setDoctorIdForPayment(doctor._id);

    const [startHour, startMinute] = formattedTime.split(/:| /);
    let endHour = parseInt(startHour, 10) + Math.floor(selectedTime / 60);
    let endMinute = parseInt(startMinute, 10) + (selectedTime % 60);

    // Adjust for AM/PM and handle overflow
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }

    if (endHour > 12 && ampm === "AM") {
      endHour -= 12;
    }
    // else if (endHour > 12 && ampm === "PM") {
    //   endHour -= 12;
    // }

    const endTime = `${endHour}:${endMinute < 10 ? "0" : ""}${endMinute} ${ampm}`;
    setSelectedEndTime(endTime);
    // console.log("Date:", formattedDate);
    // console.log("Time:", formattedTime);

    const date = arg["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(year, month, day, currentHour, currentMin, currentSec);
    // console.log(doctor.displayName, "111");

    // console.log("currentHour : ", arg);
    const modifiedData = { ...arg, date: modifiedDate };
    setSelectedNewDay(date);
    setSelectedDay(modifiedData);
    setSelectedDate({
      date: [formattedDateTime],
      start: [dateTime],
      end: [endTime],
      duration: [15],
    });
    toggle();
  };
  const getStatusColor = (status) => {
    // console.log("status : ", status);
    if (status === "scheduled") {
      return "#43CBFF";
    } else if (status === "confirmed") {
      return "rgb(13, 32, 141)";
    } else if (status === "engaged") {
      return "rgb(221, 21, 21)";
    } else if (status === "checked-in") {
      return `rgb(251, 201, 77)`;
    } else if (status === "checked-out") {
      return `rgb(9, 97, 49)`;
    } else if (status === "cancelled") {
      return "#7d368a";
    } else {
      return;
    }
  };

  const handleDynamicDoctorId = () => {
    for (let key in doctorEvents) {
      if (doctorIdForPayment === key) {
        doctorEvents[key]?.map((event) => {
          let slot = event?.slot;
          let startTime = slot[0] + slot[1] + slot[2] + slot[3] + slot[4];
          let endTime = slot[8] + slot[9] + slot[10] + slot[11] + slot[12];
          let endTimeMatch =
            selectedEndTime[0] + selectedEndTime[1] + selectedEndTime[2] + selectedEndTime[3] + selectedEndTime[4];
          if (startTime === selectedTimeDrop && event?.status === "confirmed" && endTime === endTimeMatch) {
            isStatusConfirmed.current = true;
            console.log(isStatusConfirmed);
          }
        });
      }
    }
  };

  // state to store establishmentId as key and doctors as value in form of array
  // will run only when establishmentData is fetched
  useEffect(() => {
    const allMatchingDocs = Object.entries(doctorSessions)
      .map(([key, value]) => value)
      .flat();
    let obj = {};
    establishmentData?.forEach((item) => {
      let redundantArr = allMatchingDocs?.filter((element) => element.establishmentId === item._id),
        set = new Set(),
        arr = [];
      redundantArr.forEach((element) => set.add(element.doctorId));
      redundantArr.forEach((element) => {
        if (set.has(element.doctorId)) {
          set.delete(element.doctorId);
          arr.push(element);
        }
      });
      obj[item?._id] = arr;
    });
  }, [establishmentData, doctorSessions]);

  useEffect(() => {
    let newConfirmed = {},
      newScheduled = {},
      newCheckedIn = {},
      newCheckedOut = {};
    for (let key in doctorEvents) {
      let confirmedCount = 0,
        scheduledCount = 0,
        checkInCount = 0,
        checkOutCount = 0;
      if (doctorEvents[key]?.length !== 0) {
        doctorEvents[key]?.map((event) => {
          let todayAppointmentDate = event?.appointmentDate[event?.appointmentDate.length - 1];
          if (event?.appointmentDate[event?.appointmentDate.length - 2] !== "0") {
            todayAppointmentDate = event?.appointmentDate[event?.appointmentDate.length - 2] + todayAppointmentDate;
          }
          if (event?.status === "confirmed" && String(new Date().getDate()) === todayAppointmentDate) {
            confirmedCount++;
          }
          if (event?.status === "scheduled" && String(new Date().getDate()) === todayAppointmentDate) {
            scheduledCount++;
          }
          if (event?.status === "checked-in" && String(new Date().getDate()) === todayAppointmentDate) {
            checkInCount++;
          }
          if (event?.status === "checked-out" && String(new Date().getDate()) === todayAppointmentDate) {
            checkOutCount++;
          }
        });
      }
      newConfirmed[key] = confirmedCount;
      newScheduled[key] = scheduledCount;
      newCheckedIn[key] = checkInCount;
      newCheckedOut[key] = checkOutCount;
    }
  }, [doctorEvents]);
  const [openAppointmentPopUp, setOpenAppointmentPopUp] = useState(false);
  const [openAppointmentId, setOpenAppointmentId] = useState("");

  const handleOpenAppointmentModal = (doctorId) => {
    setOpenAppointmentId(doctorId);
    setOpenAppointmentPopUp(!openAppointmentPopUp);
  };
  const [arrowNavTab, setArrowNavTab] = useState("1");
  const [activeTab, setActiveTab] = useState(1);

  const arrowNavToggle = (tab) => {
    if (arrowNavTab !== tab) {
      setArrowNavTab(tab);
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteEvent} onCloseClick={() => setDeleteModal(false)} />
      <div className="page-content">
        <Container fluid>
          {/* <BreadCrumb title="Calendar" pageTitle="Apps" /> */}
          <div className="d-flex flex-wrap gap-2 justify-content-end px-2">
            {userProfile?.type === "team" && (
              <div className="live-preview">
                <div>
                  <Button
                    onClick={() => {
                      setType(type === "team" ? "doctor" : "team");
                    }}
                    className="px-4 py-2"
                    color="danger"
                  >
                    Switch
                  </Button>
                </div>
              </div>
            )}
            <div className="live-preview">
              <div>
                <Link to="/pages-team">
                  <Button className="px-4 py-2" color="danger">
                    Users
                  </Button>
                </Link>
              </div>
            </div>

            <div className="live-preview">
              <div>
                <Button onClick={() => tog_team()} className="px-4 py-2" color="warning">
                  Team{" "}
                </Button>
              </div>
            </div>

            <div className="d-none code-view">
              <pre className="language-markup" style={{ height: "275px" }}>
                <code>
                  <TeamModal />
                </code>
              </pre>
            </div>

            <div className="live-preview">
              <div>
                <Button color="danger" onClick={() => tog_establishment()}>
                  Establishment
                </Button>
              </div>
            </div>

            <div className="d-none code-view">
              <pre className="language-markup" style={{ height: "275px" }}></pre>
            </div>
          </div>
          <Row>
            <Col xs={12}>
              <Row>
                <div id="external-events">
                  <br />
                </div>

                <Col xl={12}>
                  <Card className="">
                    <CardBody>
                      <div className={doctorsToShow.length > 2 ? "scroll-container" : ""}>
                        {users?.length !== 0 &&
                          users
                            .filter((doctor) => selectedDoctors.includes(doctor._id))
                            .map((doctor) => {
                              return (
                                <div className={doctorsToShow.length > 2 ? "scroll-item" : "w-auto"} key={doctor._id}>
                                  <div className="d-flex align-items-center justify-content-between doc-heading-back doctor-box-container">
                                    <i
                                      onClick={() => {
                                        handleOpenAppointmentModal(doctor._id);
                                        setDoctor(doctor);
                                      }}
                                      className="las la-stopwatch"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                    <h3
                                      onClick={() => {
                                        fetchEvents(doctor._id);
                                      }}
                                      className="text-center text-white"
                                      style={{ fontSize: "18px" }}
                                    >{`${doctor.prefix || ""} ${doctor.displayName}`}</h3>
                                  </div>

                                  <FullCalendar
                                    id={doctor._id}
                                    plugins={[
                                      BootstrapTheme,
                                      dayGridPlugin,
                                      timeGridPlugin,
                                      interactionPlugin,
                                      listPlugin,
                                    ]}
                                    slotMinTime="09:00:00" // Start time
                                    slotMaxTime={`${calendarTimings.endTime}:59:59`} // End time
                                    height={window.innerHeight}
                                    initialView="timeGridDay"
                                    slotDuration="00:15:00"
                                    slotLabelInterval="00:60:00"
                                    themeSystem="bootstrap"
                                    headerToolbar={{
                                      left: "prev,next",
                                      center: "title",
                                      right: "",
                                    }}
                                    eventContent={(eventInfo) => {
                                      const eventBackgroundColor = getStatusColor(eventInfo.event.extendedProps.status);

                                      return {
                                        // You can add more styles based on your needs
                                        html: `<div className="container-calendar" style="height: inherit">
      <div style="background-color: ${eventBackgroundColor}; height: inherit;  position: relative;  width: 6px; ">
      <div style="width:310px;">${eventInfo.event.title}</div>
    </div>
                                      
                                      `,
                                      };
                                    }}
                                    events={doctorEvents[doctor._id]?.map((event) => {
                                      const eventTitle = `<div><b>${event?.patient?.displayName}</b>&nbsp;&nbsp;&nbsp;&nbsp;Psy Id: ${event?.patient?.psyID}</div> `;
                                      const payload = {
                                        ...event,
                                        start: moment(event?.startTime).toISOString(),
                                        end: moment(event?.endTime).toISOString(),
                                        allDay: false,
                                        title: eventTitle,
                                        duration: event?.duration,
                                      };
                                      return payload;
                                    })}
                                    editable={true}
                                    expandRows={true}
                                    droppable={true}
                                    selectable={true}
                                    data-doctor-id={doctor._id}
                                    eventDrop={handleEventDrop}
                                    eventResize={handleEventResize}
                                    eventClick={handleEventClick}
                                    dateClick={(arg) => {
                                      handleDateClick(arg, doctor);
                                      // updateConfirmedEventsCount(arg.date);
                                    }}
                                    drop={(e) => {
                                      onDrop(e, doctor._id);
                                    }}
                                  />
                                </div>
                              );
                            })}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <div style={{ clear: "both" }}></div>

              <Modal isOpen={modal} id="event-modal" centered>
                <ModalHeader toggle={toggle} tag="h5" className="p-3 bg-soft-info modal-title text-center">
                  {!!isEdit ? (
                    <Link to={`/pages-profile?id=${event?.props?.patient?._id}`}>
                      {event?.props?.patient?.displayName}
                    </Link>
                  ) : (
                    "Book Apointment"
                  )}
                </ModalHeader>
                <ModalBody>
                  <Form
                    className={!!isEdit ? "needs-validation view-event" : "needs-validation"}
                    name="event-form"
                    id="form-event"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="event-details">
                      <div className="d-flex mb-4">
                        <div
                          className="flex-grow-1 align-items-center"
                          style={{
                            display: "grid",
                            gridTemplate: "auto/1fr 1fr",
                          }}
                        >
                          <div className="flex-shrink-0 me-3">
                            <h6 style={{ fontSize: "16px" }} className="mb-0">
                              <b>Date & Time</b>
                            </h6>
                          </div>
                          <div className="flex-grow-1">
                            <h6
                              style={{ fontSize: "16px", fontWeight: "normal" }}
                              className="d-block mb-0"
                              id="event-start-date-tag"
                            >
                              {event ? `${event?.props?.appointmentDate} ${event?.props?.slot.split(" - ")[0]}` : ""}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div
                        className=" align-items-center mb-4"
                        style={{
                          display: "grid",
                          gridTemplate: "auto/1fr 1fr",
                        }}
                      >
                        <div className="flex-shrink-0 me-3">
                          <h6 style={{ fontSize: "16px" }} className="mb-0">
                            <b>Establishment</b>
                          </h6>
                        </div>
                        <div className="flex-grow-1">
                          <h6 style={{ fontSize: "16px", fontWeight: "normal" }} className="d-block mb-0">
                            <span id="event-location-tag">
                              {(event && event?.props?.establishment.displayName) || "No Location"}
                            </span>
                          </h6>
                        </div>
                      </div>

                      <div
                        className="align-items-center mb-4"
                        style={{
                          display: "grid",
                          gridTemplate: "auto/1fr 1fr",
                        }}
                      >
                        <div className="flex-shrink-0 me-3">
                          <h6 style={{ fontSize: "16px" }} className="mb-0">
                            <b>Status</b>
                          </h6>
                        </div>
                        <div className="flex-grow-1">
                          <h6 style={{ fontSize: "16px", fontWeight: "normal" }} className="d-block mb-0">
                            <span id="event-location-tag" style={{ textTransform: "capitalize" }}>
                              {event?.props?.status}
                            </span>
                          </h6>
                        </div>
                      </div>
                      <div
                        className="align-items-center mb-4"
                        style={{
                          display: "grid",
                          gridTemplate: "auto/1fr 1fr",
                        }}
                      >
                        <div className="flex-shrink-0 me-3">
                          <h6 style={{ fontSize: "16px" }} className="mb-0">
                            <b>Consultant</b>
                          </h6>
                        </div>
                        <div className="flex-grow-1">
                          <h6 style={{ fontSize: "16px", fontWeight: "normal" }} className="d-block mb-0">
                            <span id="event-location-tag">{event?.props?.doctor.displayName}</span>
                          </h6>
                        </div>
                      </div>
                    </div>
                    <Row className="event-form">
                      <Col xs={12}>
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                          <Label className="form-label mb-0">Patient</Label>
                          <AsyncSelect
                            className="mb-0 col-10 calendar-patient-container"
                            value={{
                              value: selectedOption,
                              label: selectedOption?.displayName || "Type to search by name and phone number",
                            }}
                            placeholder="Search For Patients"
                            onChange={(e) => {
                              e && setSelectedOption(e?.value);
                            }}
                            loadOptions={async (inputValue) => {
                              try {
                                const response1Promise = axios.get(
                                  config.api.API_URL + `/users?search=${inputValue}&searchBy=displayName`,
                                );

                                const response2Promise = axios.get(
                                  config.api.API_URL + `/users?search=${inputValue}&searchBy=phone`,
                                );

                                const [response1, response2] = await Promise.all([response1Promise, response2Promise]);

                                let groupedOptions = [];

                                if (response1.data && response1.data.length > 0) {
                                  const options1 = response1.data.map((item) => ({
                                    label: `${item?.displayName || (item?.source || "") + " lead"} - ${item?.phone}`,
                                    value: item,
                                  }));
                                  groupedOptions.push({
                                    options: options1,
                                  });
                                }

                                if (response2.data && response2.data.length > 0) {
                                  const options2 = response2.data.map((item) => ({
                                    label: `${item?.displayName || (item?.source || "") + " lead"} - ${item?.phone}`,
                                    value: item,
                                  }));
                                  groupedOptions.push({
                                    options: options2,
                                  });
                                }

                                return groupedOptions;
                              } catch (error) {
                                console.error("Error loading options:", error);
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

                      <Col xs={12}>
                        <div className="mb-3 d-flex justify-content-between">
                          <Label className="form-label mb-0">Establishments</Label>
                          <AsyncSelect
                            className="mb-3 col-10 calendar-patient-container"
                            value={{
                              value: establishment,
                              label: establishment?.establishmentName || "Type to search",
                            }}
                            placeholder="Search For Establishment"
                            onChange={(e) => {
                              setEstablishment(e.value);
                            }}
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
                                console.error("Error loading options:", error);
                                return [];
                              }
                            }}
                            isClearable
                            isSearchable
                          />
                        </div>
                      </Col>

                      <Col xs={12}>
                        <div className="mb-3 d-flex justify-content-between">
                          <Label className="form-label">Practitioners</Label>

                          <select
                            className="form-select mb-3 calendar-patient-container"
                            value={selectedUser ? selectedUser?.displayName : ""}
                            onChange={(e) => setSelectedUser(e.target.value)}
                          >
                            <option value="" disabled hidden>
                              Search For Doctors
                            </option>
                            {filteredUsers.map((item) => (
                              <option key={item.displayName} value={item.displayName}>
                                {item.prefix} {item.displayName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col xs={12}>
                        <div className="mb-3 d-flex justify-content-between">
                          <Label className="form-label mb-0 ">Date</Label>
                          <div className="col-6 calendar-patient-container">
                            <Flatpickr
                              className="form-control"
                              options={{
                                mode: "multiple",
                                dateFormat: "Y-m-d",
                                // defaultDate: ["2022-01-20"],
                                minDate: "today", // Set the minimum date to today,
                                conjunction: " , ",
                              }}
                              onChange={(e) => {
                                setSelectedDate({ ...selectedDate, date: e });
                              }}
                              value={selectedDate.date}
                            />
                          </div>
                        </div>
                      </Col>
                      {selectedDate.date?.map((date, index) => (
                        <Col key={date} xs={12}>
                          <div className="mb-3 d-flex justify-content-between">
                            <Label className="form-label mb-0">Time</Label>

                            <div className="col-4">
                              <Flatpickr
                                className="form-control"
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "H:i",
                                }}
                                onChange={(e) => {
                                  const startTime = new Date(e[0]);
                                  if (!selectedDate.duration[index]) {
                                    selectedDate.duration[index] = 15;
                                  }
                                  const endTime = new Date(startTime.getTime() + selectedDate.duration[index] * 60000);
                                  setSelectedDate((prevState) => {
                                    const updatedDates = [...prevState.date];
                                    const updatedStartTimes = [...prevState.start];
                                    const updatedEndTimes = [...prevState.end];

                                    updatedDates[index] = date; // You might want to update the date as well
                                    updatedStartTimes[index] = startTime;
                                    updatedEndTimes[index] = endTime;

                                    return {
                                      ...prevState,
                                      date: updatedDates,
                                      start: updatedStartTimes,
                                      end: updatedEndTimes,
                                    };
                                  });
                                }}
                                value={selectedDate.start[index]}
                              />
                            </div>

                            <div className="col-2">
                              <Input
                                type="text"
                                className="form-control"
                                value={selectedDate.duration[index]}
                                onChange={(e) => {
                                  const newDuration = parseInt(e.target.value, 10) || 0;
                                  const startTime = new Date(selectedDate.start[index]);
                                  const endTime = new Date(startTime.getTime() + newDuration * 60000);

                                  setSelectedDate((prevState) => {
                                    const updatedDurations = [...prevState.duration];
                                    const updatedEndTimes = [...prevState.end];

                                    updatedDurations[index] = newDuration;
                                    updatedEndTimes[index] = endTime;
                                    console.log({
                                      ...prevState,
                                      duration: updatedDurations,
                                      end: updatedEndTimes,
                                    });

                                    return {
                                      ...prevState,
                                      duration: updatedDurations,
                                      end: updatedEndTimes,
                                    };
                                  });
                                }}
                              />
                            </div>

                            <div className="col-4">
                              <Flatpickr
                                className="form-control"
                                disabled={true}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "H:i",
                                }}
                                onChange={(e) => {
                                  const endTime = new Date(e[0]);
                                  setSelectedDate((prevState) => {
                                    const updatedEndTimes = [...prevState.end];
                                    updatedEndTimes[index] = endTime;

                                    return {
                                      ...prevState,
                                      end: updatedEndTimes,
                                    };
                                  });
                                }}
                                value={selectedDate.end[index]}
                              />
                            </div>
                          </div>
                        </Col>
                      ))}

                      <Col xs={12}></Col>

                      <Col xs={12}>
                        <div className="form-check mb-2">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            id="formCheck1"
                            value={paymentPaid}
                            onClick={() => handlePaymentPaid()}
                          />
                          {paymentPaid && handleDynamicDoctorId()}
                          <Label className="form-check-label" htmlFor="formCheck1">
                            Payment Paid
                          </Label>
                        </div>
                      </Col>

                      <Col xs={12}>
                        <div className="mb-3">
                          <Label className="form-label">Comments</Label>
                          <textarea
                            className={!!isEdit ? "form-control d-none" : "form-control d-block"}
                            id="event-comments"
                            name="comments"
                            placeholder="Enter a comments"
                            rows="3"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.comments}
                          ></textarea>
                          {validation.touched.comments && validation.errors.comments ? (
                            <FormFeedback type="invalid">{validation.errors.comments}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="hstack gap-2 justify-content-end">
                      {event?.props?.bookingId && (
                        <Link to={`/apps-invoices-details?id=${event?.props?.bookingId}`}>
                          <button type="button" className="btn btn-soft-danger">
                            <i className="las la-rupee-sign"></i>Invoice
                          </button>
                        </Link>
                      )}
                      {!!isEdit && event?.props?.status !== "cancelled" && (
                        <button
                          type="button"
                          className="btn btn-soft-danger"
                          id="btn-delete-event"
                          onClick={() => setDeleteModal(true)}
                        >
                          <i className="ri-close-line align-bottom"></i> Cancel
                        </button>
                      )}
                      {event?.props?.status === "engaged" && (
                        <button
                          onClick={(e) => {
                            axios
                              .post(config.api?.API_URL + `/booking/appointment/check/out`, {
                                patientCredential: event?.props?.patient?.email,
                                doctorId: event?.props?.doctor?._id,
                              })
                              .then((res) => {
                                toast.success(res?.message);
                                fetchEvents(userProfile._id);
                                toggle();
                              });
                          }}
                          type="button"
                          className="btn btn-soft-success"
                          id="btn-delete-event"
                        >
                          Check Out
                        </button>
                      )}
                      {event?.props?.status === "confirmed" && (
                        <button
                          onClick={(e) => {
                            axios
                              .post(config.api?.API_URL + `/booking/appointment/check/in`, {
                                patientCredential: event?.props?.patient?.email,
                                doctorId: event?.props?.doctor?._id,
                              })
                              .then((res) => {
                                toast.success(res?.message);
                                fetchEvents(userProfile._id);
                                toggle();
                              });
                          }}
                          type="button"
                          className="btn btn-soft-success"
                          id="btn-delete-event"
                        >
                          Check In
                        </button>
                      )}
                        <Link className="text-white btn btn-success" to={`/multiple-appointments`}>
                          Multiple Appointment
                        </Link>
                      {isEditButton && (
                        <button type="submit" className="btn btn-success" id="btn-save-event">
                          {!!isEdit ? (
                            <Link to={`/pages-profile?id=${event?.props?.patient?._id}`}>
                              {event?.props?.patient?.displayName}
                            </Link>
                          ) : (
                            "Book Apointment"
                          )}
                        </button>
                      )}
                    </div>
                  </Form>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </Container>

        <Modal isOpen={openAppointmentPopUp} centered>
          <ModalHeader
            toggle={() => {
              handleOpenAppointmentModal(openAppointmentId);
            }}
            tag="h5"
            className="p-3 bg-soft-info modal-title text-center bg-none"
          >
            <Nav pills className="nav nav-pills arrow-navtabs nav-success">
              <NavItem>
                <NavLink
                  style={{
                    cursor: "pointer",
                    padding: "4px",
                    color: activeTab === 1 ? "#da8872" : "black",
                  }}
                  className={classNames({
                    active: arrowNavTab === "1",
                  })}
                  onClick={() => {
                    arrowNavToggle("1");
                  }}
                >
                  Slots
                </NavLink>
              </NavItem>
            </Nav>
          </ModalHeader>
          <ModalBody>
            <TabContent activeTab={arrowNavTab} className="text-muted">
              <TabPane tabId="1" id="arrow-profile">
                <Col>
                  <ChangeSessions establishmentData={establishmentData} doctor={doctor} />
                </Col>
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>

        <Modal
          id="myModal"
          isOpen={modal_team}
          toggle={() => {
            tog_team();
          }}
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={() => {
              tog_team();
            }}
          >
            Select Practitioners
          </ModalHeader>
          <ModalBody>
            {users?.length !== 0 &&
              users
                .filter((doctor) => {
                  return doctor._id in doctorEvents;
                })
                .map((doctor) => (
                  <Col key={doctor.id}>
                    <div className="d-flex align-items-center gap-2 pb-5">
                      <input
                        type="checkbox"
                        checked={selectedDoctors.includes(doctor._id)}
                        onChange={() => handleCheckboxTeamChange(doctor._id)}
                      />
                      <p className="ml-2 mb-0">{`${doctor.prefix || ""} ${doctor.displayName}`}</p>
                    </div>{" "}
                  </Col>
                ))}
          </ModalBody>
        </Modal>

        <Modal
          id="myModal"
          isOpen={modal_establishment}
          toggle={() => {
            tog_establishment();
          }}
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={() => {
              tog_establishment();
            }}
          >
            Select Establishment
          </ModalHeader>
          <ModalBody>
            {clinicName.map((est, i) => (
              <Col key={i}>
                <div className="d-flex align-items-center gap-2 pb-5">
                  <input type="checkbox" onChange={(e) => handleCheckboxEstChange(est, true, e)} />
                  <p className="ml-2 mb-0">{est}</p>
                </div>{" "}
              </Col>
            ))}
          </ModalBody>
          <div className="modal-footer">
            <Button
              color="light"
              onClick={() => {
                tog_establishment();
              }}
            >
              Close
            </Button>
            <Button color="primary">Save changes</Button>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};

Calender.propTypes = {
  events: PropTypes.any,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
};

export default Calender;
