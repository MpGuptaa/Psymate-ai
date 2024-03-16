import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as moment from "moment";
import axios from "axios";
import grid from "../../assets/icons/menu.png";

// Import Images
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Table,
  FormFeedback,
  Button,
} from "reactstrap";
import Select from "react-select";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import UserVerifyDialog from "../../Components/Common/UserVerifyDialog";
//Import actions
import {
  getContacts as onGetContacts,
  addNewContact as onAddNewContact,
  updateContact as onUpdateContact,
  deleteContact as onDeleteContact,
} from "../../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { getUsers } from "../../store/users/action";
import config from "../../config";
import InfiniteScroll from "react-infinite-scroll-component";
import AddUserPopUp from "../Pages/Team/AddUserPopUp";
import UserProfileForm from "../../Components/Common/UserProfileForm";
import Filter from "../Pages/Team/Filter";
import { createSearchParams } from "../../helpers/Helper";

const XMLParser = require("react-xml-parser");

const CrmContacts = () => {
  const dispatch = useDispatch();
  const { loading } = useProfile();
  const { users, user } = useSelector((state) => ({
    users: state.User.users,
    user: state.Profile.user,
  }));

  const [pageCount, setPageCount] = useState(1);

  const [team, setTeam] = useState(null);
  const [teamList, setTeamlist] = useState([]);
  const [value, setValue] = useState(true);
  const [verifiedModel, setVerifiedModel] = useState(false);
  const [infoid, SetInfoId] = useState("");
  const handelVerifiedModel = (id) => {
    SetInfoId(id);
    setVerifiedModel(true);
  };

  //Modal
  const [type, setType] = useState("patient");

  const [registerPopUp, setRegisterPopUp] = useState(false);
  const [filterValues, setFilterValues] = useState({
    displayName: "",
    email: "",
    phone: "",
    psyID: "",
    type: "",
    status: "",
  });

  const handleAddUser = () => {
    // console.log("User added")
    setRegisterPopUp(true);
  };

  const closeForm = () => {
    setRegisterPopUp(false);
  };

  const searchParamsString = createSearchParams(filterValues);

  useEffect(() => {
    dispatch(getUsers('patient', 1, searchParamsString));
  }, [dispatch, loading, type, filterValues]);

  useEffect(() => {
    setTeam(users);
    setTeamlist(users);
  }, [users]);

  const { crmcontacts, error } = useSelector((state) => ({
    crmcontacts: state.Crm.crmcontacts,
    isContactCreated: state.Crm.isContactCreated,
    isContactSuccess: state.Crm.isContactSuccess,
    error: state.Crm.error,
  }));

  useEffect(() => {
    if (crmcontacts && !crmcontacts.length) {
      dispatch(onGetContacts());
    }
  }, [dispatch, crmcontacts]);

  useEffect(() => {
    setContact(crmcontacts);
  }, [crmcontacts]);

  useEffect(() => {
    if (!isEmpty(crmcontacts)) {
      setContact(crmcontacts);
      setIsEdit(false);
    }
  }, [crmcontacts]);

  const [isEdit, setIsEdit] = useState(false);
  const [contact, setContact] = useState([]);

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setContact(null);
    } else {
      setModal(true);
      setAssignTag([]);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteContact = () => {
    if (contact) {
      dispatch(onDeleteContact(contact._id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (contact) => {
    setContact(contact);
    setDeleteModal(true);
  };

  // Add Data
  const handleContactClicks = () => {
    setContact("");
    setIsEdit(false);
    toggle();
  };

  // Date & Time Format

  const dateFormat = () => {
    var d = new Date(),
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return d.getDate() + " " + months[d.getMonth()] + ", " + d.getFullYear();
  };

  const timeFormat = () => {
    let d = new Date();
    let minutes = d.getMinutes().toString().length === 1 ? "0" + d.getMinutes() : d.getMinutes();
    let hours = d.getHours().toString() % 12 || 12;
    hours = hours <= 9 ? (hours = "0" + hours) : hours;
    let ampm = d.getHours() >= 12 ? "PM" : "AM";
    return hours + ":" + minutes + ampm;
  };

  const inputFields = [
    { type: "text", name: "displayName", label: "Name", placeholder: "Filter By Name..." },
    { type: "text", name: "email", label: "Email", placeholder: "Filter By Email..." },
    { type: "text", name: "phone", label: "Phone Number", placeholder: "Filter By Phone Number..." },
    // { type: 'number', name: 'psyID', label: 'Psymate Id', placeholder: 'Filter By Psymate Id...' },
    {
      type: "radio",
      name: "type",
      label: "User Type",
      options: [
        { label: "Patient", value: "patient" },
        { label: "Doctor", value: "doctor" },
        { label: "Team", value: "team" },
      ],
    },
    {
      type: "radio",
      name: "status",
      label: "Status",
      options: [
        { label: "Verified", value: "verified" },
        { label: "Un-Verified", value: "unverified" },
        { label: "Pending", value: "pending" },
      ],
    },
  ];

  const handleFilterChange = (newFilterValues) => {
    setFilterValues(newFilterValues);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // contactId: (contact && contact.contactId) || '',
      // img: (contact && contact.img) || '',
      name: (contact && contact.displayName) || "",
      company: (contact && contact.company) || "",
      designation: (contact && contact.designation) || "",
      email: (contact && contact.email) || "",
      phone: (contact && contact.phone) || "",
      lead_score: (contact && contact.lead_score) || "",
      tags: (contact && contact.tags) || [],
    },
    validationSchema: Yup.object({
      // contactId: Yup.string().required("Please Enter Contact Id"),
      name: Yup.string().required("Please Enter Name"),
      company: Yup.string().required("Please Enter Company"),
      designation: Yup.string().required("Please Enter Designation"),
      email: Yup.string().required("Please Enter Email"),
      phone: Yup.string().required("Please Enter Phone"),
      lead_score: Yup.string().required("Please Enter lead_score"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateContact = {
          _id: contact ? contact._id : 0,
          // contactId: values.contactId,
          // img: values.img,
          name: values.name,
          company: values.company,
          designation: values.designation,
          email: values.email,
          phone: values.phone,
          lead_score: values.lead_score,
          last_contacted: dateFormat(),
          // time: timeFormat(),
          tags: assignTag,
        };
        // update Contact
        dispatch(onUpdateContact(updateContact));
        validation.resetForm();
        // setTag([]);
        // setAssignTag([]);
      } else {
        const newContact = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          // contactId: values["contactId"],
          // img: values["img"],
          name: values["name"],
          company: values["company"],
          designation: values["designation"],
          email: values["email"],
          phone: values["phone"],
          lead_score: values["lead_score"],
          last_contacted: dateFormat(),
          // time: timeFormat(),
          tags: assignTag,
        };
        // save new Contact
        dispatch(onAddNewContact(newContact));
        validation.resetForm();
        // setTag([]);
        // setAssignTag([]);
      }
      toggle();
    },
  });

  // Update Data
  const handleContactClick = useCallback(
    (arg) => {
      const contact = arg;

      setContact({
        _id: contact._id,
        contactId: contact.contactId,
        // img: contact.img,
        name: contact.name,
        company: contact.company,
        // email: contact.email,
        designation: contact.designation,
        phone: contact.phone,
        lead_score: contact.lead_score,
        last_contacted: contact.createdAt,
        // time: contact.time,
        tags: contact.tags,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle],
  );

  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    axios.get(config.api.API_URL + `/users?page=${pageCount}&limit=20`).then((res) => {
      if (res.length === 0) {
        // console.log("res.length : ", res.length);
        setHasMore(false); // No more data available
      } else {
        setPageCount(pageCount + 1);
        setTeamlist((prevTeamList) => [...prevTeamList, ...res.data]);
        // console.log("teamlist : ", teamList);
      }
      setTeam((prevTeamList) => [...prevTeamList, ...res.data]);
      // console.log("Teams : ", team);
    });
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  const loadExotelDetails = async () => {
    await axios.get(config.api.API_URL + `/call/callDetails`).then((res) => {
      const xmlResponse = new XMLParser().parseFromString(res.data);
      const list = xmlResponse.children.slice(1);

      const updatedList = list.map((item) => {
        const toNumber = item.children[5].value;
        const fromNumber = item.children[6].value;
        const direction = item.children[14].value;
        const status = item.children[9].value;
        const time = item.children[12].value;
        // console.log("time : ", time);
        return { toNumber, fromNumber, direction, status, time };
      });
      setExotelList(updatedList);
    });
  };

  // useEffect(() => {
  //   loadExotelDetails();
  // });
  const data = [
    { label: "Name", name: "displayName", type: "text" },
    { label: "Email ID", name: "email", type: "text" },
    { label: "Last Contacted", name: "createdAt", type: "date" },
    { label: "Date Of Birth", name: "dateOfBirth", type: "text" },
    { label: "Type", name: "type", type: "text" },
    { label: "Gender", name: "gender", type: "text" },
    { label: "Phone No.", name: "phone", type: "text" },
    { label: "Age", name: "age", type: "text" },
    { label: "Balance", name: "balance", type: "text" },
    { label: "PsyID", name: "psyID", type: "text" },
    { label: "UserId", name: "userId", type: "text" },
    { label: "Password", name: "password", type: "text" },
    { label: "Designation", name: "designation", type: "text" },
    { label: "Price", name: "price", type: "text" },
    { label: "Qualifications", name: "qualifications", type: "text" },
    { label: "Years Of Experience", name: "yearsOfExperience", type: "text" },
    { label: "Meet Link", name: "meetLink", type: "link" },
    { label: "Facebook", name: "facebook", type: "text" },
    { label: "Instagram", name: "instagram", type: "text" },
    { label: "Twitter", name: "twitter", type: "text" },
    {
      label: "Addresses",
      name: "addresses",
      type: "array",
      fields: ["phone", "city", "state", "pincode", "country", "email"],
    },
    {
      label: "WorkExperience",
      name: "workExperience",
      type: "array",
      fields: ["jobtitle", "organization", "location", "employmentperiod", "skills"],
    },
    { label: "Certificates", name: "certificates", type: "array", fields: ["title", "date", "description", "skills"] },
    { label: "Achievements", name: "achievements", type: "array", fields: ["title", "date", "description"] },
    {
      label: "Education",
      name: "education",
      type: "array",
      fields: ["institue", "course", "start_date", "field_of_study", "end_date", "grad"],
    },
    { label: "Status", name: "status", type: "status" },
  ];
  const handleValidTime = (time) => {
    const time1 = new Date(time);
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
      meridiem = "PM";
    } else {
      meridiem = "AM";
    }
    const updateTime = moment(getTime, "hh:mm").format("hh:mm") + " " + meridiem;
    return updateTime;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".contactCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [exotelList, setExotelList] = useState([]);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteContact(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".contactCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const getInitials = (name) => {
    if (name) {
      const nameParts = name?.split(" ");
      return nameParts.map((part) => part[0]).join("");
    } else {
      return "";
    }
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="contactCheckBox form-check-input"
              value={cellProps.row.original._id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
        Cell: (contact) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {
                  contact.row.original?.image_src ? (
                    <img
                      src={process.env.REACT_APP_API_URL + "/images/users/" + contact.row.original.image_src}
                      alt=""
                      className="avatar-xs rounded-circle"
                    />
                  ) : (
                    <div className="flex-shrink-0 avatar-xs me-2">
                      <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                        {getInitials(contact.row.original.displayName)}
                      </div>
                    </div>
                  )
                  // <img src={dummyImg} alt="" className="avatar-xxs rounded-circle" />
                }
              </div>
              <div className="flex-grow-1 ms-2 name">
                <Link to={`/pages-profile?id=${contact.row.original?._id}`} style={{ color: "#000" }}>
                  {contact.row.original.displayName}
                </Link>
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Psymate Id",
        accessor: "company",
        filterable: false,
        Cell: (contact) => <p>{contact.row.original.psyID}</p>,
      },
      {
        Header: "Email ID",
        accessor: "email",
        filterable: false,
      },
      {
        Header: "Phone No",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Source",
        accessor: "lead_score",
        filterable: false,
      },
      // {
      //   Header: "Tags",
      //   Cell: (contact) => (
      //     <>
      //       {contact.row.original.tags.map((item, name) => (
      //         <span className="badge badge-soft-primary me-1" name={name}>
      //           {item}
      //         </span>
      //       ))}
      //     </>
      //   ),
      // },
      {
        Header: "Last Contacted",
        Cell: (contact) => (
          <>
            {handleValidDate(contact.row.original.createdAt)},{" "}
            <small className="text-muted">{handleValidTime(contact.row.original.createdAt)}</small>
          </>
        ),
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link to="#" className="text-danger d-inline-block">
                  <i onClick={() => onClickCall(cellProps.row.original?.phone)} className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Message">
                <Link
                  to={`/apps-chat/${cellProps.row.original._id}`}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   console.log("info----> ", cellProps.row.original);
                  // }}
                  on
                  className=" d-inline-block text-success"
                >
                  <i className="lab la-whatsapp fs-16"></i>{" "}
                </Link>
              </li>
              <li className="list-inline-item">
                <UncontrolledDropdown>
                  <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm dropdown" tag="button">
                    <i className="ri-more-fill align-middle"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      className="dropdown-item"
                      // href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;
                        setInfo(contactData);
                        console.log("info=> ", info);
                        setIsDropdownClicked(true);
                      }}
                    >
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
                    </DropdownItem>
                    {/* <DropdownItem
                      className="dropdown-item edit-item-btn"
                      href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;
                        handleContactClick(contactData);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                      Edit
                    </DropdownItem> */}
                    <DropdownItem
                      className="dropdown-item remove-item-btn"
                      href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;
                        onClickDelete(contactData);
                      }}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleContactClick, checkedAll],
  );

  const [tag, setTag] = useState([]);
  const [assignTag, setAssignTag] = useState([]);

  const tags = [
    { label: "Exiting", value: "Exiting" },
    { label: "Lead", value: "Lead" },
    { label: "Long-term", value: "Long-term" },
    { label: "Partner", value: "Partner" },
  ];

  // SideBar Contact Deatail
  const [info, setInfo] = useState([]);
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Contacts | Psymate - Management Portal";

  const [currentDate, setCurrentDate] = useState("");
  const onClickCall = async (toNum) => {
    setCurrentDate(new Date());
    await axios
      .post(config.api.API_URL + `/call/users`, {
        from: "0" + user.phone,
        to: `0` + toNum,
      })
      .then((success) => {
        console.log("success", success);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal show={isExportCSV} onCloseClick={() => setIsExportCSV(false)} data={crmcontacts} />
        <UserVerifyDialog
          show={verifiedModel}
          onCloseClick={() => {
            dispatch(getUsers(type, 1, `search=${type}&searchBy=type`));
            setVerifiedModel(false);
          }}
          data={infoid}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteContact}
          onCloseClick={() => setDeleteModal(false)}
        />

        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Contacts" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2 justify-content-end">
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        <div className="flex-grow-1">
                          <Link to={"/pages-team"}>
                            <button className="btn btn-info add-btn">
                              <img style={{ width: "20px" }} src={grid} />
                            </button>
                          </Link>
                        </div>
                        <Button
                          color="success users-btn"
                          // onClick={() => handleAdd()}
                          onClick={handleAddUser}
                        >
                          <i className="ri-add-fill me-1 align-bottom"></i>
                          Add Users
                        </Button>

                        <Filter
                          inputFields={inputFields}
                          filterValues={filterValues}
                          onFilterChange={handleFilterChange}
                        />
                        {registerPopUp && <UserProfileForm closeForm={closeForm} type={type} />}

                        {registerPopUp && <UserProfileForm closeForm={closeForm} type={type} />}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col xxl={isDropdownClicked ? 9 : 12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {users.length ? (
                      <TableContainer
                        columns={columns}
                        data={users || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        totalPages={users.length}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        handleContactClick={handleContactClicks}
                        isContactsFilter={true}
                        SearchPlaceholder="Search for contact..."
                        onChangeFunction={(page) => {
                          dispatch(getUsers(type, page, `search=${type}&searchBy=type`));
                        }}
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>

                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>

            {isDropdownClicked && (
              <Col xxl={3} style={{ overflowY: "scroll", maxHeight: "110vh" }}>
                <Card id="contact-view-detail">
                  <CardBody className="text-center">
                    <div className="position-relative d-inline-block">
                      {info.image_src ? (
                        <img
                          src={process.env.REACT_APP_API_URL + "/images/users/" + info.image_src}
                          alt=""
                          className="avatar-lg rounded-circle img-thumbnail"
                        />
                      ) : (
                        <h2>{getInitials(info?.displayName)}</h2>
                      )}
                      <span className="contact-active position-absolute rounded-circle bg-success">
                        <span className="visually-hidden"></span>
                      </span>
                    </div>
                    <Link to={`/pages-profile?id=${info?._id}`}>
                      <h5 className="mt-4 mb-1">{info.displayName}</h5>
                    </Link>
                    {/* <p className="text-muted">
                    {info.company || "Nesta Technologies"}
                  </p> */}

                    <ul className="list-inline mb-0">
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to={`tel:${info?.phone}`}
                          className="avatar-title bg-soft-danger text-danger fs-15 rounded
                          "
                        >
                          <i className="ri-phone-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to={`mailto:${info?.email}`}
                          target="_blank"
                          className="avatar-title bg-soft-warning text-warning fs-15 rounded"
                        >
                          <i className="ri-mail-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to={`https://wa.me/91${info?.phone}`}
                          target="_blank"
                          className="avatar-title bg-soft-success text-success fs-15 rounded"
                        >
                          <i className="lab la-whatsapp"></i>
                        </Link>
                      </li>
                    </ul>
                  </CardBody>
                  <CardBody>
                    <h6 className="text-muted text-uppercase fw-semibold mb-3">Personal Information</h6>

                    <div className="table-responsive table-card">
                      {value ? (
                        <Table className="table table-borderless mb-0">
                          <tbody>
                            <tr>
                              <td className="fw-medium">Email ID</td>
                              <td>{info.email || "tonyanoble@Psymate.com"}</td>
                            </tr>
                            <tr>
                              <td className="fw-medium">Phone No</td>
                              <td>{info.phone}</td>
                            </tr>
                            {/* \{" "} */}
                            <tr>
                              <td className="fw-medium">Last Contacted</td>
                              <td>
                                {new Date(info.createdAt).toDateString()}
                                <small className="text-muted"></small>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      ) : (
                        ""
                      )}

                      {value ? null : (
                        <Table className="table table-borderless mb-0">
                          <tbody>
                            {/* {data?.map(
                              (item, index) =>
                                info[item.name] && (
                                  <React.Fragment key={index}>
                                    {item.type === "array" ? (
                                      <tr>
                                        <td colSpan="2">
                                          <div className="slider-container">
                                            <p>{item.label}</p>
                                            {info[item.name]?.map((e, i) => (
                                              <div key={i} style={{ border: "1px solid #DA8872", padding: "10px" }}>
                                                {item.fields.map((field, j) => (
                                                  <div key={j}>
                                                    <p style={{ fontWeight: "bold", marginBottom: "0px" }}>
                                                      {field.charAt(0).toUpperCase() + field.slice(1)}
                                                    </p>
                                                    <p>{e[field]}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}
                                          </div>
                                        </td>
                                      </tr>
                                    ) : (
                                      <tr key={index}>
                                        <td className="fw-medium">{item.label}</td>
                                        <td>
                                          {item.type === "link" ? (
                                            <a href={info[item.name]} target="_blank" rel="noopener noreferrer">
                                              {info[item.name]}
                                            </a>
                                          ) : item.renderFunction ? (
                                            item.renderFunction(info[item.name])
                                          ) : item.type === "date" ? (
                                            new Date(info[item.key]).toDateString()
                                          ) : item.type === "text" ? (
                                            info[item.name]
                                          ) : (
                                            item.type === "status" && (
                                              <button
                                                className="btn btn-secondary w-sm me-1"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handelVerifiedModel(info._id)}
                                              >
                                                {info[item.name]?.charAt(0).toUpperCase() + info[item.name]?.slice(1)}
                                              </button>
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ),
                            )} */}
                            {data?.map(
                              (item, index) =>
                                info[item.name] && (
                                  <React.Fragment key={index}>
                                    {item.type === "array" ? (
                                      <tr>
                                        <td colSpan="2">
                                          { item.fields.length>0
                                            && 
                                            <div className="slider-container">
                                            <p className="fw-bold">{item.label}</p>
                                            {info[item.name]?.map((e, i) => (
                                              <div key={i} className="mb-3">
                                                {item.fields.map((field, j) => (
                                                  <div key={j} className="mb-2">
                                                    <p className="fw-bold mb-1">
                                                      {field.charAt(0).toUpperCase() + field.slice(1)}
                                                    </p>
                                                    <p>{e[field]}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            ))}
                                          </div>
                                          }
                                        </td>
                                      </tr>
                                    ) : (
                                      <tr key={index}>
                                        <td className="fw-bold">{item.label}</td>
                                        <td>
                                          {item.type === "link" ? (
                                            <a href={info[item.name]} target="_blank" rel="noopener noreferrer">
                                              {info[item.name]}
                                            </a>
                                          ) : item.renderFunction ? (
                                            item.renderFunction(info[item.name])
                                          ) : item.type === "date" ? (
                                            new Date(info[item.key]).toDateString()
                                          ) : item.type === "status" ? (
                                            info[item.name] === "unverified" ? (
                                              <button
                                                className="btn btn-secondary w-sm me-1"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handelVerifiedModel(info._id)}
                                              >
                                                {info[item.name]?.charAt(0).toUpperCase() + info[item.name]?.slice(1)}
                                              </button>
                                            ) : (
                                              <button className="btn btn-success w-sm" style={{ cursor: "pointer" }}>
                                                {info[item.name]?.charAt(0).toUpperCase() + info[item.name]?.slice(1)}
                                              </button>
                                            )
                                          ) : (
                                            info[item.name]
                                          )}
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ),
                            )}
                          </tbody>
                        </Table>
                      )}

                      <Button
                        style={{ margin: "15px", marginBottom: "20px", cursor: "pointer" }}
                        // className="mb-3 w-sm me-1 text-primary"
                        color="primary"
                        onClick={() => setValue(!value)}
                      >
                        {value ? "More Info" : "Close"}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CrmContacts;
