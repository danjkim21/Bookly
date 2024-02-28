"use server";

import { revalidatePath } from "next/cache";
import {
  createAuthor,
  deleteAuthor,
  updateAuthor
} from "@/lib/api/authors/mutations";
import {
  AuthorId,
  NewAuthorParams,
  UpdateAuthorParams,
  authorIdSchema,
  insertAuthorParams,
  updateAuthorParams
} from "@/lib/db/schema/authors";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateAuthors = () => revalidatePath("/authors");

export const createAuthorAction = async (input: NewAuthorParams) => {
  try {
    const payload = insertAuthorParams.parse(input);
    await createAuthor(payload);
    revalidateAuthors();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateAuthorAction = async (input: UpdateAuthorParams) => {
  try {
    const payload = updateAuthorParams.parse(input);
    await updateAuthor(payload.id, payload);
    revalidateAuthors();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteAuthorAction = async (input: AuthorId) => {
  try {
    const payload = authorIdSchema.parse({ id: input });
    await deleteAuthor(payload.id);
    revalidateAuthors();
  } catch (e) {
    return handleErrors(e);
  }
};
