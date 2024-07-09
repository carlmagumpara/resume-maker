import React, { useState, useEffect } from 'react';
import { Image, Card, Container, Row, Col, Nav, Navbar, Offcanvas, NavDropdown, Form, Button, Modal, Badge, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import logo from 'src/assets/logo.png';
import { Helmet } from 'react-helmet';
import { HashLink } from 'react-router-hash-link';
import './Wrapper.scss';
import { useAuth } from 'src/hooks/useAuth';
import { confirm } from 'src/shared/confirm';
import { FaHome, FaBell, FaTwitter, FaFacebook, FaInstagram, FaBars, FaUser, FaSearch, FaCheck, FaYoutube, FaEnvelope, FaKey, FaPhone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
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
            <Nav.Link as={Link} to="/"><FaHome />{` `}Home</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
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
      </Navbar>
      <div id="home" style={{ paddingTop: 140 }}>
        <Outlet />
      </div>
      <Container>
        <footer className="d-flex flex-wrap justify-content-center align-items-center py-3 my-4 border-top">
          <div className="col-md-4 text-center">
            <span className="mb-3 mb-md-0 text-muted">&copy; 2024 All Rights Reserved</span>
          </div>
        </footer>
      </Container>
    </>
  );
}

export default Wrapper;