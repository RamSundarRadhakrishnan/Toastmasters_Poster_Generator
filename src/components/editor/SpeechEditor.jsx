import { speechTypes } from '../../config/speechTypes'
import { FormField } from './FormField'

export function SpeechEditor({ speech, index, onChange, onRemove }) {
  const updateType = (typeLabel) => {
    const selected = speechTypes.find((type) => type.label === typeLabel)
    onChange({ ...speech, type: typeLabel, duration: selected?.defaultDuration ?? speech.duration })
  }

  return (
    <article className="repeat-card">
      <div className="repeat-card-header">
        <strong>Speech {index + 1}</strong>
        <button type="button" className="text-button danger" onClick={onRemove}>Remove</button>
      </div>
      <div className="field-grid two-columns">
        <FormField label="Speaker"><input value={speech.speaker} onChange={(event) => onChange({ ...speech, speaker: event.target.value })} /></FormField>
        <FormField label="Evaluator"><input value={speech.evaluator} onChange={(event) => onChange({ ...speech, evaluator: event.target.value })} /></FormField>
        <FormField label="Speech title" className="field-span"><input value={speech.title} onChange={(event) => onChange({ ...speech, title: event.target.value })} /></FormField>
        <FormField label="Speech / project type">
          <select value={speech.type} onChange={(event) => updateType(event.target.value)}>
            {speechTypes.map((type) => <option key={type.id}>{type.label}</option>)}
          </select>
        </FormField>
        <FormField label="Agenda minutes"><input type="number" min="1" value={speech.duration} onChange={(event) => onChange({ ...speech, duration: Number(event.target.value) })} /></FormField>
      </div>
    </article>
  )
}
