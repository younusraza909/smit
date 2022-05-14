import { setLogLevel } from "firebase/app";
import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { ADMIN_SIGNIN } from "../redux/types";

import { useNavigate } from "react-router-dom";

function AdminSignin() {
  const emailFilter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const q = query(
      collection(db, "AdminAccounts"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot?.docs?.length === 0) {
      setLoading(false);
      alert("No Admin found with this email");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setLoading(false);
          const user = userCredential.user;
          // ...
          dispatch({
            type: ADMIN_SIGNIN,
            payload: user.uid,
          });
          navigate("/admin/home");
        })
        .catch((error) => {
          setLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Unable to signin");
        });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: "50rem", padding: "30px" }}>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={
              loading ||
              email.trim().length === 0 ||
              !emailFilter.test(email) ||
              password.trim().length === 0
            }
          >
            {loading ? "...." : "Submit"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default AdminSignin;
