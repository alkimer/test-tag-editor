import React, { useRef, useState } from 'react'
import useEditorStore from '../components/EditorCanvas/useEditorStore'
import LineChartCard from '../components/Charts/LineChartCard'
import PieChartCard from '../components/Charts/PieChartCard'
import exportReportPdf from '../components/Export/exportPdf'
import { useEditorExport } from '../components/EditorCanvas/useEditorExport'

export default function ReportPage() {
  const { imageUrl } = useEditorStore()
  const { getSnapshotPng } = useEditorExport()
  const chartRefs = useRef<HTMLElement[]>([])
  const [warning, setWarning] = useState<string | null>(null)

  const onExport = async () => {
    try {
      let editorPng: string | null = null
      try {
        editorPng = await getSnapshotPng(2)
      } catch (err) {
        console.warn('Could not capture editor snapshot', err)
        setWarning('Editor snapshot unavailable (CORS or no image)')
      }

      const chartEls = Array.from(document.querySelectorAll('.card')) as HTMLElement[]
      await exportReportPdf({ title: 'Informe', editorPng, chartElements: chartEls })
    } catch (err) {
      console.error(err)
      alert('Failed to export PDF')
    }
  }

  return (
    <div>
      <h2>Report Preview</h2>
      {warning && <div className="small-muted">{warning}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <div className="card">
          <h4>Editor snapshot</h4>
          {imageUrl ? <img src={imageUrl} alt="editor snapshot" style={{ maxWidth: '100%' }} /> : <div className="small-muted">No image uploaded</div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <LineChartCard />
          <PieChartCard />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={onExport}>Export PDF</button>
      </div>
    </div>
  )
}

