// exportImage.ts - convert Konva stage to PNG data URL
export async function stageToPng(stage: any, pixelRatio = 2): Promise<string> {
  if (!stage || !stage.toDataURL) throw new Error('Invalid stage')
  // Konva Stage toDataURL supports pixelRatio
  return stage.toDataURL({ pixelRatio })
}

export default stageToPng

