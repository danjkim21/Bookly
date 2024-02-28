import { Suspense } from "react";

import Loading from "@/app/loading";
import CommentList from "@/components/comments/CommentList";
import { getComments } from "@/lib/api/comments/queries";
import { getBookShelves } from "@/lib/api/bookShelves/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function CommentsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="my-2 text-2xl font-semibold">Comments</h1>
        </div>
        <Comments />
      </div>
    </main>
  );
}

const Comments = async () => {
  await checkAuth();

  const { comments } = await getComments();
  const { bookShelves } = await getBookShelves();
  return (
    <Suspense fallback={<Loading />}>
      <CommentList comments={comments} bookShelves={bookShelves} />
    </Suspense>
  );
};
