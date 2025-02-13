import { createContext, useContext, useState } from "react";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [activePhoto, setActivePhoto] = useState(null);
  return (
    <PhotoContext.Provider value={{ activePhoto, setActivePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhoto() {
  return useContext(PhotoContext);
}
