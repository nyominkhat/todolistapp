import React from "react";
import Todo from "./Todo";

export default function Todos({ todos }) {
  return (
    <section>
      <div className="space-y-3">
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
    </section>
  );
}
