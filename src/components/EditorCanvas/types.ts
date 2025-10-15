export type Tag = {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  text: string
  bgColor: string
  textColor: string
  fontSize: number
  padding: number
  zIndex: number
}

export type EditorState = {
  imageUrl: string | null
  imageNaturalSize: { w: number; h: number } | null
  tags: Tag[]
  selectedIds: string[]
  zoom: number
  bgLocked: boolean
}

