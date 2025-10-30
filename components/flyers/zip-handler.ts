// ZIP file handler for bulk imports
import JSZip from "jszip"

export interface ZipFileEntry {
  name: string
  data: ArrayBuffer
  type: string
}

export async function extractZipFiles(zipFile: File): Promise<ZipFileEntry[]> {
  const zip = new JSZip()
  const contents = await zip.loadAsync(zipFile)

  const files: ZipFileEntry[] = []

  for (const [filename, file] of Object.entries(contents.files)) {
    if (!file.dir) {
      const data = await file.async("arraybuffer")
      const type = getFileType(filename)

      if (type === "image" || type === "csv") {
        files.push({
          name: filename,
          data,
          type,
        })
      }
    }
  }

  return files
}

function getFileType(filename: string): "image" | "csv" | "unknown" {
  const ext = filename.split(".").pop()?.toLowerCase()

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) {
    return "image"
  }
  if (ext === "csv") {
    return "csv"
  }
  return "unknown"
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
