import { AgendaRow } from './AgendaRow'

export function AgendaSection({ section }) {
  return (
    <section className="agenda-section">
      {section.title && <h3>{section.title}</h3>}
      {section.rows.map((row) => <AgendaRow key={row.id} row={row} />)}
    </section>
  )
}
