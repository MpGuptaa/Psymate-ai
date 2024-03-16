import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecoomerce Redux States
import {
  GET_ASSESSMENTS,
  DELETE_ASSESSMENT,
  ADD_NEW_ASSESSMENT,
  UPDATE_ASSESSMENT,
} from "./actionType";

import {
  labApiResponseSuccess,
  labApiResponseError,
  deleteAssessmentSuccess,
  deleteAssessmentFail,
  addAssessmentFail,
  updateAssessmentFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getAssessments as getAssessmentsApi,
  deleteAssessments as deleteAssessmentsApi,
  addNewAssessment,
  updateAssessment,
} from "../../helpers/fakebackend_helper";

function* getAssessments({ page, search, searchBy }) {
  try {
    const response = yield call(getAssessmentsApi, page, search, searchBy);
    yield put(labApiResponseSuccess(GET_ASSESSMENTS, response));
  } catch (error) {
    yield put(labApiResponseError(GET_ASSESSMENTS, error));
  }
}

function* deleteAssessments({ payload: assessment }) {
  try {
    const response = yield call(deleteAssessmentsApi, assessment);
    yield put(deleteAssessmentSuccess({ assessment, ...response }));
    toast.success("Assessment Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteAssessmentFail(error));
    toast.error("Assessment Delete Failed", { autoClose: 3000 });
  }
}

function* onAddNewAssessment({ payload: assessment }) {
  try {
    const response = yield call(addNewAssessment, assessment);
    console.log(response);
    toast.success("Assessment Added Successfully", { autoClose: 3000 });
  } catch (error) {
    console.log(error);
    yield put(addAssessmentFail(error));
    toast.error("Assessment Addition Failed", { autoClose: 3000 });
  }
}

function* onUpdateAssessment({ payload: assessment }) {
  try {
    const response = yield call(updateAssessment, assessment);
    toast.success("Assessment Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateAssessmentFail(error));
    toast.error("Assessment Updation Failed", { autoClose: 3000 });
  }
}

export function* watchGetAssessments() {
  yield takeEvery(GET_ASSESSMENTS, getAssessments);
}

export function* watchDeleteAssessments() {
  yield takeEvery(DELETE_ASSESSMENT, deleteAssessments);
}

export function* watchUpdateAssessment() {
  yield takeEvery(UPDATE_ASSESSMENT, onUpdateAssessment);
}
export function* watchAddNewAssessment() {
  yield takeEvery(ADD_NEW_ASSESSMENT, onAddNewAssessment);
}

function* labSaga() {
  yield all([
    fork(watchGetAssessments),
    fork(watchDeleteAssessments),
    fork(watchUpdateAssessment),
    fork(watchAddNewAssessment),
  ]);
}

export default labSaga;
