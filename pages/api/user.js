import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { name, id } = req.body;

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    });

    return res.status(200).json({ message: "Update successful!" });
  }

  return res.status(405).json({ message: "Method not allowed!" });
}
