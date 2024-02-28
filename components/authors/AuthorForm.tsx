import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/authors/useOptimisticAuthors";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { type Author, insertAuthorParams } from "@/lib/db/schema/authors";
import {
  createAuthorAction,
  deleteAuthorAction,
  updateAuthorAction
} from "@/lib/actions/authors";

const AuthorForm = ({
  author,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess
}: {
  author?: Author | null;

  openModal?: (author?: Author) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Author>(insertAuthorParams);
  const editing = !!author?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("authors");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Author }
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
      toast.success(`Author ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const authorParsed = await insertAuthorParams.safeParseAsync({
      ...payload
    });
    if (!authorParsed.success) {
      setErrors(authorParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = authorParsed.data;
    const pendingAuthor: Author = {
      updatedAt: author?.updatedAt ?? new Date(),
      createdAt: author?.createdAt ?? new Date(),
      id: author?.id ?? "",
      userId: author?.userId ?? "",
      ...values
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingAuthor,
            action: editing ? "update" : "create"
          });

        const error = editing
          ? await updateAuthorAction({ ...values, id: author.id })
          : await createAuthorAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingAuthor
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
            errors?.name ? "text-destructive" : ""
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={author?.name ?? ""}
        />
        {errors?.name ? (
          <p className="mt-2 text-xs text-destructive">{errors.name[0]}</p>
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
                addOptimistic({ action: "delete", data: author });
              const error = await deleteAuthorAction(author.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: author
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

export default AuthorForm;

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
