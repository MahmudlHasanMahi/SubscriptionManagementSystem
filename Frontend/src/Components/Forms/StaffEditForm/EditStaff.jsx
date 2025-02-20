import { useEffect, useState } from "react";
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
import CSRFProtect from "../../../Utils/CSRFProtect";
import Loading from "../../Loading/Loading";
import Button from "../Buttons/Button";
import CheckBox from "../CheckBox/CheckBox";

const EditStaff = () => {
  const { staffId } = useParams();
  const { isLoading, staffState } = useSelector(staff);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Update Staffs id ${staffId}`,
        title2: "Update account of staff",
        logo: null,
      })
    );
    dispatch(getStaff(staffId));
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();

    const body = {};
    for (let fields of e.target) {
      const { type, name, value } = fields;
      if (type == "checkbox") {
        if (
          staffState.hasOwnProperty(name) &&
          fields.checked != staffState[name]
        )
          body[name] = fields.checked;
      } else {
        if (staffState.hasOwnProperty(name) && staffState[name] != value)
          body[name] = value;
      }
    }
    dispatch(editStaff({ staffId, body }));
  };
  return (
    <Body>
      <form onSubmit={onSubmit}>
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
            value={staffState?.group}
          />
        
          <CheckBox defaultChecked={staffState?.is_active} name="is_active" />

          <div style={{ width: "100%", marginBlock: "2em" }}>
            <Button title={"Create Staff"} />
          </div>
        </FormContainer>
      </form>
    </Body>
  );
};

export default EditStaff;
