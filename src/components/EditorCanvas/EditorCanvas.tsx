import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Group, Rect, Text, Transformer } from 'react-konva'
import useEditorStore from './useEditorStore'
import { Tag } from './types'

// Helper to load image element from URL
function useLoadedImage(url: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) {
      setImg(null)
      setError(null)
      return
    }
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      setImg(image)
      setError(null)
    }
    image.onerror = () => setError('Failed to load image (possible CORS issue)')
    image.src = url
    return () => {
      // no-op
    }
  }, [url])

  return { img, error }
}

export default function EditorCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<any>(null)
  const imageRef = useRef<any>(null)
  const trRef = useRef<any>(null)

  const {
    imageUrl,
    imageNaturalSize,
    tags,
    selectedIds,
    zoom,
    bgLocked,
    setStageRef,
    setImage,
    resetDefaultTags,
    updateTag,
    selectIds,
    clearSelection,
    setZoom,
  } = useEditorStore()

  const { img, error } = useLoadedImage(imageUrl)

  // provide stageRef to store for exports
  useEffect(() => {
    setStageRef(stageRef.current)
  }, [setStageRef])

  // on image load, set default tags if none
  useEffect(() => {
    if (img && tags.length === 0) {
      resetDefaultTags()
    }
  }, [img])

  // resize stage to container width while maintaining aspect ratio
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  useEffect(() => {
    function updateSize() {
      const container = containerRef.current
      if (!container) return
      const w = container.clientWidth
      const naturalW = imageNaturalSize?.w || img?.naturalWidth || 800
      const naturalH = imageNaturalSize?.h || img?.naturalHeight || 600
      const scale = w / naturalW
      setStageSize({ width: Math.round(naturalW * scale * zoom), height: Math.round(naturalH * scale * zoom) })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [containerRef.current, imageNaturalSize, img, zoom])

  useEffect(() => {
    if (trRef.current && selectedIds.length === 1) {
      const node = stageRef.current.findOne(`#${selectedIds[0]}`)
      if (node) {
        trRef.current.nodes([node])
        trRef.current.getLayer().batchDraw()
      }
    } else if (trRef.current) {
      trRef.current.nodes([])
      trRef.current.getLayer().batchDraw()
    }
  }, [selectedIds])

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        clearSelection()
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // remove selected
        const ids = useEditorStore.getState().selectedIds
        if (ids && ids.length > 0) {
          useEditorStore.getState().removeSelected()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // click stage to clear selection when clicking on empty space
  const onStageMouseDown = (e: any) => {
    // clicked on stage or background
    const clickedOnEmpty = e.target === e.target.getStage() || e.target === imageRef.current
    if (clickedOnEmpty) {
      clearSelection()
    }
  }

  const clampToImage = (x: number, y: number, width: number, height: number) => {
    const imgW = imageNaturalSize?.w || img?.naturalWidth || stageSize.width
    const imgH = imageNaturalSize?.h || img?.naturalHeight || stageSize.height
    const scale = stageSize.width / imgW
    const maxX = Math.max(0, stageSize.width - width * scale)
    const maxY = Math.max(0, stageSize.height - height * scale)
    return { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) }
  }

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {error && <div className="small-muted">{error}</div>}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={onStageMouseDown}
      >
        <Layer>
          {/* background image */}
          {img ? (
            <KonvaImage
              image={img}
              x={0}
              y={0}
              width={stageSize.width}
              height={stageSize.height}
              id="bg-image"
              listening={!bgLocked}
              ref={imageRef}
            />
          ) : (
            <Rect x={0} y={0} width={stageSize.width} height={stageSize.height} fill="#f3f4f6" />
          )}

          {/* tags */}
          {tags.map((tag: Tag) => {
            const scale = stageSize.width / (imageNaturalSize?.w || img?.naturalWidth || stageSize.width)
            return (
              <Group
                key={tag.id}
                id={tag.id}
                x={tag.x * scale}
                y={tag.y * scale}
                draggable
                onClick={(e) => {
                  selectIds([tag.id])
                  e.cancelBubble = true
                }}
                onDragEnd={(e) => {
                  const newX = e.target.x()
                  const newY = e.target.y()
                  const pos = clampToImage(newX, newY, tag.width, tag.height)
                  // convert back to original image coords
                  const invScale = 1 / (scale || 1)
                  updateTag(tag.id, { x: Math.round(pos.x * invScale), y: Math.round(pos.y * invScale) })
                }}
                onTransformEnd={(e) => {
                  const node = e.target
                  const scaleX = node.scaleX()
                  const scaleY = node.scaleY()
                  const newW = Math.max(20, Math.round(tag.width * scaleX))
                  const newH = Math.max(20, Math.round(tag.height * scaleY))
                  // reset scaling
                  node.scaleX(1)
                  node.scaleY(1)
                  const invScale = 1 / (scale || 1)
                  updateTag(tag.id, { width: Math.round(newW * invScale), height: Math.round(newH * invScale) })
                }}
              >
                <Rect
                  width={tag.width * scale}
                  height={tag.height * scale}
                  fill={tag.bgColor}
                  cornerRadius={8}
                />
                <Text
                  text={tag.text}
                  fontSize={tag.fontSize * scale}
                  padding={tag.padding * scale}
                  fill={tag.textColor}
                  width={tag.width * scale}
                  height={tag.height * scale}
                />
              </Group>
            )
          })}

          <Transformer ref={trRef} rotateEnabled={false} enabledAnchors={[ 'top-left','top-right','bottom-left','bottom-right' ]} />
        </Layer>
      </Stage>
    </div>
  )
}

