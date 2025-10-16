import { create } from 'zustand'
import { Tag, EditorState } from './types'

type Store = EditorState & {
  // refs
  stageRef?: any
  setStageRef?: (r: any) => void
  // actions
  setImage: (url: string | null, natural?: { w: number; h: number } | null) => void
  addTag: (tag: Partial<Tag>) => void
  resetDefaultTags: () => void
  updateTag: (id: string, patch: Partial<Tag>) => void
  removeSelected: () => void
  selectIds: (ids: string[]) => void
  clearSelection: () => void
  setZoom: (z: number) => void
  toggleBgLocked: () => void
  // undo/redo (simple stacks)
  undo: () => void
  redo: () => void
}

const defaultTag = (i = 0): Tag => ({
  id: `${Date.now()}-${i}`,
  x: 20 + i * 180,
  y: 20 + i * 80,
  width: 160,
  height: 60,
  rotation: 0,
  text: `Tag ${i + 1}`,
  bgColor: '#fffbdd',
  textColor: '#111827',
  fontSize: 16,
  padding: 8,
  zIndex: i,
})

export const useEditorStore = create<Store>((set, get) => ({
  imageUrl: null,
  imageNaturalSize: null,
  tags: [],
  selectedIds: [],
  zoom: 1,
  bgLocked: true,
  stageRef: undefined,

  setStageRef: (r: any) => set({ stageRef: r }),

  setImage: (url, natural = null) => {
    set({ imageUrl: url, imageNaturalSize: natural })
    // clear selection
    set({ selectedIds: [] })
  },

  addTag: (partial) => {
    const t = { ...defaultTag(get().tags.length), ...partial }
    set((s) => ({ tags: [...s.tags, t] }))
  },

  resetDefaultTags: () => {
    const tags = [0, 1, 2, 3].map((i) => defaultTag(i))
    set({ tags, selectedIds: [] })
  },

  updateTag: (id, patch) => {
    set((s) => ({ tags: s.tags.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  },

  removeSelected: () => {
    const ids = get().selectedIds
    if (!ids || ids.length === 0) return
    set((s) => ({ tags: s.tags.filter((t) => !ids.includes(t.id)), selectedIds: [] }))
  },

  selectIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  setZoom: (z) => set({ zoom: z }),
  toggleBgLocked: () => set((s) => ({ bgLocked: !s.bgLocked })),

  undo: () => {
    // simple no-op placeholder — can be extended
    console.warn('undo not implemented in this lightweight store')
  },
  redo: () => {
    console.warn('redo not implemented in this lightweight store')
  },
}))

export default useEditorStore

