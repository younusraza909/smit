import { onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import React, { useState } from "react";
import { Card, Form, Container, Button } from "react-bootstrap";
import { auth } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../redux/types";
import { useNavigate } from "react-router-dom";

function AdminSettings() {
  const [loading, setLoading] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const userUid = useSelector((state) => state?.AuthReducer?.uid);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      onAuthStateChanged(auth, (user) => {
        if (user && user?.uid === userUid) {
          updatePassword(user, password)
            .then((res) => {
              console.log("res", res);
              alert("Password successfully updated!");
              dispatch({
                type: LOGOUT,
              });
              navigate("/admin/signin");
              setLoading(false);
            })
            .catch((e) => {
              console.log("e", e);
              signOut(auth).then(() => {
                dispatch({
                  type: LOGOUT,
                });
                navigate("/admin/signin");
              });
              setLoading(false);
              alert("Something went wrong while changing password");
            });
        } else {
          setLoading(false);
          return alert("User Not SignedIn!");
        }
      });
    } catch (error) {
      console.log("error", error);
      alert("Something went wrong while changing password");
      setLoading(false);
    }
  };

  return (
    <Container>
      {" "}
      <Card style={{ width: "40rem", margin: "40px auto", padding: "20px" }}>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="formBasicCode">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
            />
            <Form.Text>Password should be atleast 8 character long</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCode">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
            />
          </Form.Group>

          <Button
            disabled={
              loading ||
              password.trim()?.length < 8 ||
              password?.trim() !== passwordConfirm.trim()
            }
            type="submit"
          >
            {!loading ? "Change Password" : "....."}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AdminSettings;
