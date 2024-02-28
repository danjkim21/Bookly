import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createComment,
  deleteComment,
  updateComment
} from "@/lib/api/comments/mutations";
import {
  commentIdSchema,
  insertCommentParams,
  updateCommentParams
} from "@/lib/db/schema/comments";

export async function POST(req: Request) {
  try {
    const validatedData = insertCommentParams.parse(await req.json());
    const { comment } = await createComment(validatedData);

    revalidatePath("/comments"); // optional - assumes you will have named route same as entity

    return NextResponse.json(comment, { status: 201 });
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

    const validatedData = updateCommentParams.parse(await req.json());
    const validatedParams = commentIdSchema.parse({ id });

    const { comment } = await updateComment(validatedParams.id, validatedData);

    return NextResponse.json(comment, { status: 200 });
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

    const validatedParams = commentIdSchema.parse({ id });
    const { comment } = await deleteComment(validatedParams.id);

    return NextResponse.json(comment, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
