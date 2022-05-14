import { GET_COURSES, ADD_COURSE, EDIT_COURSE } from "../types";

const initialState = {
  courses: [],
};

const CourseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COURSES: {
      return {
        ...state,
        courses: action.payload,
      };
    }
    case ADD_COURSE: {
      return {
        ...state,
        courses: [...state?.courses, action.payload],
      };
    }
    case EDIT_COURSE: {
      return {
        ...state,
        courses: state?.courses?.map((course) =>
          course?.id === action?.payload
            ? { ...course, disabled: !course?.disabled }
            : { ...course }
        ),
      };
    }

    default:
      return state;
  }
};

export default CourseReducer;
