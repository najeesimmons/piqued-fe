"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // Ensure you're importing the supabase client

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listener for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session); // This will log on login/logout
        setSession(session); // Update session state
        setUser(session ? session.user : null); // Update user state
      }
    );

    // Fetch session on initial mount (if there's an active session)
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Initial session:", session); // Log session on initial fetch
      setSession(session); // Set session
      setUser(session ? session.user : null); // Set user
    };

    fetchSession(); // Fetch session on mount

    return () => {
      authListener.remove(); // Cleanup the auth listener
    };
  }, []);

  useEffect(() => {
    console.log("Session state changed:", session); // Log whenever the session changes
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, user }}>
      {children}
    </SessionContext.Provider>
  );
};
