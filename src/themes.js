export const THEMES = [
  {
    id: 'violet', name: 'Violet', swatch: '#7c3aed',
    avatarBg: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    gradient: 'linear-gradient(145deg, #ede9fe 0%, #f5f3ff 25%, #fce7f3 60%, #e0f2fe 100%)',
    darkGradient: 'linear-gradient(145deg, #1a1040 0%, #130c30 40%, #1f1245 70%, #0d0a26 100%)',
    accent: '#7c3aed', accentRgb: '124,58,237',
  },
  {
    id: 'rose', name: 'Rose', swatch: '#db2777',
    avatarBg: 'linear-gradient(135deg, #db2777, #be185d)',
    gradient: 'linear-gradient(145deg, #fce7f3 0%, #fdf2f8 25%, #ede9fe 60%, #fce7f3 100%)',
    darkGradient: 'linear-gradient(145deg, #2d0a1e 0%, #3b0f27 40%, #1f1040 70%, #2d0a1e 100%)',
    accent: '#db2777', accentRgb: '219,39,119',
  },
  {
    id: 'cyan', name: 'Cyan', swatch: '#0891b2',
    avatarBg: 'linear-gradient(135deg, #0891b2, #0e7490)',
    gradient: 'linear-gradient(145deg, #e0f2fe 0%, #f0f9ff 25%, #e0fdf4 60%, #ecfdf5 100%)',
    darkGradient: 'linear-gradient(145deg, #051e26 0%, #072a35 40%, #0a1628 70%, #051e26 100%)',
    accent: '#0891b2', accentRgb: '8,145,178',
  },
  {
    id: 'emerald', name: 'Emerald', swatch: '#059669',
    avatarBg: 'linear-gradient(135deg, #059669, #047857)',
    gradient: 'linear-gradient(145deg, #d1fae5 0%, #ecfdf5 25%, #e0f2fe 60%, #dbeafe 100%)',
    darkGradient: 'linear-gradient(145deg, #052019 0%, #072e20 40%, #081929 70%, #052019 100%)',
    accent: '#059669', accentRgb: '5,150,105',
  },
  {
    id: 'amber', name: 'Amber', swatch: '#d97706',
    avatarBg: 'linear-gradient(135deg, #d97706, #b45309)',
    gradient: 'linear-gradient(145deg, #fef3c7 0%, #fffbeb 25%, #fce7f3 60%, #fef9c3 100%)',
    darkGradient: 'linear-gradient(145deg, #1f1500 0%, #2e1f00 40%, #1f0d19 70%, #1f1500 100%)',
    accent: '#d97706', accentRgb: '217,119,6',
  },
  {
    id: 'slate', name: 'Slate', swatch: '#475569',
    avatarBg: 'linear-gradient(135deg, #475569, #334155)',
    gradient: 'linear-gradient(145deg, #f1f5f9 0%, #f8fafc 25%, #e2e8f0 60%, #f1f5f9 100%)',
    darkGradient: 'linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #0f172a 70%, #111827 100%)',
    accent: '#475569', accentRgb: '71,85,105',
  },
];

export const ROLE_DEFAULTS = { hr: 'violet', teamlead: 'rose', employee: 'cyan' };

export function getTheme(id) {
  return THEMES.find(t => t.id === id) ?? THEMES[0];
}
