import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Modal, Form } from "react-bootstrap";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { ADD_COURSE, EDIT_COURSE } from "../redux/types";
import CourseCard from "../components/CourseCard";

function AdminHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.AuthReducer);
  const courses = useSelector((state) => state.CourseReducer.courses);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [tutor, setTutor] = useState("");
  const [prerequisite, setPrerequisite] = useState("");
  const [duration, setDuration] = useState("");
  const [title, setTitle] = useState("");

  const courseToggleHandler = async (id, val) => {
    try {
      await updateDoc(doc(db, "Courses", id), {
        disabled: !val,
      });

      dispatch({
        type: EDIT_COURSE,
        payload: id,
      });
    } catch (error) {
      alert("Somethinf went wrong during update course");
    }
  };

  const setClearState = () => {
    setDescription("");
    setTutor("");
    setPrerequisite("");
    setDuration("");
    setTitle("");
  };

  useEffect(() => {
    if (user.uid === null || !user?.isLoggedIn || !user?.admin) {
      navigate("/admin/signin");
    }
  }, [user]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    let payloadData = {
      title,
      description,
      tutor,
      prerequisite,
      duration,
      disabled: false,
      Enrolled: [],
    };
    try {
      const docRef = await addDoc(collection(db, "Courses"), payloadData);

      let payload = {
        ...payloadData,
        id: docRef.id,
      };
      dispatch({
        type: ADD_COURSE,
        payload,
      });
      setLoading(false);
      setClearState();
      setShowModal(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      console.log("Something went wrong while adding courses");
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
        Add Course
      </Button>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitForm}>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Course Tutor</Form.Label>
              <Form.Control
                type="text"
                value={tutor}
                onChange={(e) => setTutor(e.target.value)}
                placeholder="Course Tutor"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Course Prerequisite</Form.Label>
              <Form.Control
                type="text"
                value={prerequisite}
                onChange={(e) => setPrerequisite(e.target.value)}
                placeholder="Course Prerequisite"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Course Duration</Form.Label>
              <Form.Control
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Course Duration"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={
                loading ||
                !title.trim().length ||
                !duration.trim().length ||
                !description.trim().length ||
                !tutor.trim().length ||
                !prerequisite.trim().length
              }
            >
              {loading ? "...." : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {courses?.length &&
        courses?.map((course) => (
          <CourseCard course={course} courseToggle={courseToggleHandler} />
        ))}
    </>
  );
}

export default AdminHome;
