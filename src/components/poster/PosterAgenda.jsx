import { AgendaRow } from './AgendaRow'
import { AgendaSection } from './AgendaSection'

export function PosterAgenda({ posterData }) {
  return (
    <main className="poster-agenda" data-poster-agenda>
      <div className="agenda-column-headings">
        <span>Time</span>
        <span>Span<br />(min)</span>
        <span>Agenda item</span>
        <span>Speaker</span>
      </div>
      {posterData.preMeeting && <div className="agenda-section pre-meeting-section"><AgendaRow row={posterData.preMeeting} highlighted /></div>}
      {posterData.agendaSections.map((section) => <AgendaSection key={section.id} section={section} />)}
    </main>
  )
}
