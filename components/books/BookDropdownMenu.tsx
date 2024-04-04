import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { updateBookFavoritedStatusAction } from "@/lib/actions/books";
import { toast } from "sonner";

export default function BookDropdownMenu({
  bookId,
  isFavorited
}: {
  bookId: string;
  isFavorited: boolean;
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={basePath + "/" + bookId}>
          <DropdownMenuItem className="pl-8">Edit</DropdownMenuItem>
        </Link>

        {/* <DropdownMenuItem className="pl-8">Delete</DropdownMenuItem> */}

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
          value="unread"
          // value={status} onValueChange={setStatus}
        >
          <DropdownMenuRadioItem value="unread">Unread</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="in progress">
            In Progress
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="complete">
            Complete
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
