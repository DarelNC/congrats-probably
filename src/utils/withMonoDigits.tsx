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
