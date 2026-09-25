import { clubConfig } from '../../config/clubConfig'

export function PosterHeader({ metadata }) {
  return (
    <>
      <header className="poster-header">
        <img className="club-logo" src={clubConfig.logoUrl} alt="Toastmasters International" />
        <div className="club-heading">
          <h1>{clubConfig.name}</h1>
          <p>Club No. {clubConfig.clubNumber} <span>•</span> Area {clubConfig.area} <span>•</span> Division {clubConfig.division} <span>•</span> District {clubConfig.district}</p>
        </div>
      </header>
      <div className="meeting-strip">
        <strong>Date: {metadata.date}</strong>
        <strong>Time: {metadata.timeLabel} <span>({clubConfig.timezoneLabel})</span></strong>
        <strong>Meeting no. #{metadata.meetingNumber}</strong>
      </div>
    </>
  )
}
