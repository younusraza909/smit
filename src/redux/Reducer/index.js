import { combineReducers } from "redux";
import FeedReducer from "./FeedReducer";
import AuthReducer from "./AuthReducer";
import CourseReducer from "./CourseReducer";

export const reducer = combineReducers({
  state: (state = {}) => state,
  FeedReducer,
  AuthReducer,
  CourseReducer,
});
