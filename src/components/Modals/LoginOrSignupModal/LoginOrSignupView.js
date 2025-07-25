import Login from "@/components/Views/Auth/Login";
import ReactDOM from "react-dom";
import Section from "@/components/Section/Section";
import Signup from "@/components/Views/Auth/Signup";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";

export default function LoginOrSignupModal({ setIsShowAuthCta }) {
  const [authMode, setAuthMode] = useState("login");

  return ReactDOM.createPortal(
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
        <div className="flex flex-col md:flex-row p-4 w-[90vw] h-auto md:h-[90vh] shadow-lg bg-white relative">
          <button
            onClick={() => setIsShowAuthCta(false)}
            className="absolute top-4 left-4 text-3xl z-[10000]"
            aria-label="Close Modal"
          >
            <IoCloseSharp color="black" size={35} />
          </button>

          {authMode === "login" ? (
            <Login
              setAuthMode={setAuthMode}
              setIsShowAuthCta={setIsShowAuthCta}
            />
          ) : (
            <Signup
              setAuthMode={setAuthMode}
              setIsShowAuthCta={setIsShowAuthCta}
            />
          )}
        </div>
      </div>
    </Section>,
    document.getElementById("modal-root")
  );
}
