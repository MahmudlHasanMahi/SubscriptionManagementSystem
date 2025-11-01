import FormContainer from "../FormTemplate/FormContainer";
import TextFields from "../TextFields/TextFields";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChangePasswordForm.module.css";
import Button from "../Buttons/Button";
import { useDispatch } from "react-redux";
import { ChangePassword } from "../../../Features/UserAuth/UserAuth";
import CSRFProtect from "../../../Utils/CSRFProtect";
import { notifyError, notifySuccess } from "../../../Utils/nofify";
import {
  LOGIN_SUCCESSFULL,
  PASSWORDS_UNMATCH,
  PASSWORD_CHANGED,
} from "../../../Utils/types";

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const re_password = e.target.re_password.value;
    if (password == re_password) {
      dispatch(ChangePassword({ password, re_password })).then((res) => {
        navigate("/");
      });
    } else {
      notifyError(PASSWORDS_UNMATCH);
    }
  };
  return (
    <FormContainer title="Change Password">
      <form className={styles["form"]} onSubmit={onSubmit}>
        <CSRFProtect />
        <TextFields
          type={"password"}
          name="password"
          label={"password"}
          required={true}
        />
        <br />
        <TextFields
          type={"password"}
          label={"Confirm password"}
          name={"re_password"}
          required={true}
        />
        <br />
        <Button type="submit" title={"Change Password"} />
      </form>
    </FormContainer>
  );
};

export default ChangePasswordForm;
