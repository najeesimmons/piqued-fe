import ReactDOM from "react-dom";

function ErrorModal() {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
      <div className="flex flex-col md:flex-row p-4 w-[90vw] h-auto md:h-[90vh] shadow-lg bg-white">
        <h1>Error</h1>
        <button onClick={() => console.log("close the error modal")}>
          Exit
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default ErrorModal;
