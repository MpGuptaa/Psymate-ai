import {
  GET_DATAS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  DELETE_DATA,
  DELETE_DATA_SUCCESS,
  DELETE_DATA_FAIL,
  ADD_NEW_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
  UPDATE_DATA,
  UPDATE_DATA_SUCCESS,
  UPDATE_DATA_FAIL,
} from "./actionType";

// common success
export const adminApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const adminApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getDatas = (collection, page, search, searchBy) => ({
  collection,
  page: page,
  search: search,
  searchBy: searchBy,
  type: GET_DATAS,
});

export const deleteDatas = (collection, search, searchBy) => ({
  type: DELETE_DATA,
  collection,
  search,
  searchBy,
});

export const deleteDataSuccess = (data) => ({
  type: DELETE_DATA_SUCCESS,
  payload: data,
});

export const deleteDataFail = (error) => ({
  type: DELETE_DATA_FAIL,
  payload: error,
});

export const updateData = (collection, search, searchBy, data) => ({
  type: UPDATE_DATA,
  collection,
  search,
  searchBy,
  data,
});

export const updateDataSuccess = (data) => ({
  type: UPDATE_DATA_SUCCESS,
  payload: data,
});

export const updateDataFail = (error) => ({
  type: UPDATE_DATA_FAIL,
  payload: error,
});

export const addNewData = (collection, data) => ({
  type: ADD_NEW_DATA,
  payload: data,
  collection,
});

export const addDataSuccess = (data) => ({
  type: ADD_DATA_SUCCESS,
  payload: data,
});

export const addDataFail = (error) => ({
  type: ADD_DATA_FAIL,
  payload: error,
});
