import { describe, expect, it } from 'vitest'
import { clubConfig, roleDefinitions } from '../config/clubConfig'
import { cloneDefaultMeeting } from '../data/defaultMeeting'
import { generateAgenda } from './generateAgenda'
import { buildMinutesModel } from './generateMinutes'

describe('minutes generation', () => {
  it('maps meeting roles, speeches, and evaluators into the template structure', () => {
    const meeting = cloneDefaultMeeting()
    const model = buildMinutesModel(meeting, generateAgenda(meeting), clubConfig)

    expect(model.title).toContain(clubConfig.name)
    expect(model.sections).toHaveLength(8)
    expect(model.sections.find((section) => section.id === 'meeting-roles').bullets).toHaveLength(roleDefinitions.length)
    expect(model.sections.find((section) => section.id === 'prepared-speeches').bullets[0]).toMatchObject({
      lead: 'TM Arjun: ',
      text: '"Lessons from Failure" - Standard Speech.',
    })
    expect(model.sections.find((section) => section.id === 'evaluations').bullets[0]).toMatchObject({
      lead: 'TM Priya: ',
    })
  })

  it('omits club business and signature content requested for removal', () => {
    const meeting = cloneDefaultMeeting()
    const model = buildMinutesModel(meeting, generateAgenda(meeting), clubConfig)
    const serialized = JSON.stringify(model)

    expect(model.sections.map((section) => section.id)).not.toContain('club-business')
    expect(serialized).not.toMatch(/signature|President\s+Date|Secretary\s+Date/i)
    expect(serialized).not.toContain('Toastmasters logo')
  })

  it('does not mutate the meeting specification', () => {
    const meeting = cloneDefaultMeeting()
    const before = structuredClone(meeting)
    buildMinutesModel(meeting, generateAgenda(meeting), clubConfig)
    expect(meeting).toEqual(before)
  })
})
