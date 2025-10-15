import React from 'react'
import useEditorStore from '../useEditorStore'

export default function TagInspector() {
  const { selectedIds, tags, updateTag } = useEditorStore()
  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null
  const tag = tags.find((t) => t.id === selectedId) || null

  if (!tag) {
    return <div className="small-muted">Select a single tag to edit its properties.</div>
  }

  return (
    <div>
      <label>
        Text
        <input
          value={tag.text}
          onChange={(e) => updateTag(tag.id, { text: e.target.value })}
          style={{ width: '100%' }}
        />
      </label>
      <label>
        Background color
        <input
          type="color"
          value={tag.bgColor}
          onChange={(e) => updateTag(tag.id, { bgColor: e.target.value })}
        />
      </label>
      <label>
        Text color
        <input type="color" value={tag.textColor} onChange={(e) => updateTag(tag.id, { textColor: e.target.value })} />
      </label>
      <label>
        Font size
        <input type="number" value={tag.fontSize} onChange={(e) => updateTag(tag.id, { fontSize: Number(e.target.value) })} />
      </label>
      <label>
        Padding
        <input type="number" value={tag.padding} onChange={(e) => updateTag(tag.id, { padding: Number(e.target.value) })} />
      </label>
      <label>
        Width
        <input type="number" value={tag.width} onChange={(e) => updateTag(tag.id, { width: Number(e.target.value) })} />
      </label>
      <label>
        Height
        <input type="number" value={tag.height} onChange={(e) => updateTag(tag.id, { height: Number(e.target.value) })} />
      </label>
    </div>
  )
}

