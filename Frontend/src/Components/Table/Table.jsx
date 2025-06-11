import { useEffect } from "react";
import styles from "./Table.module.css";
import { useInView } from "react-intersection-observer";
import ActionButton from "./ActionButton";
import LinearProgress from "@mui/material/LinearProgress";
const Table = ({
  title,
  action = null,
  queryObject,
  fields,
  serial = true,
}) => {
  const { ref, inView } = useInView();
  const data = queryObject.data;
  useEffect(() => {
    queryObject.fetchNextPage();
  }, [queryObject.fetchNextPage, inView]);

  return (
    <div className={styles["tableContainer"]}>
      <div className={styles["progressContainer"]}>
        {(queryObject.isLoading || queryObject.isFetching) && (
          <LinearProgress color="secondary" />
        )}
      </div>
      <div>
        <span className={styles["title"]}>{title}</span>
        <table className={styles["table"]}>
          <thead>
            <tr>
              {serial && <th>S/N</th>}
              {Object.keys(fields).map((item, idx) => {
                return <th key={idx}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data?.pages.map((item) => {
              const obj = item.hasOwnProperty("results") ? item.results : item;
              return obj.map((staff, idx) => {
                if (obj.length == idx + 1) {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      {Object.keys(fields).map((item, idx) => {
                        return <td key={idx}>{staff[fields[item]]}</td>;
                      })}

                      {action && (
                        <ActionButton
                          title={action.title}
                          pk={staff[action.pk]}
                        />
                      )}
                      <td ref={ref}></td>
                    </tr>
                  );
                }
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    {Object.keys(fields).map((item, idx) => {
                      return <td key={idx}>{staff[fields[item]]}</td>;
                    })}
                    {action && (
                      <ActionButton
                        title={action.title}
                        pk={staff[action.pk]}
                      />
                    )}
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
