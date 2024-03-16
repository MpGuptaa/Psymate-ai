import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { getTaskList } from "../../../store/actions";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as moment from "moment";
import avatar10 from "../../../assets/images/users/avatar-10.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";

import Loader from "../../../Components/Common/Loader";
const handleValidDate = date => {
  const date1 = moment(new Date(date)).format("DD MMM Y");
  return date1;
};

const TimeTracking = ({ taskId }) => {

  const dispatch = useDispatch();
  const itemId = "";
  
  const { taskList, assigneeDetails, reporter } = useSelector((state) => ({
    taskList: state.Tasks.taskList._doc,
    assigneeDetails: state.Tasks.taskList.assigneeDetails,
    reporter: state.Tasks.taskList.reporter
  }));

  useEffect(() => {
    dispatch(getTaskList(itemId, taskId));
  }, [dispatch, itemId, taskId]);
  
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  function calculateTimeRemaining() {
    const now = new Date();
    const deadlineDate = new Date(taskList && taskList.endDate);
    const difference = deadlineDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [taskList && taskList.endDate]);

  const { days, hours, minutes, seconds } = timeRemaining;
  return (
    taskList && reporter ? <React.Fragment>
      <Card>
        <CardBody className="text-center">
          <h6 className="card-title mb-3 flex-grow-1 text-start">
            Time Tracking
          </h6>
          <div className="mb-2">
            <lord-icon
              src="https://cdn.lordicon.com/kbtmbyzy.json"
              trigger="loop"
              colors="primary:#405189,secondary:#02a8b5"
              style={{ width: "90px", height: "90px" }}
            ></lord-icon>
          </div>
          {taskList && taskList.endDate ? (
            <h4 className="mb-1">
              {days} days {hours} hrs {minutes} min {seconds} sec
            </h4>
          ) : (
            <h3 className="mb-1">No Deadline Set</h3>
          )}

          <h5 className="fs-14 mb-4">Remaining</h5>
          
        </CardBody>
      </Card>
      <Card className="mb-3">
        <CardBody>
          <div className="table-card">
            <table className="table mb-0">
              <tbody>
                <tr>
                  <td className="fw-medium">Tasks No</td>
                  <td>{taskList.ticketNumber}</td>
                </tr>
                <tr>
                  <td className="fw-medium">Tasks Title</td>
                  <td>{taskList.title}</td>
                </tr>
                <tr>
                  <td className="fw-medium">Priority</td>
                  <td>
                    <span className="badge badge-soft-danger">{taskList.priority}</span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">Status</td>
                  <td>
                    <span className="badge badge-soft-secondary">
                      {taskList.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">Due Date</td>
                  <td>{handleValidDate(taskList.endDate)}</td>
                </tr>
                <tr>
                  <td className="fw-medium">Created At</td>
                  <td>{handleValidDate(taskList.createdAt)}</td>
                </tr>
                <tr>
                  <td className="fw-medium">Reporter</td>
                  <td>{reporter.displayName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex mb-3">
            <h6 className="card-title mb-0 flex-grow-1">Assigned To</h6>
            {/* <div className="flex-shrink-0">
            <button
              type="button"
              className="btn btn-soft-danger btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#inviteMembersModal"
            >
              <i className="ri-share-line me-1 align-bottom"></i> Assigned
              Member
            </button>
          </div> */}
          </div>
          <ul className="list-unstyled vstack gap-3 mb-0">
            {assigneeDetails.map((user) => (
              <li key={user.id}>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <img
                      src={user.avatar} // Assuming each user object has an 'avatar' property
                      alt=""
                      className="avatar-xs rounded-circle"
                    />
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-1 fs-15">
                      <Link to={`/pages-profile?id=${user._id}`}>{user.displayName}</Link>
                    </h6>
                    <p className="text-muted mb-0">{user.type}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* <Card>
      <CardBody>
        <h5 className="card-title mb-3">Attachments</h5>
        <div className="vstack gap-2">
          <div className="border rounded border-dashed p-2">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm">
                  <div className="avatar-title bg-light text-secondary rounded fs-24">
                    <i className="ri-folder-zip-line"></i>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <h5 className="fs-15 mb-1">
                  <Link to="#" className="text-body text-truncate d-block">
                    App pages.zip
                  </Link>
                </h5>
                <div className="text-muted">2.2MB</div>
              </div>
              <div className="flex-shrink-0 ms-2">
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-icon text-muted btn-sm fs-18"
                  >
                    <i className="ri-download-2-line"></i>
                  </button>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      className="btn btn-icon text-muted btn-sm fs-18 dropdown"
                      type="button"
                    >
                      <i className="ri-more-fill"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <li>
                        <DropdownItem>
                          <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                          Rename
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                          Delete
                        </DropdownItem>
                      </li>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded border-dashed p-2">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm">
                  <div className="avatar-title bg-light text-secondary rounded fs-24">
                    <i className="ri-file-ppt-2-line"></i>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <h5 className="fs-15 mb-1">
                  <Link to="#" className="text-body text-truncate d-block">
                    Psymate admin.ppt
                  </Link>
                </h5>
                <div className="text-muted">2.4MB</div>
              </div>
              <div className="flex-shrink-0 ms-2">
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-icon text-muted btn-sm fs-18"
                  >
                    <i className="ri-download-2-line"></i>
                  </button>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      className="btn btn-icon text-muted btn-sm fs-18 dropdown"
                      type="button"
                    >
                      <i className="ri-more-fill"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <li>
                        <DropdownItem>
                          <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                          Rename
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                          Delete
                        </DropdownItem>
                      </li>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded border-dashed p-2">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm">
                  <div className="avatar-title bg-light text-secondary rounded fs-24">
                    <i className="ri-folder-zip-line"></i>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <h5 className="fs-15 mb-1">
                  <Link to="#" className="text-body text-truncate d-block">
                    Images.zip
                  </Link>
                </h5>
                <div className="text-muted">1.2MB</div>
              </div>
              <div className="flex-shrink-0 ms-2">
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-icon text-muted btn-sm fs-18"
                  >
                    <i className="ri-download-2-line"></i>
                  </button>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      className="btn btn-icon text-muted btn-sm fs-18 dropdown"
                      type="button"
                    >
                      <i className="ri-more-fill"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <li>
                        <DropdownItem>
                          <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                          Rename
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>
                          <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                          Delete
                        </DropdownItem>
                      </li>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <button type="button" className="btn btn-secondary">
              View more
            </button>
          </div>
        </div>
      </CardBody>
    </Card> */}
    </React.Fragment> : <Loader />

  );
};

export default TimeTracking;
