import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
import StoreVisits from "./StoreVisits";
import TopManufacturers from "./TopManufacturers";
import { getManufacturers, getOrders, getProducts } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useProfile } from "../../Components/Hooks/UserHooks";

const DashboardEcommerce = () => {
  document.title = "Dashboard | Psymate - Management Portal";

  const [rightColumn, setRightColumn] = useState(false);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };
  const dispatch = useDispatch();
  const { loading, userProfile } = useProfile();
  const { products, manufacturers, orders } = useSelector((state) => ({
    products: state.Ecommerce.products,
    manufacturers: state.Ecommerce.manufacturers,
    orders: state.Ecommerce.orders,
  }));
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getOrders("product"));
    dispatch(getManufacturers());
  }, [dispatch]);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Section
                  userProfile={userProfile}
                  rightClickBtn={toggleRightColumn}
                />
                <Row>
                  <Widget orders={orders} />
                </Row>
                <Row>
                  <Col xl={8}>{/* <Revenue /> */}</Col>
                  {/* <SalesByLocations /> */}
                </Row>
                <Row>
                  <BestSellingProducts products={products?.data} />
                  <TopManufacturers manufacturers={manufacturers} />
                </Row>
                <Row>
                  <StoreVisits />
                  <RecentOrders orders={orders?.data} />
                </Row>
              </div>
            </Col>

            <RecentActivity
              rightColumn={rightColumn}
              hideRightColumn={toggleRightColumn}
            />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
