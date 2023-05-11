import Navbar from "@/components/Navbar";
import Head from "next/head";
import React from "react";

export default function index({ children }) {
  return (
    <>
      <Head>
        <title>Let&apos;s list</title>
      </Head>
      <main className="flex flex-col w-screen h-screen select-none">
        <Navbar />
        {children}
      </main>
    </>
  );
}
