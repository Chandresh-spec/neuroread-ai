export const FONT_OPTIONS = [
  { id: 'inter', label: 'Inter', description: 'Clean everyday sans-serif' },
  {
    id: 'dyslexic',
    label: 'OpenDyslexic',
    description: 'Weighted bottoms for letter clarity',
    className: 'font-dyslexic',
  },
  {
    id: 'lexend',
    label: 'Lexend',
    description: 'Designed to reduce visual crowding',
    className: 'font-lexend',
  },
  {
    id: 'atkinson',
    label: 'Atkinson Hyperlegible',
    description: 'Distinct shapes for similar letters',
    className: 'font-atkinson',
  },
];

export const TEXT_SIZE_OPTIONS = [
  { value: -1, label: 'Small', scale: '92%' },
  { value: 0, label: 'Standard', scale: '100%' },
  { value: 1, label: 'Large', scale: '108%' },
  { value: 2, label: 'Larger', scale: '116%' },
  { value: 3, label: 'Extra large', scale: '124%' },
];

export const LINE_SPACING_OPTIONS = [
  { id: 'compact', label: 'Standard', value: 1.5 },
  { id: 'relaxed', label: 'Relaxed', value: 1.75 },
  { id: 'spacious', label: 'Spacious', value: 2.0 },
];

export const READER_THEME_OPTIONS = [
  { id: 'cream', label: 'Warm paper', swatch: '#F5F1EA', text: '#141416' },
  { id: 'sky', label: 'Sky blue', swatch: '#E8F1FA', text: '#0F172A' },
  { id: 'sage', label: 'Sage', swatch: '#E9F2EA', text: '#142619' },
  { id: 'dark', label: 'Dark', swatch: '#15171C', text: '#E5E7EB' },
  { id: 'contrast', label: 'High contrast', swatch: '#070908', text: '#FFFFFF' },
];

export const DEFAULT_AVATARS = [
  {
    id: 'botanical-sage',
    label: 'Sage botanical',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#E3ECE4"/><circle cx="80" cy="64" r="24" fill="#2F5947"/><path d="M40 138c6-24 22-36 40-36s34 12 40 36" fill="#2F5947"/><path d="M114 34c-8 10-8 22 0 30 8-8 8-20 0-30Z" fill="#7CA38D"/></svg>`
      ),
  },
  {
    id: 'indigo-reader',
    label: 'Indigo reader',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#E5E2F8"/><circle cx="80" cy="62" r="24" fill="#3B2FD6"/><path d="M38 138c6-24 23-36 42-36s36 12 42 36" fill="#3B2FD6"/><rect x="58" y="108" width="44" height="24" rx="4" fill="#F9F7F2"/></svg>`
      ),
  },
  {
    id: 'terracotta-warm',
    label: 'Warm terracotta',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#F5E1D6"/><circle cx="80" cy="62" r="24" fill="#9E4A29"/><path d="M38 138c6-24 23-36 42-36s36 12 42 36" fill="#9E4A29"/></svg>`
      ),
  },
  {
    id: 'slate-calm',
    label: 'Calm slate',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#E5EAF0"/><circle cx="80" cy="62" r="24" fill="#334155"/><path d="M38 138c6-24 23-36 42-36s36 12 42 36" fill="#334155"/></svg>`
      ),
  },
  {
    id: 'sand-minimal',
    label: 'Warm sand',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#EFEAE0"/><circle cx="80" cy="62" r="24" fill="#524E48"/><path d="M38 138c6-24 23-36 42-36s36 12 42 36" fill="#524E48"/></svg>`
      ),
  },
  {
    id: 'ochre-sun',
    label: 'Soft ochre',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#F3EAD4"/><circle cx="80" cy="62" r="24" fill="#7D5A1C"/><path d="M38 138c6-24 23-36 42-36s36 12 42 36" fill="#7D5A1C"/></svg>`
      ),
  },
];

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Derive up to two uppercase initials from a display name.
 */
export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Build a concise, plain-language summary of active reading preferences.
 */
export function formatAccessibilitySummary({
  fontMode = 'inter',
  textSize = 0,
  lineSpacing = 'relaxed',
  readerTheme = 'cream',
  focusMode = false,
}) {
  const fontLabels = {
    inter: 'Inter font',
    dyslexic: 'Dyslexia font',
    lexend: 'Lexend font',
    atkinson: 'Atkinson font',
  };
  const sizeLabels = {
    '-1': 'small text',
    0: 'standard text',
    1: 'large text',
    2: 'larger text',
    3: 'extra large text',
  };
  const parts = [
    fontLabels[fontMode] || 'Inter font',
    sizeLabels[String(textSize)] || 'standard text',
  ];
  if (lineSpacing === 'spacious') {
    parts.push('spacious spacing');
  }
  if (focusMode) {
    parts.push('focus mode');
  } else if (readerTheme && readerTheme !== 'cream') {
    const themeObj = READER_THEME_OPTIONS.find((t) => t.id === readerTheme);
    if (themeObj) parts.push(`${themeObj.label.toLowerCase()} theme`);
  }
  return parts.join(', ');
}

/**
 * Validates an uploaded image file against allowed types and 5 MB limit.
 */
export function validateAvatarFile(file) {
  if (!file) return 'Please choose an image file.';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please choose a JPG, PNG, or WebP image.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'That image is larger than 5 MB. Please choose a smaller file.';
  }
  return null;
}

export function validateDisplayName(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'Please enter a display name.';
  if (trimmed.length < 2) return 'Display name must be at least 2 characters.';
  if (trimmed.length > 40) return 'Display name must be 40 characters or fewer.';
  return '';
}

export function validateEmail(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'Please enter an email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return '';
}
