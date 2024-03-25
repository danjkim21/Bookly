"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

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
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const handleSearchOnChange = async (value: string) => {
    setSearch(value);
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
      <CommandList className="hidden group-focus-within:block">
        {isSearching && <CommandEmpty>Searching...</CommandEmpty>}
        {!isSearching && searchResults.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!isSearching &&
          searchResults.length > 0 &&
          searchResults.map((book) => (
            <CommandItem
              key={`${book.key}`}
              value={`${book.title}`}
              className="block rounded-none"
            >
              <div>{book.title}</div>
              <div className="text-xs">{book?.author_name?.[0]}</div>
            </CommandItem>
          ))}
      </CommandList>
    </Command>
  );
}
