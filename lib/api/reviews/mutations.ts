import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  ReviewId,
  NewReviewParams,
  UpdateReviewParams,
  updateReviewSchema,
  insertReviewSchema,
  reviews,
  reviewIdSchema
} from "@/lib/db/schema/reviews";
import { getUserAuth } from "@/lib/auth/utils";

export const createReview = async (review: NewReviewParams) => {
  const { session } = await getUserAuth();
  const newReview = insertReviewSchema.parse({
    ...review,
    userId: session?.user.id!
  });
  try {
    const [r] = await db.insert(reviews).values(newReview).returning();
    return { review: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateReview = async (
  id: ReviewId,
  review: UpdateReviewParams
) => {
  const { session } = await getUserAuth();
  const { id: reviewId } = reviewIdSchema.parse({ id });
  const newReview = updateReviewSchema.parse({
    ...review,
    userId: session?.user.id!
  });
  try {
    const [r] = await db
      .update(reviews)
      .set({ ...newReview, updatedAt: new Date() })
      .where(
        and(eq(reviews.id, reviewId!), eq(reviews.userId, session?.user.id!))
      )
      .returning();
    return { review: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteReview = async (id: ReviewId) => {
  const { session } = await getUserAuth();
  const { id: reviewId } = reviewIdSchema.parse({ id });
  try {
    const [r] = await db
      .delete(reviews)
      .where(
        and(eq(reviews.id, reviewId!), eq(reviews.userId, session?.user.id!))
      )
      .returning();
    return { review: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
