import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../services/store';

type Props = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: Props) => {
  const location = useLocation();
  const { user, isInit, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  // ждём, пока проверим авторизацию (checkUserAuth)
  if (!isInit || isLoading) {
    return <div>Загрузка...</div>;
  }

  // страницы только для неавторизованных
  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }

  // страницы только для авторизованных
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
