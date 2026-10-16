export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    300: '#d1d5db',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
  semantic: {
    success: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#047857',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#b91c1c',
    },
  },
  background: {
    default: '#ffffff',
    surface: '#f9fafb',
  },
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    disabled: '#9ca3af',
  },
} as const;