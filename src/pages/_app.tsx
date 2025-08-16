import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import type { AppProps as NextAppProps } from "next/app";

interface AppProps extends NextAppProps {
  Component: React.ComponentType<NextAppProps["pageProps"]>;
  pageProps: NextAppProps["pageProps"];
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
