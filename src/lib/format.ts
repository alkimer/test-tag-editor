// Small helpers for file naming and saving
export function filenameTimestamp(prefix = '') {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const s = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
  return `${prefix}${s}`
}

export function saveAs(dataUrl: string, filename?: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename || `${filenameTimestamp('file-')}.png`
  a.click()
}

export default saveAs

