import { useDebugValue, useEffect, useState } from "react";
import FormContainer from "../FormContainer/FormContainer";
import TextFields from "../TextFields/TextFields";
import Body from "../../Body/Body";
import { useDispatch, useSelector } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import { useParams } from "react-router-dom";
import {
  getStaff,
  staffState as staff,
  editStaff,
} from "../../../Features/staff";
import { useNavigate } from "react-router-dom";
import CSRFProtect from "../../../Utils/CSRFProtect";
import Button from "../Buttons/Button";
import CheckBox from "../CheckBox/CheckBox";
import { useQueryClient } from "@tanstack/react-query";

const EditStaff = () => {
  const [hasChanged, setHasChanged] = useState({});
  const [disable, setDisable] = useState(true);
  const { staffId } = useParams();
  const { isLoading, staffState } = useSelector(staff);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getStaff(staffId)).then((data) => {
      return dispatch(
        updateHeaderState({
          title1: `Update Staff ${data.payload.name}`,
          title2: "Update account of staff",
          logo: null,
        })
      );
    });
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    const body = hasChanged;
    if (Object.keys(body).length !== 0) {
      dispatch(editStaff({ staffId, body })).then(() => {
        queryClient.resetQueries({
          queryKey: ["staff/fetchStaff"],
          exact: true,
        });
        return navigate("/staff");
      });
    }
  };

  const changed = (e) => {
    const { type, name, value } = e.target;
    setHasChanged((prev) => {
      prev[name] = type == "checkbox" ? e.target.checked : value;
      if (prev[name] == staffState[name]) {
        delete prev[name];
      }
      setDisable(Object.keys(prev).length === 0);
      return prev;
    });
  };
  return (
    <Body>
      <form onSubmit={onSubmit} onChange={changed}>
        <FormContainer isLoading={isLoading} title={"Update staff"}>
          <CSRFProtect />
          <TextFields
            type={"text"}
            name={"name"}
            label={"Name"}
            value={staffState?.name}
            editField
          />
          <TextFields
            name={"email"}
            label={"Email address"}
            value={staffState?.email}
            editField
          />
          <TextFields
            type={"number"}
            name={"mobile"}
            label={"Phone number"}
            value={staffState?.mobile}
            editField
          />
          <TextFields
            type={"text"}
            name={"group"}
            label={"Group"}
            value={staffState?.groups}
          />
          <CheckBox defaultChecked={staffState?.is_active} name="is_active" />
          <div
            style={{
              width: "100%",
              marginBlock: "2em",
              display: "flex",
              gap: "10%",
            }}
          >
            <Button disable={disable} title={"Save"} />
            <Button
              title={"Cancel"}
              style={{ background: "#ffffff3b" }}
              link={"/staff"}
            />
          </div>
        </FormContainer>
      </form>
    </Body>
  );
};

export default EditStaff;
