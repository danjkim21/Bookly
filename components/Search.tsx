"use client";

import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@uidotdev/usehooks";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from "./ui/command";

import {
  createBookAction,
  getBookSearchResultsAction
} from "@/lib/actions/books";
import { BookSearchResult } from "@/lib/api/books/queries";
import { CommandLoading } from "cmdk";
import { Book, insertBookParams } from "@/lib/db/schema/books";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { createAuthorAction } from "@/lib/actions/authors";
import { z } from "zod";

// type Props = {};

export default function Search() {
  // props: Props
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Book>(insertBookParams);

  const [pending, startMutation] = useTransition();

  // const onSuccess = (
  //   action: Action,
  //   data?: { error: string; values: Book }
  // ) => {
  //   const failed = Boolean(data?.error);
  //   if (failed) {
  //     openModal && openModal(data?.values);
  //     toast.error(`Failed to ${action}`, {
  //       description: data?.error ?? "Error"
  //     });
  //   } else {
  //     router.refresh();
  //     postSuccess && postSuccess();
  //     toast.success(`Book ${action}d!`);
  //     if (action === "delete") router.push(backpath);
  //   }
  // };

  const capitalize = (str: string) =>
    str.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());

  const handleSearchOnChange = async (value: string) => {
    setSearch(value);
  };

  const handleSubmitBook = async (value: string) => {
    console.log(value);

    const [title, authorName] = value.split("~~");

    const id = await createAuthorAction({ name: capitalize(authorName) });

    const bookParsed = await insertBookParams.safeParseAsync({
      authorId: id,
      title: capitalize(title),
      authorName,
      favorited: false,
      completed: false
    });

    if (!bookParsed.success) {
      setErrors(bookParsed?.error.flatten().fieldErrors);
      return;
    }

    const values = bookParsed.data;
    const pendingBook: Book = {
      updatedAt: new Date(),
      createdAt: new Date(),
      id: "",
      userId: "",
      completedOn: values.completedOn ?? null,
      bookShelfId: values.bookShelfId ?? null,
      ...values
    };
    try {
      startMutation(async () => {
        const error = await createBookAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBook
        };
        // onSuccess(error ? errorFormatted : undefined);
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  const searchBooks = async () => {
    let results: BookSearchResult[] = [];
    setIsSearching(true);

    if (debouncedSearch) {
      results = await getBookSearchResultsAction(debouncedSearch);
    }
    setIsSearching(false);
    setSearchResults(results);
  };

  useEffect(() => {
    searchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <Command className="group">
      <CommandInput
        value={search}
        onValueChange={handleSearchOnChange}
        placeholder="Search for books..."
        className="group"
      />
      <CommandList
      // className="hidden group-focus-within:block"
      >
        {isSearching && <CommandLoading>Searching...</CommandLoading>}
        {!isSearching && searchResults.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!isSearching &&
          searchResults.length > 0 &&
          searchResults.map((book) => (
            <CommandItem
              key={`${book.title}-${book.key}`}
              value={`${book.title}~~${book.author_name?.[0]}~~${book.key}`}
              className="block rounded-none"
              onSelect={handleSubmitBook}
            >
              <div>{book.title}</div>
              <div className="text-xs">{book?.author_name?.[0]}</div>
            </CommandItem>
          ))}
      </CommandList>
    </Command>
  );
}
