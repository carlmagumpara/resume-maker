import { Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from 'src/hooks/useAuth';
import logoOnly from 'src/assets/logo-only.png';
import logoTextOnly from 'src/assets/logo-text-only.png';
import { FaFlag, FaFile, FaStar, FaEnvelope, FaMap, FaComment, FaChartArea, FaBuilding, FaStore, FaShieldAlt, FaUser, FaBell, FaAd, FaSignOutAlt, FaTicketAlt, FaColumns, FaWallet } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { confirm } from 'src/shared/confirm';
import Header from 'src/pages/components/Header';

function Sidebar() {
  const auth = useAuth();
  const location = useLocation();

  const menus = [
    { title: 'Dashboard', icon: <FaChartArea />, showIf: auth.isAdmin || auth.isBusiness, props: { to: '/dashboard', state: {} } },
    { title: 'Add Business', icon: <FaStore />, showIf: auth.isBusiness, props: { to: '/modal/add-your-business', state: { previousLocation: location } } },
    { title: 'Manage Businesses', icon: <FaBuilding />, showIf: auth.isAdmin || auth.isBusiness, props: { to: '/businesses', state: {} } },
    { title: 'Manage Advertisements', icon: <FaAd />, showIf: auth.isAdmin, props: { to: '/advertisements', state: {} } },
    { title: 'Manage Feedback', icon: <FaComment />, showIf: auth.isAdmin, props: { to: '/feedback', state: {} } },
    { title: 'Manage Bundle Plans', icon: <FaStar />, showIf: auth.isAdmin || auth.isBusiness, props: { to: '/plans', state: {} } },
    { title: 'Manage Business Reports', icon: <FaFlag />, showIf: auth.isAdmin, props: { to: '/reports', state: {} } },
    // { title: 'Notifications', icon: <FaBell />, showIf: auth.isAdmin || auth.isBusiness, props: { to: '/notifications', state: {} } },
    // { title: 'Messages', icon: <FaMessage />, showIf: true, props: { to: '/messages', state: {} } },
    { title: 'Claimed Coupons', icon: <FaTicketAlt />, showIf: auth.isCustomer, props: { to: '/claimed-coupons', state: {} } },
    { title: 'Bundle Plans', icon: <FaColumns />, showIf: auth.isBusiness, props: { to: '/bundle-plans', state: {} } },
    { title: 'Payments', icon: <FaWallet />, showIf: auth.isAdmin || auth.isBusiness, props: { to: '/payments', state: {} } },
    { title: 'Transaction History', icon: <FaFile />, showIf: auth.isAdmin, props: { to: '/transactions', state: {} } },
    { title: 'Contacts', icon: <FaEnvelope />, showIf: auth.isAdmin, props: { to: '/contacts', state: {} } },
    { title: 'Map', icon: <FaMap />, showIf: true, props: { to: '/map', state: {} } },
    // { title: 'Update Profile', icon: <FaUser />, showIf: true, props: { to: '/update-profile', state: {} } },
    // { title: 'Update Password', icon: <FaShieldAlt />, showIf: true, props: { to: '/change-password', state: {} } },
    // { title: 'Logout', icon: <FaSignOutAlt />, showIf: true, props: { onClick: async () => await confirm({ title: 'Logout', confirmation: 'Are you sure you want to logout?'  }) && await auth.logout() }},
  ];

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark" style={{ paddingTop: 60 }}>
            <div className="d-flex flex-column align-items-center align-items-sm-start text-white min-vh-100">
              <Nav variant="pills" className="flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mt-3" id="menu">
                {menus.filter(item => item.showIf).map(item => <Nav.Item className="small text-white"><Nav.Link as={Link} {...item.props} className="text-white">{item.icon}<span className="ms-2 d-none d-sm-inline">{item.title}</span></Nav.Link></Nav.Item>)}
              </Nav>
            </div>
          </div>
          <div className="col" style={{ paddingTop: 65 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar;