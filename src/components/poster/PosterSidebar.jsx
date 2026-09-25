import { clubConfig } from '../../config/clubConfig'

function LanguageEntry({ label, title, meaning, example }) {
  return (
    <div className="language-entry">
      <h3>{label}</h3>
      <h4>{title || '—'}</h4>
      <p><strong>Meaning:</strong> {meaning || '—'}</p>
      <p><strong>Example:</strong> “{example || '—'}”</p>
    </div>
  )
}

export function PosterSidebar({ metadata, sidebar }) {
  return (
    <aside className="poster-sidebar" data-poster-sidebar>
      <div className="theme-card">
        <span>Theme of the Day</span>
        <strong>{metadata.theme}</strong>
      </div>
      <div className="language-card">
        <LanguageEntry label="Word of the Day" title={sidebar.word.word} meaning={sidebar.word.meaning} example={sidebar.word.example} />
        <LanguageEntry label="Idiom of the Day" title={sidebar.idiom.idiom} meaning={sidebar.idiom.meaning} example={sidebar.idiom.example} />
      </div>
      <div className="executive-card">
        <h3>Executive Committee</h3>
        <div className="executive-list">
          {clubConfig.executiveCommittee.map((member) => (
            <div key={member.position}>
              <span>{member.position}</span>
              <strong>{member.name}</strong>
            </div>
          ))}
        </div>
        <img className="club-qr" src={clubConfig.qrCodeUrl} alt="Club website QR code placeholder" />
      </div>
    </aside>
  )
}
