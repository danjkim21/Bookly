import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema/books";
import { quotes } from "@/lib/db/schema/quotes";
import { reflections } from "@/lib/db/schema/reflections";
import { reviews } from "@/lib/db/schema/reviews";
import { and, count, eq } from "drizzle-orm";

// Dashboard Statistics Queries
export const getBookCounts = async () => {
  const { session } = await getUserAuth();
  const rt = await db
    .select({ count: count() })
    .from(books)
    .where(and(eq(books.userId, session?.user.id!)));
  const rc = await db
    .select({ count: count() })
    .from(books)
    .where(
      and(eq(books.userId, session?.user.id!), eq(books.status, "completed"))
    );

  const rf = await db
    .select({ count: count() })
    .from(books)
    .where(and(eq(books.userId, session?.user.id!), eq(books.favorited, true)));

  return { total: rt[0], completed: rc[0], favorited: rf[0] };
};

export const getReviewCounts = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ count: count() })
    .from(reviews)
    .where(eq(reviews.userId, session?.user.id!));
  return { total: rows[0] };
};

export const getQuoteCounts = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ count: count() })
    .from(quotes)
    .where(eq(quotes.userId, session?.user.id!));
  return { total: rows[0] };
};

export const getReflectionCounts = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ count: count() })
    .from(reflections)
    .where(eq(reflections.userId, session?.user.id!));
  return { total: rows[0] };
};
