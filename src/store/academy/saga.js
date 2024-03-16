import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import {
  GET_COURSES,
  DELETE_COURSE,
  GET_ORDERS,
  GET_MANUFACTURERS,
  GET_CUSTOMERS,
  DELETE_ORDER,
  UPDATE_ORDER,
  ADD_NEW_ORDER,
  ADD_NEW_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
  ADD_NEW_COURSE,
  UPDATE_COURSE,
} from "./actionType";

import {
  academyApiResponseSuccess,
  academyApiResponseError,
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
  deleteCourseSuccess,
  deleteCourseFail,
  addCourseSuccess,
  addCourseFail,
  updateCourseSuccess,
  updateCourseFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getCourses as getCoursesApi,
  deleteCourses as deleteCoursesApi,
  getOrders as getOrdersApi,
  getManufacturers as getManufacturersApi,
  getCustomers as getCustomersApi,
  addNewCourse,
  updateCourse,
} from "../../helpers/fakebackend_helper";

function* getCourses() {
  try {
    const response = yield call(getCoursesApi);
    yield put(academyApiResponseSuccess(GET_COURSES, response));
  } catch (error) {
    yield put(academyApiResponseError(GET_COURSES, error));
  }
}

function* deleteCourses({ payload: course }) {
  try {
    const response = yield call(deleteCoursesApi, course);
    yield put(deleteCourseSuccess({ course, ...response }));
    toast.success("Course Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteCourseFail(error));
    window.location.reload();
    // toast.error("Course Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewCourse({ payload: course }) {
  try {
    const response = yield call(addNewCourse, course);
    yield put(addCourseSuccess(response));
    toast.success("Course Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addCourseFail(error));
    // toast.error("Course Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateCourse({ payload: course }) {
  try {
    const response = yield call(updateCourse, course);
    yield put(updateCourseSuccess(response));
    toast.success("Course Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateCourseFail(error));
    // toast.error("Course Update Failed", { autoClose: 3000 });
  }
}

export function* watchGetCourses() {
  yield takeEvery(GET_COURSES, getCourses);
}

export function* watchDeleteCourses() {
  yield takeEvery(DELETE_COURSE, deleteCourses);
}

export function* watchUpdateCourse() {
  yield takeEvery(UPDATE_COURSE, onUpdateCourse);
}

export function* watchAddNewCourse() {
  yield takeEvery(ADD_NEW_COURSE, onAddNewCourse);
}

function* academySaga() {
  yield all([
    fork(watchGetCourses),
    fork(watchDeleteCourses),
    fork(watchUpdateCourse),
    fork(watchAddNewCourse),
  ]);
}

export default academySaga;
