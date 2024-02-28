import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/quotes/useOptimisticQuotes";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Quote, insertQuoteParams } from "@/lib/db/schema/quotes";
import {
  createQuoteAction,
  deleteQuoteAction,
  updateQuoteAction,
} from "@/lib/actions/quotes";
import { type Book, type BookId } from "@/lib/db/schema/books";

const QuoteForm = ({
  books,
  bookId,
  quote,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  quote?: Quote | null;
  books: Book[];
  bookId?: BookId;
  openModal?: (quote?: Quote) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Quote>(insertQuoteParams);
  const editing = !!quote?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("quotes");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Quote },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Quote ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const quoteParsed = await insertQuoteParams.safeParseAsync({
      bookId,
      ...payload,
    });
    if (!quoteParsed.success) {
      setErrors(quoteParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = quoteParsed.data;
    const pendingQuote: Quote = {
      updatedAt: quote?.updatedAt ?? new Date(),
      createdAt: quote?.createdAt ?? new Date(),
      id: quote?.id ?? "",
      userId: quote?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingQuote,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateQuoteAction({ ...values, id: quote.id })
          : await createQuoteAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingQuote,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
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
            errors?.content ? "text-destructive" : "",
          )}
        >
          Content
        </Label>
        <Input
          type="text"
          name="content"
          className={cn(errors?.content ? "ring ring-destructive" : "")}
          defaultValue={quote?.content ?? ""}
        />
        {errors?.content ? (
          <p className="text-xs text-destructive mt-2">{errors.content[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {bookId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.bookId ? "text-destructive" : "",
            )}
          >
            Book
          </Label>
          <Select defaultValue={quote?.bookId} name="bookId">
            <SelectTrigger
              className={cn(errors?.bookId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              {books?.map((book) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.id}
                  {/* TODO: Replace with a field from the book model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.bookId ? (
            <p className="text-xs text-destructive mt-2">{errors.bookId[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: quote });
              const error = await deleteQuoteAction(quote.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: quote,
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

export default QuoteForm;

const SaveButton = ({
  editing,
  errors,
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
