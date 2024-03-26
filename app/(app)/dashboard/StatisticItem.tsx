type Props = { label: string; value: number };

export default function StatisticItem({ label, value }: Props) {
  return (
    <div className="col-span-1 flex flex-col gap-1">
      <div className="text-xs opacity-40">{label.toUpperCase()}</div>
      <div>{value.toLocaleString()}</div>
    </div>
  );
}
