import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";

export default function App({ Component, pageProps }: AppProps) {
  const theme = useBoardStore(state => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <Component {...pageProps} />;
};
