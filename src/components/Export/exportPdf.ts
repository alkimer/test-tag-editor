import jsPDF from 'jspdf'
import domToPng from './domToPng'

type ExportReportArgs = {
  title?: string
  editorPng?: string | null
  chartElements?: HTMLElement[]
}

export async function exportReportPdf({ title = 'Informe', editorPng, chartElements = [] }: ExportReportArgs) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40

  // Page 1: Title + editor image
  doc.setFontSize(18)
  doc.text(title, margin, 60)
  doc.setFontSize(11)
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 80)

  if (editorPng) {
    // fit image width to page width minus margins
    const imgW = pageWidth - margin * 2
    const img = new Image()
    img.src = editorPng
    // draw image synchronously via addImage (it accepts data URL)
    doc.addImage(editorPng, 'PNG', margin, 100, imgW, imgW * 0.6)
  } else {
    doc.setFontSize(12)
    doc.text('No editor snapshot available', margin, 120)
  }

  // Page 2: Charts
  doc.addPage()
  doc.setFontSize(14)
  doc.text('Charts', margin, 50)
  let y = 80
  for (const el of chartElements) {
    try {
      const dataUrl = await domToPng(el, 2)
      const imgW = (pageWidth - margin * 2) / 2
      doc.addImage(dataUrl, 'PNG', margin, y, imgW, imgW * 0.6)
      // place side-by-side
      if (y === 80) {
        y = 80
        // second image to the right
        // continue
      }
      y += imgW * 0.6 + 16
    } catch (err) {
      console.warn('Failed to render chart to png', err)
    }
  }

  const filename = `informe-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`
  doc.save(filename)
}

export default exportReportPdf

