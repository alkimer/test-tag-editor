import React, { useRef } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { domToPng } from '../Export/domToPng'

const data = [
  { name: 'Direct', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Organic', value: 300 },
]
const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function PieChartCard() {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const exportPng = async () => {
    if (!wrapRef.current) return
    const dataUrl = await domToPng(wrapRef.current)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `piechart-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="card" ref={wrapRef} style={{ width: '100%', height: 300 }}>
      <h4>Traffic sources (mock)</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 8 }}>
        <button onClick={exportPng}>Export chart as PNG</button>
      </div>
    </div>
  )
}

