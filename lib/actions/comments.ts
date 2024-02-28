"use server";

import { revalidatePath } from "next/cache";
import {
  createComment,
  deleteComment,
  updateComment
} from "@/lib/api/comments/mutations";
import {
  CommentId,
  NewCommentParams,
  UpdateCommentParams,
  commentIdSchema,
  insertCommentParams,
  updateCommentParams
} from "@/lib/db/schema/comments";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateComments = () => revalidatePath("/comments");

export const createCommentAction = async (input: NewCommentParams) => {
  try {
    const payload = insertCommentParams.parse(input);
    await createComment(payload);
    revalidateComments();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCommentAction = async (input: UpdateCommentParams) => {
  try {
    const payload = updateCommentParams.parse(input);
    await updateComment(payload.id, payload);
    revalidateComments();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCommentAction = async (input: CommentId) => {
  try {
    const payload = commentIdSchema.parse({ id: input });
    await deleteComment(payload.id);
    revalidateComments();
  } catch (e) {
    return handleErrors(e);
  }
};
