import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { EDIT_PROFILE } from "./actionTypes";
import { profileSuccess, profileError } from "./actions";
//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeProfile,
  postJwtProfile,
} from "../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";

const fireBaseBackend = getFirebaseBackend();

function* editProfile({ payload: { user } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.editProfileAPI,
        user.username,
        user.idx
      );
      yield put(profileSuccess(response));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtProfile, "/post-jwt-profile", {
        username: user.username,
        id: user.idx,
      });
      yield put(profileSuccess(response));
    } else if (process.env.REACT_APP_API_URL) {
      const response = yield call(postFakeProfile, {
        data: user,
        credential: user._id,
      });

      yield put(profileSuccess({ data: response.data[0] }));
      toast.success("Profile Updated");
    }
  } catch (error) {
    yield put(profileError(error));
    toast.error("Profile Not Updated");
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;
