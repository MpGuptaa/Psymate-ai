import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Card, Col, CardBody } from "reactstrap";
import Widget from "./Widgets";
import TableContainer from "../../Components/Common/TableContainer";
import { useDispatch, useSelector } from "react-redux";
import AppointmentsMetrix from "./AppointmentsMetrix";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { toast } from 'react-toastify';
import { StoreVisitsCharts } from '../DashboardEcommerce/DashboardEcommerceCharts';
import SalesByLocations from '../DashboardEcommerce/SalesByLocations';
import axios from "axios";
import config from "../../config";
import Filter from "../Pages/Team/Filter";
import ExotelList from "../ExternalApps/ExotelList";
const DashboardClinic = () => {
    document.title = "Dashboard-Clinic | Psymate - Management Portal";
    const dispatch = useDispatch();
    const { loading, userProfile } = useProfile();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [searchkeyword, setSearchkeyword] = useState("");
    const [series, setSeries] = useState([25, 25, 25, 25]);

    const [filterValues, setFilterValues] = useState({ status: "" });
    const inputFields = [
        {
            type: "radio",
            name: "status",
            label: "Status",
            options: [
                { label: "Scheduled", value: "scheduled" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Cancelled", value: "cancelled" },
            ],
        },
    ];

    const handleFilterChange = (newFilterValues) => {
        setFilterValues(newFilterValues);
    };

    const fetchAppointments = async () => {
        try {
            await axios.get(`${config.api.API_URL}/appointment`).then((res) => {
                const sortedAppointments = res.data.sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                setAppointments(sortedAppointments);
            });
        } catch (error) {
            toast.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        if (appointments.length !== 0) {
            const calculateSeries = () => {
                const confirmedAppointments = appointments.filter(appointment => appointment.status === 'confirmed');
                const scheduledAppointments = appointments.filter(appointment => appointment.status === 'scheduled').length;
                const cancelledAppointments = appointments.filter(appointment => appointment.status === 'cancelled').length;

                const upcomingAppointments = confirmedAppointments?.filter(appointment => {
                    const [time, date] = appointment.slot.split(',');
                    const startTime = time.split(' - ')[0].trim();
                    const currentDate = new Date();
                    const appointmentDate = new Date(date.trim() + 'T' + startTime.trim());
                    return appointmentDate > currentDate;
                });

                setSeries([scheduledAppointments, confirmedAppointments.length, upcomingAppointments.length, cancelledAppointments]);
            };

            calculateSeries();
        }
    }, [appointments]);

    const ChartData = {
        labels: ['Scheduled', 'Confirmed', 'Upcoming', 'Cancelled'],
        series: series
    };

    const fetchfilteredAppointments = async ({ page, searchkeyword, appointments, filterValues }) => {
        let allAppointments = appointments;
        if (filterValues.status) {
            allAppointments = appointments.filter(appointment => appointment.status === `${filterValues.status}`);
        }

        const filteredAppointments = allAppointments?.filter(appointment => {
            if (searchkeyword) {
                const name = appointment.patient.displayName?.toLowerCase();
                return name.includes(searchkeyword.toLowerCase());
            }
            return true;
        });

        const pageSize = 12;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

        setFilteredAppointments(paginatedAppointments);
    };

    useEffect(() => {
        if (appointments.length !== 0) {
            fetchfilteredAppointments({ page: pageCount, searchkeyword, appointments, filterValues });
        }
    }, [pageCount, searchkeyword, appointments, filterValues]);

    const handlekeywordChange = (event) => {
        setSearchkeyword(event.target.value);
    };


    const columns = useMemo(
        () => [
            {
                Header: "Patient",
                accessor: "patient.displayName",
                filterable: false,
            },
            {
                Header: "Doctor",
                accessor: "doctor.displayName",
                filterable: false,
            },
            {
                Header: "Date",
                accessor: "appointmentDate",
                filterable: false,
            },
            {
                Header: "Status",
                accessor: "status",
                filterable: false,
            },
        ],
        [],
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row className="mb-3 pb-1">
                                    <Col xs={12}>
                                        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div className="flex-grow-1">
                                                <h4 className="fs-16 mb-1">
                                                    Good Morning, {userProfile?.displayName}!
                                                </h4>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Widget appointments={appointments} />
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6}>
                                        <AppointmentsMetrix appointments={appointments} />
                                        <Card>
                                            <StoreVisitsCharts dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' ChartData={ChartData} />
                                        </Card>
                                    </Col>

                                    <Col xl={6} lg={6}>
                                        <Card id="appointmentList">
                                            <CardBody className="border border-dashed border-end-0 border-start-0">
                                                <Row className="g-3">
                                                    <Col className="d-flex justify-content-between">
                                                        <div
                                                            className="search-box d-inline-block col-7"
                                                        >
                                                            <input
                                                                onChange={handlekeywordChange}
                                                                id="search-bar-0"
                                                                type="text"
                                                                className="form-control search /"
                                                                placeholder="Search By Patient Name..."
                                                                value={searchkeyword}
                                                            />
                                                            <i className="bx bx-search-alt search-icon"></i>
                                                        </div>
                                                    </Col>
                                                    <Col className="d-flex justify-content-end flex-end">
                                                        <Filter
                                                            inputFields={inputFields}
                                                            filterValues={filterValues}
                                                            onFilterChange={handleFilterChange}
                                                        />
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                            <CardBody className="pt-0">
                                                <div>
                                                    {filteredAppointments.length ? (
                                                        <TableContainer
                                                            columns={columns}
                                                            data={filteredAppointments || []}
                                                            isAddUserList={false}
                                                            customPageSize={8}
                                                            totalPages={filteredAppointments.length}
                                                            className="custom-header-css"
                                                            divClass="table-responsive table-card mb-3"
                                                            tableClass="align-middle table-nowrap"
                                                            theadClass="table-light"
                                                            isContactsFilter={true}
                                                            SearchPlaceholder="Search for contact..."
                                                            onChangeFunction={(page) => {
                                                                setPageCount(page);
                                                            }}
                                                        />
                                                    ) : (
                                                        <p className="text-center">No Appointments found.</p>
                                                    )}
                                                </div>
                                            </CardBody>
                                        </Card>
                                        {/* <Card xl={6} lg={6}>
                                            <SalesByLocations value={12} />
                                        </Card> */}
                                    </Col>
                                </Row>
                                <Row>
                                <ExotelList/>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardClinic;
