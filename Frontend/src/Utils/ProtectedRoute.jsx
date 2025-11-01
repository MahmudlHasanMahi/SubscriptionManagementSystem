import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  user,
  IsAuthenticated,
  isLoading,
} from "../Features/UserAuth/UserAuth";
import Loading from "../Components/Loading/Loading";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userState = useSelector(user);
  const loading = useSelector(isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState === null && !loading) {
      dispatch(IsAuthenticated());
    }
  }, []);
  if (loading) {
    return <Loading />;
  } else if (userState !== null) {
    return <Outlet />;
  } else if (userState === null && loading)
    return (
      <Navigate
        to="/Signin"
        state={{
          prev: location.pathname === "/" ? "" : location.pathname,
        }}
        replace
      />
    );
};

export default ProtectedRoute;
