import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get All Projects — optionally filtered by Clerk user ID
export const getAllProjects = async (req, res) => {
  try {
    const { createdBy } = req.query;

    let userIdFilter = undefined;

    // If ?createdBy=clerkId is present in query, find internal user.id
    if (createdBy) {
      const user = await prisma.user.findUnique({
        where: { clerkId: createdBy },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found for the provided Clerk ID" });
      }

      userIdFilter = user.id;
    }

    const projects = await prisma.project.findMany({
      where: userIdFilter ? { creatorId: userIdFilter } : undefined,
      include: {
        creator: true, // optional: populate creator info
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};