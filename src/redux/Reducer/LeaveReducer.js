import { GET_LEAVES, ADD_LEAVES, EDIT_LEAVE } from "../types";

const initialState = {
  leaves: [],
};

const LeaveReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LEAVES: {
      return {
        ...state,
        leaves: action.payload,
      };
    }
    case ADD_LEAVES: {
      return {
        ...state,
        leaves: [...state.leaves, action?.payload],
      };
    }
    case EDIT_LEAVE: {
      return {
        ...state,
        leaves: state?.leaves?.map((leave) =>
          leave?.id === action?.payload
            ? { ...leave, status: "accepted" }
            : { ...leave }
        ),
      };
    }

    default:
      return state;
  }
};

export default LeaveReducer;
