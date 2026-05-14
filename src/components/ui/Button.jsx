import './Button.css';

export default function Button({ variant = 'primary', size = 'md', children, icon, ...props }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}
