import { useState, useRef, useEffect } from 'react';
import './Select.css';

export default function Select({ label, error, options, placeholder, value, onChange, ...props }) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find(o => o.value === value);
  const displayText = selected ? selected.label : placeholder || '';

  useEffect(() => {
    if (!open) { setFocusedIdx(-1); return; }
    const idx = options.findIndex(o => o.value === value);
    setFocusedIdx(idx >= 0 ? idx : 0);
  }, [open, options, value]);

  useEffect(() => {
    if (!open || focusedIdx < 0 || !listRef.current) return;
    const el = listRef.current.children[focusedIdx];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [focusedIdx, open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const select = (opt) => {
    setOpen(false);
    if (onChange) {
      const syntheticEvent = {
        target: { value: opt.value, name: props.name },
        currentTarget: { value: opt.value, name: props.name },
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(syntheticEvent);
    }
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIdx(prev => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIdx(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIdx >= 0 && focusedIdx < options.length) {
          select(options[focusedIdx]);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div className="select-group" ref={containerRef}>
      {label && <label className="select-label">{label}</label>}
      <div
        className={`select-trigger ${open ? 'select-trigger-open' : ''}`}
        data-error={!!error}
        tabIndex={0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span className={`select-trigger-text ${!selected ? 'select-placeholder' : ''}`}>
          {displayText}
        </span>
        <span className={`select-arrow ${open ? 'select-arrow-open' : ''}`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {open && (
        <div className="select-dropdown" role="listbox" ref={listRef}>
          {options.length === 0 && (
            <div className="select-empty">No options</div>
          )}
          {options.map((opt, i) => (
            <div
              key={opt.value}
              className={`select-option ${i === focusedIdx ? 'select-option-focused' : ''} ${opt.value === value ? 'select-option-selected' : ''}`}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => select(opt)}
              onMouseEnter={() => setFocusedIdx(i)}
            >
              {opt.label}
              {opt.value === value && (
                <span className="select-check">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5.5L4.5 9L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <span className="select-error">{error}</span>}
    </div>
  );
}
