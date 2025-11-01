import styles from "./Navigation.module.css";
import ListItem from "./ListItem";
import { useLocation } from "react-router-dom";
const Navbar = ({ list, isResizing }) => {
  const location = useLocation();

  return (
    <div className={styles["navbar"]}>
      {list.map((item, idx) => {
        return (
          <ListItem
            isResizing={isResizing}
            key={idx}
            title={item.title}
            link={item.link}
            Logo={item.Logo}
            
            active={item.link == "/" + location.pathname.split("/")[1]}
          />
        );
      })}
    </div>
  );
};

export default Navbar;
