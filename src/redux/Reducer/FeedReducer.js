import { GET_FEEDS } from "../types";

const initialState = {
  feeds: [],
};

const FeedReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FEEDS: {
      return {
        ...state,
        feeds: action.payload,
      };
    }

    default:
      return state;
  }
};

export default FeedReducer;
