import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { AudiencesCharts } from '../DashboardAnalytics/DashboardAnalyticsCharts';
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";

const AppoinmentsMetrics = ({ appointments }) => {
    const dispatch = useDispatch();
    const [chartData, setChartData] = useState([
        { name: "This Year", data: Array(12).fill(0) },
        { name: "Last Year", data: Array(12).fill(0) }
    ]);

    useEffect(() => {
        countAppointments(appointments);
    }, [appointments]);

    const today = new Date().toISOString().split('T')[0];
    const cancelledAppointments = appointments.filter(appointment => appointment.status === 'cancelled');
    const todaysAppointments = appointments.filter(appointment => appointment.slot.split(',')[1].trim() === today);

    const countAppointments = (appointments) => {
        appointments.forEach(appointment => {
            const [year, month] = appointment.appointmentDate.split('-');
            const monthIndex = parseInt(month) - 1;
            const yearIndex = year === (new Date().getFullYear()).toString() ? 0 : 1;
            setChartData(prevData => {
                const newData = [...prevData];
                newData[yearIndex].data[monthIndex]++;
                return newData;
            });
        });
    };

    return (
        <React.Fragment>
            <Col>
                <Card>
                    <CardHeader className="border-0 align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Appointments Metrics</h4>
                    </CardHeader>
                    <CardHeader className="p-0 border-0 bg-soft-light">
                        <Row className="g-0 text-center">
                            <Col xs={6} sm={4}>
                                <div className="p-3 border border-dashed border-start-0">
                                    <h5 className="mb-1"><span className="counter-value" data-target="854">
                                        <CountUp
                                            start={0}
                                            end={appointments?.length || 0}
                                            duration={3}
                                            separator=","
                                        />
                                    </span>
                                    </h5>
                                    <p className="text-muted mb-0">Total</p>
                                </div>
                            </Col>
                            <Col xs={6} sm={4}>
                                <div className="p-3 border border-dashed border-start-0">
                                    <h5 className="mb-1"><span className="counter-value" data-target="1278">
                                        <CountUp
                                            start={0}
                                            end={cancelledAppointments?.length || 0}
                                            duration={3}
                                        />
                                    </span>
                                    </h5>
                                    <p className="text-muted mb-0">Cancelled</p>
                                </div>
                            </Col>
                            <Col xs={6} sm={4}>
                                <div className="p-3 border border-dashed border-start-0 border-end-0">
                                    <h5 className="mb-1"><span className="counter-value" data-target="3">
                                        <CountUp
                                            start={0}
                                            end={todaysAppointments?.length || 0}
                                            duration={3}
                                        />
                                    </span>
                                    </h5>
                                    <p className="text-muted mb-0">Today's</p>
                                </div>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="p-0 pb-2">
                        <div>
                            <div id="audiences_metrics_charts" className="apex-charts" dir="ltr">
                                <AudiencesCharts series={chartData} dataColors='["--vz-primary", "--vz-gray-300"]' />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default AppoinmentsMetrics;