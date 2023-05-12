import { Card, TextInput } from "@tremor/react";
import React, { useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";

import { PuffLoader } from "react-spinners";

export default function ModelBox({ todo, handleModel }) {
  const [text, setText] = useState(todo.todo);
  const [isTeskDone, setIsTeskDone] = useState(todo.isDone);
  const [isLoading, setIsLoading] = useState({
    complete: false,
    submit: false,
  });
  const router = useRouter();

  function handleNewToDo(e) {
    setText(e.target.value);
  }

  async function handleSubmit(e) {
    if (todo.todo !== text) {
      setIsLoading({ ...isLoading, submit: true });
      await axios.patch("/api/todo", {
        todo: text,
        id: todo.id,
      });
      router.replace(router.asPath);
      handleModel();
      setIsLoading({ ...isLoading, submit: false });
    }
  }

  async function handleKeyPress(e) {
    if (todo.todo !== text && e.key == "Enter") {
      setIsLoading({ ...isLoading, submit: true });
      await axios.patch("/api/todo", {
        todo: text,
        id: todo.id,
      });
      router.replace(router.asPath);
      handleModel();
      setIsLoading({ ...isLoading, submit: false });
    }
  }

  async function handleTeskDone() {
    setIsLoading({ ...isLoading, complete: true });
    const updatedIsDone = !isTeskDone;

    try {
      await axios.patch("/api/todo", {
        id: todo.id,
        isDone: updatedIsDone,
      });

      setIsTeskDone(updatedIsDone);
      router.replace(router.asPath);
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setIsLoading({ ...isLoading, complete: false });
  }

  return (
    <section
      onClick={handleModel}
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-slate-200/20"
    >
      <Card
        onClick={async (e) => {
          e.stopPropagation();
        }}
        className="flex items-center max-w-sm gap-4"
      >
        <TextInput
          className={`${todo.isDone ? "text-green-500" : "text-base"}`}
          disabled={todo.isDone}
          value={text}
          onKeyDown={handleKeyPress}
          onChange={handleNewToDo}
        />
        <div className="flex items-center gap-4">
          {/* for complete */}
          <button
            onClick={() => {
              handleTeskDone();
            }}
          >
            {isLoading.complete ? (
              <PuffLoader color="#23e9c2" size={15} />
            ) : (
              <AiOutlineCheckCircle color={`${todo.isDone ? "green" : ""}`} />
            )}
          </button>

          <button onClick={handleSubmit}>
            {isLoading.submit ? (
              <PuffLoader color="#23e9c2" size={15} />
            ) : (
              <GiCheckMark />
            )}
          </button>
        </div>
      </Card>
    </section>
  );
}
