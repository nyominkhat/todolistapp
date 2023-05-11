import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Title, Card } from "@tremor/react";
import Profile from "./profile";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState("");

  console.log(session);

  function handleShowProfile() {
    setShowProfile(!showProfile);
  }

  return (
    <nav className="shadow">
      <div className="flex flex-col items-center justify-between gap-4 py-4 w-[15vw] h-screen">
        <Title className="font-bold">Let&rsquo;s list</Title>
        {session && status === "authenticated" ? (
          <div className="flex flex-col items-center w-full px-4 grow">
            <Card
              onClick={handleShowProfile}
              className="mt-20 transition-all cursor-pointer hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <figure className="rounded-full h-14 w-14">
                  <img
                    className="object-cover w-full h-full rounded-full"
                    src={String(session.user.image)}
                  />
                </figure>
                <p className="font-semibold text-[#374151]/95">
                  {/* {session.user ? session.user.name : null} */}
                  {name !== "" ? name : session.user ? session.user.name : null}
                </p>
              </div>
            </Card>

            <button
              className="px-4 py-2 mt-auto mb-20 text-sm font-semibold text-white transition-all bg-indigo-500 rounded x-4 hover:bg-indigo-600 hover:shadow"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            className="px-4 py-2 text-sm font-semibold text-white transition-all bg-indigo-500 rounded hover:bg-indigo-600 hover:shadow"
            href="/api/auth/signin"
          >
            Login
          </Link>
        )}
      </div>

      {showProfile && (
        <Profile
          handleShowProfile={handleShowProfile}
          name={name}
          setName={setName}
        />
      )}
    </nav>
  );
}
