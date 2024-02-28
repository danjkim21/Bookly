"use server";

import { revalidatePath } from "next/cache";
import {
  createQuote,
  deleteQuote,
  updateQuote,
} from "@/lib/api/quotes/mutations";
import {
  QuoteId,
  NewQuoteParams,
  UpdateQuoteParams,
  quoteIdSchema,
  insertQuoteParams,
  updateQuoteParams,
} from "@/lib/db/schema/quotes";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateQuotes = () => revalidatePath("/quotes");

export const createQuoteAction = async (input: NewQuoteParams) => {
  try {
    const payload = insertQuoteParams.parse(input);
    await createQuote(payload);
    revalidateQuotes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateQuoteAction = async (input: UpdateQuoteParams) => {
  try {
    const payload = updateQuoteParams.parse(input);
    await updateQuote(payload.id, payload);
    revalidateQuotes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteQuoteAction = async (input: QuoteId) => {
  try {
    const payload = quoteIdSchema.parse({ id: input });
    await deleteQuote(payload.id);
    revalidateQuotes();
  } catch (e) {
    return handleErrors(e);
  }
};
