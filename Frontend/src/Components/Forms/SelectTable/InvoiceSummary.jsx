import styles from "./SelectTable.module.css";
import NumberFlow, { continuous } from "@number-flow/react";
const InvoiceSummary = ({ data }) => {
  return (
    <div className={styles["invoiceSummary"]}>
      {data.map((arr1) => (
        <>
          <div className={styles["invoiceSummary-linebreak"]}></div>
          <div className={styles["container"]}>
            {arr1.map((arr2) => (
              <>
                <div className={styles["title"]}>{arr2.title}</div>
                <div>
                  <NumberFlow
                    format={{
                      style: "currency",
                      currency: "USD",
                      trailingZeroDisplay: "auto",
                    }}
                    plugins={[continuous]}
                    value={arr2.value}
                  />
                </div>
              </>
            ))}
          </div>
        </>
      ))}
    </div>
  );
};

export default InvoiceSummary;
