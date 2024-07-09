import React, { useState, useEffect } from 'react';
import { Image, Card, Container, Row, Col, Nav, Navbar, Offcanvas, NavDropdown, Form, Button, Modal, Badge, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import logo from 'src/assets/logo.png';
import { Helmet } from 'react-helmet';
import { HashLink } from 'react-router-hash-link';
import './Wrapper.scss';
import { useAuth } from 'src/hooks/useAuth';
import { confirm } from 'src/shared/confirm';
import { FaBell, FaTwitter, FaFacebook, FaInstagram, FaBars, FaUser, FaSearch, FaCheck, FaYoutube, FaEnvelope, FaKey, FaPhone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { useAntMessage } from 'src/context/ant-message';
import { useUpdateRoleMutation } from 'src/redux/services/profile'; 
import { titleCasePath } from 'src/helpers/utils';
import { useGetLandingQuery } from 'src/redux/services/landing';
import user from 'src/assets/avatars/user-2.png';
import owner from 'src/assets/avatars/owner.png';
import { motion, useViewportScroll } from 'framer-motion';

function Wrapper() {
  const { scrollY } = useViewportScroll();
  const [searchParams, setSearchParams] = useSearchParams();
  const [updateRole] = useUpdateRoleMutation();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(true);
  const antMessage = useAntMessage();
  const { data, error, isLoading, isFetching, refetch } = useGetLandingQuery({});

  const roles = {};

  useEffect(() => {
    return scrollY.onChange(() => setShow(scrollY?.current < scrollY?.prev));
  });

  const pageViews = () => (
    <Nav className="justify-content-end d-none d-sm-block">
      <Navbar.Text>
        <div className="d-flex justify-content-start align-items-center gap-2">
          <div className="bg-white rounded pt-1 pb-1 ps-3 pe-3">
            <p className="mb-0 small llu-text-primary">Total Page View:</p>
          </div>
          <div className="rounded pt-1 pb-1 ps-3 pe-3 llu-bg-primary border">
            <p className="mb-0 small text-white">{data?.total_page_views ?? 0}</p>
          </div>
        </div>
      </Navbar.Text>
    </Nav>
  );

  /** add this const **/
  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -140, height: 0 }
  };

  return (
    <>
      <Helmet>
        <body />
      </Helmet>
      <Navbar 
        className="bg-white pb-0 pt-0 d-flex flex-column" 
        fixed="top"
      >
        <Container
          as={motion.div}
          variants={variants}
          animate={!show? "hidden" : "visible"}
          transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
        >
          <Nav className="me-auto">
            <Nav.Link>
              <div className="d-flex justify-content-start align-items-center p-1 rounded-circle border">
                <FaFacebook />
              </div>
            </Nav.Link>
            <Nav.Link>
              <div className="d-flex justify-content-start align-items-center p-1 rounded-circle border">
                <FaYoutube />
              </div>
            </Nav.Link>
            <Nav.Link>
              <div className="d-flex justify-content-start align-items-center p-1 rounded-circle border">
                <FaEnvelope />
              </div>
            </Nav.Link>
          </Nav>
          <Nav className="justify-content-end">
            {auth.isAuthenticated ? (
              <>
                <NavDropdown align="end" title={<span><span className="llu-text-primary fw-bolder">Welcome!</span> {auth.getName} <img src={auth.getAvatar} style={{ width: 30, height: 30, objectFit: 'cover' }} className="rounded-circle border" /></span>} id="basic-nav-dropdown">
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/update-profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={async () => await confirm({ 
                        title: 'Logout', 
                        confirmation: 'Are you sure you want to logout?' 
                      }) && await auth.logout()}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register"><FaUser />{` `}Register</Nav.Link>
                <Nav.Link as={Link} to="/login"><FaKey />{` `}Login</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
        <Container
          as={motion.div}
          variants={variants}
          animate={!show? "hidden" : "visible"}
          transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
        >
          <Navbar.Brand as={HashLink} to="/#home">
            <img src={logo} style={{ width: 180 }} />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link as={Link} to="/">
              <div className="d-flex justify-content-start align-items-center gap-2">
                <div className="d-flex justify-content-center align-items-center p-2 border" style={{}}>
                  <FaPhone />
                </div>
                <div>
                  <p className="small mb-0">09666820157</p>
                  <p className="small mb-0 llu-text-primary">Please Call Us</p>
                </div>
              </div>
            </Nav.Link>
            <Nav.Link as={Link} to="/"  className="d-none d-sm-block">
              <div className="d-flex justify-content-start align-items-center gap-2">
                <div className="d-flex justify-content-center align-items-center p-2 border" style={{}}>
                  <FaClock />
                </div>
                <div>
                  <p className="small mb-0">Mon-Fri 10:00-18:00</p>
                  <p className="small mb-0 llu-text-primary">Open Fo Call</p>
                </div>
              </div>
            </Nav.Link>
            <Nav.Link as={Link} to="/"  className="d-none d-sm-block">
              <div className="d-flex justify-content-start align-items-center gap-2">
                <div className="d-flex justify-content-center align-items-center p-2 border" style={{}}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="small mb-0">Olongapo City Zambales</p>
                  <p className="small mb-0 llu-text-primary">2200</p>
                </div>
              </div>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div id="home" style={{ paddingTop: 140 }}>
        <Outlet />
      </div>
      <Container>
        <footer className="d-flex flex-wrap justify-content-center align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-muted">&copy; 2024 LocalLinkup All Rights Reserved</span>
          </div>
        </footer>
      </Container>
    </>
  );
}

export default Wrapper;