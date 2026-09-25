export async function exportMeetingMinutes(meeting, posterData, filename) {
  const [{ Packer }, { createMinutesDocument }] = await Promise.all([
    import('docx'),
    import('../services/createMinutesDocument'),
  ])
  const document = createMinutesDocument(meeting, posterData)
  const blob = await Packer.toBlob(document)
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
