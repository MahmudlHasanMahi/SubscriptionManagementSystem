import React from "react";
import styles from "./SelectTable.module.css";
const SelectTable = ({ title, objects }) => {
  return (
    <div className={styles["SelectTable"]}>
      <span>{title}</span>
      <table>
        <thead>
          <tr>
            {Object.keys(objects[0]).map((item, idx) => {
              return <th key={idx}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {objects.map((data, idx) => {
            return (
              <tr key={idx}>
                {Object.keys(data).map((items, idx) => {
                  return <td key={idx}>{data[items]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SelectTable;
