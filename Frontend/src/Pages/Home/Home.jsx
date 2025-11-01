import Navigation from "../../Components/Navigation/Navigation";
import Heading from "../../Components/Heading/Heading";
import styles from "./Home.module.css";
import { Outlet } from "react-router-dom";
const Home = () => {
  console.log("ASDF");
  return (
    <div className={styles["home"]}>
      <Navigation />
      <div className={styles["content"]}>
        <Heading />
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
