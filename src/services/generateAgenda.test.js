import { describe, expect, it } from 'vitest'
import { cloneDefaultMeeting } from '../data/defaultMeeting'
import { generateAgenda } from './generateAgenda'

function evaluationRows(result) {
  return result.agendaSections.find((section) => section.id === 'evaluations').rows.filter((row) => row.id.startsWith('evaluation-'))
}

describe('generateAgenda', () => {
  it('supports no prepared speeches', () => {
    const meeting = cloneDefaultMeeting()
    meeting.preparedSpeeches = []
    const result = generateAgenda(meeting)
    expect(result.agendaSections.find((section) => section.id === 'prepared-speeches')).toBeUndefined()
    expect(evaluationRows(result)).toHaveLength(0)
  })

  it('creates one matching evaluation for one speech', () => {
    const meeting = cloneDefaultMeeting()
    meeting.preparedSpeeches = [meeting.preparedSpeeches[0]]
    const result = generateAgenda(meeting)
    expect(result.agendaSections.find((section) => section.id === 'prepared-speeches').rows).toHaveLength(1)
    expect(evaluationRows(result)).toEqual([
      expect.objectContaining({ id: 'evaluation-speech-1', speaker: 'TM Priya', duration: 3 }),
    ])
  })

  it('creates exactly one evaluator-mapped row per speech', () => {
    const meeting = cloneDefaultMeeting()
    const result = generateAgenda(meeting)
    expect(evaluationRows(result)).toHaveLength(2)
    expect(evaluationRows(result).map((row) => row.speaker)).toEqual(['TM Priya', 'TM Felix'])
  })

  it('uses exactly the declared Table Topics total', () => {
    const meeting = cloneDefaultMeeting()
    meeting.tableTopics = {
      totalDuration: 25,
      introductionDuration: 2,
      conclusionDuration: 2,
      rounds: 'Round one',
      customRows: [{ id: 'round-two', agendaItem: 'Round two', duration: 6, speaker: 'TM Guest' }],
    }
    const result = generateAgenda(meeting)
    const rows = result.agendaSections.find((section) => section.id === 'table-topics').rows
    expect(rows.reduce((sum, row) => sum + row.duration, 0)).toBe(25)
  })

  it('includes only enabled optional rows', () => {
    const meeting = cloneDefaultMeeting()
    const result = generateAgenda(meeting)
    const ids = result.agendaSections.flatMap((section) => section.rows.map((row) => row.id))
    expect(ids).toContain('optional-polls')
    expect(ids).not.toContain('optional-area-director')
  })

  it('does not mutate the original meeting specification', () => {
    const meeting = cloneDefaultMeeting()
    const original = structuredClone(meeting)
    generateAgenda(meeting)
    expect(meeting).toEqual(original)
  })
})
