import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  user,
  IsAuthenticated,
  isLoading,
} from "../Features/UserAuth/UserAuth";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userState = useSelector(user);
  const loading = useSelector(isLoading);
  useEffect(() => {
    if (!userState) {
      dispatch(IsAuthenticated());
    }
  }, []);
  if (userState) {
    return <Outlet />;
  } else {
    return <Navigate to="/Signin" state={{ prev: location.pathname }} />;
  }
};

export default ProtectedRoute;
