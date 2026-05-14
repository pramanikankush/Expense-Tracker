import './ProgressBar.css';

export default function ProgressBar({ value, max = 100, color, height = 6, showLabel = false }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-container">
      <div className="progress-track" style={{ height }}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color || 'var(--color-deep-green)' }}
        />
      </div>
      {showLabel && <span className="progress-label">{Math.round(pct)}%</span>}
    </div>
  );
}
