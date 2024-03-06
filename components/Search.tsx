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

// type Props = {};

export default function Search() {
  // props: Props
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchOnChange = async (value: string) => {
    setSearch(value);

    const docs = await getBookSearchResultsAction(value);

    console.log(docs);
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
