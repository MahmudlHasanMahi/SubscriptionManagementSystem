import React from "react";
import styles from "./Card.module.css";
import NumericTextBox from "./NumericTextBox";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
    <Link
      to={link}
      className={`${styles["card"]} ${link && !highlight && styles["hover"]}`}
      style={{
        ...style,
        border: highlight ? "solid #FFFFFF" : "none",
        cursor: link ? "pointer" : "default",
      }}
    >
      <NumericTextBox title1={title1} title2={title2} />
      <span>{logo}</span>
    </Link>
  );
};

export default Card;
