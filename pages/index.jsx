import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { Title, Card, Divider, TextInput } from "@tremor/react";
import { PuffLoader } from "react-spinners";
import axios from "axios";
import { GiCheckMark } from "react-icons/gi";

import Layout from "@/layout";
import { getToDos } from "@/lib/getData";
import prisma from "@/lib/prisma";
import Todos from "@/components/Todos";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";

export default function Home({ todos }) {
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log(session);

  if (status === "loading") return <Loader />;

  // console.log(session);
  // console.log(todos);

  if (!session) {
    router.replace("/api/auth/signin");
    return null;
  }

  function handleText(e) {
    setText(e.target.value);
  }

  const newTodo = async () => {
    setIsLoading(true);
    await axios.post("/api/todo", { todo: text, userId: session.user.id });
    setText("");
    router.replace(router.asPath);
    setIsLoading(false);
  };

  return (
    <>
      <Layout>
        <section className="flex items-center justify-center grow">
          <Card className="max-w-md px-4 py-6 mx-auto select-none">
            <Title className="font-semibold text-center">
              Get things done!
            </Title>
            <Divider />

            <article className="flex gap-4 mb-4">
              <TextInput value={text} className={``} onChange={handleText} />
              <button onClick={newTodo}>
                {isLoading ? <PuffLoader color="#23e9c2" /> : <GiCheckMark />}
              </button>
            </article>

            <Todos todos={todos} />
          </Card>
        </section>
      </Layout>
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
