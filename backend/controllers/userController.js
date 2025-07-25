import prisma from "../lib/prisma.js";

// Get all users with optional skill stack filter
export const getUsers = async (req, res) => {
  try {
    console.log('📦 Fetching all users...');
    const { stack, page = 1, limit = 0 } = req.query;
    let where = {};

    if (stack) {
      const skillNames = stack.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillNames.length > 0) {
        where.skills = {
          some: {
            skill: {
              name: { in: skillNames },
            },
          },
        };
      }
    }

    const take = parseInt(limit, 10) || undefined;
    const skip = take ? (parseInt(page, 10) - 1) * take : undefined;

    const users = await prisma.user.findMany({
      where,
      include: {
        skills: { include: { skill: true } },
        projects: true, // <-- Add this line to include projects for each user
      },
      ...(take && { take }),
      ...(skip && { skip }),
    });
    console.log('✅ Users found:', users.length);

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    if (
      error.message?.includes("connect to the database") ||
      error.message?.includes("Can't reach database server") ||
      error.constructor.name === "PrismaClientInitializationError"
    ) {
      return res.status(503).json({
        error: "Database connection failed. Please ensure PostgreSQL is running.",
      });
    }
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get user by Firebase UID
export const getUserByFirebaseUid = async (req, res) => {
  const { firebaseUid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        skills: { include: { skill: true } },
        projects: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by Firebase UID:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  let { firebaseUid, name, email, skills = [], featuredProjects = [], projects, discordOrContact, ...rest } = req.body;
  skills = skills.filter((s) => s.skillId?.trim());

  try {
    // Check if email is already used by another firebaseUid
    const existingWithEmail = await prisma.user.findUnique({ where: { email } });
    if (existingWithEmail && existingWithEmail.firebaseUid !== firebaseUid) {
      return res.status(400).json({ error: "Email is already used by another account." });
    }
    const skillRelations = [];
    const seenSkillIds = new Set();

    for (const s of skills) {
      const skillName = s.skillId.trim();
      const level = s.level || "Beginner";
      if (seenSkillIds.has(skillName)) continue;
      seenSkillIds.add(skillName);

      let skill = await prisma.skill.findUnique({ where: { name: skillName } });
      if (!skill) {
        skill = await prisma.skill.create({ data: { name: skillName } });
      }

      skillRelations.push({ skillId: skill.id, level });
    }

    const userData = {
      firebaseUid,
      name,
      email,
      featuredProjects,
      ...rest,
      ...(discordOrContact && { discordOrContact }),
      ...(skillRelations.length > 0 && { skills: { create: skillRelations } }),
    };

    // Final safeguard: remove projects if present
    delete userData.projects;

    // Create user (email uniqueness already checked above)
    const user = await prisma.user.create({ data: userData });

    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Error in createUser:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update or create user by Firebase UID
export const updateUserByFirebaseUid = async (req, res) => {
  const { firebaseUid } = req.params;
  let {
    name,
    email,
    bio,
    githubUrl,
    portfolioUrl,
    availability,
    academicYear,
    branch,
    interests,
    skills = [],
    featuredProjects = [],
    discordOrContact,
  } = req.body;
  // Ensure featuredProjects is always an array
  if (!Array.isArray(featuredProjects)) {
    console.error("[updateUserByFirebaseUid] featuredProjects is not an array:", featuredProjects);
    featuredProjects = [];
  }
  // Ensure skills is always an array
  if (!Array.isArray(skills)) {
    console.error("[updateUserByFirebaseUid] skills is not an array:", skills);
    skills = [];
  }
  skills = skills.filter((s) => s.skillId?.trim());

  try {
    const skillRelations = [];
    const seenSkillIds = new Set();

    for (const s of skills) {
      const skillName = s.skillId.trim();
      const level = s.level || "Beginner";
      if (seenSkillIds.has(skillName)) continue;
      seenSkillIds.add(skillName);

      let skill = await prisma.skill.findUnique({ where: { name: skillName } });
      if (!skill) {
        skill = await prisma.skill.create({ data: { name: skillName } });
      }

      skillRelations.push({ skillId: skill.id, level });
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: {
        name,
        email,
        bio,
        githubUrl,
        portfolioUrl,
        availability,
        academicYear,
        branch,
        interests,
        featuredProjects,
        discordOrContact,
        skills: {
          deleteMany: {},
          ...(skillRelations.length > 0 && { create: skillRelations }),
        },
      },
      create: {
        firebaseUid,
        name,
        email,
        bio,
        githubUrl,
        portfolioUrl,
        availability,
        academicYear,
        branch,
        interests,
        featuredProjects,
        discordOrContact,
        skills: {
          create: skillRelations,
        },
      },
      include: {
        skills: { include: { skill: true } },
      },
    });

    res.json(user);
  } catch (err) {
    console.error("❌ Error in updateUserByFirebaseUid:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get user projects by Firebase UID
export const getUserProjects = async (req, res) => {
  const { firebaseUid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        projects: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.projects);
  } catch (err) {
    console.error("Error fetching user projects:", err);
    res.status(500).json({ error: "Failed to fetch user projects" });
  }
};

// Get user collaborations by Firebase UID
export const getUserCollaborations = async (req, res) => {
  const { firebaseUid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        collaboratedProjects: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.collaboratedProjects);
  } catch (err) {
    console.error("Error fetching user collaborations:", err);
    res.status(500).json({ error: "Failed to fetch user collaborations" });
  }
};

// Get user collaborations by user ID (not Firebase UID)
export const getUserCollaborationsById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        collaboratedProjects: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.collaboratedProjects);
  } catch (err) {
    console.error("Error fetching user collaborations by ID:", err);
    res.status(500).json({ error: "Failed to fetch user collaborations" });
  }
};

// Get user projects by user ID (not Firebase UID)
export const getUserProjectsById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.projects);
  } catch (err) {
    console.error("Error fetching user projects by ID:", err);
    res.status(500).json({ error: "Failed to fetch user projects" });
  }
};
