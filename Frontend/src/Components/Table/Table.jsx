import { useEffect } from "react";
import styles from "./Table.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
// import { fetchStaff } from "../../Features/staff";
import ActionButton from "./ActionButton";
import fetchStaff from "../../Utils/GetStaff";
const Table = ({
  header,
  title,
  key_pair,
  page_size = 10,
  action,
  queryObject,
}) => {
  const { ref, inView } = useInView();
  const dispatch = useDispatch();
  const data = queryObject.data;
  useEffect(() => {
    queryObject.fetchNextPage();
  }, [queryObject.fetchNextPage, inView]);

  return (
    <div className={styles["tableContainer"]}>
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
                    <>
                      <tr ref={ref} key={idx}>
                        <td>{idx + 1}</td>
                        {key_pair.map((keys, idx) => {
                          return <td key={idx}>{staff[keys]}</td>;
                        })}
                        {action && <ActionButton title={"Edit"} json={staff} />}
                      </tr>
                    </>
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
