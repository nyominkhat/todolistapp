import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { todo, userId } = req.body;

    await prisma.todo.create({
      data: {
        todo: todo,
        userId: userId,
      },
    });

    return res.status(201).json({ message: "Create successful!" });
  }

  if (req.method === "PATCH") {
    const { todo, id, isDone } = req.body;

    await prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        todo: todo,
        isDone: isDone,
      },
    });

    return res.status(200).json({ message: "Update successful!" });
  }

  return res.status(405).json({ message: "Method not allowed!" });
}
