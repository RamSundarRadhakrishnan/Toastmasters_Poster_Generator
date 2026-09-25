import { toJpeg, toPng } from 'html-to-image'

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  downloadDataUrl(url, filename)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

async function prepareForCapture() {
  if (document.fonts?.ready) await document.fonts.ready
  await Promise.all([...document.images].filter((image) => !image.complete).map((image) => new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true })
    image.addEventListener('error', resolve, { once: true })
  })))
}

export async function exportPosterImage(element, filename, format = 'png') {
  await prepareForCapture()
  const options = {
    width: 1000,
    height: 1400,
    pixelRatio: 2.4,
    cacheBust: true,
    backgroundColor: '#56000f',
  }
  const dataUrl = format === 'jpeg'
    ? await toJpeg(element, { ...options, quality: 0.96 })
    : await toPng(element, options)
  downloadDataUrl(dataUrl, filename)
}

export function printPoster() {
  window.print()
}
