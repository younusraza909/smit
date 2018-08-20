import React from "react";
import { Card, Button } from "react-bootstrap";

function LeaveBoxComponent({ leave, isAdmin, editStatus }) {
  return (
    <Card style={{ width: "50rem", margin: "20px 10px" }}>
      <div>
        <Card.Body>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Card.Title>{leave.title}</Card.Title>
              <Card.Text>{leave.description}</Card.Text>
              {leave?.image && (
                <img
                  src={leave?.image}
                  style={{ widht: "150px", height: "150px" }}
                />
              )}
            </div>
            <span
              style={{
                margin: 10,
                padding: 5,
                backgroundColor: leave?.status === "pending" ? "red" : "green",
                color: "#fff",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              {leave?.status}
            </span>
          </div>
        </Card.Body>
      </div>
      {isAdmin && (
        <Button
          disabled={leave?.status === "accepted"}
          style={{ width: "50%", margin: "10px auto" }}
          onClick={() => editStatus(leave?.id)}
        >
          Accept Leave
        </Button>
      )}
    </Card>
  );
}

export default LeaveBoxComponent;
