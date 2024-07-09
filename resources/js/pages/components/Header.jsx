import { Container, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import logoOnly from 'src/assets/logo-only.png';
import logoTextOnly from 'src/assets/logo.png';
import { HashLink } from 'react-router-hash-link';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaCheck } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { confirm } from 'src/shared/confirm';
import { useUpdateRoleMutation } from 'src/redux/services/profile'; 
import { useAntMessage } from 'src/context/ant-message';

function Header({ title = '' }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [updateRole] = useUpdateRoleMutation();
  const antMessage = useAntMessage();

  const roles = {
    'Business': 'business',
    'Customer': 'customer',
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" fixed="top">
      <Container fluid>
        <Navbar.Brand as={HashLink} to="/#home">
          <img src={logoTextOnly} style={{ width: 140 }} />
          {title}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/messages" href="/messages"><FaMessage /></Nav.Link>
            <Nav.Link as={Link} to="/notifications"  href="/notifications"><FaBell /></Nav.Link>
            <NavDropdown align="end" title={<span><span className="llu-text-primary fw-bolder">Welcome!</span> {auth.getName} <img src={auth.getAvatar} style={{ width: 30, height: 30, objectFit: 'cover' }} className="rounded-circle border" /></span>} id="basic-nav-dropdown">
              {(auth.isAdmin || auth.isBusiness) ? <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item> : null}
              {auth.isCustomer ? <NavDropdown.Item as={Link} to="/claimed-coupons">Claimed Coupons</NavDropdown.Item> : null}
              {auth.isBusiness ? <NavDropdown.Item as={Link} to="/bundle-plans">Bundle Plans</NavDropdown.Item> : null}
              {(auth.isBusiness || auth.isCustomer) ? (
              <>
                <NavDropdown.Divider />
                <NavDropdown.ItemText className="small text-muted">Switch Account</NavDropdown.ItemText>
                {Object.keys(roles).map(item => (
                  <NavDropdown.Item
                    className="d-flex justify-content-between"
                    onClick={async () => {
                      await updateRole({ account: roles[item] });
                      await auth.update();
                      navigate('/');
                      antMessage.success(`Switched to ${item}`);
                    }}
                  >
                    <span>{item} Account</span> <span className="ms-2 text-success">{auth.getRoles.includes(roles[item]) ? <FaCheck /> : null}</span>
                  </NavDropdown.Item>
                ))}
              </>
              ) : null}
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


          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;