import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/supabase";
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<{ user: User | null, setUser: (user: User | null) => void, isAuthLoading: boolean }>({ user: null, setUser: () => {}, isAuthLoading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) {
        setUser(data.user ?? null);
        setIsAuthLoading(false);
      } else {
        setIsAuthLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
