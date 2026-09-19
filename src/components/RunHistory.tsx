import type { RunRecord } from "../state/store";

interface RunHistoryProps {
  runs: RunRecord[];
}

export default function RunHistory({ runs }: RunHistoryProps) {
  if (runs.length === 0) return null;

  return (
    <div className="run-history">
      <p className="run-history-title">Recent runs</p>
      <ul className="run-history-list">
        {runs.map((run, i) => (
          <li className="run-history-row" key={i}>
            Stage <span className="mono-num">{run.stage}</span> — <span className="mono-num">{run.rolls}</span> roll
            {run.rolls === 1 ? "" : "s"}
          </li>
        ))}
      </ul>
    </div>
  );
}
