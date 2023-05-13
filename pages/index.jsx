"use-client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession, useSession } from "next-auth/react";
import { Title, Card, Divider, TextInput } from "@tremor/react";
import { PuffLoader } from "react-spinners";
import axios from "axios";
import { GiCheckMark } from "react-icons/gi";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-hot-toast";

import { getToDos } from "@/lib/getData";
import prisma from "@/lib/prisma";
import Todos from "@/components/Todos";
import Loader from "@/components/Loader";
import SideBar from "@/components/SideBar";

export default function Home({ todos }) {
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClickMenu, setIsClickMenu] = useState(false);
  const router = useRouter();

  const isScreenWidthOver640 = useMediaQuery({
    query: "(min-width: 641px)",
  });

  const animateWidth = isScreenWidthOver640 ? "27vw" : "50vw";

  if (status === "loading") return <Loader />;

  function handleText(e) {
    setText(e.target.value);
  }

  // handle menu
  const handleMenu = () => {
    setIsClickMenu(!isClickMenu);
  };

  // submit function
  const newTodo = async () => {
    if (!session) {
      router.replace("/api/auth/signin");
      return null;
    }
    if (text !== "") {
      setIsLoading(true);
      const newTodo = await axios.post("/api/todo", {
        todo: text,
        userId: session.user.id,
      });

      if (newTodo.status === 201) {
        toast.success("Successfully  create!");
      }

      setText("");
      router.replace(router.asPath);
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e) => {
    if (text !== "" && e.key == "Enter") {
      if (!session) {
        router.replace("/api/auth/signin");
        return null;
      }

      setIsLoading(true);
      const newTodo = await axios.post("/api/todo", {
        todo: text,
        userId: session.user.id,
      });

      if (newTodo.status === 201) {
        toast.success("Successfully  create!");
      }

      setText("");
      router.replace(router.asPath);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Let&apos;s list</title>
      </Head>
      <main className="flex w-screen h-screen">
        <motion.div
          animate={{ width: isClickMenu ? animateWidth : "35px" }}
          className="fixed top-0 left-0 z-50 "
        >
          <SideBar handleMenu={handleMenu} isClickMenu={isClickMenu} />
        </motion.div>

        <section className="flex items-center justify-center h-full px-20 grow">
          <Card className="h-[90%] px-4 py-6 mx-auto select-none min-w-md bg-[#B5B3AE]/5 ring-slate-300">
            <Title className="text-xl font-bold text-center sm:text-3xl text-slate-800">
              Get things done!
            </Title>
            <Divider className="border border-slate-400" />

            <article className="flex gap-4 mb-4">
              <TextInput
                onKeyDown={handleKeyDown}
                value={text}
                onChange={handleText}
              />
              <button onClick={newTodo}>
                {isLoading ? (
                  <PuffLoader color="#23e9c2" size={15} />
                ) : (
                  <GiCheckMark />
                )}
              </button>
            </article>

            <Todos todos={todos} />
          </Card>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let todos = [];
  if (session?.user?.id) {
    todos = await getToDos(session.user.id, prisma);
  }
  todos = JSON.parse(JSON.stringify(todos));

  return {
    props: { todos },
  };
}
