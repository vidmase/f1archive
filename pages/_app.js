import "@/styles/globals.css";
import { Francois_One, Inter, Montserrat, Michroma, Kite_One, Titillium_Web, Mulish } from "next/font/google";
import Head from "next/head";

const inter = Montserrat({ subsets: ["latin"], weight: ["400"] });
const michroma = Michroma({ subsets: ["latin"], weight: ["400"] });
const kiteOne = Kite_One({ subsets: ["latin"], weight: ["400"] });
const titilliumWeb = Titillium_Web({ subsets: ["latin"], weight: ["400"] });
const mulish = Mulish({ subsets: ["latin"], weight: ["400"] });

import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Head>
        <title>F1 Archive</title>
        <link rel="shortcut icon" href="/assets/images/f1Icon.png" />
      </Head>
      <Component {...pageProps} titilliumWebClass={titilliumWeb.className} kiteOneClass={kiteOne.className} mulishClass={mulish.className} />
      <Analytics />
    </main>
  );
}
