import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function BookCoverImage({
  bookSrc,
  height,
  width,
  ...props
}: {
  bookSrc: string;
  height: number;
  width: number;
}) {
  const [src, setSrc] = useState(bookSrc);
  // TODO: Figure out how to update image on 404 error
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-neutral-100/50 dark:bg-neutral-800",
        `h-[${height}px] w-[${width}px]`
      )}
    >
      <Image
        {...props}
        src={`https://covers.openlibrary.org/b/olid/${src}-M.jpg?default=false`}
        alt="book cover"
        className="h-full rounded-xl object-cover"
        width={width}
        height={height}
        loading="lazy"
        placeholder="blur"
        blurDataURL={`https://generated.vusercontent.net/placeholder.svg`}
        onError={() => {
          setSrc("https://generated.vusercontent.net/placeholder.svg");
        }}
      />
    </div>
  );
}
