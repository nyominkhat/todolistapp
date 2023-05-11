export async function getToDos(userId, prisma) {
  const todos = await prisma.todo.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
    },
    orderBy: [{ id: "desc" }],
    // orderBy: [{ id: "asc" }],
  });

  return todos;
}
