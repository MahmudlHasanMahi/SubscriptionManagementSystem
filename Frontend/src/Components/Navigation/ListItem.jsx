import styles from "./Navigation.module.css";
import Active from "./Active";
import { useDispatch } from "react-redux";
import { updateNavbar } from "../../Features/Navbar";
import { Link } from "react-router-dom";
const ListItem = ({ title, Logo, link, active }) => {
  const dispatch = useDispatch();
  const clicked = () => {
    dispatch(updateNavbar(link));
  };
  return (
    <Link className={styles["listItem"]} onClick={clicked} to={link}>
      {Logo}
      <span>{title}</span>
      {active && <Active />}
    </Link>
  );
};

export default ListItem;
