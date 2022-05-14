import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function StudentHome() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.AuthReducer);

  console.log("user", user);

  useEffect(() => {
    if (user.uid === null || !user?.isLoggedIn || user?.admin) {
      navigate("/student/signin");
    }
  }, [user]);

  return <div>StudentHome</div>;
}

export default StudentHome;
