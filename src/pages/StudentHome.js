import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import { UPDATE_COURSE } from "../redux/types";
import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import CourseCardStudent from "../components/CourseCardStudent";

function StudentHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.AuthReducer);
  const courses = useSelector((state) => state.CourseReducer.courses);
  const [selectdCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [qualification, setQualification] = useState("");

  const emailFilter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  const formToggleHadler = (id) => {
    setSelectedCourse(id);
    setShowModal(true);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      let courseDB = await getDoc(doc(db, "Courses", selectdCourse));
      let course = { ...courseDB.data() };
      let payloadToPush = {
        name,
        address,
        phoneNumber: phone,
        email,
        qualification,
        id: user?.uid,
      };
      await setDoc(doc(db, "Courses", selectdCourse), course);

      dispatch({
        type: UPDATE_COURSE,
        payload: {
          id: selectdCourse,
          course: { ...course, id: courseDB?.id },
        },
      });

      setLoading(false);
      setShowModal(false);
      setSelectedCourse(null);
      clearState();
    } catch (error) {
      console.log("Error", error);
      alert("Something went wrong");
      setLoading(false);
      setShowModal(false);
      setSelectedCourse(null);
      clearState();
    }
  };

  useEffect(() => {
    if (user.uid === null || !user?.isLoggedIn || user?.admin) {
      navigate("/student/signin");
    }
  }, [user]);

  const clearState = () => {
    setAddress("");
    setName("");
    setPhoneNumber("");
    setQualification("");
    setEmail("");
  };

  return (
    <>
      {courses.length > 0 &&
        courses.map((course) => (
          <CourseCardStudent
            course={course}
            formToggle={formToggleHadler}
            userId={user?.uid}
          />
        ))}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Course Admission Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitForm}>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adress"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Qualification</Form.Label>
              <Form.Control
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Qualification"
              />
            </Form.Group>

            <Button
              disabled={
                loading ||
                name.trim().length === 0 ||
                address.trim().length === 0 ||
                qualification.trim().length === 0 ||
                phone.trim().length === 0 ||
                !emailFilter.test(email)
              }
              variant="primary"
              type="submit"
            >
              {loading ? "...." : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default StudentHome;
