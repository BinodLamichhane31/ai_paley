import { saveAs } from 'file-saver'

export async function downloadCsv(url: string, filename: string) {
  const res = await fetch(url, { credentials: 'include' })
  const blob = await res.blob()
  saveAs(blob, filename)
}


