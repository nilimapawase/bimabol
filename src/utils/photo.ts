export async function sha256ArrayBuffer(buf: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const MAX_PX = 1280

export async function processPhotoFile(
  file: File,
): Promise<{ blob: Blob; sha256: string }> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_PX / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob'))),
      'image/jpeg',
      0.85,
    )
  })
  const buf = await blob.arrayBuffer()
  const sha256 = await sha256ArrayBuffer(buf)
  return { blob, sha256 }
}