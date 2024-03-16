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

const INIT_STATE = {
  assessments: [],
  error: {},
};

const Lab = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ASSESSMENTS:
          return {
            ...state,
            assessments: action.payload.data,
          };

        case DELETE_ASSESSMENT:
          return {
            ...state,
            assessments: state,
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ASSESSMENTS:
          return {
            ...state,
            error: action.payload.error,
          };

        case DELETE_ASSESSMENT:
          return {
            ...state,
            error: action.payload.error,
          };

        default:
          return { ...state };
      }

    case GET_ASSESSMENTS:
      return {
        ...state,
      };

    case DELETE_ASSESSMENT:
      return {
        ...state,
      };

    case ADD_ASSESSMENT_SUCCESS:
      return {
        ...state,
        assessments: [...state, action.payload.data],
      };

    case ADD_ASSESSMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ASSESSMENT_SUCCESS:
      return {
        ...state,
        assessments: state.map((assessment) =>
          assessment._id.toString() === action.payload.data._id.toString()
            ? { ...assessment, ...action.payload.data }
            : assessment
        ),
      };

    case UPDATE_ASSESSMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ASSESSMENT_SUCCESS:
      return {
        ...state,
        assessments: state,
      };

    case DELETE_ASSESSMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Lab;
