import { roleDefinitions } from '../../config/clubConfig'
import { FormField } from './FormField'

export function RoleCallForm({ value, onChange }) {
  return (
    <div className="field-grid two-columns">
      {roleDefinitions.map((role) => (
        <FormField key={role.key} label={role.label}>
          <input value={value[role.key] || ''} onChange={(event) => onChange(role.key, event.target.value)} />
        </FormField>
      ))}
    </div>
  )
}
