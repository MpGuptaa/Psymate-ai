import {
  GET_TOOLS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  DELETE_TOOL,
  DELETE_TOOL_SUCCESS,
  DELETE_TOOL_FAIL,
  ADD_NEW_TOOL,
  ADD_TOOL_SUCCESS,
  ADD_TOOL_FAIL,
  UPDATE_TOOL,
  UPDATE_TOOL_SUCCESS,
  UPDATE_TOOL_FAIL,
} from "./actionType";

// common success
export const toolApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const toolApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getTools = (page, search, searchBy) => ({
  page: page,
  search: search,
  searchBy: searchBy,
  type: GET_TOOLS,
});

export const deleteTools = (tool) => ({
  type: DELETE_TOOL,
  payload: tool,
});

export const deleteToolSuccess = (tool) => ({
  type: DELETE_TOOL_SUCCESS,
  payload: tool,
});

export const deleteToolFail = (error) => ({
  type: DELETE_TOOL_FAIL,
  payload: error,
});

export const updateTool = (tool) => ({
  type: UPDATE_TOOL,
  payload: tool,
});

export const updateToolSuccess = (tool) => ({
  type: UPDATE_TOOL_SUCCESS,
  payload: tool,
});

export const updateToolFail = (error) => ({
  type: UPDATE_TOOL_FAIL,
  payload: error,
});

export const addNewTool = (tool) => ({
  type: ADD_NEW_TOOL,
  payload: tool,
});

export const addToolSuccess = (tool) => ({
  type: ADD_TOOL_SUCCESS,
  payload: tool,
});

export const addToolFail = (error) => ({
  type: ADD_TOOL_FAIL,
  payload: error,
});
