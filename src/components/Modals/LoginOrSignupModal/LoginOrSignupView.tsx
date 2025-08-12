import Login from "@/components/Views/Auth/Login";
import ReactDOM from "react-dom";
import Section from "@/components/Section/Section";
import Signup from "@/components/Views/Auth/Signup";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/router";

interface LoginOrSignupModalProps {
  isOverflowRestoreDelayed?: boolean;
  setIsShowAuthCta: Dispatch<SetStateAction<boolean>>;
  setDisableComment?: Dispatch<SetStateAction<boolean>>;
}

export default function LoginOrSignupModal({
  isOverflowRestoreDelayed = false,
  setIsShowAuthCta,
  setDisableComment,
}: LoginOrSignupModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const router = useRouter();

  useEffect(() => {
    if (isOverflowRestoreDelayed) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverflowRestoreDelayed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsShowAuthCta(false);
        if (setDisableComment) setDisableComment(false);

        const { redirect, ...rest } = router.query;
        const newQuery = new URLSearchParams(rest as Record<string, string>).toString();
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
        <div className="p-4 w-[95vw] h-auto md:h-[90vh]">
          {authMode === "login" ? (
            <>
              <Login
                setAuthMode={setAuthMode}
                setDisableComment={setDisableComment!}
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
    document.getElementById("modal-root")!
  );
}
