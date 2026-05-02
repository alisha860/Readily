// Reusable button with variant + size + pill props.
// Variants: primary | secondary | ghost | danger | success
// Sizes:    sm | md | lg
export function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  pill     = false,
  disabled = false,
  onClick,
  style,
  type = 'button',
  ...rest
}) {
  const variants = {
    primary:   { background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white',    border: 'none',                   boxShadow: '0 4px 12px rgba(124,58,237,0.3)' },
    secondary: { background: 'white',                                      color: '#7c3aed',  border: '1.5px solid #7c3aed',    boxShadow: 'none' },
    ghost:     { background: 'transparent',                                color: '#6b7280',  border: '1.5px solid #e5e7eb',    boxShadow: 'none' },
    danger:    { background: 'white',                                      color: '#dc2626',  border: '1.5px solid #dc2626',    boxShadow: 'none' },
    success:   { background: 'white',                                      color: '#059669',  border: '1.5px solid #059669',    boxShadow: 'none' },
    teal:      { background: 'linear-gradient(135deg, #0891b2, #0e7490)',  color: 'white',    border: 'none',                   boxShadow: '0 4px 12px rgba(8,145,178,0.3)' },
  };
  const sizes = {
    sm: { padding: '5px 12px',  fontSize: 11, borderRadius: pill ? 9999 : 8  },
    md: { padding: '9px 18px',  fontSize: 13, borderRadius: pill ? 9999 : 10 },
    lg: { padding: '12px 24px', fontSize: 14, borderRadius: pill ? 9999 : 12 },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, fontFamily: 'inherit', fontWeight: 700, whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        ...(variants[variant] || variants.primary),
        ...sizes[size],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
