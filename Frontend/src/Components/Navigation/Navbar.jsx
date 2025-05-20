import styles from "./Navigation.module.css";
import ListItem from "./ListItem";
import { useSelector } from "react-redux";
import { NavbarState } from "../../Features/Navbar";
const Navbar = ({ list }) => {
  const state = useSelector(NavbarState);

  return (
    <div className={styles["navbar"]}>
      {list.map((item, idx) => {
        return (
          <ListItem
            key={idx}
            title={item.title}
            link={item.link}
            Logo={item.Logo}
            active={item.link == state}
          />
        );
      })}
    </div>
  );
};

export default Navbar;
