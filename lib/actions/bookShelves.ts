"use server";

import { revalidatePath } from "next/cache";
import {
  createBookShelf,
  deleteBookShelf,
  updateBookShelf
} from "@/lib/api/bookShelves/mutations";
import {
  BookShelfId,
  NewBookShelfParams,
  UpdateBookShelfParams,
  bookShelfIdSchema,
  insertBookShelfParams,
  updateBookShelfParams
} from "@/lib/db/schema/bookShelves";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateBookShelves = () => revalidatePath("/book-shelves");

export const createBookShelfAction = async (input: NewBookShelfParams) => {
  try {
    const payload = insertBookShelfParams.parse(input);
    await createBookShelf(payload);
    revalidateBookShelves();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBookShelfAction = async (input: UpdateBookShelfParams) => {
  try {
    const payload = updateBookShelfParams.parse(input);
    await updateBookShelf(payload.id, payload);
    revalidateBookShelves();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteBookShelfAction = async (input: BookShelfId) => {
  try {
    const payload = bookShelfIdSchema.parse({ id: input });
    await deleteBookShelf(payload.id);
    revalidateBookShelves();
  } catch (e) {
    return handleErrors(e);
  }
};
