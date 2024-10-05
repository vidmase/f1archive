import React from 'react';
import "@/styles/globals.css";
import { Montserrat, Michroma } from "next/font/google";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

const inter = Montserrat({ subsets: ["latin"], weight: ["400"] });
const michroma = Michroma({ subsets: ["latin"], weight: ["400"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Head>
        <title>F1 Archive</title>
        <link rel="shortcut icon" href="/assets/images/f1Icon.png" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
