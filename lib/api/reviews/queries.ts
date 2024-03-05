import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type ReviewId,
  reviewIdSchema,
  reviews
} from "@/lib/db/schema/reviews";
import { books } from "@/lib/db/schema/books";

export const getReviews = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ review: reviews, book: books })
    .from(reviews)
    .leftJoin(books, eq(reviews.bookId, books.id))
    .where(eq(reviews.userId, session?.user.id!));
  const r = rows.map((r) => ({ ...r.review, book: r.book }));
  return { reviews: r };
};

export const getReviewById = async (id: ReviewId) => {
  const { session } = await getUserAuth();
  const { id: reviewId } = reviewIdSchema.parse({ id });
  const [row] = await db
    .select({ review: reviews, book: books })
    .from(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, session?.user.id!)))
    .leftJoin(books, eq(reviews.bookId, books.id));
  if (row === undefined) return {};
  const r = { ...row.review, book: row.book };
  return { review: r };
};
