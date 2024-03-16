import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import {
  GET_PRODUCTS,
  DELETE_PRODUCT,
  GET_ORDERS,
  GET_MANUFACTURERS,
  GET_CUSTOMERS,
  DELETE_ORDER,
  UPDATE_ORDER,
  ADD_NEW_ORDER,
  ADD_NEW_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
  ADD_NEW_PRODUCT,
  UPDATE_PRODUCT,
  ADD_NEW_SALT,
  GET_SALTS,
  DELETE_SALT,
  UPDATE_SALT,
} from "./actionType";

import {
  ecommerceApiResponseSuccess,
  ecommerceApiResponseError,
  deleteOrderSuccess,
  deleteOrderFail,
  updateOrderSuccess,
  updateOrderFail,
  addOrderSuccess,
  addOrderFail,
  addCustomerFail,
  addCustomerSuccess,
  updateCustomerSuccess,
  updateCustomerFail,
  deleteCustomerSuccess,
  deleteCustomerFail,
  deleteProductSuccess,
  deleteProductFail,
  addProductSuccess,
  addProductFail,
  updateProductSuccess,
  updateProductFail,
  addSaltSuccess,
  addSaltFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getProducts as getProductsApi,
  getSalts as getSaltsApi,
  deleteProducts as deleteProductsApi,
  deleteSalts as deleteSaltsApi,
  getOrders as getOrdersApi,
  getManufacturers as getManufacturersApi,
  getCustomers as getCustomersApi,
  updateOrder,
  deleteOrder,
  addNewOrder,
  addNewCustomer,
  updateCustomer,
  deleteCustomer,
  addNewProduct,
  updateProduct,
  addNewSalt,
  updateSalt,
} from "../../helpers/fakebackend_helper";

function* getProducts({ page, search, searchBy }) {
  try {
    const response = yield call(getProductsApi, page, search, searchBy);
    yield put(ecommerceApiResponseSuccess(GET_PRODUCTS, response));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_PRODUCTS, error));
  }
}

function* getSalts({ payload }) {
  try {
    const response = yield call(getSaltsApi, payload);
    yield put(ecommerceApiResponseSuccess(GET_SALTS, response));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_SALTS, error));
  }
}
function* getOrders({ payload }) {
  try {
    const response = yield call(getOrdersApi, payload);
    yield put(ecommerceApiResponseSuccess(GET_ORDERS, response));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_ORDERS, error));
  }
}

function* getManufacturers() {
  try {
    const response = yield call(getManufacturersApi);
    yield put(ecommerceApiResponseSuccess(GET_MANUFACTURERS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_MANUFACTURERS, error));
  }
}

function* getCustomers() {
  try {
    const response = yield call(getCustomersApi);
    yield put(ecommerceApiResponseSuccess(GET_CUSTOMERS, response.data));
  } catch (error) {
    yield put(ecommerceApiResponseError(GET_CUSTOMERS, error));
  }
}

function* deleteProducts({ payload: product }) {
  try {
    const response = yield call(deleteProductsApi, product);
    yield put(deleteProductSuccess({ product, ...response }));
    toast.success("Product Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteProductFail(error));
    toast.error("Product Delete Failed", { autoClose: 3000 });
  }
}
function* deleteSalts({ payload: product }) {
  try {
    const response = yield call(deleteSaltsApi, product);
    toast.success("Product Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteProductFail(error));
    toast.error("Product Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewProduct({ payload: product }) {
  try {
    const response = yield call(addNewProduct, product);
    console.log(response);
    toast.success("Product Added Successfully", { autoClose: 3000 });
  } catch (error) {
    console.log(error);
    yield put(addProductFail(error));
    toast.error("Product Addition Failed", { autoClose: 3000 });
  }
}

function* onaddNewSalt({ payload: product }) {
  try {
    const response = yield call(addNewSalt, product);
    yield put(addSaltSuccess(response));
    toast.success("salt Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addSaltFail(error));
    toast.error("salt Addition Failed", { autoClose: 3000 });
  }
}
function* onUpdateProduct({ payload: product }) {
  try {
    const response = yield call(updateProduct, product);
    toast.success("Product Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateProductFail(error));
    toast.error("Product Updation Failed", { autoClose: 3000 });
  }
}
function* onUpdateSalt({ payload: product }) {
  try {
    const response = yield call(updateSalt, product);
    toast.success("Product Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    toast.error("Product Updation Failed", { autoClose: 3000 });
  }
}

function* onUpdateOrder({ payload: order }) {
  try {
    const response = yield call(updateOrder, order);
    yield put(updateOrderSuccess(response));
    toast.success("Order Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateOrderFail(error));
    toast.error("Order Update Failed", { autoClose: 3000 });
  }
}

function* onDeleteOrder({ payload: order }) {
  try {
    const response = yield call(deleteOrder, order);
    yield put(deleteOrderSuccess({ order, ...response }));
    toast.success("Order Deleted Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteOrderFail(error));
    toast.error("Order Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewOrder({ payload: order }) {
  try {
    const response = yield call(addNewOrder, order);
    yield put(addOrderSuccess(response));
    toast.success("Order Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addOrderFail(error));
    toast.error("Order Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateCustomer({ payload: customer }) {
  try {
    const response = yield call(updateCustomer, customer);
    yield put(updateCustomerSuccess(response));
    toast.success("Customer Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateCustomerFail(error));
    toast.error("Customer Update Failed", { autoClose: 3000 });
  }
}

function* onDeleteCustomer({ payload: customer }) {
  try {
    const response = yield call(deleteCustomer, customer);
    yield put(deleteCustomerSuccess({ customer, ...response }));
    toast.success("Customer Deleted Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteCustomerFail(error));
    toast.error("Customer Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewCustomer({ payload: customer }) {
  try {
    const response = yield call(addNewCustomer, customer);
    yield put(addCustomerSuccess(response));
    toast.success("Customer Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addCustomerFail(error));
    toast.error("Customer Added Failed", { autoClose: 3000 });
  }
}

export function* watchGetProducts() {
  yield takeEvery(GET_PRODUCTS, getProducts);
}

export function* watchGetSalts() {
  yield takeEvery(GET_SALTS, getSalts);
}

export function* watchDeleteProducts() {
  yield takeEvery(DELETE_PRODUCT, deleteProducts);
}
export function* watchDeleteSalts() {
  yield takeEvery(DELETE_SALT, deleteSalts);
}

export function* watchGetOrders() {
  yield takeEvery(GET_ORDERS, getOrders);
}

export function* watchGetManufacturers() {
  yield takeEvery(GET_MANUFACTURERS, getManufacturers);
}

export function* watchGetCustomers() {
  yield takeEvery(GET_CUSTOMERS, getCustomers);
}

export function* watchUpdateOrder() {
  yield takeEvery(UPDATE_ORDER, onUpdateOrder);
}

export function* watchDeleteOrder() {
  yield takeEvery(DELETE_ORDER, onDeleteOrder);
}

export function* watchAddNewOrder() {
  yield takeEvery(ADD_NEW_ORDER, onAddNewOrder);
}

export function* watchUpdateCustomer() {
  yield takeEvery(UPDATE_CUSTOMER, onUpdateCustomer);
}

export function* watchDeleteCustomer() {
  yield takeEvery(DELETE_CUSTOMER, onDeleteCustomer);
}

export function* watchAddNewCustomer() {
  yield takeEvery(ADD_NEW_CUSTOMER, onAddNewCustomer);
}

export function* watchUpdateProduct() {
  yield takeEvery(UPDATE_PRODUCT, onUpdateProduct);
}
export function* watchUpdateSalt() {
  yield takeEvery(UPDATE_SALT, onUpdateSalt);
}
export function* watchAddNewProduct() {
  yield takeEvery(ADD_NEW_PRODUCT, onAddNewProduct);
}
export function* watchaddNewSalt() {
  yield takeEvery(ADD_NEW_SALT, onaddNewSalt);
}

function* ecommerceSaga() {
  yield all([
    fork(watchGetProducts),
    fork(watchGetSalts),
    fork(watchDeleteProducts),
    fork(watchDeleteSalts),
    fork(watchGetOrders),
    fork(watchGetManufacturers),
    fork(watchGetCustomers),
    fork(watchDeleteOrder),
    fork(watchUpdateOrder),
    fork(watchAddNewOrder),
    fork(watchDeleteCustomer),
    fork(watchUpdateCustomer),
    fork(watchAddNewCustomer),
    fork(watchUpdateProduct),
    fork(watchUpdateSalt),
    fork(watchAddNewProduct),
    fork(watchaddNewSalt),
  ]);
}

export default ecommerceSaga;
