// Use a dynamic import so we can present a clearer error if the package is missing
export async function domToPng(el: HTMLElement, scale = 2): Promise<string> {
  let html2canvas: any
  try {
    // dynamic import so the bundler/runtime will fail with a clear message if it's not installed
    const mod = await import('html2canvas')
    // html2canvas exports a default function
    html2canvas = (mod && (mod.default || mod))
  } catch (err) {
    throw new Error(
      "html2canvas is not installed or failed to load. Please run `npm install html2canvas` and restart the dev server."
    )
  }

  const canvas = await html2canvas(el, { useCORS: true, scale })
  return canvas.toDataURL('image/png')
}

export default domToPng
