import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
