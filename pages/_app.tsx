import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { DM_Sans } from "next/font/google";
const dm = DM_Sans({
  fallback: ["system-ui", "arial"],
  weight: ["500", "700"],
  display: "swap",
  style: ["normal"],
  subsets: ["latin"],
  variable: "--root-font",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          html {
            --root-font: ${dm.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
