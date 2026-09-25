export function AgendaRow({ row, highlighted = false }) {
  return (
    <div className={`agenda-row ${highlighted ? 'agenda-row-highlighted' : ''}`}>
      <div className="agenda-time">{row.time}</div>
      <div className="agenda-duration">{row.duration}</div>
      <div className="agenda-item">
        <span>{row.agendaItem}</span>
        {row.detail && <small>{row.detail}</small>}
      </div>
      <div className="agenda-speaker">{row.speaker || '—'}</div>
    </div>
  )
}
