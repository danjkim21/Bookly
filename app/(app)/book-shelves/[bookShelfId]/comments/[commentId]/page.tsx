import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCommentById } from "@/lib/api/comments/queries";
import { getBookShelves } from "@/lib/api/bookShelves/queries";
import OptimisticComment from "@/app/(app)/comments/[commentId]/OptimisticComment";
import { checkAuth } from "@/lib/auth/utils";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function CommentPage({
  params
}: {
  params: { commentId: string };
}) {
  return (
    <main className="overflow-auto">
      <Comment id={params.commentId} />
    </main>
  );
}

const Comment = async ({ id }: { id: string }) => {
  await checkAuth();

  const { comment } = await getCommentById(id);
  const { bookShelves } = await getBookShelves();

  if (!comment) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="comments" />
        <OptimisticComment
          comment={comment}
          bookShelves={bookShelves}
          bookShelfId={comment.bookShelfId}
        />
      </div>
    </Suspense>
  );
};
