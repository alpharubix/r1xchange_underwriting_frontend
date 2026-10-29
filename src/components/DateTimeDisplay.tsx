interface DateTimeDisplayProps {
  value?: string | null;
  className?: string;
}

export default function DateTimeDisplay({
  value,
  className = '',
}: DateTimeDisplayProps) {
  if (!value) {
    return <span className={className}>-</span>;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return <span className={className}>{value}</span>;
  }

  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  return (
    <span className={`inline-flex flex-col leading-tight ${className}`}>
      <span>{dateFormatter.format(date)}</span>
      <span className="mt-1 text-[10px] font-medium text-slate-400">
        {timeFormatter.format(date)} · GMT+5:30
      </span>
    </span>
  );
}
