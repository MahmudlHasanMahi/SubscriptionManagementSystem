import React, { useEffect } from "react";
import styles from "./Table.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
import { fetchStaff } from "../../Features/staff";
import ActionButton from "./ActionButton";
const Table = ({ header, title, key_pair, page_size = 10, action }) => {
  const { ref, inView } = useInView();
  const dispatch = useDispatch();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["stafflist"],

      queryFn: (args) => {
        return dispatch(fetchStaff({ ...args, count: false }));
      },
      initialPageParam: `http://127.0.0.1:8000/user/staff-list?page=${btoa(
        null
      )}&page_size=${page_size}`,
      getNextPageParam: (props) => {
        return props.payload.next;
      },
      staleTime: 10 * 1000,
    });
  useEffect(() => {
    fetchNextPage();
  }, [inView, fetchNextPage]);

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
          <tbody ref={ref}>
            {data?.pages.map((item) => {
              return item.payload.results.map((staff, idx) => {
                if (item.payload.results.length == idx + 1) {
                  return (
                    <>
                      <tr ref={ref} key={idx}>
                        <td>{idx}</td>

                        {key_pair.map((keys, idx) => {
                          return <td key={idx}>{staff[keys]}</td>;
                        })}
                        {action && <ActionButton title={"Edit"} json={staff}/>}
                      </tr>
                    </>
                  );
                }
                return (
                  <tr key={idx}>
                    <td>{idx}</td>
                    {key_pair.map((keys, idx) => {
                      return <td key={idx}>{staff[keys]}</td>;
                    })}
                    {action && <ActionButton title={"Edit"} json={staff}/>}
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
