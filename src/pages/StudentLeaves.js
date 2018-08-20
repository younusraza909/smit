import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Modal, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { collection, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ADD_LEAVES } from "../redux/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import LeaveBoxComponent from "../components/LeaveBoxComponent";

function StudentLeaves() {
  const dispatch = useDispatch();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageObj, setImageObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageURLDisplay, setImageURLDisplay] = useState(null);

  const inputRef = useRef();

  const user = useSelector((state) => state?.AuthReducer?.uid);
  const leaves = useSelector((state) => state?.LeaveReducer?.leaves);

  const setClearState = () => {
    setDescription("");
    setTitle("");
    setImageObj(null);
    setImageURLDisplay(null);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data = addDoc(collection(db, "Leaves"), {
        description,
        title,
        image: "",
        status: "pending",
        userUid: user,
      })
        .then((res) => {
          if (imageObj) {
            const imageRef = ref(storage, `leaves/${user}/${res.id}`);

            uploadBytes(imageRef, imageObj)
              .then((snapshot) => {
                getDownloadURL(imageRef).then(async (url) => {
                  await updateDoc(doc(db, "Leaves", res?.id), {
                    image: url,
                  });

                  dispatch({
                    type: ADD_LEAVES,
                    payload: {
                      description,
                      title,
                      image: url,
                      status: "pending",
                      userUid: user,
                    },
                  });
                  setShowLeaveModal(false);
                  setClearState();
                  setLoading(false);
                });
              })
              .catch((err) => {
                dispatch({
                  type: ADD_LEAVES,
                  payload: {
                    description,
                    title,
                    image: "",
                    status: "pending",
                    userUid: user,
                  },
                });
                alert(
                  "Leave was submitted but something went wrong while adding image"
                );
                setShowLeaveModal(false);
                setClearState();
                setLoading(false);
              });
          } else {
            setLoading(false);
            setShowLeaveModal(false);
            setClearState();
          }
        })
        .catch((err) => {
          console.log("err", err);
          setLoading(false);
          alert("Something went wrong while submitting leave");
        });
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      alert("Something went wrong while submitting leave");
    }
  };

  const imageSelectHandler = (e) => {
    let file = e.target.files[0];
    if (
      file?.type === "image/jpeg" ||
      file?.type === "image/jpg" ||
      file?.type === "image/png"
    ) {
      setImageURLDisplay(URL.createObjectURL(file));
      setImageObj(file);
      setImageLoading(false);
    } else {
      alert("Only JPEG | JPG | PNG images are allowed");
      setImageLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setShowLeaveModal(true)} style={{ margin: 20 }}>
        Add Leave
      </Button>
      <Modal
        show={showLeaveModal}
        onHide={() => {
          setShowLeaveModal(false);
        }}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={onSubmitForm}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={imageSelectHandler}
              />
              <Button
                variant="primary"
                onClick={() => {
                  inputRef.current.click();
                  setImageLoading(true);
                }}
                className="my-4"
                disabled={imageLoading}
              >
                Add Image
              </Button>
              {imageURLDisplay && (
                <div
                  style={{
                    borderStyle: "dotted",
                    borderWidth: "2px",
                    borderColor: "#999",
                  }}
                >
                  <img
                    src={imageURLDisplay}
                    style={{ width: 150, height: 150 }}
                  />
                </div>
              )}
            </div>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Leave Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave Title"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Label>Leave Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Leave Description"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={
                loading ||
                title.trim().length === 0 ||
                description.trim().length === 0
              }
            >
              {loading ? "...." : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {leaves &&
        leaves?.length > 0 &&
        leaves.map((leave) => {
          if (leave?.userUid === user) {
            return (
              <LeaveBoxComponent
                leave={leave}
                isAdmin={false}
                editStatus={() => {}}
              />
            );
          }
        })}
    </>
  );
}

export default StudentLeaves;
