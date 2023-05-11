import Navbar from "@/components/Navbar";
import Head from "next/head";
import React from "react";

export default function index({ children }) {
  return (
    <>
      <Head>
        <title>Let&apos;s list</title>
      </Head>
      <main className="flex w-screen h-screen border-8 select-none ">
        <Navbar />
        <div className="grow">{children}</div>
      </main>
    </>
  );
}
