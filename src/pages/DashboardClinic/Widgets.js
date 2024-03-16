import React from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";

const calculateAppointmentStats = (appointments) => {
    const confirmedAppointments = appointments.filter(appointment => appointment.status === 'confirmed');
    const scheduledAppointments = appointments.filter(appointment => appointment.status === 'scheduled');

    const totalEarnings = confirmedAppointments?.reduce((total, appointment) => {
        const appointmentTotalPaid = appointment.payment?.reduce((totalPaid, payment) => totalPaid + payment.amtPaid, 0);
        return total + (appointmentTotalPaid || 0);
    }, 0);

    const upcomingAppointments = confirmedAppointments?.filter(appointment => {
        const [time, date] = appointment.slot.split(',');
        const startTime = time.split(' - ')[0].trim();
        const currentDate = new Date();
        const appointmentDate = new Date(date.trim() + 'T' + startTime.trim());
        return appointmentDate > currentDate;
    });

    return {
        totalEarnings,
        scheduledAppointments: scheduledAppointments.length,
        confirmedAppointments: confirmedAppointments.length,
        upcomingAppointments: upcomingAppointments.length,
    };
};

const Widgets = ({ appointments }) => {

    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(appointment => appointment.slot.split(',')[1].trim() === today);
    const appointmentStats = calculateAppointmentStats(appointments);
    const todayAppointmentStats = calculateAppointmentStats(todaysAppointments)

    const ecomWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Total Earnings",
            percentage: todayAppointmentStats?.totalEarnings || 0,
            counter: appointmentStats?.totalEarnings || 0,
            link: "View net earnings",
            bgcolor: "primary",
            icon: "bx bx-dollar-circle",
            decimals: 2,
            prefix: "Rs.",
            suffix: "",
        },
        {
            id: 2,
            cardColor: "secondary",
            label: "Scheduled appointments",
            percentage: todayAppointmentStats?.scheduledAppointments || 0,
            counter: appointmentStats?.scheduledAppointments || 0,
            link: "View scheduled appointments",
            bgcolor: "info",
            icon: "bx bx-book-content",
            decimals: 0,
            prefix: "",
            separator: ",",
            suffix: "",
        },
        {
            id: 3,
            cardColor: "success",
            label: "Confirmed appointments",
            percentage: todayAppointmentStats?.confirmedAppointments || 0,
            counter: appointmentStats?.confirmedAppointments || 0,
            link: "See details",
            bgcolor: "success",
            icon: "bx bxs-book-content",
            decimals: 0,
            prefix: "",
            suffix: "",
        },
        {
            id: 4,
            cardColor: "info",
            label: "Upcoming Appointments",
            percentage: todayAppointmentStats?.upcomingAppointments || 0,
            counter: appointmentStats?.upcomingAppointments || 0,
            link: "View Upcoming Appointments",
            bgcolor: "warning",
            icon: "bx bxs-hourglass-top",
            decimals: 0,
            prefix: "",
            suffix: "",
        },
    ];
    return (
        <React.Fragment>
            {ecomWidgets.map((item, key) => (
                <Col xl={3} md={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                        {item.label}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <h5 className={"fs-14 mb-0 text-success"}>
                                        <i className="fa-solid fa-arrow-up"></i>
                                        {item.percentage}
                                    </h5>
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                        <span className="counter-value" data-target="559.25">
                                            <CountUp
                                                start={0}
                                                prefix={item.prefix || ""}
                                                suffix={item.suffix}
                                                separator={item.separator}
                                                end={item.counter}
                                                decimals={item.decimals}
                                                duration={4}
                                            />
                                        </span>
                                    </h4>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span
                                        className={
                                            "avatar-title rounded fs-3 bg-soft-" + item.bgcolor
                                        }
                                    >
                                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </React.Fragment>
    );
};

export default Widgets;
