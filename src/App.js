import React, { useEffect } from "react";
import { db } from "./firebase";
import { Routes, Route } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import Feed from "./pages/Feed";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { GET_FEEDS, GET_COURSES } from "./redux/types";
import NavbarComponent from "./components/NavbarComponent";
import StudentSignin from "./pages/StudentSignin";
import StudentSignUp from "./pages/StudentSignUp";
import StudentHome from "./pages/StudentHome";
import AdminSignin from "./pages/AdminSignin";
import AdminHome from "./pages/AdminHome";

function App() {
  const dispatch = useDispatch();
  const feeds = useSelector((state) => state?.FeedReducer?.feeds);

  const getData = async () => {
    const feedExist = await getDocs(collection(db, "feeds"));
    let feedsArr = [];
    if (!!feedExist?.docs.length) {
      feedExist.docs.forEach((feed) => {
        feedsArr.push({ ...feed.data(), id: feed.id });
      });

      dispatch({
        type: GET_FEEDS,
        payload: feedsArr,
      });
    }
  };

  const getCourses = async () => {
    const courses = await getDocs(collection(db, "Courses"));
    let coursesArr = [];
    if (!!courses?.docs.length) {
      courses.docs.forEach((course) => {
        console.log("course", course);
        coursesArr.push({ ...course.data(), id: course.id, Enrolled: [] });
      });

      dispatch({
        type: GET_COURSES,
        payload: coursesArr,
      });
    }
  };

  useEffect(() => {
    getData();
    getCourses();
  }, []);

  return (
    <div>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Feed feedsData={feeds} />} />
        <Route path="/student/signin" element={<StudentSignin />} />
        <Route path="/student/signup" element={<StudentSignUp />} />
        <Route path="/student/home" element={<StudentHome />} />
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </div>
  );
}

export default App;
