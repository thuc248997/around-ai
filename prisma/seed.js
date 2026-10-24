// Creates the About page on an empty database. Safe to run repeatedly.
const { PrismaClient } = require("@prisma/client")
const { CONFIG } = require("../site.config")

const prisma = new PrismaClient()

async function main() {
  await prisma.post.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      slug: "about",
      title: "About",
      type: "PAGE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      summary: CONFIG.profile.bio,
      content: `## ${CONFIG.profile.name}\n\n**${CONFIG.profile.role}**\n\n${CONFIG.profile.bio}\n`,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
