import styles from "./SignInForm.module.css";
import TextFields from "../TextFields/TextFields";
import Button from "../Buttons/Button";
import CSRFProtect from "../../../Utils/CSRFProtect";
import FormContainer from "../FormTemplate/FormContainer";
import { SignIn } from "../../../Features/UserAuth/UserAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    dispatch(SignIn({ email, password })).then((res) => {
      if (res.payload?.last_login) {
        navigate("/dashboard");
      } else {
        navigate("/ChangePassword");
      }
    });
  };
  return (
    <FormContainer postTitle={"Welcome"} title={"Please Sign In"}>
      <form className={styles["form"]} onSubmit={onSubmit}>
        <CSRFProtect />
        <TextFields
          type={"email"}
          name={"email"}
          label={"Email"}
          required={true}
        />
        <br />
        <TextFields
          type={"password"}
          name={"password"}
          label={"Password"}
          required={true}
        />
        <br />
        <Button title={"Sign in"} />
      </form>
    </FormContainer>
  );
};

export default SignInForm;
