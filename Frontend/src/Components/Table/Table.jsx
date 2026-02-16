import { useEffect } from "react";
import styles from "./Table.module.css";
import { useInView } from "react-intersection-observer";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import Status from "./Status";
const Table = ({
  title,

  queryObject,
  fields,
  serial = true,
  height,
  color,
  actionButtons = [],
}) => {
  const { t } = useTranslation();
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
    return (
      <div
        style={{
          textAlign: "center",
          borderRadius: "0.2em",
          padding: "0.3em 1.2em",
          width: "fit-content",

          backgroundColor: Status[field],
          fontWeight: "800",
        }}
      >
        {t(field)}
      </div>
    );
  };

  const getDataTable = (arr) => {
    return arr?.map((res, idx) => (
      <tr key={idx}>
        <td className={styles["serial"]}></td>
        {Object.keys(fields).map((key, idx) => {
          const value = fields[key][1];
          if (key == "status") {
            return <td key={idx}>{getStatusHtml(get(res, value))}</td>;
          }
          if (typeof value === "function") {
            return <td key={idx}>{value(res, value)}</td>;
          }
          return <td key={idx}>{get(res, value)}</td>;
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
        <span className={styles["title"]}>{t(title)}</span>
        <table className={styles["table"]}>
          <thead>
            <tr>
              {serial && <th>{t("S/N")}</th>}
              {Object.keys(fields).map((key, idx) => {
                let val = data.pages?.[0]?.results
                  ? data.pages?.[0].results?.[0]
                  : data.pages?.[0][0];
                return <th key={idx}>{get(val, fields[key][0])}</th>;
              })}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pagination(data)}
            <tr style={{ border: "none" }}>
              <td></td>
            </tr>
            {!queryObject?.isFetching && (
              <tr ref={ref}>
                <td></td>
              </tr>
            )}
            <tr>
              <td>
                <div>
                  <br />
                </div>
              </td>
            </tr>
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
