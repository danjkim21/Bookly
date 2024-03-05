"use server";

import { revalidatePath } from "next/cache";
import {
  createReview,
  deleteReview,
  updateReview
} from "@/lib/api/reviews/mutations";
import {
  ReviewId,
  NewReviewParams,
  UpdateReviewParams,
  reviewIdSchema,
  insertReviewParams,
  updateReviewParams
} from "@/lib/db/schema/reviews";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateReviews = () => revalidatePath("/reviews");

export const createReviewAction = async (input: NewReviewParams) => {
  try {
    const payload = insertReviewParams.parse(input);
    await createReview(payload);
    revalidateReviews();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateReviewAction = async (input: UpdateReviewParams) => {
  try {
    const payload = updateReviewParams.parse(input);
    await updateReview(payload.id, payload);
    revalidateReviews();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteReviewAction = async (input: ReviewId) => {
  try {
    const payload = reviewIdSchema.parse({ id: input });
    await deleteReview(payload.id);
    revalidateReviews();
  } catch (e) {
    return handleErrors(e);
  }
};
