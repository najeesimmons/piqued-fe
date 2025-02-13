import "@/styles/globals.css";
import { PhotoProvider } from "@/context/PhotoContext";

export default function App({ Component, pageProps }) {
  return (
    <PhotoProvider>
      <Component {...pageProps} />
    </PhotoProvider>
  );
}
