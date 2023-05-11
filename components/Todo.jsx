import React, { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import ModelBox from "./ModelBox";

export default function Todo({ todo }) {
  const router = useRouter();

  const [showModel, setShowModel] = useState(false);

  function handleModel() {
    setShowModel(!showModel);
  }

  async function handleDel(id) {
    await axios.delete(`/api/todos/` + id);

    router.replace(router.asPath);
  }

  return (
    <article className="flex items-center justify-between px-4 py-2 border rounded-md">
      <h3
        className={`${
          todo.isDone ? "text-green-600 line-through" : "text-base"
        }`}
      >
        {todo.todo}
      </h3>

      <div className="flex items-center gap-4">
        <button onClick={handleModel}>
          <HiOutlinePencilAlt />
        </button>
        <button onClick={() => handleDel(todo.id)}>
          <AiFillDelete />
        </button>
      </div>

      {showModel && <ModelBox todo={todo} handleModel={handleModel} />}
      {/* <ModelBox todo={todo}/> */}
    </article>
  );
}
