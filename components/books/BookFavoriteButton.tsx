import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { updateBookFavoritedStatusAction } from "@/lib/actions/books";

const BookFavoriteButton = ({
  bookId,
  bookFavorited,
  className
}: {
  bookId: string;
  bookFavorited: boolean;
  className?: string;
}) => {
  const handleBookFavorited = async () => {
    await updateBookFavoritedStatusAction(bookId, bookFavorited);

    if (bookFavorited) {
      toast.success("Book removed from favorites");
    } else {
      toast.success("Book added to favorites");
    }
  };

  return (
    <Button
      variant={"link"}
      onClick={handleBookFavorited}
      className={className}
    >
      <Heart
        className="hover:scale-110"
        fill={bookFavorited ? "#ffffff" : "transparent"}
      />
    </Button>
  );
};

export default BookFavoriteButton;
