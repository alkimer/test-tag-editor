import useEditorStore from './useEditorStore'

// Hook to expose export helpers for the editor stage
export function useEditorExport() {
  const stage = useEditorStore.getState().stageRef

  async function getSnapshotPng(pixelRatio = 2): Promise<string> {
    if (!stage) throw new Error('Stage not available')
    // Konva stage's toDataURL
    return stage.toDataURL({ pixelRatio })
  }

  return { getSnapshotPng }
}

export default useEditorExport

