import { Card, Container, Row, Col } from "react-bootstrap";
import "./InformationCard.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InformationCard({ userID }) {
  const [user, setUser] = useState("");

  console.log("tyhis is the id frim informaitno", userID);
  const getUserByID = async () => {
    console.log('getting user',userID)
    const data = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userID}`);
    console.log('this is data',data)
    setUser(data.data.responseBody);
  };

  console.log("user from info card", user);

  useEffect(() => {
    getUserByID();
  }, []);
  useEffect(()=>{
   console.log('this is user',user) 
  },[user])
  return (
    <>
      {/* <div className="info-card-container">
      <Card className="m-2 ml-3 mr-4 border-2">
        <Card.Header className=" text-white p-3">
          <h4 className="text-xl m-0">Basic Information</h4>
        </Card.Header>
        <Card.Body>
          <Container fluid>
            <Row className="flex p-2">
              <Col md={3}>
              </Col>
              <Col md={3}>
                <div className="ml-10 p-3">
                  <div>
                    <p>{user.FirstName} {user.LastName}</p>
                    <p className="text-black"></p>
                  </div>
                  <div className="mt-5">
                    <p>{user.PhoneNo}</p>
                    <p className="text-black">{user.email}</p>
                  </div>
                </div>
              </Col>
              <Col md={3}>
                <div className="ml-10 p-3">
                  <div>
                    <p>Team</p>
                    <p className="text-black">Computer</p>
                  </div>
                  <div className="mt-5">
                    <p>Status</p>
                    <p className="text-black">Active</p>
                  </div>
                </div>
              </Col>
              <Col md={3}>
                <div className="ml-10 p-3">
                  <div>
                    <p>Address</p>
                    <p className="text-black">{user.address}</p>
                  </div>
                  <div className="mt-5">
                    <p>Blood Group</p>
                    <p className="text-black">{user.BloodGroup}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div> */}
      <div className="info-card-container">
        <Card className="m-2 ml-3 mr-4 border-2">
          <Card.Header className="bg-primary text-white p-3">
            <h4 className="text-xl m-0">Basic Information</h4>
          </Card.Header>
          <Card.Body>
            <Container fluid>
              <Row className="flex p-2">
                <Col md={3}>
                  {user.profilePicture && (
                    <img src={user.profilePicture} alt="Profile Preview" />
                  )}
                </Col>
                <Col md={3}>
                  <div className="ml-10 p-3">
                    <div>
                      <p className="fw-bold">
                        {user.FirstName} {user.MiddleName} {user.LastName}
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="mb-1 fw-bold">Phone</p>
                      <p className="text-black">{user.PhoneNo}</p>
                      <p className="mb-1 fw-bold">Email</p>
                      <p className="text-black">{user.email}</p>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="ml-10 p-3">
                    <div>
                      <p className="mb-1 fw-bold">Team</p>
                      <p className="text-black">Computer</p>
                    </div>
                    <div className="mt-3">
                      <p className="mb-1 fw-bold">Status</p>
                      <p className="text-black">Active</p>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="ml-10 p-3">
                    <div>
                      <p className="mb-1 fw-bold">Address</p>
                      <p className="text-black">{user.address}</p>
                    </div>
                    <div className="mt-3">
                      <p className="mb-1 fw-bold">Blood Group</p>
                      <p className="text-black">{user.BloodGroup}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
