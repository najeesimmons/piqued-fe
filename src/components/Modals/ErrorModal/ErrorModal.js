"use client";
import { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

function ErrorModal({ isError, setisError }) {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  const handleClose = useCallback(() => {
    setisError(false);
  }, [setisError]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    if (isError) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isError]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
      <div className="flex flex-col p-4 w-[50vw] h-auto shadow-lg bg-white">
        <h1 className="mx-auto text-xl font-bold">Oops! 🙈</h1>
        <h2 className="mt-2">
          We ran into a little trouble loading more photos. Please close this
          window and scroll down to try again.
        </h2>
        <button
          className="mt-4 mx-auto px-2 py-2 w-1/2 md:w-1/4 bg-red-500 text-white font-semibold border border-red-700 hover:bg-red-600 transition duration-200"
          onClick={handleClose}
        >
          Exit
        </button>
      </div>
    </div>,
    modalRoot
  );
}

export default ErrorModal;
