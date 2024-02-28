"use server";

import { revalidatePath } from "next/cache";
import {
  createReflection,
  deleteReflection,
  updateReflection,
} from "@/lib/api/reflections/mutations";
import {
  ReflectionId,
  NewReflectionParams,
  UpdateReflectionParams,
  reflectionIdSchema,
  insertReflectionParams,
  updateReflectionParams,
} from "@/lib/db/schema/reflections";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateReflections = () => revalidatePath("/reflections");

export const createReflectionAction = async (input: NewReflectionParams) => {
  try {
    const payload = insertReflectionParams.parse(input);
    await createReflection(payload);
    revalidateReflections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateReflectionAction = async (input: UpdateReflectionParams) => {
  try {
    const payload = updateReflectionParams.parse(input);
    await updateReflection(payload.id, payload);
    revalidateReflections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteReflectionAction = async (input: ReflectionId) => {
  try {
    const payload = reflectionIdSchema.parse({ id: input });
    await deleteReflection(payload.id);
    revalidateReflections();
  } catch (e) {
    return handleErrors(e);
  }
};
