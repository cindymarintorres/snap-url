import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const generateNanoid = customAlphabet(
  "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789",
  6
);

async function main() {
  console.log("🌱 Seeding database...");

  // Crear usuario de prueba
  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@snapurl.dev" },
    update: {},
    create: {
      email: "demo@snapurl.dev",
      name: "Demo User",
      passwordHash,
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // Crear links de prueba
  const sampleLinks = [
    {
      slug: generateNanoid(),
      originalUrl: "https://github.com",
      title: "GitHub",
      isActive: true,
    },
    {
      slug: generateNanoid(),
      originalUrl: "https://nextjs.org/docs",
      title: "Next.js Docs",
      isActive: true,
    },
    {
      slug: generateNanoid(),
      originalUrl: "https://tailwindcss.com",
      title: "Tailwind CSS",
      isActive: false,
    },
    {
      slug: generateNanoid(),
      originalUrl: "https://prisma.io",
      title: "Prisma",
      isActive: true,
    },
    {
      slug: generateNanoid(),
      originalUrl: "https://vercel.com",
      title: "Vercel",
      isActive: true,
    },
  ];

  for (const linkData of sampleLinks) {
    const link = await prisma.link.upsert({
      where: { slug: linkData.slug },
      update: {},
      create: {
        ...linkData,
        userId: user.id,
      },
    });

    // Crear algunos clicks de prueba
    const clickCount = Math.floor(Math.random() * 30);
    for (let i = 0; i < clickCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const clickDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      await prisma.click.create({
        data: {
          linkId: link.id,
          visitorIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: "Mozilla/5.0 (Seed Data)",
          referer: ["https://google.com", "https://twitter.com", "", "https://linkedin.com"][
            Math.floor(Math.random() * 4)
          ],
          clickedAt: clickDate,
        },
      });
    }

    console.log(`✅ Link: ${link.slug} → ${link.originalUrl} (${clickCount} clicks)`);
  }

  console.log("🏁 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
