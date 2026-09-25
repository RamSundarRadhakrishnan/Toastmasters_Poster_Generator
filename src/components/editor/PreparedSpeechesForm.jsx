import { SpeechEditor } from './SpeechEditor'

export function PreparedSpeechesForm({ value, onChange }) {
  const addSpeech = () => onChange([
    ...value,
    {
      id: `speech-${crypto.randomUUID()}`,
      speaker: '',
      title: '',
      type: 'Standard Speech',
      duration: 7,
      evaluator: '',
    },
  ])

  return (
    <div className="repeat-list">
      {value.length === 0 && <p className="empty-state">No prepared speeches. The agenda will skip this segment.</p>}
      {value.map((speech, index) => (
        <SpeechEditor
          key={speech.id}
          speech={speech}
          index={index}
          onChange={(next) => onChange(value.map((item) => item.id === speech.id ? next : item))}
          onRemove={() => onChange(value.filter((item) => item.id !== speech.id))}
        />
      ))}
      <button type="button" className="secondary-button" onClick={addSpeech}>+ Add prepared speech</button>
    </div>
  )
}
