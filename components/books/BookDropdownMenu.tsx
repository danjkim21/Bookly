import { BookCopyIcon, BookX, EditIcon, MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  updateBookBookshelfAction,
  updateBookFavoritedStatusAction,
  updateBookStatusAction
} from "@/lib/actions/books";
import { toast } from "sonner";
import { BookShelf } from "@/lib/db/schema/bookShelves";

export default function BookDropdownMenu({
  bookId,
  bookShelfId,
  isFavorited,
  bookShelves,
  bookStatus
}: {
  bookId: string;
  bookShelfId: string | undefined;
  isFavorited: boolean;
  bookShelves?: BookShelf[];
  bookStatus?: string;
}) {
  const pathname = usePathname();
  const basePath = pathname.includes("books") ? pathname : pathname + "/books/";

  const handleBookFavorited = async () => {
    await updateBookFavoritedStatusAction(bookId, isFavorited);

    if (isFavorited) {
      toast.success("Book removed from favorites");
    } else {
      toast.success("Book added to favorites");
    }
  };

  const handleBookStatus = async (value: any) => {
    await updateBookStatusAction(bookId, value);

    if (value === "completed") {
      toast.success("Book marked as completed");
    } else if (value === "in-progress") {
      toast.success("Book marked as in progress");
    } else if (value === "unread") {
      toast.success("Book marked as unread");
    }
  };

  const handleUpdateBookShelf = async (value: string) => {
    console.log("bookshelfId", value);
    await updateBookBookshelfAction(bookId, value);

    toast.success("Added to bookshelf");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={basePath + "/" + bookId}>
          <DropdownMenuItem>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem>
          <BookX className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <BookCopyIcon className="mr-2 h-4 w-4" />
            <span>Add to shelf</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {/* TODO: Integrate updateBookShelf api */}
              <DropdownMenuRadioGroup
                value={bookShelfId}
                onValueChange={handleUpdateBookShelf}
              >
                {bookShelves?.map((bookshelf) => {
                  return (
                    <DropdownMenuRadioItem
                      key={bookshelf.id}
                      value={bookshelf.id}
                    >
                      {bookshelf.title}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={isFavorited}
          onCheckedChange={handleBookFavorited}
        >
          Favorited
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {/* TODO: create new Book Field: Status - unread, in progress, complete */}
        <DropdownMenuRadioGroup
          value={bookStatus}
          onValueChange={handleBookStatus}
        >
          <DropdownMenuRadioItem value="unread">Unread</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="in-progress">
            In Progress
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="completed">
            Completed
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
