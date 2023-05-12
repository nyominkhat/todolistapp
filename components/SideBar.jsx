import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { Title, Card } from "@tremor/react";
import Profile from "./profile";
import { HiMenu } from "react-icons/hi";

export default function SideBar({ handleMenu, isClickMenu }) {
  const { data: session, status } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState("");

  function handleShowProfile() {
    if (isClickMenu) {
      setShowProfile(!showProfile);
    }
  }

  return (
    <>
      <aside className="flex flex-col items-center justify-between w-full h-screen gap-4 py-4 shadow">
        <div className="relative flex items-center w-full px-2 sm:px-4">
          <Title className="font-bold text-md sm:text-xl">
            Let&rsquo;s list
          </Title>
          <figure
            onClick={handleMenu}
            className="absolute flex items-center justify-center w-10 h-10 transition-all bg-white border rounded-full shadow-sm cursor-pointer -right-5 hover:bg-slate-500 hover:text-white hover:scale-105 sm:hover:w-12 sm:hover:h-12 sm:hover:-right-6"
          >
            <HiMenu />
          </figure>
        </div>
        {session && status === "authenticated" ? (
          <div className="flex flex-col items-center w-full px-2 sm:px-4 grow">
            <Card
              onClick={handleShowProfile}
              className={`mt-20 transition-all sm:p-1.5 ring-white shadow-none p-0 sm:h-20 h-10${
                isClickMenu &&
                " hover:scale-105 cursor-pointer ring-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-center w-full h-full overflow-hidden sm:justify-between">
                <figure className="hidden w-8 h-8 rounded-full sm:h-10 sm:w-10 sm:flex">
                  <img
                    className="object-cover w-full h-full rounded-full"
                    src={String(session.user.image)}
                  />
                </figure>
                <p
                  className={`font-semibold ${
                    isClickMenu ? "text-[#374151]/95" : "text-white"
                  } text-xs sm:text-base`}
                >
                  {name !== "" ? name : session.user ? session.user.name : null}
                </p>
              </div>
            </Card>

            <button
              disabled={!isClickMenu}
              className={`px-4 py-2 mt-auto mb-20 text-sm font-semibold text-white transition-all ${
                isClickMenu && "bg-indigo-500  hover:bg-indigo-600"
              } rounded x-4 hover:shadow`}
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
      </aside>

      {showProfile && (
        <Profile
          handleShowProfile={handleShowProfile}
          name={name}
          setName={setName}
        />
      )}
    </>
  );
}
