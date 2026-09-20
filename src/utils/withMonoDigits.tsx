export function highlightFirstDigit(text: string, className: string) {
  const match = text.match(/\d+/);
  if (!match || match.index === undefined) return text;
  const start = match.index;
  const end = start + match[0].length;
  return (
    <>
      {text.slice(0, start)}
      <span className={className}>{match[0]}</span>
      {text.slice(end)}
    </>
  );
}

export function withMonoDigits(text: string) {
  return text.split(/(\d[\d,]*)/).map((part, i) =>
    /^\d[\d,]*$/.test(part) ? (
      <span className="mono-num" key={i}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}
