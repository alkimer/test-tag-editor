import React, { useState, useRef, useCallback, useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { domToPng } from '../Export/domToPng'

// Gaussian interpolation function
const gaussianKernel = (distance: number, sigma: number = 2.0): number => {
  return Math.exp(-(distance * distance) / (2 * sigma * sigma))
}

const applyGaussianSmoothing = (data: number[], changedIndex: number, newValue: number, radius: number = 5): number[] => {
  const result = [...data]
  result[changedIndex] = newValue
  
  // Apply gaussian smoothing to neighbors
  for (let i = Math.max(0, changedIndex - radius); i <= Math.min(data.length - 1, changedIndex + radius); i++) {
    if (i === changedIndex) continue
    
    const distance = Math.abs(i - changedIndex)
    const weight = gaussianKernel(distance, 2.5)
    const oldValue = data[i]
    
    // Blend between old value and influence from changed point
    const influence = (newValue - data[changedIndex]) * weight * 0.25
    result[i] = Math.max(0, Math.min(200, oldValue + influence))
  }
  
  return result
}

// Generate initial mock data for 3 curves
const generateMockCurve = (seed: number, amplitude: number = 100, frequency: number = 0.1): number[] => {
  const data: number[] = []
  for (let i = 0; i < 100; i++) {
    const noise = (Math.sin(i * frequency + seed) + Math.sin(i * frequency * 2.3 + seed * 1.7)) * amplitude
    const trend = Math.sin(i * 0.05 + seed) * 30
    data.push(50 + noise + trend + (Math.random() - 0.5) * 20)
  }
  return data
}

interface CurveData {
  id: string
  name: string
  color: string
  data: number[]
}

export default function InteractiveMultiCurveChart() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [curves, setCurves] = useState<CurveData[]>([
    {
      id: 'curve1',
      name: 'Revenue 💰',
      color: '#8884d8',
      data: generateMockCurve(1, 80, 0.08)
    },
    {
      id: 'curve2', 
      name: 'Expenses 💸',
      color: '#82ca9d',
      data: generateMockCurve(2, 60, 0.12)
    },
    {
      id: 'curve3',
      name: 'Profit 📈',
      color: '#ffc658',
      data: generateMockCurve(3, 40, 0.15)
    }
  ])
  
  const [isDragging, setIsDragging] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<{
    curveId: string | null
    pointIndex: number | null
  }>({
    curveId: null,
    pointIndex: null
  })

  // Calculate statistics for each curve
  const curveStats = useMemo(() => {
    return curves.map(curve => {
      const data = curve.data
      const avg = data.reduce((sum, val) => sum + val, 0) / data.length
      const max = Math.max(...data)
      const min = Math.min(...data)
      return {
        id: curve.id,
        name: curve.name,
        color: curve.color,
        avg: avg.toFixed(1),
        max: max.toFixed(1),
        min: min.toFixed(1)
      }
    })
  }, [curves])

  // Convert curves data to recharts format
  const chartData = useMemo(() => {
    const result: any[] = []
    for (let i = 0; i < 100; i++) {
      const point: any = { index: i }
      curves.forEach(curve => {
        point[curve.id] = curve.data[i]
      })
      result.push(point)
    }
    return result
  }, [curves])

  // Handle clicking on chart points
  const handleChartClick = useCallback((data: any) => {
    if (data && data.activeLabel !== undefined) {
      // Find which curve was clicked based on mouse position
      // For simplicity, we'll select the first curve for now
      const pointIndex = Number(data.activeLabel)
      setSelectedPoint({
        curveId: curves[0].id,
        pointIndex
      })
      setIsDragging(true)
    }
  }, [curves])

  // Handle mouse movement for dragging
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !selectedPoint.curveId || selectedPoint.pointIndex === null) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const y = event.clientY - rect.top
    const chartHeight = 350
    const chartTop = 100
    
    const relativeY = Math.max(0, Math.min(1, (y - chartTop) / chartHeight))
    const newValue = Math.max(0, Math.min(200, (1 - relativeY) * 200))
    
    setCurves(prevCurves => 
      prevCurves.map(curve => {
        if (curve.id === selectedPoint.curveId) {
          const newData = applyGaussianSmoothing(
            curve.data,
            selectedPoint.pointIndex!,
            newValue,
            8
          )
          return { ...curve, data: newData }
        }
        return curve
      })
    )
  }, [isDragging, selectedPoint])

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    // Clear selection after a short delay
    setTimeout(() => {
      setSelectedPoint({
        curveId: null,
        pointIndex: null
      })
    }, 1000)
  }, [])

  const exportPng = async () => {
    if (!wrapRef.current) return
    const dataUrl = await domToPng(wrapRef.current)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `interactive-curves-${Date.now()}.png`
    a.click()
  }

  const resetCurves = () => {
    setCurves([
      {
        id: 'curve1',
        name: 'Revenue 💰',
        color: '#8884d8',
        data: generateMockCurve(1, 80, 0.08)
      },
      {
        id: 'curve2',
        name: 'Expenses 💸', 
        color: '#82ca9d',
        data: generateMockCurve(2, 60, 0.12)
      },
      {
        id: 'curve3',
        name: 'Profit 📈',
        color: '#ffc658',
        data: generateMockCurve(3, 40, 0.15)
      }
    ])
  }

  return (
    <div 
      className="card" 
      ref={wrapRef} 
      style={{ width: '100%', height: 600, cursor: isDragging ? 'grabbing' : 'default' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>📈 Interactive Multi-Curve Dashboard</h4>
      <p style={{ fontSize: '11px', color: '#666', margin: '0 0 12px 0', fontStyle: 'italic' }}>
        🖱️ Click on any point in the chart to select it and drag to modify curves • ✨ Gaussian smoothing applied automatically
      </p>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="index" 
            type="number" 
            domain={[0, 99]}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 200]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div style={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    padding: '8px',
                    fontSize: '12px'
                  }}>
                    <p>{`Point: ${label}`}</p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }}>
                        {`${curves.find(c => c.id === entry.dataKey)?.name}: ${entry.value?.toFixed(1)}`}
                      </p>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          
          {curves.map(curve => (
            <Line
              key={curve.id}
              type="monotone"
              dataKey={curve.id}
              stroke={curve.color}
              strokeWidth={4}
              dot={false}
              activeDot={{
                r: selectedPoint.curveId === curve.id ? 8 : 0,
                fill: curve.color,
                stroke: 'white',
                strokeWidth: 3,
                style: { 
                  cursor: 'grab',
                  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))'
                }
              }}
              name={curve.name}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <div style={{ marginTop: 12, display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button 
          onClick={exportPng} 
          style={{ 
            fontSize: '12px', 
            padding: '6px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📸 Export PNG
        </button>
        <button 
          onClick={resetCurves} 
          style={{ 
            fontSize: '12px', 
            padding: '6px 12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset Curves
        </button>
        <div style={{ 
          fontSize: '11px', 
          color: '#666', 
          backgroundColor: '#f8f9fa',
          padding: '4px 8px',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          📊 {curves.length} curves × 100 points each
        </div>
      </div>
      
      {/* Real-time Statistics */}
      <div style={{ marginTop: 16, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {curveStats.map(stat => (
          <div 
            key={stat.id}
            style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '8px 12px',
              minWidth: '120px',
              fontSize: '11px'
            }}
          >
            <div style={{ 
              fontWeight: 'bold', 
              color: stat.color,
              marginBottom: '4px',
              fontSize: '12px'
            }}>
              {stat.name}
            </div>
            <div style={{ color: '#666' }}>
              Avg: <strong>{stat.avg}</strong><br/>
              Max: <strong>{stat.max}</strong><br/>
              Min: <strong>{stat.min}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}