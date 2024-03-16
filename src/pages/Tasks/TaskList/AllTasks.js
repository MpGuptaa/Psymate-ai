import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TableContainer from '../../../Components/Common/TableContainer';
import DeleteModal from "../../../Components/Common/DeleteModal";

// Import Scroll Bar - SimpleBar
import SimpleBar from 'simplebar-react';

//Import Flatepicker
import Flatpickr from "react-flatpickr";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Col, Modal, ModalBody, Row, Label, Input, Button, ModalHeader, FormFeedback, Form } from 'reactstrap';

import {
  getTaskList,
  addNewTask,
  updateTask,
  deleteTask,
} from "../../../store/actions";

import {
  OrdersId,
  TicketNumber,
  Project,
  CreateBy,
  DueDate,
  Status,
  Priority
} from "./TaskListCol";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import { Link } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import { getUsers } from "../../../store/users/action";

const AllTasks = ({ itemId }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => ({
    users: state.User.users,
  }));

  const { taskList, isTaskCreated, isTaskSuccess, error } = useSelector((state) => ({
    taskList: state.Tasks.taskList,
    isTaskCreated: state.Tasks.isTaskCreated,
    isTaskSuccess: state.Tasks.isTaskSuccess,
    error: state.Tasks.error,
  }));

  const storedUser = JSON.parse(sessionStorage.getItem('authUser'));

  const [isEdit, setIsEdit] = useState(false);
  const [task, setTask] = useState([]);
  const [TaskList, setTaskList] = useState([]);
  const [type, setType] = useState("doctor");
  const [searchKeyword, setSearchKeyword] = useState('');
  // Delete Task
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTask(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onClickDelete = (task) => {
    setTask(task);
    setDeleteModal(true);
  };

  useEffect(() => {
    dispatch(getTaskList(itemId, '', searchKeyword));
  }, [dispatch, itemId, searchKeyword, isTaskCreated]);

  useEffect(() => {
    setTaskList(taskList);
  }, [taskList]);

  useEffect(() => {
    dispatch(getUsers(type, 1, `search=${type}&searchBy=type`));
  }, [dispatch, type]);

  // Delete Data
  const handleDeleteTask = () => {
    if (task) {
      dispatch(deleteTask(task._id));
      setDeleteModal(false);
    }
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (task && task.title) || "",
      description: (task && task.description) || "",
      assignee: (task && task.assignee) || [],
      status: (task && task.status) || 'To Do',
      dueDate: (task && task.dueDate) || "",
      priority: (task && task.priority) || 'High',
      ticketNumber: (task && task.ticketNumber) || 1,
      createdBy: (task && task.createdBy) || (storedUser ? storedUser._id : ''),
      updatedAt: (task && task.updatedAt) || "",
      projectId: (task && task.projectId) || "",
      reporter: (task && task.reporter) || (storedUser ? storedUser._id : ''),
      projectId: (task && task.projectId) || itemId,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Task title"),
      description: Yup.string().required("Please Enter Project description"),
      assignee: Yup.array()
        .of(Yup.string())
        .required("Please Assign Your Task")
        .min(1, "Please assign at least one person to the task"),
      ticketNumber: Yup.number().required("Please Enter Ticket Number").integer("Ticket Number must be an integer"),
      status: Yup.string().required("Please Enter Status"),
      priority: Yup.string().required("Please Enter Priority"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedTask = {
          _id: task ? task._id : 0,
          taskId: values.taskId,
          project: values.project,
          task: values.task,
          creater: values.creater,
          dueDate: date,
          status: values.status,
          priority: values.priority,
        };
        // update customer
        dispatch(updateTask(updatedTask));
        validation.resetForm();
      } else {
        const newTask = {
          title: values["title"],
          description: values["description"],
          assignee: values["assignee"],
          endDate: date,
          status: values["status"],
          priority: values["priority"],
          ticketNumber: values["ticketNumber"],
          createdBy: values["createdBy"],
          createdAt: values["createdAt"],
          updatedAt: values["updatedAt"],
          projectId: values["projectId"],
          reporter: values["reporter"],
        };

        dispatch(addNewTask(newTask));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    const task = arg;

    setTask({
      _id: task._id,
      taskId: task.taskId,
      project: task.project,
      task: task.task,
      creater: task.creater,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      subItem: task.subItem,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

  // Add Data
  const handleTaskClicks = () => {
    setTask("");
    setIsEdit(false);
    toggle();
  };

  // Get Data
  useEffect(() => {
    if (!isEmpty(taskList)) setTaskList(taskList);
  }, [taskList]);

  useEffect(() => {
    setTaskList(taskList);
  }, [taskList]);

  useEffect(() => {
    if (!isEmpty(taskList)) {
      setTaskList(taskList);
      setIsEdit(false);
    }
  }, [taskList]);

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".taskCheckBox");

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

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteTask(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".taskCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="taskCheckBox form-check-input" value={cellProps.row.original._id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: "Title",
        accessor: "title",
        filterable: false,
        Cell: (cellProps) => {
          const { row } = cellProps;
          const taskId = row.original._id;
          const title = row.original.title;
          return <OrdersId title={title} taskId={taskId} />;
        },
      },
      {
        Header: "Ticket No",
        accessor: "ticketNumber",
        filterable: false,
        Cell: (cellProps) => {
          return <TicketNumber {...cellProps} />;
        },
      },

      {
        Header: "Due Date",
        accessor: "endDate",
        filterable: false,
        Cell: (cellProps) => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: false,
        Cell: (cellProps) => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
        filterable: false,
        Cell: (cellProps) => {
          return <Priority {...cellProps} />;
        },
      },
      {
        Header: "Tasks",
        accessor: "_id",
        filterable: false,
        Cell: (cellProps) => {
          return <React.Fragment>
            <div className="d-flex">
              {/* <div className="flex-grow-1 tasks_name">Manage</div> */}
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <Link to={`/apps-tasks-details?taskId=${cellProps.value}`}>
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="#" onClick={() => { const taskData = cellProps.row.original; handleCustomerClick(taskData); }}>
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="#" className="remove-item-btn" onClick={() => { const taskData = cellProps.row.original; onClickDelete(taskData); }}>
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </React.Fragment>;
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );

  const defaultdate = () => {
    let d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(defaultdate());
  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };
  const handleSearchInputChange = (e) => {
    const keyword = e.target.value.trim();
    setSearchKeyword(keyword);
  };
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="row">
        <Col lg={12}>
          <div className="card" id="tasksList">
            <div className="card-header border-0">
              <div className="d-flex align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">All Tasks</h5>
                <div className="flex-shrink-0">
                  <div className='d-flex flex-wrap gap-2'>
                    <button className="btn btn-danger add-btn me-1" onClick={() => { setIsEdit(false); toggle(); }}><i className="ri-add-line align-bottom me-1"></i> Create Task</button>
                    {isMultiDeleteButton && <button className="btn btn-secondary" onClick={() => setDeleteModalMulti(true)}><i className="ri-delete-bin-2-line"></i></button>}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="d-flex justify-content-start gap-2">
                <div className="search-box me-2 col-sm-10">
                  <Input type="text" className="form-control" placeholder="Search for tasks..." value={searchKeyword} onChange={handleSearchInputChange} />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </div>
            </div>
            <div className="card-body pt-0">
              {isTaskSuccess && taskList.length ? (
                <TableContainer
                  columns={columns}
                  data={(taskList || [])}
                  isAddUserList={false}
                  customPageSize={8}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
                  handleTaskClick={handleTaskClicks}
                />
              ) : (<p className="text-center">No tasks found.</p>)
              }
              <ToastContainer closeButton={false} limit={1} />
            </div>
          </div>
        </Col>
      </div>

      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        className="border-0"
        modalClassName='modal fade zoomIn'
      >
        <ModalHeader className="p-3 bg-soft-info" toggle={toggle}>
          {!!isEdit ? "Edit Task" : "Create Task"}
        </ModalHeader>
        <Form className="tablelist-form" onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}>

          <ModalBody className="modal-body">
            <Row className="g-3">
              <Col lg={12}>
                <Label for="title-field" className="form-label">Task Title</Label>
                <Input
                  name="title"
                  id="title-field"
                  className="form-control"
                  placeholder="Enter Task Title"
                  type="text"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.title || ""}
                  invalid={
                    validation.touched.title && validation.errors.title ? true : false
                  }
                />
                {validation.touched.title && validation.errors.title ? (
                  <FormFeedback type="invalid">{validation.errors.title}</FormFeedback>
                ) : null}
              </Col>

              <Col lg={12}>
                <Label for="description-field" className="form-label">Task Description</Label>
                <Input
                  name="description"
                  id="description-field"
                  className="form-control"
                  placeholder="Enter Task Description"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.description || ""}
                  invalid={
                    validation.touched.description && validation.errors.description ? true : false
                  }
                />
                {validation.touched.description && validation.errors.description ? (
                  <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
                ) : null}
              </Col>

              <Col lg={12}>
                <Label className="form-label">Assigned To</Label>
                <SimpleBar style={{ maxHeight: "95px" }}>
                  <ul className="list-unstyled vstack gap-2 mb-0">
                    {users.map((item, key) => (
                      <li key={key}>
                        <div className="form-check d-flex align-items-center">
                          <Input
                            name="assignee"
                            className="form-check-input me-3"
                            type="checkbox"
                            onChange={(e) => {
                              const checkedItemId = item._id;
                              const isChecked = e.target.checked;
                              if (isChecked) {
                                validation.setFieldValue('assignee', [...validation.values.assignee, checkedItemId]);
                              } else {
                                validation.setFieldValue('assignee', validation.values.assignee.filter(id => id !== checkedItemId));
                              }
                              validation.handleChange(e);
                            }}
                            onBlur={validation.handleBlur}
                            value={item._id} // Use imgId as the value
                            checked={validation.values.assignee.includes(item._id)}
                            id={item._id}
                          />
                          <Label className="form-check-label d-flex align-items-center" htmlFor={item._id}>
                            <span className="flex-grow-1 ms-2">
                              {item.displayName}
                            </span>
                          </Label>
                          {validation.touched.assignee && validation.errors.assignee ? (
                            <FormFeedback type="invalid">{validation.errors.assignee}</FormFeedback>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </SimpleBar>
              </Col>


              <Col lg={6}>
                <Label for="duedate-field" className="form-label">Due Date</Label>
                <Flatpickr
                  name="dueDate"
                  id="duedate-field"
                  className="form-control"
                  placeholder="Select a date"
                  options={{
                    altInput: true,
                    altFormat: "d M, Y",
                    dateFormat: "d M, Y",
                  }}
                  onChange={(e) => {
                    dateformate(e);
                  }}
                  value={validation.values.dueDate || date}
                // onBlur={validation.handleBlur}
                // invalid={
                //   validation.touched.dueDate && validation.errors.dueDate ? true : false
                // }
                />

              </Col>
              <Col lg={6}>
                <Label for="ticketNumber-field" className="form-label">Ticket Number</Label>
                <Input
                  name="ticketNumber"
                  id="ticketNumber-field"
                  className="form-control"
                  placeholder="Enter Ticket Number"
                  type="number"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.ticketNumber || ""}
                  invalid={
                    validation.touched.ticketNumber && validation.errors.ticketNumber ? true : false
                  }
                />
                {validation.touched.ticketNumber && validation.errors.ticketNumber ? (
                  <FormFeedback type="invalid">{validation.errors.ticketNumber}</FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="ticket-status" className="form-label">Status</Label>
                <Input
                  name="status"
                  type="select"
                  className="form-select"
                  id="ticket-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.status || ""
                  }
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </Input>
                {validation.touched.status &&
                  validation.errors.status ? (
                  <FormFeedback type="invalid">
                    {validation.errors.status}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col lg={6}>
                <Label for="priority-field" className="form-label">Priority</Label>
                <Input
                  name="priority"
                  type="select"
                  className="form-select"
                  id="priority-field"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.priority || ""
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Input>
                {validation.touched.priority &&
                  validation.errors.priority ? (
                  <FormFeedback type="invalid">
                    {validation.errors.priority}
                  </FormFeedback>
                ) : null}
              </Col>

            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <Button
                type="button"
                onClick={() => {
                  setModal(false);
                }}
                className="btn-light"
              >Close</Button>
              <button type="submit" className="btn btn-success" id="add-btn">{!!isEdit ? "Update Task" : "Add Task"}</button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment >
  );
};

export default AllTasks;