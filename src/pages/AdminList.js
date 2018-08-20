import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Modal, Form, Table } from "react-bootstrap";
import { collection, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ADD_ADMIN } from "../redux/types";
import { createUserWithEmailAndPassword } from "firebase/auth";

function AdminList() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.AuthReducer?.uid);
  const adminsArr = useSelector((state) => state.AdminReducer.admins);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailFilter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await setDoc(doc(db, "AdminAccounts", user?.uid), {
            name,
            email,
          });

          dispatch({
            type: ADD_ADMIN,
            payload: {
              name,
              email,
              id: user?.uid,
            },
          });
          setLoading(false);
          setShowModal(false);
          setName("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          console.log("error", error);
          alert("Something went wrong while adding admin");
          setLoading(false);
          setShowModal(false);
          setName("");
          setEmail("");
          setPassword("");
        });
    } catch (error) {
      console.log("error", error);
      alert("Something went wrong while adding admin");
      setLoading(false);
      setShowModal(false);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <>
      <Button
        className="m-3"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Add Admin
      </Button>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitForm}>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Admin Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Admin Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Set Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set Password"
              />
              <Form.Text>Should be atleast 8 character long</Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={
                loading ||
                name.trim().length === 0 ||
                password.trim().length < 8 ||
                !emailFilter.test(email)
              }
            >
              {loading ? "...." : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {adminsArr && adminsArr?.length && (
        <div style={{ width: "60rem", margin: "40px auto" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>UID</th>
              </tr>
            </thead>
            <tbody>
              {adminsArr.map((admin) => {
                if (admin?.id !== user) {
                  console.log("user", user);
                  return (
                    <tr>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.id}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

export default AdminList;
