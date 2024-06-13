import React, { useEffect, useState } from 'react';
import { Card, Badge } from "react-bootstrap";
import "./NoticeCard.css";
import { Link } from "react-router-dom";
const NotificationsComponent = ({ notifications }) => {
  console.log("this is not", notifications)
  return (
    // <div className="App">
    //   <h7>Leave Request Notifications</h7>
    //   <ul>
    //     {notifications && notifications.map((notification, index) => (
    //       <li key={index}>{notification}</li>
    //     ))}
    //   </ul>
    // </div>



<div className="info-card-container">
    <Card className="custom-card m-2 ml-3 mr-4 border-2">
      <Card.Header className="text-white">
        <h3 className="notice-header text-xl">
          Notification
          <Link class="fa-solid fa-arrow-right btn btn-info float-end text-white" to="/leave-details"></Link>
        </h3>
      </Card.Header>

      <Card.Body className="notice-card-body">
       <ul>
       {notifications && notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
      </Card.Body>
    </Card>
  </div>

  );
};

export default NotificationsComponent;




