import { describe, expect, it } from 'vitest'
import { calculateTimedRows, compareEndTimes, formatTime, parseTime } from './calculateTimes'

describe('time utilities', () => {
  it('parses and formats times', () => {
    expect(parseTime('14:30')).toBe(870)
    expect(parseTime('24:00')).toBeNull()
    expect(formatTime(870)).toBe('2:30 PM')
    expect(formatTime(0)).toBe('12:00 AM')
  })

  it('calculates cumulative row start times without changing input', () => {
    const rows = [{ id: 'a', duration: 2 }, { id: 'b', duration: 5 }]
    const original = structuredClone(rows)
    const result = calculateTimedRows(rows, parseTime('14:30'))
    expect(result.rows.map((row) => row.time)).toEqual(['2:30 PM', '2:32 PM'])
    expect(result.endMinutes).toBe(parseTime('14:37'))
    expect(rows).toEqual(original)
  })

  it('compares calculated and scheduled end times', () => {
    expect(compareEndTimes(parseTime('16:21'), '16:15')).toEqual({ differenceMinutes: 6, status: 'late' })
    expect(compareEndTimes(parseTime('16:15'), '16:15').status).toBe('on-time')
  })
})
