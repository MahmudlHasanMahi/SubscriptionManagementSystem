import { useEffect } from "react";
import styles from "./Table.module.css";
import { useInView } from "react-intersection-observer";
import ActionButton from "./ActionButton";
import LinearProgress from "@mui/material/LinearProgress";
const Table = ({ header, title, key_pair, action, queryObject }) => {
  const { ref, inView } = useInView();
  const data = queryObject.data;
  useEffect(() => {
    queryObject.fetchNextPage();
  }, [queryObject.fetchNextPage, inView]);

  return (
    <div className={styles["tableContainer"]}>
      <div className={styles["progressContainer"]}>
        {queryObject.isLoading && <LinearProgress color="secondary" />}
      </div>
      <div>
        <span className={styles["title"]}>{title}</span>
        <table className={styles["table"]}>
          <thead>
            <tr>
              {header.map((item, idx) => {
                return <th key={idx}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data?.pages.map((item) => {
              return item.results.map((staff, idx) => {
                if (item.results.length == idx + 1) {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      {key_pair.map((keys, idx) => {
                        return <td key={idx}>{staff[keys]}</td>;
                      })}
                      {action && <ActionButton title={"Edit"} json={staff} />}
                      <td ref={ref}></td>
                    </tr>
                  );
                }
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    {key_pair.map((keys, idx) => {
                      return <td key={idx}>{staff[keys]}</td>;
                    })}
                    {action && <ActionButton title={"Edit"} json={staff} />}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
