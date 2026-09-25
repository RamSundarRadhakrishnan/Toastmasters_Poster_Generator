import { FormField } from './FormField'

export function MeetingDetailsForm({ value, onChange }) {
  return (
    <div className="field-grid two-columns">
      <FormField label="Meeting number">
        <input type="number" min="1" value={value.number} onChange={(event) => onChange('number', event.target.value)} />
      </FormField>
      <FormField label="Date">
        <input type="date" value={value.date} onChange={(event) => onChange('date', event.target.value)} />
      </FormField>
      <FormField label="Starts">
        <input type="time" value={value.startTime} onChange={(event) => onChange('startTime', event.target.value)} />
      </FormField>
      <FormField label="Scheduled close">
        <input type="time" value={value.endTime} onChange={(event) => onChange('endTime', event.target.value)} />
      </FormField>
      <FormField label="Theme of the Day" className="field-span">
        <input value={value.theme} onChange={(event) => onChange('theme', event.target.value)} />
      </FormField>
    </div>
  )
}
