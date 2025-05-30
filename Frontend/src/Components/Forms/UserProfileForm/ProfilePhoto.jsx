import styles from "./Photo.module.css";
const ProfilePhoto = () => {
  return (
    <div className={styles["profilePhoto"]}>
      <div className={styles["profilePic"]}>
        <div>Photo</div>
      </div>

      <div className={styles["pictureFormatContainer"]}>
        <div>
          <span>Allowed format</span>
          <span>JPG, JPEG, and PNG</span>
        </div>
        <div>
          <span>Max file size</span>
          <span>2MB</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhoto;
