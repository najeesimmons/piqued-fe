import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentSession = supabase.auth.session();
    setSession(currentSession);
    setUser(supabase.auth.user());

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session ? session.user : null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, user }}>
      {children}
    </SessionContext.Provider>
  );
};
