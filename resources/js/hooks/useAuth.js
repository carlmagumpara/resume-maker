import { useSelector, useDispatch } from 'react-redux';
import { selectUser, fetchUser } from '../redux/reducers/user';
import { selectToken } from '../redux/reducers/token';

export const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  return {
    isAuthenticated: (token && user) ? true : false,
    isEmailVerified: user?.email_verified_at ? true : false,
    isAdmin: (user?.roles ?? []).some(role => role.name === 'admin'),
    isBusiness: (user?.roles ?? []).some(role => role.name === 'business'),
    isCustomer: (user?.roles ?? []).some(role => role.name === 'customer'),
    getRoles: (user?.roles ?? []).map(role => role.name),
    getId: user?.id,
    getName: user ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}` : null,
    getFirstName: user?.first_name,
    getLastName: user?.last_name,
    getAvatar: user?.photo,
    getEmail: user?.email,
    getRoleId: user?.role_id,
    getIsSuper: user?.is_super,
    getToken: token,
    getCurrentUser: user,
    getPremium: user?.premium_user,
    getStatus: user?.status,
    update: () => dispatch(fetchUser()),
    logout: () => dispatch({ type: 'USER_LOGOUT' }),
  }
}