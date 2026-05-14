import './Select.css';

export default function Select({ label, error, options, placeholder, ...props }) {
  return (
    <div className="select-group">
      {label && <label className="select-label">{label}</label>}
      <div className="select-wrapper" data-error={!!error}>
        <select className="select-field" {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="select-arrow">▼</span>
      </div>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
}
