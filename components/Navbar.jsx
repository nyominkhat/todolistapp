import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Title } from "@tremor/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="shadow">
      <div className="container flex items-center justify-between gap-4 py-4 mx-auto">
        <Title className="font-bold">Let&rsquo;s list</Title>
        {session && status === "authenticated" ? (
          <>
            <p>{session.user ? session.user.name : null}</p>
            <button
              className="px-4 py-2 text-sm text-white bg-indigo-500 rounded hover:bg-indigo-600 hover:shadow"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            className="px-4 py-2 text-sm text-white bg-indigo-500 rounded hover:bg-indigo-600 hover:shadow"
            href="/api/auth/signin"
          >
            login
          </Link>
        )}
      </div>
    </nav>
  );
}
