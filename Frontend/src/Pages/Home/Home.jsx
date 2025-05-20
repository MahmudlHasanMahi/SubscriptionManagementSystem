import Navigation from "../../Components/Navigation/Navigation";
import Heading from "../../Components/Heading/Heading";
import Body from "../../Components/Body/Body";
import styles from "./Home.module.css";
import { Outlet } from "react-router-dom";
const Home = () => {
  return (
    <div className={styles["home"]}>
      <Navigation />
      <Heading />
      <Outlet />
    </div>
  );
};

export default Home;
