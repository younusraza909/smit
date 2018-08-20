import { GET_ADMINS, ADD_ADMIN } from "../types";

const initialState = {
  admins: [],
};

const AdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ADMIN: {
      return {
        ...state,
        admins: [...state?.admins, action?.payload],
      };
    }
    case GET_ADMINS: {
      return {
        ...state,
        admins: action?.payload,
      };
    }

    default:
      return state;
  }
};

export default AdminReducer;
