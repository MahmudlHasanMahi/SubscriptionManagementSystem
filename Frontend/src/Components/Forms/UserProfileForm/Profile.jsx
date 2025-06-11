import React, { useEffect } from "react";
import Body from "../../Body/Body";
import { useDispatch, useSelector } from "react-redux";
import { updateHeaderState } from "../../../Features/headerState";
import FormContainer from "../FormContainer/FormContainer";
import TextFields from "../TextFields/TextFields";
import { user } from "../../../Features/UserAuth/UserAuth";
import ProfilePhoto from "./ProfilePhoto";
import Button from "../Buttons/Button";
const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector(user);
  useEffect(() => {
    dispatch(
      updateHeaderState({
        title1: `Profile`,
        title2: "View & update profile.",
        logo: null,
      })
    );
  }, []);
  return (
    <Body>
      <FormContainer title="Profile">
        <ProfilePhoto />
        <div>
          <TextFields
            type={"email"}
            required={true}
            name={"email"}
            label={"Email address"}
            value={userData.email}
          />
          <TextFields
            type={"text"}
            required={true}
            name={"name"}
            label={"Name"}
            value={userData.name}
          />
          <TextFields
            type={"number"}
            required={true}
            name={"mobile"}
            label={"Phone number"}
            value={userData.mobile}
          />
          <TextFields
            type={"Text"}
            required={true}
            name={"mobile"}
            label={"Groups"}
            value={userData.groups}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "1em",
            marginTop: "1em",
          }}
        >
          <Button title={"Edit"} link={"/notfound"} />

          {/* <div style={{ marginTop: "1em" }}> */}
          <Button
            title={"Cancel"}
            style={{ background: "#ffffff3b" }}
            link={"/"}
          />
        </div>
      </FormContainer>
    </Body>
  );
};

export default Profile;
