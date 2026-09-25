import { FormField, SectionIntro } from './FormField'

export function TableTopicsForm({ value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next })
  const addCustom = () => update('customRows', [
    ...value.customRows,
    { id: crypto.randomUUID(), agendaItem: 'Custom Table Topics row', duration: 2, speaker: '' },
  ])

  return (
    <>
      <SectionIntro>The main session receives the total time left after its subparts.</SectionIntro>
      <div className="field-grid two-columns">
        <FormField label="Total minutes"><input type="number" min="1" value={value.totalDuration} onChange={(event) => update('totalDuration', Number(event.target.value))} /></FormField>
        <FormField label="Round label / names"><input value={value.rounds} onChange={(event) => update('rounds', event.target.value)} /></FormField>
        <FormField label="Introduction minutes"><input type="number" min="0" value={value.introductionDuration} onChange={(event) => update('introductionDuration', Number(event.target.value))} /></FormField>
        <FormField label="Conclusion minutes"><input type="number" min="0" value={value.conclusionDuration} onChange={(event) => update('conclusionDuration', Number(event.target.value))} /></FormField>
      </div>
      <div className="repeat-list small-list">
        {value.customRows.map((row) => (
          <article className="repeat-card" key={row.id}>
            <div className="field-grid custom-row-grid">
              <FormField label="Agenda item"><input value={row.agendaItem} onChange={(event) => update('customRows', value.customRows.map((item) => item.id === row.id ? { ...item, agendaItem: event.target.value } : item))} /></FormField>
              <FormField label="Minutes"><input type="number" min="1" value={row.duration} onChange={(event) => update('customRows', value.customRows.map((item) => item.id === row.id ? { ...item, duration: Number(event.target.value) } : item))} /></FormField>
              <button type="button" className="icon-button" aria-label="Remove custom row" onClick={() => update('customRows', value.customRows.filter((item) => item.id !== row.id))}>×</button>
            </div>
          </article>
        ))}
        <button type="button" className="secondary-button" onClick={addCustom}>+ Add custom Table Topics row</button>
      </div>
    </>
  )
}
