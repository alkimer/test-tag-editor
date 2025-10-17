import React from 'react'
import InteractiveMultiCurveChart from '../components/Charts/InteractiveMultiCurveChart'
import PieChartCard from '../components/Charts/PieChartCard'
import exportReportPdf from '../components/Export/exportPdf'

export default function DashboardPage() {
  const editorPng = null // optionally could get snapshot

  const onExport = async () => {
    // For dashboard export include editor snapshot (if any)
    const chartEls = Array.from(document.querySelectorAll('.card')) as HTMLElement[]
    await exportReportPdf({ title: 'Dashboard Report', editorPng, chartElements: chartEls })
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📊 Analytics Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <InteractiveMultiCurveChart />
        <PieChartCard />
      </div>
      <div style={{ marginTop: 20 }}>
        <button 
          onClick={onExport}
          style={{
            fontSize: '14px',
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          📄 Export Dashboard as PDF
        </button>
      </div>
    </div>
  )
}

