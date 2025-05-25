import Body from "../../Body/Body";
import { useDispatch } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import { useEffect, useState, useMemo } from "react";
import TextFields from "../TextFields/TextFields";
import Select from "../../Staff/Filter/Select";
import SelectOption from "../../Staff/Filter/SelectOption";
import CheckBox from "../CheckBox/CheckBox";
import Button from "../Buttons/Button";
import GenerateString from "../../../Utils/randomString";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import createStaff from "../../../Utils/CreateStaff";
import getGroups from "../../../Utils/GetGroups";
import { notifyError } from "../../../Utils/nofify";
import { useNavigate } from "react-router-dom";
import FormContainer from "../FormContainer/FormContainer";
import CSRFProtect from "../../../Utils/CSRFProtect";
import { useQueryClient } from "@tanstack/react-query";

const AddStaffForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [property, setProperty] = useState({
    show: false,
    selected: null,
  });

  const [groups, setGroups] = useState([]);
  const randomString = useMemo(() => {
    return GenerateString(10);
  }, []);

  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `New Staff`,
        title2: "Create account for a new staff",
        logo: null,
      })
    );
    getGroups().then((val) => {
      setGroups(val);
    });
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    if (property.selected == null) {
      return notifyError("Please select role");
    }
    const obj = {
      name: e.target.name.value,
      email: e.target.email.value,
      mobile: e.target.mobile.value,
      password: e.target.password.value,
      active: e.target.activateAccount.checked,
      group: groups[property.selected].id,
    };
    createStaff(obj).then(() => {
      queryClient.resetQueries({ queryKey: ["staff/fetchStaff"], exact: true });
      navigate("/staff");
    });
  };
  return (
    <Body>
      <form onSubmit={onSubmit}>
        <FormContainer title={"Add a new staff"}>
          <CSRFProtect />
          <TextFields
            type={"text"}
            required={true}
            name={"name"}
            label={"Name"}
          />
          <TextFields
            type={"email"}
            required={true}
            name={"email"}
            label={"Email address"}
          />
          <TextFields
            type={"number"}
            required={true}
            name={"mobile"}
            label={"Phone number"}
          />
          {/* <TextFields
            type={"text"}
            required={true}
            name={"test"}
            label={"test"}
            value="asdlflskdf"
            editField={true}
          /> */}
          <Select
            placeholder={"Select Role"}
            title={"Role"}
            property={property}
            setProperty={setProperty}
          >
            {groups.map((prev, idx) => {
              return <SelectOption key={idx} title={prev.name} />;
            })}
          </Select>
          <TextFields
            type={"text"}
            name={"password"}
            label={"Temporary password"}
            value={randomString}
            icon={<ContentCopyOutlinedIcon />}
            required={true}
          />
          <CheckBox name="activateAccount" />
          <div style={{ marginBlock: "2em 1em", width: "100%" }}>
            <Button title={"Create Staff"} />
          </div>
        </FormContainer>
      </form>
    </Body>
  );
};

export default AddStaffForm;
