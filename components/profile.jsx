import Loader from "@/components/Loader";
import { Button, Card, Divider, TextInput } from "@tremor/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { GiCheckMark } from "react-icons/gi";
import { PuffLoader } from "react-spinners";

export default function Profile({ handleShowProfile, name, setName }) {
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setText(session?.user?.name);
  }, [session?.user.name]);

  if (status === "loading") return <Loader />;

  const formatJoiningDate = (dateString) => {
    const currentDate = new Date();
    const joinDate = new Date(dateString);
    const timeDiff = currentDate.getTime() - joinDate.getTime();

    const oneHour = 1000 * 60 * 60;
    const oneDay = oneHour * 24;
    const oneMonth = oneDay * 30.4375;
    const oneYear = oneDay * 365.25;

    const yearsDiff = Math.floor(timeDiff / oneYear);
    const monthsDiff = Math.floor((timeDiff % oneYear) / oneMonth);
    const daysDiff = Math.floor(((timeDiff % oneYear) % oneMonth) / oneDay);
    const hoursDiff = Math.floor(
      (((timeDiff % oneYear) % oneMonth) % oneDay) / oneHour
    );

    let duration = "";

    if (yearsDiff > 0) {
      duration += `${yearsDiff} year${yearsDiff > 1 ? "s" : ""}`;
    }

    if (monthsDiff > 0) {
      duration += `${duration.length > 0 ? ", " : ""}${monthsDiff} month${
        monthsDiff > 1 ? "s" : ""
      }`;
    }

    if (daysDiff > 0) {
      duration += `${duration.length > 0 ? ", " : ""}${daysDiff} day${
        daysDiff > 1 ? "s" : ""
      }`;
    }

    if (hoursDiff > 0) {
      duration += `${duration.length > 0 ? ", " : ""}${hoursDiff} hour${
        hoursDiff > 1 ? "s" : ""
      }`;
    }

    return duration.length > 0 ? `${duration} ago` : "Just now";
  };

  const handleText = (e) => {
    setText(e.target.value);
  };

  const onSubmit = async () => {
    if (session.user.name !== text) {
      setIsLoading(true);
      await axios.patch("/api/user", { name: text, id: session.user.id });
      router.replace(router.asPath);
      setIsLoading(false);
      setName(text);
    }
  };

  return (
    <section
      onClick={handleShowProfile}
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-slate-200/50 "
    >
      <Card
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="max-w-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <figure className="rounded-full h-14 w-14">
              <img
                className="object-cover w-full h-full rounded-full"
                src={session.user.image.toString()}
              />
            </figure>

            <h2 className="text-xl font-semibold text-slate-700">
              {name !== "" ? name : session.user.name}
            </h2>
          </div>

          <p className="flex flex-col items-start justify-center w-1/4 h-20 pl-4 font-semibold border-l">
            <span className="text-lg text-slate-400">Joined</span>
            <span className="text-slate-700">
              {formatJoiningDate(session.user.createdAt)}
            </span>
          </p>
        </div>

        <Divider className="border border-slate-400" />

        <div className="space-y-2">
          <label htmlFor="name" className="font-semibold text-slate-800">
            Change your name
          </label>

          <article className="flex gap-4 mb-4">
            <TextInput
              id="name"
              // value={text}
              defaultValue={
                name !== "" ? name : session.user ? session.user.name : null
              }
              onChange={handleText}
              placeholder="your name ..."
            />
            <button onClick={onSubmit}>
              {isLoading ? (
                <PuffLoader color="#23e9c2" size={15} />
              ) : (
                <GiCheckMark />
              )}
            </button>
          </article>
        </div>

        <Divider className="border border-slate-400" />

        <Button onClick={handleShowProfile}>Close</Button>
      </Card>
    </section>
  );
}
