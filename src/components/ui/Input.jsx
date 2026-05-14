import './Input.css';

export default function Input({ label, error, icon, prefix, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper" data-error={!!error}>
        {icon && <span className="input-icon">{icon}</span>}
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input className="input-field" {...props} />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
