import React from "react";
import { Card, Button } from "react-bootstrap";

function CourseCard({ course, courseToggle, loading }) {
  console.log("course", course);
  return (
    <Card style={{ width: "50rem", margin: "20px 0" }}>
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
        style={{
          width: "50%",
          marginRight: "auto",
          marginBottom: "10px",
          marginLeft: "10px",
        }}
        onClick={() => courseToggle(course?.id, course?.disabled)}
      >
        {course?.disabled ? "Open Admission" : "Close Addmission"}
      </Button>
    </Card>
  );
}

export default CourseCard;
