import { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Nav } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import logoOnly from 'src/assets/logo-only.png';
import { FaFacebook, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { useUpdateProfileMutation } from 'src/redux/services/profile'; 
import YouTube from 'react-youtube';
import moment from 'moment';

function Introduction() {
  const auth = useAuth();
  const [updateProfile] = useUpdateProfileMutation();
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  const renderView = () => {
    switch(index) {
      case 0:
        return (
          <>
            <h1 className="text-center title display-1 llu-text-primary mb-3">Welcome to <br /> Local Linkup</h1>
            <div style={{ height: 300 }} className="overflow-auto p-3 rounded mb-3 llu-border-primary">
              <h5>
                Greetings
              </h5>
              <p>
                Welcome, <span className="llu-text-primary">{auth.getName ?? 'John Doe'}</span>, to LocalLinkup, your gateway to the vibrant world of Olongapo City's local businesses! We're thrilled to have you join our community of enthusiasts who believe in the power of small businesses to drive growth, innovation, and prosperity in our beloved city.
              </p>
              <p>
                As you explore our platform, you'll discover a plethora of local businesses waiting to be uncovered, from quaint cafes serving up delicious treats to unique boutiques offering one-of-a-kind finds. Whether you're a longtime resident or a newcomer to Olongapo City, LocalLinkup is here to guide you on your journey of discovery and connection.
              </p>
              <p>
                Join us in supporting the heartbeat of our city's economy, and together, let's celebrate the rich tapestry of businesses that make Olongapo City truly special.
              </p>
              <p>
                Welcome, <span className="llu-text-primary">{auth.getName ?? 'John Doe'}</span>, to LocalLinkup—where every connection counts!
              </p>
            </div>
            <div className="d-flex justify-content-center mb-5">
              <Button size="lg" className="llu-bg-primary" onClick={() => setIndex(1)}>Procced</Button>
            </div>
          </>
        )
      case 1:
        return (
          <>
            <h1 className="text-center title llu-text-primary mb-3">Instructional Video</h1>
            <div style={{ height: 300 }} className="overflow-auto p-3 rounded mb-3 llu-border-primary">
              <p>
                Introducing LocalLinkUp, the premier advertising platform tailored specifically for local businesses within Olongapo City.
              </p>
              <p>
                To effectively showcase your business in Olongapo City, here's how LocalLinkUp works
              </p>
              <p>
                Begin by creating a business account on LocalLinkUp. This initial step grants you access to establish a dedicated business page within the platform.
              </p>
              <p>
                Navigate to the dashboard by clicking the hamburger menu located in the upper right corner of the screen.
              </p>
              <p>
                Within the dashboard, locate and click on "Add Business" situated in the upper left corner.
              </p>
              <p>
                Select the appropriate category that best represents your business from the options provided.
              </p>
              <p>
                Proceed to fill out all necessary credentials required for your business profile.
              </p>
              <p>
                enhance your business profile by adding products or services offered by your establishment.
              </p>
              <p>
                For each product or service added, furnish comprehensive details including descriptions, photos, features, and any other pertinent information before submitting.
              </p>
              <p>
                Upon submission, allow LocalLinkUp time to review and approve your business profile.
              </p>
              <p>
                With approval granted, immerse yourself in the opportunities LocalLinkUp offers to promote and explore your business within Olongapo City.
              </p>
              <p>
                These are the fundamental steps to effectively utilize LocalLinkUp for advertising your business endeavors within our vibrant community.
              </p>
            </div>
            <div className="d-flex justify-content-center mb-5">
              <Button size="lg" className="llu-bg-primary" onClick={() => setIndex(2)}>Procced to Video</Button>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <h1 className="text-center title llu-text-primary">Instructional Video</h1>
            <div style={{ height: 400 }} className="mb-3">
              <YouTube 
                videoId="kRB8U6-A0zE" 
                opts={{
                  height: '400',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                  },
                }} 
                onReady={event => event.target.playVideo()} 
              />
            </div>
          </>
        )
      default:
        // code block
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      setIndex(0);
      setShow(auth.getCurrentUser?.last_login ? false : true);
    }
  }, [auth.isAuthenticated]);

  return (
    <Modal 
      show={show} 
      onHide={async () => {
        try {
          await updateProfile({ 
            ...auth.getCurrentUser, 
            last_login: moment().format('YYYY-MM-DD')  
          }).unwrap();
          auth.update();
          setShow(false);
        } catch(error) {
          console.log(error);
        }
       }}
      animation={false}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="border-0" closeButton={index === 2}>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body className="introduction ps-5 pe-5">
        {renderView()}
        <Row>
          <Col md={4} xs={4}>
            <img src={logoOnly} style={{ width: 30 }} />
          </Col>
          <Col md={4} xs={4}>
            <p className="small text-center mb-0">&copy; 2024 LocalLinkup All Rights Reserved</p>
          </Col>
          <Col md={4} xs={4} className="d-flex justify-content-end">
            <Nav className="h4">
              <Nav.Link>
                <FaFacebook className="llu-text-primary" />
              </Nav.Link>
              <Nav.Link>
                <FaYoutube className="llu-text-primary" />
              </Nav.Link>
              <Nav.Link>
                <FaEnvelope className="llu-text-primary" />
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default Introduction;