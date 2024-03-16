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

const INIT_STATE = {
  tools: [],
  error: {},
};

const Tools = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_TOOLS:
          return {
            ...state,
            tools: action.payload.data,
          };

        case DELETE_TOOL:
          return {
            ...state,
            tools: state,
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_TOOLS:
          return {
            ...state,
            error: action.payload.error,
          };

        case DELETE_TOOL:
          return {
            ...state,
            error: action.payload.error,
          };

        default:
          return { ...state };
      }

    case GET_TOOLS:
      return {
        ...state,
      };

    case DELETE_TOOL:
      return {
        ...state,
      };

    case ADD_TOOL_SUCCESS:
      return {
        ...state,
        tools: [...state, action.payload.data],
      };

    case ADD_TOOL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TOOL_SUCCESS:
      return {
        ...state,
        tools: state.map((tool) =>
          tool._id.toString() === action.payload.data._id.toString()
            ? { ...tool, ...action.payload.data }
            : tool
        ),
      };

    case UPDATE_TOOL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TOOL_SUCCESS:
      return {
        ...state,
        tools: state,
      };

    case DELETE_TOOL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Tools;
