import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await prisma.todo.delete({
      where: {
        id: parseInt(req.query.id),
      },
    });

    return res.status(200).json({ message: "Delete successful!" });
  }

  return res.status(405).json({ message: "Method not allowed!" });
}
