import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type ReflectionId,
  reflectionIdSchema,
  reflections
} from "@/lib/db/schema/reflections";
import { books } from "@/lib/db/schema/books";

export const getReflections = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ reflection: reflections, book: books })
    .from(reflections)
    .leftJoin(books, eq(reflections.bookId, books.id))
    .where(eq(reflections.userId, session?.user.id!));
  const r = rows.map((r) => ({ ...r.reflection, book: r.book }));
  return { reflections: r };
};

export const getReflectionById = async (id: ReflectionId) => {
  const { session } = await getUserAuth();
  const { id: reflectionId } = reflectionIdSchema.parse({ id });
  const [row] = await db
    .select({ reflection: reflections, book: books })
    .from(reflections)
    .where(
      and(
        eq(reflections.id, reflectionId),
        eq(reflections.userId, session?.user.id!)
      )
    )
    .leftJoin(books, eq(reflections.bookId, books.id));
  if (row === undefined) return {};
  const r = { ...row.reflection, book: row.book };
  return { reflection: r };
};
