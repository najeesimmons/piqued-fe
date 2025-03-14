import "@/styles/globals.css";
import {
  createBrowserSupabaseClient,
  SessionContextProvider,
} from "@supabase/auth-helpers-react";

export default function App({ Component, pageProps }) {
  const supabase = createBrowserSupabaseClient();
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
