import {
  GET_ASSESSMENTS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  DELETE_ASSESSMENT,
  DELETE_ASSESSMENT_SUCCESS,
  DELETE_ASSESSMENT_FAIL,
  ADD_NEW_ASSESSMENT,
  ADD_ASSESSMENT_SUCCESS,
  ADD_ASSESSMENT_FAIL,
  UPDATE_ASSESSMENT,
  UPDATE_ASSESSMENT_SUCCESS,
  UPDATE_ASSESSMENT_FAIL,
} from "./actionType";

// common success
export const labApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const labApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getAssessments = (page, search, searchBy) => ({
  page: page,
  search: search,
  searchBy: searchBy,
  type: GET_ASSESSMENTS,
});

export const deleteAssessments = (assessment) => ({
  type: DELETE_ASSESSMENT,
  payload: assessment,
});

export const deleteAssessmentSuccess = (assessment) => ({
  type: DELETE_ASSESSMENT_SUCCESS,
  payload: assessment,
});

export const deleteAssessmentFail = (error) => ({
  type: DELETE_ASSESSMENT_FAIL,
  payload: error,
});

export const updateAssessment = (assessment) => ({
  type: UPDATE_ASSESSMENT,
  payload: assessment,
});

export const updateAssessmentSuccess = (assessment) => ({
  type: UPDATE_ASSESSMENT_SUCCESS,
  payload: assessment,
});

export const updateAssessmentFail = (error) => ({
  type: UPDATE_ASSESSMENT_FAIL,
  payload: error,
});

export const addNewAssessment = (assessment) => ({
  type: ADD_NEW_ASSESSMENT,
  payload: assessment,
});

export const addAssessmentSuccess = (assessment) => ({
  type: ADD_ASSESSMENT_SUCCESS,
  payload: assessment,
});

export const addAssessmentFail = (error) => ({
  type: ADD_ASSESSMENT_FAIL,
  payload: error,
});
