import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
}
