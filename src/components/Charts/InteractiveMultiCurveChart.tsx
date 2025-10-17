import React, { useState, useRef, useCallback, useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend, CartesianGrid } from 'recharts'
import { domToPng } from '../Export/domToPng'

// Interpolation types
type InterpolationType = 'gaussian' | 'linear' | 'constant'

// Interpolation functions
const gaussianKernel = (distance: number, sigma: number = 2.0): number => {
  return Math.exp(-(distance * distance) / (2 * sigma * sigma))
}

const linearKernel = (distance: number): number => {
  return Math.max(0, 1 - distance)
}

const constantKernel = (distance: number, radius: number): number => {
  return distance <= radius ? 1 : 0
}

const applyInterpolation = (
  data: number[], 
  changedIndex: number, 
  newValue: number, 
  radius: number,
  interpolationType: InterpolationType
): number[] => {
  const result = [...data]
  result[changedIndex] = newValue
  
  // Apply interpolation to neighbors based on type
  for (let i = Math.max(0, changedIndex - radius); i <= Math.min(data.length - 1, changedIndex + radius); i++) {
    if (i === changedIndex) continue
    
    const distance = Math.abs(i - changedIndex)
    let weight = 0
    
    switch (interpolationType) {
      case 'gaussian':
        weight = gaussianKernel(distance, 2.5)
        break
      case 'linear':
        weight = linearKernel(distance / radius)
        break
      case 'constant':
        weight = constantKernel(distance, radius)
        break
    }
    
    const oldValue = data[i]
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
      name: 'Sensor 1 �',
      color: '#8884d8',
      data: generateMockCurve(1, 80, 0.08)
    },
    {
      id: 'curve2', 
      name: 'Sensor 2 �',
      color: '#82ca9d',
      data: generateMockCurve(2, 60, 0.12)
    },
    {
      id: 'curve3',
      name: 'Sensor 3 �',
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

  // Configuration states
  const [interpolationType, setInterpolationType] = useState<InterpolationType>('gaussian')
  const [interpolationRadius, setInterpolationRadius] = useState(8)
  const [showHoverPoints, setShowHoverPoints] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<{
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
          const newData = applyInterpolation(
            curve.data,
            selectedPoint.pointIndex!,
            newValue,
            interpolationRadius,
            interpolationType
          )
          return { ...curve, data: newData }
        }
        return curve
      })
    )
  }, [isDragging, selectedPoint, interpolationRadius, interpolationType])

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
        name: 'Sensor 1 �',
        color: '#8884d8',
        data: generateMockCurve(1, 80, 0.08)
      },
      {
        id: 'curve2',
        name: 'Sensor 2 �', 
        color: '#82ca9d',
        data: generateMockCurve(2, 60, 0.12)
      },
      {
        id: 'curve3',
        name: 'Sensor 3 �',
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
      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>� Interactive Sensor Dashboard</h4>
      <p style={{ fontSize: '11px', color: '#666', margin: '0 0 12px 0', fontStyle: 'italic' }}>
        🖱️ Hover over curves to see points • Click and drag to modify • Configurable interpolation
      </p>
      
      {/* Configuration Controls */}
      <div style={{ marginBottom: 16, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Interpolation:</label>
          <select 
            value={interpolationType}
            onChange={(e) => setInterpolationType(e.target.value as InterpolationType)}
            style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="gaussian">Gaussian</option>
            <option value="linear">Linear</option>
            <option value="constant">Constant</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Radius:</label>
          <input
            type="range"
            min="1"
            max="15"
            value={interpolationRadius}
            onChange={(e) => setInterpolationRadius(Number(e.target.value))}
            style={{ width: '80px' }}
          />
          <span style={{ fontSize: '11px', color: '#666' }}>{interpolationRadius}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={showHoverPoints}
              onChange={(e) => setShowHoverPoints(e.target.checked)}
            />
            Show hover points
          </label>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={handleChartClick}
          onMouseMove={(data) => {
            if (data && data.activeLabel !== undefined && showHoverPoints) {
              setHoveredPoint({
                curveId: null, // Will be determined by click
                pointIndex: Number(data.activeLabel)
              })
            }
          }}
          onMouseLeave={() => {
            setHoveredPoint({ curveId: null, pointIndex: null })
          }}
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
          <Legend />
          
          {curves.map(curve => (
            <Line
              key={curve.id}
              type="monotone"
              dataKey={curve.id}
              stroke={curve.color}
              strokeWidth={4}
              dot={false}
              activeDot={false}
              name={curve.name}
              connectNulls={false}
            />
          ))}
          
          {/* Custom hover/selected points */}
          {showHoverPoints && hoveredPoint.pointIndex !== null && (
            <g>
              {curves.map(curve => {
                const value = curve.data[hoveredPoint.pointIndex!]
                if (value === undefined) return null
                
                // Calculate position (simplified - would need proper scaling)
                const x = (hoveredPoint.pointIndex! / 99) * 100 // percentage
                const y = (1 - value / 200) * 100 // inverted percentage
                
                return (
                  <circle
                    key={`hover-${curve.id}`}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={6}
                    fill={curve.color}
                    stroke="white"
                    strokeWidth={2}
                    style={{ 
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      opacity: 0.7
                    }}
                    onClick={() => {
                      setSelectedPoint({
                        curveId: curve.id,
                        pointIndex: hoveredPoint.pointIndex
                      })
                      setIsDragging(true)
                    }}
                  />
                )
              })}
            </g>
          )}
          
          {/* Selected point */}
          {selectedPoint.curveId && selectedPoint.pointIndex !== null && (
            <g>
              {(() => {
                const curve = curves.find(c => c.id === selectedPoint.curveId)
                if (!curve) return null
                
                const value = curve.data[selectedPoint.pointIndex]
                if (value === undefined) return null
                
                // Calculate position (simplified)
                const x = (selectedPoint.pointIndex / 99) * 100
                const y = (1 - value / 200) * 100
                
                return (
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={8}
                    fill={curve.color}
                    stroke="white"
                    strokeWidth={3}
                    style={{ 
                      cursor: 'grab',
                      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))'
                    }}
                  />
                )
              })()}
            </g>
          )}
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