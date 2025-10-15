import React from 'react'
import EditorCanvas from '../components/EditorCanvas/EditorCanvas'
import CanvasToolbar from '../components/EditorCanvas/toolbar/CanvasToolbar'
import TagInspector from '../components/EditorCanvas/toolbar/TagInspector'

export default function EditorPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Editor</h2>
        <div className="toolbar">
          <CanvasToolbar />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <div style={{ flex: 1 }} className="canvas-wrap">
          <EditorCanvas />
        </div>
        <div style={{ width: 320 }}>
          <div className="card">
            <h4>Inspector</h4>
            <TagInspector />
          </div>
        </div>
      </div>
    </div>
  )
}

