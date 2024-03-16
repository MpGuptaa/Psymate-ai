import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Tooltip,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Swiper, SwiperSlide } from "swiper/react";
import classnames from "classnames";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";
import { Link, useLocation } from "react-router-dom";
import { useProfile } from "../../Components/Hooks/UserHooks";
import axios from "axios";
import config from "../../config";

SwiperCore.use([FreeMode, Navigation, Thumbs]);

const PricingWidgetList = (props) => {
  return (
    <React.Fragment>
      <Col lg={3} sm={6}>
        <div className="p-2 border border-dashed rounded">
          <div className="d-flex align-items-center">
            <div className="avatar-sm me-2">
              <div className="avatar-title rounded bg-transparent text-success fs-24">
                <i className={props.pricingDetails.icon}></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <p className="text-muted mb-1">{props.pricingDetails.label} :</p>
              <h5 className="mb-0">{props.pricingDetails.labelDetail}</h5>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

function DataDetail(props) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [ttop, setttop] = useState(false);

  const [ssize, setssize] = useState(false);
  const [msize, setmsize] = useState(false);
  const [lsize, setlsize] = useState(false);
  const [xlsize, setxlsize] = useState(false);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const { loading } = useProfile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(config.api.API_URL + `/item/${id}`).then((res) => {
      setData(res.item);
    });
  }, [loading]);
  console.log(data);
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Data Details" pageTitle="Lab" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row className="gx-lg-5">
                  <Col xl={4} md={8} className="mx-auto">
                    <div className="data-img-slider sticky-side-div">
                      <Swiper
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="swiper data-thumbnail-slider p-2 rounded bg-light"
                      >
                        <div className="swiper-wrapper">
                          <SwiperSlide>
                            <img
                              src={data?.photoURL}
                              alt=""
                              className="img-fluid d-block"
                            />
                          </SwiperSlide>
                        </div>
                      </Swiper>
                      {/* 
                      <div className="data-nav-slider mt-2">
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          spaceBetween={10}
                          className="swiper data-nav-slider mt-2 overflow-hidden"
                        >
                          <div className="swiper-wrapper">
                            <SwiperSlide className="rounded">
                              <div className="nav-slide-item">
                                <img
                                  src={data8}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                            <SwiperSlide>
                              <div className="nav-slide-item">
                                <img
                                  src={data6}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                            <SwiperSlide>
                              <div className="nav-slide-item">
                                <img
                                  src={data1}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                            <SwiperSlide>
                              <div className="nav-slide-item">
                                <img
                                  src={data8}
                                  alt=""
                                  className="img-fluid d-block rounded"
                                />
                              </div>
                            </SwiperSlide>
                          </div>
                        </Swiper>
                      </div> */}
                    </div>
                  </Col>

                  <Col xl={8}>
                    <div className="mt-xl-0 mt-5">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <h4>{data?.displayName}</h4>
                          <div className="hstack gap-3 flex-wrap">
                            <div>
                              <Link to="#" className="text-primary d-block">
                                {data?.manufacturer}
                              </Link>
                            </div>
                            <div className="vr"></div>
                            <div className="text-muted">
                              Manufacturer :{" "}
                              <span className="text-body fw-medium">
                                {data?.manufacturer?.name}
                              </span>
                            </div>
                            <div className="vr"></div>
                            <div className="text-muted">
                              Published :{" "}
                              <span className="text-body fw-medium">
                                {data?.createdAt}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div>
                            <Tooltip
                              placement="top"
                              isOpen={ttop}
                              target="TooltipTop"
                              toggle={() => {
                                setttop(!ttop);
                              }}
                            >
                              Edit
                            </Tooltip>
                            <a
                              href={
                                "apps-lab-add-data?id=" + data?._id
                              }
                              id="TooltipTop"
                              className="btn btn-light"
                            >
                              <i className="ri-pencil-fill align-bottom"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <Row className="mt-4">
                        {[
                          {
                            id: 1,
                            icon: "ri-money-dollar-circle-fill",
                            label: "MRP",
                            labelDetail: `RS ${data?.mrp}`,
                          },
                          {
                            id: 1,
                            icon: "ri-money-dollar-circle-fill",
                            label: "MRP",
                            labelDetail: `RS ${data?.cost}`,
                          },
                          {
                            id: 1,
                            icon: "ri-stack-fill",
                            label: "STOCK",
                            labelDetail: `RS ${data?.quantity}`,
                          },
                          {
                            id: 1,
                            icon: "ri-file-copy-2-fill",
                            label: "Selling Price",
                            labelDetail: `RS ${data?.sellingRate}`,
                          },
                        ].map((pricingDetails, key) => (
                          <PricingWidgetList
                            pricingDetails={pricingDetails}
                            key={key}
                          />
                        ))}
                      </Row>

                      {data?.description && (
                        <div className="mt-4 text-muted">
                          <h5 className="fs-15">Description :</h5>
                          <p>{data?.meta?.description}</p>
                        </div>
                      )}

                      <div className="data-content mt-5">
                        <h5 className="fs-15 mb-3">Data Description :</h5>
                        <Nav tabs className="nav-tabs-custom nav-success">
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTab === "1",
                              })}
                              onClick={() => {
                                toggleCustom("1");
                              }}
                            >
                              Specification
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTab === "2",
                              })}
                              onClick={() => {
                                toggleCustom("2");
                              }}
                            >
                              Details
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent
                          activeTab={customActiveTab}
                          className="border border-top-0 p-4"
                          id="nav-tabContent"
                        >
                          <TabPane id="nav-speci" tabId="1">
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row" style={{ width: "200px" }}>
                                      Discount:
                                    </th>
                                    <td className="text-capitalize">
                                      {data?.discount}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Narcotics</th>
                                    <td>
                                      {data?.narcotics ? "Yes" : "No"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </TabPane>
                          <TabPane id="nav-detail" tabId="2">
                            <div>
                              <h5 className="mb-3">
                                Tommy Hilfiger Sweatshirt for Men (Pink)
                              </h5>
                              <p>
                                Tommy Hilfiger men striped pink sweatshirt.
                                Crafted with cotton. Material composition is
                                100% organic cotton. This is one of the world’s
                                leading designer lifestyle brands and is
                                internationally recognized for celebrating the
                                essence of classic American cool style,
                                featuring preppy with a twist designs.
                              </p>
                              <div>
                                <p className="mb-2">
                                  <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                  Machine Wash
                                </p>
                                <p className="mb-2">
                                  <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                  Fit Type: Regular
                                </p>
                                <p className="mb-2">
                                  <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                  100% Cotton
                                </p>
                                <p className="mb-0">
                                  <i className="mdi mdi-circle-medium me-1 text-muted align-middle"></i>{" "}
                                  Long sleeve
                                </p>
                              </div>
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DataDetail;
