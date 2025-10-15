import html2canvas from 'html2canvas'

export async function domToPng(el: HTMLElement, scale = 2): Promise<string> {
  const canvas = await html2canvas(el, { useCORS: true, scale })
  return canvas.toDataURL('image/png')
}

export default domToPng

