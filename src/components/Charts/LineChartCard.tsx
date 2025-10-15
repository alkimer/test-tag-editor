import React, { useRef } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { domToPng } from '../Export/domToPng'

const data = [
  { name: 'Jan', uv: 400 },
  { name: 'Feb', uv: 300 },
  { name: 'Mar', uv: 500 },
  { name: 'Apr', uv: 200 },
  { name: 'May', uv: 278 },
  { name: 'Jun', uv: 189 },
]

export default function LineChartCard() {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const exportPng = async () => {
    if (!wrapRef.current) return
    const dataUrl = await domToPng(wrapRef.current)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `linechart-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="card" ref={wrapRef} style={{ width: '100%', height: 300 }}>
      <h4>Sales (mock)</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 8 }}>
        <button onClick={exportPng}>Export chart as PNG</button>
      </div>
    </div>
  )
}

