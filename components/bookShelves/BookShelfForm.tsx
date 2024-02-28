import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/book-shelves/useOptimisticBookShelves";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { Checkbox } from "@/components/ui/checkbox";

import {
  type BookShelf,
  insertBookShelfParams
} from "@/lib/db/schema/bookShelves";
import {
  createBookShelfAction,
  deleteBookShelfAction,
  updateBookShelfAction
} from "@/lib/actions/bookShelves";

const BookShelfForm = ({
  bookShelf,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess
}: {
  bookShelf?: BookShelf | null;

  openModal?: (bookShelf?: BookShelf) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<BookShelf>(insertBookShelfParams);
  const editing = !!bookShelf?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("book-shelves");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: BookShelf }
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
      toast.success(`BookShelf ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const bookShelfParsed = await insertBookShelfParams.safeParseAsync({
      ...payload
    });
    if (!bookShelfParsed.success) {
      setErrors(bookShelfParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = bookShelfParsed.data;
    const pendingBookShelf: BookShelf = {
      updatedAt: bookShelf?.updatedAt ?? new Date(),
      createdAt: bookShelf?.createdAt ?? new Date(),
      id: bookShelf?.id ?? "",
      userId: bookShelf?.userId ?? "",
      ...values
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingBookShelf,
            action: editing ? "update" : "create"
          });

        const error = editing
          ? await updateBookShelfAction({ ...values, id: bookShelf.id })
          : await createBookShelfAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBookShelf
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
          defaultValue={bookShelf?.title ?? ""}
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
            errors?.description ? "text-destructive" : ""
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={bookShelf?.description ?? ""}
        />
        {errors?.description ? (
          <p className="mt-2 text-xs text-destructive">
            {errors.description[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.slug ? "text-destructive" : ""
          )}
        >
          Slug
        </Label>
        <Input
          type="text"
          name="slug"
          className={cn(errors?.slug ? "ring ring-destructive" : "")}
          defaultValue={bookShelf?.slug ?? ""}
        />
        {errors?.slug ? (
          <p className="mt-2 text-xs text-destructive">{errors.slug[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.public ? "text-destructive" : ""
          )}
        >
          Public
        </Label>
        <br />
        <Checkbox
          defaultChecked={bookShelf?.public}
          name={"public"}
          className={cn(errors?.public ? "ring ring-destructive" : "")}
        />
        {errors?.public ? (
          <p className="mt-2 text-xs text-destructive">{errors.public[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic &&
                addOptimistic({ action: "delete", data: bookShelf });
              const error = await deleteBookShelfAction(bookShelf.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: bookShelf
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

export default BookShelfForm;

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
