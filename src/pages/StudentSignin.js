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
import { STUDENT_SIGNIN } from "../redux/types";

import { useNavigate } from "react-router-dom";

function StudentSignin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cnic, setCnic] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    const q = query(
      collection(db, "StudentAccounts"),
      where("code", "==", code),
      where("cnic", "==", cnic)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot?.docs?.length === 0) {
      setLoading(false);
      alert("No records found with this code or cnic");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("user", user);
          // ...
          dispatch({
            type: STUDENT_SIGNIN,
            payload: user.uid,
          });
          navigate("/student/home");
          setLoading(false);
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
          <Form.Group className="mb-3" controlId="formBasicCode">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code"
            />
            <Form.Text className="text-muted">
              Your Code will be provided by administration
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCode">
            <Form.Label>CNIC</Form.Label>
            <Form.Control
              type="number"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              placeholder="CNIC"
            />
            <Form.Text className="text-muted">Your Registered CNIC</Form.Text>
          </Form.Group>
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
              code.trim().length === 0 ||
              cnic.trim().length === 0 ||
              email.trim().length === 0 ||
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

export default StudentSignin;
