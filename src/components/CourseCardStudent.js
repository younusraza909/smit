import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

function CourseCardStudent({ course, formToggle, userId }) {
  const [enrolled, setEnrolled] = useState(false);

  console.log("course", course);

  useEffect(() => {
    console.log("Hello");
    course?.Enrolled?.filter((course) => {
      if (course?.id === userId) {
        setEnrolled(true);
      }
    });
  }, []);

  return (
    <Card style={{ width: "50rem", margin: "20px 10px" }}>
      {course?.disabled && (
        <span style={{ color: "red", margin: "10px" }}>Admission Closed</span>
      )}
      <div>
        <Card.Body>
          <Card.Title>{course.title}</Card.Title>
          <Card.Text>{course.description}</Card.Text>
          <Card.Subtitle className="mb-2 text-muted">
            <span style={{ fontWeight: "bold" }}>Tutor: </span> {course?.tutor}
          </Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            <span style={{ fontWeight: "bold" }}>Duration: </span>{" "}
            {course?.duration}
          </Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            <span style={{ fontWeight: "bold" }}>Prerequisite: </span>{" "}
            {course?.prerequisite}
          </Card.Subtitle>{" "}
        </Card.Body>
      </div>
      <Button
        disabled={course?.disabled || enrolled}
        style={{
          width: "50%",
          marginRight: "auto",
          marginBottom: "10px",
          marginLeft: "10px",
        }}
        onClick={() => formToggle(course?.id)}
      >
        {enrolled && "Already Submitted"}
        {!enrolled &&
          (course?.disabled ? "Admission Closed" : "Addmission Form")}
      </Button>
    </Card>
  );
}

export default CourseCardStudent;
