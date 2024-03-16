import {
  GET_PRESCRIPTIONS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  ADD_PRESCRIPTION_SUCCESS,
  ADD_PRESCRIPTION_FAIL,
  UPDATE_PRESCRIPTION_SUCCESS,
  UPDATE_PRESCRIPTION_FAIL,
  DELETE_PRESCRIPTION_SUCCESS,
  DELETE_PRESCRIPTION_FAIL,
} from "./actionType";

const INIT_STATE = {
  prescriptions: [],
  error: {},
};

const Prescription = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_PRESCRIPTIONS:
          return {
            ...state,
            prescriptions: action.payload.data,
            isPrescriptionCreated: false,
            isPrescriptionSuccess: true
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_PRESCRIPTIONS:
          return {
            ...state,
            error: action.payload.error,
            isPrescriptionCreated: false,
            isPrescriptionSuccess: false
          };
        default:
          return { ...state };
      }

    case ADD_PRESCRIPTION_SUCCESS:
      return {
        ...state,
        isPrescriptionCreated: true,
        prescriptions: [...state.prescriptions, action.payload.data],
      };

    case ADD_PRESCRIPTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PRESCRIPTION_SUCCESS:
      return {
        ...state,
        prescriptions: state.prescriptions.map(prescription =>
          prescription._id.toString() === action.payload.data._id.toString()
            ? { ...prescription, ...action.payload.data }
            : prescription
        ),
      };

    case UPDATE_PRESCRIPTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PRESCRIPTION_SUCCESS:
      return {
        ...state,
        prescriptions: state.prescriptions.filter(
          prescription => prescription._id.toString() !== action.payload.prescription.toString()
        ),
        isPrescriptionDelete: true,
        isPrescriptionDeleteFail: false,
      };

    case DELETE_PRESCRIPTION_FAIL:
      return {
        ...state,
        error: action.payload,
        isPrescriptionDelete: false,
        isPrescriptionDeleteFail: true,
      };

    default:
      return { ...state };
  }
};

export default Prescription;