import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createReflection,
  deleteReflection,
  updateReflection
} from "@/lib/api/reflections/mutations";
import {
  reflectionIdSchema,
  insertReflectionParams,
  updateReflectionParams
} from "@/lib/db/schema/reflections";

export async function POST(req: Request) {
  try {
    const validatedData = insertReflectionParams.parse(await req.json());
    const { reflection } = await createReflection(validatedData);

    revalidatePath("/reflections"); // optional - assumes you will have named route same as entity

    return NextResponse.json(reflection, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateReflectionParams.parse(await req.json());
    const validatedParams = reflectionIdSchema.parse({ id });

    const { reflection } = await updateReflection(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json(reflection, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = reflectionIdSchema.parse({ id });
    const { reflection } = await deleteReflection(validatedParams.id);

    return NextResponse.json(reflection, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
