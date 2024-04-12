import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/books/useOptimisticBooks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { type Book, insertBookParams } from "@/lib/db/schema/books";
import {
  createBookAction,
  deleteBookAction,
  updateBookAction
} from "@/lib/actions/books";
import { type Author, type AuthorId } from "@/lib/db/schema/authors";
import { BookShelf, BookShelfId } from "@/lib/db/schema/bookShelves";

const BookForm = ({
  authors,
  authorId,
  book,
  bookShelves,
  bookShelfId,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess
}: {
  book?: Book | null;
  authors: Author[];
  authorId?: AuthorId;
  bookShelves?: BookShelf[];
  bookShelfId?: BookShelfId;
  openModal?: (book?: Book) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Book>(insertBookParams);
  const editing = !!book?.id;
  const [completed, setCompleted] = useState(
    book?.status === "completed" ?? false
  );
  const [completedOn, setCompletedOn] = useState<Date | undefined>(
    book?.completedOn ? new Date(book.completedOn) : undefined
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("books");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Book }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error"
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Book ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());

    console.log(payload);

    const bookParsed = await insertBookParams.safeParseAsync({
      authorId,
      ...payload
    });

    console.log(bookParsed);

    if (!bookParsed.success) {
      setErrors(bookParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = bookParsed.data;
    const pendingBook: Book = {
      updatedAt: book?.updatedAt ?? new Date(),
      createdAt: book?.createdAt ?? new Date(),
      id: book?.id ?? "",
      userId: book?.userId ?? "",
      completedOn: values.completedOn ?? null,
      bookShelfId: values.bookShelfId ?? null,
      ...values
    };

    console.log(values);

    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingBook,
            action: editing ? "update" : "create"
          });

        const error = editing
          ? await updateBookAction({ ...values, id: book.id })
          : await createBookAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBook
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.title ? "text-destructive" : ""
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? "ring ring-destructive" : "")}
          defaultValue={book?.title ?? ""}
        />
        {errors?.title ? (
          <p className="mt-2 text-xs text-destructive">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.status ? "text-destructive" : ""
          )}
        >
          Status
        </Label>
        <Select
          defaultValue={book?.status || "unread"}
          name="status"
          onValueChange={(value) =>
            setCompleted(value === "completed" ? true : false)
          }
        >
          <SelectTrigger
            className={cn(errors?.status ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Book status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"unread"} value={"unread"}>
              Unread
            </SelectItem>
            <SelectItem key={"in-progress"} value={"in-progress"}>
              In Progress
            </SelectItem>
            <SelectItem key={"completed"} value={"completed"}>
              Completed
            </SelectItem>
          </SelectContent>
        </Select>
        {errors?.status ? (
          <p className="mt-2 text-xs text-destructive">{errors.status[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {completed && (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.completedOn ? "text-destructive" : ""
            )}
          >
            Completed On
          </Label>
          <br />
          <Popover>
            <Input
              name="completedOn"
              // onChange={() => {}}
              readOnly
              value={completedOn?.toUTCString() ?? new Date().toUTCString()}
              className="hidden"
            />

            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !book?.completedOn && "text-muted-foreground"
                )}
              >
                {completedOn ? (
                  <span>{format(completedOn, "PPP")}</span>
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                onSelect={(e) => setCompletedOn(e)}
                selected={completedOn}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors?.completedOn ? (
            <p className="mt-2 text-xs text-destructive">
              {errors.completedOn[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.favorited ? "text-destructive" : ""
          )}
        >
          Favorited
        </Label>
        <br />
        <Checkbox
          defaultChecked={book?.favorited ?? undefined}
          name={"favorited"}
          className={cn(errors?.favorited ? "ring ring-destructive" : "")}
        />
        {errors?.favorited ? (
          <p className="mt-2 text-xs text-destructive">{errors.favorited[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {authorId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.authorId ? "text-destructive" : ""
            )}
          >
            Author
          </Label>
          <Select defaultValue={book?.authorId} name="authorId">
            <SelectTrigger
              className={cn(errors?.authorId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a author" />
            </SelectTrigger>
            <SelectContent>
              {authors?.map((author) => (
                <SelectItem key={author.id} value={author.id.toString()}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.authorId ? (
            <p className="mt-2 text-xs text-destructive">
              {errors.authorId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {bookShelfId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.bookShelfId ? "text-destructive" : ""
            )}
          >
            Book Shelf
          </Label>
          <Select
            defaultValue={book?.bookShelfId ? book?.bookShelfId : undefined}
            name="bookShelfId"
          >
            <SelectTrigger
              className={cn(errors?.bookShelfId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a book shelf" />
            </SelectTrigger>
            <SelectContent>
              {bookShelves?.map((bookshelf) => (
                <SelectItem key={bookshelf.id} value={bookshelf.id.toString()}>
                  {bookshelf.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.bookShelfId ? (
            <p className="mt-2 text-xs text-destructive">
              {errors.bookShelfId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: book });
              const error = await deleteBookAction(book.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: book
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default BookForm;

const SaveButton = ({
  editing,
  errors
}: {
  editing: boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
