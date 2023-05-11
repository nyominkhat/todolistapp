import { Card, TextInput } from "@tremor/react";
import React, { useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";

export default function ModelBox({ todo, handleModel }) {
  const [text, setText] = useState(todo.todo);
  const [isTeskDone, setIsTeskDone] = useState(todo.isDone);
  const router = useRouter();

  function handleNewToDo(e) {
    setText(e.target.value);
  }

  async function handleSubmit() {
    await axios.patch("/api/todo", {
      todo: text,
      id: todo.id,
    });
     router.replace(router.asPath);
    handleModel();
  }

  async function handleTeskDone() {
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
          onChange={handleNewToDo}
        />
        <div className="flex items-center gap-4">
          {/* for complete */}
          <button
            onClick={() => {
              handleTeskDone();
            }}
          >
            <AiOutlineCheckCircle color={`${todo.isDone ? "green" : ""}`} />
          </button>

          <button onClick={handleSubmit}>
            <GiCheckMark />
          </button>
        </div>
      </Card>
    </section>
  );
}
