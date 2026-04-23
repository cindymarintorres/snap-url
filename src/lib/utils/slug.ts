import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/db/prisma";

// URL-safe characters, no ambiguous (0, O, l, 1)
const generateNanoid = customAlphabet(
  "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789",
  6,
);

export async function generateUniqueSlug(): Promise<string> {
  let slug = generateNanoid();
  let exists = await prisma.link.findUnique({
    where: { slug },
    select: { id: true },
  });

  while (exists) {
    slug = generateNanoid();
    exists = await prisma.link.findUnique({
      where: { slug },
      select: { id: true },
    });
  }

  return slug;
}
