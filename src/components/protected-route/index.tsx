import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type Props = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: Props) => {
  const location = useLocation();
  const { user, isInit, isLoading } = useSelector((state) => state.user);

  // ждём проверки авторизации
  if (!isInit || isLoading) {
    return <div>Загрузка...</div>;
  }

  // страницы только для неавторизованных
  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from.pathname} replace />;
  }

  // страницы только для авторизованных
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
