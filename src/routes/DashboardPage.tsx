import React from 'react'
import LineChartCard from '../components/Charts/LineChartCard'
import PieChartCard from '../components/Charts/PieChartCard'
import exportReportPdf from '../components/Export/exportPdf'
import useEditorStore from '../components/EditorCanvas/useEditorStore'

export default function DashboardPage() {
  const editorPng = null // optionally could get snapshot

  const onExport = async () => {
    // For dashboard export include editor snapshot (if any)
    const chartEls = Array.from(document.querySelectorAll('.card')) as HTMLElement[]
    await exportReportPdf({ title: 'Dashboard Report', editorPng, chartElements: chartEls })
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <LineChartCard />
        <PieChartCard />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={onExport}>Export dashboard as PDF</button>
      </div>
    </div>
  )
}

