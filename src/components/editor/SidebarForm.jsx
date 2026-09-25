import { FormField, SectionIntro } from './FormField'

function EntryFields({ title, value, nameKey, onChange }) {
  return (
    <fieldset className="nested-fieldset">
      <legend>{title}</legend>
      <div className="field-grid">
        <FormField label={title.replace(' of the Day', '')}>
          <input value={value[nameKey]} onChange={(event) => onChange(nameKey, event.target.value)} />
        </FormField>
        <FormField label="Meaning">
          <textarea rows="2" value={value.meaning} onChange={(event) => onChange('meaning', event.target.value)} />
        </FormField>
        <FormField label="Example">
          <textarea rows="2" value={value.example} onChange={(event) => onChange('example', event.target.value)} />
        </FormField>
      </div>
    </fieldset>
  )
}

export function SidebarForm({ value, onChange }) {
  return (
    <>
      <SectionIntro>Keep definitions concise so the left column stays readable.</SectionIntro>
      <EntryFields title="Word of the Day" nameKey="word" value={value.word} onChange={(field, next) => onChange('word', field, next)} />
      <EntryFields title="Idiom of the Day" nameKey="idiom" value={value.idiom} onChange={(field, next) => onChange('idiom', field, next)} />
    </>
  )
}
