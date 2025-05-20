import React from "react";
import styles from "./Card.module.css";
import NumericTextBox from "./NumericTextBox";
const Card = ({ title1, title2, logo, bg }) => {
  return (
    <div className={styles["card"]} style={{ backgroundColor: bg }}>
      <NumericTextBox title1={title1} title2={title2} />
      <span>{logo}</span>
    </div>
  );
};

export default Card;
