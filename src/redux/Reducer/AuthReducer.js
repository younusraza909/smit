import { STUDENT_SIGNIN, ADMIN_SIGNIN, LOGOUT } from "../types";

const initialState = {
  uid: null,
  isLoggedIn: false,
  admin: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case STUDENT_SIGNIN: {
      return {
        ...state,
        uid: action.payload,
        isLoggedIn: true,
        admin: false,
      };
    }
    case ADMIN_SIGNIN: {
      return {
        ...state,
        uid: action.payload,
        isLoggedIn: true,
        admin: true,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        uid: null,
        isLoggedIn: false,
        admin: false,
      };
    }

    default:
      return state;
  }
};

export default AuthReducer;
