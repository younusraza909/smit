import React from "react";
import { Card, Button } from "react-bootstrap";

function FeedCard({ data }) {
  console.log("data", data);
  return (
    <Card style={{ width: "50rem", margin: "20px 0" }}>
      <Card.Img variant="top" src={data.postImage} />
      <Card.Body>
        <Card.Title>{data.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {data?.postSubTitle}
        </Card.Subtitle>
        <Card.Text>{data.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default FeedCard;
