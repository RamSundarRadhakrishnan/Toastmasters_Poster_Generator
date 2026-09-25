import { agendaTemplate } from '../config/agendaTemplate'
import { calculateTimedRows, compareEndTimes, formatMeetingDate, formatTime, parseTime } from '../utils/calculateTimes'

function resolveTemplateRows(rows, roles) {
  return rows.map((row) => ({
    ...row,
    speaker: row.speaker ?? roles[row.speakerRole] ?? '',
  }))
}

function createSpeechRows(speeches) {
  return speeches.map((speech) => ({
    id: `prepared-${speech.id}`,
    duration: Number(speech.duration),
    agendaItem: speech.title,
    detail: speech.type,
    speaker: speech.speaker,
  }))
}

function createEvaluationRows(speeches) {
  return speeches.map((speech) => ({
    id: `evaluation-${speech.id}`,
    duration: agendaTemplate.defaultEvaluationDuration,
    agendaItem: `Evaluation: ${speech.title}`,
    detail: `For ${speech.speaker}`,
    speaker: speech.evaluator,
  }))
}

function createTableTopicsRows(tableTopics, roles) {
  const intro = Number(tableTopics.introductionDuration || 0)
  const conclusion = Number(tableTopics.conclusionDuration || 0)
  const customRows = (tableTopics.customRows || []).map((row) => ({ ...row, duration: Number(row.duration) }))
  const customDuration = customRows.reduce((sum, row) => sum + row.duration, 0)
  const mainDuration = Number(tableTopics.totalDuration) - intro - conclusion - customDuration
  const rows = []

  if (intro > 0) rows.push({ id: 'topics-introduction', duration: intro, agendaItem: 'Table Topics introduction', speaker: roles.tableTopicsMaster })
  if (mainDuration > 0) rows.push({ id: 'topics-session', duration: mainDuration, agendaItem: tableTopics.rounds || 'Table Topics session', speaker: roles.tableTopicsMaster })
  customRows.forEach((row) => rows.push({ id: `topics-${row.id}`, duration: row.duration, agendaItem: row.agendaItem, speaker: row.speaker || roles.tableTopicsMaster }))
  if (conclusion > 0) rows.push({ id: 'topics-conclusion', duration: conclusion, agendaItem: 'Table Topics conclusion', speaker: roles.tableTopicsMaster })
  return rows
}

export function chooseDensity(agendaSections, sidebar) {
  const rowCount = agendaSections.reduce((count, section) => count + section.rows.length, 0)
  const sidebarLength = JSON.stringify(sidebar).length
  if (rowCount > 31 || sidebarLength > 900) return 'dense'
  if (rowCount > 25 || sidebarLength > 650) return 'compact'
  return 'comfortable'
}

export function generateAgenda(meetingSpecification) {
  const specification = structuredClone(meetingSpecification)
  const startMinutes = parseTime(specification.meeting.startTime)
  if (startMinutes === null) throw new Error('Meeting start time is invalid.')

  const opening = agendaTemplate.sections.opening
  const rolePlayers = agendaTemplate.sections.rolePlayers
  const evaluations = agendaTemplate.sections.evaluations
  const sectionDefinitions = [
    { id: opening.id, title: opening.title, rows: resolveTemplateRows(opening.rows, specification.roles) },
    { id: rolePlayers.id, title: rolePlayers.title, rows: resolveTemplateRows(rolePlayers.rows, specification.roles) },
  ]

  if (specification.preparedSpeeches.length > 0) {
    sectionDefinitions.push({ id: 'prepared-speeches', title: 'Prepared Speeches', rows: createSpeechRows(specification.preparedSpeeches) })
  }

  sectionDefinitions.push({
    id: 'table-topics',
    title: 'Table Topics Segment',
    rows: createTableTopicsRows(specification.tableTopics, specification.roles),
  })

  const evaluationRows = [
    ...resolveTemplateRows(evaluations.beforeSpeechEvaluations, specification.roles),
    ...createEvaluationRows(specification.preparedSpeeches),
    ...resolveTemplateRows(evaluations.afterSpeechEvaluations, specification.roles),
    ...specification.optionalRows.filter((row) => row.enabled).map((row) => ({
      id: row.id,
      duration: Number(row.duration),
      agendaItem: row.agendaItem,
      speaker: row.speaker === 'Presiding Officer' ? specification.roles.presidingOfficer : row.speaker,
    })),
    ...resolveTemplateRows([evaluations.close], specification.roles),
  ]
  sectionDefinitions.push({ id: evaluations.id, title: evaluations.title, rows: evaluationRows })

  let cursor = startMinutes
  const agendaSections = sectionDefinitions.map((section) => {
    const timed = calculateTimedRows(section.rows, cursor)
    cursor = timed.endMinutes
    return { ...section, rows: timed.rows }
  })

  const preMeeting = agendaTemplate.preMeeting.enabled
    ? calculateTimedRows([
        {
          ...agendaTemplate.preMeeting,
          speaker: specification.roles[agendaTemplate.preMeeting.speakerRole],
        },
      ], startMinutes - agendaTemplate.preMeeting.duration).rows[0]
    : null

  const endComparison = compareEndTimes(cursor, specification.meeting.endTime)
  const result = {
    posterMetadata: {
      meetingNumber: specification.meeting.number,
      date: formatMeetingDate(specification.meeting.date),
      timeLabel: `${formatTime(startMinutes)} to ${formatTime(parseTime(specification.meeting.endTime))}`,
      theme: specification.meeting.theme,
    },
    sidebar: specification.sidebar,
    preMeeting,
    agendaSections,
    calculatedEndTime: formatTime(cursor),
    calculatedEndMinutes: cursor,
    endComparison,
  }
  result.density = chooseDensity(agendaSections, specification.sidebar)
  return result
}
