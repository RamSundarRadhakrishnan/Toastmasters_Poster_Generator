import { agendaTemplate } from '../config/agendaTemplate'
import { roleDefinitions } from '../config/clubConfig'
import { parseTime } from './calculateTimes'

function isPositive(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0
}

export function validateMeeting(specification, generatedAgenda = null) {
  const errors = []
  const warnings = []
  const { meeting, roles, preparedSpeeches, tableTopics, optionalRows } = specification || {}

  if (!meeting || !roles || !Array.isArray(preparedSpeeches) || !tableTopics || !Array.isArray(optionalRows)) {
    return { errors: ['The meeting data is missing required sections.'], warnings }
  }

  if (!String(meeting.number || '').trim()) errors.push('Meeting number is required.')
  if (!meeting.date) errors.push('Meeting date is required.')
  if (!meeting.theme?.trim()) errors.push('Theme of the Day is required.')

  const start = parseTime(meeting.startTime)
  const end = parseTime(meeting.endTime)
  if (start === null) errors.push('Meeting start time is invalid.')
  if (end === null) errors.push('Meeting end time is invalid.')
  if (start !== null && end !== null && end <= start) errors.push('Meeting end time must be after the start time.')

  roleDefinitions.filter((role) => role.required).forEach((role) => {
    if (!roles[role.key]?.trim()) errors.push(`${role.label} is required.`)
  })

  preparedSpeeches.forEach((speech, index) => {
    const label = `Prepared speech ${index + 1}`
    if (!speech.id) errors.push(`${label} needs a stable ID.`)
    if (!speech.speaker?.trim()) errors.push(`${label} needs a speaker.`)
    if (!speech.title?.trim()) errors.push(`${label} needs a title.`)
    if (!speech.evaluator?.trim()) errors.push(`${label} needs an evaluator.`)
    if (!isPositive(speech.duration)) errors.push(`${label} duration must be positive.`)
  })

  if (!isPositive(tableTopics.totalDuration)) errors.push('Table Topics total duration must be positive.')
  const allocatedSubparts = Number(tableTopics.introductionDuration || 0)
    + Number(tableTopics.conclusionDuration || 0)
    + (tableTopics.customRows || []).reduce((sum, row) => sum + Number(row.duration || 0), 0)
  if (Number(tableTopics.totalDuration) < allocatedSubparts) {
    errors.push('Table Topics total duration is smaller than its introduction, conclusion, and custom rows.')
  }
  ;(tableTopics.customRows || []).forEach((row, index) => {
    if (!row.agendaItem?.trim()) errors.push(`Table Topics custom row ${index + 1} needs a label.`)
    if (!isPositive(row.duration)) errors.push(`Table Topics custom row ${index + 1} duration must be positive.`)
  })
  optionalRows.filter((row) => row.enabled).forEach((row) => {
    if (!row.agendaItem?.trim()) errors.push('Every enabled optional row needs a label.')
    if (!isPositive(row.duration)) errors.push(`${row.agendaItem || 'Optional row'} duration must be positive.`)
  })

  if (generatedAgenda?.endComparison) {
    const difference = generatedAgenda.endComparison.differenceMinutes
    if (difference > 0) {
      warnings.push(`The generated agenda ends at ${generatedAgenda.calculatedEndTime}, which is ${difference} minute${difference === 1 ? '' : 's'} after the scheduled meeting close.`)
    } else if (difference <= -agendaTemplate.significantlyEarlyThreshold) {
      warnings.push(`The generated agenda ends at ${generatedAgenda.calculatedEndTime}, which is ${Math.abs(difference)} minutes before the scheduled meeting close.`)
    }
  }

  const duplicateRoleHolders = Object.values(roles).filter(Boolean).reduce((counts, name) => {
    counts[name] = (counts[name] || 0) + 1
    return counts
  }, {})
  const repeated = Object.entries(duplicateRoleHolders).filter(([, count]) => count > 1).map(([name]) => name)
  if (repeated.length) warnings.push(`${repeated.join(', ')} hold${repeated.length === 1 ? 's' : ''} more than one role.`)

  return { errors, warnings }
}

export function validateImportedMeeting(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, message: 'Imported JSON must be an object.' }
  const result = validateMeeting(value)
  return result.errors.length
    ? { valid: false, message: result.errors.join(' ') }
    : { valid: true, message: '' }
}
