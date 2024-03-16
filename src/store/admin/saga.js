import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import { GET_DATAS, DELETE_DATA, ADD_NEW_DATA, UPDATE_DATA } from "./actionType";

import {
  adminApiResponseSuccess,
  adminApiResponseError,
  deleteDataSuccess,
  deleteDataFail,
  addDataFail,
  updateDataFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getDatas as getDatasApi,
  deleteData as deleteDatasApi,
  addNewData,
  updateData,
} from "../../helpers/fakebackend_helper";

function* getDatas({ collection, page, search, searchBy }) {
  try {
    const response = yield call(getDatasApi, collection, page, search, searchBy);
    yield put(adminApiResponseSuccess(GET_DATAS, response));
  } catch (error) {
    yield put(adminApiResponseError(GET_DATAS, error));
  }
}

function* deleteDatas({ collection, search, searchBy }) {
  try {
    const response = yield call(deleteDatasApi, collection, search, searchBy);
    yield put(deleteDataSuccess({ ...response }));
    toast.success("Data Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteDataFail(error));
    toast.error("Data Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewData({ collection, payload: data }) {
  console.log(collection);
  try {
    const response = yield call(addNewData, collection, data);
    toast.success("Data Added Successfully", { autoClose: 3000 });
  } catch (error) {
    console.log(error);
    yield put(addDataFail(error));
    toast.error("Data Addition Failed", { autoClose: 3000 });
  }
}

function* onUpdateData({ collection, search, searchBy, data }) {
  try {
    const response = yield call(updateData, collection, search, searchBy, data);
    toast.success("Data Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateDataFail(error));
    toast.error("Data Updation Failed", { autoClose: 3000 });
  }
}

export function* watchGetDatas() {
  yield takeEvery(GET_DATAS, getDatas);
}

export function* watchDeleteDatas() {
  yield takeEvery(DELETE_DATA, deleteDatas);
}

export function* watchUpdateData() {
  yield takeEvery(UPDATE_DATA, onUpdateData);
}
export function* watchAddNewData() {
  yield takeEvery(ADD_NEW_DATA, onAddNewData);
}

function* adminSaga() {
  yield all([fork(watchGetDatas), fork(watchDeleteDatas), fork(watchUpdateData), fork(watchAddNewData)]);
}

export default adminSaga;
