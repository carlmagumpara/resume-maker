import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import { useAuth } from 'src/hooks/useAuth';
import { ModalRoute } from 'src/pages/components/ModalRoute';

// Middleware
import PrivateRoute from 'src/pages/components/PrivateRoute';
import GuestRoute from 'src/pages/components/GuestRoute';

// Wrapper
import Wrapper from 'src/pages/components/Wrapper';

// Pages
import NotFound from 'src/pages/not-found';
import Landing from 'src/pages/landing';
import Login from 'src/pages/login';
import Register from 'src/pages/register';
import ResetPassword from 'src/pages/reset-password';
import Dashboard from 'src/pages/dashboard';
import Users from 'src/pages/users';
import Profile from 'src/pages/profile';
import OneSignal from 'react-onesignal';

import Sidebar from 'src/pages/components/Sidebar';
import Top from 'src/pages/components/Top';

const runOneSignal = async () => {
  await OneSignal.init({ 
    appId: 'e5c20e82-2534-418a-bda2-fd270b2cc219', 
    allowLocalhostAsSecureOrigin: true
  });
  OneSignal.Slidedown.promptPush();
};

function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const previousLocation = location.state?.previousLocation;
  const previousLocationFromLogin = location.state?.previousLocationFromLogin;

  useEffect(() => {
    runOneSignal();
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      auth.update();
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (auth.isAuthenticated && previousLocationFromLogin) {
      setTimeout(() => navigate(previousLocationFromLogin), 0);
    }
  }, [auth.isAuthenticated, previousLocationFromLogin]);

  return (
    <div className="App">
      <Routes location={previousLocation || location}>
        <Route path='*' element={<NotFound />} />
        {/*Authenticated Users*/}
        <Route element={<PrivateRoute />}>
          <Route element={<Sidebar />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users">
              <Route path="" element={<Users />} />
            </Route>
            <Route path="update-profile" element={<Profile />} />
          </Route>
        </Route>
        {/*Guest*/}
        <Route element={<Wrapper />}>
          <Route element={<GuestRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>
          <Route path="/" element={<Landing />} />
        </Route>
      </Routes>
      {previousLocation && (
        <Routes>
          <Route path="/modal/:id" element={<ModalRoute />} />
        </Routes>
      )}
      <Top />
    </div>
  );
}

export default App;
