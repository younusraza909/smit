import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { NavLink, useLocation, Link } from "react-router-dom";
import classes from "./style.module.css";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../redux/types";

function NavbarComponent() {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [show, setShow] = useState(false);
  const courses = useSelector((state) => state?.CourseReducer?.courses);
  const leaves = useSelector((state) => state?.LeaveReducer?.leaves);

  const adminsArr = useSelector((state) => state.AdminReducer.admins);
  const location = useLocation();

  const onLogoutHandler = () => {
    dispatch({
      type: LOGOUT,
    });
  };
  useEffect(() => {
    let path = location?.pathname?.split("/");
    if (path?.[1] === "admin" && path?.[2] !== "signin") {
      setShow(true);
      setIsAdmin(true);
    } else if (path?.[1] === "student" && path?.[2] !== "signin") {
      setShow(true);
      setIsAdmin(false);
    } else {
      setShow(false);
      setIsAdmin(false);
    }
  }, [location?.pathname]);

  return (
    <Navbar bg="primary" variant="dark">
      {!show && (
        <Container>
          <Nav className="m-left">
            <Button variant="light" style={{ margin: "0 10px" }}>
              <Link to="/admin/signin" style={{ textDecoration: "none" }}>
                Admin Login
              </Link>
            </Button>
          </Nav>

          <Navbar.Brand to="/" as={NavLink}>
            SMIT PORTAL
          </Navbar.Brand>
          <Nav className="m-right">
            <Button variant="light" style={{ margin: "0 10px" }}>
              <Link to="/student/signin" style={{ textDecoration: "none" }}>
                Signin
              </Link>
            </Button>

            <Button variant="light">
              <Link to="/student/signup" style={{ textDecoration: "none" }}>
                Signup
              </Link>
            </Button>
          </Nav>
        </Container>
      )}
      {show && isAdmin && (
        <Container>
          <Button variant="light">
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              onClick={onLogoutHandler}
            >
              LOGOUT
            </Link>
          </Button>
          <Navbar.Brand to="/" as={NavLink}>
            SMIT ADMIN PORTAL
          </Navbar.Brand>
          <Nav className="m-right">
            <Nav.Link as={NavLink} to="/admin/home" exact>
              Courses
              <span className={classes?.capsule}>{courses.length || 0}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/students" exact>
              Students
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/leaves" exact>
              Leaves
              <span className={classes?.capsule}>{leaves.length || 0}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/adminList" exact>
              Admins
              <span className={classes?.capsule}>{adminsArr.length || 0}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/settings" exact>
              Settings
            </Nav.Link>
          </Nav>
        </Container>
      )}
      {show && !isAdmin && (
        <Container>
          <Button variant="light" onClick={onLogoutHandler}>
            <Link to="/" style={{ textDecoration: "none" }}>
              LOGOUT
            </Link>
          </Button>
          <Navbar.Brand to="/" as={NavLink}>
            SMIT STUDENT PORTAL
          </Navbar.Brand>
          <Nav className="m-right">
            <Nav.Link as={NavLink} to="/student/home" exact>
              Courses
              <span className={classes?.capsule}>{courses.length || 0}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/student/leaves" exact>
              Leaves
              <span className={classes?.capsule}>{leaves.length || 0}</span>
            </Nav.Link>
          </Nav>
        </Container>
      )}
    </Navbar>
  );
}

export default NavbarComponent;
