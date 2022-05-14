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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
function StudentSignUp() {
  let navigate = useNavigate();
  const user = useSelector((state) => state?.AuthReducer);
  const emailFilter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user?.uid && user?.admin) {
      navigate("/admin/home");
    } else if (user?.uid && !user?.admin) {
      navigate("/student/home");
    }
  }, []);

  const onSubmitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (emailFilter.test(email)) {
      try {
        const q = query(
          collection(db, "registeredStudents"),
          where("code", "==", code),
          where("cnic", "==", cnic)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot?.docs?.length === 0) {
          setLoading(false);
          alert("No Data with this code or cnic found");
        } else {
          createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
              // Signed in
              const user = userCredential.user;
              // ...Add In DB
              try {
                await setDoc(doc(db, "StudentAccounts", user?.uid), {
                  cnic,
                  code,
                  name,
                  email,
                });
                navigate("/student/signin");
                setLoading(false);
              } catch (error) {
                alert("Something went wrong while registeration");
                setLoading(false);
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
              console.log("errorMessage", errorMessage);
              alert(errorMessage);
              setLoading(false);
            });
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      alert("Invalid Email Format");
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
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="test"
              placeholder="Username"
            />
            <Form.Text className="text-muted">Atleast 8 Characters</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <Form.Text className="text-muted">Atleast 8 Characters</Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={
              loading ||
              email.trim().length === 0 ||
              password.trim().length < 8 ||
              code.trim().length === 0 ||
              cnic.trim().length === 0 ||
              name.trim().length === 0
            }
          >
            {loading ? "...." : "Submit"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default StudentSignUp;
