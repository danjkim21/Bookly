import Link from "next/link";

type Props = { label: string; value: number | string | Date; path?: string };

export default function StatisticItem({ label, value, path }: Props) {
  const valueFormatted =
    typeof value === "string"
      ? value
      : value instanceof Date
        ? value.toDateString()
        : value.toLocaleString();

  return (
    <div className="col-span-1 flex flex-col gap-1">
      {path ? (
        <Link href={`/${path}`} className="underline-offset-4 hover:underline">
          <h3 className="text-xs opacity-40">{label.toUpperCase()}</h3>
        </Link>
      ) : (
        <h3 className="text-xs opacity-40">{label.toUpperCase()}</h3>
      )}
      <div>{valueFormatted}</div>
    </div>
  );
}
