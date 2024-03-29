type Props = { label: string; value: number | string | Date };

export default function StatisticItem({ label, value }: Props) {
  const valueFormatted =
    typeof value === "string"
      ? value
      : value instanceof Date
        ? value.toDateString()
        : value.toLocaleString();

  return (
    <div className="col-span-1 flex flex-col gap-1">
      <div className="text-xs opacity-40">{label.toUpperCase()}</div>
      <div>{valueFormatted}</div>
    </div>
  );
}
