// Glassmorphism card — used as a spread object ({ ...card }) or wrapper component.
export const card = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 2px 20px rgba(109,40,217,0.07), 0 1px 4px rgba(0,0,0,0.04)',
  border: '1px solid rgba(255,255,255,0.9)',
  padding: 18,
};

/** Wrapper component for when you prefer JSX over style-spreading. */
export function Card({ children, style }) {
  return <div style={{ ...card, ...style }}>{children}</div>;
}
