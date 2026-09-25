import { clubConfig } from '../../config/clubConfig'

export function PosterFooter() {
  return (
    <footer className="poster-footer">
      <div><span>{clubConfig.footerText}</span><strong>{clubConfig.url.replace(/^https?:\/\//, '')}</strong></div>
    </footer>
  )
}
