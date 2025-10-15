import React, { useRef } from 'react'
import useEditorStore from '../useEditorStore'
import { stageToPng } from '../../Export/exportImage'
import { saveAs } from '../../lib/format'

export default function CanvasToolbar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { setImage, imageUrl, resetDefaultTags, bgLocked, toggleBgLocked, setZoom, tags } = useEditorStore()

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    const img = new Image()
    img.onload = () => {
      setImage(url, { w: img.naturalWidth, h: img.naturalHeight })
    }
    img.onerror = () => {
      setImage(url, null)
    }
    img.src = url
  }

  const doExport = async () => {
    const stage = useEditorStore.getState().stageRef
    if (!stage) {
      alert('No stage available')
      return
    }
    try {
      const dataUrl = await stageToPng(stage, 3)
      saveAs(dataUrl, `editor-${Date.now()}.png`)
    } catch (err) {
      console.error(err)
      alert('Failed to export image')
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onUpload} />
      <button onClick={() => resetDefaultTags()}>Reset 4 Tags</button>
      <button onClick={() => toggleBgLocked()}>{bgLocked ? 'Unlock bg' : 'Lock bg'}</button>
      <button onClick={() => setZoom(Math.max(0.25, useEditorStore.getState().zoom - 0.25))}>Zoom -</button>
      <button onClick={() => setZoom(useEditorStore.getState().zoom + 0.25)}>Zoom +</button>
      <button onClick={doExport} disabled={!imageUrl || tags.length === 0}>Export PNG</button>
    </div>
  )
}

