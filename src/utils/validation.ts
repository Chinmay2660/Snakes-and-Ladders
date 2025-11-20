export const safeParseJson = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.warn('Invalid JSON payload', error)
    return undefined
  }
}

export const isValidPlayerName = (value: string) => value.trim().length >= 2

export const isValidColor = (value: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)

export const isValidImportPayload = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object'
