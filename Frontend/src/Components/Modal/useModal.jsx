import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const ModalComponent = ({ open, close, resolve, children, custom }) => {
  if (!open) return null;

  const choose = (value) => {
    resolve?.(value);
    close();
  };

  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} onClick={() => choose(null)}></div>
      <div className={styles.modal}>
        {children}
        {!custom && (
          <div className={styles["btn-wrapper"]}>
            <button onClick={() => choose(false)}>Cancel</button>
            <button onClick={() => choose(true)}>Ok</button>
          </div>
        )}
      </div>
    </>,
    document.getElementById("portal"),
  );
};

const useModal = ({ custom = false }) => {
  const [open, setOpen] = useState(false);
  const resolver = useRef(null);

  // Promise-based modal
  const showModal = () =>
    new Promise((resolve) => {
      resolver.current = resolve;
      setOpen(true);
    });

  // Direct open
  const openModal = () => setOpen(true);

  // Direct close
  const closeModal = (value = false) => {
    setOpen(false);
    resolver.current?.(value); // resolve with whatever value you pass
  };

  const Modal = ({ children }) => (
    <ModalComponent
      open={open}
      close={closeModal}
      resolve={(value) => resolver.current?.(value)}
      custom={custom}
    >
      {children}
    </ModalComponent>
  );

  // Return object with all controls
  return { showModal, openModal, closeModal, Modal };
};

export default useModal;
