import { SidebarLink } from "@/components/SidebarItems";
import { Book, BookA, BookCopyIcon, Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: Cog }
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/book-shelves",
        title: "Book Shelves",
        icon: BookCopyIcon
      },
      {
        href: "/books",
        title: "Books",
        icon: Book
      },
      {
        href: "/authors",
        title: "Authors",
        icon: BookA
      },
      {
        href: "/reflections",
        title: "Reflections",
        icon: Globe
      },
      {
        href: "/quotes",
        title: "Quotes",
        icon: Globe
      }
    ]
  }
];
