"use client";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function ErrorModal({ setisError }) {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  const handleClose = () => {
    setisError(false);
  };

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
      <div className="flex flex-col p-4 w-[50vw] h-auto shadow-lg bg-white">
        <h1>Error</h1>
        <button onClick={handleClose}>Exit</button>
      </div>
    </div>,
    modalRoot
  );
}

export default ErrorModal;
