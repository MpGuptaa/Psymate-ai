import {
  GET_COURSES,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  DELETE_COURSE,
  DELETE_COURSE_SUCCESS,
  DELETE_COURSE_FAIL,
  ADD_NEW_COURSE,
  ADD_COURSE_SUCCESS,
  ADD_COURSE_FAIL,
  UPDATE_COURSE,
  UPDATE_COURSE_SUCCESS,
  UPDATE_COURSE_FAIL,
} from "./actionType";

// common success
export const academyApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const academyApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCourses = () => ({
  type: GET_COURSES,
});

export const deleteCourses = (product) => ({
  type: DELETE_COURSE,
  payload: product,
});

export const deleteCourseSuccess = (product) => ({
  type: DELETE_COURSE_SUCCESS,
  payload: product,
});

export const deleteCourseFail = (error) => ({
  type: DELETE_COURSE_FAIL,
  payload: error,
});

export const updateCourse = (product) => ({
  type: UPDATE_COURSE,
  payload: product,
});

export const updateCourseSuccess = (product) => ({
  type: UPDATE_COURSE_SUCCESS,
  payload: product,
});

export const updateCourseFail = (error) => ({
  type: UPDATE_COURSE_FAIL,
  payload: error,
});

export const addNewCourse = (product) => ({
  type: ADD_NEW_COURSE,
  payload: product,
});

export const addCourseSuccess = (product) => ({
  type: ADD_COURSE_SUCCESS,
  payload: product,
});

export const addCourseFail = (error) => ({
  type: ADD_COURSE_FAIL,
  payload: error,
});
