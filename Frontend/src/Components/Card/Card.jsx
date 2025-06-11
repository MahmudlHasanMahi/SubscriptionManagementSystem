import React from "react";
import styles from "./Card.module.css";
import NumericTextBox from "./NumericTextBox";
import { useNavigate } from "react-router-dom";
const Card = ({
  title1,
  title2,
  logo,
  style,
  highlight = false,
  link = null,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`${styles["card"]} ${link && !highlight && styles["hover"]}`}
      style={{ ...style, outline: highlight ? "solid #FFFFFF" : "none" }}
      onClick={() => {
        if (link) {
          return navigate(link);
        }
      }}
    >
      <NumericTextBox title1={title1} title2={title2} />
      <span>{logo}</span>
    </div>
  );
};

export default Card;
