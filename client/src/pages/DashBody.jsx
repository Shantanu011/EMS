import InformationCard from "./InformationCard";
import NoticeCard from "./NoticeCard";
import Notification from "./NotificationsComponent";
import { Card, Container, Row, Col } from "react-bootstrap";

export default function DashBody({ userID, notifications }) {
  console.log("this is id from Dashbody", userID);
  return (
    <>
      <div class="container mt-2">
        {/* <!-- First Row --> */}
        <div class="row">
          {/* <!-- 80% width card --> */}
          <div class="col-md-8 mb-4">
            <InformationCard userID={userID} />
          </div>
          {/* <!-- 20% width card --> */}

          <Col md={4} className="mb-4">
            <iframe
              src="https://www.hamropatro.com/widgets/calender-small.php"
              title="Calendar"
              style={{
                border: "none",
                overflow: "hidden",
                width: "100%",
                height: "290px",
              }}
              allowTransparency="true"
              loading="lazy"
            ></iframe>
          </Col>
        </div>

        {/* <!-- Second Row --> */}
        <div class="row">
          {/* <!-- First 50% width card --> */}
          <div class="col-md-4 mb-4">
            <NoticeCard />
          </div>
          {/* <!-- Second 50% width card --> */}
          <div class="col-md-4 mb-4">
            <NoticeCard />
          </div>
          {/* <!-- 50% height cards --> */}
          <div class="col-md-4 mb-4">
            <div class="row">
              <div class="col-md-12 mb-2 h-50">
                <NoticeCard />
              </div>
              <div class="col-md-12 mb-2 h-50">
                <Notification />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
