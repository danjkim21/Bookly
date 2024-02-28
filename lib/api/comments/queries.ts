import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type CommentId,
  commentIdSchema,
  comments
} from "@/lib/db/schema/comments";
import { bookShelves } from "@/lib/db/schema/bookShelves";

export const getComments = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ comment: comments, bookShelf: bookShelves })
    .from(comments)
    .leftJoin(bookShelves, eq(comments.bookShelfId, bookShelves.id))
    .where(eq(comments.userId, session?.user.id!));
  const c = rows.map((r) => ({ ...r.comment, bookShelf: r.bookShelf }));
  return { comments: c };
};

export const getCommentById = async (id: CommentId) => {
  const { session } = await getUserAuth();
  const { id: commentId } = commentIdSchema.parse({ id });
  const [row] = await db
    .select({ comment: comments, bookShelf: bookShelves })
    .from(comments)
    .where(
      and(eq(comments.id, commentId), eq(comments.userId, session?.user.id!))
    )
    .leftJoin(bookShelves, eq(comments.bookShelfId, bookShelves.id));
  if (row === undefined) return {};
  const c = { ...row.comment, bookShelf: row.bookShelf };
  return { comment: c };
};
