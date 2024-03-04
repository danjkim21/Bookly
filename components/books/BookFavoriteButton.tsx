import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { updateBookFavoritedStatusAction } from "@/lib/actions/books";

const BookFavoriteButton = ({
  bookId,
  bookFavorited
}: {
  bookId: string;
  bookFavorited: boolean;
}) => {
  return (
    <Button
      variant={"link"}
      onClick={async () =>
        await updateBookFavoritedStatusAction(bookId, bookFavorited)
      }
    >
      <Heart fill={bookFavorited ? "#ffffff" : "transparent"} />
    </Button>
  );
};

export default BookFavoriteButton;
