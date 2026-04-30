import { createContext, useContext, useState, useCallback } from 'react';

// React context used to share accessibility settings across all dashboards
// without prop drilling. Components read palette to swap RAG colours at render time.

// Standard RAG palette used by default across all three roles.
const STANDARD_PALETTE = {
  stable:         '#059669',
  stableLight:    '#10b981',
  stableBg:       '#d1fae5',
  stableBgAlt:    '#f0fdf4',
  stableText:     '#065f46',
  stableBorder:   '#bbf7d0',
  critical:       '#dc2626',
  criticalLight:  '#ef4444',
  criticalBg:     '#fee2e2',
  criticalBgAlt:  '#fff1f2',
  criticalText:   '#991b1b',
  criticalBorder: '#fecdd3',
  // Amber is perceptually distinct for red-green colourblind users so it stays
  // the same in both modes.
  warning:        '#d97706',
  warningLight:   '#f59e0b',
  warningBg:      '#fef3c7',
  warningText:    '#92400e',
};

// Colourblind-safe palette (deuteranopia / protanopia). Replaces greens with
// blues, which are clearly distinguishable from both amber and dark rose for
// users with red-green colour vision deficiency.
const COLOURBLIND_PALETTE = {
  stable:         '#2563eb',
  stableLight:    '#3b82f6',
  stableBg:       '#dbeafe',
  stableBgAlt:    '#eff6ff',
  stableText:     '#1e40af',
  stableBorder:   '#93c5fd',
  critical:       '#9f1239',
  criticalLight:  '#be123c',
  criticalBg:     '#ffe4e6',
  criticalBgAlt:  '#fff1f2',
  criticalText:   '#881337',
  criticalBorder: '#fda4af',
  warning:        '#d97706',
  warningLight:   '#f59e0b',
  warningBg:      '#fef3c7',
  warningText:    '#92400e',
};

const FONT_SIZES   = ['100%', '120%', '140%'];
// CSS zoom classes are used alongside root font-size because the app uses
// hardcoded px values in inline styles, which are unaffected by font-size alone.
const FONT_CLASSES = ['', 'text-large', 'text-xlarge'];

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [colourblind,   setColourblind]   = useState(false);
  const [highContrast,  setHighContrast]  = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(0);

  const palette = colourblind ? COLOURBLIND_PALETTE : STANDARD_PALETTE;

  // Switches to the colourblind-safe palette across all components.
  const toggleColourblind = useCallback(() => {
    setColourblind(prev => !prev);
  }, []);

  // Adds a CSS class to body that forces high-contrast overrides defined in index.css.
  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => {
      document.body.classList.toggle('high-contrast', !prev);
      return !prev;
    });
  }, []);

  // Applies both root font-size (for rem values) and a CSS zoom class (for px
  // inline styles) so text scaling works regardless of how sizes are specified.
  const setFontSize = useCallback((index) => {
    setFontSizeIndex(index);
    document.documentElement.style.fontSize = FONT_SIZES[index];
    document.body.classList.remove('text-large', 'text-xlarge');
    if (FONT_CLASSES[index]) document.body.classList.add(FONT_CLASSES[index]);
  }, []);

  // Reverts all three settings and cleans up every body class at once.
  const resetAll = useCallback(() => {
    setColourblind(false);
    setHighContrast(false);
    setFontSizeIndex(0);
    document.documentElement.style.fontSize = '100%';
    document.body.classList.remove('high-contrast', 'text-large', 'text-xlarge');
  }, []);

  return (
    <AccessibilityContext.Provider value={{
      colourblind, toggleColourblind,
      highContrast, toggleHighContrast,
      fontSizeIndex, setFontSize,
      FONT_LABELS: ['Default', 'Large', 'Extra Large'],
      palette, resetAll,
      hasChanges: colourblind || highContrast || fontSizeIndex !== 0,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

// Helper used by components instead of hardcoded hex values. Returns the
// correct colour for the given level based on the active palette.
export function ragColor(level, palette) {
  return palette[level] || '#6b7280';
}
