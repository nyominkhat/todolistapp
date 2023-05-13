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

  const initialX = isScreenWidthOver640 ? -120 : -70;
  const animateX = isClickMenu ? 0 : initialX;

  // console.log(session);

  if (status === "loading") return <Loader />;

  if (!session) {
    router.replace("/api/auth/signin");
    return null;
  }

  function handleText(e) {
    setText(e.target.value);
  }

  // submit function
  const newTodo = async () => {
    if (text !== "") {
      setIsLoading(true);
      await axios.post("/api/todo", { todo: text, userId: session.user.id });
      setText("");
      router.replace(router.asPath);
      setIsLoading(false);
    }
  };

  // handle menu
  const handleMenu = () => {
    setIsClickMenu(!isClickMenu);
  };

  const handleKeyDown = async (e) => {
    if (text !== "" && e.key == "Enter") {
      setIsLoading(true);
      await axios.post("/api/todo", { todo: text, userId: session.user.id });
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
      <div className="flex w-screen h-screen">
        <motion.div
          initial={{ x: initialX }}
          animate={{ x: animateX }}
          className={`${
            isClickMenu
              ? "w-[40vw] md:w-[30vw] lg:w-[15vw]"
              : "md:-mr-36 -mr-20"
          } `}
        >
          <SideBar handleMenu={handleMenu} isClickMenu={isClickMenu} />
        </motion.div>

        <section className="flex items-center justify-center h-full px-10 grow">
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
      </div>
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
