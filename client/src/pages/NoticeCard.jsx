import React from "react";
import { Card, Badge } from "react-bootstrap";
import "./NoticeCard.css";
import { Link } from "react-router-dom";

export default function NoticeCard() {
  return (
    <div className="info-card-container">
      <Card className="custom-card m-2 ml-3 mr-4 border-2">
        <Card.Header className="text-white">
          <h3 className="notice-header text-xl">
            Notices
            <Link class="fa-solid fa-arrow-right btn btn-info float-end text-white" to="/leave-details"></Link>
          </h3>
        </Card.Header>

        <Card.Body className="notice-card-body">
          <p className="mt-2 notice-text">
            You have used more than 80% of your paid leave.
          </p>
          <p className="notice-text">
            Morem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p className="notice-text mb-4">Your project’s deadline is close.</p>
        </Card.Body>
      </Card>
    </div>
  );
}
