import { useEffect } from "react";
import styles from "./Table.module.css";
import { useInView } from "react-intersection-observer";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import get from "lodash/get";
import { motion } from "framer-motion";
import { border } from "@mui/system";
import { unescape } from "lodash";
const Table = ({
  title,

  queryObject,
  fields,
  serial = true,
  height,
  color,
  actionButtons = [],
}) => {
  const extractedColor = color.match(/\d+,\s*\d+,\s*\d+/)[0];
  const { ref, inView } = useInView({ triggerOnce: true });
  const data = queryObject.data || [];
  useEffect(() => {
    if (queryObject.fetchNextPage) queryObject.fetchNextPage();
  }, [inView]);

  const cloneElement = (actionButton, id, idx) => {
    return React.cloneElement(actionButton, {
      key: idx,
      pk: id,
    });
  };
  const getActionButton = (id, res) => {
    return actionButtons.map((button, idx) => {
      return cloneElement(button, id, idx);
    });
  };

  const getStatusHtml = (field) => {
    let color;
    switch (field) {
      case "PENDING":
        color = "rgb(155, 142, 69)";
        break;
      case "ACTIVE":
        color = "rgb(53, 94, 33)";
        break;
      case "SCHEDULED":
        color = "rgb(76, 77, 145)";
        break;
      case "DEACTIVE":
        break;
      case "REJECTED":
        color = "rgb(151 4 88)";
        break;
      case "CANCELLED":
        color = "rgb(95 27 27)";
        break;
      case "EXPIRED":
        color = "rgba(76, 76, 76, 1)";
        break;
      default:
        color = null;
    }

    return (
      <div
        style={{
          textAlign: "center",
          borderRadius: "0.2em",
          padding: "0.2em",
          width: "70%",
          backgroundColor: color,
          fontWeight: "800",
        }}
      >
        {field}
      </div>
    );
  };

  const getDataTable = (arr) => {
    return arr?.map((res, idx) => (
      <tr key={idx}>
        <td className={styles["serial"]}></td>
        {Object.keys(fields).map((field, idx) => {
          if (field == "status") {
            return <td key={idx}>{getStatusHtml(get(res, fields[field]))}</td>;
          } else {
          }
          return <td key={idx}>{get(res, fields[field])}</td>;
        })}

        <td
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "end",
            gap: "1em",
            paddingInline: "1em",
          }}
        >
          {getActionButton(res["id"], res)}
        </td>
      </tr>
    ));
  };

  const pagination = (object) => {
    let table = null;
    if (Object.hasOwn(object, "pages")) {
      table = object.pages.map((page) => {
        if (page.results) return getDataTable(page.results);
        return getDataTable(page);
      });
    } else {
      table = getDataTable(object);
    }
    return table;
  };

  return (
    <div
      style={{ height: height, backgroundColor: color }}
      className={styles["tableContainer"]}
    >
      <div className={styles["progressContainer"]}>
        {(queryObject?.isLoading || queryObject?.isFetching) && (
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
            {pagination(data)}
            <tr style={{ border: "none" }}>
              <td></td>
            </tr>
            {!queryObject?.isFetching && <tr ref={ref}></tr>}
            <div>
              <br />
            </div>
          </tbody>
        </table>
      </div>
      <div
        style={{
          background: `linear-gradient(1deg,rgba(${extractedColor}, 1) 30%, rgba( ${extractedColor},0.6) 100%)`,
        }}
      ></div>
    </div>
  );
};

export default Table;
