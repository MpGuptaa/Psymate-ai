import React, { useEffect, useState, useMemo } from "react";
import AsyncSelect from "react-select/async";

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  UncontrolledCollapse,
  Row,
  Card,
  CardHeader,
  Col,
  Label,
} from "reactstrap";
import classnames from "classnames";

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import DeleteModal from "../../../Components/Common/DeleteModal";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { Rating, Published, Price } from "./EcommerceProductCol";
//Import data
import { productsData } from "../../../common/data";

//Import actions
import { getProducts as onGetProducts, deleteProducts } from "../../../store/ecommerce/action";
import { isEmpty } from "lodash";
import Select from "react-select";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import axios from "axios";
import { addToCart } from "../../../helpers/fakebackend_helper";
import config from "../../../config";
import UploadCSV from "../../../helpers/UploadCSV";

const SingleOptions = [
  { value: "Watches", label: "Watches" },
  { value: "Headset", label: "Headset" },
  { value: "Sweatshirt", label: "Sweatshirt" },
  { value: "20% off", label: "20% off" },
  { value: "4 star", label: "4 star" },
];

const EcommerceProducts = (props) => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => ({
    products: state.Ecommerce.products,
  }));

  const { loading, userProfile } = useProfile();
  const [patient, setPatient] = useState([]);
  const [productList, setProductList] = useState([]);
  const [pages, setPages] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedMulti, setselectedMulti] = useState(null);
  const [product, setProduct] = useState(null);
  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }
  const history = useNavigate();

  useEffect(() => {
    if (products && !products.data?.length) {
      dispatch(onGetProducts(1));
    }
  }, [dispatch]);

  useEffect(() => {
    setProductList(products.data);
  }, [products]);

  useEffect(() => {
    if (!isEmpty(products)) setProductList(products.data);
  }, [products]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredProducts = products.data;
      if (type !== "all") {
        filteredProducts = products.data.filter((product) => product.status === type);
      }
      setProductList(filteredProducts);
    }
  };

  const onUpdate = (value) => {
    setProductList(
      productsData.filter(
        (product) => product.price >= value[0] && product.price <= value[1],
        (document.getElementById("minCost").value = value[0]),
        (document.getElementById("maxCost").value = value[1]),
      ),
    );
  };

  const [cate, setCate] = useState("all");

  const categories = (category) => {
    let filteredProducts = products.data;
    if (category !== "all") {
      filteredProducts = products.data.filter((product) => product.category === category);
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
    if (modifiedData && modifiedData?.length && value !== 1) {
      var minValue = Math.min(...modifiedData);
      if (minValue && minValue !== Infinity) {
        filteredProducts = productsData.filter((product) => product.rating >= minValue);
        setRatingvalues(modifiedData);
      }
    } else {
      filteredProducts = productsData;
    }
    setProductList(filteredProducts);
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (product) {
      dispatch(deleteProducts(product._id));
      setDeleteModal(false);
      dispatch(onGetProducts(1));
    }
  };

  // Displat Delete Button
  const [dele, setDele] = useState(0);
  const displayDelete = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    setDele(ele?.length);
    if (ele?.length === 0) {
      del.style.display = "none";
    } else {
      del.style.display = "block";
    }
  };

  // Delete Multiple
  const deleteMultiple = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    ele.forEach((element) => {
      dispatch(deleteProducts(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
      del.style.display = "none";
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: (cell) => {
          return (
            <input
              type="checkbox"
              className="productCheckBox form-check-input"
              value={cell.row.original._id}
              onClick={() => displayDelete()}
            />
          );
        },
      },
      {
        Header: "Product",
        Cell: (product) => {
          return (
            <>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar-sm bg-light rounded p-1">
                    <img src={product.row.original.photoURL} alt="" className="img-fluid d-block" />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-14 mb-1">
                    <Link to={`/apps-ecommerce-product-details?id=${product.row.original._id}`} className="text-dark">
                      {product.row.original.displayName}
                    </Link>
                  </h5>
                  <p className="text-muted mb-0">
                    MRP :<span className="fw-medium">{product.row.original.mrp}</span>
                  </p>
                </div>
              </div>
            </>
          );
        },
      },
      {
        Header: "Stock",
        accessor: "quantity",
        filterable: false,
      },
      {
        Header: "Price",
        accessor: "sellingRate",
        filterable: false,
        Cell: (cellProps) => {
          return <Price {...cellProps} />;
        },
      },

      {
        Header: "Unit",
        accessor: "unit",
        filterable: false,
        Cell: (product) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-0">
                  {product.row.original.unit} :<span className="fw-medium">{product.row.original.conversion}</span>
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm" tag="button">
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem href={`/apps-ecommerce-product-details?id=${cellProps.row.original._id}`}>
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                  View
                </DropdownItem>

                <DropdownItem href={`/apps-ecommerce-add-product?id=${cellProps.row.original._id}`}>
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    axios.post(`${config.api.API_URL}/item/increase/${cellProps.row.original._id}/1`).then((res) => {
                      dispatch(onGetProducts(1));
                    });
                  }}
                >
                  <i className="ri-folder-add-line align-bottom me-2 text-muted"></i>
                  Add 1 to Stock
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    axios.post(`${config.api.API_URL}/item/decrease/${cellProps.row.original._id}/1`).then((res) => {
                      dispatch(onGetProducts(1));
                    });
                  }}
                >
                  <i className="ri-folder-reduce-line align-bottom me-2 text-muted"></i>
                  Subtract 1 from Stock
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    addToCart(
                      {
                        displayName: userProfile.displayName,
                        phone: userProfile.phone,
                        _id: userProfile._id,
                        email: userProfile.email,
                      },
                      {
                        ...cellProps.row.original,
                        displayName: cellProps.row.original.name,
                      },
                    );
                  }}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                  Add To Cart
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  href="#"
                  onClick={() => {
                    const productData = cellProps.row.original;
                    onClickDelete(productData);
                  }}
                >
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
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
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteOrder} onCloseClick={() => setDeleteModal(false)} />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <Container fluid>
        <BreadCrumb title="Products" pageTitle="Ecommerce" />
        <Col xs={4}>
          <div className="mb-3">
            <Label className="form-label">Search For Patients</Label>
            <AsyncSelect
              className="mb-0"
              value={{
                value: patient,
                label: patient?.displayName,
              }}
              placeholder="Search For Patients"
              onChange={(e) => {
                setPatient(e.value);
              }}
              loadOptions={async (inputValue) => {
                try {
                  const response = await axios.get(
                    config.api.API_URL + `/users?search=${inputValue}&type=patient&searchBy=displayName`,
                  );
                  const data = response.data;
                  const options = data.map((item) => ({
                    value: item,
                    label: item.displayName,
                  }));
                  return options;
                } catch (error) {
                  console.error("Error loading options:", error);
                  return [];
                }
              }}
              isClearable
              isSearchable
            />
          </div>
        </Col>
        <Row>
          <Col xl={3} lg={4}>
            <Card>
              <CardHeader>
                <div className="d-flex mb-3">
                  <div className="flex-grow-1">
                    <h5 className="fs-16">Filters</h5>
                  </div>
                  <div className="flex-shrink-0">
                    <Link to="#" className="text-decoration-underline">
                      Clear All
                    </Link>
                  </div>
                </div>

                <div className="filter-choices-input">
                  <Select
                    value={selectedMulti}
                    isMulti={true}
                    onChange={() => {
                      handleMulti();
                    }}
                    options={SingleOptions}
                  />
                </div>
              </CardHeader>

              <div className="accordion accordion-flush">
                <div className="card-body border-bottom">
                  <div>
                    <p className="text-muted text-uppercase fs-12 fw-medium mb-2">Products</p>
                    <ul className="list-unstyled mb-0 filter-list">
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Kitchen Storage & Containers"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Kitchen Storage & Containers")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Grocery</h5>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Clothes"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Clothes")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Fashion</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">5</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Watches"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Watches")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Watches</h5>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "electronics"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("electronics")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Electronics</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">5</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Furniture"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Furniture")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Furniture</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">6</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Bike Accessories"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Bike Accessories")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Automotive Accessories</h5>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "appliances"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("appliances")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Appliances</h5>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            <span className="badge bg-light text-muted">7</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className={
                            cate === "Bags, Wallets and Luggage"
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"
                          }
                          onClick={() => categories("Bags, Wallets and Luggage")}
                        >
                          <div className="flex-grow-1">
                            <h5 className="fs-13 mb-0 listname">Kids</h5>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card-body border-bottom">
                  <p className="text-muted text-uppercase fs-12 fw-medium mb-4">Price</p>

                  <Nouislider
                    range={{ min: 0, max: 2000 }}
                    start={[0, 2000]}
                    connect
                    onSlide={onUpdate}
                    data-slider-color="primary"
                    id="product-price-range"
                  />
                  <div className="formCost d-flex gap-2 align-items-center mt-3">
                    <input className="form-control form-control-sm" type="text" id="minCost" readOnly />
                    <span className="fw-semibold text-muted">to</span>
                    <input className="form-control form-control-sm" type="text" id="maxCost" readOnly />
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none"
                      type="button"
                      id="flush-headingBrands"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">Brands</span>
                      <span className="badge bg-success rounded-pill align-middle ms-1">2</span>
                    </button>
                  </h2>
                  <UncontrolledCollapse toggler="#flush-headingBrands">
                    <div
                      id="flush-collapseBrands"
                      className="accordion-collapse collapse show"
                      aria-labelledby="flush-headingBrands"
                    >
                      <div className="accordion-body text-body pt-0">
                        <div className="search-box search-box-sm">
                          <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Search Brands..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                        <div className="d-flex flex-column gap-2 mt-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productBrandRadio5"
                              defaultChecked
                            />
                            <label className="form-check-label" htmlFor="productBrandRadio5">
                              Boat
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productBrandRadio4" />
                            <label className="form-check-label" htmlFor="productBrandRadio4">
                              OnePlus
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productBrandRadio3" />
                            <label className="form-check-label" htmlFor="productBrandRadio3">
                              Realme
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productBrandRadio2" />
                            <label className="form-check-label" htmlFor="productBrandRadio2">
                              Sony
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productBrandRadio1"
                              defaultChecked
                            />
                            <label className="form-check-label" htmlFor="productBrandRadio1">
                              JBL
                            </label>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                            >
                              1,235 More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none collapsed"
                      type="button"
                      id="flush-headingDiscount"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">Discount</span>
                      <span className="badge bg-success rounded-pill align-middle ms-1">1</span>
                    </button>
                  </h2>
                  <UncontrolledCollapse toggler="#flush-headingDiscount">
                    <div id="flush-collapseDiscount" className="accordion-collapse collapse show">
                      <div className="accordion-body text-body pt-1">
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productdiscountRadio6" />
                            <label className="form-check-label" htmlFor="productdiscountRadio6">
                              50% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productdiscountRadio5" />
                            <label className="form-check-label" htmlFor="productdiscountRadio5">
                              40% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productdiscountRadio4" />
                            <label className="form-check-label" htmlFor="productdiscountRadio4">
                              30% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productdiscountRadio3"
                              defaultChecked
                            />
                            <label className="form-check-label" htmlFor="productdiscountRadio3">
                              20% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productdiscountRadio2" />
                            <label className="form-check-label" htmlFor="productdiscountRadio2">
                              10% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productdiscountRadio1" />
                            <label className="form-check-label" htmlFor="productdiscountRadio1">
                              Less than 10%
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none collapsed"
                      type="button"
                      id="flush-headingRating"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">Rating</span>
                      <span className="badge bg-success rounded-pill align-middle ms-1">1</span>
                    </button>
                  </h2>

                  <UncontrolledCollapse toggler="#flush-headingRating">
                    <div
                      id="flush-collapseRating"
                      className="accordion-collapse collapse show"
                      aria-labelledby="flush-headingRating"
                    >
                      <div className="accordion-body text-body">
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productratingRadio4"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(4);
                                } else {
                                  onUncheckMark(4);
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor="productratingRadio4">
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              4 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productratingRadio3"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(3);
                                } else {
                                  onUncheckMark(3);
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor="productratingRadio3">
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              3 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="productratingRadio2" />
                            <label
                              className="form-check-label"
                              htmlFor="productratingRadio2"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(2);
                                } else {
                                  onUncheckMark(2);
                                }
                              }}
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              2 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productratingRadio1"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(1);
                                } else {
                                  onUncheckMark(1);
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor="productratingRadio1">
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>
                              1
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>
              </div>
            </Card>
          </Col>

          <div className="col-xl-9 col-lg-8">
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center border-0">
                    <div className="col">
                      <Nav className="nav-tabs-custom card-header-tabs border-bottom-0" role="tablist">
                        <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === "1" }, "fw-semibold")}
                            onClick={() => {
                              toggleTab("1", "all");
                            }}
                            href="#"
                          >
                            All
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">12</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === "2" }, "fw-semibold")}
                            onClick={() => {
                              toggleTab("2", "published");
                            }}
                            href="#"
                          >
                            Published
                            <span className="badge badge-soft-danger align-middle rounded-pill ms-1">5</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === "3" }, "fw-semibold")}
                            onClick={() => {
                              toggleTab("3", "draft");
                            }}
                            href="#"
                          >
                            Draft
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                    <div className="col-auto">
                      <div id="selection-element">
                        <div className="my-n1 d-flex align-items-center text-muted">
                          Select
                          <div id="select-content" className="text-body fw-semibold px-1">
                            {dele}
                          </div>
                          Result
                          <button
                            type="button"
                            className="btn btn-link link-danger p-0 ms-3"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  {productList && productList?.length > 0 ? (
                    <TableContainer
                      columns={columns}
                      data={productList || []}
                      isGlobalFilter={true}
                      isAddUserList={false}
                      totalPages={products?.totalPages}
                      onChangeFunction={(pay, search, searchBy) => {
                        dispatch(onGetProducts(pay, search, searchBy));
                      }}
                      customPageSize={10}
                      divClass="table-responsive mb-1"
                      tableClass="mb-0 align-middle table-borderless"
                      theadClass="table-light text-muted"
                      isProductsFilter={true}
                      SearchPlaceholder="Search for Products..."
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
                <UploadCSV id="products" />
                {/* <div className="card-body">
                  <TabContent className="text-muted">
                    <TabPane>
                      <div
                        id="table-product-list-all"
                        className="table-card gridjs-border-none pb-2"
                      >

                      </div>
                    </TabPane>
                  </TabContent>
                </div> */}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceProducts;
