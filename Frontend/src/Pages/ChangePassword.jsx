import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ChangePasswordForm from "../Components/Forms/ChangePasswordForm/ChangePasswordForm";
import { IsAuthenticated } from "../Features/UserAuth/UserAuth";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      dispatch(IsAuthenticated());
    }
  }, []);
  return user?.last_login ? (
    <Navigate to="/" />
  ) : user ? (
    <ChangePasswordForm />
  ) : (
    <Navigate to="/Signin" />
  );
};

export default ChangePassword;
