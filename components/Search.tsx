"use client";

import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from "./ui/command";

import { getBookSearchResultsAction } from "@/lib/actions/books";
import { BookSearchResult } from "@/lib/api/books/queries";

// type Props = {};

export default function Search() {
  // props: Props
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);

  const handleSearchOnChange = async (value: string) => {
    setSearch(value);

    const docs = await getBookSearchResultsAction(value);

    setSearchResults(docs);
  };

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={handleSearchOnChange}
        placeholder="Search for books..."
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {searchResults.map((book) => (
          <CommandItem key={`${book.key}`} value={`${book.title}`}>
            {book.title} by {book?.author_name?.[0]} -- {book.key}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
