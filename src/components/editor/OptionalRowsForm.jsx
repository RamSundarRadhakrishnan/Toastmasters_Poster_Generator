import { FormField } from './FormField'

export function OptionalRowsForm({ value, onChange }) {
  const update = (id, patch) => onChange(value.map((row) => row.id === id ? { ...row, ...patch } : row))
  const addRow = () => onChange([...value, {
    id: `optional-${crypto.randomUUID()}`,
    enabled: true,
    agendaItem: 'Custom agenda item',
    duration: 3,
    speaker: '',
  }])

  return (
    <div className="repeat-list small-list">
      {value.map((row) => (
        <article className="repeat-card optional-row" key={row.id}>
          <label className="toggle-row">
            <input type="checkbox" checked={row.enabled} onChange={(event) => update(row.id, { enabled: event.target.checked })} />
            <span>Include this row</span>
          </label>
          <div className="field-grid optional-grid">
            <FormField label="Agenda item"><input value={row.agendaItem} onChange={(event) => update(row.id, { agendaItem: event.target.value })} /></FormField>
            <FormField label="Speaker"><input value={row.speaker} onChange={(event) => update(row.id, { speaker: event.target.value })} /></FormField>
            <FormField label="Min"><input type="number" min="1" value={row.duration} onChange={(event) => update(row.id, { duration: Number(event.target.value) })} /></FormField>
          </div>
        </article>
      ))}
      <button type="button" className="secondary-button" onClick={addRow}>+ Add optional row</button>
    </div>
  )
}
