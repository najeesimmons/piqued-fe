import Login from "@/components/Views/Auth/Login";
import ReactDOM from "react-dom";
import Section from "@/components/Section/Section";
import Signup from "@/components/Views/Auth/Signup";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LoginOrSignupModal({
  setIsShowAuthCta,
  setDisableComment,
}) {
  const [authMode, setAuthMode] = useState("login");

  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsShowAuthCta(false);
        setDisableComment?.(false);

        const { redirect, ...rest } = router.query;
        const newQuery = new URLSearchParams(rest).toString();
        const newUrl = `${router.pathname}${newQuery ? `?${newQuery}` : ""}`;

        router.replace(newUrl, undefined, { shallow: true });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setDisableComment, setIsShowAuthCta, router]);

  return ReactDOM.createPortal(
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
        <div className="p-4 w-[90vw] h-auto md:h-[90vh] shadow-lg">
          {authMode === "login" ? (
            <>
              <Login
                setAuthMode={setAuthMode}
                setDisableComment={setDisableComment}
                setIsShowAuthCta={setIsShowAuthCta}
              />
            </>
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
