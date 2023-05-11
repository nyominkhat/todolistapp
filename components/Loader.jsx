import React from 'react'
import { PuffLoader } from 'react-spinners';

export default function Loader() {
  return (
    <section className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen">
      <PuffLoader color="#23e9c2" />
    </section>
  );
}
