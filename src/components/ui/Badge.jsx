import './Badge.css';

export default function Badge({ variant = 'default', children, ...props }) {
  return (
    <span className={`badge badge-${variant}`} {...props}>
      {children}
    </span>
  );
}
