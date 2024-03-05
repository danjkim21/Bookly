import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createReview,
  deleteReview,
  updateReview
} from "@/lib/api/reviews/mutations";
import {
  reviewIdSchema,
  insertReviewParams,
  updateReviewParams
} from "@/lib/db/schema/reviews";

export async function POST(req: Request) {
  try {
    const validatedData = insertReviewParams.parse(await req.json());
    const { review } = await createReview(validatedData);

    revalidatePath("/reviews"); // optional - assumes you will have named route same as entity

    return NextResponse.json(review, { status: 201 });
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

    const validatedData = updateReviewParams.parse(await req.json());
    const validatedParams = reviewIdSchema.parse({ id });

    const { review } = await updateReview(validatedParams.id, validatedData);

    return NextResponse.json(review, { status: 200 });
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

    const validatedParams = reviewIdSchema.parse({ id });
    const { review } = await deleteReview(validatedParams.id);

    return NextResponse.json(review, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
