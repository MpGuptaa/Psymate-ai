import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, UncontrolledDropdown } from 'reactstrap';
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from 'react-toastify';
import * as moment from "moment";
//redux
import { useSelector, useDispatch } from 'react-redux';

//Import Icons
import FeatherIcon from "feather-icons-react";

//import action
import {
    getProjectList as onGetProjectList,
    deleteProjectList as onDeleteProjectList,
} from "../../../store/actions";

const List = ({ projectList }) => {
    const dispatch = useDispatch();

    const { projects: projectLists, projectsCount, resultPerPage, filteredprojectsCount } = useSelector((state) => ({
        ...state.Projects.projectLists,
    }));

    const [project, setProject] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(onGetProjectList(searchKeyword, currentPage));
    }, [dispatch, searchKeyword, currentPage]);

    useEffect(() => {
        setProject(projectLists);
    }, [projectLists]);

    // delete
    const onClickData = (project) => {
        setProject(project);
        setDeleteModal(true);
    };

    const handleDeleteProjectList = () => {
        if (project) {
            dispatch(onDeleteProjectList(project));
            setDeleteModal(false);
        }
    };
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };
    const handleSearchInputChange = (e) => {
        const keyword = e.target.value.trim();
        setSearchKeyword(keyword);
    };
    const activebtn = (ele) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };
    const handleValidDate = date => {
        const formattedDate = moment(new Date(date)).format("DD MMM Y hh:mm A");
        return formattedDate;
    };
    return (
        <React.Fragment>
            <ToastContainer closeButton={false} />
            <DeleteModal
                show={deleteModal}
                onDeleteClick={() => handleDeleteProjectList()}
                onCloseClick={() => setDeleteModal(false)}
            />
            <Row className="g-4 mb-3">
                <div className="col-sm-auto">
                    <div>
                        <Link to="/apps-projects-create" className="btn btn-success"><i
                            className="ri-add-line align-bottom me-1"></i> Add New</Link>
                    </div>
                </div>
                <div className="col-sm-3 ms-auto">
                    <div className="d-flex justify-content-sm-end gap-2">
                        <div className="search-box ms-2 col-sm-7">
                            <Input type="text" className="form-control" placeholder="Search..." value={searchKeyword}
                                onChange={handleSearchInputChange} />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                </div>
            </Row>

            <div className="row">
                {(projectLists || []).map((item, index) => (
                    <React.Fragment key={index}>
                        <Col xxl={3} sm={6} className="project-card">
                            <Card>
                                <CardBody>
                                    <div className={`p-3 mt-n3 mx-n3 bg-soft-success rounded-top`}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 className="mb-0 fs-15"><Link to={`/apps-projects-overview?id=${item._id}`} className="text-dark">{item.displayName}</Link></h5>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="d-flex gap-1 align-items-center my-n2">
                                                    <UncontrolledDropdown direction='start'>
                                                        <DropdownToggle tag="button" className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15">
                                                            <FeatherIcon icon="more-horizontal" className="icon-sm" />
                                                        </DropdownToggle>

                                                        <DropdownMenu className="dropdown-menu-end">
                                                            <Link to={`/apps-projects-overview?id=${item._id}`} className="text-dark">
                                                                <DropdownItem>
                                                                    <i className="ri-eye-fill align-bottom me-2 text-muted"></i> View
                                                                </DropdownItem>
                                                            </Link>
                                                            <DropdownItem href="apps-projects-create"><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</DropdownItem>
                                                            <div className="dropdown-divider"></div>
                                                            <DropdownItem href="#" onClick={() => onClickData(item)} data-bs-toggle="modal" data-bs-target="#removeProjectModal"><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Remove</DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card shadow-sm mb-2">
                                        <div className="card-body py-3">
                                            <Row className="gy-3">
                                                <Col xs={12} md={4}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <p className="text-muted mb-0 me-2">Category:</p>
                                                        <span className={`fs-12 badge badge-soft-success`}>{item.category}</span>
                                                    </div>
                                                </Col>

                                            </Row>
                                            <Col xs={12} md={8}>
                                                <p className="text-dark mb-0 me-2 fs-15">{item.description}</p>
                                            </Col>
                                        </div>
                                        <div className="card-footer bg-transparent border-top-dashed py-2">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="text-muted">
                                                        <i className="ri-calendar-event-fill me-1 align-bottom"></i>
                                                        {handleValidDate(item.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                    </React.Fragment>
                ))
                }

            </div >
            <Row className="g-0 text-center text-sm-start align-items-center mb-4">
                <Col sm={6}>
                    <div>
                        <p className="mb-sm-0 text-muted">Showing <span className="fw-semibold">{(resultPerPage * currentPage) - resultPerPage + 1}</span> to <span className="fw-semibold">{(resultPerPage * currentPage) - resultPerPage + filteredprojectsCount}</span> of <span className="fw-semibold text-decoration-underline">{projectsCount}</span> entries</p>
                    </div>
                </Col>

                <Col sm={6}>
                    <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <Link to="#" className="page-link" onClick={() => setCurrentPageNo(currentPage - 1)}>
                                Previous
                            </Link>
                        </li>
                        <li className="page-item active">
                            <Link to="#" className="page-link" onClick={() => setCurrentPageNo(currentPage)}>
                                {currentPage}
                            </Link>
                        </li>
                        <li className={`page-item ${projectsCount - (currentPage) * resultPerPage <= 0 ? 'disabled' : ''}`}>
                            <Link to="#" className="page-link" onClick={() => setCurrentPageNo(currentPage + 1)}>
                                {currentPage + 1}
                            </Link>
                        </li>
                        <li className={`page-item ${projectsCount - (currentPage + 1) * resultPerPage <= 0 ? 'disabled' : ''}`}>
                            <Link to="#" className="page-link" onClick={() => setCurrentPageNo(currentPage + 2)}>
                                {currentPage + 2}
                            </Link>
                        </li>
                        <li className={`page-item ${projectsCount - (currentPage + 2) * resultPerPage <= 0 ? 'disabled' : ''}`}>
                            <Link to="#" className="page-link" onClick={() => setCurrentPageNo(currentPage + 3)}>
                                {currentPage + 3}
                            </Link>
                        </li>
                        <li className={`page-item ${projectsCount - (currentPage + 3) * resultPerPage <= 0 ? 'disabled' : ''}`}>
                            <Link to="#" className="page-link" onClick={() => setCurrentPageNo(currentPage + 4)}>
                                {currentPage + 4}
                            </Link>
                        </li>
                        <li className={`page-item ${projectsCount - (currentPage) * resultPerPage <= 0 ? 'disabled' : ''}`}>
                            <Link to="#" className="page-link" onClick={() => setCurrentPageNo(currentPage + 1)}>
                                Next
                            </Link>
                        </li>
                    </ul>
                </Col>
            </Row>
        </React.Fragment >
    );
};

export default List;