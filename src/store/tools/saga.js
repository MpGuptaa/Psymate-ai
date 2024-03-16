import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import { GET_TOOLS, DELETE_TOOL, ADD_NEW_TOOL, UPDATE_TOOL } from "./actionType";

import {
  toolApiResponseSuccess,
  toolApiResponseError,
  deleteToolSuccess,
  deleteToolFail,
  addToolFail,
  updateToolFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getTools as getToolsApi,
  deleteTools as deleteToolsApi,
  addNewTool,
  updateTool,
} from "../../helpers/fakebackend_helper";

function* getTools({ page, search, searchBy }) {
  try {
    const response = yield call(getToolsApi, page, search, searchBy);
    yield put(toolApiResponseSuccess(GET_TOOLS, response));
  } catch (error) {
    yield put(toolApiResponseError(GET_TOOLS, error));
  }
}

function* deleteTools({ payload: tool }) {
  try {
    const response = yield call(deleteToolsApi, tool);
    yield put(deleteToolSuccess({ tool, ...response }));
    toast.success("Tool Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteToolFail(error));
    toast.error("Tool Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewTool({ payload: tool }) {
  try {
    const response = yield call(addNewTool, tool);
    console.log(response);
    toast.success("Tool Added Successfully", { autoClose: 3000 });
  } catch (error) {
    console.log(error);
    yield put(addToolFail(error));
    toast.error("Tool Addition Failed", { autoClose: 3000 });
  }
}

function* onUpdateTool({ payload: tool }) {
  try {
    const response = yield call(updateTool, tool);
    toast.success("Tool Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateToolFail(error));
    toast.error("Tool Updation Failed", { autoClose: 3000 });
  }
}

export function* watchGetTools() {
  yield takeEvery(GET_TOOLS, getTools);
}

export function* watchDeleteTools() {
  yield takeEvery(DELETE_TOOL, deleteTools);
}

export function* watchUpdateTool() {
  yield takeEvery(UPDATE_TOOL, onUpdateTool);
}

export function* watchAddNewTool() {
  yield takeEvery(ADD_NEW_TOOL, onAddNewTool);
}

function* toolSaga() {
  yield all([fork(watchGetTools), fork(watchDeleteTools), fork(watchUpdateTool), fork(watchAddNewTool)]);
}

export default toolSaga;
