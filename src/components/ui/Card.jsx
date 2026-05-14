import './Card.css';

export default function Card({ variant = 'default', className = '', children, ...props }) {
  return (
    <div className={`card card-${variant} ${className}`} {...props}>
      {children}
    </div>
  );
}
