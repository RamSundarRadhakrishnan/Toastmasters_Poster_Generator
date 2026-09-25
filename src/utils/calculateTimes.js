export function parseTime(value) {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return null
  const [hours, minutes] = value.split(':').map(Number)
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

export function minutesToTime(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function formatTime(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`
}

export function calculateTimedRows(rows, startMinutes) {
  let cursor = startMinutes
  const timedRows = rows.map((row) => {
    const timedRow = { ...row, time: formatTime(cursor) }
    cursor += Number(row.duration)
    return timedRow
  })
  return { rows: timedRows, endMinutes: cursor }
}

export function formatMeetingDate(dateValue) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue || '')) return dateValue || ''
  const [year, month, day] = dateValue.split('-')
  return `${day}-${month}-${year}`
}

export function compareEndTimes(calculatedEndMinutes, scheduledEndTime) {
  const scheduled = parseTime(scheduledEndTime)
  if (scheduled === null) return null
  return {
    differenceMinutes: calculatedEndMinutes - scheduled,
    status: calculatedEndMinutes > scheduled ? 'late' : calculatedEndMinutes < scheduled ? 'early' : 'on-time',
  }
}
