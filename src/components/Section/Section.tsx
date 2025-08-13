import { ReactNode } from "react";

function Section({ children }: { children: ReactNode }) {
  return <section className="w-full">{children}</section>;
}

export default Section;
