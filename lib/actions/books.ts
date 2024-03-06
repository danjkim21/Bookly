"use server";

import { revalidatePath } from "next/cache";
import {
  createBook,
  deleteBook,
  updateBook,
  updateBookFavoritedStatus
} from "@/lib/api/books/mutations";
import {
  BookId,
  NewBookParams,
  UpdateBookParams,
  bookIdSchema,
  insertBookParams,
  updateBookParams
} from "@/lib/db/schema/books";
import { getBookSearchResults } from "../api/books/queries";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateBooks = () => revalidatePath("/books");

export const createBookAction = async (input: NewBookParams) => {
  try {
    const payload = insertBookParams.parse(input);
    await createBook(payload);
    revalidateBooks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBookAction = async (input: UpdateBookParams) => {
  try {
    const payload = updateBookParams.parse(input);
    await updateBook(payload.id, payload);
    revalidateBooks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBookFavoritedStatusAction = async (
  input: BookId,
  favorited: boolean
) => {
  try {
    const payload = bookIdSchema.parse({ id: input });
    console.log(payload);
    await updateBookFavoritedStatus(payload.id, !favorited);
    revalidateBooks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteBookAction = async (input: BookId) => {
  try {
    const payload = bookIdSchema.parse({ id: input });
    await deleteBook(payload.id);
    revalidateBooks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const getBookSearchResultsAction = async (value: string) => {
  try {
    const { docs } = await getBookSearchResults(value);
    return docs;
  } catch (e) {
    return handleErrors(e);
  }
};
