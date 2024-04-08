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
    <Image
      {...props}
      src={`https://covers.openlibrary.org/b/olid/${src}-M.jpg?default=false`}
      alt="book cover"
      className="aspect-none rounded-xl object-cover"
      width={width}
      height={height}
      loading="lazy"
      placeholder="blur"
      blurDataURL={`https://generated.vusercontent.net/placeholder.svg`}
      onError={() => {
        setSrc("https://generated.vusercontent.net/placeholder.svg");
      }}
    />
  );
}
