import { PRESETS } from "../lib/presets";

export default function Banner({ message, onLoadPreset }) {
  return (
    <div className="banner">
      <div className="left">
        <span className="atom">⚛</span>
        <span>{message}</span>
      </div>
      <div className="preset">
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            className="preset-btn"
            key={key}
            onClick={() => onLoadPreset(key)}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
