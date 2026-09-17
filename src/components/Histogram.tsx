interface HistogramProps {
  counts: number[];
  title?: string;
}

export default function Histogram({ counts, title }: HistogramProps) {
  const total = counts.reduce((a, b) => a + b, 0);
  const expected = total / 6;
  const max = Math.max(...counts, expected, 1);

  return (
    <div className="histogram">
      {title && <p className="histogram-title">{title}</p>}
      <div className="histogram-bars">
        {counts.map((count, i) => {
          const barHeight = (count / max) * 100;
          const expectedHeight = (expected / max) * 100;
          return (
            <div className="histogram-col" key={i}>
              <div className="histogram-track">
                <div className="histogram-expected" style={{ height: `${expectedHeight}%` }} />
                <div className="histogram-bar" style={{ height: `${barHeight}%` }} />
              </div>
              <span className="histogram-label mono-num">{i + 1}</span>
              <span className="histogram-count mono-num">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
