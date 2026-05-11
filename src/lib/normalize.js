export function normalizeKey(value) {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
}

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function cleanValue(value) {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseCapacity(value) {
  const cleaned = cleanValue(value).replace(/,/g, '')
  if (!cleaned) return null

  const parsed = Number.parseInt(cleaned, 10)
  return Number.isFinite(parsed) ? parsed : null
}

export function isAffirmative(value) {
  const normalized = normalizeText(value)
  return normalized === 'si' || normalized === 'sí' || normalized === 's'
}
