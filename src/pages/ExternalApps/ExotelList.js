import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Card, CardHeader, Col, CardBody, Input } from "reactstrap";
import "nouislider/distribute/nouislider.css";
import ConfirmationDialogBox from "../../Components/Common/ConfirmationDialogBox";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import {
  Rating,
  Published,
  Price,
} from "../../pages/Ecommerce/EcommerceProducts/EcommerceProductCol";
//Import data
import { productsData } from "../../common/data";

//Import actions
import {
  getProducts as onGetProducts,
} from "../../store/ecommerce/action";
import { getUsers } from "../../store/users/action";
import { createSearchParams } from "../../helpers/Helper";
import { isEmpty } from "lodash";
import Select from "react-select";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useProfile } from "../../Components/Hooks/UserHooks";
import axios from "axios";
import config from "../../config";
const XMLParser = require("react-xml-parser");

const SingleOptions = [
  { value: "Watches", label: "Watches" },
  { value: "Headset", label: "Headset" },
  { value: "Sweatshirt", label: "Sweatshirt" },
  { value: "20% off", label: "20% off" },
  { value: "4 star", label: "4 star" },
];

const ExotelList = (props) => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => ({
    products: state.Ecommerce.products,
  }));
  const { loading } = useProfile();
  
  const { users, user } = useSelector((state) => ({
    users: state.User.users,
    user: state.Profile.user,
  }));

  const [exotelList, setExotelList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedMulti, setselectedMulti] = useState(null);
  const [product, setProduct] = useState(null);
  const [type, setType] = useState("patient");
  const [filterValues, setFilterValues] = useState({ displayName: "" });
  const storedUser = JSON.parse(sessionStorage.getItem('authUser'));
  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }

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
        return { toNumber, fromNumber, direction, status, time };
      });
      setExotelList(updatedList);
    });
  };

  const searchParamsString = createSearchParams(filterValues);
  useEffect(() => {
    dispatch(getUsers(type, 1, searchParamsString));
  }, [dispatch, loading, type, searchParamsString]);

  useEffect(() => {
    if (products && !products.length) {
      dispatch(onGetProducts());
    }
  }, [dispatch, loading]);

  useEffect(() => {
    setProductList(products);
    loadExotelDetails();
  }, [products]);

  useEffect(() => {
    if (!isEmpty(products)) setProductList(products);
  }, [products]);

  const onUpdate = (value) => {
    setProductList(
      productsData.filter(
        (product) => product.price >= value[0] && product.price <= value[1],
        (document.getElementById("minCost").value = value[0]),
        (document.getElementById("maxCost").value = value[1])
      )
    );
  };

  const [cate, setCate] = useState("all");

  const categories = (category) => {
    let filteredProducts = products;
    if (category !== "all") {
      filteredProducts = products.filter(
        (product) => product.category === category
      );
    }
    setProductList(filteredProducts);
    setCate(category);
  };

  const [ratingvalues, setRatingvalues] = useState([]);
  /*
  on change rating checkbox method
  */
  const onChangeRating = (value) => {
    setProductList(productsData.filter((product) => product.rating >= value));

    var modifiedRating = [...ratingvalues];
    modifiedRating.push(value);
    setRatingvalues(modifiedRating);
  };

  const onUncheckMark = (value) => {
    var modifiedRating = [...ratingvalues];
    const modifiedData = (modifiedRating || []).filter((x) => x !== value);
    /*
    find min values
    */
    var filteredProducts = productsData;
    if (modifiedData && modifiedData.length && value !== 1) {
      var minValue = Math.min(...modifiedData);
      if (minValue && minValue !== Infinity) {
        filteredProducts = productsData.filter(
          (product) => product.rating >= minValue
        );
        setRatingvalues(modifiedData);
      }
    } else {
      filteredProducts = productsData;
    }
    setProductList(filteredProducts);
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = async (user, product) => {
    setDeleteModal(true);
    await axios
      .post(config.api.API_URL + `/call/users`, {
        from: storedUser.phone,
        to: user.phone,
      })
      .then((success) => {
        console.log("success", success);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getInitials = (name) => {
    if (name) {
      const nameParts = name?.split(" ");
      return nameParts.map((part) => part[0]).join("");
    } else {
      return "";
    }
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilterValues(prevState => ({
      ...prevState,
      displayName: value,
    }));
  };
  const columns = useMemo(
    () => [
      {
        Header: "To",
        accessor: "toNumber",
        filterable: false,
      },
      {
        Header: "From",
        accessor: "fromNumber",
        filterable: false,
      },
      {
        Header: "Time",
        accessor: "time",
        filterable: false,
      },
      {
        Header: "Direction",
        accessor: "direction",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                const productData = cellProps.row.original;
                onClickDelete(productData);
              }}
            >
              Call
            </button>
          );
        },
      },
    ],
    []
  );

  // Column
  const column = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
        Cell: (contact) => (
          <>
            <div className="d-flex align-items-center">
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
        Header: "Phone No",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                const productData = cellProps.row.original;
                onClickDelete(productData);
              }}
            >
              Call
            </button>
          );
        },
      },
    ],
    [],
  );

  document.title = "Products | Psymate - Management Portal";

  return (
    <div className="page-content">
      <ToastContainer closeButton={false} limit={1} />
      <ConfirmationDialogBox
        show={deleteModal}
        messages={"Call has been triggered successfully"}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Container fluid>
        <BreadCrumb title="Exotel" pageTitle="Communication" />
        <Row>
          <Col xl={4} lg={4}>
            <Card id="contactList">
              <CardBody className="border border-dashed border-end-0 border-start-0 mb-3">
                <Row className="g-3">
                  <Col className="d-flex justify-content-between">
                    <div
                      className="search-box me-2 mb-2 d-inline-block col-7"
                    >
                      <input
                        onChange={handleFilterChange}
                        id="search-bar-0"
                        type="text"
                        className="form-control search /"
                        placeholder="Search By Name..."
                        value={filterValues.displayName}
                      />
                      <i className="bx bx-search-alt search-icon"></i>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardBody className="pt-0">
                <div>
                  {users.length ? (
                    <TableContainer
                      columns={column}
                      data={users || []}
                      isAddUserList={false}
                      customPageSize={8}
                      totalPages={users.length}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      isCallBoxEnabled={true}
                      isContactsFilter={true}
                      onChangeFunction={(page) => {
                        dispatch(getUsers(type, page, `search=${type}&searchBy=type`));
                      }}
                    />
                  ) : (
                    <p className="text-center">No User found.</p>
                  )}
                </div>

                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>

          <div className="col-xl-8 col-lg-8">
            <div>
              <div className="card">
                <div className="card-body pt-0">
                  {exotelList && exotelList.length > 0 ? (
                    <TableContainer
                      columns={columns}
                      data={exotelList || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      customPageSize={10}
                      divClass="table-responsive mb-1"
                      tableClass="mb-0 align-middle table-borderless"
                      theadClass="table-light text-muted"
                      isProductsFilter={false}
                      isCallBoxEnabled={true}
                      SearchPlaceholder="Search calls..."
                    />
                  ) : (
                    <div className="py-4 text-center">
                      <div>
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#405189,secondary:#0ab39c"
                          style={{ width: "72px", height: "72px" }}
                        ></lord-icon>
                      </div>

                      <div className="mt-4">
                        <h5>Sorry! No Result Found</h5>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default ExotelList;
